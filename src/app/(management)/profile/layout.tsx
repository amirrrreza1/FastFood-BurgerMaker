import ProfileSideBar from "@/Components/ProfileSidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "پنل کاربری",
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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ProfileSideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
