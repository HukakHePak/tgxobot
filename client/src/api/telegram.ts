// Получение chat_id из Telegram WebApp API
export function getTelegramChatId(): number | undefined {
  // @ts-ignore
  const tg = window.Telegram?.WebApp;
  // @ts-ignore
  const initData = tg?.initDataUnsafe;
  return initData?.user?.id;
}
