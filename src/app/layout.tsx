import "../styles/globals.css"; 

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
      <body>{children}</body>
    </html>
  );
}
