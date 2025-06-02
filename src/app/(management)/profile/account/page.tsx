"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { toast } from "react-toastify";
import { addressSchema } from "@/Lib/schemas/account";
import AddAddressModal from "@/Components/AddAddressModal";
import EditProfileModal from "@/Components/ProfileModal";

export default function AccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<string | undefined>(undefined);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/userID");
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to get user");

      const user_id = json.user_id;
      setUserId(user_id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, lastName, phoneNum, birthDate")
        .eq("id", user_id)
        .single();

      if (profile) {
        setFirstName(profile.name || "");
        setLastName(profile.lastName || "");
        setPhone(profile.phoneNum || "");
        setBirthDate(profile.birthDate || null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleDeleteAddress = async (address: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("user_id", userId)
      .eq("address", address);

    if (!error) {
      setAddresses((prev) => prev.filter((a) => a !== address));
      toast.success("آدرس حذف شد");
    } else {
      toast.error("خطا در حذف آدرس");
    }
  };

  const birthDateFormatted = birthDate
    ? new Date(birthDate).toLocaleDateString("fa-IR") // یا دستی فرمت کن
    : "-";


  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">اطلاعات حساب کاربری</h1>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm">نام:</span>
              <p className="p-2 border rounded">{firstName || "-"}</p>
            </div>

            <div>
              <span className="text-sm">نام خانوادگی:</span>
              <p className="p-2 border rounded">{lastName || "-"}</p>
            </div>

            <div className="md:col-span-2">
              <span className="text-sm">شماره همراه:</span>
              <p className="p-2 border rounded">{phone || "-"}</p>
            </div>

            <div className="md:col-span-2">
              <span className="text-sm">تاریخ تولد:</span>
              <p className="p-2 border rounded">{birthDateFormatted}</p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
          >
            ویرایش اطلاعات
          </button>
        </div>

        <hr />

        <h2 className="font-bold">آدرس‌ها</h2>
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span>{address}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteAddress(address)}
                  className="text-red-500 text-sm"
                >
                  حذف
                </button>
                <button
                  onClick={() => {
                    setEditAddress(address);
                    setShowModal(true);
                  }}
                  className="text-blue-500 text-sm"
                >
                  ویرایش
                </button>
              </div>
            </div>
          ))}

          <div>
            <button
              onClick={() => {
                setEditAddress(undefined);
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              افزودن آدرس جدید
            </button>
          </div>
        </div>
      </div>

      <AddAddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditAddress(undefined);
        }}
        initialAddress={editAddress}
        onSubmit={async (newAddress, oldAddress) => {
          const result = addressSchema.safeParse({ address: newAddress });

          if (!result.success) {
            toast.error(
              "آدرس نامعتبر است: " +
                result.error.errors.map((e) => e.message).join("، ")
            );
            return;
          }

          if (oldAddress) {
            const { error } = await supabase
              .from("addresses")
              .update({ address: newAddress })
              .eq("user_id", userId)
              .eq("address", oldAddress);

            if (error) toast.error("خطا در ویرایش آدرس");
            else {
              setAddresses((prev) =>
                prev.map((a) => (a === oldAddress ? newAddress : a))
              );
              toast.success("آدرس ویرایش شد");
              setShowModal(false);
            }
          } else {
            const { error } = await supabase
              .from("addresses")
              .insert({ user_id: userId, address: newAddress });

            if (error) toast.error("خطا در افزودن آدرس");
            else {
              setAddresses((prev) => [...prev, newAddress]);
              toast.success("آدرس افزوده شد");
              setShowModal(false);
            }
          }
        }}
      />

      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={userId}
        initialData={{
          firstName,
          lastName,
          phone,
          birthDate: birthDate,
        }}
        onSave={({ firstName, lastName, phone, birthDate }) => {
          setFirstName(firstName);
          setLastName(lastName);
          setPhone(phone);
          setBirthDate(birthDate || null);
        }}
      />
    </>
  );
}
