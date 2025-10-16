import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, jumlah, tanggal } = data;

    if (!userId || !jumlah || !tanggal) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const newOt = await prisma.openTrip.create({
      data: {
        userId: Number(userId),
        jumlahPendaki: Number(jumlah),
        tanggalScreening: new Date(tanggal),
      },
    });

    return NextResponse.json({ success: true, data: newOt });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
