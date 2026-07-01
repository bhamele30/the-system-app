---
name: Stripe Replit connector credentials
description: How to correctly fetch Stripe credentials from the Replit OpenInt connector
---

# Stripe Replit connector credentials

## The rule
- Field name: `settings.secret` (NOT `settings.secret_key`, NOT `settings.api_key`)
- Auth header: `"X-Replit-Token"` (exact string, NOT the env var name `X_REPLIT_TOKEN`)

**Why:** The Replit connector API for Stripe returns the secret key under `settings.secret`. Using `settings.secret_key` silently returns `undefined`, causing Stripe init to fail with "No API key provided". The header must be the literal string `"X-Replit-Token"` — using an underscore-separated env-var-style name sends the wrong header name and the auth fails.

**How to apply:** In any file that fetches the Stripe connection (e.g. `stripeClient.ts`):
```ts
const resp = await fetch(`${REPLIT_DB_URL}/__replit/connections/...`, {
  headers: { "X-Replit-Token": process.env.REPLIT_TOKEN ?? "" }
});
const conn = await resp.json();
const secretKey = conn.settings.secret;
```
