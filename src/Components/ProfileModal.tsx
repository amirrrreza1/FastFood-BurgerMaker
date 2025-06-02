"use client";

import { useEffect, useState } from "react";
import { profileSchema } from "@/Lib/schemas/account";
import { toast } from "react-toastify";
import { supabase } from "@/Lib/supabase";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: string | null;
  };
  userId: string | null;
  onSave: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    birthDate?: string;
  }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  userId,
  onSave,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setPhone(initialData.phone || "");
      // تبدیل رشته تاریخ میلادی به آبجکت DatePicker شمسی
      if (initialData.birthDate) {
        setBirthDate(new Date(initialData.birthDate));
      } else {
        setBirthDate(null);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    const result = profileSchema.safeParse({
      firstName,
      lastName,
      phone,
    });

    if (!result.success) {
      toast.error(
        "فرم نامعتبر است: " +
          result.error.errors.map((e) => e.message).join("، ")
      );
      return;
    }

    setLoading(true);

    // ذخیره تاریخ به فرمت YYYY-MM-DD میلادی در دیتابیس
    const birthDateISO = birthDate
      ? birthDate.toDate().toISOString().split("T")[0]
      : null;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        name: firstName,
        lastName: lastName,
        phoneNum: phone,
        birthDate: birthDateISO,
      },
      { onConflict: "id" }
    );

    setLoading(false);

    if (error) {
      toast.error("خطا در ذخیره اطلاعات");
    } else {
      toast.success("اطلاعات با موفقیت ذخیره شد");
      onSave({
        firstName,
        lastName,
        phone,
        birthDate: birthDateISO || undefined,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">ویرایش اطلاعات</h2>

        <input
          type="text"
          className="w-full p-2 border rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="نام"
          disabled={loading}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
          disabled={loading}
        />
        <input
          type="tel"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره همراه"
          disabled={loading}
        />

        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={birthDate}
          onChange={setBirthDate}
          inputClass="w-full p-2 border rounded"
          placeholder="تاریخ تولد"
          disabled={loading}
          format="YYYY/MM/DD"
        />

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            لغو
          </button>
          <button
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}
