"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { toast } from "react-toastify";
import { addressSchema } from "@/Lib/schemas/account";
import AddAddressModal from "@/Components/AddAddressModal";
import EditProfileModal from "@/Components/ProfileModal";

type AddressItem = {
  address: string;
  is_default: boolean;
};

export default function AccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<AddressItem | undefined>(
    undefined
  );

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
        .select("address, is_default")
        .eq("user_id", user_id);

      if (addressData) {
        setAddresses(addressData);
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
      setAddresses((prev) => prev.filter((a) => a.address !== address));
      toast.success("آدرس حذف شد");
    } else {
      toast.error("خطا در حذف آدرس");
    }
  };

  const birthDateFormatted = birthDate
    ? new Date(birthDate).toLocaleDateString("fa-IR")
    : "-";

  if (loading) return <p>در حال بارگذاری...</p>;

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
          {addresses.map((item) => (
            <div
              key={item.address}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span>
                {item.address}
                {item.is_default && (
                  <span className="text-green-600 text-sm mr-2">(پیش‌فرض)</span>
                )}
              </span>
              <div className="flex gap-2">
                {!item.is_default && (
                  <button
                    onClick={async () => {
                      if (!userId) return;
                      try {
                        // مرحله 1: حذف پیش‌فرض قبلی در دیتابیس
                        await supabase
                          .from("addresses")
                          .update({ is_default: false })
                          .eq("user_id", userId);

                        // مرحله 2: تعیین آدرس جدید به عنوان پیش‌فرض
                        await supabase
                          .from("addresses")
                          .update({ is_default: true })
                          .eq("user_id", userId)
                          .eq("address", item.address);

                        // مرحله 3: آپدیت دستی state addresses
                        setAddresses((prev) =>
                          prev.map((a) => ({
                            ...a,
                            is_default: a.address === item.address,
                          }))
                        );

                        toast.success("آدرس به عنوان پیش‌فرض انتخاب شد");
                      } catch {
                        toast.error("خطا در تنظیم آدرس پیش‌فرض");
                      }
                    }}
                    className="text-amber-600 text-sm"
                  >
                    انتخاب به عنوان پیش‌فرض
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(item.address)}
                  className="text-red-500 text-sm"
                >
                  حذف
                </button>
                <button
                  onClick={() => {
                    setEditAddress(item);
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
        initialAddress={editAddress?.address}
        initialIsDefault={editAddress?.is_default ?? false}
        onSubmit={async (newAddress, oldAddress, isDefault) => {
          const result = addressSchema.safeParse({ address: newAddress });
          if (!result.success) {
            toast.error(
              "آدرس نامعتبر است: " +
                result.error.errors.map((e) => e.message).join("، ")
            );
            return;
          }

          if (!userId) return;

          if (isDefault) {
            await supabase
              .from("addresses")
              .update({ is_default: false })
              .eq("user_id", userId);
          }

          if (oldAddress) {
            const { error } = await supabase
              .from("addresses")
              .update({ address: newAddress, is_default: isDefault || false })
              .eq("user_id", userId)
              .eq("address", oldAddress);

            if (error) toast.error("خطا در ویرایش آدرس");
            else {
              await loadUserData();
              toast.success("آدرس ویرایش شد");
              setShowModal(false);
            }
          } else {
            const { error } = await supabase.from("addresses").insert({
              user_id: userId,
              address: newAddress,
              is_default: isDefault || false,
            });

            if (error) toast.error("خطا در افزودن آدرس" + error.message);
            else {
              await loadUserData();
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
          birthDate,
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
