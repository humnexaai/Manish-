# AGENTS.md

## Cursor Cloud specific instructions

### Project layout

Single Next.js 14.2 app located in `humnexa/`. All commands should be run from that directory.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Check env vars | `npm run check:env` |

### ESLint setup

The repo ships without an `.eslintrc.json`. Running `next lint` for the first time triggers an interactive prompt. To avoid that, ensure `eslint` (v8) and `eslint-config-next@14.2.35` are installed as devDependencies and an `.eslintrc.json` with `{"extends": "next/core-web-vitals"}` exists in `humnexa/`. ESLint v9 is **not** compatible with Next.js 14.2.

### Environment variables

Copy `.env.example` to `.env.local`. Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase project credentials. The middleware handles missing creds gracefully (returns `session: null`), but client-side components throw without them. Placeholder values allow the dev server and build to start; public pages (landing, pricing, login, signup) render normally.
- `GROQ_API_KEY` – Required only for `/api/chat` AI responses. Without a real key, chat will error at runtime but the rest of the app works.
- `SUPABASE_SERVICE_ROLE_KEY` – Only used by `scripts/setup-db.ts`.

### External service dependencies

- **Supabase** (hosted): Auth + DB. Without real credentials, auth flows (signup/login) will fail against the Supabase API, but the app still compiles and public pages load.
- **Groq API**: AI chat provider. Without a real key, all other pages still work.

### No automated test suite

The project has no test framework (jest, vitest, etc.) configured. `npm run lint` and `npm run build` are the main code-quality checks.

### Hello-world scope without secrets

With placeholder env vars (no real Supabase/Groq keys), the following works end-to-end:

- All public pages render: `/`, `/pricing`, `/login`, `/signup`
- Signup form client-side validation (password strength meter, terms checkbox toast)
- Middleware correctly redirects unauthenticated access to protected routes (e.g. `/chat` → `/login?next=%2Fchat`)

Auth flows (actual signup/login) and AI chat require real `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GROQ_API_KEY`.
