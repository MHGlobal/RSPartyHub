/**
 * Realtime gateway — Socket.IO wiring (spec §10).
 * Auth handshake, ACK envelopes, idempotency window (§10.3),
 * role-filtered snapshots (§10.4), rate limits (§10.8).
 */
import type { Server as SocketServer, Socket } from "socket.io";
import type { Ack, ClientEvent } from "@rs-party/protocol";
import {
  Channels,
  GameActionSchema,
  GameStartSchema,
  HostControlSchema,
  IDEMPOTENCY_WINDOW_MS,
  JoinPlayerInputSchema,
  RATE_LIMITS,
  ReactionKindSchema,
} from "@rs-party/protocol";
import { newId } from "@rs-party/protocol";
import type { RoomManager } from "../rooms/room-manager.js";

interface SocketSession {
  roomId: string;
  playerId: string;
}

/** Token bucket per socket+channel for simple flood control. */
class RateLimiter {
  private hits = new Map<string, number[]>();

  allow(key: string, maxPerWindow: number, windowMs: number): boolean {
    const now = Date.now();
    const arr = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= maxPerWindow) {
      this.hits.set(key, arr);
      return false;
    }
    arr.push(now);
    this.hits.set(key, arr);
    return true;
  }
}

export class Gateway {
  private sessions = new Map<string, SocketSession>(); // socketId → session
  private socketsByPlayer = new Map<string, Set<string>>(); // playerId → socketIds
  private limiter = new RateLimiter();
  private seenEvents = new Map<string, number>(); // `${playerId}:${eventId}` → ts
  private pendingBroadcasts = new Map<string, ReturnType<typeof setTimeout>>();
  private mult: number;

  constructor(
    private readonly io: SocketServer,
    private readonly rooms: RoomManager,
  ) {
    this.mult = rooms.cfg.rateLimitMultiplier;
  }

