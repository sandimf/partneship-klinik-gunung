import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const body = await req.json();

  const text = body?.message?.text?.trim();
  const chatId = body?.message?.chat?.id;
  const threadId = body?.message?.message_thread_id;

  if (!text) return NextResponse.json({ ok: true });

  if (text === "/start") {
    await sendTelegramMessage("Bot aktif. Gunakan perintah /cek atau /laporan.", chatId, threadId);
  }

  if (text === "/cek") {
    await sendTelegramMessage("Server berjalan normal.", chatId, threadId);
  }

  return NextResponse.json({ ok: true });
}
