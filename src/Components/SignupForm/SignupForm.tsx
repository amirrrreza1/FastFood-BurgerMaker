"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/Lib/firebase";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await Swal.fire({
      title: "ارسال کد تایید",
      text: "آیا از صحت اطلاعات وارد شده اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله، ارسال کن",
      cancelButtonText: "لغو",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const res = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("ارسال کد تایید با خطا مواجه شد");

      toast.success("کد تایید به ایمیل ارسال شد");
      setCodeSent(true);
    } catch (error: any) {
      toast.error(error.message || "خطایی رخ داد در ارسال کد");
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!res.ok) throw new Error("کد وارد شده صحیح نیست");

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await fetch("/api/save-user-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          family,
          phone,
        }),
      });

      toast.success("ثبت‌نام با موفقیت انجام شد!");

      // ⬇️ هدایت به صفحه لاگین
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "خطا در تأیید یا ساخت حساب");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md">
      {!codeSent ? (
        <form
          onSubmit={handleSendVerificationCode}
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold text-center">ثبت‌نام</h2>

          <input
            type="text"
            placeholder="نام"
            className="p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            className="p-2 border rounded"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="شماره همراه"
            className="p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="ایمیل"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded"
          >
            ارسال کد تایید
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyAndRegister}
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold text-center">تأیید کد</h2>

          <input
            type="text"
            placeholder="کد تایید ارسال شده"
            className="p-2 border rounded"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            تأیید و ساخت حساب
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
