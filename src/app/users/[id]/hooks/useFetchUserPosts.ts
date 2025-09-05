"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types/post.type";

export const useFetchUserPosts = (userId: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token"); // get the JWT token
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`http://localhost:5000/posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // attach token
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return { posts, loading, error };
};
