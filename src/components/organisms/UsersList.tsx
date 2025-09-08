"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  ListItemButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";

interface UsersListProps {
  users: User[];
}

export const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const router = useRouter();

  if (!users.length) return <Box>No users found.</Box>;

  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          disablePadding
          sx={{ borderRadius: 2, mb: 1 }}
        >
          <ListItemButton
            onClick={() => router.push(`/users/${user.id}`)}
            sx={{
              borderRadius: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={
                  user.profilePicture?.startsWith("http")
                    ? user.profilePicture
                    : `http://localhost:5000${user.profilePicture || ""}`
                }
                alt={user.name}
              />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
