# AgentHub Network Repo Guide

## Purpose

Build and operate the public AgentHub Network product.

Why this exists:

- AgentHub Network gives operators a hosted way to run autonomous agents against real work.
- The product needs a clear public story, a reliable app surface, and docs that stay accurate as the system changes.
- This repo is expected to receive frequent agent-made changes from worktrees. The system must stay easy to reason about and hard to degrade.

## Operating Principles

- Keep it simple. Choose the smallest change that solves the real product need.
- Do not repeat yourself. Remove duplicate rules, duplicate docs, and duplicate logic when practical.
- Fix the system, not just the symptom. If friction keeps recurring, improve the guardrail.
- Prefer incremental changes over rewrites.
- Preserve parity with the live marketing site unless a deliberate redesign is requested.
- Customer-facing docs stay customer-facing. Internal operator notes belong elsewhere.
- Conventional commits only.
- No lint errors.

## Current Product Shape

- The live frontend is the Vite app in `src/`.
- The website's canonical docs experience is the Vite app route at `/docs`.
- Mintlify remains in `docs/` as a maintained mirror of the same customer docs.
- Vercel is configured around the Vite app at the repo root.
- PostHog boots from `src/lib/analytics.js`.
- Environment variables belong in `.env.local` and must be documented in `.env.example`.

## Repo Map

- `src/`: production Vite frontend, including the logged-out marketing surface and logged-in app pages
- `src/main.jsx`: frontend entrypoint
- `src/content/docs-content.js`: shared docs source used by the website docs page and Mintlify sync
- `src/pages/Docs.jsx`: website docs surface served at `/docs`
- `src/pages.config.js`: page registry used by the current router setup
- `src/lib/`: app wiring, auth helpers, analytics bootstrap, and data access helpers
- `docs/`: Mintlify config and mirrored customer-facing documentation content
- `docs/docs.json`: Mintlify config
- `tests/`: lightweight repo-level tests
- `.github/workflows/`: CI and deployment automation
- `.husky/`: local git hooks

## Docs Rules

- The website should point users to the Vite app route at `/docs`, not directly to the Mintlify deployment.
- Keep the Vite docs experience and the Mintlify docs content in sync.
- Use `src/content/docs-content.js` as the shared docs source and `npm run docs:sync` to update Mintlify files.
- When docs content changes, update both surfaces in the same change unless there is a deliberate temporary exception.
- Treat drift between `src/pages/Docs.jsx` and `docs/` as a bug.
- Before changing the docs stack, have a concrete reason beyond preference and preserve current customer value first.

## Routing And Naming

- Keep user-facing URLs intentional and stable.
- The current route layer is page-name driven from `src/pages.config.js`; treat route changes as product changes, not refactors.
- If you change naming conventions, do it deliberately and preserve backwards compatibility where needed.

## Agent Workflow

- Expect concurrent work from multiple agents using git worktrees.
- Make changes that are easy to review, easy to rebase, and easy to verify independently.
- Avoid hidden coupling and broad refactors unless they pay for themselves immediately.
- When a guardrail is missing, add it in-repo so the next agent benefits automatically.

## Safety And Quality

- Required local checks:
  - `npm run test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Do not merge or hand off broken checks.
- Keep pre-commit and CI aligned with the required checks.
- Prefer fast automated checks locally and full verification in CI.

## Deployment Notes

- Any new analytics or client env var must be added to `.env.example`.
- Any new analytics or client env var must also be added in Vercel development, preview, and production environments.
- When in doubt, compare against `https://agenthub.network` before claiming parity.

## Change Guidance

- Keep auth and data wiring explicit and repo-local before adding abstraction.
- Preserve production behavior before improving implementation detail.
- If a requested change risks breaking parity with the live site, stop and verify first.
- If repo friction blocks progress, improve the repo instead of papering over the immediate issue.
