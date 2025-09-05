"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Header } from "@/components/molecules/Header";
import { ProfileHeader } from "@/components/molecules/ProfileHeader";
import { useFetchUser } from "./hooks/useFetchUser";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import PostsList from "@/components/organisms/PostsList";

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;

  const { user, loading: userLoading, error: userError } = useFetchUser(userId);
  const { posts, loading: postsLoading, error: postsError } = useFetchUserPosts(userId);

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Profile Header */}
        {userLoading && <CircularProgress />}
        {userError && <Typography color="error">{userError}</Typography>}
        {user && <ProfileHeader name={user.name} email={user.email} />}

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
