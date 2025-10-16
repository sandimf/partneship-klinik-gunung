"use client";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";

type Trip = {
    id: number;
    jumlahPendaki: number;
};

type UserWithTrips = {
    id: number;
    name: string | null;
    openTrips: Trip[];
    jumlahPendaki: number;
};

export default function Dashboard() {
    const { data: users, loading, error } = useFetch<UserWithTrips[]>("/api/users");

    if (loading) return <p>Memuat...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-6">
                Dashboard Partnership Klinik Gunung Semeru
            </h1>

            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">No</th>
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Jumlah Pendaki</th>
                        <th className="border p-2 text-left">Detail</th>

                    </tr>
                </thead>
                <tbody>
                    {users?.map((user, index) => (
                        <tr key={user.id}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.jumlahPendaki}</td>
                            <td className="border p-2">
                                <Link href={`/dashboard/${user.id}`}>Detail</Link>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
