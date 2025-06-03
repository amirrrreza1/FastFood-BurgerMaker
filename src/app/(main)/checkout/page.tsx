"use client";

import AddAddressModal from "@/Components/AddAddressModal";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  const router = useRouter();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const handleAddNewAddress = async (newAddress: string) => {
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!res.ok) throw new Error();
      const savedAddress = await res.json(); // فرض: { id, address }

      setAddresses((prev: any[]) => [savedAddress, ...prev]);
      setSelectedAddressId(savedAddress.id); // انتخاب آدرس جدید
      toast.success("آدرس با موفقیت ذخیره شد");
    } catch {
      toast.error("خطا در ذخیره آدرس");
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    if (!selectedAddress) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    setIsLoading(true);

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, name, price, quantity }) => ({
            id,
            name,
            price,
            quantity,
          })),
          total,
          address: selectedAddress, // اضافه شد
          note: orderNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت سفارش");
      } else {
        toast.success("سفارش با موفقیت ثبت شد");
        clearCart();
        router.push("/profile/orders");
      }
    } catch (err) {
      toast.error("مشکلی پیش آمد");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/user/addresses");
        if (!res.ok) throw new Error("Failed to load addresses");
        const data = await res.json();
        console.log(data);

        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0].address);
        } else setIsAddressModalOpen(true);
      } catch {
        toast.error("خطا در دریافت آدرس‌ها");
      }
    };

    fetchAddresses();

    console.log(addresses);
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
        <h1 className="text-2xl font-bold">تایید سفارش</h1>
        {items.length === 0 ? (
          <p>سبد خرید شما خالی است.</p>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    {(item.price * item.quantity).toLocaleString()} تومان
                  </span>
                </div>
              ))}
            </div>

            <div className="text-lg font-semibold">
              مجموع:{" "}
              {items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}{" "}
              تومان
            </div>
            <div>
              <label htmlFor="note" className="block text-sm font-medium mb-1">
                توضیحات سفارش (اختیاری)
              </label>
              <textarea
                id="note"
                className="w-full border rounded p-2 text-sm"
                rows={3}
                placeholder="مثلاً: لطفاً زنگ نزنید، با نگهبان هماهنگ شود..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
            </button>
          </>
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">انتخاب آدرس</h2>
        {addresses.length > 0 ? (
          <select
            className="w-full border p-2 rounded"
            value={selectedAddressId ?? ""}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            {addresses.map((addr: any) => (
              <option key={addr.id} value={addr.id}>
                {addr.address}
              </option>
            ))}
          </select>
        ) : (
          <p>شما هیچ آدرسی ثبت نکرده‌اید.</p>
        )}
        <button
          type="button"
          onClick={() => setIsAddressModalOpen(true)}
          className="text-blue-600 hover:underline text-sm"
        >
          {addresses.length === 0 ? "ثبت آدرس جدید" : "افزودن آدرس جدید"}
        </button>
      </div>
      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddNewAddress}
      />
    </>
  );
}
