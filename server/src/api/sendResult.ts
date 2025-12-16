import { Request, Response } from 'express';
import { bot } from '../bot/telegramBot';
import { SendResultRequest } from '../types/game';

export async function sendResultHandler(req: Request, res: Response) {
  const { chat_id, result, code } = req.body as SendResultRequest;
  console.log('[send-result] body:', req.body);
  if (!chat_id) {
    console.warn('[send-result] Нет chat_id!');
    return res.status(400).json({ ok: false, error: 'chat_id is required' });
  }
  let text = '';
  if (result === 'win') {
    text = `Победа! Промокод выдан: ${code || ''}`;
  } else {
    text = 'Проигрыш';
  }
  try {
    const data = await bot.api.sendMessage(chat_id, text);
    console.log('[send-result] Успешно отправлено:', { chat_id, text, data });
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[send-result] Ошибка отправки:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
