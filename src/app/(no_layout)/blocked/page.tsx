"use client";

export default function BlockedPage() {

    const logout = async () => {
        await fetch("/api/auth/logout" , {method: "POST"});
        window.location.reload();
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        اکانت شما غیرفعال شده است
      </h1>
      <p className="text-gray-700">
        برای رفع مشکل، لطفاً با پشتیبانی تماس بگیرید.
      </p>
      <button
        onClick={() => logout()}
        className="mt-6 px-4 py-2 bg-gray-800 text-white rounded"
      >
        خروج از حساب
      </button>
    </div>
  );
}
