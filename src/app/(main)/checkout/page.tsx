"use client";

import AddAddressModal from "@/Components/AddAddressModal";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Address = {
  id: string;
  address: string;
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const router = useRouter();

  // آرایه آدرس‌ها با تایپ دقیق
  const [addresses, setAddresses] = useState<Address[]>([]);

  // فقط رشته آدرس انتخاب شده
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const handleAddNewAddress = async (newAddress: string) => {
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!res.ok) throw new Error();
      const savedAddress: Address = await res.json();

      setAddresses((prev) => [savedAddress, ...prev]);
      setSelectedAddressId(savedAddress.id);
      setSelectedAddress(savedAddress.address);
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

    const total =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 20000; // هزینه ارسال هم اضافه شد

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
          address: selectedAddress,
          note: orderNote,
          paymentMethod, // اگر خواستید ارسال کنید
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
    } catch {
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
        const data: Address[] = await res.json();

        setAddresses(data);

        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
          setSelectedAddress(data[0].address);
        } else {
          setIsAddressModalOpen(true);
        }
      } catch {
        toast.error("خطا در دریافت آدرس‌ها");
      }
    };

    fetchAddresses();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          تأیید نهایی سفارش
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">سبد خرید شما خالی است.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border rounded-lg shadow-sm p-5 space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                مشخصات ارسال
              </h2>

              {/* انتخاب آدرس */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  انتخاب آدرس
                </label>
                {addresses.length > 0 ? (
                  <select
                    className="w-full border p-2 rounded text-sm"
                    value={selectedAddressId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const selected = addresses.find((a) => a.id === id);
                      setSelectedAddressId(id);
                      setSelectedAddress(selected ? selected.address : "");
                    }}
                  >
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.address}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500">
                    شما هیچ آدرسی ثبت نکرده‌اید.
                  </p>
                )}

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                  type="button"
                >
                  {addresses.length === 0
                    ? "ثبت آدرس جدید"
                    : "افزودن آدرس جدید"}
                </button>
              </div>

              {/* انتخاب روش پرداخت */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  روش پرداخت
                </label>
                <select
                  className="w-full border p-2 rounded text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">نقدی</option>
                  <option value="pos">کارت‌خوان سیار</option>
                </select>
              </div>

              {/* یادداشت سفارش */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium mb-1"
                >
                  توضیحات سفارش (اختیاری)
                </label>
                <textarea
                  id="note"
                  className="w-full border p-2 rounded text-sm"
                  rows={3}
                  placeholder="مثلاً: زنگ نزنید، با نگهبان هماهنگ شود..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </div>

              {/* دکمه نهایی کردن */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
              </button>
            </div>
            {/* 🧾 لیست سفارش */}
            <div className="bg-white border rounded-lg shadow-sm p-5 space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                آیتم‌های سفارش
              </h2>
              <div className="divide-y text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <span>هزینه ارسال</span>
                <span className="text-gray-700">20,000 تومان</span>
              </div>

              <div className="text-right text-lg font-bold text-amber-600 mt-2">
                مجموع کل:{" "}
                {(
                  items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ) + 20000
                ).toLocaleString()}{" "}
                تومان
              </div>
            </div>

            {/* 📦 اطلاعات ارسال */}
          </div>
        )}

        {/* 🪟 مودال افزودن آدرس */}
        <AddAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSubmit={handleAddNewAddress}
        />
      </div>
    </>
  );
}
