---
name: Root pnpm dependencies
description: How to add dependencies that must live in the workspace root when the package callback rejects pnpm workspace-root flags.
---

For packages that must be installed in the pnpm workspace root, update the root `package.json` and then run a normal workspace install to synchronize the lockfile.

**Why:** The language-package callback runs `pnpm add` at the root but triggers pnpm’s workspace-root safety check, while its argument validator rejects `-w` and `--workspace-root`.

**How to apply:** Use this only for dependencies whose integration instructions explicitly require root installation. Preserve existing versions and verify the resulting root manifest and lockfile.