# 103. APÊNDICE AR — CONTENT PACK FORMAT COMPLETO

Um pack é ZIP opcional ou pasta importável com manifesto. Exemplo:

```json
{
  "schemaVersion": 1,
  "id": "moz-party-sample",
  "version": "1.0.0",
  "name": "Moz Party Sample",
  "locales": ["pt"],
  "license": "user-provided",
  "entries": {
    "quiz": "quiz/questions.json",
    "survey": "survey/questions.json",
    "emoji": "emoji/items.json"
  },
  "assets": [
    {"id":"img_001","path":"assets/img_001.webp","sha256":"...","purpose":"pixel-reveal"}
  ]
}
```

## AR.1 Validation stages

1. envelope/ZIP limits;
2. path safety;
3. manifest schema;
4. unique IDs;
5. referenced files exist;
6. hashes;
7. MIME/content checks;
8. per-game schema;
9. locale/text length;
10. duplicate detection;
11. optional preview generation;
12. install transaction.

Falha em qualquer etapa mantém builtin packs intactos.

## AR.2 Authoring

Admin editor pode criar pack local. Autosave drafts separado de installed pack. “Publish locally” executa validação completa e gera version/hash.

---

# 104. APÊNDICE AS — TEST STRATEGY EM CAMADAS

## AS.1 Unit

Reducers, schemas, scorers, PRNG selection, fuzzy match, pack validation, path guards, clock sync calculations, rate limiters.

## AS.2 Integration

Subir server real com DB temp e sockets reais. Testar join, reconnect, duplicate action, room lock, admin auth, upload staging e migration.

## AS.3 E2E

Playwright abre host + múltiplos player contexts. Cada P0 game recebe happy path e reconnect path. Visual snapshots são auxiliares, não substituem assertions de state.

## AS.4 Load

Script cria 30–50 clients virtuais, joins escalonados e bursts representativos. Medir memory, event loop lag e ACK latency. Não usar apenas connections idle.

## AS.5 Chaos

Kill/restart server entre fases, drop sockets, delay ACK, duplicate packets em harness, corrupt temp upload, fill disk near quota, invalidate content pack, force host refresh.

## AS.6 Mutation/property tests

Para scorers e state invariants críticos, considerar property tests: score nunca NaN/negative quando proibido, saldo de auction não abaixo de zero, player único por answer slot, phase monotonic revision.

---

# 105. APÊNDICE AT — MATRIZ DE CRITÉRIOS DE ACEITAÇÃO GLOBAL

| ID | Requisito | Evidência mínima |
|---|---|---|
| AC-001 | Funciona sem Internet | E2E com WAN bloqueada |
| AC-002 | Join por QR/IP/código | Playwright + teste manual documentado |
| AC-003 | Reconexão preserva identidade | Integration + E2E |
| AC-004 | Score não duplica em retry | Integration |
| AC-005 | Secrets não vazam | Payload leakage tests |
| AC-006 | 30 clientes suportados | Load report |
| AC-007 | Biblioteca persistente não é apagada | Filesystem integration test |
| AC-008 | Upload mostra progresso/validação | E2E |
| AC-009 | PT/EN | locale switch test |
| AC-010 | Host 1366x768 e mobile 320px | visual/E2E |
| AC-011 | Party survives host reload/restart conforme checkpoint | chaos/E2E |
| AC-012 | Admin protegido | auth tests |
| AC-013 | Pack inválido não corrompe builtin | integration |
| AC-014 | No external CDN dependency | network assertion |
| AC-015 | P0 games completos | per-game suites |
| AC-016 | Late join policy respeitada | E2E |
| AC-017 | Captive/mDNS não são hard dependency | IP-only E2E |
| AC-018 | Rate limit de emotes/actions | integration |
| AC-019 | Upload traversal/ZIP bomb mitigado | security tests |
| AC-020 | Doctor fornece diagnóstico útil | CLI tests |
| AC-021 | Data migrations preservam dados | migration fixture tests |
| AC-022 | Browser background recupera por resync | manual + E2E approximation |
| AC-023 | Party Mix filtra incompatíveis | unit/integration |
| AC-024 | Audio failure tem fallback | E2E |
| AC-025 | Reduced motion respeitado | UI test |
| AC-026 | No secret in logs | log assertion |
| AC-027 | One-command start | release smoke test |
| AC-028 | Docker volume preserva data | container integration |
| AC-029 | Build production limpo | CI |
| AC-030 | Implementation report com evidências | artifact review |

---

# 106. APÊNDICE AU — TROUBLESHOOTING RUNBOOK EXTENSIVO

## AU.1 Telefone não abre endereço

Verificar mesma rede, IP correto, firewall, AP/client isolation, porta, VPN no telefone, mobile data fallback e se host está bind em `0.0.0.0`/interface correta. `rs-party doctor` deve imprimir URL testada. Não mandar utilizador “reinstalar tudo” primeiro.

## AU.2 Abre página mas não conecta realtime

Testar `/healthz`, WebSocket self-test, proxy, origin e transport fallback. UI deve distinguir “HTTP disponível, realtime indisponível”.

## AU.3 QR abre IP antigo

Host precisa observar interfaces e regenerar QR quando endereço anunciado mudar. Party pode mostrar banner “Endereço da rede mudou”.

## AU.4 mDNS não resolve no Windows

Usar IP. Não tratar como falha do produto. Mostrar mDNS como “nome amigável opcional”.

## AU.5 Hotspot tem Internet mas clients não se veem

Possível isolamento. Testar ping não é universal; fazer HTTP reachability a partir de segundo client. Fornecer instrução para trocar para hotspot/router que permita peer access.

## AU.6 Upload trava

Mostrar bytes, timeout e retry. Verificar free disk, quota e temp permissions. Cancelamento remove partial depois que stream encerra.

## AU.7 Música não toca

Garantir gesture unlock, codec, volume/mute e output do host. Exibir fallback “Formato não suportado neste browser” e sugerir transcode opcional.

## AU.8 Jogo fica preso à espera de player

Game runtime possui inactivity/host override. Host pode substitute, skip ou convert to spectator conforme jogo. Nunca exigir restart da party.

## AU.9 Player duplicado após refresh

Usar resumeToken e playerId; não usar socketId como identidade. Duplicate tab policy escolhe controller principal e avisa segunda tab.

## AU.10 DB locked/corrupt

Parar writes, backup file, executar integrity check, tentar recovery documentado. Nunca apagar DB automaticamente. Oferecer iniciar party nova em DB separada se recovery falhar.

## AU.11 Disco quase cheio

Bloquear novos uploads antes de zero bytes livres, manter gameplay sem media, mostrar admin warning e limpeza apenas de temp expirado automática.

## AU.12 CPU/RAM alta

Dashboard identifica game/media process e event rate. Draw strokes, sound spam e thumbnail generation devem ter budgets. Admin pode desativar Photo Wall/Jukebox sem derrubar party.

---

# 107. APÊNDICE AV — PLANO DE EXECUÇÃO ONE-SHOT DO OPENCODE EM 24 ETAPAS

O OpenCode deve executar estas etapas sem pedir confirmação em decisões não críticas. Cada etapa termina com testes locais antes de avançar; falhas são corrigidas imediatamente.

1. Inventariar repositório, Node/package manager, OS, portas e estrutura existente.
2. Criar/normalizar monorepo e scripts raiz.
3. Implementar contracts/schemas e IDs.
4. Implementar persistence + migrations + repositories.
5. Implementar server bootstrap, health/ready e network discovery.
6. Implementar Socket.IO handshake, sessions, join/resume e heartbeat.
7. Implementar party lifecycle e host lobby.
8. Implementar player join/waiting/reconnect shell.
9. Implementar admin auth/dashboard básico.
10. Implementar game-sdk, registry e fake clock.
11. Implementar primeiros P0 vertical slices completos: Quiz Rush, Buzzer Arena, Majority Vote.
12. Implementar scoring global, results, awards e Party Mix.
13. Implementar restantes P0 games e seus controllers.
14. Implementar P1 games por famílias reaproveitando componentes, sem reduzir especificidade.
15. Implementar content packs/editor/validation.
16. Implementar media upload pipeline e Party Drop.
17. Implementar Photo Wall e Jukebox.
18. Implementar PT/EN e accessibility pass.
19. Implementar diagnostics/doctor/logs/metrics.
20. Security hardening e threat-model tests.
21. Integration/E2E/chaos/load suites; corrigir tudo.
22. Production build, offline test e packaging Windows/Linux/Docker.
23. Gerar documentação, changelog, ADRs e `IMPLEMENTATION_REPORT.md` com resultados reais.
24. Executar release checklist limpa a partir de clone/build novo e só então declarar DONE.

