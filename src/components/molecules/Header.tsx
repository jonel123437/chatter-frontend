"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { UserSearchBar } from "../atoms/UserSearchBar";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
}

const API_BASE = "http://localhost:5000"; // ✅ adjust if backend URL changes

export const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await axios.get<User>(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      // Normalize profile picture URL
      const profilePicture = data.profilePicture
        ? data.profilePicture.startsWith("http")
          ? data.profilePicture
          : `${API_BASE}${data.profilePicture}`
        : "/images/profile.webp";

      setUser({ ...data, profilePicture });
    } catch (err) {
      // fail silently or add error handling UI if needed
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          Chatter
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Reusable Search Component */}
          <UserSearchBar />

          {/* User menu */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            aria-controls="menu-appbar"
            aria-haspopup="true"
            sx={{ ml: 2 }}
          >
            <Avatar
              src={user?.profilePicture || "/images/profile.webp"}
              alt={user?.name || "User"}
              sx={{ width: 32, height: 32, mr: 1 }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = "/images/profile.webp"; // fallback
              }}
            />
            <Typography>{user?.name || "User"}</Typography>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                router.push("/profile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
