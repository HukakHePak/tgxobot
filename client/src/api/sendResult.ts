export async function sendResult(result: 'win' | 'loss', chatId?: number, code?: string) {
  try {
    let base = '';
    const webAppUrl = import.meta.env.VITE_WEBAPP_URL as string | undefined;
    if (webAppUrl) {
      try {
        const url = new URL(webAppUrl);
        base = url.origin;
      } catch {}
    }
    if (!base) base = 'http://localhost:3001';
    await fetch(`${base}/api/send-result`, {
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
