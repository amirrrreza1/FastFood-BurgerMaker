"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/user");
        if (!res.ok) throw new Error("failed");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("خطا در دریافت سفارش‌ها", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">سفارش‌های من</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : orders.length === 0 ? (
        <p>هیچ سفارشی ثبت نکرده‌اید.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">وضعیت:</span>
                <span className="text-sm">{order.status}</span>
              </div>
              <div className="text-sm text-gray-600">
                مجموع: {order.total_price.toLocaleString()} تومان
              </div>
              <div className="text-xs text-gray-500 mt-2">
                تاریخ ثبت: {new Date(order.created_at).toLocaleString("fa-IR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
