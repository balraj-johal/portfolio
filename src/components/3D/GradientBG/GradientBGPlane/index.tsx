"use client";

import { Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const vertexShader = `
varying vec3 vUv; 

void main() {
  vUv = position; 

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;
const fragmentShader = `
varying vec3 vUv;

void main() {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}
`;

const GradientBGPlane = () => {
  const { viewport } = useThree();

  return (
    <Plane args={[viewport.width, viewport.height]}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </Plane>
  );
};

export default GradientBGPlane;
