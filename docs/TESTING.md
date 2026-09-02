# Testes

## Suites

O projeto tem validação unitária/integração via Vitest e E2E real de browser com
Playwright Chromium. O comando E2E inicia o servidor local numa porta dedicada e
exerce a aplicação através de contextos de browser isolados.

Execute a suite suportada com:

```bash
pnpm test:headless
pnpm typecheck
pnpm test:e2e
```

`pnpm verify` combina typecheck e Vitest; execute `pnpm test:e2e` separadamente
para a validação do browser.

## Instalação do Chromium

Depois de `pnpm install`, instale o browser gerido pela versão bloqueada de
Playwright com o comando abaixo (inclui as dependências de sistema em Debian/Ubuntu):

```bash
pnpm exec playwright install --with-deps chromium
```

Em CI, o workflow executa o mesmo comando antes de `pnpm test:e2e`. Não assuma
que um Chromium instalado globalmente é compatível com a versão de Playwright do
repositório.

## Cobertura E2E atual

`e2e/party-flow.spec.ts` corre somente em Chromium e cobre:

- criação de sala pelo anfitrião;
- entrada de jogador a partir de um contexto isolado;
- feedback para uma sala inexistente;
- refresh do jogador com retoma da identidade, sem criar duplicado.
- prefill de código por `/join/:roomCode` e entrega da página `/admin`.

O servidor E2E usa `RS_PARTY_HOME=.rs-party-e2e`, porta `3211` e mDNS desligado.
O setup e teardown globais removem esse diretório antes e depois de cada execução,
para que salas e SQLite não sejam reutilizados entre execuções.
