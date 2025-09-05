"use client";

import { useState } from "react";
import axios from "axios";
import { Post } from "@/app/profile/hooks/useFetchUserPosts"; // reuse Post interface

interface UseCreatePostProps {
  onPostCreated?: (newPost: Post) => void;
}

export const useCreatePost = ({ onPostCreated }: UseCreatePostProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ): Promise<Post | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.post<Post>(
        "http://localhost:5000/posts",
        { content, visibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // trigger callback to update parent state immediately
      if (onPostCreated && res.data) {
        onPostCreated(res.data);
      }

      return res.data;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};
