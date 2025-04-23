import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body>
        {children}
        <Toaster richColors position={"top-center"} />
      </body>
    </html>
  );
}
