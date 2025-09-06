"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import type { UserImageResponse } from "../../types/user.type";

interface PublicUserResponse {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  createdAt: string;
  updatedAt: string;
  friends?: string[];
  friendRequests?: string[];
}

interface PublicProfileHeaderProps {
  userId: string;
  token: string;
}

const API_BASE = "http://localhost:5000";

export const PublicProfileHeader: React.FC<PublicProfileHeaderProps> = ({
  userId,
  token,
}) => {
  const [user, setUser] = useState<PublicUserResponse | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserImageResponse | null>(null);

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

  const fetchUserById = async () => {
    try {
      const res = await axios.get<PublicUserResponse>(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setUser({
        ...data,
        profilePicture: resolveImageUrl(data.profilePicture) || "/images/profile.webp",
        coverPicture: resolveImageUrl(data.coverPicture) || "/images/cover.webp",
      });

      if (currentUser) {
        const alreadyFriend = data.friends?.includes(currentUser.id);
        const requestSent = data.friendRequests?.includes(currentUser.id);
        setIsRequestSent(!!alreadyFriend || !!requestSent);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      const res = await axios.post<PublicUserResponse>(
        `${API_BASE}/users/send-request`,
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = res.data;
      setUser({
        ...updatedUser,
        profilePicture: resolveImageUrl(updatedUser.profilePicture) || "/images/profile.webp",
        coverPicture: resolveImageUrl(updatedUser.coverPicture) || "/images/cover.webp",
      });

      setIsRequestSent(true);
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  useEffect(() => {
    if (userId && token) fetchCurrentUser();
  }, [userId, token]);

  useEffect(() => {
    if (currentUser) fetchUserById();
  }, [currentUser, userId]);

  if (!user) return null;

  const isFriend = currentUser?.friends?.includes(user.id);

  return (
    <Box sx={{ mb: -2 }}>
      {/* Cover photo */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundImage: `url(${user.coverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          mb: -8,
        }}
      />

      {/* Avatar & user info */}
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 2 }}>
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 120, height: 120, border: "4px solid white", mb: 2 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/profile.webp"; }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {user.name}
        </Typography>

        {/* Show if already friend */}
        {isFriend && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            You are now friends
          </Typography>
        )}

        {/* Add Friend Button */}
        {!isFriend && (
          <Button
            variant="contained"
            size="small"
            color={isRequestSent ? "success" : "primary"}
            onClick={handleSendFriendRequest}
            disabled={isRequestSent}
            sx={{ mb: 2 }}
          >
            {isRequestSent ? "Request Sent" : "Add Friend"}
          </Button>
        )}

        <Divider sx={{ width: "100%", mb: 2, pt: 5 }} />

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
        </Tabs>
      </Box>
    </Box>
  );
};
