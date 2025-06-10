"use client";

import LoadingSpinner from "@/Components/Loading";
import { useEffect, useState } from "react";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "⏳ در انتظار تأیید";
    case "preparing":
      return "🧑‍🍳 در حال آماده‌سازی";
    case "delivering":
      return "🚚 در حال ارسال";
    case "delivered":
      return "✅ تحویل داده شد";
    case "canceled":
      return "❌ لغو شده";
    default:
      return "❓ نامشخص";
  }
};

const getPaymentLabel = (method: string) => {
  switch (method) {
    case "cash":
      return "💵 پرداخت نقدی";
    case "pos":
      return "💳 کارت‌خوان سیار";
    default:
      return "❓ نامشخص";
  }
};

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

  if (loading) return <LoadingSpinner text="در حال دریافت سفارش‌ها..." />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        سفارش‌های من
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          هیچ سفارشی ثبت نکرده‌اید.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border rounded-xl p-4 shadow-sm bg-white space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm sm:text-base">
                  وضعیت:
                </span>
                <span className="text-xs sm:text-sm text-blue-600">
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-800">
                <span>مجموع:</span>
                <span>{order.total_price.toLocaleString()} تومان</span>
              </div>

              <div className="flex justify-between text-sm text-gray-800">
                <span>روش پرداخت:</span>
                <span>{getPaymentLabel(order.payment_method)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-800">
                <span>آدرس:</span>
                <span>{order.address}</span>
              </div>

              <div className="text-xs text-gray-500">
                🗓️ تاریخ ثبت: 
                {new Date(order.created_at).toLocaleString("fa-IR")}
              </div>



              <div className="mt-2">
                <h3 className="text-sm font-semibold mb-2">📦 آیتم‌ها:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {order.items?.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b py-1"
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs text-gray-500">
                        ×{item.quantity} - {item.price.toLocaleString()} تومان
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
