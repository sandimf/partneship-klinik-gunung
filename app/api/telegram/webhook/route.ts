import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    // ===== Bersihkan teks dari @namabot =====
    let text = message.text?.trim() || "";
    text = text.replace(/@\w+_bot/i, "").trim();

    const chatId = message.chat.id || TELEGRAM_CHAT_ID;
    const threadId = message.message_thread_id || TELEGRAM_THREAD_ID;
    const userName = message.from?.first_name || "Pengguna";

    console.log("Text diterima:", text);
    console.log("Chat ID:", chatId, "Thread ID:", threadId);

    // ===== /start =====
    if (text === "/start") {
      await sendTelegramMessage(
        `Halo ${userName}! ˙⋆✮\n\nPerintah:\n` +
          `/start — Menu utama\n` +
          `/users — Daftar partner\n` +
          `/user <id> — Detail partner\n` +
          `/adduser <name> <phone> — Tambah partner baru\n` +
          `/cek — Status server\n` +
          `/laporan — Laporan pendaki\n` +
          `/web — Link web partnership`,
        chatId,
        threadId
      );
    }

    // ===== /adduser <name> =====
    if (text.startsWith("/adduser ")) {
      const parts = text.split(" ");
      parts.shift(); // hapus "/adduser"
      const phoneNew = parts.pop(); // kata terakhir = phone
      const newName = parts.join(" "); // sisanya = nama

      if (!newName || !phoneNew) {
        await sendTelegramMessage(
          "Format salah. Gunakan /adduser <name> <phone>",
          chatId,
          threadId
        );
        return NextResponse.json({ ok: true });
      }

      const newUser = await prisma.openTripUser.create({
        data: {
          name: newName,
          phone: phoneNew,
        },
      });

      await sendTelegramMessage(
        `Partner baru berhasil dibuat:\n` +
          `<b>ID:</b> ${newUser.id}\n` +
          `<b>Nama:</b> ${newUser.name}\n` +
          `<b>Phone:</b> ${newUser.phone}`,
        chatId,
        threadId
      );
    }

    // ===== /cek =====
    if (text === "/cek") {
      await sendTelegramMessage(
        `Server aktif dan webhook berjalan normal ˙⋆✮`,
        chatId,
        threadId
      );
    }
    if (text === "/web") {
    await sendTelegramMessage(
        `<b>Web Partnership Klinik Gunung</b>\n` +
        `<a href="https://partnership.ranupani.my.id">Click Me</a>`,
        chatId,
        threadId
    );
    }

    // ===== /users =====
    if (text === "/users") {
      const users = await prisma.openTripUser.findMany({
        select: { id: true, name: true },
        orderBy: { id: "asc" },
      });

      if (!users.length) {
        await sendTelegramMessage(
          "Belum ada pengguna terdaftar.",
          chatId,
          threadId
        );
        return NextResponse.json({ ok: true });
      }

      const userList = users
        .map((u) => `${u.id}. ${u.name || "(Tanpa Nama)"}`)
        .join("\n");

      const messageText = `<b>Daftar Partner</b>\n\n${userList}\n\nKetik <code>/user &lt;id&gt;</code> untuk melihat detail.`;

      await sendTelegramMessage(messageText, chatId, threadId);
    }

    // ===== /user <id> =====
    if (text.startsWith("/user ")) {
      const parts = text.split(" ");
      const id = Number(parts[1]);

      if (isNaN(id)) {
        await sendTelegramMessage(
          "Format salah. Gunakan /user <id>",
          chatId,
          threadId
        );
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
        await sendTelegramMessage(
          `Partner dengan ID ${id} tidak ditemukan.`,
          chatId,
          threadId
        );
        return NextResponse.json({ ok: true });
      }

      const totalPendaki = user.openTrips.reduce(
        (sum, trip) => sum + trip.jumlahPendaki,
        0
      );

      const messageText =
        `<b>Detail Partner</b>\n\n` +
        `<b>ID:</b> ${user.id}\n` +
        `<b>Nama:</b> ${user.name || "(Tanpa Nama)"}\n` +
        `<b>Total Pendaki:</b> ${totalPendaki}`;

      await sendTelegramMessage(messageText, chatId, threadId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({
      ok: false,
      error: (err as Error).message,
    });
  }
}
