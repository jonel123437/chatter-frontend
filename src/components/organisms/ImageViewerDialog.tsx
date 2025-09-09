"use client";

import React from "react";
import { Dialog, Box } from "@mui/material";

interface ImageViewerDialogProps {
  open: boolean;
  imageSrc?: string;
  onClose: () => void;
  onExited?: () => void;
}

export const ImageViewerDialog: React.FC<ImageViewerDialogProps> = ({ open, imageSrc, onClose, onExited }) => (
  <Dialog open={open} onClose={onClose} TransitionProps={{ onExited }}>
    <Box sx={{ backgroundColor: "white", p: 2 }}>
      <img src={imageSrc} alt="Preview" style={{ maxWidth: "100%", maxHeight: "80vh" }} />
    </Box>
  </Dialog>
);
