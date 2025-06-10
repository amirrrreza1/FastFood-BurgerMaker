"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { detailedAddressSchema } from "@/Lib/schemas/account";

type AddAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    newAddress: string,
    oldAddress?: string,
    isDefault?: boolean
  ) => Promise<void>;
  initialAddress?: string;
  initialIsDefault?: boolean;
};

export default function AddAddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialAddress,
  initialIsDefault = false,
}: AddAddressModalProps) {
  const [street, setStreet] = useState("");
  const [alley, setAlley] = useState("");
  const [plaque, setPlaque] = useState("");
  const [unit, setUnit] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      const match = initialAddress.match(
        /خیابان (.+?)، کوچه (.+?)، پلاک (.+?)، واحد (.+)/
      );
      if (match) {
        setStreet(match[1]);
        setAlley(match[2]);
        setPlaque(match[3]);
        setUnit(match[4]);
      }
      setIsDefault(initialIsDefault);
    } else {
      setStreet("");
      setAlley("");
      setPlaque("");
      setUnit("");
      setIsDefault(false);
    }
  }, [initialAddress, isOpen, initialIsDefault]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const result = detailedAddressSchema.safeParse({
      street,
      alley,
      plaque,
      unit,
    });

    if (!result.success) {
      toast.error(
        "خطا در فرم: " + result.error.errors.map((e) => e.message).join("، ")
      );
      return;
    }

    const fullAddress = `خیابان ${street}، کوچه ${alley}، پلاک ${plaque}، واحد ${unit}`;

    setLoading(true);
    await onSubmit(fullAddress, initialAddress, isDefault);
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">
          {initialAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}
        </h2>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">خیابان</label>
            <input
              type="text"
              placeholder="مثلاً ولیعصر"
              className="Input w-full"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">کوچه</label>
            <input
              type="text"
              placeholder="مثلاً ۱۲"
              className="Input w-full"
              value={alley}
              onChange={(e) => setAlley(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">پلاک</label>
            <input
              type="text"
              placeholder="مثلاً ۸"
              className="Input w-full"
              value={plaque}
              onChange={(e) => setPlaque(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">واحد</label>
            <input
              type="text"
              placeholder="مثلاً ۲"
              className="Input w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded"
            />
            <span className="text-sm">این آدرس به عنوان پیش‌فرض تنظیم شود</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="CancelBTN">
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="ConfirmBTN"
            disabled={loading}
          >
            {loading
              ? "در حال ذخیره..."
              : initialAddress
              ? "ذخیره تغییرات"
              : "افزودن"}
          </button>
        </div>
      </div>
    </div>
  );
}
