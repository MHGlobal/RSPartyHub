# RS Party Hub — Especificação Master + Prompt One‑Shot para OpenCode

**Versão do documento:** 3.0 — Master Engineering & Design Edition 400+ páginas
**Data de referência:** 23 de agosto de 2026  
**Idioma principal:** Português  
**Produto:** RS Party Hub  
**Tipo:** Aplicação local-first de entretenimento multiplayer via Wi‑Fi/hotspot  
**Saída esperada do agente:** produto funcional, testado, empacotado e documentado — não apenas protótipo visual.
**Dimensão desta edição:** 200.080 palavras; 31.946 linhas; concebida para ultrapassar 400 páginas A4 quando renderizada com formatação técnica normal.

> Este documento é simultaneamente PRD, arquitetura, contrato técnico, especificação UX, protocolo multiplayer, catálogo inicial de jogos, plano de testes, checklist de release e **prompt operacional one-shot**. O OpenCode deve tratá-lo como fonte de verdade. Em conflitos entre conveniência de implementação e os requisitos abaixo, prevalecem os requisitos.

---

## 0. ORDEM EXECUTIVA PARA O OPENCODE — LEIA ANTES DE QUALQUER CÓDIGO

Você é o engenheiro principal responsável por construir **RS Party Hub** de ponta a ponta. Trabalhe de modo autónomo. Não interrompa o fluxo para pedir decisões que possam ser tomadas com segurança a partir desta especificação. Quando existir ambiguidade não crítica, escolha a opção que maximize: funcionamento offline/LAN, simplicidade para o jogador, estabilidade em Android, baixo consumo, manutenção futura e verificabilidade.

### 0.1 Resultado obrigatório

Entregar uma aplicação que possa ser iniciada num PC Windows/Linux ou, posteriormente, num host Android, crie/aceite uma rede local existente, sirva uma interface web e permita que vários telemóveis entrem pelo navegador usando QR code, endereço local ou código de sala. A experiência deve funcionar **sem Internet** depois de instaladas as dependências no host.

### 0.2 Regra “feito significa feito”

Não declare uma funcionalidade concluída só porque existe um componente, rota, botão, mock ou função. Uma funcionalidade só é “DONE” quando:

1. existe na interface correta;
2. o fluxo completo funciona de ponta a ponta;
3. há validação de entrada e tratamento de erro;
4. persiste quando a especificação exige persistência;
5. funciona após refresh/reconexão quando aplicável;
6. foi coberta por teste automatizado adequado;
7. foi exercitada por teste E2E ou script de smoke test;
8. não quebra funcionalidades existentes;
9. não depende de Internet para executar no modo LAN;
10. está documentada.

### 0.3 Comportamento one-shot

- Faça inventário do repositório e ambiente primeiro.
- Se o repositório ainda não existir, crie estrutura própria `RS-Party-Hub`; não use template-lab como prisão arquitetural.
- Implemente por fatias verticais funcionais, mas continue até a Definition of Done global.
- Execute lint, typecheck, unit tests, integration tests, E2E e build em ciclos sucessivos.
- Corrija falhas encontradas; não as liste apenas.
- Não esconda exceções com `try/catch` vazio.
- Não substitua funcionalidades por mocks no build final.
- Não desative testes para fazer a pipeline ficar verde.
- Não remova uma feature anterior para “resolver” incompatibilidade sem oferecer substituição equivalente ou superior.
- Mantenha logs úteis e produza no final um `IMPLEMENTATION_REPORT.md` com evidências reais.
- Gere `CHANGELOG.md`, `README.md`, `.env.example`, documentação de arquitetura e instruções de operação local.
- O resultado deve arrancar com um comando simples e previsível.

### 0.4 Prioridades de engenharia

1. **Funcionalidade real** sobre animação decorativa.
2. **LAN/offline** sobre dependência cloud.
3. **Reconexão e consistência** sobre otimizações prematuras.
4. **Interface mobile-first** para jogadores; **big-screen-first** para host.
5. **Baixo consumo** sobre frameworks desnecessariamente pesados.
6. **Servidor autoritativo** sobre lógica crítica no cliente.
7. **Privacidade local** sobre contas e tracking.
8. **Graceful degradation** quando APIs de navegador exigirem HTTPS.
9. **Conteúdo extensível por ficheiros/packs** sobre hardcode.
10. **Testes de comportamento** sobre screenshots bonitas.

---

# 1. VISÃO DO PRODUTO

## 1.1 O que é o RS Party Hub

RS Party Hub é uma plataforma de festa e entretenimento local em que **o Wi‑Fi é o meio principal de jogo**. Um PC, mini-PC ou dispositivo anfitrião executa o servidor. Os convidados conectam-se à mesma rede Wi‑Fi/hotspot e abrem o endereço local no navegador. Não precisam instalar app, criar conta ou usar dados móveis.

O host pode utilizar um monitor, TV ou projetor como “palco” comum. O telemóvel de cada jogador torna-se um **controlador privado e contextual**: buzzer, teclado, quadro de desenho, cartas secretas, voto, joystick touch, seletor, microfone opcional, fotografia opcional ou painel de reação. Alguns modos funcionam sem ecrã central; nesses, cada telefone recebe apenas a informação privada necessária e o jogo acontece socialmente à mesa.

A aplicação não é um clone de um único produto. Deve combinar os melhores padrões observados em plataformas de party games, jogos browser-first e ferramentas local-first:

- entrada sem conta e por código/QR;
- telemóveis como controladores;
- ecrã central como palco quando faz sentido;
- informação secreta no ecrã individual;
- sessões rápidas e pouca fricção;
- jogos curtos, variados e misturáveis;
- suporte a entrada tardia e reconexão;
- reações, power-ups e “game juice” sem sacrificar clareza;
- partilha local de fotografias/ficheiros para modos sociais;
- biblioteca e conteúdo administrável;
- funcionamento totalmente local.

## 1.2 Proposta de valor

**“Liga ao Wi‑Fi, abre o navegador, entra na sala e joga.”**

O produto deve ser suficientemente simples para uma pessoa não técnica entrar numa partida em menos de 30 segundos, mas suficientemente completo para suportar noites inteiras de jogos e futuras expansões.

## 1.3 Pilares

### P1 — Zero-friction join
Nenhuma conta. QR grande. Código curto. Nome/avatar. Entrou.

### P2 — Local-first de verdade
Depois da instalação do host, uma festa deve continuar mesmo com o cabo da Internet desligado e dados móveis desligados.

### P3 — Shared screen + private controller
O ecrã grande mostra o que todos podem ver. Segredos e ações privadas ficam no telefone.

### P4 — Party Mix
Um modo automático encadeia minijogos, pontuações, bónus e eventos surpresa sem obrigar o host a voltar ao menu a cada ronda.

### P5 — Reentrada sem drama
Wi‑Fi doméstico oscila. Android suspende abas. Jogadores mudam de app. A sessão deve recuperar identidade, pontuação e estado sempre que possível.

### P6 — Conteúdo modular
Perguntas, desafios, palavras, músicas, imagens e packs devem ser adicionáveis sem recompilar todo o sistema.

### P7 — Diversão mensurável
Telemetria local opcional deve indicar duração de lobby, abandonos, jogos mais repetidos, round completion e erros — sem enviar dados para terceiros.

---

# 2. PESQUISA DE REFERÊNCIA E LIÇÕES A INCORPORAR

A pesquisa foi feita em documentação oficial, projetos open source, comunidades e aplicações atuais. As referências servem para aprender padrões; não copiar assets, textos, marcas nem código incompatível.

## 2.1 Jackbox Games — padrão “big screen + phone controller”

Padrões observados:

- apenas o host executa o jogo principal;
- jogadores entram pelo browser;
- código curto de sala reduz fricção;
- telefone funciona como controlador;
- ecrã grande concentra o espetáculo;
- salas protegidas/senhas reduzem trolling;
- timers configuráveis ajudam em condições de rede/remote play.

**Aplicar:** código curto, QR, telefone como superfície privada, lobby central, opção de sala protegida e timers acessíveis.

**Não copiar:** branding, personagens, perguntas, regras proprietárias ou UI específica.

## 2.2 AirConsole — telefone não deve ser apenas “gamepad genérico”

A documentação para developers da AirConsole enfatiza que smartphones permitem controlos únicos: informação secreta, giroscópio e interfaces contextuais. Isto é essencial para RS Party Hub. O controlador muda conforme o jogo, em vez de mostrar sempre D-pad + botões.

**Aplicar:** controller schema por jogo, layouts touch adaptativos, sensores opcionais com fallback.

## 2.3 Kahoot — join por PIN/QR e feedback imediato

O modelo de PIN temporário, QR e nickname sem conta demonstra que onboarding rápido funciona em grupos grandes. A existência de mecanismos anti-bot/segunda etapa também mostra que códigos visíveis podem ser abusados.

**Aplicar:** PIN/código + QR; modo “join confirmation” opcional; host pode bloquear sala após começar.

## 2.4 Huddle — telefones como “mãos secretas” sem TV

Huddle explora jogos em que o telefone é o próprio componente secreto e a mesa é o tabuleiro social. Isso evita dependência total de TV e permite jogar em qualquer lugar.

**Aplicar:** modo `Table Mode`, no qual o host só coordena e cada jogador recebe papel/segredo no aparelho.

## 2.5 Blip Party / Phones Out — catálogo amplo e acesso em segundos

Projetos atuais reforçam três expectativas: catálogo variado, browser-only e entrada em poucos segundos. Isto favorece um motor comum de sessões + plugins de jogos, não 30 aplicações independentes.

## 2.6 PixReveal — late join, power-ups, emotes e game juice

A evolução pública do PixReveal em 2026 mostra melhorias práticas relevantes: entrada numa partida já em curso, QR persistente, power-ups, emotes no ecrã central, bónus, títulos pós-jogo, sudden death e “juice” audiovisual.

**Aplicar:** late join controlado, reações limitadas, power-ups em jogos adequados, resultados com títulos, desempate determinístico.

## 2.7 PairDrop/Snapdrop — partilha local cross-platform

PairDrop e Snapdrop demonstram que browser + WebRTC/WebSocket + Node podem fornecer partilha local entre plataformas. PairDrop também mostra valor de QR, rooms, nomes de dispositivos, indicadores de progresso, preview de media e persistência via IndexedDB.

**Aplicar:** um subsistema simples de “Party Drop” para fotografias, clips e ficheiros utilizados por jogos. Para confiabilidade em LAN, o servidor pode ser relay/persistência; WebRTC deve ser otimização, não requisito de funcionamento.

## 2.8 Socket.IO — recuperação e garantias explícitas

A documentação de Socket.IO deixa claro que:

- ordenação das mensagens é garantida;
- a entrega por defeito é `at most once`;
- recuperação de estado ajuda após desconexões temporárias, mas pode falhar;
- sincronização completa continua necessária;
- rooms são um conceito apropriado para broadcast por sessão.

**Aplicar:** eventos idempotentes, ACKs para ações críticas, sequence numbers, snapshot completo na reconexão e servidor autoritativo.

## 2.9 Web platform — progressive enhancement

Service Worker, Wake Lock, orientação do aparelho e algumas APIs modernas exigem contexto seguro (HTTPS) em vários browsers. Portanto o produto não pode exigir essas APIs para o seu núcleo em `http://IP_LOCAL`.

**Aplicar:** core sobre HTTP local + WebSocket; HTTPS local opcional; features que exigem secure context aparecem apenas após capability detection e possuem fallback.

## 2.10 Chrome Local Network Access

Chromium recente introduziu permissões específicas para acessos à rede local, sobretudo quando uma página pública tenta atingir IPs privados. A arquitetura RS evita o maior problema servindo **frontend e realtime pelo mesmo host/origin local**. O jogador abre diretamente o servidor LAN; não carregamos uma aplicação pública que depois tenta descobrir o PC.

## 2.11 OWASP — WebSocket e upload

WebSockets persistentes exigem validação de origem, autorização por mensagem, limites de tamanho, rate limiting, heartbeats e logging. Uploads precisam allowlist, filename seguro, limite de tamanho, armazenamento fora do webroot e validação real do conteúdo.

Essas proteções são obrigatórias mesmo numa LAN: uma rede local não deve ser tratada como rede confiável.

---

# 3. POSICIONAMENTO E ESCOPO

## 3.1 Casos principais

1. Festa em casa com 3–12 pessoas.
2. Igreja/grupo comunitário com quizzes e bingo em ambiente apropriado.
3. Team building no escritório.
4. Viagem/hotel/campo sem Internet.
5. Família num hotspot Android.
6. Sala com TV/monitor e PC host.
7. Mesa sem TV usando `Table Mode`.
8. Pequeno evento até 30 participantes para quizzes/votações leves.

## 3.2 Escala alvo v1

- Ideal: 2–12 jogadores ativos.
- Suportado: 1 host + 20 jogadores em jogos leves.
- Stretch target: 30 jogadores para quiz/poll/bingo sem canvas pesado.
- Uma instância pode manter múltiplas salas, mas UX v1 otimiza uma festa por host.

## 3.3 Não objetivos v1

- matchmaking público global;
- streaming de vídeo em larga escala;
- rede social permanente;
- contas cloud obrigatórias;
- pagamentos;
- DRM;
- chat anónimo público na Internet;
- cópia de jogos comerciais protegidos;
- IA generativa como dependência do gameplay;
- servidor distribuído/cluster obrigatório.

## 3.4 Conteúdo e classificação

O produto deve ter perfis de conteúdo:

- `family`: apropriado para família;
- `teen`: humor moderado;
- `adult`: conteúdo mais maduro, mas sem conteúdo ilegal ou explícito fornecido por defeito;
- `custom`: packs do utilizador.

O host escolhe o perfil e pode bloquear categorias individualmente. Verdade/Desafio deve possuir filtros de segurança e possibilidade de saltar sem penalização.

---

# 4. PERSONAS E JORNADAS

## 4.1 Host casual

Quer iniciar rapidamente sem conhecer IPs, portas ou redes. Precisa ver claramente:

- nome da rede;
- endereço de acesso;
- QR;
- código da sala;
- número de jogadores;
- estado do servidor;
- botão “Começar”.

## 4.2 Jogador casual

Abre a câmara, lê QR, escolhe nome/avatar e está pronto. Nunca deve precisar entender WebSocket, IP ou instalação.

## 4.3 Administrador

Configura biblioteca, packs de perguntas, playlists locais, limites de upload, idioma, branding, segurança, permissões e logs.

## 4.4 Facilitador

Em escola/igreja/empresa quer criar quiz/votação/bingo e controlar ritmo, mas não necessariamente ter acesso total ao sistema.

## 4.5 Jornada feliz — 30 segundos

1. Host inicia `rs-party`.
2. Dashboard mostra `RS Party Hub pronto`.
3. Host abre `Criar festa`.
4. Sistema gera código de 4–6 caracteres sem caracteres ambíguos.
5. TV mostra QR + código + endereço local.
6. Jogador lê QR.
7. Página detecta sala automaticamente.
8. Jogador escolhe nickname e avatar.
9. Host vê card entrar com animação curta.
10. Todos marcam “pronto” ou host força início.
11. Party Mix inicia.

## 4.6 Jornada de falha

Se QR não funcionar:

- mostrar IP local em fonte grande;
- mostrar alternativa `.local` quando mDNS resolver;
- mostrar código manual;
- detectar se cliente está noutra rede e explicar em linguagem simples;
- fornecer botão `Copiar endereço` no host;
- QR deve codificar URL completa para evitar digitação.

---

# 5. ARQUITETURA DE ALTO NÍVEL

## 5.1 Princípio: um origin local

A solução principal deve ser:

```text
                       Wi‑Fi / Hotspot / LAN

              ┌────────────────────────────────┐
              │            HOST                │
              │                                │
              │  Node.js / TypeScript server   │
              │  REST + Socket.IO              │
              │  SQLite                        │
              │  Media/content storage         │
              │  Static web app                │
              └──────────────┬─────────────────┘
                             │
               http://192.168.x.x:3210
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       Phone A            Phone B            TV/PC
       Player             Player             Host Stage
```

Frontend e socket ficam na mesma origem sempre que possível. Isso reduz CORS, simplifica cookies/tokens e evita a arquitetura frágil “site público → servidor privado”.

## 5.2 Stack recomendada

### Monorepo
- `pnpm` workspaces.
- TypeScript `strict`.
- Node.js 22+ LTS-compatible.

### Apps
- `apps/server` — Fastify ou HTTP server equivalente + Socket.IO.
- `apps/web` — React + Vite, build estático servido pelo server.
- `apps/e2e` ou testes Playwright no root.

### Packages
- `packages/protocol` — schemas Zod + tipos de eventos.
- `packages/game-engine` — state machine e interfaces de plugin.
- `packages/games/*` — jogos individuais.
- `packages/ui` — design system.
- `packages/content` — loaders/validators de packs.
- `packages/test-utils` — fixtures e simuladores de jogadores.

### Persistência
- SQLite local.
- Drizzle ORM ou camada SQL tipada simples.
- Migrations versionadas.
- WAL habilitado quando seguro.

### Estado frontend
- Zustand ou store mínima equivalente.
- TanStack Query apenas para REST que realmente se beneficie; realtime permanece no layer de socket.

### Styling
- Tailwind CSS ou CSS variables + utility layer.
- Sem CDN. Fonts, icons e assets empacotados localmente.

### Testes
- Vitest.
- Playwright.
- Supertest/light-my-request para APIs.
- Simulador de 20–30 socket clients para carga.

## 5.3 Por que não cloud-first

O produto deve funcionar em redes sem Internet. Qualquer serviço externo para realtime, analytics, autenticação, fontes, imagens ou QR é proibido no caminho crítico.

## 5.4 Por que não WebRTC como único transporte

WebRTC é excelente para P2P e ficheiros, mas introduz signaling, compatibilidade e casos NAT. Dentro da LAN, o servidor já existe e é fonte de verdade. Use Socket.IO como backbone. WebRTC pode acelerar transferências grandes em Party Drop, mas deve recair para HTTP/socket relay.

---

# 6. REQUISITOS DE REDE E DESCOBERTA

## 6.1 Redes suportadas

- router Wi‑Fi doméstico;
- hotspot Android;
- Windows Mobile Hotspot;
- access point dedicado;
- Ethernet no host + Wi‑Fi nos clientes, desde que mesma LAN/subrede permita comunicação;
- rede local sem gateway Internet.

## 6.2 Bind

Servidor deve escutar por defeito em `0.0.0.0` numa porta configurável, default `3210`. Nunca limitar a `127.0.0.1` no modo party.

## 6.3 Descoberta de endereço

No arranque:

1. enumerar interfaces;
2. ignorar loopback e interfaces virtualizadas irrelevantes;
3. priorizar IPv4 privada ativa;
4. listar todas opções se houver ambiguidade;
5. gerar QR para a interface escolhida;
6. permitir troca manual no Admin.

## 6.4 mDNS

Tentar anunciar `rsparty.local` via mDNS/Bonjour. Nunca depender disso. Muitos hotspots e redes bloqueiam multicast. A interface sempre mantém IP literal e QR como fallback.

## 6.5 QR

Gerar QR localmente. O payload deve ser algo como:

`http://<host>:3210/join/<roomCode>?t=<shortJoinToken>`

O token não precisa ser segredo de longo prazo; serve para reduzir entrada acidental e permitir fluxo direto. Salas privadas usam PIN/senha adicional.

## 6.6 Captive portal

Não assumir que routers permitirão captive portal customizado. Pode haver um módulo Android futuro para `LocalOnlyHotspot`, mas v1 deve funcionar sem controlar o hotspot. Não usar DNS hijacking por defeito.

## 6.7 Client isolation

Se os aparelhos conseguem acessar o host, o jogo funciona mesmo que clientes não consigam falar diretamente entre si. Esta é outra razão para o servidor central. WebRTC P2P deve detectar falha e cair para relay.

## 6.8 Internet presente vs ausente

A interface deve indicar apenas:

- `LAN: ligada`;
- `Internet: disponível/não disponível`;
- `Jogo local: pronto`.

Não tratar ausência de Internet como erro.

---

# 7. HTTP, HTTPS E PROGRESSIVE ENHANCEMENT

## 7.1 Núcleo precisa funcionar em HTTP local

As seguintes funcionalidades NÃO podem exigir secure context:

- entrar na sala;
- socket realtime;
- responder quiz;
- buzzer;
- votar;
- drawing canvas por touch/pointer;
- chat/reactions;
- scoreboard;
- admin básico;
- uploads HTTP;
- playback local no host.

## 7.2 Features condicionais

Estas podem exigir HTTPS/secure context em alguns browsers:

- Screen Wake Lock;
- Device Orientation/Motion;
- microphone capture;
- camera capture;
- algumas APIs de Share/Clipboard;
- service worker/PWA em origem não-localhost.

Implementar `CapabilityService` no cliente:

```ts
interface ClientCapabilities {
  secureContext: boolean;
  wakeLock: boolean;
  deviceOrientation: boolean;
  vibration: boolean;
  camera: boolean;
  microphone: boolean;
  webShare: boolean;
  webRTC: boolean;
  indexedDB: boolean;
}
```

O servidor recebe capabilities e cada jogo escolhe fallback.

## 7.3 HTTPS local opcional

Fornecer documentação e modo experimental para certificado local, mas não tornar necessário. Um certificado self-signed cria fricção em convidados e não deve bloquear party mode.

---

# 8. MODELO DE PROCESSO E CONSUMO

## 8.1 Meta de recursos

Host de referência: PC com 8 GB RAM e CPU integrada comum.

Metas:

- servidor idle: < 180 MB RSS quando possível;
- sessão 10 jogadores: < 300 MB no backend excluindo cache de media;
- frontend jogador carregado: bundle inicial comprimido ideal < 600 KB JS, lazy-load por jogo;
- CPU idle: ~0–2%;
- ausência de GPU dedicada como requisito;
- storage base do app sem packs pesados: < 1 GB;
- DB deve permanecer pequena; media em diretório dedicado.

## 8.2 Estratégia

- lazy import dos módulos de jogo;
- evitar carregar 30 jogos simultaneamente no cliente;
- sprites e áudio comprimidos;
- não embutir vídeo grande no bundle;
- thumbnails geradas em background controlado;
- limpeza de temp por TTL;
- biblioteca persistente nunca apagada automaticamente;
- logs rotacionados.

## 8.3 Diretórios

```text
RS_PARTY_HOME/
  config/
  data/
    rsparty.sqlite
  library/
    games/
    quizzes/
    audio/
    images/
    videos/
    packs/
  uploads/
    approved/
  temp/
  logs/
  backups/
```

**Regra:** `library/` nunca deve ser apagada pelo app. Se não existir, criar. Temp pode ser limpo por TTL.

---

# 9. MODELO DE DOMÍNIO

## 9.1 Entidades principais

### PartyRoom
- id UUID interno;
- code curto humano;
- createdAt;
- status: `LOBBY | PLAYING | PAUSED | RESULTS | CLOSED`;
- hostSessionId;
- settings;
- currentGameId;
- gameStateVersion;
- locked;
- maxPlayers;
- contentProfile.

### Player
- id UUID persistente por sessão;
- reconnectToken hash;
- nickname;
- avatarId;
- colorSeed;
- joinedAt;
- lastSeenAt;
- status;
- cumulativeScore;
- currentGameScore;
- teamId nullable;
- capabilities;
- moderation flags.

### GameInstance
- id;
- roomId;
- pluginId;
- seed;
- phase;
- round;
- state JSON versionado;
- startedAt;
- endedAt;
- result.

### ContentPack
- id;
- type;
- title;
- locale;
- rating;
- version;
- checksum;
- enabled;
- source=`builtin|local|imported`.

### MediaItem
- id;
- sha256;
- originalName sanitizado para apresentação;
- storageName UUID;
- type;
- size;
- dimensions/duration se aplicável;
- uploaderId;
- approved;
- createdAt.

### AuditEvent
- timestamp;
- severity;
- category;
- roomId optional;
- playerId pseudónimo optional;
- eventType;
- metadata sanitizada.

---

# 10. PROTOCOLO REALTIME

## 10.1 Convenção

Todos eventos possuem envelope:

```ts
type ClientEvent<T> = {
  eventId: string;        // UUID/ULID para idempotência
  roomId: string;
  playerId?: string;
  clientSeq: number;
  sentAt: number;
  type: string;
  payload: T;
};

type ServerEvent<T> = {
  eventId: string;
  roomId: string;
  serverSeq: number;
  stateVersion: number;
  sentAt: number;
  type: string;
  payload: T;
};
```

