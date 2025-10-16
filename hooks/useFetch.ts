"use client";
import { useState, useEffect } from "react";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to fetch");
        if (isMounted) setData(json.data);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
