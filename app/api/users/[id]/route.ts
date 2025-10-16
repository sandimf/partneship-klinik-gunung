import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // context.params adalah Promise
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const user = await prisma.openTripUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        openTrips: {
          select: {
            id: true,
            createdAt: true,
            tanggalScreening: true,
            jumlahPendaki: true,
          },
          orderBy: { tanggalScreening: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
