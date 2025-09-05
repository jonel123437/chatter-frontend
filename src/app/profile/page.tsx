"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Paper } from "@mui/material";
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

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchPosts();
  }, [router]);

  if (!user) return null;

  return (
    <Box>
      <Header />

      <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        <ProfileHeader name={user.name} email={user.email} />

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <PostForm createPost={createPost} onPostCreated={() => fetchPosts()} />
        </Paper>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <PostsList posts={posts} loading={loading} error={error} />
        </Paper>
      </Box>
    </Box>
  );
}
