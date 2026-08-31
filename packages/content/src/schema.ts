/**
 * Content Pack format — spec §103 (Apêndice AR), etapas 15.
 * Validation stages: schema (Zod) → semantic → cross-references.
 */
import { z } from "zod";

/* ---------------- Quiz packs ---------------- */

export const QuizQuestionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_-]{1,64}$/),
    category: z.string().min(1).max(32),
    text: z.string().min(3).max(300),
    choices: z.array(z.string().min(1).max(120)).min(2).max(4),
    correctIndex: z.number().int().min(0),
  })
  .refine((q) => q.correctIndex < q.choices.length, {
    message: "correctIndex out of range",
  });

export const QuizPackSchema = z.object({
  kind: z.literal("quiz"),
  packId: z
    .string()
    .regex(/^[a-z0-9_-]{1,48}$/)
    .refine((s) => !s.startsWith("builtin-"), "builtin- prefix is reserved"),
  title: z.string().min(1).max(80),
  locale: z.enum(["pt", "en"]),
  rating: z.enum(["family", "teen", "adult"]).default("family"),
  version: z.number().int().min(1),
  questions: z.array(QuizQuestionSchema).min(5).max(500),
});
export type QuizPack = z.infer<typeof QuizPackSchema>;
export type QuizPackQuestion = z.infer<typeof QuizQuestionSchema>;

/* ---------------- Survey packs ---------------- */

export const SurveyItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,64}$/),
  question: z.string().min(5).max(200),
  answers: z
    .array(
      z.object({
        text: z.string().min(1).max(60),
        weight: z.number().int().min(1).max(100),
      }),
    )
    .min(3)
    .max(8),
});

export const SurveyPackSchema = z.object({
  kind: z.literal("survey"),
  packId: z
    .string()
    .regex(/^[a-z0-9_-]{1,48}$/)
    .refine((s) => !s.startsWith("builtin-"), "builtin- prefix is reserved"),
  title: z.string().min(1).max(80),
  locale: z.enum(["pt", "en"]),
  rating: z.enum(["family", "teen", "adult"]).default("family"),
  version: z.number().int().min(1),
  items: z.array(SurveyItemSchema).min(3).max(200),
});
export type SurveyPack = z.infer<typeof SurveyPackSchema>;

/* ---------------- Union ---------------- */

export const ContentPackSchema = z.discriminatedUnion("kind", [
  QuizPackSchema,
  SurveyPackSchema,
]);
export type ContentPack = z.infer<typeof ContentPackSchema>;

export interface ValidationResultOk {
  ok: true;
  pack: ContentPack;
}

export interface ValidationResultFail {
  ok: false;
  /** stage that rejected the pack: schema | semantic | crossref */
  stage: "schema" | "semantic" | "crossref";
  errors: string[];
}

export type PackValidationResult = ValidationResultOk | ValidationResultFail;
