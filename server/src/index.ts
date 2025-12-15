

import express from 'express'
import cors from 'cors'
import { Bot } from 'grammy'

const BOT_TOKEN = process.env.BOT_TOKEN
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN not set in environment!')
}

// --- Telegram bot via grammy ---
const bot = new Bot(BOT_TOKEN)
bot.command('start', ctx => ctx.reply('Бот активен! Играйте на сайте.'))
// const WEBAPP_URL = process.env.VITE_WEBAPP_URL || '';
// bot.command('game', ctx =>
//   ctx.reply('Открыть игру:', {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Играть в крестики-нолики',
//             web_app: { url: WEBAPP_URL }
//           }
//         ]
//       ]
//     }
//   })
// )
bot.start()

// --- Express API ---
const app = express()
const corsOrigin = process.env.VITE_WEBAPP_URL || undefined;
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())

// Лог всех входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.post('/send-result', async (req, res) => {
  const { chat_id, result, code } = req.body || {}
  console.log('[send-result] body:', req.body)
  if (!chat_id) {
    console.warn('[send-result] Нет chat_id!')
    
    return res.status(400).json({ ok: false, error: 'chat_id is required' })
  }
  let text = ''
  if (result === 'win') {
    text = `Победа! Промокод выдан: ${code || ''}`
  } else {
    text = 'Проигрыш'
  }
  try {
    const data = await bot.api.sendMessage(chat_id, text)
    console.log('[send-result] Успешно отправлено:', { chat_id, text, data })
    return res.json({ ok: true, data })
  } catch (err) {
    console.error('[send-result] Ошибка отправки:', err)
    return res.status(500).json({ ok: false, error: String(err) })
  }
})

const PORT = Number(process.env.PORT) || 3001
console.log('Starting server...')
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
