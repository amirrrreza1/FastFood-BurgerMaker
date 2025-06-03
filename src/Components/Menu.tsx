"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Lib/supabase";
import MenuItemCard from "./MenuItemCard";
import { MenuItem } from "@/types";
import Cart from "./Cart";
import { useRouter } from "next/navigation";
import CustomBurgerCard from "./CustomBurgersCard";

const categories: MenuItem["category"][] = [
  "پیتزا",
  "ساندویچ",
  "سوخاری",
  "پیش‌غذا",
  "نوشیدنی",
];

type CustomBurger = {
  id: string;
  name: string;
  total_price: number;
  image_url: string;
};

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customBurgers, setCustomBurgers] = useState<CustomBurger[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(true); // فرض بر این که ابتدا لاگین هست

  const router = useRouter();

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

    const fetchCustomBurgers = async () => {
      try {
        const res = await fetch("/api/user/hamburgers");
        const json = await res.json();

        if (res.ok) {
          setCustomBurgers(json.burgers || []);
        } else {
          if (res.status === 401 || res.status === 403) {
            setIsAuthenticated(false);
          } else {
            console.error("خطا در دریافت همبرگرهای سفارشی:", json.error);
          }
        }
      } catch (err) {
        console.error("خطا در ارتباط با سرور:", err);
        setIsAuthenticated(false);
      }
    };

    fetchMenu();
    fetchCustomBurgers();
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

        {/* بخش همبرگرهای کاربر */}
        {/* بخش همبرگرهای کاربر */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">همبرگرهای من</h2>

          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-gray-600">
                برای دیدن همبرگرهای خود ابتدا وارد شوید.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                ورود به حساب
              </button>
            </div>
          ) : customBurgers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {customBurgers.map((burger) => (
                <CustomBurgerCard key={burger.id} burger={burger} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">شما هنوز هیچ همبرگری نساختید.</p>
              <button
                onClick={() => router.push("/new-burger")}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                ساخت همبرگر جدید 🍔
              </button>
            </div>
          )}
        </div>

        {/* بقیه دسته‌بندی‌های منو */}
        {categories.map((cat) => {
          const items = menuItems.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          return (
            <div
              key={cat}
              ref={(el) => {
                if (el) categoryRefs.current[cat] = el;
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
