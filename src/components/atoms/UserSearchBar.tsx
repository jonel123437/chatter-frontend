"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { User } from "@/types/user.type";
import { useCurrentUser } from "../hooks/useCurrentUser"; // ✅ import current user hook

const API_BASE = "http://localhost:5000";

interface UserSearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function UserSearchBar({ isMobile = false, onClose }: UserSearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const currentUser = useCurrentUser(); // ✅ get current user

  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch users only while typing
  useEffect(() => {
    if (!searchInput || !isTyping) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(searchInput)}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setResults(data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchInput, isTyping]);

  // Navigate on submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/users/search?q=${encodeURIComponent(searchInput)}`);
    setShowDropdown(false);
    setIsTyping(false);
    if (isMobile && onClose) onClose();
  };

  // Handle click on a user
  const handleUserClick = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      router.push("/profile"); // ✅ redirect to own profile
    } else {
      router.push(`/users/${user.id}`);
    }
    setShowDropdown(false);
    setIsTyping(false);
    if (isMobile && onClose) onClose();
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: isMobile ? "100%" : 300 }}>
      {isMobile && onClose && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Search input */}
      <Paper
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: 1,
          bgcolor: "background.paper",
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1, py: 0.5 }}
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setIsTyping(true);
          }}
        />
        <IconButton type="submit" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Dropdown results */}
      {showDropdown && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 0.5,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 999,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {loading && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!loading && results.length === 0 && (
            <Typography sx={{ p: 2 }}>No users found for "{searchInput}"</Typography>
          )}

          {!loading &&
            results.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  gap: 2,
                  p: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
                onClick={() => handleUserClick(user)} // ✅ use handler
              >
                <Avatar
                  src={user.profilePicture?.startsWith('http')
                      ? user.profilePicture
                      : `${API_BASE}${user.profilePicture}` || "/images/profile.webp"}
                  alt={user.name || "User"}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography>{user.name || "Unknown"}</Typography>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
}
