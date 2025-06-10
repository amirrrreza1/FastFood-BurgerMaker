"use client";

import { useCartStore } from "@/store/cartStore";
import { UserProfile } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminManualOrder({ adminId }: { adminId: string }) {
  const { items, clearCart } = useCartStore();
  const [query, setQuery] = useState<any>("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "pos">("cash");
  const [addresses, setAddresses] = useState<{ id: string; address: string }[]>(
    []
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [manualAddress, setManualAddress] = useState("");
  const [note, setNote] = useState("");
  const [orderType, setOrderType] = useState<"in_person" | "phone">(
    "in_person"
  );

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
      orderType === "in_person"
        ? "سفارش حضوری"
        : manualAddress.trim() ||
          addresses.find((a) => a.id === selectedAddressId)?.address ||
          "آدرس وارد نشده";

    const response = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items,
        total,
        user_id: selectedUser?.id || adminId,
        address: selectedAddress,
        note: note.trim(),
        payment_method: paymentMethod,
        order_type: orderType,
      }),
    });

    setLoading(false);
    const data = await response.json();

    if (response.ok) {
      toast.success("سفارش با موفقیت ثبت شد");
      clearCart();
      setSelectedUser(null);
      setQuery("");
      setManualAddress("");
      setSelectedAddressId(null);
    } else {
      toast.error(data.error || "خطا در ثبت سفارش");
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6 bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center">ثبت سفارش دستی</h2>

      <input
        placeholder="جستجوی شماره اشتراک (شماره تلفن)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedUser(null);
        }}
        disabled={loading}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />

      {results.length > 0 && !selectedUser && (
        <div className="border rounded-lg p-2 bg-gray-100 max-h-40 overflow-y-auto space-y-1">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-blue-100 rounded"
              onClick={() => {
                setSelectedUser(user);
                setResults([]);
                setQuery(user.phoneNum);
              }}
            >
              <span className="font-medium">{user.name || user.email}</span> -{" "}
              {user.phoneNum || user.display_name}
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold block">نوع سفارش:</label>
          <select
            value={orderType}
            onChange={(e) => {
              const value = e.target.value as "in_person" | "phone";
              setOrderType(value);
              if (value === "in_person") {
                setSelectedAddressId(null);
                setManualAddress("");
              }
            }}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="in_person">حضوری</option>
            <option value="phone">تلفنی</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">روش پرداخت:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "cash" | "pos")}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="cash">نقدی</option>
            <option value="pos">کارت‌خوان</option>
          </select>
        </div>
      </div>

      {orderType === "phone" && (
        <div className="space-y-3">
          {selectedUser && addresses.length > 0 && (
            <div>
              <label className="font-semibold block">آدرس‌های ذخیره شده:</label>
              <select
                value={selectedAddressId || ""}
                onChange={(e) => {
                  setSelectedAddressId(e.target.value);
                  setManualAddress("");
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="font-semibold block">آدرس دستی:</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="آدرس را وارد کنید"
            />
          </div>
        </div>
      )}

      <div>
        <label className="font-semibold block mb-1">
          یادداشت سفارش (اختیاری):
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="اگر توضیحی دارید اینجا بنویسید..."
        />
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">پیش‌نمایش سفارش:</h3>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">سبد خرید خالی است</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString()} تومان
                </span>
              </li>
            ))}
            <li className="font-bold flex justify-between border-t pt-2">
              <span>جمع کل:</span>
              <span>{total.toLocaleString()} تومان</span>
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || items.length === 0}
        className="ConfirmBTN w-full disabled:opacity-50 hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? "در حال ارسال..." : "ثبت سفارش"}
      </button>
    </div>
  );
}