## 10.2 Ações críticas usam ACK

Obrigatório ACK para:

- join;
- ready;
- answer submission;
- buzzer;
- vote;
- drawing submit;
- admin action;
- file upload finalize;
- power-up;
- start/pause/end game.

O ACK inclui `accepted`, `reason`, `serverSeq`, `stateVersion`.

## 10.3 Idempotência

Servidor mantém uma janela de `eventId` processados por jogador. Se cliente repetir ação devido a retry, não duplicar pontos nem votos.

## 10.4 Snapshot

Evento `state:snapshot` contém estado filtrado por papel:

- host recebe visão pública + admin permitida;
- player recebe visão pública + seus segredos;
- spectator recebe apenas visão pública.

Nunca enviar segredos de outros jogadores e “esconder por CSS”.

## 10.5 Reconnect

1. cliente guarda `playerId`, `roomCode`, reconnect token e último `serverSeq`;
2. socket cai;
3. UI mostra faixa `A reconectar…` sem apagar jogo;
4. socket tenta reconectar com backoff;
5. servidor tenta connection-state recovery;
6. independentemente do sucesso, cliente solicita `state:sync`;
7. servidor valida token e envia snapshot atual;
8. jogador reassume lugar/pontos;
9. se ação teve deadline durante ausência, regra do jogo decide se pode voltar na próxima fase.

## 10.6 Late join

Cada plugin declara:

- `lateJoin: disallow | spectatorUntilRound | immediate`.

Party Mix deve preferir `spectatorUntilRound` para não prejudicar jogos em andamento.

## 10.7 Heartbeat

Socket.IO já possui ping/pong de transporte; além disso manter `player:lastSeen` sem spam. Não enviar heartbeat custom por segundo.

## 10.8 Rate limits iniciais

- join: 10/min/IP;
- nickname change: 10/min/player;
- reaction: 3/s + burst 5;
- buzzer: servidor aceita primeiro evento válido da fase;
- chat: 10 mensagens/10s;
- drawing segments: batch/throttle 20–30 fps;
- admin events: 30/min/session;
- upload: 2 simultâneos/player.

---

# 11. GAME ENGINE E PLUGIN CONTRACT

Cada jogo implementa o mesmo contrato e NÃO conversa diretamente com sockets ou DB. O engine fornece contexto.

```ts
interface PartyGamePlugin<State, PublicView, PrivateView, Action> {
  manifest: GameManifest;
  createInitialState(ctx: GameContext): State;
  getPublicView(state: State, ctx: GameContext): PublicView;
  getPrivateView(state: State, playerId: string, ctx: GameContext): PrivateView;
  validateAction(state: State, action: Action, actor: Actor, ctx: GameContext): ValidationResult;
  reduce(state: State, action: Action, actor: Actor, ctx: GameContext): State;
  tick?(state: State, now: number, ctx: GameContext): State;
  isFinished(state: State, ctx: GameContext): boolean;
  score(state: State, ctx: GameContext): ScoreResult;
  serialize(state: State): unknown;
  deserialize(value: unknown): State;
}
```

## 11.1 Manifest

Inclui:

- `id`, `name`, `description`;
- min/max players;
- duração média;
- tags;
- content rating;
- requiresBigScreen;
- supportsTableMode;
- capabilities requeridas e fallbacks;
- lateJoin policy;
- spectator support;
- team support;
- assets;
- configurable settings schema;
- compatible Party Mix categories.

## 11.2 Randomness

Toda aleatoriedade crítica usa PRNG seeded no servidor. Guardar seed no GameInstance para replay/debug. Nunca aceitar `Math.random()` cliente para pontuação.

## 11.3 Timers

Servidor define deadlines absolutas (`deadlineAt`). Clientes calculam UI localmente, mas servidor decide validade. Sincronizar relógio por ping de baixa frequência e estimativa de offset.

## 11.4 Pontuação

Motor padroniza:

- score de ronda;
- score acumulado;
- bonus;
- penalties opcionais;
- team score;
- ties.

Nunca confiar em score calculado pelo cliente.

---

# 12. LOBBY, IDENTIDADE E MODERAÇÃO

## 12.1 Sala

Código por defeito: 4 letras maiúsculas removendo `I`, `O`, `L` e outros caracteres visualmente ambíguos. Se colisão, regenerar.

## 12.2 Nickname

- 1–20 grapheme clusters;
- Unicode normalizado;
- trim;
- sem HTML;
- filtro opcional de palavras proibidas local;
- duplicado recebe sufixo visual, mas ID permanece único.

## 12.3 Avatar

Conjunto local de ícones SVG próprios/licenciados. Jogador escolhe combinação de ícone + fundo. Não exigir upload facial.

## 12.4 Host controls

- kick;
- mute reactions;
- rename;
- move team;
- make spectator;
- block reconnect for kicked token;
- lock joins;
- pause;
- skip round;
- restart current game;
- emergency return to lobby.

## 12.5 Ready state

Host pode configurar:

- todos precisam ready;
- maioria ready;
- host inicia a qualquer momento.

## 12.6 Spectators

Spectator não ocupa slot competitivo, não vê segredos e pode reagir conforme configuração. Pode assumir vaga entre rounds.

---

# 13. DESIGN SYSTEM E UX

## 13.1 Identidade

Nome na UI: **RS Party Hub**. Visual deve parecer produto premium, não painel administrativo genérico nem template de estudante.

Direção:

- cards grandes;
- profundidade leve;
- tipografia legível à distância no host;
- touch targets >= 44px no mobile;
- transições rápidas, 150–300ms;
- celebrações mais longas só em resultados;
- fundo dinâmico discreto;
- cores obtidas de design tokens, nunca dezenas de hex aleatórios;
- reduced motion respeitado.

## 13.2 Host Stage

Projetado para 16:9, mas responsivo a 4:3 e ultrawide.

Hierarquia:

1. conteúdo do jogo;
2. timer/status;
3. jogadores/score;
4. room code/QR discreto durante game para late join;
5. reações efémeras;
6. debug nunca visível em party mode.

## 13.3 Player Controller

- ocupa 100dvh sem barras internas quebradas;
- safe-area para notch;
- botão principal ao alcance do polegar;
- estado de conexão visível mas não invasivo;
- haptic/vibration apenas quando suportado e permitido;
- feedback instantâneo local `pending`, confirmado pelo servidor em seguida;
- não deixar tela “morta” enquanto host exibe animação longa.

## 13.4 Admin

Admin não deve ser a mesma UI do jogador. Layout com:

- Overview;
- Parties;
- Content;
- Library;
- Players/clients;
- Network;
- Storage;
- Logs;
- Settings;
- Diagnostics.

## 13.5 Acessibilidade

- contraste WCAG AA quando razoável;
- não depender só de cor;
- keyboard navigation no host/admin;
- ARIA labels;
- texto redimensionável;
- captions/text alternatives para efeitos importantes;
- `prefers-reduced-motion`;
- modo high contrast;
- timers extensíveis.

---

# 14. CATÁLOGO DE JOGOS V1

O objetivo do catálogo não é lançar 30 jogos mal acabados de uma vez. O motor deve suportar todos; o OpenCode deve implementar uma **core set plenamente jogável** e estruturar os restantes como plugins completos conforme esta especificação. Para o one-shot solicitado, a meta é que todos os jogos abaixo tenham fluxo funcional mínimo, e pelo menos os 12 marcados como prioridade P0 recebam polish superior e E2E dedicado.

**P0 sugeridos:** Quiz Rush, Majority Vote, Live Bingo, Bluff Battle, Draw & Guess, Buzzer Arena, Charades, Spy Room, Hot Potato, Survey Says, Pixel Reveal, Co-op Escape.

A seguir, cada jogo possui contrato suficiente para implementação sem nova consulta.

## 14.1 Quiz Rush — `quiz-rush` (P0)

**Jogadores:** 2–30  
**Duração:** 5–20 min  
**Controlador principal:** `choices`

### Conceito
Quiz rápido com perguntas de múltipla escolha, imagem ou verdadeiro/falso.

### Loop de jogo
O host mostra a pergunta; respostas ficam nos telefones. Pontos combinam correção e rapidez com curva que evita vantagem exagerada de latência.

### Funcionalidades obrigatórias
Perguntas locais JSON/YAML, categorias, dificuldade, temporizador, streak, equipa, sudden death.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.2 Majority Vote — `majority-vote` (P0)

**Jogadores:** 3–30  
**Duração:** 5–15 min  
**Controlador principal:** `vote`

### Conceito
Votação social: ganha quem prevê a opção escolhida pela maioria.

### Loop de jogo
Cada telefone vota secretamente; o ecrã revela distribuição apenas após fecho.

### Funcionalidades obrigatórias
Prompts custom, voto anónimo, empate, team prediction, heatmap.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.3 Live Bingo — `live-bingo` (P0)

**Jogadores:** 2–50  
**Duração:** 10–45 min  
**Controlador principal:** `grid`

### Conceito
Bingo gerado localmente com cartelas únicas por aparelho.

### Loop de jogo
Servidor gera cartelas seeded, chama itens e valida linhas automaticamente.

### Funcionalidades obrigatórias
Bingo numérico, palavras, imagens, eventos; 1 linha, 2 linhas, full house.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.4 Truth or Challenge — `truth-or-challenge` (P1)

**Jogadores:** 2–20  
**Duração:** 10–60 min  
**Controlador principal:** `choice`

### Conceito
Verdade ou desafio configurável e seguro, sem obrigar participação.

### Loop de jogo
Jogador sorteado escolhe verdade, desafio ou passe; telefone recebe prompt privado quando necessário.

### Funcionalidades obrigatórias
Perfis family/teen/adult/custom, blacklist, passes ilimitados configuráveis, sem penalização por segurança.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.5 Bluff Battle — `bluff-battle` (P0)

**Jogadores:** 3–12  
**Duração:** 10–25 min  
**Controlador principal:** `text`

### Conceito
Jogadores escrevem respostas falsas plausíveis e tentam enganar os outros.

### Loop de jogo
Servidor mistura resposta correta e bluffs, filtra duplicados e revela autores depois do voto.

### Funcionalidades obrigatórias
Perguntas, curiosidades, definições, scoring por enganar + acertar.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.6 Draw & Guess — `draw-guess` (P0)

**Jogadores:** 3–12  
**Duração:** 10–30 min  
**Controlador principal:** `canvas`

### Conceito
Desenho no telefone, adivinhação coletiva no ecrã.

### Loop de jogo
Canvas usa Pointer Events e envia stroke batches; desenho final é rasterizado/serializado com limites.

### Funcionalidades obrigatórias
Cores limitadas, borracha, undo local controlado, palavras por dificuldade, equipas.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.7 Caption Clash — `caption-clash` (P1)

**Jogadores:** 3–20  
**Duração:** 8–20 min  
**Controlador principal:** `text`

### Conceito
Uma imagem aparece e todos enviam legendas; grupo vota na melhor.

### Loop de jogo
Submissões ficam anónimas até resultado para reduzir viés.

### Funcionalidades obrigatórias
Biblioteca local de imagens, uploads aprovados, votação, awards pós-jogo.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.8 Buzzer Arena — `buzzer-arena` (P0)

**Jogadores:** 2–30  
**Duração:** 3–20 min  
**Controlador principal:** `buzzer`

### Conceito
Buzzer genérico para quiz presencial, debate ou mestre de cerimónias.

### Loop de jogo
Servidor fecha o buzzer no primeiro evento válido e mostra ordem com timestamps normalizados.

### Funcionalidades obrigatórias
Lockout, reset, penalty, equipas, top-3 buzz order.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.9 Word Chain — `word-chain` (P1)

**Jogadores:** 2–12  
**Duração:** 5–15 min  
**Controlador principal:** `text`

### Conceito
Cada jogador precisa escrever palavra válida que começa/relaciona com a anterior.

### Loop de jogo
Servidor aplica regras do pack e deadline por turno; pode aceitar dicionário local por idioma.

### Funcionalidades obrigatórias
Categorias, última letra, associação livre, sem repetição.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.10 Categories Rush — `categories-rush` (P1)

**Jogadores:** 2–20  
**Duração:** 5–15 min  
**Controlador principal:** `text`

### Conceito
Categoria + letra; todos escrevem respostas antes do tempo.

### Loop de jogo
Pontuação maior para respostas únicas; normalização remove diferenças triviais.

### Funcionalidades obrigatórias
Validação host/manual opcional para palavras desconhecidas.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.11 Charades — `charades` (P0)

**Jogadores:** 2–20  
**Duração:** 5–30 min  
**Controlador principal:** `secret`

### Conceito
Mímica com palavra secreta num telefone e timer central.

### Loop de jogo
Apenas ator vê prompt; equipa marca acertou/passar.

### Funcionalidades obrigatórias
Temas, equipas, rotação automática, modo sem TV.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.12 Spy Room — `spy-room` (P0)

**Jogadores:** 4–12  
**Duração:** 8–20 min  
**Controlador principal:** `secret`

### Conceito
Dedução social com um jogador sem conhecer a localização/tema.

### Loop de jogo
Servidor distribui papel/segredo individual e coordena timer/voto final.

### Funcionalidades obrigatórias
Packs de locais próprios, 1–2 spies, perguntas sugeridas opcionais.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.13 Secret Mission — `secret-mission` (P1)

**Jogadores:** 3–20  
**Duração:** 10–40 min  
**Controlador principal:** `secret`

### Conceito
Cada jogador recebe pequenas missões sociais discretas para completar na festa.

### Loop de jogo
Missões são privadas e marcadas como concluídas; host pode revelar no final.

### Funcionalidades obrigatórias
Safe mode, sem missões físicas perigosas, custom packs.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.14 Hot Potato — `hot-potato` (P0)

**Jogadores:** 2–20  
**Duração:** 3–10 min  
**Controlador principal:** `pass`

### Conceito
Objeto virtual passa entre telefones; quem estiver com ele quando timer oculto termina perde a ronda.

### Loop de jogo
Servidor mantém posse e timer secreto; transferências têm ACK para evitar dois donos.

### Funcionalidades obrigatórias
Prompts obrigatórios antes de passar, equipas, speed-up.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.15 Reaction Tap — `reaction-tap` (P1)

**Jogadores:** 2–30  
**Duração:** 2–10 min  
**Controlador principal:** `tap`

### Conceito
Teste de reflexo: toque apenas quando estímulo correto surgir.

### Loop de jogo
Servidor agenda janela e penaliza false start; cliente pré-carrega assets.

### Funcionalidades obrigatórias
Cores, sons, símbolos, sequência, elimination.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.16 Memory Grid — `memory-grid` (P1)

**Jogadores:** 1–20  
**Duração:** 3–12 min  
**Controlador principal:** `grid`

### Conceito
Memorizar sequência/grade e responder no telefone.

### Loop de jogo
Host exibe padrão, depois jogadores reproduzem sem o ver.

### Funcionalidades obrigatórias
Dificuldade incremental, solo simultâneo, equipa.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.17 Emoji Decode — `emoji-decode` (P1)

**Jogadores:** 2–20  
**Duração:** 5–15 min  
**Controlador principal:** `text`

### Conceito
Decifrar frase, filme, objeto ou expressão representada por emojis.

### Loop de jogo
Aceita respostas normalizadas e aliases definidos pelo pack.

### Funcionalidades obrigatórias
PT/EN, hints, buzzer mode, teams.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.18 Survey Says — `survey-says` (P0)

**Jogadores:** 4–20  
**Duração:** 10–25 min  
**Controlador principal:** `buzzer+text`

### Conceito
Formato de respostas populares com equipas e board de opções ocultas.

### Loop de jogo
Dataset local contém respostas e pesos; host pode aceitar variantes.

### Funcionalidades obrigatórias
Rounds, strike, steal, sudden death.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.19 Guess the Song — `guess-the-song` (P1)

**Jogadores:** 2–20  
**Duração:** 10–30 min  
**Controlador principal:** `buzzer+text`

### Conceito
Host toca pequenos excertos de músicas existentes na biblioteca local e jogadores adivinham.

### Loop de jogo
Servidor seleciona faixa local, extrai preview autorizado/local e envia apenas metadata necessária ao jogo.

### Funcionalidades obrigatórias
Título/artista, categorias, clips configuráveis, volume normalizado; não incluir música protegida no repositório.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.20 Photo Roulette Local — `photo-roulette` (P1)

**Jogadores:** 3–12  
**Duração:** 10–25 min  
**Controlador principal:** `photo`

### Conceito
Participantes enviam voluntariamente fotos para uma sessão temporária e o grupo adivinha o autor.

### Loop de jogo
Upload exige consentimento e aprovação; fotos da ronda têm TTL e podem ser apagadas no fim.

### Funcionalidades obrigatórias
Opt-in, sem leitura automática da galeria, categorias, reactions.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.21 Pixel Reveal — `pixel-reveal` (P0)

**Jogadores:** 2–20  
**Duração:** 5–20 min  
**Controlador principal:** `buzzer`

### Conceito
Imagem é revelada gradualmente; jogador usa buzzer e responde.

### Loop de jogo
Revelação e ordem são servidor-side; assets próprios ou pack local.

### Funcionalidades obrigatórias
Reveal patterns, hints, bonus rounds, optional balanced power-ups.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.22 Number Line — `number-line` (P1)

**Jogadores:** 2–12  
**Duração:** 8–20 min  
**Controlador principal:** `secret`

### Conceito
Cada jogador recebe número secreto e dá pista; grupo ordena jogadores sem revelar números.

### Loop de jogo
Telemóvel mostra número privado; mesa organiza sequência; reveal sincronizado.

### Funcionalidades obrigatórias
Temas de escala, co-op score, table mode.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.23 Team Relay — `team-relay` (P1)

**Jogadores:** 4–20  
**Duração:** 8–25 min  
**Controlador principal:** `mixed`

### Conceito
Sequência de microdesafios passa entre membros da equipa.

### Loop de jogo
Engine agenda subtask por jogador e controla handoff.

### Funcionalidades obrigatórias
Texto, tap, memória, quiz; final comeback moderado.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.24 Forbidden Word — `forbidden-word` (P1)

**Jogadores:** 3–20  
**Duração:** 8–25 min  
**Controlador principal:** `secret`

### Conceito
Descrever palavra sem usar termos proibidos mostrados no telefone.

### Loop de jogo
Ator vê palavra + proibidas; equipa/oponente marca acerto/violação.

### Funcionalidades obrigatórias
Packs por idioma, timer, equipas, pass.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.25 Who Am I — `who-am-i` (P1)

**Jogadores:** 3–20  
**Duração:** 10–30 min  
**Controlador principal:** `secret`

### Conceito
Cada jogador recebe identidade que os outros veem e ele tenta descobrir.

### Loop de jogo
O próprio jogador não recebe seu segredo; peers recebem informação apropriada.

### Funcionalidades obrigatórias
Personagens, profissões, animais, custom; table mode.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.26 This or That — `this-or-that` (P1)

**Jogadores:** 2–30  
**Duração:** 5–20 min  
**Controlador principal:** `vote`

### Conceito
Escolhas A/B rápidas seguidas de resultados e comentários.

### Loop de jogo
Votos fecham simultaneamente; revela maioria, minorias e streaks.

### Funcionalidades obrigatórias
Icebreaker, family, debate, team prediction.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.27 Story Chain — `story-chain` (P1)

**Jogadores:** 3–12  
**Duração:** 10–25 min  
**Controlador principal:** `text`

### Conceito
Cada participante continua uma história vendo apenas parte do contexto.

### Loop de jogo
Servidor controla quanto contexto cada pessoa recebe; reveal final no host.

### Funcionalidades obrigatórias
Uma frase, 140 caracteres, género, votação final.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.28 Party Auction — `party-auction` (P1)

**Jogadores:** 3–12  
**Duração:** 10–25 min  
**Controlador principal:** `bid`

### Conceito
Jogadores usam moedas virtuais para disputar itens/benefícios engraçados de jogo.

### Loop de jogo
Bids e saldo são autoritativos; modos aberto, secreto ou simultâneo.

### Funcionalidades obrigatórias
Itens virtuais apenas, integração com Party Mix power-ups.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.29 Prediction Round — `prediction-market` (P1)

**Jogadores:** 3–20  
**Duração:** 5–15 min  
**Controlador principal:** `vote`

### Conceito
Jogadores apostam pontos virtuais em resultados da própria festa/jogo.

### Loop de jogo
Sem dinheiro real; stakes são pontos in-game e têm limites.

### Funcionalidades obrigatórias
Quem ganha próximo round, maioria A/B, performance de equipa.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.30 Co-op Escape — `coop-escape` (P0)

**Jogadores:** 2–10  
**Duração:** 15–40 min  
**Controlador principal:** `mixed-secret`

### Conceito
Puzzles cooperativos distribuem pistas diferentes pelos telefones.

### Loop de jogo
Nenhum jogador sozinho possui toda informação; engine valida códigos/puzzles.

### Funcionalidades obrigatórias
Packs de puzzles, hints, timer opcional, table mode.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.31 Tap Race — `tap-race` (P1)

**Jogadores:** 2–20  
**Duração:** 2–8 min  
**Controlador principal:** `tap`

### Conceito
Corrida curta de tapping com stamina para evitar simples spam sem estratégia.

### Loop de jogo
Servidor recebe batches/contadores assinados por sessão e aplica caps de taxa plausíveis.

### Funcionalidades obrigatórias
Solo lane no host, boosts, team relay.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

## 14.32 Soundboard Chaos — `soundboard-chaos` (P1)

**Jogadores:** 2–12  
**Duração:** 3–10 min  
**Controlador principal:** `buttons`

### Conceito
Jogadores recebem botões de efeitos e tentam cumprir padrões/ritmos no ecrã central.

### Loop de jogo
Host toca áudio central para evitar cacofonia de latência entre aparelhos.

### Funcionalidades obrigatórias
Simon-like, rhythm cues, reaction emote mode.

### State machine mínima

`SETUP → INTRO → ROUND_PREP → ACTIVE → LOCK/RESOLVE → ROUND_RESULT → NEXT_ROUND | GAME_RESULT`

O plugin pode omitir fases irrelevantes, mas deve expor fase semântica ao host e player. Mudanças de fase são iniciadas no servidor. O cliente nunca decide que a ronda terminou.

### Requisitos de UI

- Host: título, instrução em uma frase, timer legível, status dos jogadores sem revelar informação privada, scoreboard resumido e feedback audiovisual curto.
- Player: somente ações relevantes da fase atual. Eliminar botões desativados desnecessários.
- Durante espera: mostrar `Resposta recebida`, `Aguardando outros jogadores` ou informação equivalente; nunca deixar spinner infinito sem contexto.
- Em desconexão: preservar resposta local pendente e tentar confirmação idempotente após reconectar quando a deadline ainda permitir.

### Anti-cheat e consistência

- Pontos e resolução calculados no servidor.
- Mensagens fora da fase correta são rejeitadas.
- Cada ação crítica inclui `eventId` e só produz efeito uma vez.
- O servidor valida membership, limites, payload e deadline.
- Informação secreta nunca aparece no payload público.

### Configuração do host

Todo jogo deve oferecer pelo menos: número de rondas/duração equivalente, dificuldade quando aplicável, modo equipa quando fizer sentido, conteúdo/categoria, timers normal/estendido e opção `skip` administrativa.

### Testes mínimos específicos

1. partida com número mínimo de jogadores;
2. partida com máximo recomendado;
3. jogador desconecta durante fase ativa e reconecta;
4. ação repetida não duplica score;
5. payload inválido é rejeitado;
6. empate tem resolução definida;
7. game over gera resultado determinístico;
8. late join respeita policy;
9. refresh da página não cria jogador duplicado;
10. host consegue voltar ao lobby sem corromper score global.

# 15. PARTY MIX — O MODO ASSINATURA

Party Mix transforma o catálogo num programa contínuo.

## 15.1 Configuração

Host escolhe:

- duração alvo: 15, 30, 60, 90 min ou custom;
- intensidade: chill / normal / chaos;
- content profile;
- equipas ou individual;
- categorias permitidas;
- jogos excluídos;
- permitir repetição após N jogos;
- power-ups globais;
- handicap/balance assist.

## 15.2 Algoritmo de seleção

Evitar simplesmente `random(gameList)`.

Pontuar candidatos por:

- não repetição recente;
- variação de tipo de interação;
- tamanho do grupo;
- capabilities presentes;
- duração restante;
- necessidade de big screen;
- compatibilidade com equipas;
- rating de conteúdo;
- histórico de preferência local opcional.

Exemplo: depois de jogo de texto longo, favorecer reflexo/desenho; depois de dois competitivos, introduzir co-op/social.

