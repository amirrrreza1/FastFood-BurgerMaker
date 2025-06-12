"use client";

import { useCartStore } from "@/store/cartStore";
import { CustomBurger } from "@/types";

export default function CustomBurgerCard({ burger }: { burger: CustomBurger }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const increment = useCartStore((state) => state.incrementQuantity);
  const decrement = useCartStore((state) => state.decrementQuantity);
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.id === burger.id)
  );

  const handleAdd = () => {
    addToCart({
      id: burger.id,
      name: burger.name,
      price: burger.total_price,
      image: burger.image_url || "/images/placeholder-food.jpg",
    });
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border bg-white">
      <img
        src={burger.image_url || "/images/placeholder-food.jpg"}
        alt={burger.name}
        className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-t-xl"
      />

      <div className="p-4 space-y-2 text-center sm:text-right">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-1">
          🍔 {burger.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {burger.description}
        </p>

        {burger.total_calories > 0 && (
          <div className="text-xs text-gray-500">کالری: {burger.total_calories}</div>
        )}

        <div className="font-semibold text-amber-600 text-base">
          {burger.total_price.toLocaleString()} تومان
        </div>

        {cartItem ? (
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
            <button
              onClick={() => decrement(burger.id)}
              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
            >
              -
            </button>
            <span className="px-1">{cartItem.quantity}</span>
            <button
              onClick={() => increment(burger.id)}
              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded text-lg"
            >
              +
            </button>
          </div>
        ) : (
          <button onClick={handleAdd} className="AddTocartBTN">
            🛒 افزودن به سبد خرید
          </button>
        )}
      </div>
    </div>
  );
}
