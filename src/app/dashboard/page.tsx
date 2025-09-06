"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
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
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", width: "100%" }}>
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
        }}
      >
        {/* Post Form */}
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <PostForm
            createPost={async (content, visibility) => {
              const newPost = await createPost(content, visibility);
              return newPost!;
            }}
            onPostCreated={handlePostCreated}
          />
          {creating && <p>Posting...</p>}
          {createError && <p style={{ color: "red" }}>{createError}</p>}
        </Box>

        {/* Posts List */}
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <PostsList posts={posts} loading={loading} error={error} />
        </Box>
      </Box>
    </Box>
  );
}
