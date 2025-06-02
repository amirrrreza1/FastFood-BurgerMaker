"use client";

import { MenuItem } from "@/types";

interface Props {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemDetails({ item, onClose }: Props) {
  const imageSrc =
    item.image || item.image_url || "/images/placeholder-food.jpg";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-48 object-cover rounded mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="text-sm text-gray-500 mb-1">کالری: {item.calories}</div>
        <div className="text-lg font-semibold text-amber-600 mb-4">
          {item.price.toLocaleString()} تومان
        </div>

        {item.available === false && (
          <div className="text-red-600 text-sm font-medium">
            این آیتم در حال حاضر ناموجود است
          </div>
        )}
      </div>
    </div>
  );
}
