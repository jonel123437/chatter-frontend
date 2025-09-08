"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number; // expiration time in seconds
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;

      if (expiresAt < Date.now()) {
        // already expired
        localStorage.removeItem("token");
        router.replace("/auth/login");
        return;
      }

      // set a timer to auto-logout when token expires
      const timeout = expiresAt - Date.now();
      const timer = setTimeout(() => {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      }, timeout);

      return () => clearTimeout(timer); // cleanup on unmount
    } catch (err) {
      // invalid token
      localStorage.removeItem("token");
      router.replace("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
};
