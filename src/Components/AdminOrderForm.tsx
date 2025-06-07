"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  phoneNum: string;
};

export default function AdminManualOrder({ adminId }: { adminId: string }) {
  const { items, clearCart } = useCartStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<{ id: string; address: string }[]>(
    []
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [manualAddress, setManualAddress] = useState("");
  const [isPickup, setIsPickup] = useState(false);
  const [note, setNote] = useState("");

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        fetch(`/api/user/search?q=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data.users || []));
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!selectedUser) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    fetch(`/api/user/addresses?user_id=${selectedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        if ((data.addresses || []).length > 0) {
          const defaultAddress = data.addresses.find(
            (addr: any) => addr.is_default
          );
          setSelectedAddressId(defaultAddress?.id || data.addresses[0].id);
        } else {
          setSelectedAddressId(null);
        }
      })
      .catch(() => {
        setAddresses([]);
        setSelectedAddressId(null);
      });
  }, [selectedUser]);

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }

    setLoading(true);

    const selectedAddress =
      manualAddress.trim() ||
      addresses.find((a) => a.id === selectedAddressId)?.address ||
      "سفارش ثبت شده توسط ادمین";

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        total,
        user_id: selectedUser?.id || adminId,
        address: selectedAddress,
        note: note.trim(),
        payment_method: "cash",
      }),
    });

    setLoading(false);

    if (response.ok) {
      toast.success("سفارش با موفقیت ثبت شد");
      clearCart();
      setSelectedUser(null);
      setQuery("");
      setManualAddress("");
      setSelectedAddressId(null);
    } else {
      toast.error("خطا در ثبت سفارش");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold">ثبت سفارش دستی</h2>

      <input
        placeholder="جستجوی شماره اشتراک (شماره تلفن)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedUser(null);
        }}
        className="w-full border p-2 rounded"
      />

      {results.length > 0 && !selectedUser && (
        <div className="border rounded p-2 bg-gray-50 max-h-40 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedUser(user);
                setResults([]);
                setQuery(user.phoneNum);
              }}
            >
              {user.name} - {user.phoneNum}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id="pickup"
          checked={isPickup}
          onChange={(e) => {
            setIsPickup(e.target.checked);
            // اگر حضوری فعال شد، آدرس‌های قبلی رو پاک کن
            if (e.target.checked) {
              setSelectedAddressId(null);
              setManualAddress("");
            }
          }}
        />
        <label htmlFor="pickup" className="font-medium">
          سفارش حضوری (بدون نیاز به آدرس)
        </label>
      </div>

      {/* آدرس */}
      <div className="mt-4 space-y-2">
        {selectedUser && addresses.length > 0 && (
          <>
            <label className="block font-semibold">
              انتخاب از آدرس‌های کاربر:
            </label>
            <select
              value={selectedAddressId || ""}
              onChange={(e) => {
                setSelectedAddressId(e.target.value);
                setManualAddress(""); // آدرس دستی رو خالی کن
              }}
              disabled={isPickup}
              className="w-full border rounded p-2"
            >
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.address}
                </option>
              ))}
            </select>
          </>
        )}

        <label className="block font-semibold">
          یا وارد کردن آدرس دستی (فقط برای این سفارش):
        </label>
        <textarea
          rows={3}
          className="w-full border rounded p-2"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="آدرس را وارد کنید"
          disabled={isPickup}
        />
      </div>
      <div>
        <label htmlFor="note" className="block font-semibold mb-1">
          یادداشت سفارش (اختیاری):
        </label>
        <textarea
          id="note"
          className="w-full border rounded p-2"
          rows={3}
          placeholder="اگر توضیحی دارید اینجا بنویسید..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* پیش‌نمایش سفارش */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold">پیش‌نمایش سفارش:</h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">سبد خرید خالی است</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item: any) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price * item.quantity} تومان</span>
              </li>
            ))}
            <li className="font-bold flex justify-between border-t pt-2">
              <span>جمع کل:</span>
              <span>{total} تومان</span>
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || items.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "در حال ارسال..." : "ثبت سفارش"}
      </button>
    </div>
  );
}
