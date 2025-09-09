import { Avatar } from "@mui/material";
import React from "react";

interface UserAvatarProps {
  src?: string;
  name?: string; // make optional to handle undefined
  size?: number;
  fallbackSrc?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = "?", // default to "?" if name is missing
  size = 40,
  fallbackSrc,
}) => (
  <Avatar
    src={src}
    sx={{ width: size, height: size }}
    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (fallbackSrc) e.currentTarget.src = fallbackSrc;
    }}
  >
    {name && name.length > 0 ? name[0] : "?"}
  </Avatar>
);
