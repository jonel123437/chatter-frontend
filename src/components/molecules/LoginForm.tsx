"use client";
import React, { useState, useEffect } from "react";
import { InputField } from "@/components/atoms/InputField";
import { Button } from "@/components/atoms/Button";
import MUIButton from "@mui/material/Button";
import { Alert, Paper, Typography, Stack, Box, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Check if redirected from registration
    if (localStorage.getItem("registerSuccess")) {
      setShowSuccess(true);
      localStorage.removeItem("registerSuccess");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const redirectToRegister = () => {
    router.push("/auth/register");
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to backend Google OAuth endpoint
    window.location.href = "http://localhost:5000/auth/google";
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
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <InputField label="Password" type="password" value={password} onChange={setPassword} />
            {error && <Alert severity="error" variant="filled">{error}</Alert>}

            <Button loading={loading} type="submit">
              Login
            </Button>

            <MUIButton
              variant="text"
              onClick={redirectToRegister}
              fullWidth
              sx={{ color: "#3f51b5", textTransform: "none" }}
            >
              Register
            </MUIButton>
          </Stack>
        </form>

        {/* Google OAuth */}
        <MUIButton
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? "Redirecting..." : "Sign in with Google"}
        </MUIButton>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message="Registration successful! Please login."
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};
