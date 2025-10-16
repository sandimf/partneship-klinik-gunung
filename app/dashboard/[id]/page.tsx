"use client";
import { useFetch } from "@/hooks/useFetch";
import { useParams } from "next/navigation";

type OpenTrip = {
  id: number;
  createdAt: string;
  tanggalScreening: string;
  jumlahPendaki: number;
};

type UserDetail = {
  id: number;
  name: string | null;
  openTrips: OpenTrip[];
};

export default function UserDetailTable() {
  const params = useParams();
  const userId = params?.id;

  if (!userId) return <p>Invalid user ID</p>;

  const { data: user, loading, error } = useFetch<UserDetail>(`/api/users/${userId}`);

  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!user) return <p>User tidak ditemukan</p>;

console.log("params", params);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Detail OpenTrip untuk {user.name}</h2>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 text-left">No</th>
            <th className="border p-2 text-left">Tanggal Screening</th>
            <th className="border p-2 text-left">Tanggal Ditambahkan</th>
            <th className="border p-2 text-left">Jumlah Pendaki</th>
          </tr>
        </thead>
        <tbody>
          {user.openTrips?.map((trip, index) => (
            <tr key={trip.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{new Date(trip.tanggalScreening).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(trip.createdAt).toLocaleDateString()}</td>
              <td className="border p-2">{trip.jumlahPendaki}</td>
            </tr>
          )) || <tr><td colSpan={4} className="text-center p-2">No trips</td></tr>}
        </tbody>
      </table>
    </div>
  );
}