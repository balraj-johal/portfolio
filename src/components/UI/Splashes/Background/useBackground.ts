import { RefObject, useEffect, useRef } from "react";

import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";

import { useTransitionStore } from "@/stores/transitionStore";
import { COLOR_SCHEMES_GLSL } from "@/config/transition";

import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

// setup uniforms
const shaderUniforms = {
  uTime: { value: 0 },
  uRes: { value: new Vec2(0, 0) },
  uProgress: { value: 0 },
  uColor: { value: 0.99 },
};

export const useBackground = (
  transitionWrapperRef: RefObject<HTMLDivElement>,
) => {
  const { bgColor, hideTransitionOverlay } = useTransitionStore();
  const canvasReady = useRef(false);

  useEffect(() => {
    shaderUniforms.uColor.value = COLOR_SCHEMES_GLSL[bgColor].background;
    setTimeout(() => {
      hideTransitionOverlay();
    }, 0.1);
  }, [bgColor, hideTransitionOverlay]);

  useEffect(() => {
    const wrapper = transitionWrapperRef.current;
    if (!wrapper || canvasReady.current === true) return;

    // setup WebGL Canvas
    const renderer = new Renderer();
    const gl = renderer.gl;
    wrapper.appendChild(gl.canvas);
    canvasReady.current = true;

    // setup resize handlers
    const handleResize = () => {
      const height = window.innerHeight;
      const width = document.body.clientWidth;
      renderer.setSize(width, height);
      shaderUniforms.uRes.value.x = width;
      shaderUniforms.uRes.value.y = height;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // setup full screen tri
    const geometry = new Triangle(gl);

    // create shader program
    const shaderProgram = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: shaderUniforms,
    });

    const mesh = new Mesh(gl, { geometry, program: shaderProgram });

    const renderFrame = (time: number) => {
      requestAnimationFrame(renderFrame);

      shaderProgram.uniforms.uTime.value = time * 0.00025;

      renderer.render({ scene: mesh });
    };
    requestAnimationFrame(renderFrame);
  }, [transitionWrapperRef]);
};
