"use client";

import { MenuItem } from "@/types";

interface Props {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemDetails({ item, onClose }: Props) {
  const imageSrc = item.image_url || "/images/placeholder-food.jpg";
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="بستن"
        >
          <img src="/images/SVG/close.svg" alt="Close" width={24} height={24} />
        </button>

        {/* Image */}
        <div className="rounded-xl overflow-hidden mb-4">
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
          {item.name}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 text-justify leading-relaxed">
          {item.description}
        </p>

        {/* Info Rows */}
        <div className="flex flex-col gap-2 text-sm sm:text-base text-gray-700">
          {item.calories > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">🔥</span>
              کالری: {item.calories}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-lg">💰</span>
            قیمت:{" "}
            <span className="text-amber-600 font-semibold">
              {item.price.toLocaleString()} تومان
            </span>
          </div>

          {item.available === false && (
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <span>⛔️</span>
              این آیتم در حال حاضر ناموجود است
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
