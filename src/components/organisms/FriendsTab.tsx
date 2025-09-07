import React from "react";
import { Box, Typography, List } from "@mui/material";
import { FriendListItem } from "../molecules/FriendListItem";

interface FriendsTabProps {
  friendsList: any[];
  pendingUsers: any[];
  handleAcceptRequest: (id: string) => void;
  handleUnfriend: (id: string) => void;
}

export const FriendsTab: React.FC<FriendsTabProps> = ({
  friendsList,
  pendingUsers,
  handleAcceptRequest,
  handleUnfriend,
}) => (
  <Box sx={{ mt: 3, width: "100%" }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Friends ({friendsList.length})
    </Typography>
    <List>
      {friendsList.map((friend) => (
        <FriendListItem
          key={friend.id}
          id={friend.id}
          name={friend.name}
          profilePicture={friend.profilePicture}
          onUnfriend={handleUnfriend}
        />
      ))}
    </List>

    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
      Pending Requests ({pendingUsers.length})
    </Typography>
    <List>
      {pendingUsers.map((request) => (
        <FriendListItem
          key={request.id}
          id={request.id}
          name={request.name}
          profilePicture={request.profilePicture}
          isPending
          onAccept={handleAcceptRequest}
        />
      ))}
    </List>
  </Box>
);
