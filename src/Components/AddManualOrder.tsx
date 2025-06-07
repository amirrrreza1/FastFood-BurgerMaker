// app/admin/manual-order/AdminManualOrder.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";

type User = {
  id: string;
  name: string;
  phone: string;
};

export default function AdminManualOrder({ adminId }: { adminId: string }) {
  const { items, clearCart } = useCartStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        console.log("در حال جستجو برای:", query);
        fetch(`/api/user/search?q=${query}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("نتایج دریافتی:", data.users);
            setResults(data.users || []);
          });
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        total,
        user_id: selectedUser?.id || adminId,
        address: "سفارش ثبت شده توسط ادمین",
        note: "",
        payment_method: "manual",
      }),
    });

    setLoading(false);

    if (response.ok) {
      toast.success("سفارش با موفقیت ثبت شد");
      clearCart();
      setSelectedUser(null);
      setQuery("");
    } else {
      toast.error("خطا در ثبت سفارش");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold">ثبت سفارش دستی</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="جستجوی شماره اشتراک (شماره تلفن)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedUser(null);
        }}
      />

      {results.length > 0 && !selectedUser && (
        <div className="border rounded p-2 bg-gray-50 max-h-40 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedUser(user);
                setResults([]);
                setQuery(user.phone);
              }}
            >
              {user.name} - {user.phone}
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold">پیش‌نمایش سفارش:</h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">سبد خرید خالی است</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price * item.quantity} تومان</span>
              </li>
            ))}
            <li className="font-bold flex justify-between border-t pt-2">
              <span>جمع کل:</span>
              <span>{total} تومان</span>
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || items.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "در حال ارسال..." : "ثبت سفارش"}
      </button>
    </div>
  );
}
