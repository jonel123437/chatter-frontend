"use client";

import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";

interface UsersListProps {
  users: User[];
}

export const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const router = useRouter();

  if (!users.length) return <div>No users found.</div>;

  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          component="button"
          onClick={() => router.push(`/users/${user.id}`)}
        >
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
      ))}
    </List>
  );
};
