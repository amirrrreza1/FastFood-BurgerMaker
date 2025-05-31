"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
    { label: "مدیریت منو", href: "/admin/menu" },
    { label: "مدیریت سفارش", href: "/admin/orders" },
  // می‌تونی آیتم‌های بیشتر به این آرایه اضافه کنی
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    redirect("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 space-y-4">
      <h2 className="text-lg font-bold mb-6">پنل ادمین</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "block text-sm px-2 py-1 rounded transition",
              pathname === item.href
                ? "bg-amber-100 text-black font-semibold"
                : "text-gray-700 hover:text-black hover:bg-gray-100"
            )}
          >
            {item.label}
          </Link>
        ))}
        <button onClick={() => handleLogout()}>خروج</button>
      </nav>
    </aside>
  );
}
