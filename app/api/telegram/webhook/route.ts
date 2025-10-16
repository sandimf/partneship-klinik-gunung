import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

const TELEGRAM_CHAT_ID = "-1002911218423"; // fallback
const TELEGRAM_THREAD_ID = 519;

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const message = update?.message;
    if (!message) return NextResponse.json({ ok: true });

    const text = message.text?.trim() || "";
    const chatId = message.chat.id || TELEGRAM_CHAT_ID;
    const threadId = message.message_thread_id || TELEGRAM_THREAD_ID;
    const userName = message.from?.first_name || "Pengguna";

    // ====== /start ======
    if (text === "/start") {
      await sendTelegramMessage(
        `Halo ${userName}! ˙⋆✮\n\nPerintah yang tersedia:\n` +
          `/start — Menampilkan menu utama\n` +
          `/users — Lihat daftar parner\n` +
          `/user [id] — Lihat detail parner\n` +
          `/cek — Cek status server\n` +
          `/laporan — Lihat laporan pendaki`,
        chatId,
        threadId
      );
    }

    // ====== /cek ======
    if (text === "/cek") {
      await sendTelegramMessage(
        `Server aktif dan webhook berjalan normal ˙⋆✮`,
        chatId,
        threadId
      );
    }

    // ====== /laporan ======
    if (text === "/laporan") {
      await sendTelegramMessage(
        `Fitur laporan sedang dihubungkan dengan database Prisma. ˙⋆✮`,
        chatId,
        threadId
      );
    }

    // ====== /users ======
    if (text === "/users") {
      const users = await prisma.openTripUser.findMany({
        select: { id: true, name: true },
        orderBy: { id: "asc" },
      });

      if (!users.length) {
        await sendTelegramMessage("Belum ada pengguna terdaftar.", chatId, threadId);
        return NextResponse.json({ ok: true });
      }

      const userList = users
        .map((u) => `${u.id}. ${u.name || "(Tanpa Nama)"}`)
        .join("\n");

      const messageText =
        `˙⋆✮ <b>Daftar Pengguna</b>\n\n${userList}\n\nKetik <code>/user &lt;id&gt;</code> untuk melihat detail.`;

      await sendTelegramMessage(messageText, chatId, threadId);
    }

    // ====== /user <id> ======
    if (text.startsWith("/user ")) {
      const parts = text.split(" ");
      const id = Number(parts[1]);

      if (isNaN(id)) {
        await sendTelegramMessage("Format salah. Gunakan /user <id>", chatId, threadId);
        return NextResponse.json({ ok: true });
      }

      const user = await prisma.openTripUser.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          openTrips: { select: { jumlahPendaki: true } },
        },
      });

      if (!user) {
        await sendTelegramMessage(`Pengguna dengan ID ${id} tidak ditemukan.`, chatId, threadId);
        return NextResponse.json({ ok: true });
      }

      const totalPendaki = user.openTrips.reduce(
        (sum, trip) => sum + trip.jumlahPendaki,
        0
      );

      const messageText =
        `˙⋆✮ <b>Detail Pengguna</b>\n\n` +
        `<b>ID:</b> ${user.id}\n` +
        `<b>Nama:</b> ${user.name || "(Tanpa Nama)"}\n` +
        `<b>Total Pendaki:</b> ${totalPendaki}`;

      await sendTelegramMessage(messageText, chatId, threadId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: false, error: (err as Error).message });
  }
}
