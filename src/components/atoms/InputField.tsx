"use client";
import React from "react";
import TextField from "@mui/material/TextField";

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange }) => (
  <TextField
    label={label}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    margin="normal"
  />
);
