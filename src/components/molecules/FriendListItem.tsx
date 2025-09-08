import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Button, Box } from "@mui/material";
import { UserAvatar } from "../atoms/UserAvatar";

interface FriendListItemProps {
  id: string;
  name: string;
  profilePicture?: string;
  onUnfriend?: (id: string) => void;
  onAccept?: (id: string) => void;
  isPending?: boolean;
  onClick?: () => void; // new: handle profile click
}

export const FriendListItem: React.FC<FriendListItemProps> = ({
  id,
  name,
  profilePicture,
  onUnfriend,
  onAccept,
  isPending = false,
  onClick,
}) => (
  <ListItem
    sx={{
      "&:hover": { backgroundColor: "action.hover", cursor: onClick ? "pointer" : "default" },
    }}
    secondaryAction={
      isPending ? (
        <Button variant="contained" size="small" color="primary" onClick={(e) => { e.stopPropagation(); onAccept?.(id); }}>
          Accept
        </Button>
      ) : (
        <Button variant="outlined" size="small" color="error" onClick={(e) => { e.stopPropagation(); onUnfriend?.(id); }}>
          Unfriend
        </Button>
      )
    }
    onClick={onClick} // click on the whole list item
  >
    <ListItemAvatar>
      <UserAvatar src={profilePicture} name={name} fallbackSrc="/images/profile.webp" />
    </ListItemAvatar>
    <ListItemText primary={name} />
  </ListItem>
);
