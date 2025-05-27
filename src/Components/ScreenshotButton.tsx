"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function ScreenshotButton() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvasRef.current = canvas as HTMLCanvasElement;
    }
  }, []);

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "burger.png";
      link.click();
    }
  };

  return (
    <button
      onClick={takeScreenshot}
      className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-4 py-2 rounded"
    >
      📸 ذخیره تصویر همبرگر
    </button>
  );
}
