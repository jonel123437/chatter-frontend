"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserImageResponse } from "@/types/user.type";

const API_BASE = "http://localhost:5000";

export const useCurrentUser = (token: string | null) => {
  const router = useRouter();
  const [user, setUser] = useState<UserImageResponse | null>(null);

  const resolveImageUrl = (url?: string) =>
    url ? (url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`) : undefined;

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get<UserImageResponse>(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      setUser({
        ...data,
        profilePicture: resolveImageUrl(data.profilePicture) || "/images/profile.webp",
        coverPicture: resolveImageUrl(data.coverPicture) || "/images/cover.webp",
      });
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number }; message?: string };
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        console.error("Axios error:", axiosError.message);
      }
    }
  };

  useEffect(() => {
    if (token) fetchCurrentUser();
  }, [token]);

  return { user, fetchCurrentUser };
};
