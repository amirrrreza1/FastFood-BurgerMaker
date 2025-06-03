"use client";

import { useCartStore } from "@/store/cartStore";


export default function CartBadge() {
  const items = useCartStore((state) => state.items);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity === 0) return null;

  return (
    <div >
      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {totalQuantity}
      </div>
    </div>
  );
}