## 15.3 Meta-score

Cada jogo normaliza resultado em Party Points para evitar que um jogo com 20 perguntas domine outro com 3 rondas. Distribuição recomendada por jogo:

- 1.º: 100 PP;
- 2.º: 75;
- 3.º: 60;
- restantes por percentile/participação;
- equipa usa distribuição equivalente.

## 15.4 Comeback

Evitar rubber-banding agressivo. Pode haver:

- power-up extra para último colocado em jogos compatíveis;
- bónus por objetivo secundário;
- round final com multiplicador máximo 1.5x, não 10x;
- títulos não competitivos para manter todos envolvidos.

## 15.5 Intermission

Entre jogos: 10–30 segundos configuráveis com:

- resultado;
- títulos;
- reações;
- próximo jogo;
- QR/room code;
- botão `Continuar agora` do host.

---

# 16. SISTEMA DE POWER-UPS E REAÇÕES

## 16.1 Power-ups

Power-up é plugin capability, não hack global. Exemplos genéricos:

- `shield`: ignora uma sabotagem;
- `double`: dobra apenas bónus de uma ação definida pelo jogo;
- `freeze`: bloqueia temporariamente ação não essencial de oponente;
- `scramble`: reordena escolhas no controlador;
- `hint`: recebe pista privada;
- `steal`: apenas em jogos cujo modelo suporta transferência explícita;
- `reroll`: troca prompt antes de responder.

Cada jogo declara quais aceita e duração. Nunca permitir power-up que revele segredo indevido.

## 16.2 Balance

- inventário máximo 3;
- cooldown;
- ganhos por desempenho/posição configuráveis;
- todas ativações servidor-side;
- animation não pode atrasar resultado crítico.

## 16.3 Reações

Conjunto local de 6–10 reações. Rate-limit. Host pode desligar. No big screen aparecem por 1–2 s em layer que não cobre pergunta/timer. Contabilizar estatísticas de reação no resultado apenas como diversão.

---

# 17. PARTY DROP — PARTILHA LOCAL INTEGRADA

RS Party Hub deve aproveitar a mesma rede para permitir partilha voluntária de ficheiros utilizados pela festa.

## 17.1 Casos

- enviar foto para Photo Roulette;
- enviar imagem para Caption Clash;
- enviar música local para fila do Jukebox quando permitido;
- partilhar PDF/ficheiro entre participantes em evento;
- enviar um pequeno vídeo para mural;
- exportar fotos/resultados do host para um telefone.

## 17.2 UX

Player abre `Party Drop`, escolhe ficheiro e destinatário/contexto. Mostra:

- nome;
- tamanho;
- tipo;
- progresso real;
- velocidade aproximada;
- estado `a enviar / recebido / falhou`;
- retry.

Upload não pode “sumir” ao mudar de pasta/aba. Estado fica no store e, quando possível, IndexedDB.

## 17.3 Transporte

Baseline: HTTP multipart/chunked upload para servidor. Opcional: WebRTC DataChannel para transferências diretas quando capacidades e conectividade permitirem. Se P2P falhar, fallback automático para relay.

## 17.4 Segurança

- allowlist por contexto;
- validar magic bytes;
- limite de tamanho;
- storageName gerado;
- originalName apenas metadata sanitizada;
- path traversal impossível;
- ficheiros fora do webroot;
- nunca executar uploads;
- opcional scan antivírus quando disponível;
- quota por sala;
- expiração automática para temporários;
- biblioteca persistente requer ação explícita de admin.

## 17.5 Limites default

- imagem: 20 MB;
- áudio: 100 MB;
- vídeo: 250 MB;
- documento: 50 MB;
- total temporário por sala: 1 GB, configurável.

---

# 18. RS JUKEBOX

Módulo social opcional, mas integrado ao Party Hub.

## 18.1 Funções

- host aponta pasta de música existente;
- scanner indexa metadata sem mover/apagar originais;
- jogadores pesquisam catálogo liberado;
- pedidos entram numa fila;
- votos podem elevar música;
- host tem veto/skip/volume;
- limite de pedidos por jogador evita monopolização;
- crossfade opcional e volume normalization quando suportado;
- artwork cache local.

## 18.2 Regras

- nunca incluir conteúdo musical protegido no código/repo;
- não fazer download de música da Internet;
- biblioteca é conteúdo local do utilizador;
- playback preferencialmente no host para sincronização;
- audio do telefone fica para efeitos privados, não música principal.

## 18.3 Party integration

Durante intermission, mostrar faixa atual e próximos pedidos de forma discreta. Jogos de áudio podem pedir ao Jukebox apenas faixas explicitamente elegíveis.

---

# 19. PHOTO WALL / PHOTO BOOTH LOCAL

## 19.1 Objetivo

Criar mural da festa sem cloud.

## 19.2 Fluxo

1. participante abre Photo Wall;
2. escolhe tirar foto ou selecionar ficheiro, quando API permitir;
3. preview local;
4. consentimento explícito para partilhar na sala;
5. upload;
6. moderação opcional;
7. imagem aparece no mural/slideshow;
8. reações limitadas;
9. no final, host pode exportar ZIP.

## 19.3 Privacidade

- nunca varrer galeria automaticamente;
- nunca ativar câmara sem gesto/permissão;
- opção `session-only` apaga após TTL;
- `save to library` só por admin;
- remover metadata EXIF de cópias quando configurado;
- deixar claro para participantes se a foto será persistida.

---

# 20. CHAT E CAMADA SOCIAL

Chat não deve competir com jogos. Ele serve lobby/intermission e pode ser desligado.

## 20.1 Funções

- sala geral;
- mensagens curtas;
- emoji/reactions;
- system messages;
- host mute;
- report local opcional;
- mensagens não persistentes por defeito;
- histórico apenas da sessão.

## 20.2 Limites

- máximo 500 caracteres;
- renderização texto puro;
- links não autoexecutam nada;
- nenhum HTML do utilizador;
- rate limits;
- host pode apagar mensagem da visão da sala.

---

# 21. CONTENT PACK SYSTEM

## 21.1 Formato

Packs são diretórios/ZIP importáveis contendo `manifest.json` e dados JSON/YAML validados.

Exemplo conceitual:

```json
{
  "schemaVersion": 1,
  "id": "mozambique-general-01",
  "title": "Conhecimentos Gerais",
  "locale": "pt-MZ",
  "rating": "family",
  "types": ["quiz", "bingo", "emoji"],
  "version": "1.0.0"
}
```

## 21.2 Validação

- schemaVersion suportada;
- id sem path;
- tamanho total;
- número máximo de assets;
- assets referenciados existem;
- nenhum executável/script;
- nenhum caminho fora do pack;
- checksums opcionais;
- relatório de importação antes de ativar.

## 21.3 Editor local

Admin deve criar/editar:

- quizzes;
- truth/challenges;
- charades;
- locations do Spy Room;
- forbidden words;
- bingo sets;
- surveys;
- emoji puzzles.

Preview e validação antes de publicar.

## 21.4 Export/import

Exportar pack próprio como ZIP. Importar noutro RS Party Hub sem cloud.

---

# 22. ADMIN DASHBOARD

## 22.1 Overview

Cards:

- servidor online;
- IP/hostname;
- sala ativa;
- jogadores online;
- CPU/RAM do processo;
- storage livre;
- tamanho temp;
- biblioteca;
- últimos erros.

## 22.2 Network

- interfaces;
- IP escolhido;
- porta;
- mDNS status;
- QR test;
- endpoint `/health`;
- botão “Testar acesso local”;
- explicação se firewall possivelmente bloqueia.

## 22.3 Players

Tabela em tempo real:

- nickname;
- status;
- ping aproximado;
- última atividade;
- browser/device class sem fingerprint invasivo;
- capabilities;
- score;
- ações de moderação.

## 22.4 Storage

- biblioteca nunca apagada automaticamente;
- temp usado;
- uploads pendentes;
- limpar temp;
- backup DB;
- export config;
- import config.

## 22.5 Diagnostics

- socket clients;
- room state version;
- last 100 eventos técnicos sanitizados;
- latency percentiles;
- failed ACKs;
- reconnect count;
- game plugin health.

Debug detalhado exige admin e nunca aparece aos jogadores.

---

# 23. API HTTP

Endpoints mínimos:

```text
GET  /health
GET  /api/v1/server/info
GET  /api/v1/network
POST /api/v1/rooms
GET  /api/v1/rooms/:code/public
POST /api/v1/rooms/:code/join
POST /api/v1/rooms/:code/leave
GET  /api/v1/games
GET  /api/v1/content/packs
POST /api/v1/uploads/init
PUT  /api/v1/uploads/:id/chunks/:n
POST /api/v1/uploads/:id/complete
GET  /api/v1/media/:id
GET  /api/v1/admin/overview
POST /api/v1/admin/content/import
POST /api/v1/admin/backup
```

## 23.1 Versionamento

API e socket protocol possuem versão. Clientes incompatíveis recebem mensagem legível e botão reload.

## 23.2 Erros

Formato:

```json
{
  "error": {
    "code": "ROOM_LOCKED",
    "message": "A sala já não aceita novos jogadores.",
    "requestId": "..."
  }
}
```

Nunca retornar stack trace ao cliente em produção.

---

# 24. BASE DE DADOS E MIGRAÇÕES

## 24.1 Tabelas sugeridas

- `settings`;
- `rooms`;
- `players`;
- `game_instances`;
- `game_results`;
- `content_packs`;
- `media_items`;
- `uploads`;
- `audit_events`;
- `local_metrics`.

## 24.2 Efemeridade

A maioria do estado vivo fica em memória para performance, com snapshots relevantes. Reinício inesperado deve permitir:

- restaurar configuração;
- preservar biblioteca;
- preservar packs;
- preservar resultados já finalizados;
- oferecer recuperar ou encerrar sala incompleta.

Não é necessário replay perfeito de um frame de minigame após crash; é necessário não corromper dados.

## 24.3 Backups

Admin pode gerar backup consistente do DB e configs. Nome inclui timestamp. Nunca incluir `temp` por defeito. Biblioteca grande deve ser opção separada.

---

# 25. SEGURANÇA

## 25.1 Threat model

Mesmo numa festa podem existir:

- aparelho comprometido;
- jogador tentando spam/cheat;
- browser malicioso;
- ficheiro nocivo;
- tentativa de adivinhar código;
- XSS via nickname/chat/content pack;
- DoS acidental por upload;
- CSWSH/origin abuse;
- acesso ao admin.

## 25.2 Admin authentication

No primeiro arranque:

- gerar setup secret temporário mostrado apenas no terminal/local host;
- admin define password ou PIN forte local;
- armazenar hash Argon2id/scrypt/bcrypt adequado, nunca plaintext;
- sessão admin separada;
- logout invalida sockets admin.

## 25.3 Player auth

Join cria token aleatório de reconexão. Servidor armazena hash. Token não concede admin.

## 25.4 Origin

Validar origem de socket contra origins locais permitidos e configuração. Não usar wildcard irrestrito.

## 25.5 CSP

Content Security Policy restritiva. Sem inline script quando possível. Sem CDN.

## 25.6 Headers

Configurar headers apropriados:

- `X-Content-Type-Options: nosniff`;
- frame policy/CSP frame ancestors;
- referrer policy;
- permissions policy coerente;
- cache policies por asset/API.

## 25.7 Input validation

Todo payload REST e socket usa schema. Validation server-side é obrigatória mesmo se UI já validar.

## 25.8 Rate limiting

Por sessão/jogador e IP onde fizer sentido. Em hotspot, todos podem aparecer em faixa semelhante; evitar bloquear sala inteira por um jogador.

## 25.9 Upload

Seguir defesa em profundidade: extensão + MIME + assinatura + quota + nome gerado + armazenamento não executável.

## 25.10 Secrets

- `.env` fora de git;
- nenhum segredo hardcoded;
- logs redigem tokens;
- QR não inclui admin secret;
- stack traces só local debug.

---

# 26. PRIVACIDADE

RS Party Hub é local-first e deve usar isso como vantagem.

- zero analytics cloud por defeito;
- zero advertising SDK;
- zero fingerprinting de jogadores;
- zero criação de conta;
- nomes podem ser pseudónimos;
- fotografias requerem ação explícita;
- microfone/câmara/sensores são opt-in;
- botão de apagar sessão;
- dados temporários têm TTL;
- admin vê claramente o que será persistido.

`local_metrics` agrega comportamento técnico e de gameplay sem conteúdo privado: jogo, duração, número de jogadores, crash, reconnect, latency buckets.

---

# 27. INTERNACIONALIZAÇÃO

## 27.1 Idiomas

- Português como default;
- Inglês completo;
- arquitetura preparada para mais idiomas.

Não concatenar frases em componentes. Todos textos UI ficam em catálogos i18n. Conteúdo de jogos declara locale.

## 27.2 Português

Suportar variantes sem acoplar lógica ao texto. `pt` pode ser default e packs podem declarar `pt-MZ`, `pt-PT`, `pt-BR`.

## 27.3 Normalização de respostas

Para jogos de texto:

- Unicode normalize;
- case folding;
- trim;
- opção de ignorar diacríticos apenas quando pack permitir;
- aliases definidos pelo conteúdo;
- nunca usar fuzzy matching agressivo sem mostrar ao host porque aceitou.

---

# 28. ÁUDIO, ANIMAÇÃO E “GAME JUICE”

## 28.1 Áudio

- efeitos locais pequenos;
- master volume;
- music volume;
- effects volume;
- mute;
- respeitar browser autoplay: host faz gesto inicial `Ativar som`;
- players não devem tocar a mesma música simultaneamente.

## 28.2 Animação

Usar animação para:

- entrada de jogador;
- lock de resposta;
- reveal;
- score change;
- winner;
- power-up.

Não usar para:

- bloquear botão crítico;
- atrasar reconexão;
- esconder estado;
- fazer listas administrativas saltarem.

## 28.3 Reduced motion

Quando ativo, substituir confetti/movimentos grandes por fades/scale pequenos.

---

# 29. PERFORMANCE E LATÊNCIA

## 29.1 Metas LAN

Não prometer latência absoluta, mas medir.

- ACK mediano esperado em LAN saudável: <100 ms;
- p95 alvo: <250 ms para ações pequenas;
- host deve atualizar score em <150 ms após resolução server-side em condições normais;
- drawing usa batching e interpolação local;
- buzzer calcula ordem no momento de chegada ao servidor, com proteções contra spam.

## 29.2 Payload

- eventos pequenos em JSON;
- não enviar state inteiro a cada mudança;
- usar delta events + snapshots na sync;
- imagens/media fora do socket;
- limitar payload de socket a ~64 KB para eventos normais;
- canvas strokes enviados em batches compactos.

## 29.3 Load test

Criar script que simula:

- 30 joins;
- ready simultâneo;
- 30 respostas quase simultâneas;
- reactions burst;
- 10 reconnects;
- troca de jogo;
- 5 uploads pequenos concorrentes.

Reportar p50/p95/p99 e memória.

---

# 30. RESILIÊNCIA E CASOS DE BORDA

Implementar explicitamente:

1. host refresh no ecrã Stage;
2. player refresh;
3. Android mata aba e volta;
4. IP do host muda após reiniciar hotspot;
5. room code expirado;
6. nickname duplicado;
7. player entra duas vezes no mesmo dispositivo;
8. duas abas do mesmo player;
9. clock cliente errado;
10. mensagem socket duplicada;
11. mensagem atrasada de ronda anterior;
12. upload interrompido;
13. storage cheio;
14. DB locked/corrupt detection;
15. plugin lança exceção;
16. conteúdo do pack inválido;
17. áudio não pode autoplay;
18. browser sem WebRTC;
19. browser sem IndexedDB;
20. mDNS não resolve;
21. firewall bloqueia porta;
22. host perde Internet mas LAN permanece;
23. sala chega ao máximo;
24. player expulso tenta reconectar;
25. host fecha jogo durante upload;
26. empate múltiplo;
27. zero respostas numa ronda;
28. todos desconectam menos host;
29. host pausa por muito tempo;
30. versão web em cache incompatível com servidor.

Cada caso deve ter comportamento definido e, quando prático, teste.

---

# 31. TEST STRATEGY

## 31.1 Unit tests

Cobrir:

- score functions;
- PRNG/seed behavior;
- validators;
- room code generation;
- nickname normalization;
- rate limiter;
- content loaders;
- game reducers;
- tie breakers;
- state filtering público/privado;
- upload validators.

Meta de cobertura não deve virar objetivo artificial, mas `packages/game-engine` e `packages/protocol` precisam cobertura alta (>85% lines como guardrail inicial).

## 31.2 Integration

- REST + DB;
- Socket join + room;
- answer ACK;
- reconnect sync;
- admin moderation;
- upload lifecycle;
- content import;
- game transitions.

## 31.3 E2E Playwright

Criar contextos separados simulando host e 4 players.

Fluxos P0:

1. criar sala;
2. quatro players entram;
3. ready;
4. iniciar jogo;
5. submeter ações;
6. obter resultado;
7. player refresh;
8. continuar;
9. voltar lobby.

Pelo menos um E2E para cada P0 game.

## 31.4 Visual sanity

Screenshots automáticos em:

- 360×800;
- 390×844;
- 768×1024;
- 1366×768;
- 1920×1080.

Detectar overflow, viewport preto não intencional, botões fora da tela e modals cortados.

## 31.5 Network chaos tests

Teste helper introduz:

- 500 ms latency;
- disconnect de 5 s;
- duplicate event;
- reordered application-level retries;
- packet drop simulado no cliente.

Esperado: estado converge após snapshot.

---

# 32. QA MANUAL — MATRIZ DE DISPOSITIVOS

Testar quando ambiente disponível:

### Android
- Chrome recente;
- Edge/Chromium se instalado;
- telefone mid-range 4–8 GB RAM;
- modo portrait;
- background/foreground.

### Desktop
- Chrome/Edge;
- Firefox;
- 1366×768 laptop;
- TV 1080p.

### iOS
Se hardware disponível, Safari recente. Não bloquear release local por ausência física, mas documentar lacuna.

### Redes
- router doméstico;
- hotspot Android;
- Windows hotspot;
- sem Internet;
- Wi‑Fi com Internet.

---

# 33. OBSERVABILIDADE LOCAL

## 33.1 Logs

Structured logs JSON ou formato legível configurável.

Categorias:

- server;
- network;
- room;
- socket;
- game;
- upload;
- content;
- security;
- db.

Nunca logar resposta privada completa de jogador, chat completo, secrets ou ficheiro binário.

## 33.2 Métricas

- connected_players;
- rooms_active;
- socket_reconnects_total;
- events_rejected_total por reason;
- ack_latency_ms histogram;
- game_duration_seconds;
- upload_bytes_total;
- process_rss_mb;
- event_loop_lag_ms.

Admin apresenta resumo. Export Prometheus pode ser opcional, não dependency core.

---

# 34. INSTALAÇÃO E EXECUÇÃO

## 34.1 Dev

```bash
pnpm install
pnpm dev
```

`pnpm dev` inicia server + web com configuração LAN segura para desenvolvimento.

## 34.2 Produção local

```bash
pnpm build
pnpm start
```

ou binário/script empacotado:

```bash
rs-party start
```

## 34.3 Primeiro arranque

Terminal mostra:

```text
RS Party Hub v1.x
Server: READY
LAN: 192.168.1.25:3210
mDNS: rsparty.local (available/unavailable)
Admin setup: http://localhost:3210/admin/setup
Library: C:\...\RSParty\library
```

Nunca imprimir password persistente após configuração.

## 34.4 Windows firewall

Documentar regra para permitir porta apenas em redes privadas. Se possível, script opcional com explicação e privilégio explícito; não mexer firewall silenciosamente.

---

# 35. CONFIGURAÇÃO

Arquivo `config/rsparty.json` validado por schema; env pode sobrepor apenas opções operacionais.

Exemplo:

```json
{
  "server": {"port": 3210, "bind": "0.0.0.0"},
  "network": {"mdns": true, "hostname": "rsparty"},
  "rooms": {"maxPlayers": 20, "codeLength": 4},
  "uploads": {"enabled": true, "tempQuotaMb": 1024},
  "content": {"defaultLocale": "pt", "profile": "family"},
  "privacy": {"localMetrics": true, "sessionChatPersistence": false},
  "ui": {"theme": "rs-default", "reducedMotionDefault": false}
}
```

Admin salva atomicamente: escrever temp + fsync/rename quando aplicável; nunca corromper config em crash.

---

# 36. ESTRUTURA DE REPOSITÓRIO

```text
RS-Party-Hub/
├─ apps/
│  ├─ server/
│  └─ web/
├─ packages/
│  ├─ protocol/
│  ├─ game-engine/
│  ├─ ui/
│  ├─ content/
│  ├─ games/
│  │  ├─ quiz-rush/
│  │  ├─ majority-vote/
│  │  └─ ...
│  └─ test-utils/
├─ content/
│  └─ builtin/
├─ scripts/
├─ tests/
│  ├─ e2e/
│  ├─ load/
│  └─ fixtures/
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ PROTOCOL.md
│  ├─ GAME_PLUGIN_GUIDE.md
│  ├─ SECURITY.md
│  ├─ NETWORKING.md
│  └─ TROUBLESHOOTING.md
├─ .github/
│  └─ workflows/
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ README.md
├─ CHANGELOG.md
├─ LICENSE
└─ IMPLEMENTATION_REPORT.md
```

Cada plugin de jogo deve conter `manifest`, reducer/state, views, schemas, tests e assets próprios.

---

# 37. CI E QUALITY GATES

Pipeline:

1. install frozen lockfile;
2. lint;
3. format check;
4. typecheck;
5. unit;
6. integration;
7. build;
8. E2E headless;
9. dependency audit informativo/bloqueante conforme severidade;
10. artifact do build.

Não depender de secrets externos para testar core.

