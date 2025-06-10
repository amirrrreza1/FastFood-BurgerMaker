"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { CustomBurger, MenuItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import CustomBurgerCard from "@/Components/CustomBurgersCard";
import MenuItemCard from "@/Components/MenuItemCard";

const categories: MenuItem["category"][] = [
  "پیتزا",
  "ساندویچ",
  "سوخاری",
  "پیش‌غذا",
  "نوشیدنی",
];

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customBurgers, setCustomBurgers] = useState<CustomBurger[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const created = searchParams.get("created");

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

          if (created) {
            const section = document.getElementById("custom-burgers");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }
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
      setActiveCategory(category);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-6 min-h-screen">
      <aside className="w-full lg:w-60 shrink-0">
        <div className="bg-white shadow-md rounded-lg p-4 space-y-4 sticky top-16">
          <h3 className="text-xl font-bold text-center lg:text-right border-b pb-2">
            دسته‌بندی‌ها
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:overflow-visible">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className="lg:w-full flex-shrink-0 px-4 py-2 mb-1 text-sm bg-white rounded shadow hover:bg-gray-100 transition whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 space-y-12">
        <section id="custom-burgers" className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            🍔 همبرگرهای من
          </h2>

          {!isAuthenticated ? (
            <div className="bg-[var(--color-primary)] p-3 rounded-lg text-center h-48 flex flex-col items-center justify-center gap-2 shadow-md">
              <p className="text-white">
                برای دیدن همبرگرهای خود ابتدا وارد شوید.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="CustomBTN"
              >
                ورود به حساب
              </button>
            </div>
          ) : customBurgers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {customBurgers.map((burger) => (
                <CustomBurgerCard key={burger.id} burger={burger} />
              ))}
              <div
                onClick={() => {
                  sessionStorage.setItem(
                    "redirect_after_burger",
                    window.location.pathname
                  );
                  router.push("/new-burger");
                }}
                className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition min-h-[180px]"
              >
                <span className="text-3xl">➕</span>
                <span className="mt-2 font-semibold text-gray-600">
                  ساخت همبرگر جدید
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-primary)] p-3 rounded-lg text-center h-48 flex flex-col items-center justify-center gap-2">
              <p className="text-white">شما هنوز هیچ همبرگری نساختید.</p>
              <button
                onClick={() => router.push("/new-burger")}
                className="CustomBTN"
              >
                ساخت همبرگر جدید 🍔
              </button>
            </div>
          )}
        </section>

        {categories.map((cat) => {
          const items = menuItems.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          return (
            <section
              key={cat}
              ref={(el) => {
                if (el) categoryRefs.current[cat] = el as HTMLDivElement;
              }}
              className="scroll-mt-24 space-y-6 sm:space-y-8 md:space-y-10"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 border-b border-gray-300 pb-2">
                {cat}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
