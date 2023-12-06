export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 uv;
in vec2 position;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision mediump float;

uniform float uColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(vec3(uColor), 0.0);

}`;
