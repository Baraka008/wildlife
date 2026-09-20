type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const fallbackAnswers: Record<string, string> = {
  elephant: 'Elephants help spread seeds, shape habitats, and create paths that support many other animals and plants.',
  lion: 'Lions help keep herbivore numbers balanced, which protects grasslands and helps the whole food web stay healthy.',
  forest: 'Forests provide shelter, food, clean air, and water for wildlife and people, so protecting them helps everyone.',
  habitat: 'A habitat is a home for plants and animals, with food, water, shelter, and space to live and raise young.',
  bird: 'Birds spread seeds, pollinate flowers, and help control insect numbers, so they are important to many ecosystems.',
  water: 'Clean water keeps habitats healthy, supports plants, and gives animals the resources they need to survive.',
  default: 'The Ranger is temporarily rate-limited by the AI service. Please try again in a moment, and the chatbot will answer your wildlife question shortly.',
};

export const askRangerAI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/ranger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Ranger API unavailable');
    }

    const data = (await response.json()) as { answer?: string };
    if (data.answer) {
      return data.answer;
    }

    return fallbackAnswers.default;
  } catch {
    const normalized = prompt.toLowerCase();
    const matchedKey = Object.keys(fallbackAnswers).find((key) =>
      key !== 'default' && normalized.includes(key)
    );

    return matchedKey ? fallbackAnswers[matchedKey] : fallbackAnswers.default;
  }
};
