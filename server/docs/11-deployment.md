# 11 — Deployment

## Prerequisites

- Node.js 20+
- A Supabase project (Postgres + Storage)
- An environment with Node package install access

## 1. Supabase Setup

1. Create a project in the Supabase dashboard.
2. Copy:
   - `DATABASE_URL` (Postgres connection string, from project settings → Database)
   - `SUPABASE_URL` (project URL)
   - `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (project settings → API)
3. Create a `media` bucket (private) in Storage. Add a public-read policy if `public-media` is used.

## 2. Environment

Copy `.env.example` → `.env` and fill values:

```env
NODE_ENV=production
PORT=4000
APP_URL=https://api.yourdomain.com
CLIENT_URL=https://admin.yourdomain.com

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

JWT_ACCESS_SECRET=<64+ random chars>
JWT_REFRESH_SECRET=<64+ random chars>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

STORAGE_BUCKET=media
STORAGE_PUBLIC_URL=https://xxx.supabase.co/storage/v1/object/public/media

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
DONATION_MAX_AMOUNT=1000000

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

> Generate secrets with `openssl rand -hex 32` or equivalent. Never commit `.env`.

## 3. Database

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init   # local dev
npx prisma db seed                   # master admin + 3 orgs + site template
```

For production use `prisma migrate deploy` against `DATABASE_URL`.

## 4. Build & Run

```bash
npm run build
npm start            # node dist/index.js
```

Recommended host: Render / Railway / Fly.io / VPS. Enable health check at `/health`.

## 5. CORS / Proxy

- Set `CLIENT_URL` to the admin panel origin. `APP_URL` is used for links in emails/notifications.
- Behind a reverse proxy, trust proxy headers (`app.set('trust proxy', 1)`) so rate limiting sees the real client IP.

## 6. Rollout Checklist

- [ ] Secrets generated and in host env
- [ ] Migrations applied
- [ ] Seed run once
- [ ] Health check passes
- [ ] Upload a test media file
- [ ] Login as master, create a test org + user
- [ ] `GET /api/v1/site/:slug` returns the seeded page/section tree

## 7. Vercel (serverless)

The repo ships a serverless entry point. Set the **Root Directory** to `server`
in the Vercel project, then push to GitHub (or run `vercel` from `server/`).

Deploy config already in place:

- `api/index.ts` — exports the Express app as a serverless function.
- `vercel.json` — rewrites every path to `/api/index` (the app still serves
  everything under `/api/v1`).
- `vercel-build` — `prisma generate && npm run build`.

Environment variables (all the same as section 2), plus:

- `DATABASE_URL` — use the Supabase **pooler** URL (port `6543`) so serverless
  cold starts share a connection pool. Keep `DIRECT_URL` for migrations.
- `CLIENT_URL` — comma-separated list of allowed origins (admin panel, frontends).

Database migrations are applied against `DIRECT_URL` before/at first deploy
(`npx prisma db push` or `prisma migrate deploy`); there is no long-running
process to run them inside Vercel.

Timeouts: the default function limit is 60s (`maxDuration` is set). The UCS
`import`/`verify` endpoints make outbound requests and should fit within it for
typical NGO static sites. Upgrade to a paid plan for up to 300s if crawls grow.

Verify after deploy:

```bash
curl https://<your-app>.vercel.app/health
curl https://<your-app>.vercel.app/api/v1/site/<slug>
```

