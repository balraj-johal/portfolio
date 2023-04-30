"use client";

import { Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const GradientBGPlane = () => {
  const { viewport } = useThree();

  return (
    <Plane args={[viewport.width, viewport.height]}>
      <meshBasicMaterial color="hotpink" />
    </Plane>
  );
};

export default GradientBGPlane;
