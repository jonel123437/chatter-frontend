"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Chatter Dashboard" }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Get user info from localStorage (or a global context)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserName(JSON.parse(storedUser).name);
    }
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
        <Typography variant="h6">{title}</Typography>
        <Box>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <AccountCircle />
            <Typography sx={{ ml: 1 }}>{userName}</Typography>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom", // move the anchor point to the bottom of the button
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top", // the top of the menu aligns with the bottom of the button
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
};
