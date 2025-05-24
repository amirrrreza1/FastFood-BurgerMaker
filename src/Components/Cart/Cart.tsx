"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 🔥 اضافه کردن این
// ...

export default function Cart() {
  const {
    items,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
  } = useCartStore();

  const router = useRouter(); // 🔥 استفاده از useRouter

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return <p className="text-center mt-10">سبد خرید شما خالی است.</p>;
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">🛒 سبد خرید</h2>

      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold">{item.name}</h3>
            <div className="text-sm text-gray-500">
              قیمت: {item.price.toLocaleString()} تومان
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => decrementQuantity(item.id)}
                className="bg-gray-200 px-2 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="bg-gray-200 px-2 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm ml-4"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t text-lg font-bold flex justify-between items-center">
        <span>مجموع:</span>
        <span>{total.toLocaleString()} تومان</span>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={clearCart}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          پاک‌کردن کل سبد
        </button>

        <button
          onClick={() => router.push("/checkout")} // 🔥 هدایت به صفحه checkout
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded flex-1"
        >
          ادامه به مرحله نهایی خرید
        </button>
      </div>
    </div>
  );
}
