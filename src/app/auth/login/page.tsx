"use client";
import { useLogin } from "./hook";
import { LoginForm } from "@/components/molecules/LoginForm";

export default function LoginPage() {
  const { handleLogin, loading, error } = useLogin();

  return <LoginForm onSubmit={(email, password) => handleLogin({ email, password })} loading={loading} error={error} />;
}
