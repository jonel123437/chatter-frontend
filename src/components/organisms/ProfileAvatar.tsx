"use client";

import React from "react";
import { Box, Avatar, IconButton, Tooltip } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface ProfileAvatarProps {
  profilePicture?: string;
  name?: string;
  onUpload: (file: File, type: "profile") => void;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profilePicture, name, onUpload, onClick }) => {
  const handleChooseImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      if (e.target.files[0]) onUpload(e.target.files[0], "profile");
    };
    input.click();
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block", backgroundColor: "white", borderRadius: "50%" }}>
      <Avatar
        src={profilePicture}
        alt={name}
        sx={{ width: { xs: 140, sm: 160 }, height: { xs: 140, sm: 160 }, border: "5px solid white", cursor: "pointer" }}
        onClick={onClick}
      />
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
            handleChooseImage();
          }}
        >
          <CameraAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
