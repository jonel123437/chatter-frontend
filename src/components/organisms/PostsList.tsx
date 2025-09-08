"use client";

import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";
import { Post } from "@/types/post.type";

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post, index) => {
        const author =
          typeof post.authorId === "object" && post.authorId !== null
            ? {
                name: post.authorId.name,
                avatarUrl: post.authorId.profilePicture
                  ? post.authorId.profilePicture.startsWith("http")
                    ? post.authorId.profilePicture
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${post.authorId.profilePicture}`
                  : "/static/avatar.png",
              }
            : { name: "Unknown", avatarUrl: "/static/avatar.png" };

        return (
          <Box
            key={`${post._id}-${index}`} // ✅ always unique
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              backgroundColor: "#fff",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar src={author.avatarUrl} alt={author.name} sx={{ mr: 2 }}>
                {author.name.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{author.name}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="caption">
                    {timeAgo(post.createdAt)}
                  </Typography>
                  {getVisibilityIcon(post.visibility)}
                </Box>
              </Box>
            </Box>

            {/* Post content */}
            <Typography sx={{ wordBreak: "break-word", mb: 1 }}>
              {post.content}
            </Typography>
          </Box>
        );
      })}

    </Box>
  );
};

export default PostsList;
