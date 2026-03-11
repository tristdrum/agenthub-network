# AgentHub Network

This repo currently runs the original Vite/Base44 frontend that matches production at `agenthub.network`.

That is the rule for now: preserve the live Vite UX and iterate behind it. Do not replace the frontend framework unless the replacement is visually and behaviorally identical first.

The repo also contains a customer-facing Mintlify docs project in `docs/`. Mintlify should be configured in monorepo mode with the docs path set to `/docs`.

## Current shape

- Frontend: Vite + React
- Docs: Mintlify project in `docs/`
- Routing/layout: Base44-generated marketing and app shell
- Primary local entrypoint: `npm run dev`
- Production analytics: PostHog client-side analytics, session recording, and exception capture

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Set the required values:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-base44-backend.base44.app
VITE_POSTHOG_KEY=phc_Lf3ULcziK39bq7qlwnDwRQSc4esJuAHjDe1CH2UU7K0
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

4. Start the app:

```bash
npm run dev
```

The local Vite app runs on `http://localhost:5173`.

## Quality gates

Available commands:

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check`

Docs notes:

- Mintlify config file: `docs/docs.json`
- Customer-facing docs content: `docs/*.mdx`
- Keep docs copy product-facing unless explicitly writing internal docs

Pre-commit:

- `husky` runs `lint-staged`
- staged JS/JSX files get `eslint --fix` and `prettier --write`
- full `typecheck` runs before commit

CI:

- GitHub Actions runs `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build`

## Analytics

PostHog is initialized from `src/lib/analytics.js` and booted in `src/main.jsx`.

Enabled behaviors:

- pageview tracking
- pageleave tracking
- session recording
- client-side exception capture

If `VITE_POSTHOG_KEY` is unset, PostHog stays disabled locally.

## Working rules

- The Vite marketing site is the current source of truth for frontend UX.
- Match production before making visual claims.
- Keep major backend/control-plane work parallel to the existing frontend instead of rewriting the site shell first.
