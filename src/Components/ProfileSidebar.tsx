"use client";
import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/profile/account", label: "حساب کاربری" },
  { href: "/profile/orders", label: "سفارش‌ها" },
  { href: "/profile/myburgers", label: "همبرگرهای من" },
];

export default function ProfileSideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    redirect("/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shadow">
        <h2 className="text-lg font-bold">پروفایل</h2>
        <button onClick={() => setIsOpen(true)}>
          ب
        </button>
      </div>

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-30 transition-opacity duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <aside
          className="absolute right-0 top-0 w-64 h-full bg-gray-100 p-4 shadow-lg"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">پروفایل</h2>
            <button onClick={() => setIsOpen(false)}>
              ب
            </button>
          </div>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block p-2 rounded hover:bg-gray-200 ${
                    pathname === link.href ? "bg-gray-300 font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                className="block w-full text-right p-2 rounded hover:bg-gray-200"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                خروج
              </button>
            </li>
          </ul>
        </aside>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-60 bg-gray-100 p-4 border-l space-y-2">
        <h2 className="text-xl font-bold mb-4">پروفایل</h2>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block p-2 rounded hover:bg-gray-200 ${
                  pathname === link.href ? "bg-gray-300 font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="block w-full p-2 rounded hover:bg-gray-200 text-right"
              onClick={handleLogout}
            >
              خروج
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
