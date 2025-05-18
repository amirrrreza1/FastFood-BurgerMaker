"use client";

import { useState } from "react";
import { menu, MenuItem } from "@/Lib/menu";
import MenuItemCard from "../MenuItemcard/MenuItemCard";

const categories: MenuItem["category"][] = [
  "پیتزا",
  "ساندویچ",
  "سوخاری",
  "پیش‌غذا",
  "نوشیدنی",
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<
    MenuItem["category"] | "همه"
  >("همه");

  const filteredMenu =
    activeCategory === "همه"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-56 shrink-0 space-y-2">
        <h3 className="text-lg font-semibold text-center lg:text-right">
          دسته‌بندی
        </h3>
        <button onClick={() => setActiveCategory("همه")}>همه</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMenu.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
