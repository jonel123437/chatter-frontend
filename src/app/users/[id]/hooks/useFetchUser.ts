"use client";

import { useState, useEffect } from "react";

// Update your User type to include profile and cover pictures
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string; // optional
  coverPicture?: string;   // optional
}

export const useFetchUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token"); // include auth if needed
        const res = await fetch(`http://localhost:5000/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json(); // type cast to include images
        setUser(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
