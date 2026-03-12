# Deploy Humnexa to Vercel — Step by Step

## 1) Push latest code to GitHub

```bash
git add .
git commit -m "feat: complete MVP - ready for deployment"
git push origin main
```

## 2) Import in Vercel

1. Go to <https://vercel.com/new>
2. Click **Import Git Repository**
3. Select your repo
4. Framework: **Next.js**
5. Root directory:
   - `humnexa` if monorepo/subdirectory
   - `./` if this is repo root

## 3) Add Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

| Key | Value | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ucykjehgyqohpzyhfkws.supabase.co` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `...` | Supabase -> Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | `...` | Supabase -> Settings -> API |
| `GROQ_API_KEY` | `gsk_...` | Groq console |
| `NEXT_PUBLIC_APP_URL` | `https://humnexa.vercel.app` (or assigned URL) | Vercel |
| `NEXT_PUBLIC_APP_NAME` | `Humnexa` | Static |
| `RAZORPAY_KEY_ID` | optional | Razorpay |
| `RAZORPAY_KEY_SECRET` | optional | Razorpay |
| `RESEND_API_KEY` | optional | Resend |

## 4) Deploy

Click **Deploy**. Build usually takes 1-2 minutes.

## 5) Supabase URL Configuration

In Supabase -> Authentication -> URL Configuration:

- Site URL: `https://humnexa.vercel.app` (or actual assigned URL)
- Redirect URLs: add `https://humnexa.vercel.app/api/auth/callback`

## 6) Google OAuth redirect updates

Add:

- `https://humnexa.vercel.app/api/auth/callback`
- `https://ucykjehgyqohpzyhfkws.supabase.co/auth/v1/callback`

## 7) Verify live

- `/` loads
- signup/login works
- `/chat` loads after auth
- streaming chat works
- conversations persist in sidebar
