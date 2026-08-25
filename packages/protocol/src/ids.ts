/**
 * ID generation utilities.
 * All IDs are generated server-side; clients never choose identity.
 */

/** Alphabet without visually ambiguous chars (spec §12.1): no I, O, L, Q, V */
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNP RSTUWXYZ".replace(" ", "").split("");

export function randomInt(maxExclusive: number): number {
  // crypto rejection sampling for uniformity
  const range = 0x100000000;
  const limit = range - (range % maxExclusive);
  const buf = new Uint32Array(1);
  const g = globalThis.crypto;
  do {
    g.getRandomValues(buf);
  } while (buf[0]! >= limit);
  return buf[0]! % maxExclusive;
}

export function generateRoomCode(len = 4): string {
  let out = "";
  for (let i = 0; i < len; i++) out += ROOM_CODE_ALPHABET[randomInt(ROOM_CODE_ALPHABET.length)];
  return out;
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function newToken(bytes = 24): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
