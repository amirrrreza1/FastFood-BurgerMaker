"use client";

import AddAddressModal from "@/Components/AddAddressModal";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Address = {
  id: string;
  address: string;
  is_default: boolean; // برای مشخص کردن آدرس پیش‌فرض
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
          payment_method: paymentMethod, // اگر خواستید ارسال کنید
          order_type: "online",
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

        const response = await res.json();

        // انتظار داریم response به شکل { addresses: [...] } باشه
        if (!Array.isArray(response.addresses)) {
          throw new Error("Invalid address data");
        }

        const addressesArray = response.addresses;

        setAddresses(addressesArray);

        if (addressesArray.length > 0) {
          const defaultAddress = addressesArray.find(
            (addr: any) => addr.is_default
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setSelectedAddress(defaultAddress.address);
          } else {
            setSelectedAddressId(addressesArray[0].id);
            setSelectedAddress(addressesArray[0].address);
          }
        } else {
          setIsAddressModalOpen(true);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
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
                <div className="space-y-2">
                  {selectedAddress && (
                    <div className="bg-gray-50 border border-[var(--color-primary)] rounded-lg p-3 text-sm text-gray-700 shadow-sm">
                      <p className="mb-1 font-medium">آدرس انتخاب شده:</p>
                      <p>{selectedAddress}</p>
                    </div>
                  )}

                  <label className="block text-sm font-medium mb-1">
                    تغییر آدرس
                  </label>
                  <select
                    className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={selectedAddressId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const selected = addresses.find((a) => a.id === id); // ✅ درست شد
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
                </div>

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="p-2 mt-2 bg-[var(--color-primary)] text-white rounded-lg hover:-translate-y-1 transition-all duration-300 hover:shadow-l"
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
                className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
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

              <div className="text-right text-lg font-bold text-[var(--color-primary)] mt-2">
                مجموع کل:
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
