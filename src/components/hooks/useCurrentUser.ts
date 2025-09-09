"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/user.type";

const API_BASE = "http://localhost:5000";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get<User>(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const profilePicture = data.profilePicture
          ? data.profilePicture.startsWith("http")
            ? data.profilePicture
            : `${API_BASE}${data.profilePicture}`
          : "/images/profile.webp";
        setUser({ ...data, profilePicture });
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchUser();
  }, []);

  return user;
}
