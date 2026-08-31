#!/usr/bin/env node
/**
 * rs-party doctor — standalone (no TS imports), spec AC-020.
 * Checks RS_PARTY_HOME layout, DB file, network interfaces, and prints QR hint.
 * Also tries HTTP /api/metrics if server is running on 3210.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { networkInterfaces } from "node:os";

const home = process.env.RS_PARTY_HOME ?? join(process.cwd(), ".rs-party-home");
const port = Number(process.env.RS_PARTY_PORT ?? 3210);
console.log("\n  RS Party Hub — doctor\n");
const checks = [];
const nets = networkInterfaces();
let ips = [];
for (const [iface, addrs] of Object.entries(nets)) {
  if (!addrs) continue;
  if (/^(lo|docker|veth|br-)/i.test(iface)) continue;
  for (const a of addrs) if (a.family==="IPv4" && !a.internal && /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(a.address)) ips.push(a.address);
}
if (ips.length) { console.log(`  ✓ LAN IP: ${ips[0]}:${port}`); checks.push(true); }
else { console.log("  ⚠ LAN: nenhum IPv4 privado — verifica Wi-Fi/hotspot"); checks.push(false); }

for (const p of [join(home,"library"), join(home,"library/packs"), join(home,"uploads/approved"), join(home,"data")]) {
  const ok = existsSync(p);
  console.log(`  ${ok?"✓":"✗"} ${p.split("/").slice(-2).join("/")}: ${ok?"presente":"ausente"}`);
}

const dbFile = process.env.RS_PARTY_DB ?? join(home,"data","rsparty.sqlite");
console.log(`  ${existsSync(dbFile)?"✓":"○"} DB: ${dbFile} ${existsSync(dbFile)?"":"(será criado no boot)"}`);

const qr = `http://${ips[0]??"IP"}:${port}/join/TEST`;
console.log(`  QR sample: ${qr}`);

try {
  const res = await fetch(`http://127.0.0.1:${port}/api/metrics`, { signal: AbortSignal.timeout(1500) });
  if (res.ok) { const j = await res.json(); console.log(`  ✓ Server vivo: rss ${j.rssMb} MB, rooms ${j.activeRooms}`); checks.push(true); }
  else { console.log("  ○ Server não respondeu em 127.0.0.1 — inicia com pnpm dev:server"); }
} catch { console.log("  ○ Server não está a correr (ok antes da festa)"); }

console.log(`\n  ${checks.every(Boolean)?"Pronto para festa":"Verifica avisos acima"}\n`);
