# Humnexa

Hindi-first AI workspace built with Next.js + Supabase.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional: AI model provider for /api/chat
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
# Optional custom provider base URL (OpenAI-compatible)
# OPENAI_BASE_URL=https://api.openai.com/v1
```

If `OPENAI_API_KEY` is missing, chat still works with a local fallback response.

## Current app state

- Auth: email/password + Google OAuth via Supabase
- Protected app shell with chat and settings
- Chat conversations/messages persisted to Supabase (best-effort)
- `/api/chat` server route for model responses
