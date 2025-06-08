"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { BurgerOptions } from "@/types";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import LoadingSpinner from "@/Components/Loading";

type CustomBurger = {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  options: BurgerOptions;
  created_at: string;
};

export default function CustomBurgersPage() {
  const [burgers, setBurgers] = useState<CustomBurger[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBurgers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_burgers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBurgers(data as CustomBurger[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این همبرگر برای همیشه حذف خواهد شد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("custom_burgers")
        .delete()
        .eq("id", id);

      if (!error) {
        setBurgers((prev) => prev.filter((b) => b.id !== id));
        toast.success("همبرگر با موفقیت حذف شد.");
      } else {
        toast.error("حذف با خطا مواجه شد.");
      }
    }
  };

  useEffect(() => {
    fetchBurgers();
  }, []);

  if (loading) {
    return <LoadingSpinner text="در حال دریافت همبرگرها..." />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-right">
          🍔 همبرگرهای من
        </h1>
        <Link href="/new-burger" className="ConfirmBTN w-fit">
          افزودن همبرگر جدید
        </Link>
      </div>

      {burgers.length === 0 ? (
        <p className="w-full h-48 flex justify-center items-center text-center text-gray-600 text-xl">
          شما هنوز هیچ همبرگر سفارشی نساخته‌اید.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {burgers.map((burger) => (
            <div
              key={burger.id}
              className="border rounded-xl p-4 shadow-sm flex flex-col bg-white"
            >
              <img
                src={burger.image_url}
                alt="burger"
                className="rounded mb-4 object-cover w-full h-48 sm:h-52"
              />
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <h2 className="font-bold text-lg">{burger.name}</h2>
                <button
                  onClick={() => handleDelete(burger.id)}
                  className="DeleteBTN"
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