## AV.1 Regra anti-“feature fantasma”

A cada item, OpenCode deve abrir/usar a UI via Playwright ou smoke test. A existência de ficheiro/componente não conta. Se o user-facing button não aparece, não funciona ou chama stub, o item permanece incompleto.

## AV.2 Regra anti-regressão

Antes de grandes mudanças, manter testes de features já feitas. Não “resolver” build removendo rotas, menus, dropdowns, media controls ou game modes.

---

# 108. APÊNDICE AW — RELATÓRIO FINAL OBRIGATÓRIO (`IMPLEMENTATION_REPORT.md`)

O relatório deve conter fatos, comandos e resultados, não marketing.

## AW.1 Cabeçalho

Commit SHA, data, OS, Node, package manager, build mode, porta testada, browsers E2E.

## AW.2 Feature matrix

Tabela de cada requisito/feature com estado `PASS`, `PARTIAL`, `FAIL`, evidência/teste e ficheiros principais. Em one-shot esperado, release só pode ser declarada se itens P0 estiverem PASS.

## AW.3 Tests

Incluir contagem real de unit/integration/E2E, comando, duração e falhas corrigidas. Não inventar números.

## AW.4 Load

Número de clients, cenário, peak RSS, p50/p95 ACK, event loop lag e erros.

## AW.5 Offline proof

Descrever como WAN foi bloqueada e quais jogos/flows foram executados. Registrar qualquer request externo e corrigi-lo antes de release.

## AW.6 Known limitations

Limitações reais e não P0 podem ser listadas com impacto/workaround. Não esconder defeito crítico em “known limitations”.

## AW.7 Artifacts

Paths de build, installer/container, example packs, screenshots/traces e backup format.

---

# 109. APÊNDICE AX — CHECKLIST DE EXPERIÊNCIA PROFISSIONAL “NÃO NÍVEL PROTÓTIPO”

- O produto inicia sem editar código.
- O host identifica URL da LAN sozinho.
- QR é grande e válido.
- O jogador entra em menos de ~30 segundos numa rede saudável.
- Nenhuma conta é exigida.
- Refresh não cria jogador novo por default.
- Perder Wi-Fi momentaneamente não elimina o jogador.
- O host pode continuar festa após alguém abandonar.
- Os jogos não são todos a mesma UI com texto trocado.
- A TV não mostra secrets.
- O telefone mostra confirmação de cada ação.
- Há feedback de “aguarde os outros” sem parecer travado.
- Timers são sincronizados pelo servidor.
- Empates têm regra explícita.
- Conteúdo inválido falha antes da ronda.
- Media possui progress e error states reais.
- Biblioteca persistente é preservada.
- Admin vê clients e saúde do sistema.
- A aplicação funciona sem CDN/Internet.
- Existe PT e EN completos nos fluxos core.
- Reações possuem rate limit.
- Soundboard possui limiter/master mute.
- Uploads não aceitam traversal.
- Logs não contêm tokens/secrets.
- Tests cobrem reconnect e duplicate action.
- Build de produção passa do zero.
- README permite outro técnico instalar.
- `rs-party doctor` ajuda antes de uma festa.
- Docker/portable não perdem dados.
- O design funciona em mobile pequeno.
- Host funciona em 1366×768.
- Reduced motion não quebra reveals.
- Erros mostram ação concreta.
- Botões que não funcionam não podem permanecer na UI.
- Features futuras aparecem como “em breve” somente se explicitamente fora de release; preferir esconder.
- O `IMPLEMENTATION_REPORT.md` prova o que realmente foi feito.

---

# 110. APÊNDICE AY — NOVA MATRIZ DE REFERÊNCIAS 2026

Referências adicionais incorporadas nesta revisão:

- GameNight — self-hosted multiplayer party games, LAN, room code, reconnect, mDNS: https://github.com/abhijatchaturvedi/gamenight
- Rumpus — self-hosted Jackbox-style, host/player routes, Socket.IO: https://github.com/rodwilco/rumpus
- Couch Kit — TV as LAN server, web controllers, time sync, preload, recovery: https://github.com/faluciano/react-native-couch-kit
- Buzz TV Party Game — smartphone buzzer controllers, local/cross-network architecture: https://github.com/faluciano/buzz-tv-party-game
- PartyPad — phone browsers as controllers, QR, motion inputs: https://github.com/benmross/partypad
- Hotspot Arcade — captive portal/offline party games over local AP: https://github.com/tarikbc/hotspot-arcade
- Hotspot Arcade Cardputer port — compact host + captive portal: https://github.com/genkigenki/hotspot-arcade-cardputer
- BoardLink — accountless browser multiplayer and reconnect patterns: https://github.com/jeiel85/boardlink-web
- Socket.IO delivery guarantees: https://socket.io/docs/v4/delivery-guarantees/
- Socket.IO connection state recovery: https://socket.io/docs/v4/connection-state-recovery/
- OWASP WebSocket Security: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- OWASP File Upload Security: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- MDN WebSocket: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- MDN WebRTC RTCDataChannel: https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel
- RFC 6762 mDNS: https://www.rfc-editor.org/rfc/rfc6762

A regra permanece: documentação oficial é fonte primária para comportamento de API e segurança. GitHub open source é referência de arquitetura/UX e Reddit serve como sinal de necessidades/feedback, não como autoridade de segurança.

---

# 111. CONTRATO FINAL REFORÇADO PARA O OPENCODE

Ao receber este documento, o OpenCode deve assumir que a intenção é **construir um produto completo e operacional**, não produzir outro plano. O documento já é o plano. O agente deve começar por inspeção do ambiente e avançar para implementação. Se encontrar código existente, preservar o que é funcional e migrar incrementalmente. Se encontrar uma feature declarada mas inexistente na UI ou backend, tratá-la como não implementada.

Não parar após gerar scaffolding. Não parar após o primeiro jogo. Não parar após compilar. Não parar após testes unitários. A definição de conclusão é uma sessão realista local em que um host abre o RS Party Hub, cria a festa, vários browsers entram, jogam vários minijogos, perdem e recuperam ligação, utilizam Party Mix, Jukebox/Photo Wall quando habilitados, terminam com ranking e o sistema mantém dados/packs conforme política.

Quando houver uma limitação objetiva do ambiente — por exemplo, ausência física de múltiplos telefones — usar Playwright contexts, network emulation e testes automatizados para produzir a melhor evidência possível, documentando a limitação. Uma limitação de ambiente não autoriza substituir comportamento por mock no produto final.

A qualidade visual importa, mas nunca deve mascarar backend incompleto. A arquitetura precisa ser simples o suficiente para operar localmente, robusta o suficiente para 30 clientes e extensível para futuros jogos e host Android. O Wi-Fi/LAN é parte central da experiência: onboarding, discovery, connection health, reconnect e offline mode têm a mesma prioridade de um minijogo.

**Fim da especificação Master expandida.**


---


# VOLUME III — MASTER EXPANSION 400+ PÁGINAS

> Este volume converte a especificação anterior numa fonte de verdade operacional para execução one-shot. O objetivo é minimizar decisões deixadas ao acaso, cobrir design e engenharia com profundidade, definir critérios de aceitação verificáveis e impedir a criação de funcionalidades que só existem visualmente.

## 113. Mandato executivo

O OpenCode deve construir **RS Party Hub** como produto local-first profissional. Não deve parar depois de scaffolding, mockups, componentes soltos, documentação ou plano. Deve continuar até existir uma release executável, testada e documentada.

### 113.1 Não negociáveis

1. Jogadores entram pelo browser; nenhuma instalação obrigatória no telefone.
2. O núcleo funciona sem Internet, apenas LAN/hotspot.
3. Host/servidor mantém estado autoritativo.
4. Reconexão é requisito central, não melhoria futura.
5. Feature só conta se o fluxo completo funciona.
6. Controller mobile é contextual; não copiar gamepad físico por hábito.
7. Segredos ficam no controller; informação pública fica na TV/host.
8. Sem analytics cloud por default.
9. Packs de conteúdo locais são importáveis/exportáveis.
10. Design system, áudio, motion, acessibilidade e responsividade fazem parte da Definition of Done.
11. Baseline sem GPU dedicada.
12. Tests + evidência são obrigatórios antes de declarar DONE.

### 113.2 Arquitetura default

Usar TypeScript end-to-end, Node.js LTS, Fastify ou Express, Socket.IO quando já fizer parte do stack, SQLite WAL, React/Vite para host/controller/admin, CSS Custom Properties para design tokens, validação de schema para todas as fronteiras e Playwright para fluxos E2E. Dependências precisam de justificativa objetiva.

