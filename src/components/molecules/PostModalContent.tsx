"use client";

import React from "react";
import { Box, Typography, Menu, MenuItem, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { InputField } from "../atoms/InputField";

export interface PostModalContentProps {
  username: string;
  modalContent: string;
  onModalContentChange: (val: string) => void;
  visibility: "public" | "friends" | "only_me";
  anchorEl: HTMLElement | null;
  onVisibilityClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVisibilitySelect: (value: "public" | "friends" | "only_me") => void;
  onVisibilityMenuClose?: () => void;
}

export const PostModalContent: React.FC<PostModalContentProps> = ({
  username,
  modalContent,
  onModalContentChange,
  visibility,
  anchorEl,
  onVisibilityClick,
  onVisibilitySelect,
  onVisibilityMenuClose,
}) => {
  const visibilityLabel = {
    public: "Public",
    friends: "Friends",
    only_me: "Only Me",
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>{username}</Typography>

        <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />} onClick={onVisibilityClick}>
          {visibilityLabel[visibility]}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onVisibilityMenuClose || (() => onVisibilitySelect(visibility))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => { onVisibilitySelect("public"); onVisibilityMenuClose?.(); }}>Public</MenuItem>
          <MenuItem onClick={() => { onVisibilitySelect("friends"); onVisibilityMenuClose?.(); }}>Friends</MenuItem>
          <MenuItem onClick={() => { onVisibilitySelect("only_me"); onVisibilityMenuClose?.(); }}>Only Me</MenuItem>
        </Menu>
      </Box>

      <InputField
        label="What's on your mind?"
        value={modalContent}
        onChange={onModalContentChange}
        multiline
        minRows={4}
      />
    </Box>
  );
};
