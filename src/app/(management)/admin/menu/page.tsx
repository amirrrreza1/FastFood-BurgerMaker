"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { MenuItemSchema } from "@/Lib/schemas/menuSchema";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingSpinner from "@/Components/Loading";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: string;
  image_url: string;
  available: boolean;
};

const categories = ["پیتزا", "ساندویچ", "سوخاری", "پیش‌غذا", "نوشیدنی"];

export default function MenuManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<
    Omit<MenuItem, "id"> & { available: boolean }
  >({
    name: "",
    description: "",
    price: 0,
    calories: 0,
    category: categories[0],
    image_url: "",
    available: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchItems = async () => {
    setIsFetching(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("id", { ascending: false });
    if (data) setMenuItems(data);
    setIsFetching(false);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `menu-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      toast.error("خطا در آپلود تصویر");
      return "";
    }

    const { data: publicUrlData } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);
    return publicUrlData?.publicUrl || "";
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let imageUrl = form.image_url;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const result = MenuItemSchema.safeParse({ ...form, image_url: imageUrl });
    if (!result.success) {
      toast.error("فرم نامعتبر است.");
      setIsLoading(false);
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("menu_items")
        .update({ ...form, image_url: imageUrl })
        .eq("id", editId);
      if (!error) {
        toast.success("آیتم با موفقیت ویرایش شد.");
        setEditId(null);
      } else toast.error("خطا در ویرایش آیتم.");
    } else {
      const { error } = await supabase
        .from("menu_items")
        .insert([{ ...form, image_url: imageUrl }]);
      if (!error) toast.success("آیتم با موفقیت افزوده شد.");
    }

    setForm({
      name: "",
      description: "",
      price: 0,
      calories: 0,
      category: categories[0],
      image_url: "",
      available: true,
    });

    setImageFile(null);
    await fetchItems();
    setIsLoading(false);
  };

  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "آیتم حذف خواهد شد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "لغو",
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (!error) {
        toast.success("آیتم حذف شد.");
        await fetchItems();
      } else toast.error("خطا در حذف آیتم.");
      setIsLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      calories: item.calories,
      category: item.category,
      image_url: item.image_url,
      available: item.available,
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 مدیریت منو</h2>

      {/* فرم افزودن یا ویرایش آیتم */}
      <div className="grid gap-3 sm:grid-cols-2 mb-8 border p-4 rounded-lg shadow-sm bg-white">
        {/* نام آیتم */}
        <div className="col-span-full">
          <label className="block mb-1 text-sm font-medium">نام آیتم</label>
          <input
            type="text"
            placeholder="مثلاً پیتزای مخصوص"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* قیمت */}
        <div>
          <label className="block mb-1 text-sm font-medium">قیمت (تومان)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* کالری */}
        <div>
          <label className="block mb-1 text-sm font-medium">کالری</label>
          <input
            type="number"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: +e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* دسته‌بندی */}
        <div>
          <label className="block mb-1 text-sm font-medium">دسته‌بندی</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded w-full"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* انتخاب تصویر */}
        <div>
          <label className="block mb-1 text-sm font-medium">تصویر آیتم</label>
          <label className="border p-2 rounded cursor-pointer flex items-center justify-between bg-gray-50 hover:bg-gray-100">
            <span>{imageFile?.name || "انتخاب فایل"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        {/* توضیحات */}
        <div className="col-span-full">
          <label className="block mb-1 text-sm font-medium">توضیحات</label>
          <textarea
            placeholder="مثلاً شامل گوشت، پنیر، قارچ..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* فعال بودن آیتم */}
        <div className="flex items-center gap-2 col-span-full">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            id="available"
          />
          <label htmlFor="available" className="text-sm">
            این آیتم فعال باشد
          </label>
        </div>

        {/* دکمه ثبت */}
        <div className="col-span-full">
          <button
            onClick={handleSubmit}
            className="ConfirmBTN w-full hover:scale-100"
            disabled={isLoading}
          >
            {isLoading
              ? editId
                ? "در حال ویرایش..."
                : "در حال افزودن..."
              : editId
              ? "ویرایش آیتم"
              : "افزودن آیتم"}
          </button>
        </div>
      </div>

      {/* لیست آیتم‌ها */}
      {isFetching ? (
        <LoadingSpinner text="در حال بارگذاری آیتم‌ها..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="rounded w-full h-40 object-cover"
                />
              )}
              <div className="font-bold text-lg">{item.name}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
              <div className="text-sm">
                💰 {item.price.toLocaleString()} تومان | 🔥 {item.calories}{" "}
                کالری
              </div>
              <div className="text-sm text-gray-500">📂 {item.category}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 EditBTN justify-center"
                  disabled={isLoading}
                >
                  ویرایش
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex-1 DeleteBTN justify-center"
                  disabled={isLoading}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
