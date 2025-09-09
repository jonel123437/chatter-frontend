"use client";

import React, { useState } from "react";
import { Box, Typography, Divider, Menu, MenuItem } from "@mui/material";
import { CoverPhoto } from "./CoverPhoto";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileTabs } from "./ProfileTabs";
import { ImageViewerDialog } from "./ImageViewerDialog";

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

  const handleOpenProfileMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSelectedType("profile");
  };

  const handleCloseMenu = () => setAnchorEl(null);

  // ✅ open native file picker
  const chooseImage = (type: "profile" | "cover") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      if (e.target.files[0]) onFileUpload(e.target.files[0], type);
    };
    input.click();
  };

  return (
    <Box>
      {/* Cover */}
      <CoverPhoto
        coverPicture={user.coverPicture}
        onUpload={onFileUpload}
        onClick={() => {
          setSelectedType("cover");
          setOpenImage(true);
        }}
      />

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
        <ProfileAvatar
          profilePicture={user.profilePicture}
          name={user.name}
          onUpload={onFileUpload}
          onClick={handleOpenProfileMenu}
        />

        <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
          {user.name}
        </Typography>
        <Divider sx={{ width: "100%", mb: 2, pt: 5 }} />

        <ProfileTabs value={tabValue} onChange={setTabValue} />
      </Box>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{ autoFocusItem: false }}
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
            chooseImage("profile"); // ✅ properly triggers file picker
            handleCloseMenu();
          }}
        >
          Upload new picture
        </MenuItem>
      </Menu>

      {/* Image Viewer */}
      <ImageViewerDialog
        open={openImage}
        imageSrc={
          selectedType === "profile"
            ? user.profilePicture
            : user.coverPicture
        }
        onClose={() => setOpenImage(false)}
        onExited={() => setSelectedType(null)}
      />
    </Box>
  );
};
