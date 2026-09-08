---
name: Production admin bootstrap
description: Why the production database needs an explicit first-admin bootstrap.
---

The production database may receive the schema without development user rows. Do not assume a development admin account exists after publishing.

**Why:** The published site returned valid authentication failures because its `users` table had no administrator row, while development login worked.

**How to apply:** Bootstrap an administrator only when the account is missing, read the initial password from a protected secret, store only a strong password hash, and never overwrite an existing account on restart.