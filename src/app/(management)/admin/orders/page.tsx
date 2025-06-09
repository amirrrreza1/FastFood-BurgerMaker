"use client";

import LoadingSpinner from "@/Components/Loading";
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
  order_type: string;
}

const STATUS_LABELS: Record<string, string> = {
  all: "همه",
  pending: "در انتظار",
  preparing: "آماده‌سازی",
  delivering: "ارسال",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelComments, setCancelComments] = useState<Record<number, string>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      toast.error("خطا در دریافت سفارش‌ها");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (filterStatus !== "all") {
      result = result.filter((order) => order.status === filterStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((order) => {
        return (
          order.id.toString().includes(term) ||
          new Date(order.created_at).toLocaleString("fa-IR").includes(term) ||
          order.items.some((item) => item.name.toLowerCase().includes(term))
        );
      });
    }

    // سفارش‌های "cancelled" و "delivered" را ببر انتهای لیست
    result.sort((a, b) => {
      const isFinalA =
        a.status === "cancelled" || a.status === "delivered" ? 1 : 0;
      const isFinalB =
        b.status === "cancelled" || b.status === "delivered" ? 1 : 0;
      return isFinalA - isFinalB;
    });

    setFilteredOrders(result);
  }, [orders, filterStatus, searchTerm]);

  const updateStatus = async (
    orderId: number,
    status: string,
    comment = ""
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify({ orderId, status, cancelReason: comment }),
      });
      const result = await res.json();

      if (result.error) toast.error(result.error);
      else {
        toast.success("وضعیت سفارش به‌روزرسانی شد");
        await fetchOrders();
      }
    } catch (err) {
      toast.error("خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelChange = (orderId: number, value: string) => {
    setCancelComments((prev) => ({ ...prev, [orderId]: value }));
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        📦 مدیریت سفارش‌ها
      </h1>

      {/* فیلتر و جستجو */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <input
          type="text"
          placeholder="جستجو بر اساس آیتم، شماره، تاریخ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          className="w-full sm:w-48 p-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* لودر */}
      {loading ? (
        <LoadingSpinner text="در حال بارگذاری سفارش‌ها..." />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">سفارشی یافت نشد.</div>
      ) : (
        filteredOrders.map((order, index) => {
          const comment = cancelComments[order.id] || "";

          return (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm bg-white space-y-2"
            >
              <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700 gap-2">
                <div>
                  سفارش {index + 1}
                </div>
                <div>{new Date(order.created_at).toLocaleString("fa-IR")}</div>
              </div>

              <div className="text-sm">
                وضعیت:{" "}
                <span
                  className={`font-bold ${
                    order.status === "cancelled"
                      ? "text-red-600"
                      : order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "preparing"
                      ? "text-blue-500"
                      : order.status === "delivering"
                      ? "text-purple-600"
                      : "text-green-600"
                  }`}
                >
                  {order.status === "pending" && "در انتظار تایید 🕓"}
                  {order.status === "preparing" && "در حال آماده‌سازی 🍳"}
                  {order.status === "delivering" && "در حال ارسال 🚚"}
                  {order.status === "delivered" && "تحویل داده شد ✅"}
                  {order.status === "cancelled" && "لغو شده ❌"}
                </span>
              </div>

              {order.status === "cancelled" && (
                <div className="text-red-600 text-sm">
                  دلیل لغو: {order.rejection_reason}
                </div>
              )}

              <ul className="list-disc px-5 text-sm text-gray-800">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} -{" "}
                    {item.price.toLocaleString()} تومان
                  </li>
                ))}
              </ul>

              {/* دکمه‌های وضعیت */}
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center mt-2">
                  {/* سفارش‌های آنلاین با pending شروع می‌شن */}
                  {order.status === "pending" &&
                    order.order_type === "online" && (
                      <>
                        <button
                          className="ConfirmBTN"
                          onClick={() => updateStatus(order.id, "preparing")}
                          disabled={loading}
                        >
                          ✅ تایید سفارش
                        </button>
                        <input
                          type="text"
                          placeholder="دلیل لغو"
                          value={comment}
                          onChange={(e) =>
                            handleCancelChange(order.id, e.target.value)
                          }
                          className="p-1 border rounded w-full sm:w-auto"
                        />
                        <button
                          className="DeleteBTN"
                          onClick={() =>
                            updateStatus(order.id, "cancelled", comment)
                          }
                          disabled={loading || comment.trim() === ""}
                        >
                          لغو سفارش
                        </button>
                      </>
                    )}

                  {/* شروع مستقیم از preparing برای phone و in_person */}
                  {order.status === "preparing" && (
                    <>
                      {order.order_type !== "in_person" && (
                        <button
                          className="EditBTN"
                          onClick={() => updateStatus(order.id, "delivering")}
                          disabled={loading}
                        >
                          🚚 ارسال سفارش
                        </button>
                      )}
                      {order.order_type === "in_person" && (
                        <button
                          className="ConfirmBTN"
                          onClick={() => updateStatus(order.id, "delivered")}
                          disabled={loading}
                        >
                          ✅ تحویل داده شد
                        </button>
                      )}
                    </>
                  )}

                  {order.status === "delivering" && (
                    <button
                      className="ConfirmBTN"
                      onClick={() => updateStatus(order.id, "delivered")}
                      disabled={loading}
                    >
                      ✅ تحویل داده شد
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
