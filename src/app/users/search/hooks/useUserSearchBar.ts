"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user.type";

const API_BASE = "http://localhost:5000";

export function useUserSearchBar(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setUsers([]);
      setError("");
      return;
    }

    let isCancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch users");

        const data: User[] = await res.json();
        if (!isCancelled) setUsers(data || []);
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "An error occurred");
          setUsers([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isCancelled = true;
    };
  }, [query]);

  return { query, setQuery, users, loading, error };
}
