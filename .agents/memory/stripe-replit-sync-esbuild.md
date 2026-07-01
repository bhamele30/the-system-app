---
name: stripe-replit-sync esbuild externalization
description: stripe-replit-sync must be added to the esbuild externals list or its SQL migration files won't be found at runtime
---

# stripe-replit-sync must be externalized in esbuild

## The rule
Add `"stripe-replit-sync"` to the `external` array in `artifacts/api-server/build.mjs`.

**Why:** `stripe-replit-sync`'s `runMigrations()` uses `path.resolve(__dirname, "./migrations")` to find SQL files. When esbuild bundles it, `__dirname` points to the dist output directory — the SQL files aren't copied there, so `fs.existsSync(migrationsDirectory)` returns false and migrations silently skip. The `stripe` schema gets created but all 30 tables are missing. The server logs "Stripe schema ready" with no error because the skip path only logs at `info` level.

**How to apply:** Any package that loads sibling files (SQL, proto, JSON schema) via `path.resolve(__dirname, ...)` must be externalized. Signs of this pattern: the package has a `migrations/`, `protos/`, or `schemas/` subdirectory that it reads at runtime.
