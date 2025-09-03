import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginValidator, LoginFormType } from "@/validators/loginValidator";
import { loginUser } from "@/lib/api";

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

      // store the JWT token
      localStorage.setItem("token", response.access_token);

      // optionally, you can also store the user info if needed
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
