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
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { UserSearchBar } from "../atoms/UserSearchBar";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const API_BASE = "http://localhost:5000";

export const Header: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      const profilePicture = data.profilePicture
        ? data.profilePicture.startsWith("http")
          ? data.profilePicture
          : `${API_BASE}${data.profilePicture}`
        : "/images/profile.webp";
      setUser({ ...data, profilePicture });
    } catch {}
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Mobile: C logo + slide-in search */}
        {isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/dashboard")}
            >
              C
            </Typography>

            <Collapse in={showMobileSearch} orientation="horizontal">
              {showMobileSearch && (
                <Box sx={{ flexGrow: 1 }}>
                  <UserSearchBar isMobile onClose={() => setShowMobileSearch(false)} />
                </Box>
              )}
            </Collapse>

            {!showMobileSearch && (
              <IconButton
                onClick={() => setShowMobileSearch(true)}
                sx={{
                  borderRadius: "50%",
                  bgcolor: "white",
                  color: "black",
                  p: 1,
                  boxShadow: 1,
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/dashboard")}
            >
              Chatter
            </Typography>
            <UserSearchBar />
          </>
        )}

        {/* User menu */}
        <IconButton
          size="large"
          color="inherit"
          onClick={handleMenu}
          aria-controls="menu-appbar"
          aria-haspopup="true"
        >
          <Avatar
            src={user?.profilePicture || "/images/profile.webp"}
            alt={user?.name || "User"}
            sx={{ width: 32, height: 32 }}
          />
          {!isMobile && <Typography sx={{ ml: 1 }}>{user?.name || "User"}</Typography>}
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
      </Toolbar>
    </AppBar>
  );
};
