"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

interface PublicFriendsTabProps {
  friendsList: { id: string; name: string; profilePicture?: string }[];
  goToProfile: (id: string) => void;
}

export const PublicFriendsTab: React.FC<PublicFriendsTabProps> = ({
  friendsList,
  goToProfile,
}) => {
  if (!friendsList || friendsList.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography>No friends to show.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Friends ({friendsList.length})
      </Typography>
      <List>
        {friendsList.map((friend) => (
          <ListItem
            key={friend.id}
            sx={{
              "&:hover": { backgroundColor: "action.hover", cursor: "pointer" },
            }}
            onClick={() => goToProfile(friend.id)}
          >
            <ListItemAvatar>
              <Avatar
                src={friend.profilePicture || "/static/avatar.png"}
                alt={friend.name}
              />
            </ListItemAvatar>
            <ListItemText primary={friend.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
