import { LoginResponse } from "@/types/user.type";

export async function loginUser(data: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}
