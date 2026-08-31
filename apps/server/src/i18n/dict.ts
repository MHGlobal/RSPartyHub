/**
 * i18n dictionaries — Etapa 18 PT/EN (spec §18, AC-009).
 * Minimal core coverage: join, lobby, game, results, errors, host, media, jukebox.
 */
export const PT = {
  "brand.subtitle": "Party local via Wi-Fi",
  "join.title": "Entrar na festa",
  "join.roomCode": "Código da sala",
  "join.nickname": "Nome",
  "join.avatar": "Avatar",
  "join.enter": "Entrar",
  "join.reconnecting": "A reconectar…",
  "lobby.ready": "Pronto",
  "lobby.waiting": "A aguardar outros jogadores…",
  "lobby.hostStart": "Começar jogo",
  "lobby.kick": "Remover",
  "lobby.lock": "Bloquear sala",
  "game.waiting": "Resposta recebida — aguarde",
  "game.timeLeft": "Tempo restante",
  "game.results": "Resultados",
  "game.podium": "Pódio",
  "host.qr": "QR de entrada",
  "host.copyLink": "Copiar link",
  "admin.title": "Admin",
  "media.upload": "Enviar ficheiro",
  "media.photoWall": "Mural de fotos",
  "media.jukebox": "Jukebox",
  "error.ROOM_NOT_FOUND": "Sala não encontrada",
  "error.NICKNAME_TAKEN": "Nome já em uso",
  "error.ROOM_LOCKED": "Sala bloqueada",
  "error.FORBIDDEN": "Sem permissão",
  "error.INVALID_PAYLOAD": "Dados inválidos",
} as const;

export const EN = {
  "brand.subtitle": "Local party over Wi-Fi",
  "join.title": "Join the party",
  "join.roomCode": "Room code",
  "join.nickname": "Nickname",
  "join.avatar": "Avatar",
  "join.enter": "Join",
  "join.reconnecting": "Reconnecting…",
  "lobby.ready": "Ready",
  "lobby.waiting": "Waiting for other players…",
  "lobby.hostStart": "Start game",
  "lobby.kick": "Kick",
  "lobby.lock": "Lock room",
  "game.waiting": "Answer received — waiting",
  "game.timeLeft": "Time left",
  "game.results": "Results",
  "game.podium": "Podium",
  "host.qr": "Entry QR",
  "host.copyLink": "Copy link",
  "admin.title": "Admin",
  "media.upload": "Upload file",
  "media.photoWall": "Photo wall",
  "media.jukebox": "Jukebox",
  "error.ROOM_NOT_FOUND": "Room not found",
  "error.NICKNAME_TAKEN": "Nickname taken",
  "error.ROOM_LOCKED": "Room is locked",
  "error.FORBIDDEN": "Forbidden",
  "error.INVALID_PAYLOAD": "Invalid payload",
} as const;

export type Locale = "pt" | "en";
export const DICTS = { pt: PT, en: EN } as const;

export function t(locale: Locale, key: string, fallback?: string): string {
  const d = DICTS[locale] ?? DICTS.pt;
  return (d as Record<string,string>)[key] ?? fallback ?? key;
}
