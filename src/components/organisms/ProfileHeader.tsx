"use client";

import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Tabs,
  Tab,
  Dialog,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface ProfileHeaderProps {
  user: any;
  tabValue: number;
  setTabValue: (value: number) => void;
  onFileUpload: (file: File, type: "profile" | "cover") => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  tabValue,
  setTabValue,
  onFileUpload,
}) => {
  const [selectedType, setSelectedType] = useState<"profile" | "cover" | null>(
    null
  );
  const [openImage, setOpenImage] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const handleChooseImage = (type: "profile" | "cover") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      if (e.target.files[0]) {
        onFileUpload(e.target.files[0], type);
      }
    };
    input.click();
  };

  const handleOpenProfileMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSelectedType("profile");
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Cover */}
      <Box
        sx={{
          width: "100%",
          height: {xs: 220, sm: 280 },
          backgroundImage: `url(${user.coverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          "&:hover .coverOverlay": {
            opacity: 1, // show overlay on hover
          },
        }}
        onClick={() => {
          setSelectedType("cover");
          setOpenImage(true);
        }}
      >
        {/* Hover overlay */}
        <Box
          className="coverOverlay"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.2)", // subtle dark highlight
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: "none", // so clicks still go through
          }}
        />

        {/* Camera Icon Button (bottom right of cover) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <Tooltip title="Edit cover photo">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleChooseImage("cover");
              }}
            >
              <CameraAltIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  display: { xs: "none", sm: "inline" },
                }}
              >
                Edit cover photo
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>


      {/* Avatar + Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          mt: -10,
          mb: -0.1,
          zIndex: 5,
        }}
      >
        {/* Avatar wrapper (relative so we can place camera icon inside) */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={user.profilePicture}
            alt={user.name}
            sx={{
              width: { xs: 140, sm: 160 },
              height: { xs: 140, sm: 160 },
              border: "5px solid white",
              cursor: "pointer",
            }}
            onClick={handleOpenProfileMenu} // ✅ open menu on avatar click
          />

          {/* Small camera icon at bottom-left of avatar */}
          <Tooltip title="Change profile picture">
            <IconButton
              size="medium"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 10,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleChooseImage("profile"); // ✅ directly upload
              }}
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
          {user.name}
        </Typography>
        <Divider sx={{ width: "100%", mb: 2, pt: 5 }} />

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
        </Tabs>
      </Box>

      {/* Profile Menu (avatar click) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          autoFocusItem: false, // ✅ prevent auto-highlighting first item
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenImage(true);
            handleCloseMenu();
          }}
        >
          See picture
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleChooseImage("profile");
            handleCloseMenu();
          }}
        >
          Upload new picture
        </MenuItem>
      </Menu>


      {/* Image Viewer */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        TransitionProps={{
          onExited: () => setSelectedType(null), // ✅ only clear after fade-out
        }}
      >
        <img
          src={
            selectedType === "profile"
              ? user.profilePicture
              : user.coverPicture
          }
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "80vh" }}
        />
      </Dialog>

    </Box>
  );
};
