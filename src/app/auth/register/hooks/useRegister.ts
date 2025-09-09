import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { RegisterPayload } from "@/types/auth";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (values: RegisterPayload) => {
    setLoading(true);
    setError("");
    try {
      // Call backend register endpoint
      const response = await registerUser(values);

      console.log("Registered user:", response.user);

      // Redirect to login page after successful registration
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
}
