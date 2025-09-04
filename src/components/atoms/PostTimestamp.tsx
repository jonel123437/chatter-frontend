// src/components/atoms/PostTimestamp.tsx
import { Typography } from '@mui/material';

export default function PostTimestamp({ date }: { date: string }) {
  return (
    <Typography variant="caption" color="text.secondary">
      {new Date(date).toLocaleString()}
    </Typography>
  );
}
