import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');
const env = {};

if (fs.existsSync(envPath)) {
  const file = fs.readFileSync(envPath, 'utf8');
  for (const line of file.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
}

const port = Number(process.env.PORT || env.PORT || 3001);
const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
const cerebrasKey = process.env.CEREBRAS_API_KEY || env.CEREBRAS_API_KEY;
const MAX_PROMPT_LENGTH = 1200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const requestCounts = new Map();
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((value) => value.trim()).filter(Boolean));

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const getFallbackAnswer = () => 'Every animal has a role in nature. Protecting habitats, water, and food chains helps the whole ecosystem stay healthy.';

const parseGeminiAnswer = (payload) => {
  const rawAnswer = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  return rawAnswer ? String(rawAnswer).replace(/\s+/g, ' ').trim() : getFallbackAnswer();
};

const parseCerebrasAnswer = (payload) => {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    return content.map((item) => (typeof item?.text === 'string' ? item.text : '')).filter(Boolean).join(' ');
  }
  return getFallbackAnswer();
};

const callGemini = async (prompt) => {
  if (!geminiKey) return null;

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`);
  }

  const data = await response.json();
  return parseGeminiAnswer(data);
};

const callCerebras = async (prompt) => {
  if (!cerebrasKey) return null;

  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cerebrasKey}`,
    },
    body: JSON.stringify({
      model: 'llama3.1-8b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 220,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cerebras error: ${response.status}`);
  }

  const data = await response.json();
  return parseCerebrasAnswer(data);
};

const server = http.createServer(async (req, res) => {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ status: 'ok', service: 'wildquest-ranger' }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/ranger') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const clientIp = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = requestCounts.get(clientIp);
  if (recent && now - recent.startedAt < RATE_LIMIT_WINDOW_MS && recent.count >= RATE_LIMIT_MAX) {
    res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
    res.end(JSON.stringify({ error: 'Too many questions. Please wait a minute and try again.' }));
    return;
  }
  if (!recent || now - recent.startedAt >= RATE_LIMIT_WINDOW_MS) requestCounts.set(clientIp, { startedAt: now, count: 1 });
  else recent.count += 1;

  let body = '';
  let bodySize = 0;
  req.on('data', (chunk) => {
    bodySize += chunk.length;
    if (bodySize > 8_192) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request is too large.' }));
      req.destroy();
      return;
    }
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const { prompt } = JSON.parse(body || '{}');

      if (!prompt || typeof prompt !== 'string' || prompt.length > MAX_PROMPT_LENGTH) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `A prompt of 1 to ${MAX_PROMPT_LENGTH} characters is required.` }));
        return;
      }

      const wildlifePrompt = `You are Ranger Amini, a friendly wildlife ranger in Kenya. Help children and families learn about animals, ecosystems, and conservation. Answer only about wildlife, habitats, food chains, climate, or conservation in nature. Keep responses clear, warm, and easy to understand for ages 8-15. Use 2 to 4 short sentences, no robotic wording, and no vague filler. If the question is unrelated to wildlife or nature, gently redirect it back to animals and the environment. User question: ${prompt}`;

      let answer = null;
      if (geminiKey) {
        try {
          answer = await callGemini(wildlifePrompt);
        } catch (error) {
          console.warn('Gemini request failed, trying Cerebras fallback:', error.message);
        }
      }

      if (!answer && cerebrasKey) {
        try {
          answer = await callCerebras(wildlifePrompt);
        } catch (error) {
          console.warn('Cerebras request failed, using static fallback:', error.message);
        }
      }

      if (!answer) {
        answer = getFallbackAnswer();
      }

      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify({ answer }));
    } catch (error) {
      console.error('Ranger request failed:', error);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        answer: getFallbackAnswer(),
      }));
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`WildQuest API running on http://localhost:${port}`);
});
