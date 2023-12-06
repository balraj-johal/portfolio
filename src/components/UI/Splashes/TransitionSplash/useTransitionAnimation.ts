import { RefObject, useEffect, useMemo } from "react";

import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import { MotionValue, animate } from "framer-motion";

import { EASE_IN_OUT_SINE } from "@/theme/eases";
import { useTransitionStore } from "@/stores/transitionStore";
import { ROUTE_TRANSITION_DURATION } from "@/contexts/applicationState";

import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

const progress = new MotionValue();
progress.set(0);

export const useTransitionAnimation = (
  transitionWrapperRef: RefObject<HTMLDivElement>,
  endCallback?: () => void,
) => {
  const { transitioning, colorSet, changeColorSet, endTransition } =
    useTransitionStore();

  // setup uniforms
  const shaderUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uRes: { value: new Vec2(0, 0) },
      uProgress: { value: 0 },
    };
  }, []);

  useEffect(() => {
    progress.on("change", (value: number) => {
      shaderUniforms.uProgress.value = value;
    });

    const handleAnimationEnd = () => {
      endTransition();
      changeColorSet("primary");
      if (endCallback) endCallback();
    };

    progress.on("animationComplete", handleAnimationEnd);
  }, [endCallback, endTransition, shaderUniforms.uProgress, changeColorSet]);

  useEffect(() => {
    console.warn(colorSet);
  }, [colorSet]);

  useEffect(() => {
    if (transitioning) {
      animate(progress, 1, {
        duration: ROUTE_TRANSITION_DURATION / 1000,
        ease: EASE_IN_OUT_SINE,
      });
    } else {
      animate(progress, 0, {
        duration: 0,
      });
    }
  }, [transitioning]);

  useEffect(() => {
    const wrapper = transitionWrapperRef.current;
    if (!wrapper) return;

    // setup WebGL Canvas
    const renderer = new Renderer({ alpha: true });
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
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program: shaderProgram });

    const renderFrame = (time: number) => {
      requestAnimationFrame(renderFrame);

      shaderProgram.uniforms.uTime.value = time * 0.001;

      renderer.render({ scene: mesh });
    };
    requestAnimationFrame(renderFrame);
  }, [shaderUniforms, transitionWrapperRef]);

  return shaderUniforms;
};
