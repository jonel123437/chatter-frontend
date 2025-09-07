import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Button } from "@mui/material";
import { UserAvatar } from "../atoms/UserAvatar";

interface FriendListItemProps {
  id: string;
  name: string;
  profilePicture?: string;
  onUnfriend?: (id: string) => void;
  onAccept?: (id: string) => void;
  isPending?: boolean;
}

export const FriendListItem: React.FC<FriendListItemProps> = ({
  id,
  name,
  profilePicture,
  onUnfriend,
  onAccept,
  isPending = false,
}) => (
  <ListItem>
    <ListItemAvatar>
      <UserAvatar src={profilePicture} name={name} fallbackSrc="/images/profile.webp" />
    </ListItemAvatar>
    <ListItemText primary={name} />
    {isPending ? (
      <Button variant="contained" size="small" color="primary" onClick={() => onAccept?.(id)}>
        Accept
      </Button>
    ) : (
      <Button variant="outlined" size="small" color="error" onClick={() => onUnfriend?.(id)}>
        Unfriend
      </Button>
    )}
  </ListItem>
);
