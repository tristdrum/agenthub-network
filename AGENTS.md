# AGENTS.md

## Product guardrails

- The live frontend is the Vite/Base44 site in `src/`.
- The Mintlify docs site lives in `/docs` and is customer-facing.
- Do not replace or redesign the marketing site unless the new result is visually and behaviorally identical to production first.
- When in doubt, compare local against `https://agenthub.network` before signoff.

## Technical guardrails

- Frontend entrypoint is `src/main.jsx`.
- Mintlify config lives at `docs/docs.json` and the Mintlify content lives under `docs/`.
- PostHog boots from `src/lib/analytics.js`.
- Environment variables belong in `.env.local` and are documented in `.env.example`.
- Prefer incremental changes over framework swaps.

## Required checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Deployment notes

- Vercel is still configured around the Vite app at repo root.
- Any new analytics or client env var must be added to local `.env.local` and to Vercel development, preview, and production environments.

## Collaboration rule

- If a requested change risks breaking parity with the live marketing site, stop and verify against production before continuing.
- Keep docs copy external and customer-centric unless the user explicitly asks for internal operator documentation.
