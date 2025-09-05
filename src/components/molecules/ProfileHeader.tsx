"use client";

import React, { useState } from "react";
import { Box, Avatar, Typography, Tabs, Tab } from "@mui/material";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
  onTabChange?: (tab: string) => void; // optional callback when tab changes
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatarUrl = "/images/profile.webp",
  coverUrl = "/images/cover.webp",
  onTabChange,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (onTabChange) {
      onTabChange(newValue === 0 ? "Posts" : "About");
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Cover photo */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundImage: `url(${coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          mb: -8,
        }}
      />

      {/* Avatar & user info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 2,
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {email}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        centered
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label="Posts" />
        <Tab label="About" />
      </Tabs>
    </Box>
  );
};
