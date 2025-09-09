"use client";

import { useEffect } from "react";

const GoogleRedirectPage = () => {
  useEffect(() => {
    console.log("useEffect triggered");

    if (typeof window === "undefined") {
      console.log("Running on server, exiting");
      return;
    }
    console.log("Running on client");

    const params = new URLSearchParams(window.location.search);
    console.log("URLSearchParams:", params.toString());

    const token = params.get("token");
    console.log("Token from URL:", token);

    if (token) {
      try {
        console.log("Storing token in localStorage...");
        localStorage.setItem("token", token);

        const storedToken = localStorage.getItem("token");
        console.log("Token successfully stored:", storedToken);

        console.log("Redirecting to /dashboard...");
        window.location.href = "/dashboard"; // full reload to ensure token persists
      } catch (err) {
        console.error("Failed to store token:", err);
        console.log("Redirecting to /auth/login...");
        window.location.href = "/auth/login";
      }
    } else {
      console.log("No token found, redirecting to login");
      window.location.href = "/auth/login";
    }
  }, []);

  return null;
};

export default GoogleRedirectPage;
