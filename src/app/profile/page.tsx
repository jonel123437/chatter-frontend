"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../../components/molecules/Header";
import PostForm from "../../components/molecules/PostForm";
import PostsList from "../../components/organisms/PostsList";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import { useCreatePost } from "./hooks/useCreatePost";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "../../components/molecules/ProfileHeader";

export default function ProfilePage() {
  const router = useRouter();
  const { posts, setPosts, loading, error, fetchPosts } = useFetchUserPosts();
  const { createPost } = useCreatePost({
    onPostCreated: (newPost) => setPosts((prev) => [newPost, ...prev]),
  });

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);

    fetchPosts();
  }, [router]);

  if (!token) return null;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
        {/* Profile Header - no border radius */}
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <ProfileHeader token={token} />
        </Box>

        {/* Post Form - with padding and rounded corners */}
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <PostForm createPost={createPost} onPostCreated={() => fetchPosts()} />
        </Box>

        {/* Posts List - with padding and rounded corners */}
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
