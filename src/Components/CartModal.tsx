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
        className="relative w-[30px] h-[30px] cursor-pointer"
      >
        <img src={"/images/SVG/cart.svg"} alt="Cart" width={30} height={30} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-black text-white rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md space-y-4 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 left-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <img src="/images/SVG/close.svg" alt="close" width={20} height={20} />
            </button>

            <h2 className="text-lg sm:text-xl font-bold border-b pb-2 text-center">
              🛒 سبد خرید شما
            </h2>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                سبد خرید شما خالی است.
              </p>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="w-2/3">
                      <h3 className="font-semibold text-sm sm:text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        قیمت: {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
                      >
                        -
                      </button>
                      <span className="px-1">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-xs hover:underline"
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
              <div className="pt-4 border-t space-y-3">
                <p className="text-base font-semibold text-center">
                  مجموع:{" "}
                  <span className="text-amber-600 font-bold">
                    {totalPrice.toLocaleString()} تومان
                  </span>
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-medium transition"
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
