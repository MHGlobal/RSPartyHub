# Networking — RS Party Hub

**Descoberta LAN (§6):** servidor enumera interfaces IPv4 privadas (10/8, 172.16/12, 192.168/16) e expõe via `GET /api/info` e `GET /api/network` + `buildJoinUrls`. QR em `/api/qr?room=CODE` codifica `http://<IP>:3210?room=CODE&token=...`.

**mDNS:** best-effort anuncia o serviço TCP personalizado `_rsparty._tcp` após o HTTP bind, com a porta realmente atribuída (inclusive quando configurada como `0`). O TXT contém apenas `version=1`: nunca IP, URL, código de sala ou token. Define `RS_PARTY_MDNS=false` para desativar. Falhas ao carregar/publicar/fechar mDNS não interrompem o servidor nem o fallback por IP/QR (§6.4).

**Hotspot / AP isolation:** se telefones não ligam, verifica firewall/AP isolation no router. Docker expõe `3210`; `docker-compose.yml` mapeia porta e volume `rs-party-data:/data`.

**Windows firewall:** permitir Node.js no firewall privado; `start.bat` guia. Em `doctor` check `firewall` lista orientação.

**Offline:** zero CDN/fonts externas; frontend served same-origin; `pnpm install` no host basta. Testado sem WAN (sockets loopback + 140 tests verdes).
