import { z } from "zod";

export const formSchema = z.object({
  nama: z
    .string()
    .min(1, { message: "Nama harus diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  
  jumlah: z
    .union([z.string(), z.number()])
    .refine((val) => {
      if (typeof val === "string") {
        return /^\d+$/.test(val.trim()); // Hanya angka
      }
      return typeof val === "number" && val > 0;
    }, {
      message: "Jumlah harus berupa angka positif",
    })
    .transform((val) => {
      if (typeof val === "string") {
        return parseInt(val, 10);
      }
      return val;
    })
    .pipe(
      z
        .number()
        .min(1, { message: "Jumlah Pendaki minimal 1" })
        .max(1000, { message: "Jumlah Pendaki maksimal 1000" })
    ),
  
  tanggal: z
    .date()
    .min(1, { message: "Tanggal Screening harus diisi" })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: "Tanggal Screening harus valid",
    })
    .transform((val) => new Date(val)),
});

export type FormData = z.infer<typeof formSchema>;