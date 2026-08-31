# Networking — RS Party Hub

**Descoberta LAN (§6):** servidor enumera interfaces IPv4 privadas (10/8, 172.16/12, 192.168/16) e expõe via `GET /api/info` e `GET /api/network` + `buildJoinUrls`. QR em `/api/qr?room=CODE` codifica `http://<IP>:3210?room=CODE&token=...`.

**mDNS:** best-effort previsto (`.local`) — não dependente; fallback IP literal cobre §6.4. Doctor avisa `mDNS não anunciado`.

**Hotspot / AP isolation:** se telefones não ligam, verifica firewall/AP isolation no router. Docker expõe `3210`; `docker-compose.yml` mapeia porta e volume `rs-party-data:/data`.

**Windows firewall:** permitir Node.js no firewall privado; `start.bat` guia. Em `doctor` check `firewall` lista orientação.

**Offline:** zero CDN/fonts externas; frontend served same-origin; `pnpm install` no host basta. Testado sem WAN (sockets loopback + 140 tests verdes).
