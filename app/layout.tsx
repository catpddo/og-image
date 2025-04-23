import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OG Image Generator",
  description: "Generate OG images for your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
