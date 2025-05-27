// ScreenshotHelper.tsx
"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

type Props = {
  onReady: (canvas: HTMLCanvasElement) => void;
};

export function ScreenshotHelper({ onReady }: Props) {
  const { gl } = useThree();

  useEffect(() => {
    if (gl.domElement) {
      onReady(gl.domElement);
    }
  }, [gl]);

  return null;
}
