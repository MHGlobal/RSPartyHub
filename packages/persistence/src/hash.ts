import { createHash } from "node:crypto";

/** Hash resume tokens before storage (spec §9.1 Player.reconnectToken hash). */
export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
