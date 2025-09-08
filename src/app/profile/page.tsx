"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../../components/molecules/Header";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { ProfileContent } from "@/components/organisms/ProfileContent";
import PostForm from "@/components/molecules/PostForm";
import PostsList from "@/components/organisms/PostsList";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useMyPosts } from "./hooks/useMyPosts";
import { useCreatePost } from "./hooks/useCreatePost";
import { useFriends } from "./hooks/useFriends";
import { useFileUpload } from "./hooks/useFileUpload";

export default function ProfilePage() {
  const { posts, setPosts, loading, error, fetchPosts } = useMyPosts();
  const { createPost } = useCreatePost({
    onPostCreated: (newPost) => setPosts((prev) => [newPost, ...prev]),
  });

  const [token, setToken] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const { user, fetchCurrentUser } = useCurrentUser(token);
  const { friendsList, pendingUsers, fetchFriends, handleAcceptRequest, handleUnfriend } =
    useFriends(token);

  const { uploadFile } = useFileUpload(token, fetchCurrentUser);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return setToken(null);
    setToken(storedToken);
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFriends(user.friends || [], user.friendRequests || []);
    }
  }, [user]);

  if (!token || !user) return null;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", pb: 5 }}>
      <Header />

      {/* Centered content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 1100, // ✅ keep it narrow like Facebook
          mx: "auto", // ✅ center horizontally
        }}
      >
        {/* Profile Header */}
        <Box sx={{ bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
          <ProfileHeader
            user={user}
            tabValue={tabValue}
            setTabValue={setTabValue}
            onFileUpload={uploadFile}
          />
        </Box>

        {/* Tab Content */}
        <Box>
          {tabValue === 0 && (
            <>
              {/* Post Form */}
              <Box sx={{ p: 2, boxShadow: 1, bgcolor: "background.paper", borderRadius: 2 }}>
                <PostForm createPost={createPost} onPostCreated={fetchPosts} />
              </Box>

              {/* My Posts */}
              <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
                <PostsList posts={posts} loading={loading} error={error} />
              </Box>
            </>
          )}

          {tabValue !== 0 && (
            <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1 }}>
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
        </Box>
      </Box>
    </Box>
  );
}
