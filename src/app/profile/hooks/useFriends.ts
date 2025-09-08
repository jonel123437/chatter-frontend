"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserImageResponse } from "@/types/user.type";

interface PublicUser {
  id: string;
  name: string;
  profilePicture?: string;
}

const API_BASE = "http://localhost:5000";

export const useFriends = (token: string | null) => {
  const [friendsList, setFriendsList] = useState<PublicUser[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PublicUser[]>([]);
  const router = useRouter();

  const resolveImageUrl = (url?: string) =>
    url
      ? url.startsWith("http")
        ? url
        : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`
      : undefined;

  const fetchUserById = async (id: string): Promise<PublicUser | null> => {
    if (!id || !token) return null;
    try {
      const res = await axios.get<UserImageResponse>(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data;
      return {
        id: u.id,
        name: u.name,
        profilePicture: resolveImageUrl(u.profilePicture) || "/images/profile.webp",
      };
    } catch {
      return { id, name: id, profilePicture: "/images/profile.webp" };
    }
  };

  const fetchFriends = async (friendsIds: string[], pendingIds: string[]) => {
    const friends: PublicUser[] =
      friendsIds && friendsIds.length > 0
        ? (await Promise.all(friendsIds.map(fetchUserById))).filter(
            (u): u is PublicUser => u !== null
          )
        : [];

    const pending: PublicUser[] =
      pendingIds && pendingIds.length > 0
        ? (await Promise.all(pendingIds.map(fetchUserById))).filter(
            (u): u is PublicUser => u !== null
          )
        : [];

    setFriendsList(friends);
    setPendingUsers(pending);
  };

  const handleAcceptRequest = async (requesterId: string) => {
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE}/users/accept-request`,
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move user from pendingUsers to friendsList
      setPendingUsers((prev) => prev.filter((u) => u.id !== requesterId));
      const acceptedUser = await fetchUserById(requesterId);
      if (acceptedUser) {
        setFriendsList((prev) => [acceptedUser, ...prev]);
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE}/users/unfriend`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove user from friendsList immediately
      setFriendsList((prev) => prev.filter((u) => u.id !== friendId));
    } catch (err) {
      console.error("Failed to unfriend:", err);
    }
  };

  // ✅ New: navigate to a user's profile page
  const goToProfile = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return {
    friendsList,
    pendingUsers,
    fetchFriends,
    handleAcceptRequest,
    handleUnfriend,
    goToProfile, // expose navigation
  };
};
