import React from "react";
import { Box, Typography, List } from "@mui/material";
import { FriendListItem } from "../molecules/FriendListItem";

interface FriendsTabProps {
  friendsList: any[];
  pendingUsers: any[];
  handleAcceptRequest: (id: string) => void;
  handleUnfriend: (id: string) => void;
  goToProfile: (id: string) => void; // new
}

export const FriendsTab: React.FC<FriendsTabProps> = ({
  friendsList,
  pendingUsers,
  handleAcceptRequest,
  handleUnfriend,
  goToProfile,
}) => (
  <Box sx={{ mt: 3, width: "100%" }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Friends ({friendsList.length})
    </Typography>
    <List>
  {friendsList.map((friend, index) => (
    <FriendListItem
      key={friend.id ?? `friend-${index}`} // fallback to index if id is missing
      id={friend.id}
      name={friend.name}
      profilePicture={friend.profilePicture}
      onUnfriend={handleUnfriend}
      onClick={() => goToProfile(friend.id)}
    />
  ))}
</List>

<List>
  {pendingUsers.map((request, index) => (
    <FriendListItem
      key={request.id ?? `pending-${index}`} // fallback to index
      id={request.id}
      name={request.name}
      profilePicture={request.profilePicture}
      isPending
      onAccept={handleAcceptRequest}
      onClick={() => goToProfile(request.id)}
    />
  ))}
</List>

  </Box>
);
