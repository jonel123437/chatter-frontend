// src/types/auth.ts

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    coverPicture?: string;
    createdAt: string;
    updatedAt: string;
    friends: string[];
    friendRequests: string[];
  };
}
