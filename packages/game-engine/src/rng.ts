/**
 * Deterministic seeded PRNG (spec §11.2).
 * mulberry32 — small, fast, good enough distribution for party games.
 * State is serializable so a GameInstance can be replayed/debugged.
 */

export interface RngState {
  s: number;
}

export class SeededRng {
  private s: number;

  constructor(seed: number | RngState) {
    this.s = typeof seed === "number" ? seed >>> 0 : seed.s >>> 0;
    if (this.s === 0) this.s = 0x9e3779b9;
  }

  /** [0, 1) */
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** integer in [min, max] inclusive */
  int(min: number, max: number): number {
    if (max <= min) return min;
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error("pick from empty array");
    return arr[Math.floor(this.next() * arr.length)]!;
  }

  shuffle<T>(arr: readonly T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const a = out[i]!;
      out[i] = out[j]!;
      out[j] = a;
    }
    return out;
  }

  serialize(): RngState {
    return { s: this.s };
  }

  static randomSeed(): number {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]! >>> 0;
  }
}

export function seedFromCode(code: string, extra = ""): number {
  // FNV-1a
  let h = 2166136261;
  const input = `${code}:${extra}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
