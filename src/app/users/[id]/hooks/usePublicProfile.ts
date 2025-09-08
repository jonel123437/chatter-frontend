import { useState, useEffect } from "react";
import axios from "axios";
import { useFetchUser, UserWithFriends } from "./useFetchUser";
import type { UserImageResponse } from "@/types/user.type";

const API_BASE = "http://localhost:5000";

export const usePublicProfile = (userId: string, token: string) => {
  const { user, setUser, loading, error } = useFetchUser(userId, token);
  const [currentUser, setCurrentUser] = useState<UserImageResponse | null>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const resolveImageUrl = (url?: string) =>
    url ? (url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`) : undefined;

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get<UserImageResponse>(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!userId) return;
    try {
      const res = await axios.post<UserWithFriends>(
        `${API_BASE}/users/send-request`,
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) =>
        prev
          ? {
              ...prev,
              friends: res.data.friends ?? prev.friends,
              friendRequests: res.data.friendRequests ?? prev.friendRequests,
            }
          : prev
      );

      setIsRequestSent(true);
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  useEffect(() => {
    if (token) fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (currentUser && user) {
      const alreadyFriend = user.friends?.includes(currentUser.id);
      const requestSent = user.friendRequests?.includes(currentUser.id);
      setIsRequestSent(!!alreadyFriend || !!requestSent);
    }
  }, [currentUser, user]);

  return { user, currentUser, isRequestSent, handleSendFriendRequest, loading, error };
};
