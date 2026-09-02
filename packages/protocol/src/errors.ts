/** Canonical error codes used in ACKs, HTTP and snapshots. */
export const ErrorCodes = {
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ROOM_LOCKED: "ROOM_LOCKED",
  ROOM_CLOSED: "ROOM_CLOSED",
  NICKNAME_TAKEN: "NICKNAME_TAKEN",
  INVALID_NICKNAME: "INVALID_NICKNAME",
  NOT_IN_ROOM: "NOT_IN_ROOM",
  NOT_HOST: "NOT_HOST",
  FORBIDDEN: "FORBIDDEN",
  BAD_PHASE: "BAD_PHASE",
  DUPLICATE_ACTION: "DUPLICATE_ACTION",
  RATE_LIMITED: "RATE_LIMITED",
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  GAME_NOT_FOUND: "GAME_NOT_FOUND",
  MIN_PLAYERS: "MIN_PLAYERS",
  MIX_EMPTY: "MIX_EMPTY",
  MIX_DUPLICATE_GAME: "MIX_DUPLICATE_GAME",
  MIX_INCOMPATIBLE_GAME: "MIX_INCOMPATIBLE_GAME",
  DEADLINE_PASSED: "DEADLINE_PASSED",
  INTERNAL: "INTERNAL",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export function errorMessage(code: ErrorCode): string {
  switch (code) {
    case "ROOM_NOT_FOUND":
      return "Sala não encontrada. Verifica o código.";
    case "ROOM_FULL":
      return "A sala está cheia.";
    case "ROOM_LOCKED":
      return "A sala está fechada a novas entradas.";
    case "ROOM_CLOSED":
      return "A festa terminou.";
    case "NICKNAME_TAKEN":
      return "Esse nome já está em uso nesta sala.";
    case "INVALID_NICKNAME":
      return "Nome inválido (1–20 caracteres).";
    case "NOT_IN_ROOM":
      return "Não estás numa sala.";
    case "NOT_HOST":
      return "Apenas o anfitrião pode fazer isso.";
    case "FORBIDDEN":
      return "Ação não permitida.";
    case "BAD_PHASE":
      return "Ação fora da fase atual do jogo.";
    case "DUPLICATE_ACTION":
      return "Ação já processada.";
    case "RATE_LIMITED":
      return "Demasiadas ações. Aguarda um momento.";
    case "INVALID_PAYLOAD":
      return "Dados inválidos.";
    case "GAME_NOT_FOUND":
      return "Jogo desconhecido.";
    case "MIN_PLAYERS":
      return "Jogadores insuficientes para este jogo.";
    case "MIX_EMPTY":
      return "Escolhe pelo menos um jogo para o Party Mix.";
    case "MIX_DUPLICATE_GAME":
      return "Um jogo só pode aparecer uma vez no Party Mix.";
    case "MIX_INCOMPATIBLE_GAME":
      return "Um dos jogos escolhidos não é compatível com esta sala.";
    case "DEADLINE_PASSED":
      return "Tempo esgotado.";
    case "INTERNAL":
      return "Erro interno do servidor.";
  }
}
