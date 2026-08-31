/**
 * Pack library loader — reads library/packs/*.json from RS_PARTY_HOME
 * (spec §8.3: library is never deleted; §103 AR.2 authoring).
 * Invalid packs are quarantined (reported, skipped) — never crash boot.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { ContentPack, PackValidationResult } from "./schema.js";
import { validatePack } from "./validator.js";

export interface LoadedPack {
  pack: ContentPack;
  /** sha256 of canonical file bytes */
  checksum: string;
  source: "builtin" | "local" | "imported";
  fileName: string;
}

export interface LoadReport {
  loaded: LoadedPack[];
  rejected: Array<{ fileName: string; stage: string; errors: string[] }>;
}

export class PackLibrary {
  private byId = new Map<string, LoadedPack>();

  constructor(private readonly packsDir: string) {}

  ensureDir(): void {
    if (!existsSync(this.packsDir)) mkdirSync(this.packsDir, { recursive: true });
  }

  /** Scan packsDir and load every valid *.json pack. Idempotent. */
  loadFromDisk(): LoadReport {
    this.ensureDir();
    const report: LoadReport = { loaded: [], rejected: [] };
    let files: string[] = [];
    try {
      files = readdirSync(this.packsDir).filter((f) => f.endsWith(".json"));
    } catch {
      return report;
    }
    for (const fileName of files.sort()) {
      const path = join(this.packsDir, fileName);
      try {
        const bytes = readFileSync(path);
        const checksum = createHash("sha256").update(bytes).digest("hex");
        const raw = JSON.parse(bytes.toString("utf8")) as unknown;
        const result = validatePack(raw);
        if (!result.ok) {
          report.rejected.push({ fileName, stage: result.stage, errors: result.errors });
          continue;
        }
        const loaded: LoadedPack = {
          pack: result.pack,
          checksum,
          source: "local",
          fileName,
        };
        // later files with same packId win (sorted load = deterministic)
        this.byId.set(loaded.pack.packId, loaded);
        report.loaded.push(loaded);
      } catch (err) {
        report.rejected.push({
          fileName,
          stage: "schema",
          errors: [`unreadable/invalid JSON: ${(err as Error).message}`],
        });
      }
    }
    return report;
  }

  register(pack: ContentPack, source: LoadedPack["source"]): LoadedPack {
    const checksum = createHash("sha256").update(canonicalBytes(pack)).digest("hex");
    const loaded: LoadedPack = { pack, checksum, source, fileName: `builtin:${pack.packId}` };
    this.byId.set(pack.packId, loaded);
    return loaded;
  }

  list(): LoadedPack[] {
    return [...this.byId.values()];
  }

  byPackId(id: string): LoadedPack | undefined {
    return this.byId.get(id);
  }

  quizPacks(): LoadedPack[] {
    return this.list().filter((l) => l.pack.kind === "quiz");
  }

  surveyPacks(): LoadedPack[] {
    return this.list().filter((l) => l.pack.kind === "survey");
  }
}

function canonicalBytes(pack: ContentPack): Buffer {
  return Buffer.from(JSON.stringify(pack), "utf8");
}

/** Import an uploaded pack string into the library (etapa 16 bridge). */
export function importPackString(
  lib: PackLibrary,
  raw: string,
  sourceName = "imported.json",
): PackValidationResult & { checksum?: string; imported?: boolean } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, stage: "schema", errors: ["invalid JSON"] };
  }
  const result = validatePack(parsed);
  if (result.ok) {
    const loaded = lib.register(result.pack, "imported");
    return { ...result, checksum: loaded.checksum, imported: true };
  }
  return result;
}
