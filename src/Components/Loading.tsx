"use client";

import { FC } from "react";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  text = "در حال بارگذاری...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "h-screen" : "h-full"
      } w-full text-center gap-4`}
    >
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
