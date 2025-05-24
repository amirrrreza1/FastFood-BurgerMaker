"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { toast } from "react-toastify";

export default function AccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      const res = await fetch("/api/auth/userID");
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to get user");

      const user_id = json.user_id;

      setUserId(user_id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, lastName, phoneNum")
        .eq("id", user_id)
        .single();

      if (profile) {
        setFirstName(profile.name || "");
        setLastName(profile.lastName || "");
        setPhone(profile.phoneNum || "");
      }

      const { data: addressData } = await supabase
        .from("addresses")
        .select("address")
        .eq("user_id", user_id);

      if (addressData) {
        setAddresses(addressData.map((a) => a.address));
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات کاربر");
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        name: firstName,
        lastName: lastName,
        phoneNum : phone,
      },
      { onConflict: "id" }
    );

    if (error) toast.error("خطا در ذخیره اطلاعات");
    else toast.success("اطلاعات ذخیره شد");

    setLoading(false);
  };

  const handleAddAddress = async () => {
    const { error } = await supabase
      .from("addresses")
      .insert({ user_id: userId, address: newAddress });

    if (error) toast.error("خطا در افزودن آدرس");
    else {
      setAddresses((prev) => [...prev, newAddress]);
      setNewAddress("");
    }
  };

  const handleDeleteAddress = async (address: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("user_id", userId)
      .eq("address", address);

    if (!error) {
      setAddresses((prev) => prev.filter((a) => a !== address));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">اطلاعات حساب کاربری</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <span className="text-sm">نام:</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label>
          <span className="text-sm">نام خانوادگی:</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm">شماره همراه:</span>
          <input
            type="tel"
            className="w-full mt-1 p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
      >
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>

      <hr />

      <h2 className="font-bold">آدرس‌ها</h2>
      <div className="space-y-2">
        {addresses.map((address) => (
          <div
            key={address}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{address}</span>
            <button
              onClick={() => handleDeleteAddress(address)}
              className="text-red-500 text-sm"
            >
              حذف
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="آدرس جدید"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button
            onClick={handleAddAddress}
            className="bg-green-600 text-white px-4 rounded"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
}
