import { z } from "zod";

/** Late join policy per game (spec §10.6). */
export const LateJoinPolicySchema = z.enum(["disallow", "spectatorUntilRound", "immediate"]);
export type LateJoinPolicy = z.infer<typeof LateJoinPolicySchema>;

export const GameSettingsFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["number", "boolean", "select", "text"]),
  default: z.union([z.number(), z.boolean(), z.string()]),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

export const GameManifestSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/)
    .max(48),
  name: z.string().min(1).max(60),
  description: z.string().min(1).max(300),
  minPlayers: z.number().int().min(1).max(30),
  maxPlayers: z.number().int().min(1).max(50),
  avgDurationMinutes: z.number().int().min(1).max(120),
  tags: z.array(z.string()).default([]),
  contentRating: z.enum(["family", "teen", "adult"]).default("family"),
  requiresBigScreen: z.boolean().default(true),
  supportsTableMode: z.boolean().default(false),
  lateJoin: LateJoinPolicySchema,
  spectatorSupport: z.boolean().default(true),
  teamSupport: z.boolean().default(false),
  /** Controller families the player phone renders. */
  controllers: z.array(z.enum(["choices", "vote", "buzzer", "grid", "draw", "text", "tap", "order", "cards"])).min(1),
  settings: z.array(GameSettingsFieldSchema).default([]),
  priority: z.enum(["P0", "P1"]).default("P1"),
});
export type GameManifest = z.infer<typeof GameManifestSchema>;
export type ControllerFamily = GameManifest["controllers"][number];
