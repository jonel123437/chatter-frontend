"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../../components/molecules/Header";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { ProfileContent } from "../../components/organisms/ProfileContent";
import PostForm from "@/components/molecules/PostForm";
import PostsList from "@/components/organisms/PostsList";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import { useCreatePost } from "./hooks/useCreatePost";

export default function ProfilePage() {
  const router = useRouter();
  const { posts, setPosts, loading, error, fetchPosts } = useFetchUserPosts();
  const { createPost } = useCreatePost({ onPostCreated: (newPost) => setPosts((prev) => [newPost, ...prev]) });
  const [token, setToken] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const { user, friendsList, pendingUsers, handleAcceptRequest, handleUnfriend, fetchCurrentUser } = useCurrentUser(token!);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);
    fetchPosts();
  }, [router]);

  const handleFileUpload = async (file: File, type: "profile" | "cover") => {
    if (!token) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const endpoint = type === "profile"
        ? "http://localhost:5000/users/upload-profile"
        : "http://localhost:5000/users/upload-cover";
      await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await fetchCurrentUser();
    } catch (err) {
      console.error(err);
    }
  };

  if (!token || !user) return null;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", pb: 5 }}>
      <Header />

      {/* Profile Header */}
      <Box sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
        <ProfileHeader
          user={user}
          tabValue={tabValue}
          setTabValue={setTabValue}
          onFileUpload={handleFileUpload}
        />
      </Box>

      {/* Tabs (About/Friends) */}
      {tabValue !== 0 && (
        <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, mt: 2 }}>
          <ProfileContent
            tabValue={tabValue}
            posts={posts}
            loading={loading}
            error={error}
            createPost={createPost}
            onPostsUpdated={fetchPosts}
            friendsList={friendsList}
            pendingUsers={pendingUsers}
            handleAcceptRequest={handleAcceptRequest}
            handleUnfriend={handleUnfriend}
          />
        </Box>
      )}

      {/* Post Form & Posts List */}
      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ p: 2, boxShadow: 1, bgcolor: "background.paper"}}>
            <PostForm createPost={createPost} onPostCreated={fetchPosts} />
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", boxShadow: 1 }}>
            <PostsList posts={posts} loading={loading} error={error} />
          </Box>
        </Box>
      )}
    </Box>

  );
}
