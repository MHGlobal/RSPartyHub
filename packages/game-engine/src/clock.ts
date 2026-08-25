/**
 * Clock abstraction — server uses real time; tests inject a FakeClock
 * to drive deadlines deterministically (spec etapa 10).
 */
export interface GameClock {
  now(): number;
}

export class RealClock implements GameClock {
  now(): number {
    return Date.now();
  }
}

export class FakeClock implements GameClock {
  private t: number;
  constructor(start = 1_000_000) {
    this.t = start;
  }
  now(): number {
    return this.t;
  }
  advance(ms: number): void {
    this.t += ms;
  }
  set(t: number): void {
    this.t = t;
  }
}
