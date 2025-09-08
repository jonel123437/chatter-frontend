"use client";

import { useCallback } from "react";

const API_BASE = "http://localhost:5000";

export const useFileUpload = (token: string | null, refreshFn?: () => Promise<void>) => {
  const uploadFile = useCallback(
    async (file: File, type: "profile" | "cover") => {
      if (!token) return;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const endpoint =
          type === "profile"
            ? `${API_BASE}/users/upload-profile`
            : `${API_BASE}/users/upload-cover`;

        await fetch(endpoint, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (refreshFn) await refreshFn();
      } catch (err) {
        console.error("File upload error:", err);
      }
    },
    [token, refreshFn]
  );

  return { uploadFile };
};
