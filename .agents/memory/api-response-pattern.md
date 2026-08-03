---
name: API server response pattern
description: Routes skip Zod .parse() for responses; use serialize() directly. Zod only for request validation.
---

## Rule
In `artifacts/api-server/src/routes/*.ts`, never use auto-generated Zod response schemas (e.g. `ListPagesResponse.parse(...)`) to validate outgoing data. Just `res.json(serialize(data))`.

**Why:** Response schema Zod validation adds overhead and fails on Date objects from Drizzle. The generated schemas are useful for type documentation but not runtime response validation on the server side.

**How to apply:**
- Import `{ serialize }` from `"../lib/serialize"` 
- Use `res.json(serialize(dbResult))` for all responses
- Still use Zod schemas for request body validation: `CreateXBody.safeParse(req.body)`
- Still use Zod schemas for URL param validation: `GetXParams.safeParse(req.params)`