### 113.3 Perfis operacionais

- **Lite:** 2–6 jogadores, 4 GB RAM, animação reduzida quando necessário.
- **Standard:** 2–12 jogadores, 8 GB RAM, experiência completa.
- **Large:** até 30 jogadores em modos compatíveis, equipas/audiência.
- **Event/Kiosk:** host em TV/projetor, admin separado, moderação e diagnóstico reforçados.

## 114. Benchmarks e pesquisa aplicada

Padrões observados em Jackbox, AirConsole, Blip Party e projetos self-hosted convergem em: tela central + controllers privados + room code/QR + onboarding imediato + minijogos curtos + reconexão + zero conta obrigatória. AirConsole recomenda layouts de controller específicos por situação e botões grandes, em vez de joysticks virtuais genéricos. Relatos comunitários destacam reconnect ruim, AFK, incompatibilidade de browser e controlos pequenos como causas frequentes de frustração.

Referências técnicas obrigatórias: Socket.IO; MDN para WebSocket/WebRTC/Service Worker/Wake Lock/Secure Contexts/Local Network Access; OWASP para WebSocket e uploads; WCAG 2.2; RFC 6762/6763; documentação Jackbox/AirConsole; projetos Rumpus, GameNight, Couch Kit, PhonePad, PartyPad, PairDrop/Snapdrop.

## 115. Secure-context policy

O baseline é `http://<IP_LOCAL>` porque a festa deve funcionar sem configuração de certificado. APIs que exigem contexto seguro são progressive enhancements. PWA, Wake Lock, sensores e certas permissões nunca podem bloquear lobby, votação, chat, desenhos ou jogo realtime essencial.


# VOLUME IV — DESIGN SYSTEM COMPLETO


## 116. Direção visual

A identidade deve comunicar energia, diversão, clareza e tecnologia local sem cair em “template SaaS”. O host é cinematográfico e legível a distância; o controller é táctil, rápido e privado; o admin é denso mas consistente.

**Evitar:** glassmorphism excessivo, gradientes aleatórios, sombras gigantes, fontes decorativas em texto funcional, partículas contínuas, UI escura sem contraste, animações que atrasam input e botões que só fazem sentido com hover.

## 117. Paleta default por tokens

```css
:root {
  --rs-bg-canvas:#0D0F18;
  --rs-bg-surface-1:#151827;
  --rs-bg-surface-2:#1D2133;
  --rs-bg-elevated:#252A40;
  --rs-brand-primary:#7C5CFF;
  --rs-brand-primary-strong:#6846FF;
  --rs-brand-secondary:#2ED6C5;
  --rs-brand-accent:#FFB84D;
  --rs-success:#3DDB86;
  --rs-warning:#FFC857;
  --rs-danger:#FF5D73;
  --rs-info:#59B7FF;
  --rs-text-primary:#F7F8FC;
  --rs-text-secondary:#B7BDD1;
  --rs-text-muted:#858DA8;
  --rs-border-subtle:#343A53;
}
```

A cor nunca é o único diferenciador. Jogadores têm cor + símbolo + avatar. Contraste deve ser testado na combinação real de foreground/background.

## 118. Tipografia

System-first, sem CDN. Inter pode ser empacotada localmente se licença for incluída. Host usa escala fluida com `clamp`; controller usa body 16–18px e ações 17–22px. Texto essencial em TV deve continuar legível em 720p.

## 119. Spacing, radius e layer

Escala de 4px; controller normalmente 16–24px de padding. Raios: 10 small, 14 control, 20 card, 28 panel, 36 hero, pill 999. Z-index é tokenizado; não usar números mágicos espalhados.

## 120. Motion

Durações: instant 80–120ms, standard 160–240ms, celebration 350–650ms. Transições maiores só quando não bloqueiam input. `prefers-reduced-motion` elimina deslocamentos grandes, parallax, shake e confetti contínuo. Estado lógico nunca depende do fim da animação.

## 121. Áudio e haptics

Master/music/SFX/voice separados. Áudio do host requer unlock por gesto. Controller usa áudio/haptic apenas como feedback útil e sempre com alternativa visual. Vibração é enhancement com opção de desligar.

## 122. Responsividade

Controller: baseline 320px de largura portrait; landscape suportado. Host: 720p, 1080p e 4K. Admin: desktop-first responsivo a tablet. Nenhuma ação essencial depende de hover.

## 123. Acessibilidade

Alvo interno: WCAG 2.2 AA para UI web. Targets mobile preferenciais ≥48×48 CSS px. Drag não essencial tem alternativa por tap. Focus visível. Sem mais de três flashes/s. Reduced motion, timers relaxados, high contrast, large text e haptics off são presets.


## 124.Color tokens

| Token | Regra |
|---|---|

| `bg.canvas` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `bg.surface1` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `bg.surface2` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `bg.elevated` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `brand.primary` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `brand.primaryStrong` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `brand.secondary` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `brand.accent` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `feedback.success` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `feedback.warning` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `feedback.danger` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `feedback.info` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `text.primary` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `text.secondary` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `text.muted` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `border.subtle` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Spacing tokens

| Token | Regra |
|---|---|

| `space.0` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.1` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.2` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.3` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.4` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.5` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.6` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.8` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.10` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.12` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.16` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.20` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `space.24` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Radius tokens

| Token | Regra |
|---|---|

| `radius.none` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.small` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.control` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.card` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.panel` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.hero` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `radius.pill` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Type tokens

| Token | Regra |
|---|---|

| `type.displayHero` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.h1` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.h2` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.h3` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.question` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.body` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.bodyStrong` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.label` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.helper` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.score` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `type.mono` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Motion tokens

| Token | Regra |
|---|---|

| `motion.instant` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `motion.standard` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `motion.emphasis` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `motion.celebration` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `ease.enter` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `ease.exit` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `ease.standard` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Control tokens

| Token | Regra |
|---|---|

| `control.minTarget` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `control.preferredTarget` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `control.touchGap` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `control.focusRing` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `control.disabledOpacity` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 124.Layer tokens

| Token | Regra |
|---|---|

| `z.base` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `z.header` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `z.overlay` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `z.modal` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `z.toast` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |

| `z.critical` | Valor semântico canónico; nunca substituir por literal disperso. Mudanças propagam por host/controller/admin. |


## 125. Biblioteca de componentes


### 125.1 `PrimaryButton`

**Papel:** componente canónico `PrimaryButton`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.2 `SecondaryButton`

**Papel:** componente canónico `SecondaryButton`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.3 `DangerButton`

**Papel:** componente canónico `DangerButton`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.4 `IconButton`

**Papel:** componente canónico `IconButton`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.5 `ChoiceCard`

**Papel:** componente canónico `ChoiceCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.6 `AnswerGrid`

**Papel:** componente canónico `AnswerGrid`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.7 `PlayerChip`

**Papel:** componente canónico `PlayerChip`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.8 `PlayerAvatar`

**Papel:** componente canónico `PlayerAvatar`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.9 `ConnectionBadge`

**Papel:** componente canónico `ConnectionBadge`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.10 `ReadyBadge`

**Papel:** componente canónico `ReadyBadge`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.11 `RoomCode`

**Papel:** componente canónico `RoomCode`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.12 `QRCodePanel`

**Papel:** componente canónico `QRCodePanel`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.13 `TimerRing`

**Papel:** componente canónico `TimerRing`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.14 `TimerBar`

**Papel:** componente canónico `TimerBar`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.15 `ScoreTicker`

**Papel:** componente canónico `ScoreTicker`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.16 `RankChange`

**Papel:** componente canónico `RankChange`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.17 `Toast`

**Papel:** componente canónico `Toast`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.18 `Snackbar`

**Papel:** componente canónico `Snackbar`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.19 `Modal`

**Papel:** componente canónico `Modal`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.20 `ConfirmDialog`

**Papel:** componente canónico `ConfirmDialog`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.21 `BottomSheet`

**Papel:** componente canónico `BottomSheet`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.22 `Drawer`

**Papel:** componente canónico `Drawer`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.23 `Tabs`

**Papel:** componente canónico `Tabs`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.24 `SegmentedControl`

**Papel:** componente canónico `SegmentedControl`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.25 `TextField`

**Papel:** componente canónico `TextField`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.26 `TextArea`

**Papel:** componente canónico `TextArea`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.27 `NumberField`

**Papel:** componente canónico `NumberField`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.28 `SearchField`

**Papel:** componente canónico `SearchField`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.29 `Select`

**Papel:** componente canónico `Select`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.30 `Switch`

**Papel:** componente canónico `Switch`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.31 `Checkbox`

**Papel:** componente canónico `Checkbox`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.32 `RadioGroup`

