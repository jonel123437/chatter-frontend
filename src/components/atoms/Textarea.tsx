// src/components/atoms/Textarea.tsx
import { TextField } from '@mui/material';

interface TextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function Textarea({ value, onChange, placeholder }: TextareaProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      multiline
      fullWidth
      minRows={3}
      variant="outlined"
    />
  );
}
