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

## Cobertura E2E atual

`e2e/party-flow.spec.ts` corre somente em Chromium e cobre:

- criação de sala pelo anfitrião;
- entrada de jogador a partir de um contexto isolado;
- feedback para uma sala inexistente;
- refresh do jogador com retoma da identidade, sem criar duplicado.

O servidor E2E usa `RS_PARTY_HOME=.rs-party-e2e`, porta `3211` e mDNS desligado;
os seus dados são descartáveis e não são usados pela execução normal.
