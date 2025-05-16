"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="w-full h-screen absolute top-0 left-0 bg-[#929292] bg-opacity-50 z-50 flex justify-center items-center">
      <div>
        <p className="text-white text-xl font-bold text-center">همممممم...</p>
        <img
          src="/images/guy-staring-at-computer-meme.svg"
          alt="meme"
          width={500}
          height={500}
        />
        <p className="text-white text-2xl font-bold text-center mt-10">
          صفحه مورد نظر پیدا نشد
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-black text-white rounded block mx-auto cursor-pointer"
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default NotFound;
