"use client";

import React from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";
import { Post } from "../../app/profile/hooks/useUserPosts";

interface PostsListProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, error }) => {
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (posts.length === 0) return <Typography>No posts yet.</Typography>;

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <PublicIcon fontSize="small"/>;
      case "friends":
        return <PeopleIcon fontSize="small"/>;
      case "only_me":
        return <LockIcon fontSize="small"/>;
      default:
        return null;
    }
  };

  return (
    <Box>
      {posts.map((post, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography
              sx={{
                mb: 1,
                fontSize: "1.5rem",
                fontWeight: 500,
                backgroundColor: "#f0f0f0", // subtle highlight
                p: 1,
                borderRadius: 1,
                wordBreak: "break-word", // wrap long text
              }}
            >
              {post.content}
            </Typography>

            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
              {getVisibilityIcon(post.visibility)}
              <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                {post.visibility.replace("_", " ").toUpperCase()}
              </Typography>
            </Box>

            <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 0.5 }}>
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </CardContent>

        </Card>
      ))}
    </Box>

  );
};

export default PostsList;
