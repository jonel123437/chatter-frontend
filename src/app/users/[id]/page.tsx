"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Header } from "@/components/molecules/Header";
import { PublicProfileHeader } from "@/components/molecules/PublicProfileHeader";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import PostsList from "@/components/organisms/PostsList";

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id ?? ""; // ✅ always string

  const { posts, loading: postsLoading, error: postsError } =
    useFetchUserPosts(userId);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!userId) return null; // ✅ early return if no ID
  if (!token) return null;

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Public Profile Header (for viewing another user by ID) */}
        <PublicProfileHeader userId={userId} token={token} />

        {/* User posts */}
        <Box>
          {postsLoading && <CircularProgress />}
          {postsError && <Typography color="error">{postsError}</Typography>}
          {!postsLoading && !postsError && <PostsList posts={posts} />}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
