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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">صفحه سفارش‌های آشپزخانه</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-lg p-4 space-y-3 border"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">سفارش #{order.id}</span>
              <span className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleTimeString("fa-IR")}
              </span>
            </div>

            <ul className="list-disc px-5 text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>


            {order.note && (
              <div className="text-sm text-gray-700">
                📝 توضیحات: {order.note}
              </div>
            )}

            <div className="text-sm text-gray-700">
              وضعیت فعلی: <span className="font-semibold">{order.status}</span>
            </div>

            {STATUS_FLOW[order.status] ? (
              <button
                onClick={() => advanceStatus(order.id, order.status)}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              >
                تغییر به "{STATUS_FLOW[order.status]}"
              </button>
            ) : (
              <div className="text-green-600 font-bold mt-2 text-center text-sm">
                سفارش نهایی شده ✅
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
