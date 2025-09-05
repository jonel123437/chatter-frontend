"use client";

import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import PostForm from "@/components/molecules/PostForm";
import { Header } from "@/components/molecules/Header";
import PostsList from "@/components/organisms/PostsList";
import { useCreatePost } from "./hooks/useCreatePost";
import { useFetchPublicPosts } from "./hooks/useFetchPublicPosts";

export default function DashboardPage() {
  const { createPost, loading: creating, error: createError } = useCreatePost();
  const { posts, loading, error, fetchPosts } = useFetchPublicPosts();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostCreated = async () => {
    await fetchPosts(); // refresh public posts
  };

  if (!mounted) return null; // render only on client

  return (
    <>
      <Header />

      <Container maxWidth="sm" sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Post creation box */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: "#fff",
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

        {/* Posts list box */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <PostsList posts={posts} loading={loading} error={error} />
        </Box>
      </Container>
    </>
  );
}
