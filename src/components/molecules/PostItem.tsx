// src/components/molecules/PostItem.tsx
import { Card, CardContent, Typography } from '@mui/material';
import PostTimestamp from '../atoms/PostTimestamp';

export default function PostItem({ post }: { post: any }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <PostTimestamp date={post.createdAt} />
      </CardContent>
    </Card>
  );
}
