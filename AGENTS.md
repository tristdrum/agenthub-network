# Rules

- KISS first: choose the simplest change that satisfies the product need and keep the system easy to reason about.
- Prefer incremental changes over framework swaps.
- Preserve parity with the live marketing site unless the user explicitly asks for a deliberate redesign.
- Conventional commits only.
- No lint errors.

## Product Guardrails

- The live frontend is the Vite site in `src/`.
- The Mintlify docs site lives in `/docs` and is customer-facing.
- Do not replace or redesign the marketing site unless the new result is visually and behaviorally identical to production first.
- When in doubt, compare local against `https://agenthub.network` before signoff.

## Technical Guardrails

- Frontend entrypoint is `src/main.jsx`.
- Mintlify config lives at `docs/docs.json` and the Mintlify content lives under `docs/`.
- PostHog boots from `src/lib/analytics.js`.
- Environment variables belong in `.env.local` and are documented in `.env.example`.
- Keep auth and data wiring simple, explicit, and repo-local before adding abstraction.

## Required Checks

- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Deployment Notes

- Vercel is still configured around the Vite app at repo root.
- Any new analytics or client env var must be added to local `.env.local` and to Vercel development, preview, and production environments.

## Collaboration

- If a requested change risks breaking parity with the live marketing site, stop and verify against production before continuing.
- Keep docs copy external and customer-centric unless the user explicitly asks for internal operator documentation.
- Fix the underlying system when repo friction blocks progress instead of papering over the immediate symptom.
