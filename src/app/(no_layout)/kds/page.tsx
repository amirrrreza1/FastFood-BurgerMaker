"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  user_name?: string;
  user_phone?: string;
  note?: string;
}

const STATUS_FLOW: Record<string, string> = {
  pending: "preparing",
  preparing: "delivering",
  delivering: "delivered",
};

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      const filtered = res.data.filter((o: Order) =>
        ["pending", "preparing", "delivering"].includes(o.status)
      );
      setOrders(filtered);
    } catch (err) {
      toast.error("خطا در دریافت سفارش‌ها");
    }
  };

  const advanceStatus = async (orderId: number, currentStatus: string) => {
    const nextStatus = STATUS_FLOW[currentStatus];
    if (!nextStatus) return;

    try {
      await axios.patch(`/api/admin/orders/${orderId}`, {
        status: nextStatus,
      });
      toast.success("وضعیت سفارش به‌روزرسانی شد");
      fetchOrders();
    } catch (err) {
      toast.error("خطا در تغییر وضعیت سفارش");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-right">
        سفارش‌های آشپزخانه
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-800">
                سفارش #{order.id}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(order.created_at).toLocaleTimeString("fa-IR")}
              </span>
            </div>

            {/* Items */}
            <ul className="text-sm list-disc px-4 space-y-1 mb-2 text-gray-800">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            {/* Note */}
            {order.note && (
              <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-gray-700 mb-2">
                📝 <span className="font-semibold">توضیح:</span> {order.note}
              </div>
            )}

            {/* Status */}
            <div className="mt-auto">
              <div className="text-sm text-gray-600 mb-2">
                وضعیت فعلی:{" "}
                <span className="font-bold text-indigo-700">
                  {order.status}
                </span>
              </div>

              {STATUS_FLOW[order.status] ? (
                <button
                  onClick={() => advanceStatus(order.id, order.status)}
                  className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                >
                  تغییر وضعیت به "{STATUS_FLOW[order.status]}"
                </button>
              ) : (
                <div className="text-green-600 font-bold text-center mt-2 text-sm">
                  ✅ سفارش نهایی شده
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
