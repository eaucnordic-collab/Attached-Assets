---
name: Orval Zod integer type bug
description: Using type:integer in OpenAPI with Orval 8.23 + Zod v3 generates zod.int() which doesn't exist. Use type:number instead.
---

## Rule
In the OpenAPI spec (`lib/api-spec/openapi.yaml`), always use `type: number` for integer fields, never `type: integer`.

**Why:** Orval 8.23 generates `z.number().int()` when it sees `type: integer`, but Zod v3 has no `.int()` method on `ZodNumber` — only Zod v4 does. This causes a runtime TypeError during codegen/import.

**How to apply:** When adding new fields to the spec, use `type: number` with optional `format: int32` or `format: int64`. Run codegen with `pnpm --filter @workspace/api-client-react run generate` and `pnpm --filter @workspace/api-zod run generate` after changes.
