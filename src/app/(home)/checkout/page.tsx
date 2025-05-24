"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setIsLoading(true);

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, name, price, quantity }) => ({
            id,
            name,
            price,
            quantity,
          })),
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت سفارش");
      } else {
        toast.success("سفارش با موفقیت ثبت شد");
        clearCart();
        router.push("/profile/orders");
      }
    } catch (err) {
      toast.error("مشکلی پیش آمد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <h1 className="text-2xl font-bold">تایید سفارش</h1>
      {items.length === 0 ? (
        <p>سبد خرید شما خالی است.</p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString()} تومان
                </span>
              </div>
            ))}
          </div>

          <div className="text-lg font-semibold">
            مجموع:{" "}
            {items
              .reduce((sum, i) => sum + i.price * i.quantity, 0)
              .toLocaleString()}{" "}
            تومان
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
          </button>
        </>
      )}
    </div>
  );
}
