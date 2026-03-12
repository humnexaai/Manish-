# Database Setup Instructions

## Option 1: Automated (try first)

```bash
npm run db:setup
```

The setup script first tries RPC/REST SQL execution automatically.  
If your Supabase project does not expose `exec_sql`, use manual options below.

## Option 2: Manual (recommended fallback)

1. Go to: <https://supabase.com/dashboard/project/ucykjehgyqohpzyhfkws/sql/new>
2. Open `humnexa-db-schema.sql` (full 29-table schema) from this repo.
3. Copy the entire SQL content.
4. Paste into Supabase SQL Editor.
5. Click **Run**.
6. You should see success responses.
7. Verify in Table Editor that core tables exist (`users`/`profiles`, `conversations`, `messages`, etc.).

### If full schema is too large right now

Use `scripts/schema-mvp.sql` first. It creates only the minimum chat/auth tables:

- `users` (with `handle_new_user` trigger)
- `user_preferences`
- `conversations`
- `messages`
- `usage_logs`
- `system_config`

Then run full schema later.

## Option 3: Via Supabase CLI

```bash
npx supabase db push --db-url postgresql://postgres:[YOUR-DB-PASSWORD]@db.ucykjehgyqohpzyhfkws.supabase.co:5432/postgres
```
