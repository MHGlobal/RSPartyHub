/**
 * Local ID generation (duplicated from protocol to keep persistence
 * dependency-light; protocol re-exports the canonical versions).
 */
export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
