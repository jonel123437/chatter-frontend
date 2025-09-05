"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  TextField,
  Stack,
} from "@mui/material";
import { Post } from "@/app/profile/hooks/useFetchUserPosts";
import { PostModalContent } from "./PostModalContent";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface PostFormProps {
  createPost: (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ) => Promise<Post>;
  onPostCreated?: (newPost: Post) => void;
}

const API_BASE = "http://localhost:5000";

const PostForm: React.FC<PostFormProps> = ({ createPost, onPostCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visibility, setVisibility] =
    useState<"public" | "friends" | "only_me">("public");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    console.log("Raw user from localStorage:", raw);

    if (raw) {
      try {
        const parsed: StoredUser = JSON.parse(raw);
        console.log("Parsed user object:", parsed);

        const profileUrl = parsed.profilePicture
          ? parsed.profilePicture.startsWith("http")
            ? parsed.profilePicture
            : `${API_BASE}${
                parsed.profilePicture.startsWith("/") ? "" : "/"
              }${parsed.profilePicture}`
          : "/images/profile.webp";

        const fullUser = { ...parsed, profilePicture: profileUrl };

        console.log("Final user state:", fullUser);

        setUser(fullUser);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

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
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ cursor: "text" }}
        onClick={handleOpen}
      >
        <Avatar
          src={user?.profilePicture || "/images/profile.webp"}
          alt={user?.name || "User"}
          sx={{ width: 48, height: 48 }}
        />
        <TextField
          placeholder={`What's on your mind, ${user?.name || "User"}?`}
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
            username={user?.name || "User"}
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostForm;
