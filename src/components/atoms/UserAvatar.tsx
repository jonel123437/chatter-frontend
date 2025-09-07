import { Avatar } from "@mui/material";
import React from "react";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: number;
  fallbackSrc?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, size = 40, fallbackSrc }) => (
  <Avatar
    src={src}
    sx={{ width: size, height: size }}
    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (fallbackSrc) e.currentTarget.src = fallbackSrc;
    }}
  >
    {name[0]}
  </Avatar>
);
