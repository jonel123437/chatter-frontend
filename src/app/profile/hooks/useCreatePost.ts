"use client";

import axios from "axios";
import { Post } from "./useFetchUserPosts";

interface UseCreatePostProps {
  onPostCreated?: (newPost: Post) => void;
}

export const useCreatePost = ({ onPostCreated }: UseCreatePostProps = {}) => {
  const createPost = async (
    content: string,
    visibility: "public" | "friends" | "only_me"
  ): Promise<Post> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await axios.post<Post>(
      "http://localhost:5000/posts",
      { content, visibility },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data) throw new Error("Failed to create post");

    if (onPostCreated) onPostCreated(res.data);

    return res.data;
  };

  return { createPost };
};
