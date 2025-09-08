"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PostForm from "@/components/molecules/PostForm";
import { Header } from "@/components/molecules/Header";
import PostsList from "@/components/organisms/PostsList";
import { useCreatePost } from "./hooks/useCreatePost";
import { useFetchPublicPosts } from "./hooks/useFetchPublicPosts";

export default function DashboardPage() {
  const { createPost, loading: creating, error: createError } = useCreatePost();
  const { posts, loading, error, fetchPosts } = useFetchPublicPosts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostCreated = async () => {
    await fetchPosts(); 
  };

  if (!mounted) return null;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", width: "100%", pb: 5 }}>
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          mt: 3,
        }}
      >
        {/* Post Form */}
        <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
          <PostForm
            createPost={async (content, visibility) => {
              const newPost = await createPost(content, visibility);
              return newPost!;
            }}
            onPostCreated={handlePostCreated}
          />
          {creating && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Posting...
            </Typography>
          )}
          {createError && (
            <Typography variant="body2" color="error" mt={1}>
              {createError}
            </Typography>
          )}
        </Box>

        {/* Posts List */}
        <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
          <PostsList posts={posts} loading={loading} error={error} />
        </Box>
      </Box>
    </Box>
  );
}
