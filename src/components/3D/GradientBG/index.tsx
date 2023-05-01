"use client";

import Canvas from "@/components/3D/Canvas";
import { OrbitControls } from "@react-three/drei";
import GradientBGPlane from "./GradientBGPlane";

const GradientBG = () => (
  <Canvas>
    <OrbitControls />
    <GradientBGPlane />
  </Canvas>
);

export default GradientBG;
