"use client";

import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useCurrentUser } from "../../app/profile/hooks/useCurrentUser";

interface ProfileHeaderProps {
  token: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ token }) => {
  const { user, friendsList, pendingUsers, handleAcceptRequest, handleUnfriend, fetchCurrentUser } = useCurrentUser(token);
  const [tabValue, setTabValue] = useState(0);

  const handleFileUpload = async (file: File, type: "profile" | "cover") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        type === "profile"
          ? "http://localhost:5000/users/upload-profile"
          : "http://localhost:5000/users/upload-cover";

      await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      await fetchCurrentUser();
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ mb: -2 }}>
      {/* Cover photo */}
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
        <Button
          variant="contained"
          size="small"
          sx={{ position: "absolute", bottom: 10, right: 10, zIndex: 1 }}
          component="label"
        >
          Change Cover
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0], "cover")
            }
          />
        </Button>
      </Box>

      {/* Avatar & user info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 2,
          position: "relative",
        }}
      >
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 120, height: 120, border: "4px solid white", mb: 2 }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/images/profile.webp";
          }}
        />

        <Button
          variant="contained"
          size="small"
          component="label"
          sx={{ mb: 1 }}
        >
          Change Avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0], "profile")
            }
          />
        </Button>

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>

        <Divider sx={{ width: "100%", mb: 2, pt: 5 }} />

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
        </Tabs>

        {/* Friends Tab */}
        {tabValue === 2 && (
          <Box sx={{ mt: 3, width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Friends ({friendsList.length})
            </Typography>
            <List>
              {friendsList.map((friend) => (
                <ListItem key={friend.id}>
                  <ListItemAvatar>
                    <Avatar src={friend.profilePicture}>{friend.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} />
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleUnfriend(friend.id)}
                  >
                    Unfriend
                  </Button>
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Pending Requests ({pendingUsers.length})
            </Typography>
            <List>
              {pendingUsers.map((request) => (
                <ListItem key={request.id}>
                  <ListItemAvatar>
                    <Avatar src={request.profilePicture}>{request.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={request.name} />
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};
