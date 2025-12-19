import { Request, Response } from 'express';
import { bot } from '../bot/telegramBot';
import { SendResultRequest } from '../types/game';

export async function sendResultHandler(req: Request, res: Response) {
  const { chat_id, result, code } = req.body as SendResultRequest;
  // request body logging removed
  if (!chat_id) {
    return res.status(400).json({ ok: false, error: 'chat_id is required' });
  }
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const winPhrases = [
    `Yay — you won! 🎉 Here's your promo code: ${code || ''} Enjoy! 💖`,
    `You did it! Use code ${code || ''} at checkout — treat yourself. ✨`,
    `Winner! 🎉 Your code: ${code || ''}. Hope you love it! 🌸`,
    `Congrats — you won! Here's ${code || ''} — thank you for playing. 💐`
  ];

  const losePhrases = [
    "Not this time — you were so close. Fancy another go? 💪",
    "Almost there! Try once more — you’ve got this. ✨",
    "So close! Take another shot — I believe in you. 💖",
    "Not quite, but great play — ready for a rematch? 🎯"
  ];

  const text = result === 'win' ? pick(winPhrases) : pick(losePhrases);
  try {
    const data = await bot.api.sendMessage(chat_id, text);
    // success logging removed
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[send-result] Ошибка отправки:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
