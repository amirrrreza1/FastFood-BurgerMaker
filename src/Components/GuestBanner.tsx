"use client";

import { useAuthSession } from "@/Lib/useAuthSession";

export default function GuestBanner() {
  const { isGuest, loading } = useAuthSession();

  if (loading || !isGuest) return null;

  return (
    <div className="w-full bg-blue-100 text-blue-500 text-sm px-4 py-2 text-center">
      شما به عنوان مهمان وارد شده اید.
    </div>
  );
}
