/**
 * LAN discovery (spec §6.3): enumerate interfaces, skip loopback/internal,
 * prefer private IPv4, list options, build join URL + QR payload.
 * mDNS is best-effort and never required (spec §6.4).
 */
import { networkInterfaces } from "node:os";

export interface LanCandidate {
  iface: string;
  address: string;
}

const PRIVATE_RANGES = [
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
];

function isPrivateIPv4(addr: string): boolean {
  return PRIVATE_RANGES.some((re) => re.test(addr));
}

export function lanCandidates(): LanCandidate[] {
  const out: LanCandidate[] = [];
  const nets = networkInterfaces();
  for (const [iface, addrs] of Object.entries(nets)) {
    if (!addrs) continue;
    if (/^(lo|docker|veth|br-|virbr|vmnet|tailscale|zt)/i.test(iface)) continue;
    for (const a of addrs) {
      if (a.family !== "IPv4" || a.internal) continue;
      if (!isPrivateIPv4(a.address)) continue;
      out.push({ iface, address: a.address });
    }
  }
  return out;
}

/** Best candidate = first private IPv4; empty array means offline/edge case. */
export function primaryLanAddress(): string | null {
  return lanCandidates()[0]?.address ?? null;
}

export interface JoinUrls {
  baseUrl: string;
  playerUrl: string;
  qrPayload: string;
  candidates: LanCandidate[];
}

/**
 * Build the join URL for a room. QR payload format from spec §6.5:
 *   http://<host>:<port>/join/<roomCode>?t=<shortJoinToken>
 */
export function buildJoinUrls(opts: {
  port: number;
  roomCode: string;
  joinToken?: string;
}): JoinUrls {
  const candidates = lanCandidates();
  const addr = candidates[0]?.address ?? "127.0.0.1";
  const baseUrl = `http://${addr}:${opts.port}`;
  const tokenQs = opts.joinToken ? `?t=${opts.joinToken}` : "";
  const qrPayload = `${baseUrl}/join/${opts.roomCode}${tokenQs}`;
  return { baseUrl, playerUrl: qrPayload, qrPayload, candidates };
}
