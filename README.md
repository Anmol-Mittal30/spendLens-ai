# SpendLens AI

SpendLens AI is a free AI spend audit platform designed for startup founders, CTOs, engineering managers, and indie developers who want to understand whether they are overspending on AI tools like ChatGPT, Claude, Cursor, Copilot, Gemini, and API usage.

The platform analyzes a team's AI stack, evaluates plan fit, identifies overlapping subscriptions, estimates monthly + annual savings opportunities, and generates a shareable audit report with personalized recommendations and lead-capture flows for Credex.

---

## Live Demo

https://spend-lens-ai.vercel.app/

---

## Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Audit Form
![Audit Form](./screenshots/audit-form.png)

### Audit Results — Savings Overview
![Audit Results 1](./screenshots/auditresult-1.png)

### Audit Results — Detailed Recommendations
![Audit Results 2](./screenshots/auditresult-2.png)

### Shareable Public Report
![Shareable Report](./screenshots/shareable-report.png)

---

## Features

- AI tool spend audit for startup teams
- Deterministic recommendation engine
- Plan-fit analysis and downgrade suggestions
- Monthly + annual savings estimation
- Personalized AI-generated audit summary
- Public shareable audit URLs
- Lead capture with Supabase storage
- Transactional email support using Resend
- Persistent form state across reloads
- Lightweight abuse protection
- Responsive mobile-friendly UI

---

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Resend
- Vercel
- Vitest

---

## Quick Start

Clone the repository:

```bash
git clone https://github.com/Anmol-Mittal30/spendLens-ai
cd spendLens-ai
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=SpendLens AI <onboarding@resend.dev>

LEAD_TO_EMAIL=mittalanmol0309@gmail.com
```

Anthropic integration is optional and the app falls back to deterministic summaries if API credentials are unavailable.

---

## Deployment

The project is deployed on Vercel.

Production deployment steps:

```bash
npm run build
```

Add environment variables in Vercel dashboard and redeploy after updating `NEXT_PUBLIC_APP_URL`.

---

## Decisions & Trade-offs

### 1. Deterministic audit logic instead of full AI recommendations
The savings engine uses rule-based logic instead of LLM-generated financial advice because pricing recommendations need predictable and defensible outputs.

### 2. AI used only for personalization
LLM generation is limited to personalized summaries. The core savings calculations stay deterministic to avoid hallucinated pricing recommendations.

### 3. Public share URLs without sensitive data
Shareable reports intentionally exclude email addresses and company-identifying details to support viral sharing safely.

### 4. Lightweight backend stack
Supabase and Resend were chosen because they provide a fast production-ready backend setup suitable for a startup MVP without excessive infrastructure complexity.

### 5. Graceful API fallback handling
The app continues functioning even if AI generation fails or API credentials are missing, preventing broken audits during deployment or rate-limit failures.

### 6. Minimal abuse protection
A honeypot field and lightweight rate-limiting strategy were used instead of heavy CAPTCHA flows to reduce friction for legitimate users.

---

## Test & CI

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

GitHub Actions automatically runs linting and tests on pushes to `main`.

---

## Project Structure

```text
app/                → Next.js App Router pages
lib/                → Audit engine + helpers
tests/              → Audit engine tests
screenshots/        → README screenshots
.github/workflows/  → CI workflow
```

---

## Future Improvements

- Benchmark-based spend comparison across startup sizes
- PDF export for audit reports
- Multi-user workspace support
- Historical spend tracking
- Smarter recommendation confidence scoring
- Real-time pricing sync from vendor APIs