/**
 * Game registration — lazy dynamic imports (spec §8.2: lazy import dos módulos
 * de jogo). A package missing from disk logs a warning instead of crashing boot.
 */
import type { GameRegistry } from "@rs-party/game-engine";

/** Each games-* package default-exports its PartyGamePlugin. */
export const GAME_PACKAGES = [
  "@rs-party/games-quiz-rush",
  "@rs-party/games-buzzer-arena",
  "@rs-party/games-majority-vote",
  "@rs-party/games-live-bingo",
  "@rs-party/games-bluff-battle",
  "@rs-party/games-draw-guess",
  "@rs-party/games-charades",
  "@rs-party/games-spy-room",
  "@rs-party/games-hot-potato",
  "@rs-party/games-survey-says",
] as const;

export async function registerAllGames(registry: GameRegistry): Promise<string[]> {
  const loaded: string[] = [];
  await Promise.all(
    GAME_PACKAGES.map(async (pkg) => {
      try {
        const mod = (await import(/* @vite-ignore */ pkg)) as {
          default?: Parameters<GameRegistry["register"]>[0];
        };
        if (!mod.default) throw new Error("no default export");
        registry.register(mod.default);
        loaded.push(pkg);
      } catch (err) {
        // package not built/installed yet — non-fatal at boot
        console.warn(`[games] skipped ${pkg}: ${(err as Error).message}`);
      }
    }),
  );
  return loaded;
}
