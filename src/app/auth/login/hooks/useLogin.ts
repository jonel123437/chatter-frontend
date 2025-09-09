import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginValidator, LoginFormType } from "@/validators/loginValidator";
import { loginUser } from "@/lib/auth";
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
      const data = loginValidator.parse(values);
      const response = await loginUser(data);

      const token = response.access_token; // use access_token
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from server");
      }

      const decoded: JwtPayload = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired, please login again.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
