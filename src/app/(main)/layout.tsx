import type { Metadata } from "next";
import "../globals.css";
import MainLayout from "@/Components/MainLayout";

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Restaurant Website made with Next.js",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;