## 37.1 Scripts mínimos

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "lint": "...",
    "typecheck": "...",
    "test": "...",
    "test:integration": "...",
    "test:e2e": "...",
    "test:load": "...",
    "verify": "..."
  }
}
```

`pnpm verify` deve executar todos gates razoáveis localmente.

---

# 38. DEFINITION OF DONE GLOBAL

Não encerrar a tarefa antes de verificar todos os itens aplicáveis:

- [ ] Repo próprio e estrutura limpa.
- [ ] `pnpm install` reproduzível.
- [ ] `pnpm build` passa.
- [ ] `pnpm verify` passa.
- [ ] Host acessível por IP LAN.
- [ ] QR leva diretamente à sala.
- [ ] Sem Internet, players conseguem jogar.
- [ ] Lobby suporta pelo menos 10 clientes simulados.
- [ ] Refresh não duplica player.
- [ ] Reconnect restaura identidade e score.
- [ ] Late join funciona conforme plugin.
- [ ] Host Stage 1080p sem overflow.
- [ ] Mobile 360px sem overflow horizontal.
- [ ] Admin separado do player.
- [ ] Biblioteca persistente não é apagada.
- [ ] Upload mostra progresso e retry.
- [ ] Party Drop funciona via baseline servidor.
- [ ] Jukebox indexa conteúdo local sem mover originais.
- [ ] Photo Wall tem consentimento/TTL.
- [ ] Chat/reactions têm rate limit.
- [ ] Party Mix seleciona jogos sem repetição imediata.
- [ ] P0 games têm E2E.
- [ ] Todos plugins têm unit tests básicos.
- [ ] Segredos de jogos não vazam no public snapshot.
- [ ] Score é server-side.
- [ ] Ações duplicadas são idempotentes.
- [ ] Timers usam deadline server-side.
- [ ] Código de sala expira ao fechar.
- [ ] Sala pode ser bloqueada.
- [ ] Kick invalida reconnect token.
- [ ] Content packs são validados.
- [ ] Nenhum asset core vem de CDN.
- [ ] Nenhum serviço cloud é necessário.
- [ ] `.env.example` não contém segredo.
- [ ] Upload não permite path traversal.
- [ ] CSP e headers configurados.
- [ ] Logs não vazam tokens.
- [ ] Processo tem graceful shutdown.
- [ ] SQLite migrations automatizadas.
- [ ] Backup funciona.
- [ ] Storage cheio gera erro legível.
- [ ] Diagnostics mostra versão/estado.
- [ ] PT e EN disponíveis.
- [ ] Reduced motion disponível.
- [ ] README de operação completo.
- [ ] IMPLEMENTATION_REPORT contém comandos e resultados reais.

---

# 39. IMPLEMENTATION REPORT — FORMATO OBRIGATÓRIO

No final, criar `IMPLEMENTATION_REPORT.md` com:

## Summary
O que foi realmente construído.

## Environment
Node, pnpm, OS, commit.

## Functional evidence
Tabela `feature | implementation | test | status`.

## Commands executed
Com exit codes.

## Test results
Contagens reais.

## E2E scenarios
Quais browsers/contextos.

## Performance
RAM do server em idle/10 simulated clients, bundle sizes, load test p95.

## Known limitations
Somente limitações reais restantes, classificadas severity. Não listar como “limitação” aquilo que deveria ter sido implementado por esta especificação sem antes tentar corrigir.

## Security checks
Uploads, validation, auth, origin, rate limit.

## Network validation
Como foi testado em `localhost` e LAN quando ambiente permitiu.

## Release artifact
Local/path e checksum quando houver pacote.

---

# 40. FASES INTERNAS DE IMPLEMENTAÇÃO — NÃO PARAR ENTRE ELAS

Estas fases organizam raciocínio; não são pedidos de confirmação.

## Fase A — Discovery

- inspecionar repo;
- identificar versões;
- preservar código útil;
- criar ADR curto das decisões.

## Fase B — Foundation

- monorepo;
- protocol;
- server;
- web shells;
- SQLite;
- config;
- health.

## Fase C — Lobby vertical slice

- room create;
- join QR/code;
- player identity;
- Socket.IO;
- ready;
- host stage.

Só avançar quando E2E deste slice passar.

## Fase D — Engine

- plugin API;
- snapshot public/private;
- timers;
- scoring;
- reconnect.

## Fase E — P0 games

Implementar e testar um por vez, reutilizando componentes.

## Fase F — Party Mix e P1 games

Adicionar catálogo e seleção.

## Fase G — Social/Media

Party Drop, Jukebox, Photo Wall, chat/reactions.

## Fase H — Admin + content packs

Gestão, imports, diagnostics, backups.

## Fase I — Hardening

- rate limits;
- headers;
- validation;
- chaos tests;
- load;
- accessibility;
- browser sizes.

## Fase J — Release

- clean build;
- verify;
- docs;
- report;
- tag/release local quando git disponível.

---

# 41. DETALHAMENTO DE COMPONENTES FRONTEND

## 41.1 Shared

- `ConnectionBanner`
- `RoomCodeBadge`
- `QRCodeCard`
- `PlayerAvatar`
- `ScoreChip`
- `CountdownRing`
- `BigCountdown`
- `ReactionLayer`
- `ToastRegion`
- `ConfirmDialog`
- `CapabilityNotice`
- `OfflineLanBadge`

## 41.2 Player

- `JoinScreen`
- `NicknameScreen`
- `LobbyController`
- `ReadyButton`
- `BuzzerController`
- `ChoiceController`
- `TextAnswerController`
- `VoteController`
- `DrawController`
- `SecretCardController`
- `GridController`
- `PassController`
- `BidController`
- `UploadController`
- `ReconnectOverlay`

## 41.3 Host

- `HostLobby`
- `PlayerRail`
- `GameStageRouter`
- `Scoreboard`
- `RoundIntro`
- `RoundResult`
- `GameResult`
- `PartyMixTransition`
- `NowPlaying`
- `LateJoinQR`

## 41.4 Admin

- `SystemOverview`
- `NetworkPanel`
- `StoragePanel`
- `ContentPackManager`
- `ContentEditor`
- `PlayerAdminTable`
- `LogViewer`
- `DiagnosticsPanel`
- `BackupRestorePanel`

---

# 42. DETALHAMENTO DE EVENTOS SOCKET

Namespaces podem ser evitados inicialmente; usar tipos explícitos.

### Lifecycle
- `client:hello`
- `server:hello`
- `room:join`
- `room:joined`
- `room:leave`
- `room:playerJoined`
- `room:playerLeft`
- `room:playerUpdated`
- `room:locked`

### Sync
- `state:request`
- `state:snapshot`
- `state:patch`
- `state:versionMismatch`

### Lobby
- `player:ready`
- `player:rename`
- `player:avatar`
- `host:start`
- `host:pause`
- `host:resume`

### Game
- `game:action`
- `game:phase`
- `game:tickHint`
- `game:roundResult`
- `game:finished`

### Social
- `reaction:send`
- `reaction:broadcast`
- `chat:send`
- `chat:message`

### Admin
- `admin:kick`
- `admin:mute`
- `admin:lockRoom`
- `admin:skipRound`

Não criar um evento diferente para cada botão se todos podem ser modelados de forma tipada em `game:action`. O `action.type` é validado pelo plugin.

---

# 43. SINCRONIZAÇÃO DE DESENHO

Draw & Guess precisa parecer imediato.

## 43.1 Cliente

- captura PointerEvents;
- desenha localmente no canvas imediatamente;
- agrupa pontos por stroke em pequenos batches;
- comprime coordenadas normalizadas 0..1;
- envia a 20–30 fps no máximo;
- finaliza stroke com eventId.

## 43.2 Servidor

- valida tamanho/pontos;
- associa ao drawer autorizado;
- retransmite batches ao host;
- mantém representação vetorial compacta da ronda até final;
- limita strokes/pontos.

## 43.3 Reconnect

Host pode pedir snapshot do desenho atual. Player drawer reconectado recebe seu estado e continua se a fase ainda estiver ativa.

---

# 44. BUZZER FAIRNESS

Não afirmar “fairness perfeita” em Wi‑Fi. Implementar fairness razoável e transparente.

- host mostra `GO` com timestamp server-side;
- clientes recebem evento e habilitam UI;
- false-start antes da fase ativa é rejeitado;
- servidor ordena primeiros eventos recebidos válidos;
- cada jogador só possui um buzz ativo;
- mostrar ordem e diferença aproximada apenas como informação;
- não tentar compensar ping de maneira que jogadores possam manipular relógio;
- em modo competitivo avançado, medir RTT e usar apenas para diagnóstico, não para retroceder arbitrariamente timestamps.

---

# 45. CONTEÚDO BUILT-IN

O repositório deve trazer conteúdo suficiente para demo, criado originalmente/licenciado adequadamente.

Meta inicial:

- 150 perguntas gerais PT;
- 100 perguntas EN;
- 100 prompts This or That;
- 100 truth/challenge family-safe;
- 80 charades;
- 40 Spy Room locations;
- 100 Forbidden Word cards;
- 60 Emoji Decode;
- 50 Survey Says boards próprios;
- 5 bingo packs;
- 3 co-op escape demo packs curtos;
- imagens próprias/placeholders simples para Pixel Reveal/Caption.

Não copiar bancos de perguntas de concorrentes.

O conteúdo builtin deve ter unit test que verifica schema, IDs únicos e referências de assets.

---

# 46. EDITOR DE CONTEÚDO

## 46.1 Draft/publish

Mudanças ficam draft até validar. `Publish` cria versão e checksum.

## 46.2 Quiz editor

Campos:

- pergunta;
- tipo;
- opções;
- correta(s);
- explicação opcional;
- categoria;
- dificuldade;
- imagem opcional;
- duração.

Preview mobile + host.

## 46.3 Bulk import

CSV/JSON com relatório linha a linha. Erros não podem importar parcialmente sem informar; usar transação.

## 46.4 Duplicate detection

Hash normalizado do texto ajuda a identificar perguntas repetidas, mas admin pode confirmar duplicado intencional.

---

# 47. TEMAS E BRANDING

Criar design tokens:

```css
--bg-0
--bg-1
--surface-1
--surface-2
--text-1
--text-2
--accent
--accent-contrast
--success
--warning
--danger
--radius-sm
--radius-md
--radius-lg
--shadow-1
--space-*
```

Temas:

- RS Default;
- Dark;
- High Contrast;
- Event Custom.

Admin pode trocar logo e algumas cores, com validação de contraste. Não permitir CSS arbitrário via upload.

---

# 48. FIREWALL, PORTAS E TROUBLESHOOTING

O `TROUBLESHOOTING.md` deve responder:

### “O QR abre mas não carrega”
- confirmar mesma rede;
- testar `ping`/IP quando apropriado;
- verificar firewall;
- testar `/health`;
- verificar client isolation.

### “rsparty.local não abre”
- usar IP mostrado;
- mDNS é conveniência, não requisito.

### “Funciona no PC mas não no telefone”
- server bind;
- firewall;
- hotspot isolation;
- rede errada/VPN.

### “Sensor/giroscópio não funciona”
- browser capability/HTTPS;
- usar fallback touch.

### “PWA não instala”
- não é necessário para jogar;
- core funciona no browser normal.

---

# 49. ANDROID HOST — ROADMAP COMPATÍVEL

Embora v1 tenha host PC como alvo principal, a arquitetura deve permitir host Android futuro.

## 49.1 Não acoplar

- paths Windows fixos;
- shell PowerShell em runtime;
- dependência de Docker;
- serviços OS exclusivos;
- player web dependente de host UI desktop.

## 49.2 Futuro wrapper Android

Pode usar app nativo que:

- inicia LocalOnlyHotspot quando permitido;
- inicia runtime/server embarcado;
- mostra QR;
- mantém foreground service;
- gerencia permissões e storage;
- abre admin WebView ou browser.

A documentação atual deve marcar isto roadmap, não fingir que está pronto se não for implementado.

---

# 50. EXTENSIBILIDADE FUTURA

Arquitetura deve suportar sem reescrever core:

- pacotes de jogos de terceiros assinados/validados;
- host Android;
- desktop wrapper Tauri/Electron opcional;
- cast/TV companion;
- remote mode via relay opcional;
- WebRTC voice em jogos específicos;
- AI local para gerar perguntas, nunca requisito;
- integração com RS Media/Storage através de API explícita;
- tournaments;
- persistent profiles opcionais locais;
- event branding;
- teacher/presenter mode.

---

# 51. CRITÉRIOS DE ACEITAÇÃO POR EXPERIÊNCIA

## 51.1 “Quero jogar agora”

**Given** servidor instalado  
**When** host executa `rs-party start`  
**Then** em poucos segundos recebe URL/QR e pode criar sala.

## 51.2 “Não tenho Internet”

**Given** todos estão no mesmo hotspot sem gateway  
**When** abrem URL do host  
**Then** assets, join, jogo, score, audio local e admin básico funcionam.

## 51.3 “Meu telefone perdeu Wi‑Fi”

**Given** jogador tem score 430  
**When** fica offline 10 s e volta  
**Then** identidade e score retornam sem duplicar jogador.

## 51.4 “Entrei atrasado”

**Given** jogo P0 em andamento com policy spectatorUntilRound  
**When** novo player entra  
**Then** vê explicação e participa a partir da próxima ronda.

## 51.5 “Quero mostrar foto”

**Given** Photo Wall ativo  
**When** jogador escolhe imagem e confirma  
**Then** upload mostra progresso, valida, entra na moderação e aparece somente após aprovação se policy exigir.

## 51.6 “Quero sair do jogo sem perder a festa”

Host pode abandonar jogo atual e retornar lobby mantendo roster e Party Points.

---

# 52. ANTI-PADRÕES PROIBIDOS

1. Feature flag permanentemente falsa para “implementar depois”.
2. Botão sem handler real.
3. Toast “feito” antes de resposta do servidor.
4. Fake progress bar.
5. `setTimeout` para simular backend.
6. Dados mockados no build de produção.
7. Score calculado apenas no frontend.
8. Segredo enviado a todos e escondido no DOM.
9. CDN obrigatória.
10. Firebase/Supabase/serviço cloud no core LAN.
11. Exigir login do jogador.
12. Apagar biblioteca em update/reset.
13. Upload sem quota.
14. Aceitar `Content-Type` como única validação.
15. `cors: *` + cookies/admin.
16. permitir qualquer Origin no WebSocket.
17. desativar testes para passar CI.
18. captura silenciosa de exceções.
19. giant component com toda lógica de jogo.
20. duplicated game engines por plugin.
21. `Math.random()` cliente para resultado.
22. intervalos por frame no servidor.
23. state broadcast completo 30 vezes/s.
24. autoplay obrigatório sem fallback.
25. sensor obrigatório sem touch fallback.
26. página mobile que deixa cantos pretos/viewport parcial.
27. scroll container dentro de scroll container sem necessidade.
28. admin password em localStorage plaintext.
29. tokens nos logs.
30. copiar assets/conteúdo de Jackbox/Kahoot/outros.

---

# 53. CHECKLIST DE UX POR ECRÃ

## Join

- [ ] logo;
- [ ] código prefilled quando veio do QR;
- [ ] nickname;
- [ ] avatar;
- [ ] botão grande;
- [ ] erro de rede humano;
- [ ] sem cadastro.

## Lobby player

- [ ] nome da sala;
- [ ] roster;
- [ ] ready;
- [ ] settings relevantes;
- [ ] estado de ligação.

## Lobby host

- [ ] QR sempre visível;
- [ ] código;
- [ ] roster;
- [ ] ready;
- [ ] game picker/Party Mix;
- [ ] content profile;
- [ ] lock;
- [ ] start.

## During game player

- [ ] instrução curta;
- [ ] ação principal;
- [ ] timer quando pertinente;
- [ ] confirmação de ação;
- [ ] waiting state;
- [ ] connection state.

## Results

- [ ] vencedor;
- [ ] score changes;
- [ ] títulos;
- [ ] stats engraçadas não humilhantes;
- [ ] next game countdown;
- [ ] host override.

---

# 54. MATRIZ DE CAPABILITIES E FALLBACK

| Capability | Uso | Se disponível | Fallback obrigatório |
|---|---|---|---|
| WebSocket/Socket.IO | realtime | conexão full duplex | long-polling do Socket.IO quando possível |
| IndexedDB | restore/upload | guardar sessão/cache | memória + localStorage mínimo |
| Wake Lock | manter ecrã | solicitar durante jogo | instrução “mantenha ecrã ativo” |
| Vibration | feedback | haptic curto | animação visual |
| Device Orientation | tilt games | tilt/gyro | slider/joystick touch |
| Camera | photo booth | captura | file input |
| Microphone | voice game futuro | captura | texto/botão |
| WebRTC | Party Drop P2P | transferência direta | server relay |
| Web Share | export | native share sheet | download normal |
| Service Worker | offline cache | PWA enhancement | servidor local serve assets |

Core test suite deve conseguir rodar com todas features opcionais desativadas.

---

# 55. DEPENDÊNCIAS — POLÍTICA

Antes de adicionar pacote:

1. verificar manutenção/licença;
2. verificar se resolve problema real;
3. preferir biblioteca pequena;
4. evitar duplicação;
5. pin via lockfile;
6. sem package que descarrega binário remoto em runtime core;
7. documentação de third-party notices.

Dependências prováveis:

- `fastify` ou equivalente;
- `socket.io`, `socket.io-client`;
- `zod`;
- `react`, `react-dom`;
- `vite`;
- `zustand`;
- SQLite driver + ORM leve;
- QR generator local;
- argon2/bcrypt implementation adequada;
- `pino` logging;
- `vitest`;
- `playwright`;
- ESLint/Prettier ou Biome.

Evitar incluir simultaneamente múltiplos UI kits grandes, múltiplos ORMs ou duas bibliotecas de realtime.

---

# 56. LICENCIAMENTO E PROPRIEDADE INTELECTUAL

- Código próprio do RS Party Hub deve ter licença escolhida pelo proprietário do projeto; se ainda não definida, não assumir automaticamente MIT em release público.
- Dependências têm THIRD_PARTY_NOTICES.
- Conteúdo built-in precisa ser original, domínio público ou licença compatível.
- Não usar nomes/logos/sons/assets de Jackbox, Kahoot, AirConsole, Gartic, PixReveal etc.
- Ideias gerais de mecânica podem inspirar, mas implementação e apresentação devem ser originais.

---

# 57. PESQUISA — REFERÊNCIAS UTILIZADAS

A especificação sintetiza padrões observados nas seguintes fontes. O OpenCode deve tratá-las como **referências de engenharia e UX**, não como dependências nem fontes para copiar código/assets.

### Produtos e documentação oficial

1. Jackbox Games — How to Play; join por room code e telefones como controladores.
2. Jackbox Support — requisitos de browser, cookies, WebSockets, HTML5 e JavaScript.
3. Jackbox Support — salas protegidas/timers em remote play.
4. AirConsole — conceito de smartphone como gamepad/controlador e informação privada.
5. AirConsole Developer Guidelines — usar capacidades específicas do telefone em vez de emular apenas gamepad.
6. Kahoot Help — PIN temporário, QR, nickname sem conta.
7. Kahoot Help — 2-step join contra joins indevidos/bots.
8. Huddle — jogos browser-first, no-app/no-signup e telefones como private hands.
9. Blip Party — catálogo de jogos browser com room code.
10. Phones Out — big screen + QR + controladores privados.
11. PixReveal — local party mode, QR, power-ups, emotes, late join e sudden death.

### Open source / local-first

12. Snapdrop — PWA de partilha local usando WebRTC/WebSocket/Node.
13. PairDrop (`schlagmichdoch/PairDrop`) — rooms, QR, hotspot support, P2P, fallback/networking, IndexedDB e progress UX.

### Protocolos e plataforma Web

14. Socket.IO 4.x — Rooms.
15. Socket.IO 4.x — Delivery Guarantees.
16. Socket.IO 4.x — Connection State Recovery.
17. MDN — WebSocket API.
18. MDN — RTCDataChannel.
19. MDN — Web Audio API.
20. MDN — Wake Lock API.
21. MDN — Device Orientation Events.
22. web.dev — PWA Assets/Data e Service Workers; service worker como enhancement, não requisito core.
23. RFC 6762 — Multicast DNS.
24. Android Developers — LocalOnlyHotspot e comunicação local sem Internet.
25. Android Developers — Network Service Discovery/Wi‑Fi P2P.
26. Chrome for Developers — Local Network Access permission.
27. MDN — Local Network Access security model.

### Segurança

28. OWASP Cheat Sheet — WebSocket Security.
29. OWASP Cheat Sheet — File Upload.
30. OWASP Cheat Sheet — Input Validation.
31. OWASP HTML5 Security Cheat Sheet.

### Comunidade / observação de necessidades

32. r/localmultiplayergames — procura recorrente por jogos tipo Jackbox usando telefones, sem controladores dedicados.
33. r/selfhosted — interesse em party games self-hosted para ambientes com Internet limitada.
34. discussões de 2026 sobre browser party games — valorizam “no download/no signup”, setup em segundos, jogos curtos, power-ups e suporte a grupos.

### Conclusões de pesquisa que viraram requisitos

- Join precisa ser ridiculamente simples.
- Browser é o denominador comum entre Android/iOS/desktop.
- O host deve ser fonte de verdade.
- Reconnect não pode depender apenas da recuperação automática do socket.
- Shared screen não serve para todo jogo; Table Mode aumenta variedade.
- Network local precisa funcionar sem Internet e sem cloud.
- Secure-context-only APIs precisam fallback.
- Upload/real-time em LAN ainda precisam segurança.
- Conteúdo e catálogo são tão importantes quanto o motor técnico.
- “Juice” melhora festa, mas não pode esconder bugs de estado.

---

# 58. PROMPT FINAL COMPACTO PARA SER COLOCADO NO TOPO DA SESSÃO DO OPENCODE

> **Missão:** implemente integralmente o produto descrito em `RS_PARTY_HUB_OPENCODE_ONESHOT_SPEC.md`. Este ficheiro é a fonte de verdade. Trabalhe one-shot, de forma autónoma e contínua. Não peça confirmação para decisões que o documento já resolve ou que possam ser escolhidas pelo critério: LAN/offline > estabilidade > baixo consumo > UX > conveniência de implementação. Não entregue mocks, botões sem efeito, features só visuais ou relatórios que afirmam algo sem teste. Comece por inventariar o repositório/ambiente; crie o repo próprio `RS-Party-Hub` se necessário; implemente verticalmente; execute e corrija lint/typecheck/unit/integration/E2E/build; valide acesso LAN; preserve permanentemente `library/`; use servidor autoritativo, protocolo tipado, reconexão com snapshot e idempotência; mantenha PT/EN; garanta mobile-first para players e 1080p para host. Só conclua depois de `pnpm verify` e build passarem e de criar `IMPLEMENTATION_REPORT.md` com evidência real. Se uma capability de browser exigir HTTPS, implemente fallback em vez de quebrar o modo HTTP local. Não use cloud/CDN no caminho crítico. Não copie código, assets ou conteúdo de produtos pesquisados; use-os apenas como referência de padrões.

---

# 59. APÊNDICE A — CENÁRIOS DE TESTE E2E DETALHADOS

A secção seguinte deve virar testes Playwright ou scripts automatizados, não apenas leitura manual.

## A.1 Lobby normal

- iniciar servidor limpo;
- criar sala;
- validar code pattern;
- abrir quatro browser contexts;
- entrar com nomes diferentes;
- verificar roster convergente;
- marcar ready;
- host inicia;
- confirmar que room code continua válido para late join quando configuração permite.

## A.2 Duplicate tab

- jogador entra;
- duplica tab;
- segunda tab apresenta opção `Assumir este jogador` ou cria sessão separada de forma explícita;
- nunca competir com mesmo token silenciosamente.

## A.3 Reconnect durante resposta

- servidor abre pergunta;
- player seleciona opção e envia;
- derrubar conexão antes do ACK;
- reconectar;
- retry com mesmo eventId;
- confirmar uma única resposta e um único score.

## A.4 Reconnect após resposta confirmada

- receber ACK;
- desconectar;
- voltar;
- snapshot mostra `answered=true` e não permite segunda resposta.

## A.5 Mudança de fase com mensagem atrasada

- guardar ação de round 1;
- avançar round 2;
- enviar ação antiga;
- servidor rejeita `STALE_PHASE`.

## A.6 Host reload

- jogo ativo;
- reload host stage;
- host recupera state snapshot sem reiniciar game.

## A.7 Room lock

- host lock;
- novo player tenta join;
- recebe UI clara;
- player reconnect existente continua aceito.

## A.8 Kick

- host kick player;
- socket fecha/é movido;
- reconnect token é invalidado;
- tentativa de rejoin com token antigo falha;
- pode entrar como nova pessoa apenas se policy permitir e sem recuperar score antigo.

## A.9 Storage quota

- reduzir quota de temp em fixture;
- upload excede;
- falha antes de encher disco;
- resto da festa continua.

## A.10 Content pack inválido

- zip com `../` path;
- extensão proibida;
- JSON schema errado;
- oversized asset;
- importer rejeita e reporta motivos; nenhuma parte fica publicada.

---

## A.11 Plano E2E — Quiz Rush

**Setup:** criar sala limpa, carregar pack fixture determinístico de `quiz-rush`, usar seed conhecida e número de jogadores dentro de 2–30. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `choices` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.12 Plano E2E — Majority Vote

**Setup:** criar sala limpa, carregar pack fixture determinístico de `majority-vote`, usar seed conhecida e número de jogadores dentro de 3–30. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `vote` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.13 Plano E2E — Live Bingo

**Setup:** criar sala limpa, carregar pack fixture determinístico de `live-bingo`, usar seed conhecida e número de jogadores dentro de 2–50. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `grid` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.14 Plano E2E — Truth or Challenge

**Setup:** criar sala limpa, carregar pack fixture determinístico de `truth-or-challenge`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `choice` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.15 Plano E2E — Bluff Battle

**Setup:** criar sala limpa, carregar pack fixture determinístico de `bluff-battle`, usar seed conhecida e número de jogadores dentro de 3–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.16 Plano E2E — Draw & Guess

**Setup:** criar sala limpa, carregar pack fixture determinístico de `draw-guess`, usar seed conhecida e número de jogadores dentro de 3–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `canvas` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.17 Plano E2E — Caption Clash

**Setup:** criar sala limpa, carregar pack fixture determinístico de `caption-clash`, usar seed conhecida e número de jogadores dentro de 3–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.18 Plano E2E — Buzzer Arena

**Setup:** criar sala limpa, carregar pack fixture determinístico de `buzzer-arena`, usar seed conhecida e número de jogadores dentro de 2–30. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `buzzer` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.19 Plano E2E — Word Chain

**Setup:** criar sala limpa, carregar pack fixture determinístico de `word-chain`, usar seed conhecida e número de jogadores dentro de 2–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.20 Plano E2E — Categories Rush

**Setup:** criar sala limpa, carregar pack fixture determinístico de `categories-rush`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.21 Plano E2E — Charades

**Setup:** criar sala limpa, carregar pack fixture determinístico de `charades`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.22 Plano E2E — Spy Room

**Setup:** criar sala limpa, carregar pack fixture determinístico de `spy-room`, usar seed conhecida e número de jogadores dentro de 4–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.23 Plano E2E — Secret Mission

**Setup:** criar sala limpa, carregar pack fixture determinístico de `secret-mission`, usar seed conhecida e número de jogadores dentro de 3–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.24 Plano E2E — Hot Potato

**Setup:** criar sala limpa, carregar pack fixture determinístico de `hot-potato`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `pass` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.25 Plano E2E — Reaction Tap

**Setup:** criar sala limpa, carregar pack fixture determinístico de `reaction-tap`, usar seed conhecida e número de jogadores dentro de 2–30. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `tap` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.26 Plano E2E — Memory Grid

**Setup:** criar sala limpa, carregar pack fixture determinístico de `memory-grid`, usar seed conhecida e número de jogadores dentro de 1–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `grid` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.27 Plano E2E — Emoji Decode

**Setup:** criar sala limpa, carregar pack fixture determinístico de `emoji-decode`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.28 Plano E2E — Survey Says

**Setup:** criar sala limpa, carregar pack fixture determinístico de `survey-says`, usar seed conhecida e número de jogadores dentro de 4–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `buzzer+text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.29 Plano E2E — Guess the Song

