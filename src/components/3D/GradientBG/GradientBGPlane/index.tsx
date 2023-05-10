"use client";

import { useGradientConfig } from "@/contexts/gradient";
import { CurlNoise } from "@/utils/shaders";
import { Plane } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { ShaderMaterial, Vector3, FrontSide } from "three";
import { MousePos } from "..";

const vertexShader = `
varying vec2 vUv;
varying float vNoise;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float time;

#define PI 3.1415926538;

${CurlNoise}

// from https://gist.github.com/yiwenl/3f804e80d0930e34a0b33359259b556c
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

// from https://iquilezles.org/articles/functions/
float pcurve( float x, float a, float b ){
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( x, a ) * pow( 1.0-x, b );
}

// Simplex 2D noise
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float getNoise(vec2 uv, vec2 stretchVector, vec2 scrollVector) {
  uv.x = uv.x * pow(uv.x * 2.0, 1.5);
  // uv.y = uv.y * pow(uv.y, 1.5);
  vec2 newUV = vec2(uv.x * stretchVector.x, uv.y * stretchVector.y) + scrollVector;
  // melt this mf towards the right hand side of the screen

  float noiseScale = 3.0;
  float noise1 = snoise(curl(newUV * noiseScale));
  noise1 = pow(noise1, 3.0);
  float noise2 = snoise(curl(newUV * noiseScale * 0.5));
  noise2 = pow(noise2, 3.0);
  return mix(noise1, noise2, uv.y);
}

vec3 getPosition(float noise, vec3 position) {
  vec3 newPosition = position;
  float displacementAmount = 0.5;
  newPosition.z += noise * displacementAmount;
  return newPosition;
}

void main() {
  vUv = uv;
  
  float horizontalScale = 1.0 / 15.0;
  float scaledTime = time / 15.0;

  vec2 stretchVector = vec2(horizontalScale, 1.0);
  vec2 scrollVector = vec2(0.05 * scaledTime, scaledTime);

  vNoise = getNoise(uv, stretchVector, scrollVector);
  vec3 newPosition = getPosition(vNoise, position);

  // calculate normals
  float sampleOffset = 0.1;

  float xSample = clamp(uv.x + sampleOffset, 0.0, 1.0);
  float neighbourOneNoise = getNoise(vec2(xSample, uv.y), stretchVector, scrollVector);
  vec3 neighbourOne = getPosition(neighbourOneNoise, position);

  float ySample = clamp(uv.y + sampleOffset, 0.0, 1.0);
  float neighbourTwoNoise = getNoise(vec2(uv.x, ySample), stretchVector, scrollVector);
  vec3 neighbourTwo = getPosition(neighbourTwoNoise, position);

  vec3 tangent = normalize(neighbourOne - newPosition);
  vec3 biTangent = normalize(neighbourTwo - newPosition);

  vec3 newNormal = cross(newPosition, biTangent);
  newNormal = normalize(newNormal);
  vNormal = newNormal;

  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vPosition = modelViewPosition.xyz;

  gl_Position = projectionMatrix * modelViewPosition; 
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vNoise;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 lightPosition;

void main() {
  vec3 lightDirection = normalize(lightPosition - vPosition);
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  vec3 halfwayDirection = normalize(lightDirection + viewDirection);

  vec3 lightColor = vec3(0.9);
  vec3 objectColor = vec3(0.9, 0.0, 0.2);

  float ambientStrength = 0.02;
  vec3 ambient = lightColor * ambientStrength;

  float diffuseStrength = 0.05;
  float diff = max(dot(vNormal, lightDirection), 0.0);
  vec3 diffuse = diff * lightColor * diffuseStrength;

  float specularStrength = 0.5;
  float shininess = 0.5;
  float spec = pow(max(dot(vNormal, halfwayDirection), 0.0), shininess);
  vec3 specular = lightColor * spec * specularStrength;

  vec3 totalLightingValue = (ambient + diffuse + specular);
  vec3 result = totalLightingValue * objectColor;

  vec3 color1 = vec3(0.78,0.467,0.353);
  vec3 color2 = vec3(0.443,0.671,0.627);

  gl_FragColor = vec4(result, 1.0);
  gl_FragColor = vec4(mix(color1, color2, (vNoise - 0.2)), 1.0);
  // gl_FragColor = vec4(vec3(vNormal), 1.0);
}
`;

const PLANE_SCALE = 1.5;
const SEGMENTS = 200;
const LIGHT_Z = 5;
const SCROLL_TIME_INFLUENCE = 0.0025;

interface Props {
  mousePos: MutableRefObject<MousePos>;
}

const Z_ROTATION = -0.25;

const GradientBGPlane = ({ mousePos }: Props) => {
  const { scrollDiff } = useGradientConfig();
  const { viewport } = useThree();
  const material = useRef<ShaderMaterial>(null);

  const uniforms = {
    lightPosition: {
      value: new Vector3(mousePos.current.x, mousePos.current.y, LIGHT_Z),
    },
    time: { value: 0.0 },
  };

  useFrame((_, delta) => {
    if (!material.current) return;
    const currentTime = material.current.uniforms.time.value;
    const newTime =
      currentTime + delta + scrollDiff.current * SCROLL_TIME_INFLUENCE;
    material.current.uniforms.time.value = newTime;
    material.current.uniforms.lightPosition.value = new Vector3(
      mousePos.current.x,
      mousePos.current.y,
      LIGHT_Z
    );
  });

  return (
    <Plane
      args={[
        viewport.width * PLANE_SCALE,
        viewport.height * PLANE_SCALE,
        SEGMENTS,
        SEGMENTS,
      ]}
      rotation={[0, 0, Z_ROTATION]}
    >
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        uniformsNeedUpdate={true}
        side={FrontSide}
      />
    </Plane>
  );
};

export default GradientBGPlane;
