export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 uv;
in vec2 position;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision mediump float;

#ifndef PI
    #define PI 3.141592653589793
#endif
#ifndef HALF_PI
    #define HALF_PI 1.5707963267948966
#endif

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

uniform float uTime;
uniform float uProgress;
uniform vec2 uRes;

in vec2 vUv;

out vec4 fragColor;

void main() {
    
    float progress = 0.5;


    vec2 st = gl_FragCoord.xy / uRes.xy;

    float targetRowHeight = 25.0;
    float rowAmount = floor(uRes.y / targetRowHeight);
    float rowHeightInUV = 1.0 / rowAmount;
    float rowIndex = floor((1.0 - vUv.y) / rowHeightInUV);

    vec4 rowColor = vec4(vec3(0.129), 1.0);
    vec4 transparentColor = vec4(0.0);

    float progressMix = step(uProgress * 2.0 - rowIndex / rowAmount, sineInOut(vUv.x));
    fragColor = mix(rowColor, transparentColor, progressMix);
}`;