**Setup:** criar sala limpa, carregar pack fixture determinístico de `guess-the-song`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `buzzer+text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.30 Plano E2E — Photo Roulette Local

**Setup:** criar sala limpa, carregar pack fixture determinístico de `photo-roulette`, usar seed conhecida e número de jogadores dentro de 3–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `photo` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.31 Plano E2E — Pixel Reveal

**Setup:** criar sala limpa, carregar pack fixture determinístico de `pixel-reveal`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `buzzer` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.32 Plano E2E — Number Line

**Setup:** criar sala limpa, carregar pack fixture determinístico de `number-line`, usar seed conhecida e número de jogadores dentro de 2–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.33 Plano E2E — Team Relay

**Setup:** criar sala limpa, carregar pack fixture determinístico de `team-relay`, usar seed conhecida e número de jogadores dentro de 4–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `mixed` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.34 Plano E2E — Forbidden Word

**Setup:** criar sala limpa, carregar pack fixture determinístico de `forbidden-word`, usar seed conhecida e número de jogadores dentro de 3–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.35 Plano E2E — Who Am I

**Setup:** criar sala limpa, carregar pack fixture determinístico de `who-am-i`, usar seed conhecida e número de jogadores dentro de 3–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.36 Plano E2E — This or That

**Setup:** criar sala limpa, carregar pack fixture determinístico de `this-or-that`, usar seed conhecida e número de jogadores dentro de 2–30. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `vote` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.37 Plano E2E — Story Chain

**Setup:** criar sala limpa, carregar pack fixture determinístico de `story-chain`, usar seed conhecida e número de jogadores dentro de 3–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `text` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.38 Plano E2E — Party Auction

**Setup:** criar sala limpa, carregar pack fixture determinístico de `party-auction`, usar seed conhecida e número de jogadores dentro de 3–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `bid` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.39 Plano E2E — Prediction Round

**Setup:** criar sala limpa, carregar pack fixture determinístico de `prediction-market`, usar seed conhecida e número de jogadores dentro de 3–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `vote` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.40 Plano E2E — Co-op Escape

**Setup:** criar sala limpa, carregar pack fixture determinístico de `coop-escape`, usar seed conhecida e número de jogadores dentro de 2–10. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `mixed-secret` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.41 Plano E2E — Tap Race

**Setup:** criar sala limpa, carregar pack fixture determinístico de `tap-race`, usar seed conhecida e número de jogadores dentro de 2–20. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `tap` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

## A.42 Plano E2E — Soundboard Chaos

**Setup:** criar sala limpa, carregar pack fixture determinístico de `soundboard-chaos`, usar seed conhecida e número de jogadores dentro de 2–12. Confirmar no início que o host recebe apenas public view e cada jogador recebe somente private view permitida.

**Caminho feliz:** iniciar o jogo, percorrer todas as fases, executar pelo menos uma ação válida por jogador, verificar ACK, refletir progresso no host, resolver ronda no servidor e comparar score final com fixture esperada. O teste deve verificar texto/estado funcional, não depender apenas de screenshot.

**Concorrência:** enviar duas ou mais ações quase simultâneas na fase crítica para confirmar que a regra de `buttons` é determinística e que o servidor rejeita/ignora ações inválidas sem crash. Repetir uma ação com o mesmo `eventId` e confirmar idempotência.

**Reconexão:** desconectar um participante a meio da ronda; manter os outros ativos; reconectar dentro da janela; solicitar snapshot; confirmar identidade, score, team e estado privado correto. Em seguida fazer refresh total do browser e repetir recuperação. Se o plugin não permite retorno imediato, a UI deve explicar que participará na próxima ronda.

**Admin:** pausar, retomar e executar `skip round`. Verificar que timers não continuam correndo de forma invisível durante pause e que `skip` produz estado válido. Testar `return to lobby` e confirmar roster preservado.

**Erro:** enviar payload maior/fora do schema, action type desconhecido e action da fase anterior. Esperado: erro tipado, log sanitizado e partida permanece funcional.

**Conclusão:** finalizar jogo, verificar resultado, Party Points e título/stats quando houver. Reexecutar com a mesma seed deve reproduzir conteúdo/ordem aleatória relevante, exceto timestamps/IDs.

# 60. APÊNDICE B — CHECKLIST DE REVIEW DE CÓDIGO

Para cada PR/commit grande, verificar:

### Arquitetura
- lógica de negócio está fora de componentes React;
- plugin não acessa DB/socket diretamente;
- tipos/protocolos compartilhados não são duplicados;
- public/private view está clara;
- side effects isolados.

### TypeScript
- `strict` sem `any` injustificado;
- exhaustive checks em estados;
- schemas runtime para input externo;
- tipos gerados/inferidos dos schemas quando possível.

### React
- hooks não condicionais;
- effects com cleanup;
- sockets não duplicam listeners;
- state derivado não é replicado sem necessidade;
- lista tem keys estáveis;
- loading/error/empty states.

### Server
- nenhuma trust em client score/timer;
- auth por action;
- rate limit;
- cleanup de room;
- graceful shutdown;
- DB transaction quando necessário.

### Media
- stream em vez de carregar ficheiro inteiro em RAM;
- range requests para áudio/vídeo quando útil;
- MIME e signature;
- path seguro;
- quotas.

### UX
- touch target;
- portrait;
- keyboard no admin;
- errors legíveis;
- reconnection feedback;
- não existe canto preto/iframe mal dimensionado.

---

# 61. APÊNDICE C — ESTADOS E ERROS PADRONIZADOS

Códigos sugeridos:

```text
ROOM_NOT_FOUND
ROOM_CLOSED
ROOM_LOCKED
ROOM_FULL
JOIN_TOKEN_INVALID
PLAYER_KICKED
PLAYER_NOT_FOUND
NOT_AUTHORIZED
ADMIN_AUTH_REQUIRED
INVALID_PAYLOAD
INVALID_GAME_ACTION
STALE_PHASE
DEADLINE_EXPIRED
ALREADY_ANSWERED
BUZZER_LOCKED
RATE_LIMITED
CONTENT_PACK_INVALID
UPLOAD_TOO_LARGE
UPLOAD_TYPE_NOT_ALLOWED
UPLOAD_QUOTA_EXCEEDED
UPLOAD_INCOMPLETE
STORAGE_UNAVAILABLE
PLUGIN_ERROR
STATE_VERSION_MISMATCH
SERVER_BUSY
```

Cada erro mapeia para:

- HTTP/socket code;
- mensagem PT;
- mensagem EN;
- retryable boolean;
- telemetry category;
- ação de UI recomendada.

Nunca mostrar códigos técnicos sozinhos para jogador, mas incluí-los em detalhes/copiar diagnóstico.

---

# 62. APÊNDICE D — GAME STATE EXAMPLE

Exemplo de um Quiz Rush em memória:

```json
{
  "pluginId": "quiz-rush",
  "schemaVersion": 1,
  "seed": "01J...",
  "phase": "ACTIVE",
  "round": 3,
  "deadlineAt": 1787523456789,
  "questionId": "q-pt-0031",
  "answers": {
    "player-a": {"choiceId": "b", "receivedAt": 1787523451001},
    "player-b": {"choiceId": "c", "receivedAt": 1787523451209}
  },
  "scores": {"player-a": 1320, "player-b": 1180}
}
```

Public view NÃO inclui `correctChoiceId` enquanto a fase estiver ativa. Private view do player não inclui answers dos outros antes da resolução.

---

# 63. APÊNDICE E — CONTEÚDO, SEGURANÇA E MODERAÇÃO SOCIAL

Party games frequentemente dependem de texto livre. O sistema precisa permitir humor sem transformar o host em plataforma vulnerável.

## E.1 Texto livre

- máximo por jogo;
- normalizar Unicode;
- escapar na renderização;
- armazenar como texto;
- host pode remover;
- profanity filter é configuração, não garantia absoluta.

## E.2 Custom content

Admin é responsável pelo conteúdo importado, mas aplicação precisa impedir execução técnica. JSON/YAML é dado; nunca usar `eval`, scripts, HTML arbitrário ou templates executáveis.

## E.3 Fotos

Consentimento explícito, possibilidade de apagar e moderação. O produto não deve inferir identidade, localização ou conteúdo sensível automaticamente.

## E.4 Crianças/família

`family` remove prompts adultos e desafios físicos arriscados. Qualquer desafio deve poder ser recusado/pulado.

---

# 64. APÊNDICE F — LOAD TEST MODEL

Criar CLI `pnpm test:load --players 30 --duration 120`.

Simulador:

- abre socket por virtual player;
- faz join;
- ready;
- mantém heartbeat natural do client;
- emite respostas com distribuição aleatória;
- parte dos clients reage;
- 20% desconectam/reconectam uma vez;
- todos finalizam.

Coletar:

- connect success;
- join success;
- ACK p50/p95/p99;
- messages/sec;
- reconnect recovery rate;
- server RSS início/pico/fim;
- event loop lag;
- erros.

Acceptance inicial em PC comum:

- 30 clients virtuais sem crash;
- >99% ações críticas ACKed no teste local;
- memória estabiliza após encerrar sala;
- sem crescimento contínuo indicando listener leak.

---

# 65. APÊNDICE G — TROUBLESHOOTING AUTOMÁTICO

Adicionar `rs-party doctor`.

Saída:

```text
[PASS] Node/runtime supported
[PASS] Data directory writable
[PASS] Library directory present
[PASS] SQLite open/migration
[PASS] Port 3210 available
[PASS] LAN interface 192.168.1.25 detected
[WARN] mDNS advertisement unavailable
[INFO] Internet not detected — local party still supported
[PASS] Web bundle present
[PASS] Socket self-test
```

Doctor não deve enviar informação para Internet. `--json` gera resultado para suporte.

---

# 66. APÊNDICE H — RELEASE CHECK

Antes de tag `v1.0.0`:

1. checkout limpo;
2. instalar com lockfile;
3. migration em DB novo;
4. migration em fixture versão anterior;
5. verify;
6. build;
7. start production;
8. health;
9. host create room;
10. player join via LAN se hardware disponível;
11. jogo P0 smoke;
12. reconnect smoke;
13. upload smoke;
14. backup;
15. shutdown/restart;
16. docs links internos;
17. license notices;
18. changelog;
19. checksum artifact.

Release notes precisam distinguir `implemented`, `experimental`, `roadmap`.

---

# 67. APÊNDICE I — DECISÕES ARQUITETURAIS (ADR RESUMIDO)

## ADR-001 — Servidor autoritativo
**Decisão:** estado e score no servidor.  
**Motivo:** consistência, anti-cheat, reconexão e multi-device.

## ADR-002 — Socket.IO
**Decisão:** backbone realtime.  
**Motivo:** rooms, fallback transport, reconexão, ecossistema maduro. Ainda implementar idempotência/snapshot porque delivery completa não é automática.

## ADR-003 — SQLite
**Decisão:** persistência local.  
**Motivo:** zero serviço externo, deployment simples, transações.

## ADR-004 — React/Vite
**Decisão:** browser UI compartilhada, lazy-load por jogos.  
**Motivo:** ecossistema, mobile/desktop, build estático.

## ADR-005 — HTTP LAN core
**Decisão:** core funciona via HTTP local.  
**Motivo:** certificados locais são fricção. Features secure-context são enhancements.

## ADR-006 — Same-origin local
**Decisão:** frontend e API/socket pelo mesmo host/porta.  
**Motivo:** reduzir CORS e permissões de acesso a rede local entre origins.

## ADR-007 — WebRTC opcional
**Decisão:** apenas otimização de Party Drop.  
**Motivo:** P2P não deve tornar jogo dependente de signaling/NAT/capability.

## ADR-008 — Plugin game engine
**Decisão:** jogos isolados por contrato.  
**Motivo:** catálogo grande sem duplicar networking/auth/state.

---

# 68. APÊNDICE J — CRITÉRIOS DE POLISH

Um produto profissional não termina quando “funciona”. Antes de concluir:

- transições não saltam layout;
- skeleton/loading só onde necessário;
- todos botões têm pressed/disabled/focus;
- feedback de buzzer é instantâneo;
- não há textos técnicos no ecrã de festa;
- QR tem quiet zone e tamanho suficiente;
- código da sala pode ser lido a 3–5 metros;
- score changes animam sem perder legibilidade;
- winner screen não bloqueia host por 30 s;
- som possui volume e mute;
- erro de conexão explica ação;
- empty states têm CTA útil;
- admin confirma ações destrutivas;
- mobile keyboard não tapa input/submeter;
- iOS safe area considerada;
- Android back não encerra sessão acidentalmente;
- viewport usa `dvh`/fallback corretamente;
- no overflow horizontal em 320–430 px;
- nenhuma scrollbar dentro de botão/card.

---

# 69. APÊNDICE K — EXEMPLO DE PARTY MIX COMPLETO

Grupo: 8 pessoas, 60 minutos, `normal`, family.

1. **This or That** — 5 min, onboarding sem explicar muito.
2. **Quiz Rush** — 10 min, competição.
3. **Hot Potato** — 5 min, levantar energia.
4. **Draw & Guess** — 12 min, criatividade.
5. Intermission + Jukebox requests — 3 min.
6. **Spy Room** — 10 min, social/table mode.
7. **Reaction Tap** — 4 min, reset rápido.
8. **Survey Says** — 8 min em equipas.
9. Final awards — 3 min.

Awards podem incluir:

- campeão Party Points;
- mestre do buzzer;
- artista;
- maior comeback;
- estratega;
- rei/rainha das reações;
- melhor equipa.

Títulos devem ser positivos/engraçados, nunca atacar característica pessoal.

---

# 70. APÊNDICE L — CHECKLIST “SEM INTERNET DE VERDADE”

Teste físico/automatizado:

- [ ] desligar WAN do router ou dados móveis;
- [ ] limpar cache do player browser quando possível;
- [ ] manter host e phones na LAN;
- [ ] abrir URL local;
- [ ] carregar CSS/JS/fonts/icons;
- [ ] criar sala;
- [ ] entrar por QR;
- [ ] jogar Quiz Rush;
- [ ] carregar Draw & Guess lazy chunk;
- [ ] abrir admin;
- [ ] enviar imagem via Party Drop;
- [ ] tocar áudio local;
- [ ] terminar jogo;
- [ ] exportar resultados.

Se qualquer passo tentar CDN/API externa e falhar, corrigir antes do release.

---

# 71. APÊNDICE M — CHECKLIST DE ENTREGA AO UTILIZADOR

O OpenCode deve deixar no repo e, se ambiente permitir, gerar artefactos:

- código completo;
- lockfile;
- build;
- README;
- quick start;
- admin guide;
- networking guide;
- game plugin guide;
- content pack guide;
- troubleshooting;
- security notes;
- implementation report;
- test reports;
- release notes;
- sample content packs;
- script doctor;
- script backup;
- script start.

A entrega final do agente deve dizer apenas o que existe realmente e indicar caminhos/comandos verificáveis.

---

# 72. APÊNDICE N — PRINCÍPIOS DE GAME DESIGN PARA TODA A PLATAFORMA

## N.1 Explicar jogando

A primeira ronda deve ensinar o jogo com texto mínimo. Sempre que possível:

1. host mostra uma frase;
2. telefone destaca ação;
3. ronda 1 tem stakes menores;
4. depois entra complexidade/power-ups.

Evitar tutorial de cinco páginas antes de uma partida de cinco minutos.

## N.2 Eliminar downtime

Jogador eliminado cedo deve virar spectator ativo, reaction player ou ter side objective. Nunca deixar alguém olhando telefone “aguarde 8 minutos”.

## N.3 Private information cria conversa

Usar telefones para segredos que geram interação presencial: papel, pista, número, carta, palavra. Não transformar a festa em oito pessoas isoladas digitando silenciosamente.

## N.4 Reveal é o payoff

Submissão → suspense curto → reveal → reação → score. A duração do suspense deve ser configurável e normalmente 0.5–2.5 s, não 10 s.

## N.5 Competição não pode destruir participação

Jogadores atrás ainda recebem objetivos alcançáveis. Comeback é suave. Jogos sociais oferecem awards alternativos.

## N.6 Timeboxing

Cada jogo possui `estimatedDuration` e deve respeitar Party Mix target. O host consegue configurar `short/standard/long` presets.

## N.7 Conteúdo repetido

Motor mantém history por sessão e evita repetir prompt até esgotar pool. Shuffle é seeded e bag-based, não random puro que pode repetir imediatamente.

## N.8 Feedback

Toda ação do jogador produz uma destas respostas em <100ms localmente:

- pressed;
- selected;
- pending;
- accepted;
- rejected.

A confirmação final continua server-side.

---

# 73. APÊNDICE O — ESPECIFICAÇÃO DE PARTY RESULTS

Resultados finais devem combinar competição e lembrança da sessão.

## O.1 Dados

- total Party Points;
- wins;
- podiums;
- correct answers;
- buzzer wins;
- votes received;
- drawings completed;
- reactions sent;
- comeback delta;
- games played;
- team stats.

## O.2 Awards engine

Awards são regras declarativas. Exemplo:

```ts
{
  id: 'fast-finger',
  when: stats => stats.buzzerWins >= 3,
  priority: 20,
  titleKey: 'awards.fastFinger'
}
```

Um jogador não deve receber dez cards; selecionar 1–2 melhores awards. Evitar awards negativos como “pior jogador”.

## O.3 Export

Host pode exportar JSON/CSV e uma imagem/card de resultados gerada localmente. Se Web Share não existir, oferecer download.

---

# 74. APÊNDICE P — PLANO DE MIGRAÇÃO E COMPATIBILIDADE

## P.1 DB

Migrations numeradas e idempotentes onde aplicável. Em startup:

1. backup pequeno automático do DB antes de migration destrutiva;
2. aplicar em transação;
3. se falhar, abortar startup com mensagem clara;
4. não continuar com schema parcialmente migrado.

## P.2 Protocol

`protocolVersion` no hello. Se server e client divergem:

- tentar reload asset quando mesmo release;
- mostrar `Atualização necessária`;
- não aceitar actions com schema desconhecido.

## P.3 Content packs

`schemaVersion` com migrators para versões antigas. Nunca sobrescrever pack original sem backup/export.

---

# 75. APÊNDICE Q — SECURITY TEST CASES

- WebSocket handshake com Origin não autorizado → rejeitar.
- Player tenta `admin:kick` → `NOT_AUTHORIZED`.
- Player altera `playerId` no payload → actor vem da sessão, não do payload.
- XSS em nickname `<img onerror=...>` → render como texto/invalidar.
- XSS em chat → texto.
- SQL injection string → parâmetro, sem efeito.
- Room code brute burst → rate limit.
- 1000 reactions/s → throttle/drop sem memory spike.
- payload socket 5 MB → reject/close conforme policy.
- ZIP com `../evil` → reject.
- `file.jpg.exe` → reject.
- MIME falso → signature mismatch.
- file name `CON`, `..`, slashes → storage UUID.
- session token em query log → evitar ou redigir.
- kicked reconnect → fail.
- expired admin session → socket actions fail.
- duplicate eventId → one effect.
- stale round action → reject.

---

# 76. APÊNDICE R — OPERAÇÃO EM EVENTO

## Antes

1. iniciar host;
2. executar doctor;
3. confirmar storage;
4. testar QR com um telefone;
5. escolher packs;
6. testar som/TV;
7. desativar sleep do host;
8. ligar carregador;
9. preferir 5 GHz para throughput quando cobertura permitir, mas 2.4 GHz pode alcançar mais longe;
10. manter IP/QR visível.

## Durante

- lock room se necessário;
- monitorar players;
- não abrir Admin no ecrã público;
- usar pause em interrupções;
- Jukebox volume separado.

## Depois

- export results se desejado;
- export Photo Wall apenas com consentimento/configuração;
- encerrar sala;
- limpar temp;
- biblioteca permanece.

---

# 77. APÊNDICE S — WHY THIS ARCHITECTURE

Esta arquitetura deliberadamente prefere um servidor local simples a serviços geridos. Party games têm tráfego pequeno, mas precisam baixa fricção, estado consistente e funcionar quando a Internet desaparece. Um único processo Node + SQLite + static web consegue atender dezenas de jogadores numa LAN comum sem exigir Redis, Kubernetes ou cloud.

O risco maior não é throughput: é **estado divergente**. Se um jogador vê ronda 4 enquanto o host está na 5, a experiência quebra. Por isso, `stateVersion`, deadlines, snapshots e servidor autoritativo são mais importantes que micro-otimizações.

O segundo risco é **fricção de onboarding**. QR e browser vencem instalação. `.local` ajuda, mas IP continua fallback. Service Worker/PWA ajuda repetição, mas não pode bloquear primeira abertura numa rede HTTP local.

O terceiro risco é **feature rot**: botões aparecem, backend não existe. A Definition of Done e E2E multi-context existem especificamente para impedir esse padrão.

---

# 78. APÊNDICE T — PRIORIDADE DE IMPLEMENTAÇÃO SE HOUVER LIMITAÇÃO REAL DE TEMPO/AMBIENTE

A ordem abaixo NÃO autoriza parar cedo; serve apenas para garantir que esforço produz produto coerente primeiro.

### Tier 0 — indispensável
Server, LAN, QR, room, reconnect, admin auth, engine, Quiz Rush, Buzzer, Majority Vote, tests.

### Tier 1 — produto party real
Party Mix, Bingo, Bluff, Draw, Charades, Spy Room, Survey, Pixel Reveal, reactions, PT/EN.

### Tier 2 — expansão social
Party Drop, Photo Wall, Jukebox, content editor, remaining P1 games.

### Tier 3 — polish avançado
Power-ups amplos, advanced awards, WebRTC optimization, HTTPS optional mode, Android host scaffolding.

Se algum Tier 3 não puder ser comprovado no ambiente, manter claramente experimental; nunca rebaixar silenciosamente Tier 0/1.

---

# 79. APÊNDICE U — COMANDOS DE VERIFICAÇÃO ESPERADOS

O projeto deve oferecer ou documentar equivalentes:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
pnpm test:load --players 30 --duration 60
pnpm verify
pnpm start
```

Depois:

```bash
curl http://127.0.0.1:3210/health
```

E teste LAN pelo IP escolhido. Em Windows, oferecer PowerShell equivalente na documentação.

---

# 80. CONCLUSÃO E CONTRATO FINAL

RS Party Hub deve sair desta implementação como **uma plataforma local-first de party games**, não como uma homepage bonita com meia dúzia de botões. A Wi‑Fi/LAN é o fundamento: o host oferece o serviço; os telefones tornam-se controladores; o ecrã central vira palco; a rede continua útil mesmo sem Internet.

A implementação ideal tem uma base pequena e robusta, protocolo explícito, estado autoritativo, conteúdo extensível e dezenas de jogos sobre o mesmo engine. A diferenciação vem da combinação de:

- offline/LAN real;
- zero instalação para jogadores;
- QR/code join;
- big-screen e table mode;
- Party Mix;
- catálogo variado;
- Party Drop;
- Jukebox;
- Photo Wall;
- conteúdo custom;
- privacidade local;
- reconexão confiável;
- UI polida;
- baixo consumo.

O OpenCode deve usar este documento como contrato. A resposta final do agente precisa ser acompanhada de build/test evidence. Se algo falhar, a tarefa é corrigir, não apenas explicar. Se uma biblioteca ou técnica sugerida aqui tiver incompatibilidade concreta no ambiente, substitua-a por alternativa equivalente que preserve os princípios e documente a decisão em ADR/Implementation Report.

