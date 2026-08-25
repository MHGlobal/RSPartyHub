import { z } from "zod";

/**
 * Realtime envelopes (spec §10.1).
 * Every client and server message is wrapped in these.
 */

export interface ClientEvent<T = unknown> {
  eventId: string; // UUID — idempotency key
  roomId: string;
  playerId?: string;
  clientSeq: number;
  sentAt: number; // epoch ms
  type: string;
  payload: T;
}

export interface ServerEvent<T = unknown> {
  eventId: string;
  roomId: string;
  serverSeq: number;
  stateVersion: number;
  sentAt: number;
  type: string;
  payload: T;
}

/** ACK envelope for critical actions (spec §10.2). */
export interface Ack<T = undefined> {
  accepted: boolean;
  reason?: string;
  errorCode?: string;
  serverSeq: number;
  stateVersion: number;
  data?: T;
}

export const ClientEventEnvelopeSchema = z.object({
  eventId: z.string().uuid(),
  roomId: z.string().min(1),
  playerId: z.string().optional(),
  clientSeq: z.number().int().nonnegative(),
  sentAt: z.number().finite(),
  type: z.string().min(1).max(64),
  payload: z.unknown().optional(),
});

/** Socket.IO channel names. */
export const Channels = {
  // client -> server
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  STATE_SYNC: "state:sync",
  PLAYER_READY: "player:ready",
  PLAYER_UPDATE: "player:update",
  GAME_START: "game:start",
  GAME_ACTION: "game:action",
  HOST_CONTROL: "host:control",
  REACTION_SEND: "reaction:send",
  PING_CLOCK: "clock:ping",

  // server -> client
  SNAPSHOT: "state:snapshot",
  ANNOUNCE: "announce",
  CLOCK_PONG: "clock:pong",
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];
