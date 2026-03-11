# AgentHub Network

This repo contains the production Vite app for `agenthub.network` and a mirrored Mintlify docs project in `docs/`.

The short version:

- `src/` is the live web product.
- `/docs` in the Vite app is the website docs entrypoint.
- `docs/` is the mirrored Mintlify docs project that must stay in sync.
- changes should stay simple, incremental, and easy for multiple agents to ship safely.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Vite app runs on `http://localhost:5173`.

## Repo shape

- `src/`: Vite frontend and app shell
- `src/content/docs-content.js`: shared docs source
- `src/main.jsx`: frontend entrypoint
- `src/lib/analytics.js`: PostHog bootstrap
- `docs/`: Mintlify docs content and config
- `docs/docs.json`: Mintlify config
- `tests/`: repo-level tests

## Quality gates

Run all of these before handoff:

- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Local hooks:

- pre-commit runs `lint-staged` and `npm run typecheck`
- pre-push runs `npm run test`
- commit messages are validated against Conventional Commits

CI:

- GitHub Actions runs `npm ci`, `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build`

## Docs

- The website should route users to `/docs` in the Vite app.
- Mintlify in `docs/` stays maintained as a synced mirror.
- `npm run docs:sync` regenerates the Mintlify files from the shared docs source.

## Analytics

PostHog is initialized from `src/lib/analytics.js` and booted in `src/main.jsx`.

If `VITE_POSTHOG_KEY` is unset, PostHog stays disabled locally.

## Working style

- Preserve parity with the live marketing site unless a deliberate redesign is requested.
- Fix the system when recurring repo friction appears.
- Expect frequent worktree-based changes from multiple agents.
- Read [`AGENTS.md`](/Users/tristdrum/.codex/worktrees/1ff7/agenthub-network/AGENTS.md) before making repo-shaping changes.
