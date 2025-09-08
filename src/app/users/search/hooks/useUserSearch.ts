"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user.type";

export function useUserSearch(query: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:5000/users/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return { users, loading, error };
}
