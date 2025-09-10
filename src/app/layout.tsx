import "../styles/globals.css";
import { CssBaseline } from "@mui/material";

export const metadata = {
  title: "Chatter App",
  description: "Social Media / Community Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
