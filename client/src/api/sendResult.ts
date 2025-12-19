export async function sendResult(result: 'win' | 'loss', chatId?: number, code?: string) {
  try {
    // Use same-origin relative path so production routing (Traefik) handles /api
    await fetch(`/api/send-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, code, chat_id: chatId })
    });
  } catch (err) {
    // ignore network errors locally
    // keep same logging behavior as before
    // eslint-disable-next-line no-console
    console.warn('sendResult error', err);
  }
}
