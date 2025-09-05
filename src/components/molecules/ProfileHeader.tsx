"use client";

import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import axios from "axios";

interface UserImageResponse {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  coverPicture: string;
  createdAt: string;
  updatedAt: string;
  token: string; // JWT token for auth
}

interface ProfileHeaderProps {
  token: string; // JWT token for auth
}

const API_BASE = "http://localhost:5000"; // ✅ Adjust if backend runs elsewhere

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ token }) => {
  const [user, setUser] = useState<UserImageResponse | null>(null);

  // Ensure image URLs are absolute
  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url; // already absolute
    return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get<UserImageResponse>(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      // Normalize URLs
      setUser({
        ...data,
        profilePicture: resolveImageUrl(data.profilePicture) || "/images/profile.webp",
        coverPicture: resolveImageUrl(data.coverPicture) || "/images/cover.webp",
      });
    } catch {
      // silence error logs
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const handleFileUpload = async (file: File, type: "profile" | "cover") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        type === "profile"
          ? `${API_BASE}/users/upload-profile`
          : `${API_BASE}/users/upload-cover`;

      await axios.patch(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh user info after upload
      await fetchCurrentUser();
    } catch {
      // silence error logs
    }
  };

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
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{ position: "absolute", bottom: 10, right: 10, zIndex: 1 }}
          component="label"
        >
          Change Cover
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0], "cover")
            }
          />
        </Button>
      </Box>

      {/* Avatar & user info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 2,
          position: "relative",
        }}
      >
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 120, height: 120, border: "4px solid white", mb: 2 }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/images/profile.webp"; // fallback
          }}
        />

        <Button
          variant="contained"
          size="small"
          component="label"
          sx={{ mb: 1 }}
        >
          Change Avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0], "profile")
            }
          />
        </Button>

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