**Papel:** componente canónico `RadioGroup`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.33 `Slider`

**Papel:** componente canónico `Slider`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.34 `ProgressBar`

**Papel:** componente canónico `ProgressBar`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.35 `UploadCard`

**Papel:** componente canónico `UploadCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.36 `MediaCard`

**Papel:** componente canónico `MediaCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.37 `QueueItem`

**Papel:** componente canónico `QueueItem`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.38 `ChatBubble`

**Papel:** componente canónico `ChatBubble`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.39 `ReactionBurst`

**Papel:** componente canónico `ReactionBurst`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.40 `GameCard`

**Papel:** componente canónico `GameCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.41 `GameFilter`

**Papel:** componente canónico `GameFilter`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.42 `CategoryPill`

**Papel:** componente canónico `CategoryPill`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.43 `EmptyState`

**Papel:** componente canónico `EmptyState`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.44 `ErrorState`

**Papel:** componente canónico `ErrorState`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.45 `OfflineBanner`

**Papel:** componente canónico `OfflineBanner`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.46 `ReconnectBanner`

**Papel:** componente canónico `ReconnectBanner`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.47 `Skeleton`

**Papel:** componente canónico `Skeleton`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.48 `Tooltip`

**Papel:** componente canónico `Tooltip`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.49 `Popover`

**Papel:** componente canónico `Popover`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.50 `HostStage`

**Papel:** componente canónico `HostStage`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.51 `QuestionPanel`

**Papel:** componente canónico `QuestionPanel`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.52 `RevealCard`

**Papel:** componente canónico `RevealCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.53 `Podium`

**Papel:** componente canónico `Podium`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.54 `AwardCard`

**Papel:** componente canónico `AwardCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.55 `DrawingCanvas`

**Papel:** componente canónico `DrawingCanvas`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.56 `ColorPicker`

**Papel:** componente canónico `ColorPicker`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.57 `StrokePicker`

**Papel:** componente canónico `StrokePicker`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.58 `Buzzer`

**Papel:** componente canónico `Buzzer`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.59 `VoteCard`

**Papel:** componente canónico `VoteCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.60 `RoleCard`

**Papel:** componente canónico `RoleCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.61 `SecretShield`

**Papel:** componente canónico `SecretShield`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.62 `AdminTable`

**Papel:** componente canónico `AdminTable`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.63 `MetricCard`

**Papel:** componente canónico `MetricCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.64 `LogViewer`

**Papel:** componente canónico `LogViewer`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.65 `DiagnosticCheck`

**Papel:** componente canónico `DiagnosticCheck`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.66 `StorageGauge`

**Papel:** componente canónico `StorageGauge`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.67 `BackupCard`

