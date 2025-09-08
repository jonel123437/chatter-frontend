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
  Button,
} from "@mui/material";
import { usePublicProfile } from "../../app/users/[id]/hooks/usePublicProfile";

interface PublicProfileHeaderProps {
  userId: string;
  token: string;
}

export const PublicProfileHeader: React.FC<PublicProfileHeaderProps> = ({
  userId,
  token,
}) => {
  const { user, currentUser, isRequestSent, handleSendFriendRequest } =
    usePublicProfile(userId, token);
  const [tabValue, setTabValue] = useState(0);

  // Modal state
  const [openImage, setOpenImage] = useState(false);
  const [selectedType, setSelectedType] = useState<"profile" | "cover" | null>(
    null
  );

  if (!user) return null;

  const isFriend = currentUser?.friends?.includes(user.id);

  return (
    <Box>
      {/* Cover */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 220, sm: 280 },
          backgroundImage: `url(${user.coverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          mb: -8,
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          "&:hover .coverOverlay": {
            opacity: 1,
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
            backgroundColor: "rgba(0,0,0,0.2)",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Avatar & Name */}
      <Box
        sx={{
          mt: -10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          mb: -0.1,
        }}
      >
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{
            width: { xs: 140, sm: 160 },
            height: { xs: 140, sm: 160 },
            border: "4px solid white",
            mb: 2,
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedType("profile");
            setOpenImage(true);
          }}
          imgProps={{
            onError: (e) =>
              ((e.currentTarget as HTMLImageElement).src =
                "/images/profile.webp"),
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {user.name}
        </Typography>

        {/* Friend status / button */}
        {isFriend && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            You are now friends
          </Typography>
        )}
        {!isFriend && (
          <Button
            variant={isRequestSent ? "outlined" : "contained"}
            color={isRequestSent ? "success" : "primary"}
            size="small"
            onClick={handleSendFriendRequest}
            disabled={isRequestSent}
            sx={{ mb: 2 }}
          >
            {isRequestSent ? "Request Sent" : "Add Friend"}
          </Button>
        )}

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

      {/* Image Viewer */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        TransitionProps={{
          onExited: () => setSelectedType(null),
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
