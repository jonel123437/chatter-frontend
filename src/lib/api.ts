export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: any; // adjust type if you have a User type
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json(); // will return { access_token, user }
}
