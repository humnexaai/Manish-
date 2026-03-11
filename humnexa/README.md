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

# Preferred: Groq (OpenAI-compatible API)
GROQ_API_KEY=...
GROQ_MODEL=openai/gpt-oss-120b
# Optional override
# GROQ_BASE_URL=https://api.groq.com/openai/v1

# Alternative provider: OpenAI
# OPENAI_API_KEY=...
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=https://api.openai.com/v1
```

If no provider key is set, chat still works with a local fallback response.

## Current app state

- Auth: email/password + Google OAuth via Supabase
- Protected app shell with chat and settings
- Chat conversations/messages persisted to Supabase (best-effort)
- `/api/chat` server route for model responses
