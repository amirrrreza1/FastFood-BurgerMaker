"use client";

import { useRef, useState } from "react";
import { menu, MenuItem } from "@/Lib/menu";
import MenuItemCard from "../MenuItemcard/MenuItemCard";

const categories: MenuItem["category"][] = [
  "پیتزا",
  "ساندویچ",
  "سوخاری",
  "پیش‌غذا",
  "نوشیدنی",
  "همه",
];

export default function Menu() {
  const categoryRefs = useRef<Record<string, HTMLElement>>({});
  const [activeCategory, setActiveCategory] = useState<
    MenuItem["category"] | "همه"
  >("همه");

  const filteredMenu = menu;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-56 shrink-0 space-y-2">
        <h3 className="text-lg font-semibold text-center lg:text-right">
          دسته‌بندی
        </h3>
        <button onClick={() => setActiveCategory("همه")}>همه</button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === "همه") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                const target = categoryRefs.current[cat];
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el && !categoryRefs.current[item.category]) {
                categoryRefs.current[item.category] = el;
              }
            }}
          >
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
