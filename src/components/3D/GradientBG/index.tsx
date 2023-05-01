"use client";

import Canvas from "@/components/3D/Canvas";
import { Box, OrbitControls } from "@react-three/drei";
import GradientBGPlane from "./GradientBGPlane";

const GradientBG = () => (
  <Canvas>
    <GradientBGPlane />
  </Canvas>
);

export default GradientBG;
