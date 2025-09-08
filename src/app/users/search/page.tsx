"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useUserSearch } from "./hooks/useUserSearch";
import { UsersList } from "@/components/organisms/UsersList";
import { Header } from "@/components/molecules/Header";

const UserSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { users, loading, error } = useUserSearch(query);

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Search results for: "{query}"
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && <UsersList users={users} />}
      </Box>
    </Box>
  );
};

export default UserSearchPage;
