export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserImageResponse {
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

