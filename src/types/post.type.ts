export interface Post {
  _id: string;
  content: string;
  visibility: "public" | "friends" | "only_me";
  authorId: { _id: string; name: string; avatarUrl?: string } | string;
  createdAt: string;
  updatedAt: string;
}
