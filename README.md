# RS Party Hub

> **Liga ao Wi‑Fi, abre o navegador, entra na sala e joga.**

Plataforma local-first de party games: um PC anfitrião serve a aplicação pela rede local; os telemóveis dos jogadores tornam-se controladores privados via navegador — sem contas, sem Internet, sem instalação.

![status](https://img.shields.io/badge/testes-150%2F150-brightgreen) ![stack](https://img.shields.io/badge/Node-22.16%2B-blue)

## Arranque rápido

```bash
# requisitos: Node.js >= 22.16, corepack (incluído no Node)
corepack enable
pnpm install

# iniciar o servidor (porta 3210 por defeito)
pnpm --filter @rs-party/server dev
```

Depois:

| Papel | Endereço |
|---|---|
| Anfitrião (palco + QR) | `http://localhost:3210/host` |
| Jogadores (mesma rede Wi‑Fi) | QR mostrado no palco ou `http://<IP-do-host>:3210` |
| Administração | `http://localhost:3210/admin` (token opcional) |

Funciona em HTTP local de propósito — núcleo 100% operável sem HTTPS nem Internet (spec §7).

## Jogos incluídos (P0)

| Jogo | Tipo | Controlador |
|---|---|---|
| Quiz Rush | trivia com streak | escolhas |
| Buzzer Arena | buzzer com juiz | botão gigante |
| Majority Vote | previsão social | voto secreto |
| Live Bingo | cartelas seeded | grelha |
| Bluff Battle | enganar com bluffes | texto + voto |
| Draw & Guess | desenho e adivinhação | canvas + texto |
| Charades | mímica com palavra secreta | tap (ator) |
| Spy Room | dedução social | cartas + voto |
| Hot Potato | batata quente com fusível secreto | tap |
| Survey Says | respostas populares | texto |

## Arquitetura

```text
apps/
  server/          Fastify + Socket.IO + node:sqlite (autoridade única)
  server/public/   Frontend vanilla ES-modules servido na mesma origem
packages/
  protocol/        Schemas Zod, envelopes, códigos de erro, contratos de vistas
  persistence/     SQLite (WAL), migrations versionadas, repositories tipados
  game-engine/     Contrato de plugins, PRNG seeded, clock, registry, harness
  games/*          Um pacote por jogo (plugin puro + testes determinísticos)
```

Princípios (spec): servidor autoritativo; aleatoriedade só seeded no servidor; ACK para ações críticas; idempotência por `eventId`; snapshots filtrados por papel (segredos nunca no payload público); reconexão por token sem duplicar jogador; broadcasts coalescidos (50 ms) para escala 30 clientes.

## Scripts úteis

```bash
pnpm test                                   # suite completa (vitest)
pnpm verify                                 # typecheck + test (CI gate)
pnpm -r typecheck                           # tsc --noEmit em todos os pacotes
pnpm test:load                              # simulação de carga (30 clientes)
pnpm doctor                                 # diagnóstico pré-festa
./scripts/verify.sh                         # checklist limpa Etapa 24
# Docker
docker build -t rs-party-hub . && docker run -p 3210:3210 -v rs-party-data:/data rs-party-hub
docker compose up --build
```

## Configuração

Ver `.env.example`. Diretório de dados: `RS_PARTY_HOME` (default `./.rs-party-home`, nunca commitado). A pasta `library/` nunca é apagada pela app; `temp/` é limpo por TTL de 24 h.

## Documentação adicional

- `IMPLEMENTATION_REPORT.md` — evidências reais de implementação, testes e carga
- `docs/SPEC_GAP_MATRIX.md` — matriz factual de requisitos, lacunas e gates de release (não é declaração de conclusão)
- `CHANGELOG.md` — histórico de versões
- `SECURITY.md` + `docs/NETWORKING.md` + `docs/TROUBLESHOOTING.md` — hardening, rede e diagnóstico
- `docs/adr/` — 8 ADRs (autoridade, Socket.IO, SQLite, frontend, LAN core, same-origin, WebRTC opcional, plugin engine)
- Specs completas: `/home/ubuntu/specs-archive/RSPartyHub/RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC_400P_PART_{1..4}_OF_4.md`
