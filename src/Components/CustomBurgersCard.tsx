// components/CustomBurgerCard.tsx
"use client";
import { useCartStore } from "@/store/cartStore";

type CustomBurger = {
  id: string;
  name: string;
  image_url: string;
  total_price: number;
};

export default function CustomBurgerCard({ burger }: { burger: CustomBurger }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart({
        id: burger.id,
        name: burger.name,
        price: burger.total_price,
        image: burger.image_url || "/images/placeholder-food.jpg",
      });
  };

  return (
    <div className="border rounded-xl p-4 space-y-2 shadow hover:shadow-lg transition">
      <img
        src={burger.image_url}
        alt={burger.name}
        className="rounded-xl object-cover w-full h-48"
      />
      <h3 className="text-lg font-semibold text-center">{burger.name}</h3>
      <button
        onClick={handleAdd}
        className="block w-full mt-2 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        افزودن به سبد خرید
      </button>
    </div>
  );
}
