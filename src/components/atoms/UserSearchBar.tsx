"use client";

import React, { useState, FormEvent } from "react";
import { InputBase, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

interface UserSearchBarProps {
  initialQuery?: string;
  isMobile?: boolean;
  onClose?: () => void; // for mobile to hide after submit
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  initialQuery = "",
  isMobile = false,
  onClose,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/users/search?q=${encodeURIComponent(query.trim())}`);
      if (isMobile && onClose) onClose();
      setQuery("");
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
        width: isMobile ? "100%" : 300,
        height: 36,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={isMobile}
      />
      <IconButton
        type="submit"
        sx={{
          p: "6px",
          borderRadius: "50%",
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};
