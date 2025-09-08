"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Post } from "@/types/post.type";


export const useFetchPublicPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!; // ✅ comes from .env

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<Post[]>(`${API_BASE_URL}/posts/public`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(
        res.data.map((post) => ({
          ...post,
          authorId:
            typeof post.authorId === "object"
              ? post.authorId
              : {
                  _id: post.authorId,
                  name: "Unknown",
                  profilePicture: "/static/avatar.png",
                },
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
