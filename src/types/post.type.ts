export interface Post {
  _id: string;
  content: string;
  visibility: "public" | "friends" | "only_me";
  authorId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostModalContentProps {
  username: string;
  modalContent: string;
  onModalContentChange: (val: string) => void;
  visibility: "public" | "friends" | "only_me";
  anchorEl: HTMLElement | null;
  onVisibilityClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVisibilitySelect: (value: "public" | "friends" | "only_me") => void;
  onVisibilityMenuClose?: () => void;
}

