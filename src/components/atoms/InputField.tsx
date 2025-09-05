"use client";
import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface InputFieldProps extends Omit<TextFieldProps, "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  ...props
}) => (
  <TextField
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    margin="normal"
    {...props} // spread extra props like multiline, minRows, type, etc.
  />
);
