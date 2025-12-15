import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Warning: BOT_TOKEN or CHAT_ID not set in environment. Telegram messages will fail.')
}

app.post('/api/send-result', async (req, res) => {
  const { result, code } = req.body || {}
  if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ ok: false, error: 'Bot token or chat id not configured' })

  let text = ''
  if (result === 'win') {
    text = `Победа! Промокод выдан: ${code || ''}`
  } else {
    text = 'Проигрыш'
  }

  try {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    })
    const data = await resp.json()
    if (!data.ok) return res.status(500).json({ ok: false, error: data })
    return res.json({ ok: true, data })
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) })
  }
})

const PORT = Number(process.env.PORT) || 3001
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
