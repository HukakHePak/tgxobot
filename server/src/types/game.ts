export interface SendResultRequest {
  chat_id: number;
  result: 'win' | 'loss';
  code?: string;
}
