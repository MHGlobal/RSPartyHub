/**
 * Media service — secure upload pipeline (spec §176, AK.2, AJ.2-AJ.5).
 * Allowlist, magic bytes, UUID storage names, path containment,
 * quota guards, and metadata persistence.
 */
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, resolve, extname, basename } from "node:path";
import type { Database } from "@rs-party/persistence";
import { MediaRepository } from "@rs-party/persistence";

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file (spec allowlist)
export const GLOBAL_QUOTA_BYTES = 500 * 1024 * 1024; // 500 MB global
export const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "video/mp4",
  "video/webm",
]);

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
  ".mp4": "video/mp4",
};

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/mpeg": ".mp3",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "audio/webm": ".webm",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export function kindForMime(mime: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "file";
}

/** Sanitize display name: no path separators, trim, limit, strip control chars. */
export function sanitizeOriginalName(name: string): string {
  const base = basename(name).replace(/[\x00-\x1F\x7F]/g, "").trim();
  const cleaned = base.replace(/[^a-zA-Z0-9._\- ()]/g, "_").slice(0, 120);
  return cleaned.length >= 1 ? cleaned : "upload.bin";
}

/** Magic bytes sniff — returns mime or null if unknown/forbidden. */
export function sniffMime(buf: Buffer, claimedExt: string): string | null {
  if (buf.length < 4) return null;
  // PNG 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // JPEG FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // GIF 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WEBP RIFF....WEBP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf.length >= 12 && buf.subarray(8, 12).toString() === "WEBP") return "image/webp";
  // MP3 ID3 or FF FB
  if (buf.subarray(0, 3).toString() === "ID3" || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)) return "audio/mpeg";
  // OGG 4F 67 67 53
  if (buf[0] === 0x4f && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) return "audio/ogg";
  // WAV RIFF....WAVE
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf.length >= 12 && buf.subarray(8, 12).toString() === "WAVE") return "audio/wav";
  // MP4 ftyp
  if (buf.length >= 12 && buf.subarray(4, 8).toString() === "ftyp") return "video/mp4";
  // WEBM EBML 1A 45 DF A3
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return "video/webm";
  // Fallback: extension allowlist but only if bytes look plausible; reject otherwise
  const ext = claimedExt.toLowerCase();
  if (ext && EXT_TO_MIME[ext]) {
    // generic fallback for unknown magic but allowed ext — still require at least printable header? reject to be strict
    // For text-like images where sniff fails, we still reject to prevent MIME spoof (OWASP)
    return null;
  }
  return null;
}

export interface StoreResult {
  id: string;
  storageKey: string;
  mime: string;
  bytes: number;
  sha256: string;
  kind: string;
  originalName: string;
}

export class MediaService {
  private repo: MediaRepository;
  private uploadsDir: string;

  constructor(
    private readonly db: Database,
    private readonly homeDir: string,
  ) {
    this.repo = new MediaRepository(db);
    this.uploadsDir = join(homeDir, "uploads", "approved");
    mkdirSync(this.uploadsDir, { recursive: true });
    // alias for legacy path spec §8.3
    mkdirSync(join(homeDir, "uploads", "temp"), { recursive: true });
  }

  /** Disk free guard + global quota */
  private checkQuota(incomingBytes: number): void {
    const used = this.repo.totalBytes();
    if (used + incomingBytes > GLOBAL_QUOTA_BYTES) {
      const err = new Error("QUOTA_EXCEEDED") as Error & { code?: string };
      err.code = "QUOTA_EXCEEDED";
      throw err;
    }
    // also check free space via statfs if available (Node 19+ uses statfsSync)
    try {
      const st: unknown = (statSync as unknown as { statfsSync?: (p: string) => { bavail: number; bsize: number } }).statfsSync?.(this.homeDir);
      if (st && typeof (st as { bavail: number }).bavail === "number") {
        const free = (st as { bavail: number; bsize: number }).bavail * (st as { bsize: number }).bsize;
        if (free < 50 * 1024 * 1024) {
          const err = new Error("DISK_FULL") as Error & { code?: string };
          err.code = "DISK_FULL";
          throw err;
        }
      }
    } catch {
      // best effort
    }
  }

