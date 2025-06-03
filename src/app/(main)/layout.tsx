import type { Metadata } from "next";
import "../globals.css";
import MainLayout from "@/Components/MainLayout";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Restaurant Website made with Next.js",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <MainLayout>
      {children} <ToastContainer position="top-right" />
    </MainLayout>
  );
};

export default RootLayout;
