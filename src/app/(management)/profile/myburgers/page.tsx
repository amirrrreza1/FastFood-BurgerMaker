"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase"; // مسیر اتصال به Supabase
import { BurgerOptions } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CustomBurger = {
  id: string;
  user_id: string;
  name: string;
  options: BurgerOptions;
  created_at: string;
};

export default function CustomBurgersPage() {
  const [burgers, setBurgers] = useState<CustomBurger[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBurgers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_burgers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBurgers(data as CustomBurger[]);
    setLoading(false);
  };

  const deleteBurger = async (id: string) => {
    const { error } = await supabase
      .from("custom_burgers")
      .delete()
      .eq("id", id);
    if (!error) {
      setBurgers((prev) => prev.filter((b) => b.id !== id));
    }
  };

  useEffect(() => {
    fetchBurgers();
  }, []);

  if (loading) {
    return <p className="text-center py-10">در حال بارگذاری...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🍔 همبرگرهای من</h1>

      {burgers.length === 0 ? (
        <p className="text-gray-500">شما هنوز هیچ همبرگر سفارشی نساخته‌اید.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {burgers.map((burger) => (
            <div
              key={burger.id}
              className="border rounded-xl p-4 shadow-sm flex flex-col"
            >
              <Image
                src="/burger-preview.jpg"
                alt="Custom Burger"
                width={300}
                height={200}
                className="rounded mb-4 object-cover w-full h-[180px]"
              />

              <h2 className="font-bold text-lg mb-2">{burger.name}</h2>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/profile/custom-burgers/edit/${burger.id}`)
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  ویرایش
                </button>

                <button
                  onClick={() => deleteBurger(burger.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
