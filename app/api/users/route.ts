import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  try {
    const users = await prisma.openTripUser.findMany({
      select: {
        id: true,
        name: true,
        openTrips: {
          select: { jumlahPendaki: true },
        },
      },
    });

    const result = users.map((user) => ({
      id: user.id,
      name: user.name || "(Tanpa Nama)",
      jumlahPendaki: user.openTrips.reduce(
        (sum, trip) => sum + trip.jumlahPendaki,
        0
      ),
    }));

    const totalUser = result.length;
    const totalPendaki = result.reduce(
      (sum, u) => sum + u.jumlahPendaki,
      0
    );

    // ===== Format pesan Telegram =====
    const userLines = result
      .map((u) => `• ${u.name} — ${u.jumlahPendaki} pendaki`)
      .join("\n");

    const message =
      `📊 <b>Laporan OpenTrip Hari Ini</b>\n\n` +
      `${userLines}\n\n` +
      `<b>Total User:</b> ${totalUser}\n` +
      `<b>Total Pendaki:</b> ${totalPendaki}\n\n` +
      `Data dikirim otomatis oleh sistem pada ${new Date().toLocaleString("id-ID")}.`;

    await sendTelegramMessage(message);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
