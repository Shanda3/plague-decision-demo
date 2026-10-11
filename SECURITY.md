# Security and privacy notes

- Keep the OpenAI key server-side in Cloudflare Worker secrets only. Never use `VITE_` or other public environment variables for it.
- `.env.example` contains empty placeholders. Real `.env`, `.dev.vars`, Wrangler state, build outputs, logs, databases, certificates and test artifacts are ignored and must not be committed.
- Only selected enumerated answers leave the browser after explicit consent. The app does not persist health answers or results. The D1 ledger stores reservation metadata, not those answers.
- No diagnostic logging or analytics is enabled by this source. Hosting and provider processing remains subject to their policies.
- Public access can consume the shared request budget. The budget is an application guard, not a guarantee against every cost or abuse scenario.
- Before pushing, inspect `git diff --cached` and scan the exact commit contents, including newly added files. `.gitignore` does not protect already-tracked files or Git history.
- If a credential is discovered in a commit, stop sharing it, notify the owner without copying the value, and arrange secure revocation/rotation and history cleanup. Do not assume deletion in a later commit removes exposure.

This repository audit checks specified patterns and excluded files; it is not a guarantee that every possible vulnerability or secret has been detected.