**Critério final:** uma pessoa não técnica deve conseguir ligar-se ao mesmo Wi‑Fi, ler um QR, escolher um nome e começar a divertir-se. Um engenheiro deve conseguir abrir o repositório, entender o protocolo, adicionar um jogo novo e verificar tudo com testes sem depender de serviços externos.

---

# 81. APÊNDICE V — MATRIZ COMPETITIVA E LINKS DE PESQUISA

**Data da pesquisa:** 23 de agosto de 2026. As páginas abaixo foram usadas para extrair padrões de UX, arquitetura e expectativas de utilizadores. Elas são referências; o RS Party Hub deve manter identidade, código, conteúdo e assets próprios.

## V.1 Matriz de padrões observados

| Referência | Browser sem app | Código/QR | Ecrã comum | Ecrã privado no telefone | Catálogo | Reações/power-ups | Self-host/local | Lição para RS |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Jackbox | Sim para controller | Código | Sim | Sim | Alto | depende do jogo | Não como foco | UX de sala + telefone controlador |
| AirConsole | Sim | Session code | Sim | Sim | Alto | depende do jogo | Não como foco | usar sensores/segredos do smartphone |
| Kahoot | Sim | PIN + QR | Sim | Parcial | Quiz | limitado | Não | onboarding e feedback de respostas |
| Huddle | Sim | Código | Não necessário | Sim, central | Pequeno/médio | social | Não self-host como foco | Table Mode, telefones como cartas secretas |
| Blip Party | Sim | Room code | Sim | Sim | dezenas | varia | Não | diversidade + setup rápido |
| Phones Out | Sim | QR + código | Sim | Sim | dezenas | varia | Não | TV/laptop como palco e controllers privados |
| PixReveal | Sim | Link/ID/QR | Sim | Sim | foco num jogo | Sim | Não | late join, emotes, power-ups, sudden death |
| PairDrop | Sim | QR/codes | N/A | N/A | N/A | N/A | Sim | transferências LAN cross-platform, progress, fallback |
| Snapdrop | Sim | discovery | N/A | N/A | N/A | N/A | Sim | WebRTC/WebSocket/PWA para file sharing local |

## V.2 Links oficiais e técnicos

### Party games / UX

- Jackbox Games — How to Play: https://www.jackboxgames.com/how-to-play
- Jackbox Support — How do I join a game?: https://support.jackboxgames.com/hc/en-us/articles/15794759479959-How-do-I-join-a-game
- Jackbox Support — Remote play/settings: https://support.jackboxgames.com/hc/en-us/articles/15794770038423-Can-I-play-Jackbox-Games-remotely
- AirConsole — About: https://www.airconsole.com/info
- AirConsole developer documentation: https://documentation.airconsole.com/
- Kahoot Help — Join: https://support.kahoot.com/hc/en-us/articles/360039890713-Kahoot-join-How-to-join-a-Kahoot-game
- Kahoot Help — 2-step Join: https://support.kahoot.com/hc/en-us/articles/35342050693789-How-to-use-the-2-step-Join-option-to-secure-your-game
- Huddle: https://www.huddlenight.com/
- Huddle game catalog: https://www.huddlenight.com/games
- Blip Party: https://www.blipparty.com/
- Phones Out: https://www.phonesout.games/
- PixReveal About: https://www.pixreveal.com/about
- PixReveal updates/blog: https://www.pixreveal.com/blog

### Open source / local file sharing

- PairDrop GitHub: https://github.com/schlagmichdoch/PairDrop
- Snapdrop GitHub: https://github.com/Snapdrop/Snapdrop

### Realtime/network

- Socket.IO — Rooms: https://socket.io/docs/v4/rooms/
- Socket.IO — Delivery guarantees: https://socket.io/docs/v4/delivery-guarantees/
- Socket.IO — Connection state recovery: https://socket.io/docs/v4/connection-state-recovery/
- MDN — WebSocket: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- MDN — RTCDataChannel: https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel
- RFC 6762 — Multicast DNS: https://www.rfc-editor.org/rfc/rfc6762
- Android Developers — Local-only Wi-Fi hotspot: https://developer.android.com/develop/connectivity/wifi/localonlyhotspot
- Android Developers — Wi-Fi connectivity/NSD/P2P: https://developer.android.com/develop/connectivity/wifi
- Chrome Developers — Local Network Access: https://developer.chrome.com/blog/local-network-access
- MDN — Local network access security: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Local_network_access

### Browser capabilities / offline

- web.dev — PWA assets and data: https://web.dev/learn/pwa/assets-and-data
- web.dev — Service workers: https://web.dev/learn/pwa/service-workers
- MDN — Wake Lock: https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
- MDN — Device orientation events: https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events
- MDN — Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Security

- OWASP — WebSocket Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- OWASP — File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- OWASP — Input Validation Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- OWASP — HTML5 Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

### Comunidade

A pesquisa também consultou discussões em `r/localmultiplayergames`, `r/selfhosted`, `r/partygames`, `r/gamingsuggestions` e `r/IndieGaming`. O padrão recorrente em 2025–2026 é a procura por experiências que começam em segundos, funcionam no navegador, usam telefones como controladores, não exigem downloads/contas e suportam grupos casuais. Comentários de developers recentes também destacam late join, power-ups, emotes e catálogos de minijogos como elementos que aumentam replayability.

## V.3 Regra de pesquisa para o OpenCode durante a implementação

Se uma API, dependência ou browser behavior estiver diferente do descrito neste documento, consultar primeiro documentação oficial atual. Para bugs específicos de bibliotecas, GitHub Issues/Discussions são válidos como evidência secundária. Reddit/fóruns podem orientar UX e reproduções, mas nunca devem ser a única fonte para decisões de segurança/protocolo.


---

# 82. APÊNDICE W — DELTA DE PESQUISA PROFUNDA 2026 E LIÇÕES DE PRODUTOS REAIS

Esta secção complementa a pesquisa original com referências adicionais encontradas em projetos self-hosted e experiências recentes de party games browser-first. O objetivo não é copiar código nem identidade visual, mas transformar padrões recorrentes em requisitos concretos e verificáveis do RS Party Hub.

## W.1 GameNight — self-hosted, LAN, zero conta

O projeto `abhijatchaturvedi/gamenight` demonstra que um party hub local pode ser extremamente simples para o utilizador: executar um comando, mostrar todas as URLs de rede, anunciar por mDNS, permitir sala por código, guardar nome/avatar, suportar reconnect e spectator mode. A principal lição para o RS Party Hub é que a ergonomia de operação do host precisa ser tratada como feature de primeira classe. O utilizador não deve descobrir manualmente o IP do PC nem navegar por definições de rede. Ao arrancar, o RS Party Hub deve enumerar interfaces IPv4 úteis, selecionar a melhor rota LAN, exibir QR Code, URL numérica e hostname mDNS, e deixar um botão “Copiar endereço”.

Também é relevante a presença de `start.bat`/`start.sh` em projetos semelhantes. Para o RS Party Hub, o equivalente deve ser superior: launcher amigável no Windows, CLI previsível e possibilidade de “portable mode”. O launcher deve executar diagnóstico prévio, detectar porta ocupada, firewall, ausência de permissões e adaptadores sem conectividade, e oferecer correção guiada.

Referência: https://github.com/abhijatchaturvedi/gamenight

## W.2 Rumpus — separação host/player e simplicidade de runtime

`rodwilco/rumpus` utiliza `/host` para o ecrã comum e `/play` para controllers em smartphones, com Node/Express/Socket.IO. A lição é manter papéis explícitos mesmo quando partilham componentes. O RS Party Hub deve ter rotas e shells diferentes para host, player e admin. O jogador não deve carregar bundles ou controlos administrativos desnecessários, e o host não deve expor secrets de administração no DOM enviado ao player.

Rumpus também mostra o valor de não depender obrigatoriamente de um client build pesado para cada alteração. O RS Party Hub continuará com uma stack moderna, mas o build deve gerar assets estáticos simples, cacheáveis localmente e servidos pelo mesmo processo do backend.

Referência: https://github.com/rodwilco/rumpus

## W.3 Couch Kit / Buzz — host autoritativo, time sync e recovery

Os projetos `react-native-couch-kit` e `buzz-tv-party-game` reforçam três requisitos: o host é a fonte de verdade, controllers podem ser web, e jogos sensíveis a tempo precisam de sincronização de relógio e preloading. O RS Party Hub deve manter um `serverEpoch`, medir RTT periodicamente e calcular um `clockOffset` por cliente. Timers exibidos no telefone não podem depender de `setInterval` como autoridade; recebem `deadlineServerMs` e renderizam uma estimativa local compensada.

Preloading é igualmente importante. Antes de mudar para uma fase que dependa de imagens, sons ou clips, o servidor pode iniciar uma fase `PRELOAD`, enviar um manifesto de assets e aguardar `client:preload-ready` até um limite de tempo. Clientes lentos não podem bloquear toda a festa indefinidamente; após timeout, entram com fallback.

Referências: https://github.com/faluciano/react-native-couch-kit e https://github.com/faluciano/buzz-tv-party-game

## W.4 Hotspot Arcade — captive portal e modo “dead zone”

`hotspot-arcade` prova que a experiência “ligar ao hotspot → abrir browser → jogar” funciona até em hardware pequeno. A ideia de captive portal é desejável como modo opcional, mas em Windows/Android deve ser tratada com cuidado: sistemas operativos podem abrir mini-browsers limitados e captive portals variam muito por plataforma. Portanto, o RS Party Hub não deve depender do captive portal para funcionalidades críticas; ele é apenas acelerador de onboarding. O QR e URL normal permanecem caminhos oficiais.

A lição de produto mais valiosa é “dead-zone capable”: depois de instalar e preparar packs, nenhum pedido externo deve ocorrer no fluxo de jogo. Fontes, ícones, sons, perguntas e assets precisam estar locais. O modo offline deve ser testado desligando fisicamente a WAN.

Referências: https://github.com/tarikbc/hotspot-arcade e https://github.com/genkigenki/hotspot-arcade-cardputer

## W.5 PartyPad — smartphones como controladores universais

`PartyPad` usa browser de telefone como controller e integra movimento/inputs com emuladores. Para o RS Party Hub isso inspira uma camada de “Controller Capabilities”. Ao entrar, o cliente informa touch, pointer, motion permission, vibration, audio, microphone, camera, viewport, orientation e secure-context availability. Cada jogo declara capacidades necessárias e opcionais. Se um jogo usa giroscópio, por exemplo, deve haver fallback touch para iOS/Android onde permissão ou HTTPS não esteja disponível.

Referência: https://github.com/benmross/partypad

## W.6 Tendências observadas em Reddit e comunidades

Discussões recentes em `r/localmultiplayergames`, `r/selfhosted`, `r/partygames` e comunidades próximas repetem alguns desejos: começar em menos de um minuto, não instalar app, não criar conta, aceitar 6–10 ou mais jogadores, ter vários minijogos numa única sessão, permitir desenho, quiz, memória, música, social deduction, power-ups e reações. Outro padrão é a rejeição de produtos que são apenas “um clone de Jackbox”: utilizadores valorizam variedade, ritmo, modos cooperativos e formas de usar o telefone além de quatro botões.

O RS Party Hub deve, portanto, evitar ser apenas uma coleção de formulários. O controller precisa mudar de forma conforme o jogo: canvas, slider, dial, joystick, buzzer, teclado, cartas, fotos, sons, votação, gestos touch, drag-and-drop e painéis secretos.

Referências de comunidade consultadas:
- https://www.reddit.com/r/localmultiplayergames/comments/1ejbogt/any_games_similar_to_jackbox_where_everyone_can/
- https://www.reddit.com/r/selfhosted/comments/1ovjgcx/are_there_any_selfhosted_multiplayer_party_games/
- https://www.reddit.com/r/boardgames/comments/16fkrw8/games_like_jackbox/

## W.7 Requisitos derivados desta pesquisa

1. Startup precisa descobrir e apresentar LAN URLs automaticamente.
2. mDNS é convenience, nunca único caminho.
3. Host/player/admin são papéis e shells separados.
4. Timers usam `deadlineServerMs`, clock sync e compensação de RTT.
5. Assets críticos podem ser preloaded por fase.
6. Captive portal é opcional e não substitui URL/QR.
7. Nenhum asset cloud deve ser necessário no modo offline.
8. Controller reporta capacidades do browser/dispositivo.
9. Cada jogo declara `requiredCapabilities` e `optionalCapabilities`.
10. Funcionalidade com sensor/câmara/mic precisa de fallback ou bloqueio claro.
11. O produto deve oferecer modos competitivos, cooperativos e sociais.
12. Reconexão precisa restaurar papel, identidade, estado privado e fase.
13. O host deve continuar operável se a Internet cair durante a festa.
14. O primeiro jogo deve poder começar sem conta e sem onboarding longo.
15. A diversidade de inputs do telefone é parte da identidade do produto.

---

# 83. APÊNDICE X — ARQUITETURA DE REPOSITÓRIO E RESPONSABILIDADES POR PACOTE

A implementação deve preferir um monorepo TypeScript com limites claros. A seguinte árvore é normativa como intenção arquitetural; nomes podem ser ajustados apenas se o resultado mantiver separação equivalente.

```text
RS-Party-Hub/
├─ apps/
│  ├─ server/                 # HTTP, Socket.IO, scheduler, persistence, game runtime
│  ├─ host-web/               # ecrã comum/TV/projetor
│  ├─ player-web/             # controller mobile-first
│  ├─ admin-web/              # gestão, packs, biblioteca, diagnóstico
│  └─ launcher/               # bootstrap/desktop helper opcional
├─ packages/
│  ├─ contracts/              # schemas, event types, DTOs, shared constants
│  ├─ game-sdk/               # interfaces de plugins e helpers determinísticos
│  ├─ games/                  # implementações oficiais
│  ├─ ui/                     # design system partilhado
│  ├─ network/                # discovery, URLs, mDNS adapters, clock sync
│  ├─ persistence/            # repositories e migrations SQLite
│  ├─ media/                  # uploads, transcode optional, waveform, metadata
│  ├─ content/                # packs, validation, import/export
│  ├─ security/               # auth admin, tokens, rate limits, sanitização
│  ├─ diagnostics/            # rs-party doctor, health checks, logs
│  ├─ localization/           # PT/EN dictionaries e ICU helpers
│  └─ testkit/                # factories, fake clock, socket harness, fixtures
├─ content/
│  ├─ builtin/
│  └─ imported/
├─ data/
│  ├─ rs-party.sqlite
│  ├─ uploads/
│  ├─ temp/
│  ├─ exports/
│  ├─ backups/
│  └─ logs/
├─ docs/
│  ├─ architecture/
│  ├─ games/
│  ├─ operations/
│  ├─ security/
│  └─ adr/
├─ scripts/
├─ tests/
│  ├─ e2e/
│  ├─ integration/
│  ├─ load/
│  └─ chaos/
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ eslint.config.*
├─ playwright.config.*
├─ vitest.config.*
├─ docker-compose.yml
├─ Dockerfile
├─ README.md
├─ CHANGELOG.md
├─ IMPLEMENTATION_REPORT.md
└─ .env.example
```

## X.1 Regras de dependência

`contracts` não importa UI, server nem jogos. `game-sdk` pode importar `contracts`, mas não pode importar uma implementação de jogo. `games` importa `game-sdk` e contratos. `server` carrega jogos por registry. Web apps nunca importam acesso direto a SQLite. O admin usa HTTP/Socket APIs oficiais. Isso impede que uma feature “funcione” apenas porque o frontend acessou internals do backend.

## X.2 Contratos compiláveis

Todos os payloads atravessando fronteira de processo/rede precisam de schema runtime, idealmente Zod ou equivalente. TypeScript sozinho não valida dados vindos de browser. Deve existir uma fonte única para eventos, com inferência de tipos a partir do schema. Eventos inválidos geram resposta estruturada e não exception genérica.

## X.3 Game registry

Cada jogo exporta manifesto estático e factory:

```ts
interface GameManifest {
  id: GameId;
  version: string;
  titleKey: string;
  minPlayers: number;
  maxPlayers: number;
  supportsTeams: boolean;
  supportsSpectators: boolean;
  estimatedMinutes: [number, number];
  requiredCapabilities: Capability[];
  optionalCapabilities: Capability[];
  contentKinds: string[];
}
```

O registry deve conseguir listar jogos sem inicializar cada runtime. Isso permite admin/host mostrar catálogo, filtrar por grupo e validar compatibilidade antes de começar.

## X.4 Fake clock como requisito

Game logic não deve chamar `Date.now()` dispersamente. O runtime injeta `Clock`. Testes usam `FakeClock`. Timers, deadlines e power-ups tornam-se testáveis sem `sleep()` real. Esta escolha reduz flakiness e é obrigatória para testes de reconexão e timeout.

## X.5 Side effects

Game reducer ou state machine produz `effects` descritivos, e infraestrutura executa-os. Exemplo: persistir round result, tocar sound cue no host, gerar upload slot ou agendar deadline. Isso facilita replay e testes determinísticos.

---

# 84. APÊNDICE Y — MODELO DE DOMÍNIO E PERSISTÊNCIA DETALHADA

O SQLite é a persistência local oficial. Estados efémeros de frames/ticks podem ficar em memória, mas identidade de festa, settings, packs, media metadata, scores finais e configuração devem sobreviver restart quando indicado.

## Y.1 Entidades principais

### Party
Representa uma sessão social de alto nível. Uma Party pode conter vários GameSessions e sobreviver à troca de minijogo. Campos mínimos: `id`, `code`, `name`, `createdAt`, `endedAt`, `locale`, `status`, `settingsJson`, `seed`, `hostDisplayName`, `schemaVersion`.

### PlayerProfile
Identidade local pseudónima. Não é conta cloud. Pode guardar `deviceIdentityHash`, nome preferido, avatar e preferências de acessibilidade. O servidor nunca deve exigir email ou telefone.

### PartyMember
Liga player a party e contém display name usado nessa festa, cor/avatar, teamId, joinedAt, lastSeenAt, status, globalPartyScore e flags de moderação.

### GameSession
Instância de minijogo dentro de uma party: `gameId`, `gameVersion`, `startedAt`, `endedAt`, `status`, `configJson`, `seed`, `winnerJson`, `resultJson`.

### RoundResult
Dados resumidos por ronda. Não deve guardar snapshots gigantes desnecessariamente.

### ContentPack
Manifesto importado ou builtin, com hash, versão, locale, origem e estado de validação.

### MediaAsset
Metadata de ficheiros locais: nome seguro, nome original, mime detectado, tamanho, sha256, width/height/duration opcional, owner party, purpose, createdAt e expiresAt quando temporário.

### AuditEntry
Eventos administrativos relevantes: login admin, kick, alteração de settings, import/delete pack, export, reset scores. Não deve conter texto secreto de jogos além do necessário.

## Y.2 DDL de referência

```sql
CREATE TABLE parties (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  locale TEXT NOT NULL DEFAULT 'pt',
  status TEXT NOT NULL,
  seed TEXT NOT NULL,
  settings_json TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  ended_at INTEGER
);

CREATE TABLE player_profiles (
  id TEXT PRIMARY KEY,
  device_identity_hash TEXT UNIQUE,
  preferred_name TEXT,
  avatar_json TEXT,
  preferences_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE party_members (
  id TEXT PRIMARY KEY,
  party_id TEXT NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  profile_id TEXT REFERENCES player_profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  avatar_json TEXT,
  team_id TEXT,
  status TEXT NOT NULL,
  party_score INTEGER NOT NULL DEFAULT 0,
  joined_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE TABLE game_sessions (
  id TEXT PRIMARY KEY,
  party_id TEXT NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  game_version TEXT NOT NULL,
  status TEXT NOT NULL,
  seed TEXT NOT NULL,
  config_json TEXT NOT NULL,
  result_json TEXT,
  started_at INTEGER,
  ended_at INTEGER
);

CREATE TABLE round_results (
  id TEXT PRIMARY KEY,
  game_session_id TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_index INTEGER NOT NULL,
  result_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(game_session_id, round_index)
);

CREATE TABLE content_packs (
  id TEXT PRIMARY KEY,
  pack_key TEXT NOT NULL,
  version TEXT NOT NULL,
  locale TEXT,
  source TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  validation_status TEXT NOT NULL,
  installed_at INTEGER NOT NULL,
  UNIQUE(pack_key, version)
);

CREATE TABLE media_assets (
  id TEXT PRIMARY KEY,
  party_id TEXT REFERENCES parties(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  stored_name TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  expires_at INTEGER
);
```

## Y.3 Política de migrations

Toda alteração do schema deve ser migration forward-only versionada. Startup executa migrations numa transação antes de aceitar conexões. Antes de uma migration destrutiva, criar backup automático rotativo. O OpenCode deve escrever testes que abrem uma DB de versão anterior, migram e verificam dados essenciais.

## Y.4 Persistência versus memória

Não persistir cada movimento do pointer ou cada toque do Tap Race. Persistir resultados consolidados. Para recuperação de host crash durante uma partida, manter checkpoint do GameSession em intervalos ou transições de fase. O checkpoint inclui state serializável e versão do plugin. Ao reiniciar, o host deve oferecer “Retomar partida” ou “Encerrar e guardar resultados”.

---

# 85. APÊNDICE Z — CONTRATO HTTP COMPLETO DE REFERÊNCIA

Todas as rotas usam same-origin por padrão. O servidor deve enviar headers seguros compatíveis com LAN HTTP e nunca depender de CORS permissivo `*` para a aplicação normal.

## Z.1 Rotas públicas essenciais

`GET /healthz` retorna estado mínimo sem secrets. `GET /readyz` confirma DB, migrations e game registry. `GET /api/v1/discovery` retorna nome do host, party ativa opcional, endereços úteis e capabilities. `GET /join/:code` serve redirect/bootstrapping do player. `GET /host` e `GET /admin` servem shells apropriados.

## Z.2 Party lifecycle

- `POST /api/v1/parties` cria party.
- `GET /api/v1/parties/:partyId` retorna resumo para host/admin.
- `PATCH /api/v1/parties/:partyId` altera settings permitidos.
- `POST /api/v1/parties/:partyId/lock` bloqueia novas entradas.
- `POST /api/v1/parties/:partyId/unlock` reabre.
- `POST /api/v1/parties/:partyId/end` encerra de forma idempotente.
- `POST /api/v1/parties/:partyId/export` gera export local.

Todos os writes administrativos exigem sessão admin ou host token scoped.

## Z.3 Games

- `GET /api/v1/games` lista manifestos.
- `GET /api/v1/games/:gameId` devolve manifesto + opções configuráveis.
- `POST /api/v1/parties/:partyId/games` cria GameSession.
- `POST /api/v1/game-sessions/:id/start` inicia após validação.
- `POST /api/v1/game-sessions/:id/pause` pausa apenas jogos que suportem pause.
- `POST /api/v1/game-sessions/:id/resume` retoma.
- `POST /api/v1/game-sessions/:id/abort` termina sem apagar evidência.

## Z.4 Content packs

- `GET /api/v1/content-packs`
- `POST /api/v1/content-packs/import`
- `POST /api/v1/content-packs/validate`
- `DELETE /api/v1/content-packs/:id`
- `GET /api/v1/content-packs/:id/export`

Import deve usar streaming, limite de tamanho e staging directory. O pacote não entra na biblioteca até validação completa.

## Z.5 Media

Uploads usam handshake: `POST /api/v1/uploads` cria slot e retorna uploadId, limite e URL. `PUT /api/v1/uploads/:id/body` recebe bytes com backpressure. `POST /api/v1/uploads/:id/complete` valida hash/tamanho e promove o ficheiro. `DELETE /api/v1/uploads/:id` cancela. Esta abordagem permite progresso, retry e evita criar ficheiros “fantasma” como concluídos.

## Z.6 Respostas de erro

Formato obrigatório:

```json
{
  "error": {
    "code": "ROOM_LOCKED",
    "message": "Esta sala está bloqueada.",
    "requestId": "req_...",
    "retryable": false,
    "details": {}
  }
}
```

`message` é apropriada para UX, mas frontend deve usar `code` para decisões. Stack trace nunca vai para cliente em produção.

## Z.7 Idempotency

Writes suscetíveis a retry aceitam `Idempotency-Key`. O servidor guarda resultado por janela limitada, scoped por session/client. Iniciar jogo, terminar party, completar upload e aplicar alguns comandos host devem ser idempotentes.

---

