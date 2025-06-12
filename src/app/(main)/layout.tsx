import type { Metadata } from "next";
import "../globals.css";
import MainLayout from "@/Components/MainLayout";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "رستوران فست‌فود | Fast Food Restaurant",
  description:
    "سفارش آنلاین غذا با بهترین کیفیت و سریع‌ترین زمان ارسال. تجربه‌ای متفاوت از فست‌فود!",
  applicationName: "AmirFast FastFood",
  keywords: ["فست فود", "رستوران", "سفارش آنلاین", "غذا", "پیتزا", "ساندویچ"],
  authors: [{ name: "FastFood Team", url: "https://amirfast.ir" }],
  creator: "Amirreza Azarioun",
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  openGraph: {
    title: "رستوران فست‌فود",
    description: "سفارش آنلاین غذا با بهترین کیفیت",
    url: "https://amirfast.ir",
    siteName: "FastFood",
    locale: "fa_IR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
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
