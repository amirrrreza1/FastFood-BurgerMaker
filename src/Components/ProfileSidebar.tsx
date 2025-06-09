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
      <div className="md:hidden flex items-center justify-center rounded-2xl bg-white shadow w-10 h-10 absolute right-4 top-4 cursor-pointer">
        <button onClick={() => setIsOpen(true)} className="cursor-pointer">
          <img src="/images/SVG/menu.svg" alt="menu" width={25} />
        </button>
      </div>

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <aside
          className="absolute right-0 top-0 w-64 h-full bg-gray-100 p-4 shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">پروفایل</h2>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <img src="/images/SVG/close.svg" alt="close" width={25} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
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
            </ul>
          </div>

          <div className="mt-4">
            <Link className="EditBTN  justify-center mb-2" href={"/"}>
              صفحه اصلی
            </Link>
            <button
              className="DeleteBTN block w-full"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              خروج
            </button>
          </div>
        </aside>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col h-screen w-60 bg-gray-100 p-4 border-l sticky top-0">
        <h2 className="text-xl font-bold mb-4">پروفایل</h2>

        <div className="flex-1 overflow-y-auto">
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
          </ul>
        </div>

        <div className="mt-4">
          <Link className="EditBTN  justify-center mb-2" href={"/"}>
            صفحه اصلی
          </Link>
          <button className="DeleteBTN w-full" onClick={handleLogout}>
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}
