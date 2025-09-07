"use client";

import React from "react";
import { Box, Avatar, Typography, Divider, Tabs, Tab } from "@mui/material";
import { UploadButton } from "../atoms/UploadButton";

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
  if (!user) return null;

  return (
    <Box>
      {/* Cover */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundImage: `url(${user.coverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mb: -8,
          position: "relative",
        }}
      >
        <UploadButton label="Change Cover" onFileSelected={(file) => onFileUpload(file, "cover")} />
      </Box>

      {/* Avatar & Name */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", mb: 2 }}>
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 120, height: 120, border: "4px solid white", mb: 2 }}
          imgProps={{
            onError: (e) => ((e.currentTarget as HTMLImageElement).src = "/images/profile.webp"),
          }}
        />
        <UploadButton label="Change Avatar" onFileSelected={(file) => onFileUpload(file, "profile")} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Divider sx={{ width: "100%", mb: 2, pt: 5 }} />

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
        </Tabs>
      </Box>
    </Box>
  );
};
