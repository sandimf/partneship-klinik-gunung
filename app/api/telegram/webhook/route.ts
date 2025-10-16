import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

const TELEGRAM_CHAT_ID = "-1002911218423";
const TELEGRAM_THREAD_ID = 519;

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();

    console.log("===== RAW TELEGRAM UPDATE =====");
    console.log(bodyText);
    console.log("===============================");

    const update = JSON.parse(bodyText);
    const message =
      update.message ||
      update.channel_post ||
      update.edited_message ||
      update.edited_channel_post;

    if (!message) {
      console.log("Tidak ada message di update");
      return NextResponse.json({ ok: true });
    }

    const text = message.text?.trim() || "";
    const chatId = message.chat.id || TELEGRAM_CHAT_ID;
    const threadId = message.message_thread_id || TELEGRAM_THREAD_ID;
    const userName = message.from?.first_name || "Pengguna";

    console.log("Text diterima:", text);
    console.log("Chat ID:", chatId, "Thread ID:", threadId);

    if (text === "/start") {
      await sendTelegramMessage(
        `Halo ${userName}! ˙⋆✮\n\nPerintah:\n/start — Menu utama\n/users — Daftar partner\n/user <id> — Detail partner\n/cek — Status server\n/laporan — Laporan pendaki`,
        chatId,
        threadId
      );
    }

    if (text === "/cek") {
      await sendTelegramMessage(`Server aktif dan webhook berjalan normal ˙⋆✮`, chatId, threadId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: false, error: (err as Error).message });
  }
}
