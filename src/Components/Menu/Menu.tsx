"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Lib/supabase";
import MenuItemCard from "../MenuItemcard/MenuItemCard";
import { MenuItem } from "@/types";

const categories: MenuItem["category"][] = [
  "پیتزا",
  "ساندویچ",
  "سوخاری",
  "پیش‌غذا",
  "نوشیدنی",
];

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from("menu_items").select("*");
      if (error) {
        console.error("خطا در بارگیری منو:", error);
        return;
      }

      const itemsWithUrls =
        data?.map((item) => {
          let publicURL = "";

          if (item.image_url) {
            const res = supabase.storage
              .from("menu-images")
              .getPublicUrl(item.image_url);

            // اگه data همونطور که فکر می‌کنیم نیست، خود res رو بررسی می‌کنیم
            if (
              "data" in res &&
              res.data &&
              typeof res.data === "object" &&
              "publicUrl" in res.data
            ) {
              publicURL = res.data.publicUrl;
            } else {
              console.error("getPublicUrl returned unexpected data:", res);
            }
          }

          return { ...item, image: publicURL };
        }) || [];

      setMenuItems(itemsWithUrls);
    };

    fetchMenu();
  }, []);

  const scrollToCategory = (category: string) => {
    const target = categoryRefs.current[category];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-56 shrink-0 space-y-2">
        <h3 className="text-lg font-semibold text-center lg:text-right">
          دسته‌بندی
        </h3>
        <div className="flex lg:flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="block w-full text-right py-2 px-3 hover:bg-gray-100 rounded"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-10">
        {categories.map((cat) => {
          const items = menuItems.filter((item) => item.category === cat);

          if (items.length === 0) return null;

          return (
            <div
              key={cat}
              ref={(el) => {
                if (el) {
                  categoryRefs.current[cat] = el;
                }
              }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold border-b pb-2">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
