"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserImageResponse } from "@/types/user.type";

export interface PublicUser {
  id: string;
  name: string;
  profilePicture?: string;
}

const API_BASE = "http://localhost:5000";

export const useFetchUserFriends = (token: string | null) => {
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resolveImageUrl = (url?: string) =>
    url
      ? url.startsWith("http")
        ? url
        : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`
      : "/images/profile.webp";

  // Fetch single user by ID
  const fetchUserById = useCallback(
    async (id: string): Promise<PublicUser | null> => {
      if (!id || !token) return null;
      try {
        const res = await axios.get<UserImageResponse>(`${API_BASE}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data;
        return {
          id: u.id,
          name: u.name,
          profilePicture: resolveImageUrl(u.profilePicture),
        };
      } catch {
        return { id, name: id, profilePicture: "/images/profile.webp" };
      }
    },
    [token]
  );

  // Fetch multiple friends by IDs
  const fetchFriends = useCallback(
    async (friendIds: string[]) => {
      if (!friendIds || friendIds.length === 0) {
        setFriends([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const friendsList: PublicUser[] = (
          await Promise.all(friendIds.map(fetchUserById))
        ).filter((u): u is PublicUser => u !== null);
        setFriends(friendsList);
      } catch (err) {
        setError("Failed to fetch friends.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserById]
  );

  // Fetch friends directly from a user object
  const fetchFriendsFromUser = useCallback(
    async (userData: { friends?: string[] }) => {
      if (!userData.friends || userData.friends.length === 0) {
        setFriends([]);
        return;
      }
      await fetchFriends(userData.friends);
    },
    [fetchFriends]
  );

  const goToProfile = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return {
    friends,
    loading,
    error,
    fetchFriends,
    fetchFriendsFromUser, // new helper for convenience
    goToProfile,
  };
};
