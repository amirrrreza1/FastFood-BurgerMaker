"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import { toast } from "react-toastify";
import AddAddressModal from "@/Components/AddAddressModal";
import EditProfileModal from "@/Components/ProfileModal";
import Swal from "sweetalert2";
import LoadingSpinner from "@/Components/Loading";

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
    } else {
      toast.error("خطا در حذف آدرس");
    }
  };

  const birthDateFormatted = birthDate
    ? new Date(birthDate).toLocaleDateString("fa-IR")
    : "-";

  if (loading) return <LoadingSpinner text="در حال دریافت اطلاعات حساب کاربری..." />;

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-center md:text-right">
          اطلاعات حساب کاربری
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-700">نام:</span>
            <p className="p-2 border rounded bg-white">{firstName || "-"}</p>
          </div>

          <div>
            <span className="text-sm text-gray-700">نام خانوادگی:</span>
            <p className="p-2 border rounded bg-white">{lastName || "-"}</p>
          </div>

          <div>
            <span className="text-sm text-gray-700">شماره همراه:</span>
            <p className="p-2 border rounded bg-white">{phone || "-"}</p>
          </div>

          <div>
            <span className="text-sm text-gray-700">تاریخ تولد:</span>
            <p className="p-2 border rounded bg-white">{birthDateFormatted}</p>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <button
            onClick={() => setShowProfileModal(true)}
            className="EditBTN mt-4 sm:mt-0"
          >
            ویرایش اطلاعات
          </button>
        </div>

        <hr className="my-6" />

        <h2 className="font-bold text-center sm:text-right">آدرس‌ها</h2>
        <div className="space-y-4">
          {addresses.map((item) => (
            <div
              key={item.address}
              className="flex flex-col sm:flex-row sm:items-center justify-between border gap-3 p-4 rounded bg-white"
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Radio button برای انتخاب پیش‌فرض */}
                <input
                  type="radio"
                  name="defaultAddress"
                  checked={item.is_default}
                  onChange={async () => {
                    if (!userId) return;
                    try {
                      // مرحله 1: حذف پیش‌فرض قبلی
                      await supabase
                        .from("addresses")
                        .update({ is_default: false })
                        .eq("user_id", userId);

                      // مرحله 2: تعیین آدرس فعلی به عنوان پیش‌فرض
                      await supabase
                        .from("addresses")
                        .update({ is_default: true })
                        .eq("user_id", userId)
                        .eq("address", item.address);

                      // مرحله 3: به‌روزرسانی state
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
                  className="accent-green-600"
                />
                <div className="text-sm break-words">{item.address}</div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <button
                  className="EditBTN"
                  onClick={() => {
                    setEditAddress(item);
                    setShowModal(true);
                  }}
                >
                  ویرایش
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "آیا مطمئن هستید؟",
                      text: "این آدرس برای همیشه حذف خواهد شد!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "بله، حذف کن",
                      cancelButtonText: "لغو",
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleDeleteAddress(item.address);
                        Swal.fire(
                          "حذف شد!",
                          "آدرس با موفقیت حذف شد.",
                          "success"
                        );
                      }
                    });
                  }}
                  className="DeleteBTN"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          <div className="text-center sm:text-right">
            <button
              onClick={() => {
                setEditAddress(undefined);
                setShowModal(true);
              }}
              className="ConfirmBTN"
            >
              افزودن آدرس جدید
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditAddress(undefined);
        }}
        initialAddress={editAddress?.address}
        initialIsDefault={editAddress?.is_default ?? false}
        onSubmit={async (newAddress, oldAddress, isDefault) => {
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
