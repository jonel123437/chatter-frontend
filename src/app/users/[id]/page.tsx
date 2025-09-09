"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Header } from "@/components/molecules/Header";
import { PublicProfileHeader } from "@/components/molecules/PublicProfileHeader";
import PostsList from "@/components/organisms/PostsList";
import { User } from "@/types/user.type";
import { PublicFriendsTab } from "@/components/organisms/PublicFriendsTab";
import { useFetchUserFriends } from "./hooks/useFetchUserFriends";
import { useFetchUserPosts } from "./hooks/useFetchUserPosts";
import axios from "axios";

const API_BASE = "http://localhost:5000";

// Define API response type
interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  createdAt: string;
  updatedAt: string;
  friends: string[];
  friendRequests: string[];
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const userId = Array.isArray(id) ? id[0] : id ?? "";

  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState<UserApiResponse | null>(null);

  const { friends, loading: friendsLoading, error: friendsError, fetchFriends } = useFetchUserFriends(token);
  const { posts, loading: postsLoading, error: postsError } = useFetchUserPosts(userId);

  // Load token and current user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  // Fetch user info including friend IDs
  useEffect(() => {
    if (!token || !userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get<UserApiResponse>(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data);

        // Fetch full friend objects with profile images
        if (res.data.friends?.length) {
          await fetchFriends(res.data.friends);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUser();
  }, [userId, token, fetchFriends]);

  const handleFriendClick = (friendId: string) => {
    if (currentUser && friendId === currentUser.id) {
      router.push("/profile");
    } else {
      router.push(`/users/${friendId}`);
    }
  };

  if (!userId || !token || !userData) return <CircularProgress />;

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", pb: 5 }}>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: 1100, mx: "auto" }}>
        {/* Public Profile Header */}
        <Box sx={{ bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
          <PublicProfileHeader
            userId={userId}
            token={token}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: -1 }}>
          {tabValue === 0 && (
            <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
              <PostsList
                posts={posts}
                currentUser={currentUser}
                loading={postsLoading}
                error={postsError}
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
              <Typography>About information goes here.</Typography>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1, borderRadius: 2 }}>
              {friendsLoading && <CircularProgress />}
              {friendsError && <Typography color="error">{friendsError}</Typography>}
              {!friendsLoading && !friendsError && (
                <PublicFriendsTab friendsList={friends} goToProfile={handleFriendClick} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
