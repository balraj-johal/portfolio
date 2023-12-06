import { RefObject, useEffect, useMemo } from "react";

import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";

import { useTransitionStore } from "@/stores/transitionStore";

import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

export const useBackground = (
  transitionWrapperRef: RefObject<HTMLDivElement>,
) => {
  const { colorSet } = useTransitionStore();

  // setup uniforms
  const shaderUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uRes: { value: new Vec2(0, 0) },
      uProgress: { value: 0 },
      uColor: { value: 0.99 },
    };
  }, []);

  useEffect(() => {
    console.log("color set changed");
    console.log(colorSet);
    shaderUniforms.uColor.value = colorSet === "primary" ? 0.99 : 0.129;
  }, [colorSet, shaderUniforms.uColor]);

  useEffect(() => {
    const wrapper = transitionWrapperRef.current;
    if (!wrapper) return;

    // setup WebGL Canvas
    const renderer = new Renderer();
    const gl = renderer.gl;
    wrapper.appendChild(gl.canvas);

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
  }, [shaderUniforms, transitionWrapperRef]);
};
