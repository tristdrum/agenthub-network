# Contributing

Thanks for contributing to AgentHub Network.

## Before you start

- Read [AGENTS.md](./AGENTS.md) for repo-specific guardrails.
- Keep changes small, direct, and easy to review.
- Prefer fixing underlying friction over adding one-off workarounds.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

If your change touches the Vercel functions as well as the frontend, use:

```bash
vercel dev
```

## Required checks

Run these before opening a PR:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Docs parity

If you change docs content, keep the website docs experience and the mirrored `docs/` project aligned in the same change unless there is a deliberate short-lived exception.

## Pull requests

- Use a clear title.
- Explain the user-visible change.
- Call out any env var additions or deploy steps.
- Include screenshots for marketing or UX changes when helpful.

## Scope guidance

Good contributions:

- product polish
- docs improvements
- bug fixes
- small, well-scoped UX improvements
- test and guardrail improvements

Avoid broad rewrites unless the payoff is immediate and easy to verify.
