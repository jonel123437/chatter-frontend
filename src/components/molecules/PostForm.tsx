import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import React, { useState } from "react";

interface PostFormProps {
  createPost: (content: string, visibility: "public" | "friends" | "only_me") => Promise<void>;
  onPostCreated?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ createPost, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "friends" | "only_me">("public");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    await createPost(content, visibility);
    setContent("");
    setVisibility("public");
    setSubmitting(false);
    if (onPostCreated) onPostCreated();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, mb: 4, flexDirection: "column" }}>
      <TextField
        label="What's on your mind?"
        variant="outlined"
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <FormControl fullWidth>
        <InputLabel>Visibility</InputLabel>
        <Select
          value={visibility}
          label="Visibility"
          onChange={(e) => setVisibility(e.target.value as any)}
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="friends">Friends</MenuItem>
          <MenuItem value="only_me">Only Me</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? "Posting..." : "Post"}
      </Button>
    </Box>
  );
};

export default PostForm;
