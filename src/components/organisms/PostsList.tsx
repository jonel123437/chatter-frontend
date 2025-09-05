"use client";

import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";

export interface Post {
  _id: string;
  content: string;
  visibility: "public" | "friends" | "only_me";
  authorId: { _id: string; name: string; avatarUrl?: string } | string;
  createdAt: string;
  updatedAt: string;
}

interface PostsListProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
}

const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case "public":
      return <PublicIcon fontSize="small" />;
    case "friends":
      return <PeopleIcon fontSize="small" />;
    case "only_me":
      return <LockIcon fontSize="small" />;
    default:
      return null;
  }
};

const timeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const PostsList: React.FC<PostsListProps> = ({ posts, loading, error }) => {
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!posts || posts.length === 0) return <Typography>No posts yet.</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {posts.map((post) => {
        const author =
          typeof post.authorId === "object" && post.authorId !== null
            ? {
                name: post.authorId.name,
                avatarUrl: post.authorId.avatarUrl || "/static/avatar.png",
              }
            : { name: "Unknown", avatarUrl: "/static/avatar.png" };

        return (
          <Box
            key={post._id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              backgroundColor: "#fff",
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar src={author.avatarUrl} alt={author.name} sx={{ mr: 2 }}>
                {author.name.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{author.name}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {timeAgo(post.createdAt)}
                  </Typography>
                  {getVisibilityIcon(post.visibility)}
                </Box>
              </Box>
            </Box>

            {/* Post content */}
            <Typography sx={{ wordBreak: "break-word" }}>{post.content}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default PostsList;
