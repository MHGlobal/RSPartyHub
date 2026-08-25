/**
 * Controller view contract (spec §13.3 — Player Controller).
 * Every plugin's getPrivateView()/getPublicView() MAY expose these optional
 * fields; apps/web renders them generically. Games keep full freedom to add
 * extra fields for custom UIs.
 *
 * Generic actions every P0 game accepts:
 *   CHOICE  { index: number }
 *   TEXT    { text: string }
 *   BUZZ    {}
 *   VOTE    { optionId: string }
 *   MARK    { cellId: string }
 *   CLAIM   { kind: string }
 *   TAP     { target?: string }
 */

export interface ControllerChoice {
  label: string;
}

/** Fields recognised by the generic player controller renderer. */
export interface ControllerView {
  /** headline shown above controls */
  prompt?: string;
  /** render N choice buttons → CHOICE { index } */
  choices?: ControllerChoice[];
  /** free-text field → TEXT { text } */
  textInput?: boolean;
  textPlaceholder?: string;
  /** big red button → BUZZ {} */
  buzzerEnabled?: boolean;
  /** bingo-style grid → MARK { cellId } */
  cells?: { id: string; label: string; marked: boolean }[];
  /** vote list → VOTE { optionId } */
  voteOptions?: { id: string; label: string }[];
  /** tap targets (hot potato pass / charades got-it) → TAP { target? } */
  targets?: { id: string; label: string; style?: "good" | "bad" | "neutral" }[];
  /** claim buttons → CLAIM { kind } */
  claimable?: { kind: string; label: string }[];
  /** when set, controls are replaced by this explanatory text */
  disabledText?: string;
  /** short status line ("Aguardando outros jogadores") */
  statusText?: string;
}
