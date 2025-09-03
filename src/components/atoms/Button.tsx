"use client";
import React from "react";
import MUIButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  type?: "button" | "submit" | "reset"; // ✅ add type
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, loading, type = "button" }) => (
  <MUIButton
    variant="contained"
    color="primary"
    fullWidth
    onClick={onClick}
    disabled={loading}
    type={type} // ✅ pass type
    style={{ marginTop: 16 }}
  >
    {loading ? <CircularProgress size={24} color="inherit" /> : children}
  </MUIButton>
);
