"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, incrementQuantity, decrementQuantity, removeFromCart } =
    useCartStore();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-[25px] h-[25px] cursor-pointer"
      >
        <img src={"/images/svg/cart.svg"} alt="Cart" width={30} height={30} />
        <span className="absolute -top-2 text-sm -right-1 w-[15px] h-[15px] bg-white rounded-full">
          {items.length}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 relative">
            <button
              className="absolute top-4 left-4 text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              fdgfdgdf
            </button>

            <h2 className="text-xl font-bold border-b pb-2">سبد خرید شما</h2>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                سبد خرید خالی است.
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        قیمت: {item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total & Checkout */}
            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">
                  مجموع:{" "}
                  <span className="text-amber-600">
                    {totalPrice.toLocaleString()} تومان
                  </span>
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded"
                >
                  ادامه خرید
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
