"use client";

import { useEffect, useState } from "react";

export default function IntroModal() {
  const [isOpenIntro, setIsOpenIntro] = useState(true);

  useEffect(() => {
    setIsOpenIntro(true);
  }, []);

  const handleClose = () => {
    setIsOpenIntro(false);
  };

  if (!isOpenIntro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">خوش آمدید به همبرگر ساز</h2>
        <p className="text-gray-700 mb-6">
          توی این صفحه شما میتونید یک همبرگر با چیدمان مخصوص خودتون درست کنید و
          اونو سفارش بدید. <br /> از منو آیتم ها میتونید تا حداکثر 3 گوشت و از
          هرکدوم از آیتم های اضافه 1 لایه داشته باشید. <br /> برای افزودن یک
          آیتم به لایه مورد نظر در سمت راست کلیک کنید و یک آیتم اضافه کنید.{" "}
          <br />
          همچنین متونید ترتیب لایه هارو با کشیدن لایه ها عوض کنید <br />
          در آخر هم همبرگر رو در وسط کادر و با شکلی که میخواید ذخیره کنید <br />
          و میتوانید این همبرگر رو داخل صفحه اصلی به سبد خرید خودتون اضافه کنید
        </p>
        <button
          onClick={handleClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  );
}
