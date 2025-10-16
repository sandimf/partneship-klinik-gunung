import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (untuk development)
  await prisma.openTrip.deleteMany();
  await prisma.openTripUser.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Buat user login NextAuth
  const hashedPassword = await bcrypt.hash("password", 10);
  const authUser = await prisma.user.create({
    data: {
      name: "sandi",
      email: "cold@sandimf.dev",
      password: hashedPassword,
    },
  });

  // Buat OpenTripUser dan OpenTrip
  const tripUser = await prisma.openTripUser.create({
    data: {
      name: "Alice",
      email: "alice@login.com",
      openTrips: {
        create: [
          { tanggalScreening: new Date("2025-10-10"), jumlahPendaki: 5 },
          { tanggalScreening: new Date("2025-11-01"), jumlahPendaki: 8 },
        ],
      },
    },
    include: { openTrips: true },
  });

  console.log("Seed data created successfully:");
  console.dir({ authUser, tripUser }, { depth: null });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
