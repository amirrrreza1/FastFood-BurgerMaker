"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavLinks = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/faq", label: "سوالات متداول" },
    { href: "/blogs", label: "بلاگ" },
  ];

  return (
    <nav className="w-full bg-[#C0AD62] shadow-md sticky top-[60px] z-40 mb-10">
      <div className="max-w-[1200px] mx-auto px-5 h-[45px] flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "relative px-3 py-1.5 rounded-md whitespace-nowrap text-white text-sm font-medium transition-all duration-300",
                "hover:bg-white hover:text-[#C0AD62]",
                {
                  " text-[#C0AD62] font-bold": isActive,
                }
              )}
            >
              {link.label}

              {/* Underline for active */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-[4px] bg-[var(--color-primary)] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavLinks;
