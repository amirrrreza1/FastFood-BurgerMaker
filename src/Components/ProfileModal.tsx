// components/EditProfileModal.tsx
"use client";

import { useState } from "react";
import { profileSchema } from "@/Lib/schemas/account";
import { toast } from "react-toastify";
import { supabase } from "@/Lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  userId: string | null;
  onSave: (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  userId,
  onSave,
}: Props) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [phone, setPhone] = useState(initialData.phone);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const result = profileSchema.safeParse({ firstName, lastName, phone });

    if (!result.success) {
      toast.error(
        "فرم نامعتبر است: " +
          result.error.errors.map((e) => e.message).join("، ")
      );
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        name: firstName,
        lastName: lastName,
        phoneNum: phone,
      },
      { onConflict: "id" }
    );

    if (error) {
      toast.error("خطا در ذخیره اطلاعات");
    } else {
      toast.success("اطلاعات ویرایش شد");
      onSave({ firstName, lastName, phone });
      onClose();
    }

    setLoading(false);
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
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
        />
        <input
          type="tel"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره همراه"
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
            className="bg-amber-500 text-white px-4 py-2 rounded"
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
