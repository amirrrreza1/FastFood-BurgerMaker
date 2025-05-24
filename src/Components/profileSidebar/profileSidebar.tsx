"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/profile/account", label: "حساب کاربری" },
  { href: "/profile/orders", label: "سفارش‌ها" },
  // افزودن لینک‌های دیگر در آینده
];

export default function ProfileSideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-100 p-4 border-l space-y-2">
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
      </ul>
    </aside>
  );
}
