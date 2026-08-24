## VW-0078 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0079 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0080 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0081 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0082 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0083 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0084 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0085 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0086 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0087 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0088 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0089 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0090 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0091 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0092 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0093 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0094 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0095 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0096 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0097 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0098 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0099 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0100 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0101 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0102 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0103 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0104 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0105 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0106 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0107 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0108 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0109 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0110 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0111 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0112 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0113 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0114 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0115 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0116 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0117 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0118 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0119 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0120 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0121 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0122 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0123 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0124 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0125 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0126 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0127 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0128 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0129 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0130 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0131 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0132 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0133 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0134 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0135 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0136 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0137 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0138 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0139 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0140 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0141 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0142 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0143 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0144 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0145 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0146 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0147 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0148 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0149 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0150 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0151 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0152 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0153 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0154 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0155 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0156 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0157 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0158 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0159 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0160 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0161 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0162 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0163 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0164 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0165 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0166 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0167 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0168 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0169 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0170 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0171 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0172 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0173 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0174 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0175 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0176 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0177 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0178 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0179 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0180 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0181 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0182 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0183 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0184 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0185 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0186 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0187 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0188 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0189 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0190 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0191 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0192 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0193 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0194 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0195 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0196 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0197 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0198 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0199 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0200 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0201 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0202 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0203 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0204 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0205 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0206 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0207 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0208 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0209 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0210 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0211 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0212 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0213 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0214 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0215 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0216 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0217 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0218 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0219 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0220 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0221 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0222 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0223 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0224 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0225 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0226 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0227 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0228 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0229 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0230 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0231 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0232 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0233 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0234 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0235 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0236 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0237 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0238 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0239 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0240 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0241 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0242 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0243 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0244 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0245 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0246 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0247 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0248 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0249 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0250 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0251 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0252 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0253 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0254 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0255 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0256 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0257 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0258 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0259 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0260 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0261 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0262 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0263 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0264 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0265 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0266 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0267 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0268 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0269 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0270 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0271 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0272 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0273 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0274 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0275 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0276 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0277 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0278 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0279 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0280 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0281 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0282 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0283 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0284 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0285 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0286 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0287 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0288 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0289 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0290 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0291 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0292 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0293 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0294 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0295 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0296 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0297 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0298 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0299 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0300 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0301 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0302 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0303 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0304 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0305 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0306 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0307 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0308 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0309 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0310 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0311 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0312 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0313 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0314 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0315 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0316 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0317 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0318 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0319 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0320 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0321 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0322 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0323 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0324 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0325 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0326 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0327 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0328 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0329 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0330 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0331 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0332 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0333 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0334 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0335 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0336 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0337 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0338 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0339 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0340 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0341 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0342 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0343 — Admin verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Admin**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0344 — Uploads verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Uploads**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0345 — Photo Wall verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Photo Wall**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0346 — Jukebox verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Jukebox**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0347 — Chat verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Chat**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0348 — Content Packs verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Content Packs**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0349 — Editor verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Editor**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0350 — Localization verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Localization**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0351 — Accessibility verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Accessibility**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0352 — Security verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Security**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0353 — Performance verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Performance**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0354 — Network verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Network**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0355 — Offline verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Offline**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0356 — Diagnostics verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Diagnostics**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0357 — Backup verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Backup**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0358 — Restore verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Restore**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0359 — Packaging verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Packaging**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0360 — Release verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Release**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0361 — Host verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Host**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0362 — Controller verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Controller**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0363 — Lobby verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Lobby**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0364 — Game Engine verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Game Engine**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0365 — Quiz verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Quiz**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0366 — Drawing verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Drawing**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0367 — Voting verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Voting**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0368 — Teams verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Teams**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0369 — Audience verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Audience**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0370 — Realtime verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Realtime**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0371 — Reconnect verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Reconnect**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


## VW-0372 — Persistence verification card

**Objetivo:** verificar combinação independente de estado, erro, recuperação e UX no domínio **Persistence**.

**Preparação:** iniciar build de produção e DB de teste isolada; registrar versão; abrir host e pelo menos dois controllers; usar dispositivo físico quando rede/mobile for relevante.

**Procedimento:**
1. confirmar health e estado inicial;
2. executar a ação principal;
3. introduzir alteração controlada (refresh, atraso, limite, reconnect, concorrência ou troca de fase);
4. aguardar ACK/resposta estruturada;
5. comparar UI com estado do servidor;
6. confirmar convergência dos clientes;
7. verificar logs sem exceção não tratada;
8. verificar ausência de token/segredo em payload público;
9. repetir ação idempotente com mesmo identificador quando aplicável;
10. encerrar e validar persistence/cleanup.

**Aceite:** experiência continua utilizável; estado final determinístico; sem duplicação de score/media/mensagem; feedback explícito; erro recuperável quando previsto; admin consegue diagnosticar.

**A11y:** foco visível, nome programático, target adequado e reduced motion. Se houver drag não essencial, usar alternativa tap.

**Offline:** executar sem WAN; nenhum CDN/API/font remoto pode ser requisito silencioso.

**Evidência:** nome do teste/script, resultado, duração, versão e referência à correção quando primeira execução falhar. Todo bug encontrado gera regression test.


---

# FIM DA MASTER SPECIFICATION 3.0

**Contagem gerada:** 200.080 palavras aproximadas · 31.946 linhas · 1.566.289 bytes UTF-8.  
**Estimativa:** a ~450 palavras por página. ≈ 444.6 páginas A4 de conteúdo técnico. Markdown não possui paginação física fixa.
