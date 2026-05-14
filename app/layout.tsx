import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "SEONGON Kickoff Generator — Tạo Presentation SEO tự động",
  description: "Công cụ tạo PowerPoint Kickoff Meeting cho dự án SEO bằng AI — SEONGON",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
