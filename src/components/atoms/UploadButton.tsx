import { Button } from "@mui/material";
import React from "react";

interface UploadButtonProps {
  label: string;
  onFileSelected: (file: File) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ label, onFileSelected }) => (
  <Button variant="contained" size="small" component="label">
    {label}
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
    />
  </Button>
);
