/**
 * Pack validation pipeline — spec §103 AR.1:
 * stage 1 schema (Zod) → stage 2 semantic (duplicates, ranges)
 * → stage 3 cross-references (unique ids across pack).
 */
import {
  ContentPackSchema,
  type ContentPack,
  type PackValidationResult,
  type QuizPack,
  type SurveyPack,
} from "./schema.js";

export function validatePack(raw: unknown): PackValidationResult {
  // stage 1 — schema
  const parsed = ContentPackSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      stage: "schema",
      errors: parsed.error.issues
        .slice(0, 20)
        .map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`),
    };
  }
  const pack = parsed.data;

  // stage 2 — semantic per kind
  const semanticErrors: string[] = [];
  if (pack.kind === "quiz") semanticErrors.push(...validateQuizSemantic(pack));
  else semanticErrors.push(...validateSurveySemantic(pack));

  // stage 3 — cross-references: ids unique within pack
  const ids = pack.kind === "quiz"
    ? pack.questions.map((q) => q.id)
    : pack.items.map((i) => i.id);
  const dup = findDuplicates(ids);
  if (dup.length > 0) {
    semanticErrors.push(`duplicate item ids: ${dup.join(", ")}`);
  }

  if (semanticErrors.length > 0) {
    return { ok: false, stage: "semantic", errors: semanticErrors.slice(0, 20) };
  }
  return { ok: true, pack };
}

function validateQuizSemantic(pack: QuizPack): string[] {
  const errors: string[] = [];
  for (const q of pack.questions) {
    const normalizedChoices = q.choices.map((c) => c.trim().toLowerCase());
    if (new Set(normalizedChoices).size !== normalizedChoices.length) {
      errors.push(`${q.id}: duplicate choice text`);
    }
    if (q.text.trim().length < 3) errors.push(`${q.id}: empty question text`);
    for (let i = 0; i < q.choices.length; i++) {
      if (q.choices[i]!.trim().length === 0) {
        errors.push(`${q.id}: choice ${i} is blank`);
      }
    }
  }
  return errors;
}

function validateSurveySemantic(pack: SurveyPack): string[] {
  const errors: string[] = [];
  for (const item of pack.items) {
    const texts = item.answers.map((a) => a.text.trim().toLowerCase());
    if (new Set(texts).size !== texts.length) {
      errors.push(`${item.id}: duplicate answer text`);
    }
    if (!item.answers.some((a) => a.weight >= 20)) {
      errors.push(`${item.id}: no top answer (all weights < 20)`);
    }
  }
  return errors;
}

function findDuplicates(arr: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const v of arr) {
    if (seen.has(v)) dup.add(v);
    seen.add(v);
  }
  return [...dup];
}

/** Serialize a validated pack deterministically for checksum storage. */
export function canonicalJson(pack: ContentPack): string {
  return JSON.stringify(pack);
}
