"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomBurger, Order } from "@/types";


const ITEM_NAME_TRANSLATIONS: Record<string, string> = {
  meat: "گوشت",
  cheese: "پنیر",
  lettuce: "کاهو",
  tomato: "گوجه",
  pickle: "خیارشور",
  onion: "پیاز",
  ketchup: "سس کچاپ",
  mustard: "سس خردل",
  mayo: "سس مایونز",
  hot: "سس تند",
  bread: "نان اضافی",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "⏳ در انتظار تأیید",
  preparing: "🧑‍🍳 در حال آماده‌سازی",
  delivered: "✅ تحویل داده شده",
  canceled: "❌ لغو شده",
};

const KitchenDisplayPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customBurgers, setCustomBurgers] = useState<CustomBurger[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      const filtered = res.data.filter((o: Order) => o.status === "preparing");
      setOrders(filtered);
    } catch (err) {
      toast.error("خطا در دریافت سفارش‌ها");
    }
  };

  const fetchCustomBurgers = async () => {
    try {
      const res = await axios.get("/api/admin/custom-burgers");
      setCustomBurgers(res.data);
    } catch (err) {
      toast.error("خطا در دریافت همبرگرهای سفارشی");
    }
  };

  const markAsDelivered = async (order: Order) => {
    try {
      await axios.patch(`/api/admin/orders/${order.id}`, {
        status: "delivered",
      });
      toast.success("سفارش تحویل داده شد");
      fetchOrders();
    } catch (err) {
      toast.error("خطا در تغییر وضعیت سفارش");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomBurgers();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const customBurgerIds = customBurgers.map((b) => b.id);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-right">
        سفارش‌های تاییدشده (آشپزخانه)
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-800">
                سفارش {index + 1}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(order.created_at).toLocaleTimeString("fa-IR")}
              </span>
            </div>

            <ul className="text-sm list-disc px-4 space-y-1 mb-2 text-gray-800">
              {order.items.map((item) => {
                const isCustom = customBurgerIds.includes(item.id);
                return (
                  <li key={item.id}>
                    {isCustom ? "🍔 همبرگر سفارشی" : item.name} ×{" "}
                    {item.quantity}
                  </li>
                );
              })}
            </ul>

            {order.items.map((item) => {
              const custom = customBurgers.find((b) => b.id === item.id);

              if (custom) {
                const layers =
                  typeof custom.layers === "string"
                    ? JSON.parse(custom.layers)
                    : custom.layers;

                return (
                  <div
                    key={`custom-${item.id}`}
                    className="text-sm bg-gray-100 rounded p-3 mb-3 border border-gray-300"
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      🍔 همبرگر سفارشی × {item.quantity}
                    </div>

                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {layers.map((layer: string, idx: number) => (
                        <li key={idx}>
                          {ITEM_NAME_TRANSLATIONS[layer] || layer}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <li key={item.id} className="text-gray-800 text-sm">
                  {item.name} × {item.quantity}
                </li>
              );
            })}

            {order.note && (
              <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-gray-700 mb-2">
                📝 <span className="font-semibold">توضیح:</span> {order.note}
              </div>
            )}

            <div className="mt-auto">
              <div className="text-sm text-gray-600 mb-2">
                وضعیت:{" "}
                <span className="font-bold text-indigo-700">
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <button
                onClick={() => markAsDelivered(order)}
                className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
              >
                تحویل داده شد ✅
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplayPage;
