# Specification gap matrix

**Assessment point:** `main` at `6b473da` (2026-09-01). This is a traceability
index, not a release declaration. A `PASS` records evidence available in the
current tree; it does **not** waive the release gates below. `PARTIAL` means a
useful implementation exists but one or more specified behaviours or proof
requirements are absent. `FAIL` means the required capability is absent or
explicitly stubbed.

## Sources and status convention

The four archived specifications are deliberately referenced by section/card
rather than copied here:

- **S1** — `/home/ubuntu/specs-archive/RSPartyHub/RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC_400P_PART_1_OF_4.md`
- **S2** — `/home/ubuntu/specs-archive/RSPartyHub/RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC_400P_PART_2_OF_4.md`
- **S3** — `/home/ubuntu/specs-archive/RSPartyHub/RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC_400P_PART_3_OF_4.md`
- **S4** — `/home/ubuntu/specs-archive/RSPartyHub/RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC_400P_PART_4_OF_4.md`

`PASS` / `PARTIAL` / `FAIL` describe the current main checkout only. Evidence
paths are starting points for review; a cited test is not a claim that it was
executed in this documentation change.

## Consolidated matrix

| Domain | Spec references | Requirement | Status | Evidence paths | Implementation work | Validation required |
|---|---|---|---|---|---|---|
| Product baseline | S1 §§0–1, 3–7; S2 AC-001–004, 014, 027 | Local-first LAN party: browser controllers, no required account/Internet, same-origin host, QR/IP/code join, reconnect and authoritative state. | **PARTIAL** | `apps/server/src/{http.ts,discovery.ts,realtime/gateway.ts}`; `apps/server/test/integration.test.ts`; `docs/NETWORKING.md` | Close UX/failure flows and formal offline proof. | WAN-blocked multi-browser test; QR/IP/code manual smoke on LAN/hotspot. |
| Network discovery | S1 §6.2–6.8; S2 AC-017; S4 VW Network/Offline | Bind LAN interface, choose/refresh advertised address and QR; announce `rsparty.local` best-effort without relying on it. | **PARTIAL** | `apps/server/src/discovery.ts`; `apps/server/src/diagnostics/doctor.ts`; `docs/NETWORKING.md` | Implement mDNS announcement and address-change handling/UI. | LAN + hotspot tests with IP-only fallback and mDNS when available. |
| Realtime/protocol | S1 §§9–10, §23.1–23.2; S2 AS.1–2, AC-003–005/018 | Versioned validated envelopes, ACK/idempotency, role-filtered snapshots, server timers, reconnect and rate limits. | **PASS** | `packages/protocol/src/{envelope.ts,events.ts}`; `apps/server/src/realtime/gateway.ts`; `apps/server/test/{integration.test.ts,host-actions.test.ts,runtime-tick.test.ts,chaos.test.ts}` | Maintain regression coverage as protocol changes. | Existing unit/integration/chaos suite; add browser reconnect coverage. |
| Lobby, host and controller UX | S1 §§4, 13.1–13.3; S1 AD.2–AD.3; S2 AC-002/010/016/022; S4 VW Host/Controller/Lobby | Complete host/player flows: clear network/QR/room status, contextual mobile controller, moderation, late join and accessible responsive UI. | **PARTIAL** | `apps/server/public/{host.html,play.html,index.html,css/style.css}`; `apps/server/test/{integration.test.ts,host-actions.test.ts}` | Add specified host/game-picker/presenter and mobile-state UX where missing; verify actual rendered flows. | Playwright host + multiple controller contexts at 1366×768 and 320px; late-join/background-resync tests. |
| Game engine and shared scoring | S1 §§14–15, X.3–X.4; S2 AC-004/005/015/023; S4 VW Game Engine | Plugin engine with deterministic seed/clock, server-owned score, secret filtering, results and compatible Party Mix selection. | **PARTIAL** | `packages/game-engine/src/{registry.ts,rng.ts,clock.ts}`; `apps/server/src/{runtime/game-runtime.ts,rooms/room-manager.ts}`; `apps/server/test/runtime-tick.test.ts` | Complete compatibility filtering/configuration and game-specific acceptance coverage. | Determinism, secret-leak, Party Mix incompatibility, reconnect and host-refresh E2E. |
| **Catalog accounting** | S1 §14 (incl. 12 P0 list); S3 §258.1–258.60 | The expanded functional catalog contains **60 games**; each needs the listed minimum/reconnect/idempotency/secret/a11y tests. | **FAIL** | `packages/games/` contains **10** packages: `quiz-rush`, `buzzer-arena`, `majority-vote`, `live-bingo`, `bluff-battle`, `draw-guess`, `charades`, `spy-room`, `hot-potato`, `survey-says`; tests under each package. | Implement **50 additional games**. Of the 12 S1 P0 titles, `pixel-reveal` and `coop-escape` are also absent. Do not treat engine extensibility as catalog completion. | Per-game S3 §258 cards (minimum/max, seeded content, reconnect, duplicate event, timeout, late join, host refresh, reduced motion, ledger, extreme text, invalid event) plus P0 multi-browser E2E. |
| Content packs and authoring | S1 §21; S2 §103 AR.1–AR.2, AC-007/013/019; S4 VW Content Packs/Editor | Safe directory/ZIP pack import/export, staged validation, local editor with drafts/preview/publish. | **PARTIAL** | `packages/content/src/{schema.ts,validator.ts,library.ts}`; `packages/content/test/content.test.ts`; `apps/server/src/pack-routes.ts` | Implement ZIP envelope/asset validation, export, enabled-state persistence, and browser editor/drafts/preview. | Invalid ZIP/path/MIME/duplicate rollback tests; editor E2E; library-preservation test. |
| Media, Party Drop, Photo Wall and Jukebox | S1 §§19–20; S2 AC-008/019/024; S4 VW Media/Photo Wall/Jukebox | Moderated media pipeline, progress/retry, Party Drop, Photo Wall and host-controlled music with safe fallback. | **PARTIAL** | `apps/server/src/{media/,photo-wall/,jukebox/}`; `apps/server/test/{media.test.ts,jukebox-photo.test.ts}` | Add user-facing progress/retry and remaining Party Drop/Jukebox/library/playback requirements. | Browser upload/progress/error/cancel tests; audio-failure fallback; offline media smoke. |
| Admin, moderation and authentication | S1 §§13.4, 22, 25.2; S4 VW Admin | Separate admin UI for overview, parties/content/library/clients/network/storage/logs/settings/diagnostics; password/PIN hash and revocable admin session. | **PARTIAL** | `apps/server/public/admin.html`; `apps/server/src/http.ts`; `apps/server/src/diagnostics/diagnostics-routes.ts` | Replace header-token-only authentication with specified bootstrap/session/logout model; implement missing admin domains. | Auth/session/logout/socket invalidation, authorization, and admin UI E2E. |
| Persistence, backup and restore | S1 §§9, 24.1–24.3; S2 AC-007/011/021/028; S4 VW Backup/Restore | SQLite WAL/migrations; preserve library/results; consistent backup and safe validated restore/recovery. | **PARTIAL** | `packages/persistence/src/{database.ts,repositories.ts}`; `apps/server/src/diagnostics/diagnostics-routes.ts:180-240`; `apps/server/test/{diagnostics.test.ts,chaos.test.ts}` | Implement atomic restore (current endpoint returns `501`), config/library options, lobby recovery/GC, and recovery UI. | Restore transaction/rollback and restart E2E; migration fixtures; Docker-volume persistence test. |
| Localization and accessibility | S1 §§13.5, 27; S2 AC-009/010/025; S4 VW Localization/Accessibility | Complete PT/EN UI catalogs, WCAG-oriented keyboard/ARIA/contrast/targets, responsive host/controller/admin, motion and timer presets. | **PARTIAL** | `apps/server/src/i18n/{dict.ts,i18n-routes.ts}`; `apps/server/public/css/style.css`; `apps/server/test/i18n.test.ts` | Move remaining inline UI strings to catalogs and complete/verify all surfaces and accessibility presets. | Locale-switch, keyboard/ARIA, contrast, zoom, reduced-motion and 320px/720p browser tests. |
| Diagnostics, telemetry and operations | S1 §§8, 22.5, 28; S2 AC-020; S4 VW Diagnostics | Doctor/metrics/logs diagnose LAN, storage, DB, reconnect/ACK/event health; local optional telemetry without secret leakage. | **PARTIAL** | `apps/server/src/diagnostics/{doctor.ts,diagnostics-routes.ts}`; `apps/server/scripts/doctor.mjs`; `apps/server/test/diagnostics.test.ts` | Add specified percentile/reconnect/plugin-health/log controls and documented telemetry opt-in. | CLI/API tests plus operational smoke with DB/storage/network fault injection and log-secret assertion. |
| Security | S1 §25; S2 AC-012/018/019/026; S4 VW Security | Validate every boundary; restrict origins; safe uploads; CSP/headers; granular abuse controls; no secrets in logs. | **PARTIAL** | `SECURITY.md`; `apps/server/src/{http.ts,realtime/gateway.ts,media/media-service.ts}`; `apps/server/test/{security.test.ts,media.test.ts,cors-origin-policy.test.ts}` | Finish session auth, chat controls when chat exists, granular nickname/action limits and log assertions. | Security regression suite, origin/upload adversarial tests, and secret-in-log scan. |
| Packaging, docs and release evidence | S1 §§0.2–0.3, 29, 41, 107–110; S2 AC-027–030; S4 VW Packaging/Release | Fresh-clone production build, one-command start, portable/Docker data persistence, report with real E2E/offline/load evidence; release only after gates pass. | **FAIL** | `package.json`; `Dockerfile`; `docker-compose.yml`; `scripts/verify.sh`; `IMPLEMENTATION_REPORT.md` (records no Playwright or formal WAN block) | Create CI and execute required fresh-clone/build/browser/offline/container evidence; update report from measured results. | All release gates below. |

## Release gates — currently blocked

Release is **not ready** while any gate is open:

1. **Catalog:** 10/60 games exist; 50 games are missing, including 2 of 12 named P0 games.
2. **E2E:** Playwright multi-context happy/reconnect paths, host 1366×768 and controller 320px are absent (S2 AS.3, AC-002/010/015/016/022).
3. **Offline/LAN:** no recorded WAN-blocked E2E or physical/network proof (S2 AC-001/014/017; S1 §7).
4. **Restore/admin:** restore returns `501`; specified session-based admin auth and dashboard domains are incomplete.
5. **Packs/editor:** ZIP import/export and local editor/drafts/preview are incomplete.
6. **Release proof:** no fresh-clone production/CI, Docker-volume, reference-hardware load, or full acceptance-card evidence (S2 AC-006/027–029; S4 VW Release).

## Maintenance rule

When a gap changes, update the affected row with the implementing commit, exact
test/script path and measured result. Change a status to `PASS` only when both
the complete user-facing flow and its required validation are evidenced; retain
the release gates until they are independently closed.
