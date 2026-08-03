/**
 * Converts Date objects to ISO strings so Zod schemas that expect `string`
 * do not reject values returned directly from Drizzle/pg-core.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