  attach(): void {
    // runtime ticks / results transitions push through the gateway
    this.rooms.broadcast = (roomId) => this.broadcastRoom(roomId);
    this.io.on("connection", (socket) => {
      socket.data.session = null;

      socket.on(Channels.ROOM_CREATE, (raw, ack) => {
        this.handleCreate(socket, raw, ack);
      });
      socket.on(Channels.ROOM_JOIN, (raw, ack) => {
        this.handleJoin(socket, raw, ack);
      });
      socket.on(Channels.STATE_SYNC, (_raw, ack) => {
        const s = this.session(socket);
        if (!s) return ack?.({ accepted: false, errorCode: "NOT_IN_ROOM" });
        const room = this.rooms.byId(s.roomId)!;
        this.rooms.touch(s.roomId, s.playerId);
        socket.emit(Channels.SNAPSHOT, this.rooms.snapshotFor(room, s.playerId));
        ack?.({ accepted: true });
      });
      socket.on(Channels.PLAYER_READY, (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          const ready = !!raw?.ready;
          this.rooms.setReady(s.roomId, s.playerId, ready);
          this.scheduleBroadcast(s.roomId);
          return { accepted: true };
        });
      });
      socket.on(Channels.PLAYER_UPDATE, (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          const patch = JoinPlayerInputSchema.partial().parse(raw ?? {});
          this.rooms.updateIdentity(s.roomId, s.playerId, patch);
          this.scheduleBroadcast(s.roomId);
          return { accepted: true };
        }, "RATE_LIMITED");
      });
      socket.on(Channels.GAME_START, (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          const parsed = GameStartSchema.parse(raw);
          if (!this.limiter.allow(`start:${s.playerId}`, Math.round((RATE_LIMITS.adminEventsPerMinute / 2) * this.mult), 60_000)) {
            return { accepted: false, errorCode: "RATE_LIMITED" };
          }
          try {
            this.rooms.startGame(s.roomId, s.playerId, parsed.gameId, parsed.settings);
            this.scheduleBroadcast(s.roomId);
            return { accepted: true };
          } catch (err) {
            return { accepted: false, errorCode: errCode(err) };
          }
        });
      });
      socket.on("party-mix:start", (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          const count = Math.min(Math.max(Number(raw?.count ?? 3), 1), 10);
          try {
            this.rooms.startPartyMix(s.roomId, s.playerId, count);
            this.scheduleBroadcast(s.roomId);
            return { accepted: true };
          } catch (err) {
            return { accepted: false, errorCode: errCode(err) };
          }
        });
      });
      socket.on(Channels.GAME_ACTION, (raw, ack) => {
        this.handleGameAction(socket, raw, ack);
      });
      socket.on(Channels.HOST_CONTROL, (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          let control;
          try {
            control = HostControlSchema.parse(raw);
          } catch {
            return { accepted: false, errorCode: "INVALID_PAYLOAD" };
          }
          try {
            if (control.op === "close-room") {
              const room = this.rooms.byId(s.roomId)!;
              this.rooms.hostControl(s.roomId, s.playerId, control);
              // closed snapshot to everyone still connected
              for (const p of room.players.values()) {
                const sockets = this.socketsByPlayer.get(p.id);
                if (!sockets) continue;
                for (const sid of sockets) {
                  this.io.to(sid).emit(Channels.SNAPSHOT, {
                    roomCode: room.code, phase: "closed", locked: true,
                    reactionsMuted: true, serverSeq: room.serverSeq,
                    stateVersion: room.stateVersion, players: [], announcements: [],
                  });
                }
              }
              // ACK reaches the host BEFORE the disconnect tears the socket
              ack?.({ accepted: true });
              socket.disconnect(true);
              return { noop: true };
            }
            this.rooms.hostControl(s.roomId, s.playerId, control);
            this.scheduleBroadcast(s.roomId);
            return { accepted: true };
          } catch (err) {
            return { accepted: false, errorCode: errCode(err) };
          }
        }, "RATE_LIMITED");
      });
      socket.on(Channels.REACTION_SEND, (raw, ack) => {
        this.guarded(socket, ack, () => {
          const s = this.session(socket)!;
          const room = this.rooms.byId(s.roomId)!;
          if (!this.limiter.allow(`react:${s.playerId}`, RATE_LIMITS.reactionBurst, 1000)) {
            // spec values enforced regardless of test multiplier (§10.8)
            return { accepted: false, errorCode: "RATE_LIMITED" };
          }
          let kind;
          try {
            kind = ReactionKindSchema.parse(raw?.kind);
          } catch {
            return { accepted: false, errorCode: "INVALID_PAYLOAD" };
          }
          if (room.reactionsMuted) return { accepted: false, errorCode: "FORBIDDEN" };
          this.io.to(room.id).emit(Channels.ANNOUNCE, {
            eventId: newId("rx"),
            kind,
            playerId: s.playerId,
            at: Date.now(),
          });
          this.rooms.touch(s.roomId, s.playerId);
          return { accepted: true };
        });
      });
      socket.on(Channels.PING_CLOCK, (raw, ack) => {
        ack?.({
          t0: Number(raw?.t0 ?? 0),
          serverTime: Date.now(),
        } satisfies { t0: number; serverTime: number });
      });

      socket.on("disconnect", () => {
        const s = this.sessions.get(socket.id);
        if (s) {
          const set = this.socketsByPlayer.get(s.playerId);
          set?.delete(socket.id);
          if (set && set.size === 0) this.socketsByPlayer.delete(s.playerId);
          this.rooms.markConnected(s.roomId, s.playerId, false);
          this.broadcastRoom(s.roomId);
          this.sessions.delete(socket.id);
        }
      });
    });

    // sweep stale seen-events every minute to bound memory
    setInterval(() => {
      const cutoff = Date.now() - IDEMPOTENCY_WINDOW_MS * 2;
      for (const [k, t] of this.seenEvents) if (t < cutoff) this.seenEvents.delete(k);
    }, 60_000).unref();
  }

  /* ---------------- handlers ---------------- */

  private handleCreate(socket: Socket, raw: unknown, ack?: (a: unknown) => void): void {
    if (!this.limiter.allow(`join:${socket.handshake.address}`, Math.round(RATE_LIMITS.joinPerMinutePerIp * this.mult), 60_000)) {
      ackAck(ack, false, undefined, "RATE_LIMITED");
      return;
    }
    let input;
    try {
      input = JoinPlayerInputSchema.parse((raw as { identity?: unknown })?.identity ?? raw);
    } catch {
      ackAck(ack, false, undefined, "INVALID_PAYLOAD");
      return;
    }
    try {
      const maxPlayers = Number((raw as { maxPlayers?: unknown })?.maxPlayers) || undefined;
      const { room, result } = this.rooms.createRoomAsHost(maxPlayers, input);
      this.bindSession(socket, room.id, result.playerId, room.code);
      this.rooms.markConnected(room.id, result.playerId, true);
      // ACK reflects commit (spec §10.2); fan-out is coalesced afterwards
      ackAck(ack, true, result);
      socket.emit(Channels.SNAPSHOT, this.rooms.snapshotFor(room, result.playerId));
    } catch (err) {
      ackAck(ack, false, undefined, errCode(err));
    }
  }

  private handleJoin(socket: Socket, raw: unknown, ack?: (a: unknown) => void): void {
    if (!this.limiter.allow(`join:${socket.handshake.address}`, Math.round(RATE_LIMITS.joinPerMinutePerIp * this.mult), 60_000)) {
      ackAck(ack, false, undefined, "RATE_LIMITED");
      return;
    }
    const body = raw as {
      roomCode?: string;
      playerId?: string;
      resumeToken?: string;
      identity?: unknown;
    };
    try {
      let result;
      if (body.resumeToken && body.playerId) {
        result = this.rooms.resume(
          String(body.roomCode),
          String(body.playerId),
          String(body.resumeToken),
        );
      } else {
        const input = JoinPlayerInputSchema.parse(body.identity ?? body);
        result = this.rooms.join(String(body.roomCode ?? ""), input);
      }
      const room = this.rooms.byCode(result.roomCode)!;
      this.bindSession(socket, room.id, result.playerId, room.code);
      this.rooms.markConnected(room.id, result.playerId, true);
      ackAck(ack, true, result);
      this.scheduleBroadcast(room.id);
    } catch (err) {
      ackAck(ack, false, undefined, errCode(err));
    }
  }

  private handleGameAction(socket: Socket, raw: unknown, ack?: (a: unknown) => void): void {
    this.guarded(socket, ack, () => {
      const s = this.session(socket);
      if (!s) return { accepted: false, errorCode: "NOT_IN_ROOM" };
      const room = this.rooms.byId(s.roomId);
      if (!room || !room.game || room.phase !== "game") {
        return { accepted: false, errorCode: "BAD_PHASE" };
      }
      let action: { type: string; payload: unknown };
      try {
        const parsed = GameActionSchema.parse(raw);
        action = { type: parsed.type, payload: parsed.payload };
      } catch {
        return { accepted: false, errorCode: "INVALID_PAYLOAD" };
      }
      const clientEvent = raw as { eventId?: string; clientSeq?: number };
      // idempotency window (spec §10.3) — bounded key size prevents
      // memory amplification via oversized eventIds (review H3)
      if (clientEvent.eventId !== undefined && clientEvent.eventId !== null) {
        const evId = String(clientEvent.eventId);
        if (evId.length === 0 || evId.length > 64) {
          return { accepted: false, errorCode: "INVALID_PAYLOAD" };
        }
        const key = `${s.playerId}:${evId}`;
        if (this.seenEvents.has(key)) {
          return { accepted: true, duplicate: true };
        }
        this.seenEvents.set(key, Date.now());
      }
      this.rooms.touch(s.roomId, s.playerId);
      const player = room.players.get(s.playerId)!;
      try {
        room.game.runtime.applyAction(action, {
          playerId: player.id,
          // preserve the REAL role (host must reach host-only actions
          // like buzzer-arena JUDGE / quiz-rush NEXT — spec §11 Actor)
          role: player.role,
        });
        this.scheduleBroadcast(s.roomId);
        return { accepted: true };
      } catch (err) {
        return { accepted: false, errorCode: errCode(err), reason: (err as Error).message };
      }
    });
  }

  /* ---------------- plumbing ---------------- */

  private session(socket: Socket): SocketSession | null {
    return (socket.data.session as SocketSession | null) ?? null;
  }

  private bindSession(socket: Socket, roomId: string, playerId: string, code: string): void {
    socket.data.session = { roomId, playerId } satisfies SocketSession;
    void code;
    socket.join(roomId);
    const set = this.socketsByPlayer.get(playerId) ?? new Set<string>();
    set.add(socket.id);
    this.socketsByPlayer.set(playerId, set);
    this.sessions.set(socket.id, { roomId, playerId });
  }

  /** Run handler with common guards and ACK error mapping. */
  private guarded(
    socket: Socket,
    ack: ((a: unknown) => void) | undefined,
    fn: () => Record<string, unknown>,
    limitErrorCode = "RATE_LIMITED",
  ): void {
    const s = this.session(socket);
    if (!s) {
      ackAck(ack, false, undefined, "NOT_IN_ROOM");
      return;
    }
    if (!this.limiter.allow(`any:${socket.id}`, Math.round(240 * this.mult), 10_000)) {
      ackAck(ack, false, undefined, limitErrorCode);
      return;
    }
    try {
      const res = fn();
      if (res && typeof (res as { accepted?: boolean }).accepted === "boolean") {
        // handler built a full ACK envelope already
        ack?.(res);
      } else {
        ackAck(ack, true, res);
      }
    } catch (err) {
      ackAck(ack, false, undefined, errCode(err));
    }
  }

  broadcastRoom(roomId: string): void {
    const room = this.rooms.byId(roomId);
    if (!room) return;
    for (const p of room.players.values()) {
      const sockets = this.socketsByPlayer.get(p.id);
      if (!sockets?.size) continue;
      const snap = this.rooms.snapshotFor(room, p.id);
      for (const sid of sockets) {
        this.io.to(sid).emit(Channels.SNAPSHOT, snap);
      }
    }
  }

  /**
   * Coalesced broadcast: rapid action bursts (30 answers in one second)
   * collapse into a single flush per window — spec §8 low consumption.
   * ACK latency no longer includes N×players inline serialization.
   */
  scheduleBroadcast(roomId: string): void {
    if (this.pendingBroadcasts.has(roomId)) return;
    const t = setTimeout(() => {
      this.pendingBroadcasts.delete(roomId);
      this.broadcastRoom(roomId);
    }, 50);
    t.unref?.();
    this.pendingBroadcasts.set(roomId, t);
  }
}

/* ---------------- small helpers ---------------- */

function ackAck(
  ack: ((a: unknown) => void) | undefined,
  accepted: boolean,
  data: unknown,
  errorCode?: string,
  reason?: string,
): void {
  const payload: {
    accepted: boolean;
    errorCode?: string;
    reason?: string;
    serverSeq: number;
    stateVersion: number;
    data?: unknown;
    duplicate?: boolean;
  } = {
    accepted,
    errorCode,
    reason,
    serverSeq: -1,
    stateVersion: -1,
  };
  if (accepted && data !== undefined) payload.data = data;
  ack?.(payload);
}

function errCode(err: unknown): string {
  const e = err as { code?: string; message?: string; name?: string };
  if (e?.code) return e.code;
  if (e?.message?.includes("Expected") || e?.name === "ZodError") return "INVALID_PAYLOAD";
  return "INTERNAL";
}
