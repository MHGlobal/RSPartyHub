# Testes

## Ambiente com poucos recursos

Este projeto executa a validação automatizada de forma headless, sem automação de
browser. Em particular, **Playwright não está configurado, instalado ou executado**
neste repositório enquanto o ambiente de execução estiver limitado a 1 GB de RAM.

Execute a suite suportada com:

```bash
pnpm test:headless
pnpm typecheck
```

`pnpm verify` combina ambos os comandos.

## Limite de cobertura atual

Os testes cobrem o servidor, protocolo e motores de jogo através de Vitest e
clientes Socket.IO. Eles não são E2E de interface: não criam contextos de browser
isolados e não validam fluxos visuais de anfitrião/jogador, refresh/reconexão de
browser ou a UI de sala inválida.

Não deve ser declarado que Chromium, Firefox ou WebKit passaram testes E2E. Uma
base E2E real para estes cenários exige uma decisão posterior para permitir uma
ferramenta de browser e recursos suficientes para a executar.
