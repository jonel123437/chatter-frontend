"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface Post {
  _id: string;
  content: string;
  visibility: "public" | "friends" | "only_me";
  authorId: { _id: string; name: string; avatarUrl?: string } | string;
  createdAt: string;
  updatedAt: string;
}

export const useFetchPublicPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<Post[]>("http://localhost:5000/posts/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(
        res.data.map((post) => ({
          ...post,
          authorId:
            typeof post.authorId === "object"
              ? post.authorId
              : { _id: post.authorId, name: "Unknown", avatarUrl: "/static/avatar.png" },
        }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch public posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, fetchPosts };
};
