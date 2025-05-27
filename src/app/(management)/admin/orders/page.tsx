"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user_id: string;
  created_at: string;
  status: string;
  rejection_reason?: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelComments, setCancelComments] = useState<Record<number, string>>(
    {}
  );

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId: number,
    status: string,
    comment = ""
  ) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ orderId, status, cancelReason: comment }),
    });
    const result = await res.json();

    if (result.error) toast.error(result.error);
    else {
      toast.success("وضعیت سفارش به‌روزرسانی شد");
      fetchOrders();
    }
    setLoading(false);
  };

  const handleCancelChange = (orderId: number, value: string) => {
    setCancelComments((prev) => ({ ...prev, [orderId]: value }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">مدیریت سفارش‌ها</h1>

      {orders.map((order) => {
        const comment = cancelComments[order.id] || "";

        return (
          <div key={order.id} className="border rounded p-4 space-y-2">
            <div className="flex justify-between">
              <div>سفارش #{order.id}</div>
              <div>{new Date(order.created_at).toLocaleString("fa-IR")}</div>
            </div>

            <div className="text-sm text-gray-500">وضعیت: {order.status}</div>

            {order.status === "cancelled" && (
              <div className="text-red-600 text-sm">
                دلیل لغو: {order.rejection_reason}
              </div>
            )}

            <ul className="list-disc px-5 text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} - {item.price} تومان
                </li>
              ))}
            </ul>

            {order.status !== "cancelled" && order.status !== "delivered" && (
              <div className="flex flex-wrap gap-2 items-center mt-2">
                {order.status === "pending" && (
                  <>
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded"
                      onClick={() => updateStatus(order.id, "preparing")}
                      disabled={loading}
                    >
                      تایید سفارش (در حال آماده‌سازی)
                    </button>

                    <input
                      type="text"
                      placeholder="دلیل لغو"
                      value={comment}
                      onChange={(e) =>
                        handleCancelChange(order.id, e.target.value)
                      }
                      className="p-1 border rounded"
                    />
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() =>
                        updateStatus(order.id, "cancelled", comment)
                      }
                      disabled={loading || comment.trim() === ""}
                    >
                      لغو سفارش
                    </button>
                  </>
                )}

                {order.status === "preparing" && (
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={() => updateStatus(order.id, "delivering")}
                    disabled={loading}
                  >
                    ارسال سفارش
                  </button>
                )}

                {order.status === "delivering" && (
                  <button
                    className="bg-gray-600 text-white px-4 py-1 rounded"
                    onClick={() => updateStatus(order.id, "delivered")}
                    disabled={loading}
                  >
                    تحویل داده شد
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
