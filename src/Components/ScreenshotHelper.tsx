import { useThree } from "@react-three/fiber";
import { useImperativeHandle, forwardRef } from "react";

const ScreenshotHelper = forwardRef((props, ref) => {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    },
  }));

  return null;
});

export default ScreenshotHelper;
