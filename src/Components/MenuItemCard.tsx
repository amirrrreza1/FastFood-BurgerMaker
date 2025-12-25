"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/types";
import { useState } from "react";
import MenuItemDetails from "./MenuItemModal";

const fallbackImage = "/images/placeholder-food.jpg";

interface Props {
  item: MenuItem & { image?: string };
}

export default function MenuItemCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const cartItems = useCartStore((state) => state.items);

  const imageSrc = item.image_url || fallbackImage;
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
        className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 ${
          item.available === false
            ? "bg-gray-100 opacity-60 cursor-not-allowed"
            : "bg-white"
        }`}
      >
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-t-xl"
        />

        <div className="p-3 sm:p-4 space-y-2 text-center sm:text-right">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-1">
          {item.name}
          </h3>

          <div className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
            کالری: {item.calories}
          </div>

          <div className="text-base font-semibold text-[var(--color-primary)]">
            {item.price.toLocaleString()} تومان
          </div>

          {item.available === false ? (
            <div className="text-red-600 text-sm mt-2 flex items-center justify-center gap-1">
              ناموجود
            </div>
          ) : cartItem ? (
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <button
                onClick={() => decrementQuantity(item.id)}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
              >
                -
              </button>
              <span className="text-sm font-medium">{cartItem.quantity}</span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
              >
                +
              </button>
            </div>
          ) : (
            <button onClick={handleAddToCart} className="AddTocartBTN">
              افزودن به سبد خرید
            </button>
          )}

          <button onClick={() => setShowModal(true)} className="SeeDetailsBTN">
            مشاهده جزئیات
          </button>
        </div>

        {item.available === false && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow flex items-center gap-1">
          ناموجود
          </span>
        )}
      </div>
      {showModal && (
        <MenuItemDetails item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
