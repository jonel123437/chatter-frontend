"use client";

import { useState } from "react";
import { Container } from "@mui/material";
import PostForm from "@/components/molecules/PostForm";
import { Header } from "@/components/molecules/Header";
import { useCreatePost } from "./hooks/useCreatePost";

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(false);
  const { createPost, loading, error } = useCreatePost();

  return (
    <>
      <Header />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <PostForm
          createPost={async (content: string) => {
            await createPost(content);
          }}
          onPostCreated={() => setRefresh((prev) => !prev)}
        />
        {/* You can show a notification or snackbar using `loading`/`error` if needed */}
      </Container>
    </>
  );
}
