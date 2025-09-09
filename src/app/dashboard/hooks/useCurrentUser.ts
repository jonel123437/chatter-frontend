"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/user.type";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token"); // match your login key
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get<User>("http://localhost:5000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentUser(res.data);
        localStorage.setItem("currentUser", JSON.stringify(res.data));
      } catch {
        // silently fail or handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading };
};
