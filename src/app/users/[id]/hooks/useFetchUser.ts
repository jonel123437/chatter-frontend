import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
}

export interface UserWithFriends extends User {
  friends?: string[];
  friendRequests?: string[];
}

export const useFetchUser = (userId: string | undefined, token?: string) => {
  const [user, setUser] = useState<UserWithFriends | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch(`${API_BASE}/users/${userId}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data: UserWithFriends = await res.json();

        const resolveImageUrl = (url?: string) =>
          url
            ? url.startsWith("http")
              ? url
              : `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`
            : undefined;

        setUser({
          ...data,
          profilePicture: resolveImageUrl(data.profilePicture) || "/images/profile.webp",
          coverPicture: resolveImageUrl(data.coverPicture) || "/images/cover.webp",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  return { user, setUser, loading, error };
};
