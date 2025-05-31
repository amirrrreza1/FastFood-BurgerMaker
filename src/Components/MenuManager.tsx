// components/MenuManager.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase"; // فرض بر اینکه فایل کانفیگ Supabase رو داری

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: string;
  image_url: string;
};

const categories = ["پیتزا", "ساندویچ", "سوخاری", "پیش‌غذا", "نوشیدنی"];

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    calories: 0,
    category: categories[0],
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*");
    if (data) setMenuItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `menu-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      alert("خطا در آپلود تصویر");
      return "";
    }

    const { data: publicUrlData } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);
    return publicUrlData?.publicUrl || "";
  };

  const handleSubmit = async () => {
    let imageUrl = form.image_url;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const { error } = await supabase.from("menu_items").insert([
      {
        ...form,
        image_url: imageUrl,
      },
    ]);

    if (!error) {
      setForm({
        name: "",
        description: "",
        price: 0,
        calories: 0,
        category: categories[0],
        image_url: "",
      });
      setImageFile(null);
      fetchItems();
    } else {
      alert("خطا در افزودن آیتم");
    }
  };

  const deleteItem = async (id: number) => {
    await supabase.from("menu_items").delete().eq("id", id);
    fetchItems();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">مدیریت منو</h2>

      {/* فرم افزودن آیتم */}
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="نام"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="توضیحات"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="قیمت"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="کالری"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: +e.target.value })}
          className="w-full border p-2 rounded"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          افزودن آیتم
        </button>
      </div>

      {/* لیست آیتم‌ها */}
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
              <div className="text-sm">
                {item.price} تومان - {item.calories} کالری - دسته:{" "}
                {item.category}
              </div>
            </div>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <button
              onClick={() => deleteItem(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
