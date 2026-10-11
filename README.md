# Plague Decision demo — Plague Bureau

An educational symptom-pattern quiz with fictional satirical animation. It is not a diagnosis or medical advice. Care guidance is computed locally; an optional, consent-gated server call selects an authored educational pattern.

Live app: https://plague-bureau.bureau-labs.workers.dev

This clean source import matches the application code deployed as `fb7fad62-5b3a-41f1-9091-ea4bd1018529`. It includes the chase, three animated endings, Kremlin backgrounds, Russian signs, connected hands/reins, progressive symptom-gated gestures and teeth from question 6 onward.

## Local development

Use Node 24 or later.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

Vite previews the quiz locally without a provider connection. No key is needed for local UI development. The repository configuration intentionally disables public Worker routing and live API calls and uses a placeholder D1 ID. It is not a backup of production configuration.

## Deployment configuration

Deploy only after reviewing the target account and obtaining release authorization. Set your verified account and existing D1 database identifiers in your controlled deployment configuration; do not overwrite the live configuration with the repository defaults. Install `OPENAI_API_KEY` through the Cloudflare Worker secret interface, never in source, frontend variables, command arguments or a commit. Existing production secrets must remain in Cloudflare.

The API requires a working D1 ledger, explicit enablement, and a current pricing-review expiry. Keep all instances on the same budget ledger. Each attempted provider call reserves $1 against the $180 UTC-month cap; reservations are not refunded on uncertain failures and requests are not automatically retried. Do not change or migrate these controls casually. Provider calls require separate spending authorization when testing.

The deployment guard rejects the placeholder database ID and unapproved public routing. Read `SECURITY.md` before modifying configuration. Local preview fixtures, screenshots, credential state and diagnostic scripts are deliberately excluded.
