"use client";
import React, { useState } from "react";
import { InputField } from "@/components/atoms/InputField";
import { Button } from "@/components/atoms/Button";
import { Alert, Paper, Typography } from "@mui/material";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 2 }}
    >
      <Typography variant="h5" mb={3} align="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputField label="Email" type="email" value={email} onChange={setEmail} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button loading={loading} type="submit">
          Login
        </Button>
      </form>
    </Paper>
  );
};
