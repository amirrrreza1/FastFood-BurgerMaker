import type { Metadata } from "next";
import "../globals.css";
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
    <main>
      {children}
      <ToastContainer position="top-right" />
    </main>
  );
};

export default RootLayout;