# 86. APÊNDICE AA — CATÁLOGO DE EVENTOS SOCKET.IO / REALTIME

O protocolo realtime precisa ser documentado e versionado. Todo envelope deve conter `protocolVersion`, `eventId`, `partyId`, `clientId`, `sentAtClientMs` quando aplicável e payload validado.

## AA.1 Handshake

`client:hello` informa build version, locale, stored session token e capabilities. `server:welcome` retorna clientId, protocolVersion, serverTimeMs, reconnect policy e challenge/session state. Se versão incompatível, retornar `UPGRADE_REQUIRED` com instrução local.

## AA.2 Join

`player:join-request` → ACK com `accepted`, `playerId`, `resumeToken`, `partySummary`. O nome é normalizado, profanity policy aplicada conforme settings e duplicidade tratada. O servidor decide avatar default e envia snapshot privado.

`player:resume-request` usa resumeToken rotativo; após sucesso, token anterior pode ter grace curto para corrida de tabs, mas apenas uma sessão ativa é authoritative controller salvo se multi-tab for explicitamente permitido.

## AA.3 Presence

`client:heartbeat`, `server:heartbeat-ack`, `presence:update`. A UI distingue `connected`, `unstable`, `reconnecting`, `offline`, `left`. Não expulsar imediatamente por um único ping perdido. Grace period deve ser maior que jitter normal de hotspot.

## AA.4 State

`state:snapshot` contém estado público e fragmento privado apropriado. `state:patch` pode ser utilizado apenas quando a implementação consegue garantir base version. Cada state possui `revision`. Se o cliente recebe patch para revision inesperada, solicita snapshot completo.

## AA.5 Actions

`game:action` é o evento genérico ou namespace-specific. Payload contém `actionId`, `gameSessionId`, `expectedRevision` opcional, `type`, `data`. ACK retorna `accepted`, `serverRevision` e resultado mínimo. Retry do mesmo actionId não duplica score.

## AA.6 Phase transitions

`game:phase-will-change` pode antecipar preloading; `game:phase-changed` inclui `phase`, `phaseRevision`, `startedAtServerMs`, `deadlineServerMs`, publicView e privateView. O telefone deve reconstruir controller a partir desse evento, não de timers locais anteriores.

## AA.7 Host controls

`host:command` para next, pause, resume, skip, reveal, kick, lock, change-volume e safe emergency actions. Cada comando requer role claim do socket e CSRF-equivalent session protections no handshake.

## AA.8 Emotes e efeitos não críticos

Reações são ephemeral e podem usar entrega best-effort. Têm rate limit severo e nunca alteram score authoritative. Se perdidas, o jogo continua correto.

## AA.9 Jukebox/media

Eventos separados para queue update, vote, playback state, now-playing e transfer progress. O servidor não deve broadcastar caminho absoluto de filesystem.

## AA.10 Error event

`server:error` segue error code catalog e inclui `relatedEventId` quando possível. Nunca usar apenas string aleatória.

---

# 87. APÊNDICE AB — STATE MACHINES FORMAIS

## AB.1 Party state

```text
CREATING -> LOBBY_OPEN -> LOBBY_LOCKED -> IN_GAME -> INTERMISSION
                 ^             |             |          |
                 |             v             v          v
                 +--------- LOBBY_OPEN <-----+------ LOBBY_OPEN
                                     
                                      -> ENDED
```

Transições inválidas devem falhar com código previsível. `ENDED` é terminal salvo fluxo explícito de “clonar party”.

## AB.2 Player state

```text
NEW -> JOINING -> ACTIVE -> RECONNECTING -> ACTIVE
                  |  |          |
                  |  v          v
                  | SPECTATOR   DISCONNECTED_GRACE
                  |                 |
                  v                 v
                KICKED             LEFT
```

Score e identidade pertencem ao playerId, não ao socketId. SocketId pode mudar em cada reconnect.

## AB.3 GameSession state

```text
CREATED -> READY_CHECK -> PRELOAD -> COUNTDOWN -> RUNNING
                                              |      |
                                              |      v
                                              |    PAUSED
                                              |      |
                                              v      v
                                            ROUND_RESULT
                                                |
                                  +-------------+------------+
                                  |                          |
                                  v                          v
                              NEXT_ROUND                   FINISHED
```

Jogos simples podem saltar estados, mas o runtime deve mapear claramente lifecycle.

## AB.4 Upload state

```text
CREATED -> RECEIVING -> RECEIVED -> VALIDATING -> READY
   |           |           |             |
   v           v           v             v
EXPIRED      FAILED      FAILED        QUARANTINED
```

Nunca apresentar upload como disponível enquanto estiver em `VALIDATING`.

## AB.5 Jukebox item state

`QUEUED -> PREPARING -> PLAYING -> PLAYED`, com ramos `SKIPPED`, `FAILED`, `REMOVED`. Votos não alteram item já PLAYING salvo setting de “vote to skip”.

---

# 88. APÊNDICE AC — ALGORITMO DE RECONEXÃO, CONSISTÊNCIA E RECOVERY

Reconexão é um dos pontos que mais diferenciam demo de produto. O sistema deve sobreviver a Wi-Fi instável, screen lock, troca entre 2.4/5 GHz, browser background e refresh.

## AC.1 Identidades distintas

Separar `deviceId`, `clientId`, `playerId`, `socketId` e `resumeToken`. `deviceId` é local e pseudónimo. `clientId` identifica instalação/browser session. `playerId` pertence à party. `socketId` é efémero. `resumeToken` autentica recuperação e deve ser opaco, aleatório e rotacionável.

## AC.2 Fluxo de reconnect

1. Socket cai.
2. UI muda imediatamente para overlay não destrutivo “A reconectar…”.
3. Inputs críticos são congelados ou enfileirados apenas se semantics permitirem.
4. Socket.IO tenta transport recovery.
5. Cliente envia `player:resume-request` com token e última `revision` aplicada.
6. Servidor valida party/player/token.
7. Se possui event gap pequeno e log disponível, pode reenviar eventos; caso contrário manda snapshot.
8. Cliente substitui state local de forma atómica.
9. Timers recalculam a partir do `deadlineServerMs`.
10. UI volta ao controller correto da fase atual.

## AC.3 Exactly-once percebido

A rede não oferece exactly-once mágico. Para ações como “responder”, cada tentativa recebe `actionId` UUID. O servidor guarda IDs aceites por player/game/round. Se o ACK se perder e o cliente repetir, o servidor responde com o mesmo outcome sem duplicar pontos.

## AC.4 Reconnect após deadline

Se a resposta foi enviada antes do deadline segundo receipt no servidor, vale mesmo que ACK chegue depois. Se o cliente esteve offline e volta após deadline sem receipt, não deve conseguir submeter retroativamente. A UX informa “Tempo terminou enquanto esteve sem ligação”.

## AC.5 Host crash

A cada transição de fase, escrever checkpoint serializável do game runtime. Se process crash ocorrer, launcher reinicia server, carrega DB e identifica sessão interrompida. Host vê modal com: Retomar, Encerrar guardando parcial, Descartar apenas sessão atual. Retomar deve reemitir snapshot a todos os players que reconectarem.

## AC.6 Split brain

Não permitir dois processos server controlarem a mesma data directory. Usar lockfile/process lock. Se launcher detectar instância existente saudável, deve abrir dashboard dessa instância em vez de iniciar outra.

## AC.7 Browser background

Android/iOS podem suspender timers. Por isso nenhuma lógica authoritative depende de heartbeat de 1 segundo. Ao voltar ao foreground, `visibilitychange` dispara resync e clock-sync rápido.

---

# 89. APÊNDICE AD — ESPECIFICAÇÃO DE ECRÃS E FLUXOS UI/UX

## AD.1 Host — Home

Objetivo: colocar a festa pronta em poucos segundos. Mostrar CTA primário “Criar festa”, CTA “Retomar”, estado da rede, versão e menu discreto. Se a máquina estiver sem interface LAN utilizável, apresentar diagnóstico em linguagem humana.

## AD.2 Host — Lobby

É o palco principal. Deve mostrar QR grande, URL curta, room code legível a distância, lista de players com status, botão começar, catálogo de jogos e settings rápidos. Não sobrecarregar a TV com configurações avançadas. Um modo “Presenter” esconde IP sensível se o utilizador preferir mostrar apenas QR/código.

## AD.3 Host — Game picker

Cards agrupados por duração, vibe, mínimo/máximo de jogadores, coop/competitive e capabilities. Cada card mostra “bom para 4–8”, tempo estimado e uma descrição de uma frase. Incompatibilidades aparecem antes de selecionar: “Este jogo precisa de pelo menos 4 jogadores ativos”.

## AD.4 Host — In-game

O ecrã comum mostra apenas informação pública. Nunca renderizar resposta secreta ou role de um jogador por erro. Controlos host ficam num overlay acionável por teclado/mouse e podem ser escondidos para TV.

## AD.5 Player — Join

Campos mínimos: room code se não veio no link, nome, avatar. O teclado mobile não deve cobrir CTA. Após sucesso, guardar nome/avatar localmente e token de resume seguro. Não pedir email.

## AD.6 Player — Waiting room

Mostrar identidade, jogadores presentes, ready toggle quando aplicável, regras curtas e feedback de rede. Deve ser divertido sem exigir scroll extenso.

## AD.7 Player — Controller

Cada jogo fornece controller component via SDK. O shell comum mantém top status: nome, score opcional, connection indicator discreto, accessibility menu e botão de regras. Inputs primários ocupam zona ergonómica inferior.

## AD.8 Player — Reconnect overlay

Overlay não apaga conteúdo imediatamente; reduz interação, mostra spinner, estado e retry manual após timeout. Quando volta, um toast “Ligação restaurada” desaparece automaticamente.

## AD.9 Admin — Dashboard

Admin é para quem gere o evento. Mostra party ativa, clients, game session, CPU/RAM do processo, tamanho da biblioteca, storage, logs recentes, network addresses e health checks. Acesso protegido por password/PIN local configurável.

## AD.10 Admin — Clients

Lista playerId, nome, estado, latency estimada, browser, viewport, capabilities, joinedAt e lastSeen. Ações: rename, mute reactions, move team, kick, ban-for-party, reset resume token.

## AD.11 Admin — Content

Importar, validar, ativar/desativar e exportar packs. Mostrar erro por item/linha, não apenas “invalid pack”. Preview deve ser seguro e sanitizado.

## AD.12 Admin — Media

Biblioteca local com thumbnails, filtros, tamanho, duração e origem. A pasta de biblioteca **nunca é apagada automaticamente**. Temp pode ser limpo por política; biblioteca persistente somente por ação explícita de admin.

## AD.13 Admin — Diagnostics

Executa checks: porta, DB, write permissions, free space, mDNS, WebSocket self-test, QR URL, loopback, selected LAN interface, firewall hints e upload temp. Exporta diagnostic bundle sem incluir secrets.

## AD.14 Tela de resultados

Resultados devem ter ritmo teatral: primeiro reveal, depois podium, depois awards e CTA “Jogar outra”. No telefone, mostrar resultado individual e pequenas estatísticas. Evitar demorar tanto que metade da festa pegue no WhatsApp.

---

# 90. APÊNDICE AE — DESIGN SYSTEM E RESPONSIVIDADE

O produto deve parecer um sistema único mesmo com dezenas de jogos. Criar tokens sem hardcode disperso: spacing, radius, typography scale, elevation, motion duration, safe-area offsets e semantic colors. Cores concretas podem seguir identidade RS, mas contraste deve cumprir WCAG AA para texto normal quando aplicável.

## AE.1 Breakpoints funcionais

Não pensar apenas em largura. Existem pelo menos quatro contextos: telefone portrait, telefone landscape, tablet/laptop e big-screen/TV. Player controller deve continuar utilizável a 320 CSS px. Host precisa funcionar em 1366x768 e escalar para 4K sem texto minúsculo.

## AE.2 Safe areas

Usar `env(safe-area-inset-*)` para iPhone e Android com cutouts. Botões críticos não encostam na gesture navigation. Fullscreen é enhancement; layout funciona sem fullscreen.

## AE.3 Teclado virtual

Forms devem lidar com `visualViewport` quando disponível. Não fixar CTA atrás do teclado. Inputs de resposta longa têm contador e autosize limitado.

## AE.4 Motion

Animações reforçam feedback, não escondem latency. Respeitar `prefers-reduced-motion`. Reveals podem usar 250–600 ms; transições repetitivas de controller devem ser curtas. Nunca bloquear input por animação longa sem necessidade.

## AE.5 Áudio

Como autoplay é restrito, desbloquear AudioContext após gesto inicial no host. Ter master volume, music, SFX e mute. Áudio não pode ser requisito para compreender uma fase; fornecer visual equivalent.

## AE.6 Haptics

`navigator.vibrate` é opcional. Usar padrões curtos para buzzer, correct, warning. Se indisponível, ignorar silenciosamente sem quebrar fluxo.

---

# 91. APÊNDICE AF — CONTROLLER CAPABILITIES E FEATURE NEGOTIATION

No `client:hello`, o player reporta capabilities detectadas sem fingerprinting invasivo. Exemplo:

```json
{
  "touch": true,
  "pointerFine": false,
  "camera": "permission-needed",
  "microphone": "permission-needed",
  "deviceMotion": "permission-needed",
  "vibration": true,
  "webAudio": true,
  "webRTC": true,
  "secureContext": false,
  "wakeLock": false,
  "viewport": {"w": 412, "h": 915},
  "orientation": "portrait"
}
```

Jogos não devem solicitar permissão ao entrar no lobby. Pedir apenas quando a feature é escolhida e explicar por quê. Se `secureContext=false`, recursos que exigem HTTPS aparecem com fallback ou são ocultados do Party Mix automático.

## AF.1 Capability policy

- `required`: sem ela não iniciar esse jogo para aquele participante.
- `optional`: melhora experiência, fallback existe.
- `hostOnly`: necessária apenas no host.
- `majority`: jogo pode iniciar se percentagem configurada suporta; restantes recebem fallback.

## AF.2 Camera

A câmara deve ser acionada pelo player, nunca silenciosamente. Preferir captura única em vez de stream quando o jogo só precisa de foto. Remover EXIF quando não necessário.

## AF.3 Microfone

Se usado para sound game, mostrar medidor local e duração máxima. Não gravar continuamente. Upload de áudio deve ter limite e expiração.

## AF.4 Motion

Para jogos de inclinação, calibrar posição neutra e oferecer touch joystick. iOS pode exigir permissão após click. O Party Mix nunca deve selecionar automaticamente um jogo motion-only se clientes incompatíveis estiverem ativos.

---

# 92. APÊNDICE AG — SDK DE JOGOS E CONTRATO DE PLUGIN

Cada jogo oficial deve ser implementado como plugin isolado, evitando `switch(gameId)` gigantes no servidor e frontend.

```ts
interface GamePlugin<State, Config, Action, PrivateView> {
  manifest: GameManifest;
  configSchema: Schema<Config>;
  create(ctx: CreateGameContext, config: Config): State;
  reduce(ctx: ReduceContext, state: State, action: Action): ReduceResult<State>;
  onDeadline?(ctx: DeadlineContext, state: State, deadlineId: string): ReduceResult<State>;
  publicView(state: State, viewer: PublicViewer): unknown;
  privateView(state: State, playerId: PlayerId): PrivateView;
  serialize(state: State): JsonValue;
  hydrate(data: JsonValue): State;
  summarize(state: State): GameSummary;
}
```

## AG.1 Determinismo

Random usa PRNG seeded pelo runtime. Não usar `Math.random()` diretamente. Isso permite replay/debug e garante que restart a partir de checkpoint não mude pergunta/ordem.

## AG.2 Segurança de private view

Servidor gera view específica. Nunca mandar full state com roles/respostas e “esconder por CSS”. Teste automatizado procura forbidden fields em payload de cada role.

## AG.3 Score API

Jogo produz score deltas, mas Party Score Service aplica regras globais e auditáveis. Isso permite Party Mix equilibrar jogos de escalas diferentes.

## AG.4 Hooks

Plugins podem declarar hooks de preload, media need, team assignment e content pack query. Hooks não recebem filesystem arbitrário.

## AG.5 Versioning

Checkpoint inclui `gameVersion`. Hydrate de versão diferente deve usar migration do plugin ou recusar resume com mensagem segura. Nunca interpretar state antigo silenciosamente.

---

# 93. APÊNDICE AH — PARTY MIX ENGINE, BALANCEAMENTO E RITMO

Party Mix é um orquestrador de sessão, não simplesmente random de jogos. Deve evitar repetir a mesma categoria e considerar número de players, capabilities, tempo restante e intensidade social.

## AH.1 Categorias

`trivia`, `creative`, `social`, `reaction`, `memory`, `deduction`, `team`, `music`, `photo`, `word`, `coop`.

## AH.2 Seleção

Score de candidato combina compatibilidade, novelty, cooldown, duração alvo, preferência host e diversidade. Jogos jogados recentemente recebem penalidade. Um seed da party permite explicar/reproduzir seleção se necessário.

## AH.3 Pacing

Uma sessão típica de 45 minutos pode alternar: warm-up rápido → criatividade → reação → social/deduction → coop → finale. Evitar três jogos que exigem texto longo seguidos.

## AH.4 Rubber banding

Party Mix não deve manipular resultado escondido, mas pode oferecer power-ups a jogadores atrasados em jogos que suportem catch-up explicitamente. Transparência é essencial.

## AH.5 Intermissions

Entre jogos, 20–45 segundos opcionais com scoreboard, foto wall, jukebox vote e possibilidade de late join. Host pode saltar.

---

# 94. APÊNDICE AI — DOSSIERS DE IMPLEMENTAÇÃO DOS MINIJOGOS

## AI.1 Quiz Rush — dossier avançado (`quiz-rush`)

**Categoria:** trivia. **Jogadores:** 2–30. **Premissa:** Escolher a opção correta sob pressão de tempo; respostas certas e rápidas valem mais.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `question -> answer_open -> lock -> reveal -> leaderboard`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

A/B/C/D grandes, confirmação imediata e possibilidade de alterar até lock quando setting permitir. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

pergunta, opções e cronómetro; no reveal mostra distribuição e resposta correta. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Não aceitar resposta após deadline; impedir double-score; manter justiça com RTT usando receipt no servidor. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Perguntas repetidas, empate, cliente reconectando no reveal, opção anulada por pack inválido. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.2 Majority Vote — dossier avançado (`majority-vote`)

**Categoria:** social. **Jogadores:** 3–30. **Premissa:** Responder/votar e ganhar por estar com a maioria ou por prever a opinião do grupo.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> vote -> lock -> reveal -> scoring`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Cards grandes e opção secreta; nunca mostrar contagem antes do lock. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Prompt e depois animação de percentagens. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Voto secreto no server; player não pode consultar agregados em endpoint lateral. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Empate exato, abstention, jogador entra tarde, voto duplicado. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.3 Live Bingo — dossier avançado (`live-bingo`)

**Categoria:** social. **Jogadores:** 2–50. **Premissa:** Cada telefone recebe cartela; eventos/itens são chamados e jogador marca até completar padrão.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `deal -> call_loop -> claim -> verify -> finish`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Cartela touch com estado marcado e botão BINGO protegido contra toque acidental. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Item chamado, histórico curto e claims. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Servidor valida cartela e chamadas; nunca confiar nos marks do cliente como prova. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Dois bingos simultâneos, reconnect preservando cartela, padrão customizado. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.4 Truth or Challenge — dossier avançado (`truth-or-challenge`)

**Categoria:** social. **Jogadores:** 2–30. **Premissa:** Escolhas leves de verdade/desafio com filtros de conteúdo e skip seguro.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `select_player -> choose_type -> prompt -> complete/skip -> next`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Escolha privada e botões Done/Skip; conteúdo family/adult controlado pelo host. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Mostra jogador da vez e prompt apenas quando apropriado. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Nunca ativar conteúdo adulto por default; custom packs passam validação/moderação. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Player sai quando selecionado, prompt impossível, skip limit configurável. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.5 Bluff Battle — dossier avançado (`bluff-battle`)

**Categoria:** creative. **Jogadores:** 3–20. **Premissa:** Cada pessoa cria resposta falsa; depois todos tentam achar a verdadeira.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> submit_bluff -> compose_options -> vote -> reveal -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Textarea curto; depois cards de votação sem identificar autor. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Prompt, progresso de submissão, opções anónimas e reveal autor/real. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Normalizar duplicados; impedir bluff igual ao correto; não vazar resposta no payload. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Bluffs idênticos, profanity filter, jogador sem resposta, empate de votos. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.6 Draw & Guess — dossier avançado (`draw-guess`)

**Categoria:** creative. **Jogadores:** 3–20. **Premissa:** Um jogador desenha e os restantes adivinham; pontos por rapidez e qualidade.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `assign_word -> draw -> guesses -> solved/timeout -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Canvas touch responsivo com undo limitado, brush, clear confirmado e guess input para não-artista. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Canvas live com throttling e guesses filtrados/mascarados. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Não enviar palavra secreta aos guessers; strokes rate-limited e compactados. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Rotação do telefone, reconnect do artista, canvas grande, guess equivalente com acentos. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.7 Caption Clash — dossier avançado (`caption-clash`)

**Categoria:** creative. **Jogadores:** 3–30. **Premissa:** Criar legendas para imagem/prompt e votar nas mais engraçadas.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> captions -> bracket/vote -> reveal -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Campo de texto e depois votação pairwise ou all-cards. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Imagem/prompt, progresso e bracket teatral. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Media sanitizada; não expor autoria antes do reveal. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Legenda vazia, duplicada, empate, imagem indisponível. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.8 Buzzer Arena — dossier avançado (`buzzer-arena`)

**Categoria:** reaction. **Jogadores:** 2–50. **Premissa:** Primeiro a tocar ganha direito de responder ou pontua conforme modo.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `armed -> buzz -> winner_locked -> resolve -> reset`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Um botão enorme com haptic; estado ARMED/LOCKED inequívoco. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Pergunta/evento e ordem de buzz com milissegundos do servidor. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Servidor usa tempo de receipt; não timestamps fornecidos pelo cliente. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Buzz simultâneo, latência assimétrica, reconnect, toque antes de armed. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.9 Word Chain — dossier avançado (`word-chain`)

**Categoria:** word. **Jogadores:** 2–30. **Premissa:** Cada palavra deve continuar cadeia segundo regra; falha ou timeout elimina/pune.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `turn -> submit -> validate -> next`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Input focado, timer, regra visível e histórico curto. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Jogador atual, cadeia e timer. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Validação server-side e normalização Unicode/acentos configurável. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Palavra repetida, plural, acento, dicionário ausente, timeout. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.10 Categories Rush — dossier avançado (`categories-rush`)

**Categoria:** word. **Jogadores:** 2–30. **Premissa:** Escrever itens válidos de uma categoria rapidamente, evitando duplicados.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `category -> rapid_submit -> lock -> validate -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Input de submit rápido com chips das próprias respostas. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Categoria, tempo e contagem sem revelar respostas antes do fim. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Dedup normalizado; validação manual host opcional para casos ambíguos. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Sinónimos, typo, resposta ofensiva, dezenas de submits por segundo. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.11 Charades — dossier avançado (`charades`)

**Categoria:** social. **Jogadores:** 2–30. **Premissa:** Um jogador recebe palavra secreta e representa; equipa tenta adivinhar.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `select_actor -> secret -> play -> guessed/skip -> next`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Actor vê palavra grande; teammates podem ter buzzer/guessed control conforme modo. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Timer, equipa e score sem palavra quando audiência não deve vê-la. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Private view estrita e opção host de confirmação. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Actor disconnect, skip, empate, teams desiguais. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.12 Spy Room — dossier avançado (`spy-room`)

**Categoria:** deduction. **Jogadores:** 4–20. **Premissa:** Todos recebem local/tema excepto spy; perguntas e votação tentam identificar o infiltrado.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `deal_roles -> discussion_rounds -> accusations -> vote -> spy_guess -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Role card privada, lista de players e votação secreta. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Timer de discussão e apenas informação pública. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Nunca enviar location ao spy; logs redigem secrets. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Dois spies setting, empate de voto, player abandona, reconnect de role. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.13 Secret Mission — dossier avançado (`secret-mission`)