  /** Core secure store: validates, writes file with UUID name, persists row. */
  storeBuffer(opts: {
    originalName: string;
    claimedMime?: string;
    buffer: Buffer;
    ownerPlayerId?: string | null;
    roomId?: string | null;
  }): StoreResult {
    const buf = opts.buffer;
    if (buf.length === 0) throw Object.assign(new Error("EMPTY_FILE"), { code: "EMPTY_FILE" });
    if (buf.length > MAX_FILE_BYTES) throw Object.assign(new Error("FILE_TOO_LARGE"), { code: "FILE_TOO_LARGE" });
    this.checkQuota(buf.length);

    const sanitized = sanitizeOriginalName(opts.originalName);
    const ext = extname(sanitized).toLowerCase();
    const extMime = EXT_TO_MIME[ext] ?? opts.claimedMime ?? "";
    const sniffed = sniffMime(buf, ext);

    // OWASP MIME spoof mitigation: sniff must match allowlist; claimed mime is secondary signal only
    let mime = sniffed;
    if (!mime) {
      // if sniff fails but extension suggests allowed type, still reject (strict). Allow generic fallback only for images where sniff may be slightly off?
      throw Object.assign(new Error("MIME_REJECTED"), { code: "MIME_REJECTED" });
    }
    if (!ALLOWED_MIMES.has(mime)) throw Object.assign(new Error("MIME_REJECTED"), { code: "MIME_REJECTED" });

    // If extension present, ensure it matches sniffed mime's extension family (prevent .jpg containing mp3)
    if (ext && EXT_TO_MIME[ext] && EXT_TO_MIME[ext] !== mime) {
      // allow .jpg/.jpeg equivalence
      const isJpeg = mime === "image/jpeg" && (ext === ".jpg" || ext === ".jpeg");
      if (!isJpeg) throw Object.assign(new Error("EXT_MISMATCH"), { code: "EXT_MISMATCH" });
    }

    const finalExt = MIME_TO_EXT[mime] ?? ext ?? ".bin";
    const id = randomUUID();
    const storageKey = `${id}${finalExt}`;
    const absPath = join(this.uploadsDir, storageKey);

    // Path traversal containment check (spec AK.2)
    const resolved = resolve(absPath);
    const dirResolved = resolve(this.uploadsDir);
    if (!resolved.startsWith(dirResolved + "/") && resolved !== dirResolved) {
      throw Object.assign(new Error("PATH_TRAVERSAL"), { code: "PATH_TRAVERSAL" });
    }

    const sha256 = createHash("sha256").update(buf).digest("hex");
    writeFileSync(resolved, buf);

    const kind = kindForMime(mime);
    this.db.prepare("BEGIN").run;
    try {
      this.repo.create({
        id,
        ownerPlayerId: opts.ownerPlayerId ?? null,
        roomId: opts.roomId ?? null,
        kind,
        originalName: sanitized,
        storageKey,
        mime,
        bytes: buf.length,
        sha256,
        now: Date.now(),
      });
    } catch (err) {
      try { unlinkSync(resolved); } catch {}
      throw err;
    }

    return { id, storageKey, mime, bytes: buf.length, sha256, kind, originalName: sanitized };
  }

  getFilePath(storageKey: string): string | null {
    // storageKey is UUID + ext, but still validate containment
    if (storageKey.includes("/") || storageKey.includes("\\") || storageKey.includes("..")) return null;
    const p = join(this.uploadsDir, basename(storageKey));
    const resolved = resolve(p);
    if (!resolved.startsWith(resolve(this.uploadsDir))) return null;
    if (!existsSync(resolved)) return null;
    return resolved;
  }

  list(limit = 50) {
    return this.repo.list(limit);
  }

  delete(id: string): void {
    const row = this.repo.byId(id);
    if (!row) throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
    const fp = this.getFilePath(row.storage_key);
    if (fp) { try { unlinkSync(fp); } catch {} }
    this.repo.delete(id);
  }
}
