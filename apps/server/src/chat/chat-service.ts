import { ChatRepository, newId, type ChatMessageRow, type Database } from "@rs-party/persistence";

export const CHAT_MAX_LENGTH = 500;
const CHAT_MAX_MESSAGES = 5;
const CHAT_WINDOW_MS = 10_000;

export class ChatError extends Error {
  constructor(readonly code: "INVALID_TEXT" | "MESSAGE_TOO_LONG" | "RATE_LIMITED" | "MUTED" | "NOT_FOUND" | "FORBIDDEN") {
    super(code);
  }
}

/** Normalizes and HTML-escapes user input before durable storage. */
export function normalizeChatText(value: unknown): string {
  if (typeof value !== "string") throw new ChatError("INVALID_TEXT");
  const text = value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (!text) throw new ChatError("INVALID_TEXT");
  if ([...text].length > CHAT_MAX_LENGTH) throw new ChatError("MESSAGE_TOO_LONG");
  // Store an escaped representation, so accidental future HTML rendering cannot
  // turn a persisted chat message into executable markup.
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export class ChatService {
  private readonly repo: ChatRepository;
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly db: Database) {
    this.repo = new ChatRepository(db);
  }

  list(roomId: string, limit = 50): ChatMessageRow[] {
    return this.repo.list(roomId, Math.min(Math.max(Math.floor(limit), 1), 100));
  }

  post(roomId: string, playerId: string, rawText: unknown): ChatMessageRow {
    const text = normalizeChatText(rawText);
    if (this.isMuted(roomId, playerId)) throw new ChatError("MUTED");
    if (!this.allow(playerId)) throw new ChatError("RATE_LIMITED");
    return this.repo.create({ id: newId("chat"), roomId, authorPlayerId: playerId, text, now: Date.now() });
  }

  delete(roomId: string, messageId: string, actorPlayerId?: string, isAdmin = false): void {
    const message = this.repo.byId(messageId);
    if (!message || message.room_id !== roomId) throw new ChatError("NOT_FOUND");
    if (!isAdmin && message.author_player_id !== actorPlayerId) throw new ChatError("FORBIDDEN");
    this.repo.remove(messageId);
  }

  setMute(roomId: string, playerId: string, muted: boolean, mutedUntil?: number | null): void {
    const player = this.db.prepare(`SELECT id FROM players WHERE id = ? AND room_id = ? AND kicked = 0`).get(playerId, roomId);
    if (!player) throw new ChatError("NOT_FOUND");
    if (muted) this.repo.mute(roomId, playerId, mutedUntil ?? null, Date.now());
    else this.repo.unmute(roomId, playerId);
  }

  private isMuted(roomId: string, playerId: string): boolean {
    const mute = this.repo.muteFor(roomId, playerId);
    if (!mute) return false;
    if (mute.muted_until !== null && mute.muted_until <= Date.now()) {
      this.repo.unmute(roomId, playerId);
      return false;
    }
    return true;
  }

  private allow(playerId: string): boolean {
    const now = Date.now();
    const recent = (this.hits.get(playerId) ?? []).filter((at) => now - at < CHAT_WINDOW_MS);
    if (recent.length >= CHAT_MAX_MESSAGES) {
      this.hits.set(playerId, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(playerId, recent);
    return true;
  }
}
