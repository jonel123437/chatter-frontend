import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface VisibilityButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const VisibilityButton: React.FC<VisibilityButtonProps> = ({ label, onClick }) => (
  <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />} onClick={onClick}>
    {label}
  </Button>
);
