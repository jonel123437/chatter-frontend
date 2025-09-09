import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/auth";

// Login function (same as before)
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    user: data.user,
  };
}

// Register function (updated)
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  const data = await res.json();

  // Registration returns only user, no access_token
  return {
    user: data,
  };
}
