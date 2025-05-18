import type { Metadata } from "next";
import "../globals.css";
import MainLayout from "@/Components/Layout/MainLayout";

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Restaurant Website made with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
