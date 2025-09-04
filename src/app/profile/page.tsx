"use client";

import React, { useState } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { useUserPosts } from "./hooks/useUserPosts";
import { Header } from "../../components/molecules/Header";
import PostForm from "../../components/molecules/PostForm";
import PostsList from "../../components/organisms/PostsList";

export default function ProfilePage() {
  const { posts, loading, error, createPost } = useUserPosts();
  const [refresh, setRefresh] = useState(false);

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4 }}>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <PostForm onPostCreated={() => setRefresh((prev) => !prev)} createPost={createPost} />
          <PostsList key={refresh ? "r1" : "r0"} posts={posts} loading={loading} error={error} />
        </Container>
      </Box>
    </Box>
  );
}
