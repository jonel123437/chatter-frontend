"use client";

import React, { useState, FormEvent } from "react";
import { InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

interface UserSearchBarProps {
  initialQuery?: string;
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/users/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 300,
        height: "40px", // Match typical Toolbar height
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, height: "100%" }}
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
