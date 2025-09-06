"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { Header } from "@/components/molecules/Header";
import { PublicProfileHeader } from "@/components/molecules/PublicProfileHeader";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import PostsList from "@/components/organisms/PostsList";

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id ?? "";

  const { posts, loading: postsLoading, error: postsError } =
    useFetchUserPosts(userId);

  const [token, setToken] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!userId) return null;
  if (!token) return null;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
        {/* Public Profile Header - no border radius */}
        <Box sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
          <PublicProfileHeader userId={userId} token={token} />
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            {postsLoading && <CircularProgress />}
            {postsError && <Typography color="error">{postsError}</Typography>}
            {!postsLoading && !postsError && <PostsList posts={posts} />}
          </Box>
        )}

        {tabValue === 1 && (
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body1">
              {/* Replace this with the user's "About" info */}
              About information goes here.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;
