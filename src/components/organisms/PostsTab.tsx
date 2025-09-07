"use client";

import React from "react";
import { Box } from "@mui/material";
import PostForm from "../molecules/PostForm";
import PostsList, { Post } from "./PostsList";

interface PostsTabProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ) => Promise<Post>;
  onPostsUpdated: () => void; // callback to refresh posts after creation
}

export const PostsTab: React.FC<PostsTabProps> = ({
  posts,
  loading,
  error,
  createPost,
  onPostsUpdated,
}) => {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      
      {/* Post Form Section */}
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1, border: "1px solid #ccc" }}>
        <PostForm createPost={createPost} onPostCreated={onPostsUpdated} />
      </Box>

      {/* Posts List Section */}
      <Box sx={{ mt: 2 }}>
        <PostsList posts={posts} loading={loading} error={error} />
      </Box>
      
    </Box>
  );
};
