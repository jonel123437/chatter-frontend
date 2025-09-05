"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, TextField, Stack } from "@mui/material";
import { Post } from "@/app/profile/hooks/useFetchUserPosts";
import { PostModalContent } from "./PostModalContent";

interface PostFormProps {
  username?: string;
  profilePic?: string; // optional profile picture
  createPost: (content: string, visibility: "public" | "friends" | "only_me") => Promise<Post>;
  onPostCreated?: (newPost: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ username = "User", profilePic, createPost, onPostCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "friends" | "only_me">("public");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    if (!modalContent.trim()) return;
    setSubmitting(true);
    try {
      const newPost = await createPost(modalContent, visibility);
      if (onPostCreated) onPostCreated(newPost);
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Profile and input inline using Stack */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: "text" }} onClick={handleOpen}>
        <Avatar src={profilePic || "/images/profile.webp"} alt={username} sx={{ width: 48, height: 48 }} />
        <TextField
          placeholder="What's on your mind?"
          fullWidth
          InputProps={{ readOnly: true }}
          sx={{ cursor: "pointer" }}
        />
      </Stack>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <PostModalContent
            username={username}
            modalContent={modalContent}
            onModalContentChange={setModalContent}
            visibility={visibility}
            anchorEl={anchorEl}
            onVisibilityClick={(e) => setAnchorEl(e.currentTarget)}
            onVisibilitySelect={(val) => {
              setVisibility(val);
              setAnchorEl(null);
            }}
            onVisibilityMenuClose={() => setAnchorEl(null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostForm;
