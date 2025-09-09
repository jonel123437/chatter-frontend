"use client";
import React, { useState } from "react";
import { InputField } from "@/components/atoms/InputField";
import { Button } from "@/components/atoms/Button";
import MUIButton from "@mui/material/Button";
import { Alert, Paper, Typography, Stack, Box, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);

    // Set a flag in localStorage to show success toast on login page
    localStorage.setItem("registerSuccess", "true");

    // Redirect immediately
    router.push("/auth/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #f5f7fa, #c3cfe2)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 5,
          borderRadius: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          mb={4}
          align="center"
          sx={{ fontWeight: 600, color: "#3f51b5" }}
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <InputField label="Name" type="text" value={name} onChange={setName} />
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <InputField label="Password" type="password" value={password} onChange={setPassword} />
            {error && <Alert severity="error" variant="filled">{error}</Alert>}

            <Button loading={loading} type="submit">
              Register
            </Button>

            <MUIButton
              variant="text"
              onClick={() => router.push("/auth/login")}
              fullWidth
              sx={{ color: "#3f51b5", textTransform: "none" }}
            >
              Back to Login
            </MUIButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
