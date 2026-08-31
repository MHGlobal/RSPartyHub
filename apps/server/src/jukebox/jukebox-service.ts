/**
 * Jukebox service — queue with votes, host veto, state lifecycle (spec AJ.5, §180).
 * Minimal but spec-compliant: queued votes reorder only while queued; host can skip.
 */
import type { Database } from "@rs-party/persistence";
import { JukeboxRepository, MediaRepository } from "@rs-party/persistence";

export type JukeboxState = "queued" | "playing" | "played" | "skipped";

export class JukeboxService {
  private jq: JukeboxRepository;
  private media: MediaRepository;

  constructor(private readonly db: Database) {
    this.jq = new JukeboxRepository(db);
    this.media = new MediaRepository(db);
  }

  list() {
    const rows = this.jq.list();
    // only queued items are reorderable by votes; playing stays at top
    return rows;
  }

  enqueue(mediaId: string, proposerId?: string | null): ReturnType<JukeboxRepository["byId"]> {
    const m = this.media.byId(mediaId);
    if (!m) throw Object.assign(new Error("MEDIA_NOT_FOUND"), { code: "MEDIA_NOT_FOUND" });
    if (m.kind !== "audio" && !m.mime.startsWith("audio/")) {
      throw Object.assign(new Error("NOT_AUDIO"), { code: "NOT_AUDIO" });
    }
    return this.jq.enqueue(mediaId, proposerId ?? null);
  }

  vote(id: string, delta: number): void {
    const row = this.jq.byId(id);
    if (!row) throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
    if (row.state !== "queued") throw Object.assign(new Error("NOT_QUEUED"), { code: "NOT_QUEUED" });
    if (delta !== 1 && delta !== -1) throw Object.assign(new Error("INVALID_DELTA"), { code: "INVALID_DELTA" });
    this.jq.vote(id, delta);
  }

  skip(id: string): void {
    const row = this.jq.byId(id);
    if (!row) throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
    this.jq.setState(id, "skipped");
  }

  play(id: string): void {
    const row = this.jq.byId(id);
    if (!row) throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
    this.jq.setState(id, "playing");
  }

  remove(id: string): void { this.jq.remove(id); }
}
