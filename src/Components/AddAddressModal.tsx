"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { detailedAddressSchema } from "@/Lib/schemas/account";

type AddAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newAddress: string, oldAddress?: string) => Promise<void>;
  initialAddress?: string;
};

export default function AddAddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialAddress,
}: AddAddressModalProps) {
  const [street, setStreet] = useState("");
  const [alley, setAlley] = useState("");
  const [plaque, setPlaque] = useState("");
  const [unit, setUnit] = useState("");
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
    } else {
      setStreet("");
      setAlley("");
      setPlaque("");
      setUnit("");
    }
  }, [initialAddress, isOpen]);

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
    await onSubmit(fullAddress, initialAddress);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">
          {initialAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}
        </h2>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="خیابان"
            className="w-full border p-2 rounded"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <input
            type="text"
            placeholder="کوچه"
            className="w-full border p-2 rounded"
            value={alley}
            onChange={(e) => setAlley(e.target.value)}
          />
          <input
            type="text"
            placeholder="پلاک"
            className="w-full border p-2 rounded"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
          />
          <input
            type="text"
            placeholder="واحد"
            className="w-full border p-2 rounded"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-600">
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-1 rounded"
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
