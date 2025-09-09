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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Post } from "@/types/post.type";
import { PostModalContent } from "./PostModalContent";
import { useRouter } from "next/navigation";

interface PostFormProps {
  createPost: (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ) => Promise<Post>;
  onPostCreated?: (newPost: Post) => void;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const API_BASE = "http://localhost:5000";

const PostForm: React.FC<PostFormProps> = ({ createPost, onPostCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visibility, setVisibility] =
    useState<"public" | "friends" | "only_me">("public");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<ApiUser | null>(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get<ApiUser>(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileUrl = res.data.profilePicture
          ? res.data.profilePicture.startsWith("http")
            ? res.data.profilePicture
            : `${API_BASE}${
                res.data.profilePicture.startsWith("/") ? "" : "/"
              }${res.data.profilePicture}`
          : "/images/profile.webp";

        setUser({ ...res.data, profilePicture: profileUrl });
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setAnchorEl(null);
    setModalContent("");  
    setVisibility("public"); 
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

  // Redirect to current user's profile
  const handleAvatarClick = () => {
    router.push("/profile");
  };

  return (
    <>
      {/* Profile + Input */}
      <Stack
        direction="row"
        padding={1}
        spacing={2}
        alignItems="center"
        sx={{ cursor: "text" }}
        onClick={handleOpen}
      >
        <Avatar
          src={user?.profilePicture || "/images/profile.webp"}
          alt={user?.name || "User"}
          sx={{ width: 48, height: 48, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // prevent opening the modal
            handleAvatarClick();
          }}
        />
        <TextField
          placeholder={
            isXs
              ? "What's on your mind? ..."
              : `What's on your mind, ${user?.name || "User"}?`
          }
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
