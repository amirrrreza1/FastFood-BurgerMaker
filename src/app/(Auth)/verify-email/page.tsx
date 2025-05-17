// app/verify-email/page.tsx
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">ایمیل خود را تأیید کنید</h1>
        <p className="text-gray-600">
          یک ایمیل تأیید برای شما ارسال شده است. لطفاً ایمیل خود را بررسی کرده و
          روی لینک تأیید کلیک کنید تا ثبت‌نام کامل شود.
        </p>
      </div>
    </div>
  );
}
