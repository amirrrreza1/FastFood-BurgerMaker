"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/types";
import { useState } from "react";

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
    <div className="space-y-6 mt-10 md:mt-0">
      <input
        type="text"
        placeholder="جستجو بر اساس نام"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const quantity = getQuantity(item.id);

          return (
            <div
              key={item.id}
              className="rounded-xl p-4 shadow bg-white flex flex-col items-center space-y-2"
            >
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-600">
                {item.price.toLocaleString()} تومان
              </p>

              {quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-semibold">{quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="DeleteBTN py-1 hover:scale-100"
                  >
                    حذف
                  </button>
                </div>
              ) : item.available ? (
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image_url,
                    })
                  }
                  className="EditBTN"
                >
                  افزودن
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                >
                  در دسترس نیست
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
