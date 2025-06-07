"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

type Props = {
  menuItems: MenuItem[];
};

export default function AdminMenu({ menuItems }: Props) {
  const {
    items,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCartStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  const categories = [
    "همه",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "همه" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getQuantity = (id: string) => {
    return items.find((item: any) => item.id === id)?.quantity || 0;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="جستجو بر اساس نام"
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const quantity = getQuantity(item.id);

          return (
            <div
              key={item.id}
              className="border rounded-xl p-4 shadow-md bg-white flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-600 mb-2">
                {item.price.toLocaleString()} تومان
              </p>

              {quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="bg-yellow-300 px-2 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="bg-green-300 px-2 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image_url,
                    })
                  }
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  افزودن
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
