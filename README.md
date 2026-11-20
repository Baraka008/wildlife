# WildQuest

WildQuest is a playful wildlife learning app for children, built around Kenyan animals, habitats, food chains and conservation.

## Features
- Interactive animal library and conservation challenges
- Progress, achievements and ecosystem learning activities
- Ranger Amini question-and-answer service with optional Gemini/Cerebras providers
- Responsive, animated React interface

## Requirements
- Node.js 20 or newer
- Optional: Gemini or Cerebras API key for AI-generated answers

## Local development

Install dependencies once:

```bash
npm ci
```

Run the frontend in terminal 1:

```bash
npm run dev
```

Run the Ranger API in terminal 2:

```bash
npm run dev:api
```

The Vite development server proxies `/api` requests to the Ranger API on port 3001. The API can run without provider keys and returns a safe educational fallback response.

Copy `.env.example` to `.env` and add provider keys only on the server. Never place provider keys in frontend source code.

## Production deployment

The frontend is a static Vite build and can be deployed to Vercel. The Ranger API is a persistent Node HTTP service and should be deployed separately to Render or Railway.

- Frontend build command: `npm ci && npm run build`
- Frontend output directory: `dist`
- Backend start command: `npm start`
- Backend health endpoint: `GET /health`
- Backend secrets: `GEMINI_API_KEY`, `CEREBRAS_API_KEY`
- Backend port: read from `PORT` (defaults to 3001)

Set the frontend API base/proxy for the deployed backend before launch. Do not deploy the long-running API as a static Vercel build.

## Verification

`npm run build` runs TypeScript project checks and creates the production Vite bundle.