**Categoria:** social. **Jogadores:** 3–30. **Premissa:** Cada jogador recebe uma missão discreta para cumprir durante a festa.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `assign -> active_background -> claim -> verify/vote -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Missão privada persistente e botão claim. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Indicadores gerais e reveals ocasionais. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Missões devem ser seguras e respeitar content mode. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Missão impossível, player sai, claim falso, múltiplas claims. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.14 Hot Potato — dossier avançado (`hot-potato`)

**Categoria:** reaction. **Jogadores:** 2–30. **Premissa:** Objeto virtual passa entre jogadores; timer oculto explode aleatoriamente.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `start -> holder -> pass -> holder ... -> explode -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Botão/pass target simples, feedback forte e vibração opcional. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Animação de posse e suspense. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Explode é decidido server-side com seed; cliente não conhece deadline exato. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Holder disconnect, pass duplicado, last-second race. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.15 Reaction Tap — dossier avançado (`reaction-tap`)

**Categoria:** reaction. **Jogadores:** 2–50. **Premissa:** Tocar apenas quando estímulo correto aparecer; falsos starts penalizam.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `ready -> random_delay -> target -> tap_window -> result`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Full-screen tap area; não usar elemento pequeno. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Countdown psicológico e ranking. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Random delay no server; receipt time; prevenir scripts com rate limit básico. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Tap antes do target, background tab, empate dentro de 1 ms. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.16 Memory Grid — dossier avançado (`memory-grid`)

**Categoria:** memory. **Jogadores:** 1–30. **Premissa:** Memorizar sequência/grade e reproduzir no telefone.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `show -> hide -> input -> validate -> next_level`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Grid touch sem scroll e feedback por célula. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Mostra sequência comum ou individual conforme modo. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Sequência gerada seeded; input validado por ordem. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Orientação muda, viewport pequeno, nível muito grande. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.17 Emoji Decode — dossier avançado (`emoji-decode`)

**Categoria:** trivia. **Jogadores:** 2–30. **Premissa:** Decifrar filme/frase/local representado por emojis.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> answers -> lock -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Texto curto ou múltipla escolha conforme pack. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Emoji grande, hints graduais e reveal. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Unicode consistente; fonts locais/fallback. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Emoji não suportado, respostas equivalentes, hint timing. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.18 Survey Says — dossier avançado (`survey-says`)

**Categoria:** trivia. **Jogadores:** 2–30. **Premissa:** Estilo survey: adivinhar respostas mais populares e valores.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> team_turn -> answer -> reveal_hit/miss -> steal -> result`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Input/buzzer conforme equipas. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Board de respostas ocultas que são reveladas progressivamente. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Dataset inclui rankings/pontos; fuzzy matching configurado. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Sinónimo, steal, três strikes, empate. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.19 Guess the Song — dossier avançado (`guess-the-song`)

**Categoria:** music. **Jogadores:** 2–30. **Premissa:** Ouvir clip local e identificar música/artista.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `preload -> clip -> answers -> lock -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Buzzer ou options; volume control local limitado. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Player de áudio host com waveform/progress opcional. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Somente media local autorizado; preloading e fallback se codec incompatível. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Autoplay bloqueado, clip falha, latency audio, sem som no host. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.20 Photo Roulette Local — dossier avançado (`photo-roulette`)

**Categoria:** photo. **Jogadores:** 3–20. **Premissa:** Jogadores submetem fotos locais; jogo escolhe e desafia grupo a adivinhar autor/contexto.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `collect -> validate -> select -> reveal_photo -> vote -> owner_reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Photo picker explícito com preview e consentimento. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Foto sanitizada/cropped e opções de voto. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Remover EXIF, limites, conteúdo local, delete/expiry claros. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Imagem gigante, HEIC incompatível, player retira consentimento, duplicate hash. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.21 Pixel Reveal — dossier avançado (`pixel-reveal`)

**Categoria:** trivia. **Jogadores:** 2–30. **Premissa:** Imagem é revelada progressivamente; jogadores buzzam/adivinham cedo para mais pontos.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `preload -> reveal_steps -> guesses -> solved -> result`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Buzzer + answer; power-ups opcionais. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Canvas/filters revelando pixels por etapas. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Image processing local; etapas deterministicamente sincronizadas. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Asset pequeno, aspect ratio extremo, dois correct simultâneos. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.22 Number Line — dossier avançado (`number-line`)

**Categoria:** trivia. **Jogadores:** 2–30. **Premissa:** Responder estimativa numérica usando slider; mais perto vence.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `question -> estimate -> lock -> reveal_positions -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Slider grande com input numérico opcional e unidades. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Linha mostra marcadores anónimos no reveal e depois nomes. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Ranges e units validados; scoring por erro relativo/absoluto conforme pergunta. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Resposta fora do range, exact tie, escala log opcional. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.23 Team Relay — dossier avançado (`team-relay`)

**Categoria:** team. **Jogadores:** 4–30. **Premissa:** Equipas completam microtarefas em sequência; próximo só desbloqueia após anterior.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `assign_teams -> leg1 -> leg2 ... -> finish`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Controller muda por perna e mostra handoff claro. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Progresso das equipas sem revelar segredo do próximo membro. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Servidor controla ordem e unlock; disconnect permite substitute. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Equipa desigual, player abandona, duas legs completam juntas. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.24 Forbidden Word — dossier avançado (`forbidden-word`)

**Categoria:** social. **Jogadores:** 3–30. **Premissa:** Fazer equipa adivinhar termo sem usar palavras proibidas.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `secret -> describe -> team_guess -> penalty/score -> rotate`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Describer vê termo e forbidden list privada; judge controls opcional. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Timer e equipa; não mostrar secrets. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Private view e penalização confirmável. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Palavra proibida flexionada, judge disconnect, skip. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.25 Who Am I — dossier avançado (`who-am-i`)

**Categoria:** social. **Jogadores:** 3–30. **Premissa:** Cada jogador recebe identidade secreta que os outros conhecem; perguntas sim/não até descobrir.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `deal -> turns -> questions -> answers -> guess -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Player vê todos excepto a própria identidade; guess action explícita. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Pode mostrar ordem e progresso, não secret do jogador que olha para TV se setting privado. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Evitar vazar self identity no próprio payload. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Player entra tarde, nome duplicado, guess typo. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.26 This or That — dossier avançado (`this-or-that`)

**Categoria:** social. **Jogadores:** 2–50. **Premissa:** Escolher entre duas opções e descobrir divisão do grupo.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> choice -> lock -> reveal -> optional_debate`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Dois botões grandes e resposta privada. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Percentagem animada e grupos. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Não broadcast choice individual antes do lock. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: 100/0, empate, abstention. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.27 Story Chain — dossier avançado (`story-chain`)

**Categoria:** creative. **Jogadores:** 3–30. **Premissa:** Cada jogador adiciona trecho; texto final é revelado de forma divertida.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `seed -> private_turns -> append -> next -> reveal`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Textarea com limite e contexto definido pelo modo. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Progresso sem mostrar segmentos secretos até reveal. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Sanitização, limites, ordem server-side. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Player não responde, texto longo, profanity policy. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.28 Party Auction — dossier avançado (`party-auction`)

**Categoria:** strategy. **Jogadores:** 3–20. **Premissa:** Jogadores recebem moeda virtual e licitam itens/benefícios/pontos.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `deal_budget -> item -> bidding -> settle -> next -> final`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Bid controls claros e saldo sempre visível. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Item, current bid conforme modo e countdown. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Atomic settlement; prevenir saldo negativo e double-spend. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Bid simultâneo, disconnect do líder, tie em sealed bid. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.29 Prediction Round — dossier avançado (`prediction-market`)

**Categoria:** social. **Jogadores:** 3–30. **Premissa:** Prever resultado de perguntas/eventos da própria festa e pontuar por acerto/confiança.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `prompt -> prediction -> confidence -> resolve -> score`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Choice + confidence slider. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Pergunta e, depois, distribuição/reveal. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Resultado resolvido por regra objetiva ou host confirmation auditável. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Outcome cancelado, empate, player abstém. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.30 Co-op Escape — dossier avançado (`coop-escape`)

**Categoria:** coop. **Jogadores:** 2–12. **Premissa:** Grupo resolve puzzles em que cada telefone pode ter pistas diferentes.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `brief -> puzzle_nodes -> unlocks -> final_code -> success/fail`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Cada player recebe pistas/controles privados diferentes. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Ambiente comum, progresso e timer. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Não enviar todas as pistas a todos; puzzle graph validado para ser solucionável. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Player disconnect com pista única, hint system, puzzle deadlock. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.31 Tap Race — dossier avançado (`tap-race`)

**Categoria:** reaction. **Jogadores:** 2–30. **Premissa:** Competição de tapping/ritmo curto com proteção contra excesso e acessibilidade.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `ready -> race -> finish -> results`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Área grande; contador local optimistic mas score authoritative. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Barras de progresso e finish order. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Rate sanity checks sem punir dispositivos lentos; accessibility alternate hold mode. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Multi-touch, automation, browser throttling. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.

## AI.32 Soundboard Chaos — dossier avançado (`soundboard-chaos`)

**Categoria:** social. **Jogadores:** 2–30. **Premissa:** Jogadores recebem pads de sons locais para criar caos controlado, desafios de ritmo ou voto.

### Objetivo de experiência

Este modo deve começar rapidamente, explicar-se em poucos segundos e oferecer feedback inequívoco a cada ação. O jogador não deve precisar olhar simultaneamente para o telefone e para a TV para entender se a ação foi registada. O host precisa conseguir explicar o jogo em uma frase, iniciar uma ronda de teste quando apropriado e saltar uma ronda quebrada sem reiniciar a party. A duração deve ser configurável por rounds/tempo, mas presets “Rápido”, “Normal” e “Longo” devem evitar settings excessivos.

### State machine específica

Fluxo base: `load_bank -> freeplay/challenge -> cooldown -> result`. Cada transição deve ser accionada pelo servidor, possuir `phaseRevision`, `startedAtServerMs` e, quando temporal, `deadlineServerMs`. Ao reconectar, o jogador recebe a fase corrente e não repete uma ação já confirmada. O runtime deve garantir que resultados são calculados uma única vez mesmo se `onDeadline` e uma última ação chegarem quase simultaneamente.

### Player controller

Grid de pads com labels/icons, cooldown visível. O shell deve manter connection state discreto, safe areas, resposta haptic opcional e accessibility labels. Inputs desabilitados precisam explicar por que estão bloqueados. Em portrait, nenhuma ação primária deve depender de hover. Em landscape, o layout deve reaproveitar espaço sem exigir rotação.

### Host/public display

Mixer/visualizer e regras da ronda. O ecrã comum nunca deve conter dados privados que seriam visíveis por inspeção do DOM. A composição deve ser legível a vários metros: texto grande, contraste, timer claro e animação curta de reveal. Sempre incluir fallback textual para áudio/efeitos.

### Integridade, segurança e fairness

Rate limit, master limiter e assets locais; nunca permitir volume destrutivo. Toda ação usa `actionId` idempotente. Payloads passam schema runtime. Score é calculado server-side e nunca aceito como número enviado pelo browser. Se houver randomização, usar PRNG seeded. Se houver conteúdo customizado, validar e sanitizar antes da ronda.

### Edge cases obrigatórios

Cobrir pelo menos: Dois sons sobrepostos, codec, player spamming, mute accessibility. Além disso, testar refresh durante cada fase mutável, host pause quando aplicável, player kick, party lock, mudança de network interface do host e late join conforme política do jogo.

### Telemetria local útil

Guardar apenas métricas locais de operação: duração de ronda, actions accepted/rejected por código, reconnect count, jogadores ativos e motivo de abort. Não armazenar conteúdo privado além do necessário para resultados. Estas métricas alimentam `IMPLEMENTATION_REPORT.md` e diagnóstico, não analytics cloud.

### Definition of Done específica

1. Unit tests para reducer/state machine, scoring e deadlines.
2. Integration test com pelo menos três sockets e action retry.
3. E2E em viewport Android pequeno e host 1366x768.
4. Teste de reconnect numa fase crítica sem score duplicado.
5. Teste de private payload garantindo ausência de secrets alheios.
6. Teste de conteúdo inválido quando o jogo usa pack/media.
7. Screenshot/artefact de E2E ou trace em CI para falhas.
8. Regras e texto PT/EN presentes.


---

# 95. APÊNDICE AJ — MEDIA PIPELINE, PARTY DROP, PHOTO WALL E JUKEBOX

## AJ.1 Princípio

Media é parte integrada do Party Hub, não um file manager genérico. O fluxo precisa ser rápido, visual e seguro. Party Drop permite partilha temporária de ficheiros/fotos entre participantes e host. Photo Wall transforma uploads consentidos em mural. Jukebox usa biblioteca local do host e fila democrática.

## AJ.2 Upload progress real

Frontend mede bytes enviados quando API/transport permite e mostra percentagem, velocidade aproximada e estado. “100%” só aparece após servidor confirmar `READY`; conclusão de socket/browser não é suficiente. Se validação demorar, mostrar “A verificar ficheiro…”.

## AJ.3 Persistência

`data/uploads/temp` é transitório e pode ser limpo por TTL. `data/uploads/library` ou equivalente é persistente e **nunca deve ser apagado automaticamente**. Se pasta não existir, criar. Se já existir, preservar conteúdo desconhecido. Operações de limpeza precisam de preview e confirmação.

## AJ.4 Photo Wall

Cada foto passa thumbnail pipeline local. O host pode aprovar automaticamente em party privada ou exigir moderation queue. Exibir apenas versões derivadas adequadas, mantendo original conforme política. Deve existir “remover minha foto” enquanto party estiver ativa, quando tecnicamente possível.

## AJ.5 Jukebox

Fila mantém itemId, mediaId, proposer, votes, createdAt e state. Votos podem reordenar apenas itens QUEUED. Host possui veto/skip. Normalizar loudness se biblioteca tiver metadata, mas não exigir FFmpeg para MVP; se FFmpeg ausente, player ainda funciona com formatos browser-native.

## AJ.6 Codecs

Detectar suporte do browser/host. Não prometer HEVC/FLAC/etc universalmente. O admin mostra “compatível”, “talvez incompatível” e pode oferecer transcode opcional quando FFmpeg instalado.

## AJ.7 WebRTC

Party Drop pode, futuramente, usar RTCDataChannel peer-to-peer, mas baseline é HTTP streaming local por simplicidade e confiabilidade. Não tornar STUN/TURN cloud necessário no modo LAN.

---

# 96. APÊNDICE AK — SEGURANÇA: THREAT MODEL PROFISSIONAL

O ambiente é uma LAN de festa: participantes são conhecidos socialmente, mas qualquer telefone conectado pode ser malicioso ou simplesmente enviar dados inválidos. Não assumir confiança plena.

## AK.1 Assets protegidos

- integridade do jogo e scores;
- roles/respostas secretas;
- password/PIN admin;
- filesystem do host;
- media privados;
- disponibilidade do servidor;
- identidade local dos participantes;
- histórico da party.

## AK.2 Ameaças

### Cliente falsifica score
Mitigação: score apenas server-side; client envia intenção/ação.

### Cliente lê role de outro
Mitigação: private views geradas no servidor; testes de leakage; endpoints scoped.

### Replay de ação
Mitigação: actionId idempotente, phaseRevision e roundId.

### Flood WebSocket
Mitigação: rate limits por event category, payload limits, disconnect progressivo e backpressure.

### Upload path traversal
Mitigação: ignorar path do cliente, gerar storedName, `path.resolve` containment checks, staging directory.

### HTML/script em custom pack
Mitigação: texto tratado como texto; markdown estritamente sanitizado se habilitado; CSP.

### ZIP bomb
Mitigação: limites de compressed/uncompressed bytes, item count, nesting e streaming extraction segura.

### MIME spoof
Mitigação: magic bytes/sniffing server-side e extension allowlist por purpose.

### Admin brute force
Mitigação: local rate limit, progressive delay, lockout temporário sem DoS permanente, password hashing.

### Session fixation
Mitigação: tokens gerados server-side, rotate on privilege changes, SameSite cookie quando cookie usado.

### CSWSH / WebSocket origin abuse
Mitigação: validar `Origin` para browsers, session token, same-origin deployment, não confiar apenas em CORS.

### LAN rebinding
Mitigação: host validation, origin checks, não expor endpoints administrativos sem auth, considerar Local Network Access changes dos browsers.

### DoS de media
Mitigação: quotas globais/per-party/per-player, concurrent upload cap, free-space guard.

## AK.3 Privacy

Não enviar analytics externo por default. Não incluir third-party fonts/CDNs. Logs redigem tokens, passwords e game secrets. Export de diagnostics deve mostrar antes o que contém.

## AK.4 Headers

Configurar CSP compatível com app, `X-Content-Type-Options: nosniff`, frame policy adequada, Referrer-Policy e permissões restritivas. Em HTTP LAN, HSTS não é apropriado universalmente; HTTPS pode ser modo avançado.

---

# 97. APÊNDICE AL — MATRIZ DE TESTES POR DISPOSITIVO, BROWSER E REDE

## AL.1 Browsers alvo

Baseline: Chrome/Chromium Android recente, Safari iOS recente, Chrome/Edge desktop e Firefox desktop. Não assumir APIs exclusivas de Chromium para gameplay core.

## AL.2 Viewports mínimos

- 320×568 portrait;
- 360×800;
- 390×844;
- 412×915;
- 768×1024 tablet;
- 1366×768 host;
- 1920×1080 host;
- 3840×2160 smoke visual.

## AL.3 Cenários de rede

1. Router doméstico com Internet.
2. Router doméstico sem WAN.
3. Hotspot Android.
4. Hotspot Windows, quando suportado.
5. AP com client isolation ligado — diagnóstico deve detectar sintoma e explicar.
6. 2.4 GHz congestionado.
7. Player troca Wi-Fi por dados e volta.
8. Host muda IP após DHCP renew — UI deve detectar/republicar endereço; conexões existentes podem cair e recover se possível.
9. 20–30 sockets simultâneos com ações burst.
10. Packet loss/jitter simulado em testes de chaos.

## AL.4 Teste offline real

Preparar instalação e packs. Desligar WAN fisicamente ou bloquear saída. Limpar DNS cache não deve afetar URL IP. Abrir player num telefone novo conectado ao hotspot e jogar pelo menos Quiz Rush, Draw & Guess, Buzzer Arena e um jogo com media local. Nenhuma requisição externa pode aparecer no log/devtools.

## AL.5 Background/lock

Em Android/iOS, bloquear ecrã 15–30s durante lobby e durante uma ronda, desbloquear e verificar recovery. Não exigir que browser tenha continuado timer em background.

## AL.6 Rotação

Rodar durante canvas, slider e buzzer. State permanece; desenho não perde coordenadas por escala.

---

# 98. APÊNDICE AM — PERFORMANCE BUDGETS E LOW-MEMORY ENGINEERING

RS Party Hub deve funcionar confortavelmente em PC comum de 8 GB RAM. O servidor não deve assumir GPU dedicada.

## AM.1 Budgets alvo

- idle server + DB + sockets: preferencialmente < 250 MB RSS em build produção;
- host web tab normal: preferencialmente < 300 MB em jogos 2D;
- player tab: preferencialmente < 150 MB, ideal muito menos;
- startup até lobby utilizável: < 5s em SSD comum após primeira instalação;
- join após carregar página: feedback < 1s na LAN saudável;
- action ACK p50 LAN saudável: < 100 ms, p95 < 250 ms como meta de produto, sem prometer física impossível;
- bundle inicial player gzip/brotli controlado; lazy-load jogos/media editor.

## AM.2 Não carregar tudo

Player shell não importa admin editor. Host não carrega codecs/transcode front-end até necessário. Cada controller de jogo deve ser code-split se catálogo crescer.

## AM.3 Canvas

Draw game transmite strokes em batches/throttle, não screenshot PNG a cada movimento. Host reconstrói vector strokes e faz snapshot ocasional para recovery.

## AM.4 Socket payload

Evitar broadcast de state completo em cada toque. Usar eventos compactos + revision e snapshots periódicos. Medir tamanho p50/p95 dos eventos durante load tests.

## AM.5 Media

Usar streams; não ler ficheiro inteiro na RAM para download/upload. Thumbnails têm dimensões máximas. Temp cleanup respeita active handles.

## AM.6 SQLite

WAL mode pode melhorar concorrência. Writes de gameplay devem ser agrupados em transições, não por frame. Busy timeout configurado e repository serializa operações críticas.

---

# 99. APÊNDICE AN — OBSERVABILIDADE, LOGS E `rs-party doctor`

## AN.1 Logs estruturados

Cada log inclui timestamp, level, component, requestId/eventId quando aplicável, partyId truncado/seguro, gameSessionId e errorCode. Não logar tokens nem passwords. Em desenvolvimento, pretty print; produção, JSON lines opcional.

## AN.2 Métricas locais

Expor `/api/v1/admin/metrics` autenticado e/ou painel: connected players, reconnects, event rate, ACK latency, rejected events, memory RSS, event loop lag, DB latency, storage free, active uploads, WebSocket transport counts.

## AN.3 Doctor checks

`rs-party doctor` deve testar:

1. versão Node/runtime;
2. write/read no data dir;
3. SQLite open/migration integrity;
4. porta configurada;
5. loopback HTTP;
6. WebSocket self-connect;
7. game registry;
8. content pack builtin;
9. free storage;
10. LAN interfaces;
11. chosen advertise address;
12. mDNS publish opcional;
13. firewall guidance por OS;
14. temp cleanup permission;
15. optional FFmpeg;
16. clock monotonic sanity.

Saída termina com `PASS`, `WARN` ou `FAIL`, com ações concretas. `WARN` não deve impedir iniciar se core funciona.

---

# 100. APÊNDICE AO — PACKAGING, WINDOWS, LINUX, DOCKER E PORTABLE MODE

## AO.1 Windows

Oferecer launcher ou scripts PowerShell/batch que descubram IP, iniciem server e abram host. Se Windows Firewall bloquear inbound, detectar timeout/sintoma e instruir regra para rede privada; não executar alterações privilegiadas escondidas.

## AO.2 Linux

Systemd é opcional; fornecer execução foreground e service example. mDNS via Avahi quando disponível, mas IP permanece fallback.

## AO.3 Docker

Imagem deve usar volume para `/data`, expor porta configurável e não perder biblioteca ao recriar container. Documentar `--network host` versus port mapping e limitações de mDNS conforme plataforma.

## AO.4 Portable

Modo portable guarda data relativo ao diretório designado, útil em USB/PC temporário. Deve impedir duas instâncias na mesma pasta.

## AO.5 Atualização

Upgrade nunca apaga `data/`. Antes de migration significativa, backup. Changelog informa breaking changes de packs/protocol.

---

# 101. APÊNDICE AP — FUTURO HOST ANDROID SEM QUEBRAR A ARQUITETURA

O produto inicial pode priorizar PC, mas abstrações devem permitir Android host posterior. O Android pode executar servidor embutido em foreground service e, quando permissões/plataforma permitirem, criar Local Only Hotspot. Porém Android impõe lifecycle, Doze e restrições diferentes; não prometer background eterno sem foreground notification.

## AP.1 Separação necessária

Game runtime, contracts, persistence repositories e content validation não podem depender diretamente de APIs Node desktop sem adapters. Filesystem, network discovery e launcher são interfaces de plataforma.

## AP.2 WebView não é obrigatório para players

O host Android pode mostrar admin/host em WebView local, mas players continuam browser normal na LAN.

## AP.3 Recursos

Evitar necessidade de Docker, Redis, Postgres, GPU e serviços cloud. SQLite + processo único favorece Android futuro.

---

# 102. APÊNDICE AQ — LOCALIZAÇÃO PT/EN E ACESSIBILIDADE

## AQ.1 i18n

Nenhum texto de UI importante hardcoded dentro de componente de jogo. Usar keys namespaced. Conteúdo de packs pode declarar locale. Fallback `pt -> en` apenas quando string faltar e logging de missing key em dev.

## AQ.2 Português

Português usado no produto deve ser natural e consistente para contexto moçambicano/internacional, evitando tradução literal de termos técnicos quando não necessário. Pode permitir variante textual no futuro, mas não duplicar infraestrutura já.

## AQ.3 Screen readers

Controllers com botões possuem labels claros. Canvas de desenho é exceção visual, mas controlos têm nomes. Score changes podem usar live regions sem anunciar spam.

## AQ.4 Daltonismo

Não depender só de cor para team/answer. Combinar ícones, letras, padrões e texto.

## AQ.5 Reduced motion

Reveals continuam compreensíveis sem animações. Tap/reaction games não devem exigir percepção de flash extremamente curta sem opção alternativa quando accessibility mode ativo.

## AQ.6 Motor accessibility

Targets touch >= ~44 CSS px quando possível. Tap Race oferece modo alternativo “hold/release” ou ritmo menos intenso configurável.

---

