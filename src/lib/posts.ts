import { Post } from "@/types/post.type";

export async function createPost(content: string, visibility: Post["visibility"]): Promise<Post> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, visibility }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create post");
  }

  return res.json();
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch posts");
  }
  return res.json();
}
