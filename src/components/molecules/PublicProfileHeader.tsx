"use client";

import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import axios from "axios";

interface PublicUserResponse {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  createdAt: string;
  updatedAt: string;
}

interface PublicProfileHeaderProps {
  userId: string;
  token: string; // ✅ not nullable anymore
}

const API_BASE = "http://localhost:5000";

export const PublicProfileHeader: React.FC<PublicProfileHeaderProps> = ({
  userId,
  token,
}) => {
  const [user, setUser] = useState<PublicUserResponse | null>(null);

  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const fetchUserById = async () => {
    try {
      const res = await axios.get<PublicUserResponse>(
        `${API_BASE}/users/${userId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = res.data;
      setUser({
        ...data,
        profilePicture:
          resolveImageUrl(data.profilePicture) || "/images/profile.webp",
        coverPicture:
          resolveImageUrl(data.coverPicture) || "/images/cover.webp",
      });
    } catch {
      // silence error
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchUserById();
    }
  }, [userId, token]);

  if (!user) return null;

  return (
    <Box sx={{ mb: 4 }}>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 2,
        }}
      >
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 120, height: 120, border: "4px solid white", mb: 2 }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/images/profile.webp";
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};
