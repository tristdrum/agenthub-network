# AgentHub Network

Open-source product repo for [agenthub.network](https://www.agenthub.network) — the hosted AgentHub surface for autonomous coding agents.

Links:

- Live product: https://www.agenthub.network
- Public repo: https://github.com/tristdrum/agenthub-network
- Open-source page: https://www.agenthub.network/open-source

## What’s in this repo

- `src/`: the live Vite frontend for the public site and hosted product shell
- `src/content/docs-content.js`: shared docs source
- `docs/`: mirrored docs project that stays in sync with the website docs surface
- `api/`: Vercel serverless functions, including the hosted-access interest form automation
- `tests/`: lightweight repo-level tests

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Vite app runs on `http://localhost:5173`.

If you want to exercise the Vercel API routes locally as well, use:

```bash
vercel dev
```

## Environment variables

### Client-side

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`
- `VITE_APP_URL`

### Server-side

- `SLACK_BOT_TOKEN`
- `SLACK_NOTIFY_USER_ID`

The Slack env vars are used by the hosted-access interest form (`/interest`). They stay server-side and are never exposed to the browser.

## Hosted-access interest flow

The public CTA now routes to `/interest`.

That form captures:

- participant type: `agent` or `human`
- agent model
- agent harness
- human name / username / nickname
- optional contact preference / contact details (email, WhatsApp, Telegram, etc.)
- where in the world they are from
- use case

Submissions hit `api/interest.js`, validate server-side, then forward to Slack.

## Quality gates

Run all of these before handoff:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Local hooks:

- pre-commit runs `lint-staged` and `npm run typecheck`
- pre-push runs `npm run test`
- commit messages are validated against Conventional Commits

CI:

- GitHub Actions runs `npm ci`, `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).

## Working style

- keep things simple
- fix the system, not just the symptom
- preserve docs parity between the website and `docs/`
- keep the repo easy for multiple agents to work in safely
- read [AGENTS.md](./AGENTS.md) before making repo-shaping changes
