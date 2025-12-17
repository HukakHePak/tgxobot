import { Request, Response } from 'express';
import { bot } from '../bot/telegramBot';
import { SendResultRequest } from '../types/game';

export async function sendResultHandler(req: Request, res: Response) {
  const { chat_id, result, code } = req.body as SendResultRequest;
  // request body logging removed
  if (!chat_id) {
    return res.status(400).json({ ok: false, error: 'chat_id is required' });
  }
  let text = '';
  if (result === 'win') {
    text = `Hooray — you won! 🎉\nHere's your promo code: ${code || ''}\nThanks for playing — come back soon! 💖`;
  } else {
    text = "Not this time, but you did great — try again! ✨";
  }
  try {
    const data = await bot.api.sendMessage(chat_id, text);
    // success logging removed
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[send-result] Ошибка отправки:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
