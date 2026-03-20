# AGENTS.md

## Cursor Cloud specific instructions

### Project structure

Single Next.js 14 application located in `/workspace/humnexa/`. Not a monorepo.

### Running the app

- `npm run dev` (from `humnexa/`) starts the dev server on http://localhost:3000
- The public landing page (`/`) works without any external services or API keys
- Protected routes (`/chat`, `/settings`, etc.) require Supabase credentials

### Linting

- ESLint 8 + `eslint-config-next@14` are installed as dev dependencies
- Run `npm run lint` from `humnexa/`
- There are pre-existing lint warnings (React hook deps) and one error (`react/no-children-prop` in `src/lib/utils/markdown.tsx`)

### Building

- `npm run build` from `humnexa/` — builds successfully with empty env vars

### Environment variables

- Copy `.env.example` to `.env.local` and fill in values
- The app gracefully handles missing Supabase/Groq keys: middleware returns `session: null`, public pages still render
- Required for full functionality: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`
- See `.env.example` for the full list

### Without external secrets

When no Supabase or Groq credentials are configured:
- The public landing page (`/`), `/login`, `/signup`, `/pricing` all render normally
- The `/api/inquiry` endpoint works fully (no external deps)
- Protected routes (`/chat`, `/settings`, etc.) redirect to `/login`
- AI chat responses will not work (Groq key required)
- The hello-world verification for this setup is submitting the beverage inquiry form on the homepage, which exercises a client-side form + server-side API route round-trip

### Key gotchas

- The `next lint` command prompts interactively if no `.eslintrc.json` exists. The repo now includes one with `{"extends":"next/core-web-vitals"}`.
- ESLint must be v8 (not v9) for compatibility with Next.js 14's lint integration. `eslint-config-next` must match the Next.js major version (14).
- The lockfile is `package-lock.json` — use **npm**, not pnpm/yarn.
