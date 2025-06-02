"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/types";
import { useState } from "react";
import MenuItemDetails from "./MenuItemModal";

const fallbackImage = "/images/placeholder-food.jpg";

interface Props {
  item: MenuItem & { image?: string }; // برای public URL تصویر
}

export default function MenuItemCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const cartItems = useCartStore((state) => state.items);

  const imageSrc = item.image || item.image_url || fallbackImage;
  const cartItem = cartItems.find((i) => i.id === item.id);

  const handleAddToCart = () => {
    if (item.available !== false) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: imageSrc,
      });
    }
  };

  return (
    <>
      <div
        className={`relative rounded-xl overflow-hidden shadow-md transition ${
          item.available === false
            ? "bg-gray-200 opacity-60 cursor-not-allowed"
            : "bg-white"
        }`}
      >
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <div className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </div>
          <div className="text-xs text-gray-500">کالری: {item.calories}</div>
          <div className="font-semibold text-amber-600">
            {item.price.toLocaleString()} تومان
          </div>

          {item.available === false ? (
            <div className="text-red-600 text-sm mt-2">ناموجود</div>
          ) : cartItem ? (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => decrementQuantity(item.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                -
              </button>
              <span className="text-sm font-medium">{cartItem.quantity}</span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
            >
              افزودن به سبد خرید
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="mt-2 w-full py-1 border border-amber-500 text-amber-600 rounded text-sm hover:bg-amber-50"
          >
            مشاهده جزئیات
          </button>
        </div>

        {item.available === false && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            ناموجود
          </div>
        )}
      </div>

      {/* ساده‌ترین مودال بدون کتابخانه */}
      {showModal && (
        <MenuItemDetails item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
