const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = "-1002911218423";
const TELEGRAM_THREAD_ID = 519;

export async function sendTelegramMessage(
  text: string,
  chatId: string = TELEGRAM_CHAT_ID,
  messageThreadId: number = TELEGRAM_THREAD_ID
) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: chatId,
    message_thread_id: messageThreadId,
    text,
    parse_mode: "HTML",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Telegram send failed:", errorText);
  }
}