**Papel:** componente canónico `BackupCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


### 125.68 `ContentPackCard`

**Papel:** componente canónico `ContentPackCard`.

**Anatomia:** separar container, conteúdo, feedback e affordance. **Estados:** default, hover quando aplicável, pressed, focus-visible, disabled, loading e error quando fizer sentido. **Touch:** se acionável no controller, target ≥48×48 CSS px. **A11y:** HTML nativo sempre que possível, nome acessível, foco e estado anunciado. **Performance:** evitar filtros caros e re-render global. **Testes:** component test dos estados, visual regression quando crítico e integração em fluxo real.


# VOLUME V — INFORMATION ARCHITECTURE E ECRÃS


## 126. Rotas de referência

```text
/ /host /host/create /host/room/:code /play /play/:code /controller/:session
/admin /admin/dashboard /admin/rooms /admin/content /admin/media /admin/players
/admin/settings /admin/diagnostics /admin/backups /health /api/*
```

Host público e admin precisam de shells separados; uma sessão admin no mesmo browser nunca deve vazar controles administrativos para a TV.


## 127.1 Ecrã — Host Home

**Objetivo:** Criar/continuar festa e entrar no catálogo.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.2 Ecrã — Create Party

**Objetivo:** Configurar sessão.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.3 Ecrã — Host Lobby

**Objetivo:** Reunir jogadores e iniciar.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.4 Ecrã — Game Browser

**Objetivo:** Escolher jogo.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.5 Ecrã — Party Mix Builder

**Objetivo:** Montar sequência.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.6 Ecrã — Host Game Intro

**Objetivo:** Explicar jogo.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.7 Ecrã — Host Live Round

**Objetivo:** Apresentar fase ativa.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.8 Ecrã — Host Reveal

**Objetivo:** Revelar resultado.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.9 Ecrã — Host Scoreboard

**Objetivo:** Ranking.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.10 Ecrã — Final Podium

**Objetivo:** Encerrar sessão.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.11 Ecrã — Player Join

**Objetivo:** Entrar por código/QR.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.12 Ecrã — Player Lobby

**Objetivo:** Aguardar e ready.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.13 Ecrã — Player Prompt

**Objetivo:** Responder texto.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.14 Ecrã — Player Choice

**Objetivo:** Selecionar opções.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.15 Ecrã — Player Buzzer

**Objetivo:** Buzzer full-screen.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.16 Ecrã — Player Drawing

**Objetivo:** Desenhar.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.17 Ecrã — Player Voting

**Objetivo:** Votar.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.18 Ecrã — Player Role

**Objetivo:** Papel privado.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.19 Ecrã — Player Waiting

**Objetivo:** Aguardar.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.20 Ecrã — Player Reconnect

**Objetivo:** Recuperar sessão.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.21 Ecrã — Audience Join

**Objetivo:** Entrar como audiência.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.22 Ecrã — Audience Vote

**Objetivo:** Votar audiência.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.23 Ecrã — Admin Login

**Objetivo:** Proteger admin.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.24 Ecrã — Admin Dashboard

**Objetivo:** Operar sistema.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.25 Ecrã — Admin Room Detail

**Objetivo:** Gerir sala.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.26 Ecrã — Admin Content Packs

**Objetivo:** Gerir packs.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.27 Ecrã — Admin Media

**Objetivo:** Gerir media.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.28 Ecrã — Admin Players

**Objetivo:** Gerir perfis locais.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.29 Ecrã — Admin Diagnostics

**Objetivo:** Diagnóstico.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.30 Ecrã — Admin Backups

**Objetivo:** Backup/restore.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.31 Ecrã — Admin Settings

**Objetivo:** Configuração.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.32 Ecrã — Party Drop

**Objetivo:** Transferência local.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.33 Ecrã — Jukebox Queue

**Objetivo:** Fila musical.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.34 Ecrã — Photo Wall

**Objetivo:** Mural.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.35 Ecrã — Local Chat

**Objetivo:** Chat.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.36 Ecrã — Content Editor

**Objetivo:** Editor.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.37 Ecrã — Custom Pack Preview

**Objetivo:** Preview pack.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.38 Ecrã — Help/Join

**Objetivo:** Ajuda.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.39 Ecrã — Network Warning

**Objetivo:** Rede degradada.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


## 127.40 Ecrã — Maintenance

**Objetivo:** Manutenção.

### Layout
A área principal precisa ser inequívoca. A ação primária domina sem esconder opções destrutivas. Não depender de hover. Em host, priorizar legibilidade a distância; em controller, reduzir densidade e maximizar área táctil.

### Estados obrigatórios
initial; loading; ready; partial/degraded; validation error; recoverable network error; permission denied quando aplicável; empty; success; reconnecting quando realtime.

### Interação
Preservar inputs durante erro transitório. Ações destrutivas exigem confirmação proporcional. Feedback visual de submit aparece imediatamente; confirmação final vem do servidor. Optimistic UI só com rollback.

### Acessibilidade
Ordem de foco = ordem visual; labels programáticos; status assíncrono anunciado; targets mobile grandes; reduced motion.

### Testes
Happy path, refresh/reconnect, input inválido, viewport, teclado e rede degradada quando aplicável.


# VOLUME VI — REALTIME, PROTOCOLO E RESILIÊNCIA


## 168. Modelo autoritativo

Servidor mantém `RoomAggregate`, `PlayerSession`, `GameRuntime`, `ScoreLedger`, `PresenceRegistry` e `ContentSnapshot`. Controller envia intenções; nunca calcula score oficial.

## 169. Identidade

`playerId` persistente na sessão; `deviceId` local; `resumeToken` secreto e rotativo; `socketId` efémero; `roomCode` é identificador humano e não segredo. Nickname não recupera identidade.

## 170. Envelope de evento

Mutações importantes incluem `eventId`, `roomId`, `playerId`, `clientSeq`, `serverSeq`, timestamps, schemaVersion e payload validado. Duplicatas com mesmo `eventId` são idempotentes na janela configurada.

## 171. Tempo

Deadline vem do relógio monotónico do servidor. Cliente anima countdown usando offset estimado, mas o servidor decide validade. Velocidade de resposta nunca usa timestamp do cliente como verdade.

## 172. Reconexão

Ao cair, controller preserva UI/draft, tenta reconnect, apresenta resumeToken, recebe delta se houver buffer ou snapshot se necessário e volta à view exata. Refresh não reinicia rodada. Host vê presença degradada sem congelar a partida.

## 173. AFK

Estados `active`, `temporarilyDisconnected`, `afk`, `left`, `kicked`. Cada jogo define timeout e host pode aguardar, skip, converter para bot, auto-answer ou remover conforme política. AFK nunca bloqueia indefinidamente.


## 174. Catálogo de eventos


### 174.1 `room:create`

**Direção:** host→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.2 `room:join`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.3 `room:joinAccepted`

**Direção:** server→controller. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.4 `room:joinRejected`

**Direção:** server→controller. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.5 `player:ready`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.6 `player:kick`

**Direção:** host/admin→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.7 `player:presence`

**Direção:** server→host. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.8 `game:select`

**Direção:** host→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.9 `game:start`

**Direção:** host→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.10 `game:phaseChanged`

**Direção:** server→scoped clients. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.11 `game:privateState`

**Direção:** server→controller. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.12 `game:publicState`

**Direção:** server→host. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.13 `game:submit`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.14 `game:submitAck`

**Direção:** server→controller. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.15 `game:vote`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.16 `game:reaction`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.17 `game:pause`

**Direção:** host/admin→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.18 `game:resume`

**Direção:** host/admin→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.19 `game:skip`

**Direção:** host/admin→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.20 `score:updated`

**Direção:** server→scoped clients. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.21 `snapshot:request`

**Direção:** client→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.22 `snapshot:state`

**Direção:** server→client. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.23 `chat:send`

**Direção:** controller→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.24 `chat:message`

**Direção:** server→room. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.25 `media:uploadInit`

**Direção:** client→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.26 `media:available`

**Direção:** server→room/admin. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.27 `jukebox:enqueue`

**Direção:** client→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.28 `jukebox:vote`

**Direção:** client→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.29 `admin:command`

**Direção:** admin→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.30 `diagnostic:ping`

**Direção:** client→server. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


### 174.31 `diagnostic:pong`

**Direção:** server→client. Envelope versionado, schema validation, autorização por room/role, limite de payload, ACK para mutações, erro `{code,message,retryable}`, redaction de logs, teste de duplicação e reconnect.


# VOLUME VII — DADOS, API E SEGURANÇA


## 175. SQLite e storage

SQLite em WAL com foreign keys e migrations. Media fora do DB/webroot; metadata no DB. `data/` é persistente e nunca apagado por update.

```text
data/rs-party.sqlite
data/uploads/images
data/uploads/audio
data/uploads/temp
data/content-packs
data/backups
data/logs
data/thumbnails
data/cache
```

## 176. Upload hardening

Allowlist, limite, MIME apenas como sinal secundário, magic bytes, UUID interno, nome de display sanitizado, storage fora do webroot, quota, cancel/retry, timeout, thumbnails seguros e nada executável. ZIP off por default.

## 177. WebSocket security

Mesmo em LAN: Origin/context validation, sessão/token, authz por evento, rate limits, max payload, schema, heartbeat, conexão limitada, sem `eval`, logs de violações, kick revoga resume, admin isolado.

## 178. Threat model

Convidado curioso/malicioso na LAN, browser comprometido, upload malicioso, spam, impersonação de admin, corrupção de estado, storage cheio, restart inesperado e porta exposta. Segurança deve continuar válida mesmo se o router também tiver Internet.


## 179. Modelo lógico


### 179.1 `rooms`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `code` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `name` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `settings_json` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `closed_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.2 `players`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `room_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `display_name` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `avatar_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `role` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `joined_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `last_seen_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.3 `player_sessions`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `player_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `device_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `resume_token_hash` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `expires_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `revoked_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.4 `games`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `room_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `plugin_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `plugin_version` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `seed` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `started_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `ended_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.5 `game_events`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `game_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `server_seq` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `event_type` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `payload_json` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.6 `scores`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `game_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `player_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `delta` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `reason` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `server_seq` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.7 `content_packs`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `slug` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `version` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `title` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `locale` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `manifest_json` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `enabled` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `installed_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.8 `media_items`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `room_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `owner_player_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `kind` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `storage_key` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `mime` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `bytes` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `sha256` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.9 `jukebox_queue`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `room_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `media_item_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `requested_by` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `position` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `votes` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.10 `chat_messages`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `room_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `player_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `body` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `status` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.11 `audit_log`

| Campo | Regra |
|---|---|

| `id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `actor_type` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `actor_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `action` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `target_type` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `target_id` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `metadata_json` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `created_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


### 179.12 `settings`

| Campo | Regra |
|---|---|

| `key` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `value_json` | Tipar, validar, indexar quando necessário e documentar lifecycle. |

| `updated_at` | Tipar, validar, indexar quando necessário e documentar lifecycle. |


## 180. HTTP API


### 180.1 `GET /api/health`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.2 `GET /api/network`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.3 `POST /api/rooms`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.4 `GET /api/rooms/:id`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.5 `PATCH /api/rooms/:id`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.6 `POST /api/rooms/:id/close`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.7 `GET /api/games`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.8 `GET /api/games/:pluginId`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.9 `GET /api/content-packs`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.10 `POST /api/content-packs/import`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.11 `POST /api/content-packs/:id/enable`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.12 `POST /api/content-packs/:id/disable`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.13 `GET /api/media`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.14 `POST /api/media/upload`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.15 `GET /api/media/:id`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.16 `DELETE /api/media/:id`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.17 `GET /api/admin/diagnostics`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.18 `POST /api/admin/backups`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.19 `POST /api/admin/restore/validate`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


### 180.20 `POST /api/admin/restore`

Schema request/response, status code coerente, auth, limite, erro estruturado e integration test. Nunca devolver segredo ou estado privado indevido.


# VOLUME VIII — GAME ENGINE E MINIJOGOS


## 181. Plugin SDK

Cada jogo exporta manifest, `createRuntime`, `validateConfig`, `getPublicView`, `getPrivateView`. PRNG é injetado; não usar `Math.random()` solto na lógica. Lifecycle comum: `idle → briefing → readyCheck → roundSetup → input → lock → reveal → score → betweenRounds → final → completed`.

Score é ledger append-only `{playerId,delta,reasonCode,round,serverSeq}`. Conteúdo possui IDs estáveis, locale, tags, rating, difficulty, checksums e regra anti-repetição.


## 182. Dossiers completos


### 182.1 Quiz Hero

**Categoria:** Trivia. **Jogadores:** 2–30. **Input:** `choice`.

#### Experiência
Quiz Hero deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.2 Doodle Dash

**Categoria:** Drawing. **Jogadores:** 3–12. **Input:** `draw+text`.

#### Experiência
Doodle Dash deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.3 Fibber

**Categoria:** Bluff. **Jogadores:** 3–12. **Input:** `text+vote`.

#### Experiência
Fibber deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.4 Forgery

**Categoria:** Social Drawing. **Jogadores:** 3–10. **Input:** `draw+vote`.

#### Experiência
Forgery deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.5 Hot Take

**Categoria:** Social. **Jogadores:** 3–30. **Input:** `choice`.

#### Experiência
Hot Take deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.6 Truth or Dare Safe

**Categoria:** Social. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Truth or Dare Safe deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.7 Bingo Blitz

**Categoria:** Bingo. **Jogadores:** 2–30. **Input:** `grid`.

#### Experiência
Bingo Blitz deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.8 Survey Says

**Categoria:** Survey. **Jogadores:** 4–20. **Input:** `text+buzzer`.

#### Experiência
Survey Says deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.9 Word Rush

**Categoria:** Word. **Jogadores:** 2–20. **Input:** `text`.

#### Experiência
Word Rush deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.10 Caption Clash

**Categoria:** Comedy. **Jogadores:** 3–12. **Input:** `text+vote`.

#### Experiência
Caption Clash deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.11 Emoji Decode

**Categoria:** Puzzle. **Jogadores:** 2–20. **Input:** `text`.

#### Experiência
Emoji Decode deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.12 Memory Grid

**Categoria:** Memory. **Jogadores:** 2–12. **Input:** `grid`.

#### Experiência
Memory Grid deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.13 Color Panic

**Categoria:** Reaction. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Color Panic deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.14 Tap Race

**Categoria:** Reaction. **Jogadores:** 2–20. **Input:** `tap`.

#### Experiência
Tap Race deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.15 Secret Role

**Categoria:** Social Deduction. **Jogadores:** 4–16. **Input:** `role+vote`.

#### Experiência
Secret Role deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.16 Who Am I

**Categoria:** Guessing. **Jogadores:** 3–20. **Input:** `role+choice`.

#### Experiência
Who Am I deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.17 One Word

**Categoria:** Co-op. **Jogadores:** 3–12. **Input:** `text`.

#### Experiência
One Word deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.18 Category Chain

**Categoria:** Word. **Jogadores:** 2–20. **Input:** `text`.

#### Experiência
Category Chain deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.19 Quick Draw Duel

**Categoria:** Drawing. **Jogadores:** 2–12. **Input:** `draw+vote`.

#### Experiência
Quick Draw Duel deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.20 Pixel Reveal

**Categoria:** Guessing. **Jogadores:** 2–20. **Input:** `buzzer+text`.

#### Experiência
Pixel Reveal deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.21 Sound Guess

**Categoria:** Audio. **Jogadores:** 2–20. **Input:** `choice+buzzer`.

#### Experiência
Sound Guess deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.22 Beat Tap

**Categoria:** Rhythm. **Jogadores:** 2–12. **Input:** `tap`.

#### Experiência
Beat Tap deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.23 Estimate It

**Categoria:** Numbers. **Jogadores:** 2–20. **Input:** `number`.

#### Experiência
Estimate It deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.24 Order Up

**Categoria:** Logic. **Jogadores:** 2–20. **Input:** `order`.

#### Experiência
Order Up deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.25 Risk Ladder

**Categoria:** Strategy. **Jogadores:** 2–12. **Input:** `choice`.

#### Experiência
Risk Ladder deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.26 Double Agent

**Categoria:** Social Deduction. **Jogadores:** 4–16. **Input:** `role+choice`.

#### Experiência
Double Agent deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.27 Team Charades

**Categoria:** Teams. **Jogadores:** 4–20. **Input:** `role+buzzer`.

#### Experiência
Team Charades deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.28 Would You Rather

**Categoria:** Social. **Jogadores:** 2–30. **Input:** `choice`.

#### Experiência
Would You Rather deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.29 Minority Wins

**Categoria:** Social. **Jogadores:** 3–30. **Input:** `choice`.

#### Experiência
Minority Wins deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.30 Auction Night

**Categoria:** Strategy. **Jogadores:** 3–12. **Input:** `number`.

#### Experiência
Auction Night deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.31 Password Relay

**Categoria:** Teams. **Jogadores:** 4–20. **Input:** `text`.

#### Experiência
Password Relay deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.32 Spy Sketch

**Categoria:** Drawing. **Jogadores:** 4–12. **Input:** `draw+vote`.

#### Experiência
Spy Sketch deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.33 Timeline

**Categoria:** Knowledge. **Jogadores:** 2–20. **Input:** `order`.

#### Experiência
Timeline deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.34 Map Pin

**Categoria:** Knowledge. **Jogadores:** 2–20. **Input:** `spatial`.

#### Experiência
Map Pin deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.35 Logoless

**Categoria:** Visual. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Logoless deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.36 Odd One Out

**Categoria:** Logic. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Odd One Out deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.37 Sequence Sense

**Categoria:** Logic. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Sequence Sense deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.38 Rapid Categories

**Categoria:** Word. **Jogadores:** 2–20. **Input:** `text`.

#### Experiência
Rapid Categories deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.39 Guess the Price Local

**Categoria:** Estimation. **Jogadores:** 2–20. **Input:** `number`.

#### Experiência
Guess the Price Local deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.40 Photo Prompt

**Categoria:** Social Photo. **Jogadores:** 3–20. **Input:** `photo`.

#### Experiência
Photo Prompt deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.41 Meme Forge

**Categoria:** Comedy. **Jogadores:** 3–12. **Input:** `text+vote`.

#### Experiência
Meme Forge deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.42 Reaction Roulette

**Categoria:** Reaction. **Jogadores:** 2–20. **Input:** `tap`.

#### Experiência
Reaction Roulette deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.43 Pass the Bomb

**Categoria:** Word. **Jogadores:** 3–20. **Input:** `text`.

#### Experiência
Pass the Bomb deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.44 Co-op Countdown

**Categoria:** Co-op. **Jogadores:** 2–20. **Input:** `tap`.

#### Experiência
Co-op Countdown deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.45 Split Decision

**Categoria:** Teams. **Jogadores:** 4–20. **Input:** `choice`.

#### Experiência
Split Decision deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.46 Secret Bid

**Categoria:** Strategy. **Jogadores:** 3–12. **Input:** `number`.

#### Experiência
Secret Bid deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.47 Clue Ladder

**Categoria:** Guessing. **Jogadores:** 2–20. **Input:** `buzzer+text`.

#### Experiência
Clue Ladder deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.48 Trivia Teams

**Categoria:** Trivia Teams. **Jogadores:** 4–30. **Input:** `choice`.

#### Experiência
Trivia Teams deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.49 Word Association

**Categoria:** Social Word. **Jogadores:** 3–20. **Input:** `text`.

#### Experiência
Word Association deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.50 Draw Telephone

**Categoria:** Drawing. **Jogadores:** 4–20. **Input:** `draw+text`.

#### Experiência
Draw Telephone deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.51 Story Stack

**Categoria:** Creative. **Jogadores:** 3–20. **Input:** `text`.

#### Experiência
Story Stack deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.52 Two Truths One Lie

**Categoria:** Social. **Jogadores:** 3–20. **Input:** `text+vote`.

#### Experiência
Two Truths One Lie deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.53 Guess the Player

**Categoria:** Social. **Jogadores:** 3–20. **Input:** `choice`.

#### Experiência
Guess the Player deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.54 Photo Mosaic

**Categoria:** Photo Guess. **Jogadores:** 3–20. **Input:** `buzzer`.

#### Experiência
Photo Mosaic deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.55 Silent Majority

**Categoria:** Social. **Jogadores:** 3–30. **Input:** `choice`.

#### Experiência
Silent Majority deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.56 Puzzle Relay

**Categoria:** Teams. **Jogadores:** 4–20. **Input:** `private+text`.

#### Experiência
Puzzle Relay deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.57 Code Break

**Categoria:** Logic. **Jogadores:** 2–12. **Input:** `grid`.

#### Experiência
Code Break deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.58 Flash Memory

**Categoria:** Memory. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Flash Memory deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.59 Lucky Door

**Categoria:** Chance. **Jogadores:** 2–20. **Input:** `choice`.

#### Experiência
Lucky Door deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


### 182.60 Party Finale

**Categoria:** Meta. **Jogadores:** 2–30. **Input:** `mixed`.

#### Experiência
Party Finale deve ser compreendido por não gamers rapidamente. A primeira ronda funciona como onboarding prático e mostra a consequência do input sem tutorial longo. Controller exibe apenas ações da fase atual.

#### Fluxo
Briefing → ready → setup com seed e anti-repetição → input privado/público adequado → lock por deadline do servidor → reveal legível → ledger de score → between-round → final.

#### Controller
Maximizar área táctil. Texto preserva draft até ACK. Choices usam cartões grandes. Submit dá feedback imediato e estado definitivo após ACK. Nunca exigir que o utilizador olhe simultaneamente para TV e telefone em reação rápida sem ensinar essa necessidade.

#### Host
Mostra contexto público, progresso agregado e timer sincronizado. Pode ocultar nomes de pendentes por privacidade. Reveal mantém informação tempo suficiente para leitura. 720p não pode truncar texto essencial.

#### Scoring/fairness
Scoring é função pura testável. Bónus de velocidade é limitado para jitter LAN não dominar. Timestamp de cliente nunca decide fairness. Empate tem regra determinística/seed registrada.

#### Reconnect
Queda durante input restaura mesma pergunta/estado e draft local quando possível. Submissão ACKed não duplica. Queda durante reveal retorna a waiting apropriada. Host continua conforme política AFK.

#### Late join e bots
Late join entra como audiência até fronteira segura. Bots, quando fizerem sentido, passam pela mesma camada de intenção lógica, são simples, offline e determinísticos; sem LLM.

#### A11y
Não depender de cor, targets grandes, reduced motion, áudio com equivalente visual, alternativa a drag não essencial, preset de timers relaxados e manifest declarando exigências de áudio/imagem/leitura/gesto.

#### Segurança
Texto é texto, nunca HTML. Limite de caracteres e rate limit. Upload segue allowlist/magic bytes/quota/storage seguro. Conteúdo de jogador pode ser moderado em modo evento.

#### Critérios de aceite
- partida no mínimo;
- máximo via simulador;
- refresh durante input;
- disconnect 10s + resume;
- duplicate eventId;
- viewport Android pequeno;
- reduced motion;
- limites de texto;
- conteúdo inválido sem crash;
- ledger final correto;
- segredo não aparece no payload público antes do reveal.


# VOLUME IX — PARTY SERVICES


## 243. Party Drop

Transferência local com progress real, bytes/total, cancel, retry, estado validating, histórico e erro acionável. Upload não desaparece ao mudar de seção. HTTP chunk/stream pode ser baseline; WebRTC DataChannel é enhancement futuro com backpressure.

## 244. RS Jukebox

Biblioteca local legalmente disponível no host, fila, votos, limite por jogador, skip host, now playing, duração, metadata/capa local, modo anti-dominação. Não integrar scraping ou bypass de serviços.

## 245. Photo Wall

Uploads ficam pending quando moderação está ativa; thumbnails; approve/reject; slideshow; reactions. Em evento público, nada novo aparece antes da política de aprovação.

## 246. Chat

Mensagens, reações, mute, slow mode e moderação. Secundário à interação presencial; não criar complexidade de threads na primeira versão.

## 247. Content Packs

Manifest versionado, locale, categorias, assets, checksums, classificação etária, compatibilidade de schema. Import não pode causar zip bomb/path traversal. Editor tem autosave, validação, preview e export local.


# VOLUME X — LAN, BROWSERS E PERFORMANCE


## 248. Entrada LAN

Host exibe QR, room code, IP/URL e ajuda. mDNS é conveniência; IP/QR é fallback universal. `rs-party doctor` verifica interfaces, IPs, porta, bind, firewall provável, DB, storage, espaço, runtime, WebSocket handshake e assets.

## 249. Browser strategy

Controller abre diretamente a origem local para evitar site público fazendo chamadas a IP privado. PWA não é requisito. Service Worker só em contexto suportado e não pode servir shell incompatível com protocolo novo.

## 250. Orçamento de recursos

Baseline server/realtime/DB ideal <300 MB RSS; app host tenta manter footprint moderado; sem VRAM dedicada. Não manter loop 60 fps em jogo textual. Assets lazy-loaded, thumbnails, áudio preloaded por fase, partículas limitadas.

## 251. Large Party

Até 30 sockets simulados: broadcast público eficiente, payload privado apenas ao destinatário, reactions rate-limited, progress updates agregados e load test automatizado.


## 252. Browser matrix

| Browser | Nível |
|---|---|

| Chrome Android | baseline controller |

| Samsung Internet | supported controller |

| Firefox Android | supported controller |

| Safari iOS | supported controller; atenção suspension |

| Chrome Windows | host/admin baseline |

| Edge Windows | host/admin supported |

| Firefox Desktop | supported |

| Safari macOS | supported |


# VOLUME XI — ACESSIBILIDADE, I18N E CONTEÚDO


## 253. Presets

Standard, Relaxed Timers, Reduced Motion, High Contrast, Large Text, Audio Reduced, Haptics Off, Color Assistance.

## 254. Idiomas

Português e inglês baseline. Strings nunca hardcoded na lógica. Usar mensagens com pluralização/contexto. IDs/room codes não são traduzidos. Conteúdo localizado pode ter variante cultural em vez de tradução literal.

## 255. Conteúdo responsável

Packs: Everyone, Teen e Adult custom/user-supplied. Nenhum conteúdo adulto explícito incluído por default. Host controla categorias e skip pode existir em prompts pessoais.


# VOLUME XII — QA MASTER


## 256. Estratégia

Unit para domínio/scoring; component para UI states; integration para HTTP/socket/DB/files; E2E multi-browser; load; chaos; visual; accessibility; release smoke. Criar player simulator capaz de N clientes, join, ready, ações válidas, disconnect e reconnect.


## 257. Catálogo funcional


### QA-0001 — Lobby 1

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0002 — Lobby 2

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0003 — Lobby 3

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0004 — Lobby 4

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0005 — Lobby 5

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0006 — Lobby 6

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0007 — Lobby 7

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0008 — Lobby 8

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0009 — Lobby 9

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0010 — Lobby 10

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0011 — Lobby 11

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0012 — Lobby 12

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0013 — Lobby 13

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0014 — Lobby 14

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0015 — Lobby 15

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0016 — Lobby 16

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0017 — Lobby 17

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0018 — Lobby 18

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0019 — Lobby 19

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0020 — Lobby 20

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0021 — Lobby 21

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0022 — Lobby 22

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0023 — Lobby 23

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0024 — Lobby 24

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0025 — Lobby 25

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0026 — Lobby 26

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0027 — Lobby 27

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0028 — Lobby 28

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0029 — Lobby 29

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0030 — Lobby 30

**Escopo:** join/ready/kick/teams/late join. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0031 — Realtime 1

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0032 — Realtime 2

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0033 — Realtime 3

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0034 — Realtime 4

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0035 — Realtime 5

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0036 — Realtime 6

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0037 — Realtime 7

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0038 — Realtime 8

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0039 — Realtime 9

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0040 — Realtime 10

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0041 — Realtime 11

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0042 — Realtime 12

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0043 — Realtime 13

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0044 — Realtime 14

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0045 — Realtime 15

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0046 — Realtime 16

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0047 — Realtime 17

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0048 — Realtime 18

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0049 — Realtime 19

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0050 — Realtime 20

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0051 — Realtime 21

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0052 — Realtime 22

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0053 — Realtime 23

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0054 — Realtime 24

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0055 — Realtime 25

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0056 — Realtime 26

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0057 — Realtime 27

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0058 — Realtime 28

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0059 — Realtime 29

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0060 — Realtime 30

**Escopo:** ACK/duplicate/delay/loss/reconnect/snapshot. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0061 — Game lifecycle 1

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0062 — Game lifecycle 2

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0063 — Game lifecycle 3

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0064 — Game lifecycle 4

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0065 — Game lifecycle 5

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0066 — Game lifecycle 6

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0067 — Game lifecycle 7

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0068 — Game lifecycle 8

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0069 — Game lifecycle 9

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0070 — Game lifecycle 10

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0071 — Game lifecycle 11

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0072 — Game lifecycle 12

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0073 — Game lifecycle 13

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0074 — Game lifecycle 14

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0075 — Game lifecycle 15

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0076 — Game lifecycle 16

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0077 — Game lifecycle 17

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0078 — Game lifecycle 18

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0079 — Game lifecycle 19

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0080 — Game lifecycle 20

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0081 — Game lifecycle 21

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0082 — Game lifecycle 22

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0083 — Game lifecycle 23

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0084 — Game lifecycle 24

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0085 — Game lifecycle 25

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0086 — Game lifecycle 26

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0087 — Game lifecycle 27

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0088 — Game lifecycle 28

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0089 — Game lifecycle 29

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0090 — Game lifecycle 30

**Escopo:** phase/timer/reveal/score/final. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0091 — Admin 1

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0092 — Admin 2

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0093 — Admin 3

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0094 — Admin 4

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0095 — Admin 5

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0096 — Admin 6

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0097 — Admin 7

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0098 — Admin 8

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0099 — Admin 9

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0100 — Admin 10

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0101 — Admin 11

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0102 — Admin 12

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0103 — Admin 13

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0104 — Admin 14

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0105 — Admin 15

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0106 — Admin 16

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0107 — Admin 17

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0108 — Admin 18

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0109 — Admin 19

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0110 — Admin 20

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0111 — Admin 21

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0112 — Admin 22

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0113 — Admin 23

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0114 — Admin 24

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0115 — Admin 25

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0116 — Admin 26

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0117 — Admin 27

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0118 — Admin 28

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0119 — Admin 29

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0120 — Admin 30

**Escopo:** auth/room/diagnostics/backup. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0121 — Uploads 1

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0122 — Uploads 2

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0123 — Uploads 3

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0124 — Uploads 4

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0125 — Uploads 5

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0126 — Uploads 6

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0127 — Uploads 7

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0128 — Uploads 8

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0129 — Uploads 9

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0130 — Uploads 10

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0131 — Uploads 11

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0132 — Uploads 12

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0133 — Uploads 13

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0134 — Uploads 14

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0135 — Uploads 15

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0136 — Uploads 16

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0137 — Uploads 17

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0138 — Uploads 18

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0139 — Uploads 19

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0140 — Uploads 20

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0141 — Uploads 21

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0142 — Uploads 22

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0143 — Uploads 23

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0144 — Uploads 24

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0145 — Uploads 25

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0146 — Uploads 26

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0147 — Uploads 27

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0148 — Uploads 28

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0149 — Uploads 29

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0150 — Uploads 30

**Escopo:** type/size/cancel/retry/quota/traversal. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0151 — Jukebox 1

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0152 — Jukebox 2

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0153 — Jukebox 3

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0154 — Jukebox 4

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0155 — Jukebox 5

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0156 — Jukebox 6

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0157 — Jukebox 7

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0158 — Jukebox 8

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0159 — Jukebox 9

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0160 — Jukebox 10

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0161 — Jukebox 11

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0162 — Jukebox 12

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0163 — Jukebox 13

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0164 — Jukebox 14

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0165 — Jukebox 15

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0166 — Jukebox 16

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0167 — Jukebox 17

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0168 — Jukebox 18

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0169 — Jukebox 19

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0170 — Jukebox 20

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0171 — Jukebox 21

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0172 — Jukebox 22

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0173 — Jukebox 23

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0174 — Jukebox 24

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0175 — Jukebox 25

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0176 — Jukebox 26

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0177 — Jukebox 27

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0178 — Jukebox 28

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0179 — Jukebox 29

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0180 — Jukebox 30

**Escopo:** enqueue/vote/skip/missing media. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0181 — Photo Wall 1

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0182 — Photo Wall 2

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0183 — Photo Wall 3

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0184 — Photo Wall 4

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0185 — Photo Wall 5

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0186 — Photo Wall 6

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0187 — Photo Wall 7

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0188 — Photo Wall 8

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0189 — Photo Wall 9

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0190 — Photo Wall 10

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0191 — Photo Wall 11

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0192 — Photo Wall 12

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0193 — Photo Wall 13

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0194 — Photo Wall 14

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0195 — Photo Wall 15

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0196 — Photo Wall 16

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0197 — Photo Wall 17

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0198 — Photo Wall 18

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0199 — Photo Wall 19

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0200 — Photo Wall 20

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0201 — Photo Wall 21

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0202 — Photo Wall 22

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0203 — Photo Wall 23

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0204 — Photo Wall 24

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0205 — Photo Wall 25

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0206 — Photo Wall 26

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0207 — Photo Wall 27

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0208 — Photo Wall 28

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0209 — Photo Wall 29

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0210 — Photo Wall 30

**Escopo:** pending/approve/reject/slideshow. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0211 — Chat 1

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0212 — Chat 2

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0213 — Chat 3

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0214 — Chat 4

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0215 — Chat 5

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0216 — Chat 6

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0217 — Chat 7

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0218 — Chat 8

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0219 — Chat 9

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0220 — Chat 10

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0221 — Chat 11

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0222 — Chat 12

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0223 — Chat 13

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0224 — Chat 14

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0225 — Chat 15

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0226 — Chat 16

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0227 — Chat 17

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0228 — Chat 18

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0229 — Chat 19

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0230 — Chat 20

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0231 — Chat 21

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0232 — Chat 22

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0233 — Chat 23

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0234 — Chat 24

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0235 — Chat 25

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0236 — Chat 26

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0237 — Chat 27

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0238 — Chat 28

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0239 — Chat 29

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0240 — Chat 30

**Escopo:** sanitize/rate limit/mute/reconnect. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0241 — Content Packs 1

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0242 — Content Packs 2

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0243 — Content Packs 3

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0244 — Content Packs 4

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0245 — Content Packs 5

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0246 — Content Packs 6

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0247 — Content Packs 7

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0248 — Content Packs 8

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0249 — Content Packs 9

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0250 — Content Packs 10

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0251 — Content Packs 11

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0252 — Content Packs 12

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0253 — Content Packs 13

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0254 — Content Packs 14

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0255 — Content Packs 15

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0256 — Content Packs 16

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0257 — Content Packs 17

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0258 — Content Packs 18

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0259 — Content Packs 19

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0260 — Content Packs 20

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0261 — Content Packs 21

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0262 — Content Packs 22

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0263 — Content Packs 23

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0264 — Content Packs 24

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0265 — Content Packs 25

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0266 — Content Packs 26

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0267 — Content Packs 27

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0268 — Content Packs 28

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0269 — Content Packs 29

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0270 — Content Packs 30

**Escopo:** schema/checksum/enable/rollback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0271 — Persistence 1

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0272 — Persistence 2

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0273 — Persistence 3

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0274 — Persistence 4

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0275 — Persistence 5

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0276 — Persistence 6

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0277 — Persistence 7

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0278 — Persistence 8

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0279 — Persistence 9

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0280 — Persistence 10

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0281 — Persistence 11

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0282 — Persistence 12

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0283 — Persistence 13

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0284 — Persistence 14

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0285 — Persistence 15

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0286 — Persistence 16

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0287 — Persistence 17

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0288 — Persistence 18

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0289 — Persistence 19

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0290 — Persistence 20

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0291 — Persistence 21

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0292 — Persistence 22

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0293 — Persistence 23

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0294 — Persistence 24

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0295 — Persistence 25

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0296 — Persistence 26

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0297 — Persistence 27

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0298 — Persistence 28

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0299 — Persistence 29

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0300 — Persistence 30

**Escopo:** restart/WAL/migration/backup/restore. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0301 — Accessibility 1

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0302 — Accessibility 2

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0303 — Accessibility 3

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0304 — Accessibility 4

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0305 — Accessibility 5

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0306 — Accessibility 6

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0307 — Accessibility 7

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0308 — Accessibility 8

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0309 — Accessibility 9

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0310 — Accessibility 10

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0311 — Accessibility 11

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0312 — Accessibility 12

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0313 — Accessibility 13

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0314 — Accessibility 14

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0315 — Accessibility 15

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0316 — Accessibility 16

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0317 — Accessibility 17

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0318 — Accessibility 18

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0319 — Accessibility 19

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0320 — Accessibility 20

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0321 — Accessibility 21

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0322 — Accessibility 22

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0323 — Accessibility 23

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0324 — Accessibility 24

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0325 — Accessibility 25

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0326 — Accessibility 26

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0327 — Accessibility 27

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0328 — Accessibility 28

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0329 — Accessibility 29

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0330 — Accessibility 30

**Escopo:** keyboard/focus/target/motion/zoom. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0331 — Localization 1

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0332 — Localization 2

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0333 — Localization 3

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0334 — Localization 4

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0335 — Localization 5

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0336 — Localization 6

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0337 — Localization 7

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0338 — Localization 8

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0339 — Localization 9

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0340 — Localization 10

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0341 — Localization 11

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0342 — Localization 12

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0343 — Localization 13

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0344 — Localization 14

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0345 — Localization 15

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0346 — Localization 16

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0347 — Localization 17

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0348 — Localization 18

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0349 — Localization 19

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0350 — Localization 20

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0351 — Localization 21

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0352 — Localization 22

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0353 — Localization 23

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0354 — Localization 24

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0355 — Localization 25

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0356 — Localization 26

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0357 — Localization 27

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0358 — Localization 28

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0359 — Localization 29

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0360 — Localization 30

**Escopo:** PT/EN/long string/fallback. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0361 — Performance 1

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0362 — Performance 2

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0363 — Performance 3

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0364 — Performance 4

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0365 — Performance 5

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0366 — Performance 6

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0367 — Performance 7

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0368 — Performance 8

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0369 — Performance 9

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0370 — Performance 10

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0371 — Performance 11

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0372 — Performance 12

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0373 — Performance 13

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0374 — Performance 14

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0375 — Performance 15

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0376 — Performance 16

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0377 — Performance 17

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0378 — Performance 18

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0379 — Performance 19

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0380 — Performance 20

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0381 — Performance 21

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0382 — Performance 22

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0383 — Performance 23

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** estado persistido após restart. **Ação:** usar caminho acessível alternativo. **Esperado:** resultado funcional equivalente.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0384 — Performance 24

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sessão limpa com dois clientes. **Ação:** repetir intenção com mesmo eventId. **Esperado:** efeito único sem duplicação.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0385 — Performance 25

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** sala ativa com quatro jogadores. **Ação:** interromper conectividade e restaurar. **Esperado:** recuperação por delta/snapshot.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0386 — Performance 26

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** cliente com resumeToken válido. **Ação:** refresh após submit. **Esperado:** estado confirmado sem fantasma.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0387 — Performance 27

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** host 720p + controller estreito. **Ação:** usar valor limite e fora do limite. **Esperado:** válido aceito e inválido rejeitado sem crash.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


### QA-0388 — Performance 28

**Escopo:** 30 clients/reactions/soak. **Pré-condição:** rede degradada artificialmente. **Ação:** suspender/retomar antes do deadline. **Esperado:** timer do servidor continua correto.

**Evidência:** teste automatizado quando possível, log técnico e screenshot apenas quando útil. Falhar se houver erro não tratado associado ao fluxo.


