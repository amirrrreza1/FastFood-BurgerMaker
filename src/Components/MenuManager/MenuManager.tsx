"use client";

import { useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0 });

  const addItem = () => {
    setMenuItems([
      ...menuItems,
      { id: Date.now(), name: newItem.name, price: newItem.price },
    ]);
    setNewItem({ name: "", price: 0 });
  };

  const deleteItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const editItem = (id: number, name: string, price: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, name, price } : item
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">مدیریت آیتم‌های منو</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="نام آیتم"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="قیمت"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: +e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={addItem}
          className="bg-green-600 text-white px-4 rounded"
        >
          افزودن
        </button>
      </div>

      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              {item.name} - {item.price} تومان
            </div>
            <div className="space-x-2">
              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-2 rounded"
              >
                حذف
              </button>
              {/* در آینده ویرایش با فرم مجزا یا مودال */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuManager;
