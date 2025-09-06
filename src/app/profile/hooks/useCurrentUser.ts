import { useState, useEffect } from "react";
import axios from "axios";

interface UserImageResponse {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  coverPicture: string;
  createdAt: string;
  updatedAt: string;
  friends: string[];
  friendRequests: string[];
  token?: string;
}

interface PublicUser {
  id: string;
  name: string;
  profilePicture?: string;
}

const API_BASE = "http://localhost:5000";

export const useCurrentUser = (token: string) => {
  const [user, setUser] = useState<UserImageResponse & { friendsList?: PublicUser[] } | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PublicUser[]>([]);
  const [friendsList, setFriendsList] = useState<PublicUser[]>([]);

  const resolveImageUrl = (url?: string) =>
    url ? (url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`) : undefined;

  // Fetch user object by ID
  const fetchUserById = async (id: string): Promise<PublicUser | null> => {
    if (!id) return null;
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

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get<UserImageResponse>(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      // Pending friend requests
      const pending: PublicUser[] = data.friendRequests && data.friendRequests.length > 0
        ? (await Promise.all(data.friendRequests.map(fetchUserById))).filter((u): u is PublicUser => u !== null)
        : [];

      // Friends list
      const friends: PublicUser[] = data.friends && data.friends.length > 0
        ? (await Promise.all(data.friends.map(fetchUserById))).filter((u): u is PublicUser => u !== null)
        : [];

      setUser({
        ...data,
        profilePicture: resolveImageUrl(data.profilePicture) || "/images/profile.webp",
        coverPicture: resolveImageUrl(data.coverPicture) || "/images/cover.webp",
        friendsList: friends,
      });

      setFriendsList(friends);
      setPendingUsers(pending);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await axios.post(
        `${API_BASE}/users/accept-request`,
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCurrentUser();
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    try {
      await axios.post(
        `${API_BASE}/users/unfriend`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCurrentUser();
    } catch (err) {
      console.error("Failed to unfriend:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  return { user, friendsList, pendingUsers, fetchCurrentUser, handleAcceptRequest, handleUnfriend };
};
