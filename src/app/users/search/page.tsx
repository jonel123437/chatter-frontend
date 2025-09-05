"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { User } from "@/types/user.type";
import { UsersList } from "@/components/organisms/UsersList";
import { Header } from "@/components/molecules/Header";

const UserSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:5000/users/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <Box>
      <Header />
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Search results for: "{query}"
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && <UsersList users={users} />}
      </Box>
    </Box>
  );
};

export default UserSearchPage;
