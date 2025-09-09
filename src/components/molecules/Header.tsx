"use client";

import React, { useState } from "react";
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
import UserSearchBar from "../atoms/UserSearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const Header: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const user = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    router.push("/auth/login");
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(90deg, #4A90E2, #357ABD)", boxShadow: 3 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        {/* Left: Logo + Search */}
        {isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, position: "relative" }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => router.push("/dashboard")}
            >
              C
            </Typography>

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

            {showMobileSearch && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  bgcolor: "white",
                  zIndex: 999,
                  boxShadow: 3,
                  p: 2,
                }}
              >
                <UserSearchBar isMobile onClose={() => setShowMobileSearch(false)} />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => router.push("/dashboard")}
            >
              Chatter
            </Typography>

            <UserSearchBar />
          </Box>
        )}


        {/* Right: User Avatar + Menu */}
        <Box>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Avatar
              src={user?.profilePicture || "/images/profile.webp"}
              alt={user?.name || "User"}
              sx={{ width: 36, height: 36 }}
            />
            {!isMobile && (
              <Typography sx={{ color: "white", fontWeight: 500 }}>{user?.name || "User"}</Typography>
            )}
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
