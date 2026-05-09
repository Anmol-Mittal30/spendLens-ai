# SpendLens AI

SpendLens AI is a free AI spend audit tool for startup founders, CTOs, and engineering managers who want a second opinion on their AI tool stack before paying another monthly invoice. It collects tool, plan, seat, spend, team-size, and use-case inputs, then returns an instant public audit with plan-fit recommendations, savings math, and Credex consultation routing for high-savings cases.

**Deployed URL:** Replace with your Vercel URL after deployment.

## Screenshots

Add three screenshots after running locally or deploying:

- Home + spend input form
- Audit result hero with monthly and annual savings
- Public share URL page with Open Graph preview

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=SpendLens AI <onboarding@resend.dev>
LEAD_TO_EMAIL=founders@credex.rocks
```

Deploy on Vercel, add the same environment variables, and set `NEXT_PUBLIC_APP_URL` to the live URL.

## Decisions

1. I used Next.js App Router because the product needs a form app, API routes, dynamic public audit URLs, and Open Graph metadata in one deployable unit.
2. I kept the audit math deterministic instead of LLM-driven because finance recommendations need traceable rules and predictable numbers.
3. I used LLM generation only for the personalized summary, with a deterministic fallback so API failures never block the audit.
4. I made share URLs encode a public, stripped audit result so no email or company name is exposed in the viral loop.
5. I used Supabase and Resend behind environment variables because they are fast to wire up for a real backend and transactional email without committing secrets.
6. I chose honeypot plus in-memory rate limiting as lightweight abuse protection for a take-home MVP.

## Test and CI

```bash
npm run lint
npm test
npm run build
```
