"use client";

import React from "react";
import { Box } from "@mui/material";
import { AboutTab } from "./AboutTab";
import { FriendsTab } from "./FriendsTab";
import { Post } from "../../types/post.type";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
  tabValue: number;
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ) => Promise<Post>;
  onPostsUpdated: () => void;
  friendsList?: any[];
  pendingUsers?: any[];
  handleAcceptRequest?: (id: string) => void;
  handleUnfriend?: (id: string) => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  tabValue,
  friendsList = [],
  pendingUsers = [],
  handleAcceptRequest,
  handleUnfriend,
}) => {
  const router = useRouter();

  const goToProfile = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {tabValue === 1 && <AboutTab />}

      {tabValue === 2 && (
        <FriendsTab
          friendsList={friendsList}
          pendingUsers={pendingUsers}
          handleAcceptRequest={handleAcceptRequest!}
          handleUnfriend={handleUnfriend!}
          goToProfile={goToProfile} // ✅ pass navigation function
        />
      )}
    </Box>
  );
};
