"use client";

import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { label: "مدیریت منو", href: "/admin/menu" },
  { label: "مدیریت سفارش", href: "/admin/orders" },
  { label: "مدیریت کاربران", href: "/admin/users" },
  { label: "سفارش دستی", href: "/admin/orders/new" },
  { label: "مدیریت سوالات متداول", href: "/admin/faq" },
  { label: "آشپزخانه", href: "/admin/kds" },
  { label: "مدیریت بلاگ", href: "/admin/blog" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const Router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    Router.push("/");
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-center rounded-2xl bg-white shadow w-10 h-10 absolute right-4 top-4 z-50">
        <button onClick={() => setIsOpen(true)}>
          <img src="/images/SVG/menu.svg" alt="menu" width={25} />
        </button>
      </div>

      <div
        className={`fixed inset-0  bg-black/50 transition-opacity duration-200 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <aside
          className="absolute right-0 top-0 w-64 h-full bg-gray-100 p-4 shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">پنل ادمین</h2>
            <button onClick={() => setIsOpen(false)}>
              <img src="/images/SVG/close.svg" alt="close" width={25} />
            </button>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block p-2 rounded hover:bg-gray-200 ${
                    pathname === item.href ? "bg-gray-300 font-bold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link className="EditBTN  justify-center mb-2" href={"/"}>
              صفحه اصلی
            </Link>
            <button className="DeleteBTN w-full" onClick={handleLogout}>
              خروج
            </button>
          </div>
        </aside>
      </div>
      <aside className="hidden md:flex h-screen sticky top-0 w-60 bg-gray-100 p-4 border-l flex-col">
        <h2 className="text-xl font-bold mb-4">پنل ادمین</h2>
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block p-2 rounded hover:bg-gray-200 ${
                  pathname === item.href ? "bg-gray-300 font-bold" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
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
