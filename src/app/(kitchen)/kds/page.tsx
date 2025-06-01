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
}

const STATUS_FLOW: Record<string, string> = {
  pending: "preparing",
  preparing: "delivering",
  delivering: "delivered",
};

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
        const res = await axios.get("/api/admin/orders");
      const filtered = res.data.filter((o: Order) =>
        ["pending", "preparing", "delivering"].includes(o.status)
      );
      setOrders(res.data);
    } catch (err) {
      toast.error("خطا در دریافت سفارش‌ها");
    }
  };

  useEffect(() => {
      fetchOrders();
      console.log(orders);
      
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

            <div className="text-sm text-gray-700">وضعیت: {order.status}</div>


          </div>
        ))}
      </div>
    </div>
  );
}
