import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validatePack } from "../src/validator.js";
import { PackLibrary, importPackString } from "../src/library.js";
import type { QuizPack } from "../src/schema.js";

function makeValidQuiz(): QuizPack {
  return {
  kind: "quiz",
  packId: "cine-2026",
  title: "Cinema 2026",
  locale: "pt",
  rating: "family",
  version: 1,
  questions: [
    { id: "q1", category: "movies", text: "Quem realizou 'Alien'?", choices: ["Ridley Scott", "Cameron", "Spielberg", "Scott D."], correctIndex: 0 },
    { id: "q2", category: "movies", text: "'Coco' é da Pixar?", choices: ["Sim", "Não"], correctIndex: 0 },
    { id: "q3", category: "movies", text: "Quantos Óscars tem 'Titanic'?", choices: ["9", "11", "13", "8"], correctIndex: 1 },
    { id: "q4", category: "movies", text: "Keanu Reeves em 'Matrix' é…", choices: ["Neo", "Trinity"], correctIndex: 0 },
    { id: "q5", category: "movies", text: "'Up' abre com qual sequência?", choices: ["Casamento", "Montaria de balão"], correctIndex: 0 },
      { id: "q6", category: "movies", text: "Miyazaki fundou qual estúdio?", choices: ["Ghibli", "Madhouse"], correctIndex: 0 },
    ],
  };
}

describe("Pack validation stages (spec §103 AR.1)", () => {
  it("accepts a fully valid quiz pack", () => {
    const r = validatePack(JSON.parse(JSON.stringify(makeValidQuiz())));
    expect(r.ok).toBe(true);
  });

  it("stage 1 rejects schema violations (bad id, wrong correctIndex range)", () => {
    const base = makeValidQuiz();
    const bad = { ...base, questions: base.questions.slice(0, 5) };
    (bad.questions[0] as { correctIndex: number }).correctIndex = 9;
    const r = validatePack(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.stage).toBe("schema");
  });

  it("stage 2 semantic: duplicate choice text rejected", () => {
    const bad = structuredClone(makeValidQuiz());
    bad.questions[0]!.choices[1] = bad.questions[0]!.choices[0]!;
    const r = validatePack(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.stage).toBe("semantic");
      expect(r.errors.join(" ")).toContain("duplicate choice");
    }
  });

  it("stage 3 crossref: duplicate question ids rejected", () => {
    const bad = structuredClone(makeValidQuiz());
    bad.questions[1]!.id = "q1";
    const r = validatePack(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toContain("duplicate item ids");
  });

  it("builtin- prefix is reserved for internal packs", () => {
    const bad = { ...makeValidQuiz(), packId: "builtin-cine" };
    const r = validatePack(bad);
    expect(r.ok).toBe(false);
  });
});

describe("PackLibrary loader", () => {
  it("loads valid packs from disk and quarantines invalid ones", () => {
    const dir = join(tmpdir(), `rsparty-packs-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "good.json"), JSON.stringify(makeValidQuiz()));
    writeFileSync(join(dir, "bad.json"), "{ not json");

    const lib = new PackLibrary(dir);
    const report = lib.loadFromDisk();
    expect(report.loaded.map((l) => l.pack.packId)).toContain("cine-2026");
    expect(report.rejected).toHaveLength(1);
    expect(report.rejected[0]!.fileName).toBe("bad.json");
    // checksum is stable sha256 hex
    const loaded = lib.byPackId("cine-2026")!;
    expect(loaded.checksum).toMatch(/^[a-f0-9]{64}$/);

    rmSync(dir, { recursive: true, force: true });
  });

  it("importPackString validates and registers imported packs", () => {
    const lib = new PackLibrary(join(tmpdir(), `unused-${Date.now()}`));
    const r = importPackString(lib, JSON.stringify(makeValidQuiz()));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.imported).toBe(true);
    expect(lib.list()).toHaveLength(1);
    const bad = importPackString(lib, "{oops");
    expect(bad.ok).toBe(false);
  });
});
