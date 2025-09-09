"use client";

import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface CoverPhotoProps {
  coverPicture?: string;
  onUpload: (file: File, type: "cover") => void;
  onClick: () => void;
}

export const CoverPhoto: React.FC<CoverPhotoProps> = ({ coverPicture, onUpload, onClick }) => {
  const handleChooseImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      if (e.target.files[0]) onUpload(e.target.files[0], "cover");
    };
    input.click();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 220, sm: 280 },
        backgroundColor: "white",
        backgroundImage: `url(${coverPicture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 2,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover .coverOverlay": { opacity: 1 },
      }}
      onClick={onClick}
    >
      <Box
        className="coverOverlay"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
          opacity: 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 10 }}>
        <Tooltip title="Edit cover photo">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleChooseImage();
            }}
          >
            <CameraAltIcon fontSize="small" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, display: { xs: "none", sm: "inline" } }}
            >
              Edit cover photo
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
