import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginValidator, LoginFormType } from "@/validators/loginValidator";
import { loginUser } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (values: LoginFormType) => {
    setLoading(true);
    setError("");
    try {
      const data = loginValidator.parse(values); // validate inputs
      const response = await loginUser(data);

      const token = response.access_token;
      const decoded: JwtPayload = jwtDecode(token);

      // check if token already expired
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired, please login again.");
      }

      // store the JWT token
      localStorage.setItem("token", token);

      // optionally, also store the user info
      localStorage.setItem("user", JSON.stringify(response.user));

      router.push("/dashboard"); // redirect after login
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
