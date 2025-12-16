export type Player = 'X' | 'O' | null;

export interface GameResult {
  result: 'win' | 'loss';
  code?: string;
  chat_id?: number;
}
