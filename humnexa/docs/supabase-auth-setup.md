# Supabase Auth Setup (Humnexa)

## 1) Email/Password Auth

Email provider is enabled by default in Supabase.

1. Open Supabase Dashboard -> **Authentication** -> **Providers**
2. Ensure **Email** provider is ON
3. For MVP, disable mandatory email verification:
   - Authentication -> **Settings**
   - Turn OFF **Enable email confirmations**

This allows users to sign up and use chat immediately.

## 2) Google OAuth Setup

1. Open <https://console.cloud.google.com>
2. Create/select project: **Humnexa AI**
3. Go to **APIs & Services -> Credentials**
4. Create credentials -> **OAuth Client ID**
5. Application type: **Web application**
6. Name: `Humnexa AI`

### Authorized JavaScript origins

- `http://localhost:3000`
- `https://humnexa.vercel.app` (after deployment)
- `https://humnexa.com` (when custom domain is ready)

### Authorized redirect URIs

- `http://localhost:3000/api/auth/callback`
- `https://ucykjehgyqohpzyhfkws.supabase.co/auth/v1/callback`
- `https://humnexa.vercel.app/api/auth/callback`

7. Copy Google Client ID + Client Secret
8. In Supabase Dashboard -> Authentication -> Providers -> **Google**
   - Enable Google
   - Paste client ID + secret
   - Save

## 3) Callback route behavior (implemented)

`src/app/api/auth/callback/route.ts`:

- Exchanges `code` with Supabase session
- Redirects to `/chat` on success
- Redirects to `/login?error=auth_failed` on failure
