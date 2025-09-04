"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface Post {
  content: string;
  visibility: "public" | "friends" | "only_me"; // added
  createdAt: string;
  updatedAt: string;
}

export const useUserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.get<Post[]>("http://localhost:5000/posts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, visibility: "public" | "friends" | "only_me") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.post<Post>(
        "http://localhost:5000/posts",
        { content, visibility }, // ✅ include visibility
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) => [res.data, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post");
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, createPost };
};
