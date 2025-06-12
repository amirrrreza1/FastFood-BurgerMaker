"use client";

import { useRouter } from "next/navigation";

export default function BlockedPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center animate-fade-in bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          اکانت شما غیرفعال شده است
        </h1>
        <p className="text-gray-700 mb-6">
          برای رفع مشکل، لطفاً با پشتیبانی تماس بگیرید.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={logout} className="w-full DeleteBTN">
            خروج از حساب
          </button>
          <button onClick={() => router.push("/")} className="w-full CancelBTN">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
}
