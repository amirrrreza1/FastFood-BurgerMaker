"use client";

import { useEffect, useState } from "react";
import { profileSchema } from "@/Lib/schemas/account";
import { toast } from "react-toastify";
import { supabase } from "@/Lib/supabase";

import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
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
  const ValueDate = new Date(birthDate).toLocaleDateString("fa-IR");


  useEffect(() => {
    if (isOpen) {
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setPhone(initialData.phone || "");

      if (initialData.birthDate) {
        // اطمینان از اینکه birthDate در فرمت YYYY-MM-DD از دیتابیس اومده
        setBirthDate(
          new DateObject({
            date: initialData.birthDate,
          })
        );
      } else {
        setBirthDate(null);
      }
    }
    console.log(birthDate);
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

    if (!userId) {
      toast.error("شناسه کاربر نامشخص است");
      return;
    }

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
      if (error) {
        console.error("Error saving profile:", error);
        toast.error("خطا در ذخیره اطلاعات: " + error.message);
      }
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-center">ویرایش اطلاعات</h2>
        <label htmlFor="firstName" className="mr-1">
          نام:
        </label>
        <input
          type="text"
          id="firstName"
          className="Input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="نام"
          disabled={loading}
        />
        <label htmlFor="lastName" className="mr-1">
          نام خانوادگی:
        </label>
        <input
          type="text"
          id="lastName"
          className="Input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
          disabled={loading}
        />
        <label htmlFor="phone" className="mr-1">
          شماره همراه:
        </label>
        <input
          type="tel"
          id="phone"
          className="Input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره همراه"
          disabled={loading}
        />
        <div className="flex flex-col">
          <label htmlFor="birthDate" className="mr-1">
            تاریخ تولد:
          </label>
          <div className="flex items-center gap-2 Input">
            <label htmlFor="birthDate" className="">
              <img src="/images/svg/date.svg" alt="date" width={30} />
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={ValueDate}
              id="birthDate"
              onChange={setBirthDate}
              format="YYYY/MM/DD"
              inputClass="border-none text-start outline-none"
              placeholder="تاریخ تولد"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="CancelBTN" onClick={onClose} disabled={loading}>
            لغو
          </button>
          <button
            className="ConfirmBTN"
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
