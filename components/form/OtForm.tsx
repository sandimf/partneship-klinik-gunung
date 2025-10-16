"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
}

interface FormData {
  userId: number;
  jumlah: string;
  tanggal?: string;
}

interface OtformProps {
  users: User[];
}

export function Otform({ users }: OtformProps) {
  const form = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      userId: undefined,
      jumlah: "",
      tanggal: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/ot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Berhasil tersimpan!");
        form.reset();
      } else {
        toast.error(`${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Terjadi kesalahan"}`);
    }
  };

  const formatDateToInput = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString().split("T")[0];
    return "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
        {/* User Select */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value || "")}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Nama Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Nama Pendaki</SelectLabel>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jumlah Field */}
        <FormField
          control={form.control}
          name="jumlah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Pendaki</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan jumlah pendaki"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tanggal Field */}
        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Screening</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={formatDateToInput(field.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
