"use client";

import { useEffect, useState } from "react";
import { Otform } from "@/components/form/OtForm";
import { Header } from "@/components/home/header";
import { Toaster } from "sonner";
import { Navbar } from "@/components/home/navbar";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/users");
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error("Gagal load users:", result.error);
      }
    }
    load();
  }, []);


  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-start gap-6 px-4 sm:px-0 pt-20">
        <Toaster position="top-center" richColors />
        <Header />
        <div className="w-full max-w-md">
          <Otform users={users} />
        </div>
      </div>
    </>

  );
}
