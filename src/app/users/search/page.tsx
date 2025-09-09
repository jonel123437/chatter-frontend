"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Avatar } from "@mui/material";
import { useUserSearch } from "./hooks/useUserSearch";
import { Header } from "@/components/molecules/Header";
import { useCurrentUser } from "@/components/hooks/useCurrentUser";

const API_BASE = "http://localhost:5000";

const UserSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const { users, loading, error } = useUserSearch(query);
  const currentUser = useCurrentUser();

  const handleUserClick = (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      router.push("/profile");
    } else {
      router.push(`/users/${userId}`);
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Search results for: "{query}"
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && users.length === 0 && (
          <Typography>No users found for "{query}".</Typography>
        )}

        {!loading &&
          !error &&
          users.map((user) => {
            const profilePic =
              user.profilePicture?.startsWith("http")
                ? user.profilePicture
                : user.profilePicture
                ? `${API_BASE}${user.profilePicture}`
                : "/images/profile.webp";

            return (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
                onClick={() => handleUserClick(user.id)}
              >
                <Avatar
                  src={profilePic}
                  alt={user.name || "User"}
                  sx={{ width: 50, height: 50 }}
                />
                <Typography sx={{ fontWeight: 500 }}>{user.name || "Unknown"}</Typography>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default UserSearchPage;
