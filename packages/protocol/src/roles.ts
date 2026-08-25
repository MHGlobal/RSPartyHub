import { z } from "zod";

/** Player roles inside a room. */
export const Roles = ["host", "player", "spectator"] as const;
export type Role = (typeof Roles)[number];

export const AvatarSchema = z.object({
  icon: z.string().min(1).max(32),
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});
export type Avatar = z.infer<typeof AvatarSchema>;

export const NicknameSchema = z
  .string()
  .transform((s) => s.normalize("NFC").replace(/[\u0000-\u001f\u007f]/g, "").trim())
  .pipe(
    z
      .string()
      .min(1)
      .max(20, "1–20 caracteres")
      .refine((s) => !/[<>]/.test(s), "HTML não permitido"),
  );

export const JoinPlayerInputSchema = z.object({
  nickname: NicknameSchema,
  avatar: AvatarSchema,
});
export type JoinPlayerInput = z.infer<typeof JoinPlayerInputSchema>;

/** Who performed an action — used by game plugins. */
export interface Actor {
  playerId: string;
  role: Role;
}
