import { z } from "zod";
import { AvatarSchema, NicknameSchema } from "./roles.js";
import type { Role } from "./roles.js";

/* ---------- Snapshot shapes (spec §10.4) ---------- */

export const RoomPhaseSchema = z.enum(["lobby", "game", "results", "closed"]);
export type RoomPhase = z.infer<typeof RoomPhaseSchema>;

export interface PlayerPublicInfo {
  id: string;
  nickname: string;
  avatar: { icon: string; bg: string };
  role: Role;
  connected: boolean;
  score: number;
  ready: boolean;
}

export interface GamePublicState {
  id: string;
  name: string;
  /** semantic phase exposed by the plugin */
  phase: string;
  phaseLabel: string;
  roundNumber: number;
  roundTotal: number;
  /** absolute epoch ms deadline; undefined while untimed */
  deadlineAt?: number;
  paused: boolean;
  publicView: unknown;
}

export interface RoomSnapshot {
  roomCode: string;
  phase: RoomPhase;
  locked: boolean;
  reactionsMuted: boolean;
  serverSeq: number;
  stateVersion: number;
  players: PlayerPublicInfo[];
  game?: GamePublicState;
  partyMix?: { remainingGames: number };
  results?: ResultsPayload;
  announcements?: Announcement[];
}

export interface PlayerSnapshot extends RoomSnapshot {
  you: {
    id: string;
    role: Role;
    score: number;
    connected: boolean;
    privateView: unknown;
  };
}

/* ---------- Join / create ACK data ---------- */

export interface JoinAckData {
  roomCode: string;
  playerId: string;
  resumeToken: string;
  role: Role;
}

/* ---------- Client payloads ---------- */

export const ReactionKindSchema = z.enum(["thumbsup", "heart", "laugh", "clap", "wow"]);
export type ReactionKind = z.infer<typeof ReactionKindSchema>;

export const HostControlSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("kick"), playerId: z.string() }),
  z.object({ op: z.literal("rename"), playerId: z.string(), nickname: NicknameSchema }),
  z.object({ op: z.literal("make-spectator"), playerId: z.string() }),
  z.object({ op: z.literal("mute-reactions"), muted: z.boolean() }),
  z.object({ op: z.literal("lock-joins"), locked: z.boolean() }),
  z.object({ op: z.literal("skip-round") }),
  z.object({ op: z.literal("end-game") }),
  z.object({ op: z.literal("return-to-lobby") }),
  z.object({ op: z.literal("pause"), paused: z.boolean() }),
  z.object({ op: z.literal("close-room") }),
]);
export type HostControl = z.infer<typeof HostControlSchema>;

export const GameStartSchema = z.object({
  gameId: z.string().min(1),
  settings: z.record(z.union([z.number(), z.boolean(), z.string()])).optional(),
});

/** Ordered host-selected Party Mix. The server still validates every game. */
export const PartyMixStartSchema = z.object({
  gameIds: z.array(z.string().min(1)).max(10),
});
export type PartyMixStart = z.infer<typeof PartyMixStartSchema>;

export const GameActionSchema = z.object({
  type: z.string().min(1).max(48),
  payload: z.unknown(),
});

export const PlayerUpdateSchema = z.object({
  nickname: NicknameSchema.optional(),
  avatar: AvatarSchema.optional(),
});

/* ---------- Server payloads ---------- */

export interface Announcement {
  id: string;
  level: "info" | "success" | "error";
  text: string;
  at: number;
}

export interface ScoreRow {
  playerId: string;
  nickname: string;
  score: number;
  roundDelta?: number;
  rank: number;
  title?: string;
}

export interface ResultsPayload {
  rows: ScoreRow[];
  gameId?: string;
  gameName?: string;
  awards: { kind: string; label: string; playerIds: string[] }[];
}

export interface ClockPongPayload {
  t0: number;
  serverTime: number;
}

/** Rate limits (spec §10.8). */
export const RATE_LIMITS = {
  joinPerMinutePerIp: 10,
  nicknameChangePerMinute: 10,
  reactionPerSecond: 3,
  reactionBurst: 5,
  chatPer10s: 10,
  adminEventsPerMinute: 30,
} as const;

export const IDEMPOTENCY_WINDOW_MS = 5 * 60_000;
