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
  Paper,
  InputBase,
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
    } catch {
      console.error("Failed to fetch current user");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    router.push("/auth/login");
  };

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #4A90E2, #357ABD)", boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        {/* Left: Logo + Search */}
        {isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => router.push("/dashboard")}>
              C
            </Typography>
            <Collapse in={showMobileSearch} orientation="horizontal" sx={{ flexGrow: 1 }}>
              {showMobileSearch && <UserSearchBar isMobile onClose={() => setShowMobileSearch(false)} />}
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
                  "&:hover": { transform: "scale(1.1)", bgcolor: "grey.200" },
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => router.push("/dashboard")}>
              Chatter
            </Typography>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: 300,
                borderRadius: 20, // Fully rounded
                overflow: "hidden",
                boxShadow: 1,
                bgcolor: "background.paper",
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, py: 0.5 }}
                placeholder="Search users..."
                inputProps={{ "aria-label": "search users" }}
              />
              <IconButton type="submit" sx={{ p: 1 }}>
                <SearchIcon color="action" />
              </IconButton>
            </Paper>
          </Box>
        )}

        {/* Right: User Avatar + Menu */}
        <Box>
          <IconButton size="large" color="inherit" onClick={handleMenu} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={user?.profilePicture || "/images/profile.webp"} alt={user?.name || "User"} sx={{ width: 36, height: 36 }} />
            {!isMobile && <Typography sx={{ color: "white", fontWeight: 500 }}>{user?.name || "User"}</Typography>}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={() => { handleClose(); router.push("/profile"); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
