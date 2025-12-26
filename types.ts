
export enum GameMode {
  LOCAL_PVP = 'LOCAL_PVP',
  VS_CPU = 'VS_CPU',
  REMOTE_PVP = 'REMOTE_PVP'
}

export type PlayerColor = 'w' | 'b';

export interface ChatMessage {
  id: string;
  sender: PlayerColor;
  text: string;
  timestamp: number;
}

export interface GameState {
  fen: string;
  history: string[];
  turn: PlayerColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  capturedPieces: {
    w: string[];
    b: string[];
  };
}

export interface MovePayload {
  from: string;
  to: string;
  promotion?: string;
}
