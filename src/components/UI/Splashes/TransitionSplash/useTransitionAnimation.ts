import { RefObject, useEffect, useRef } from "react";

import { Mesh, Program, Renderer, Triangle, Vec2, Vec3 } from "ogl";
import { MotionValue, animate } from "framer-motion";

import { EASE_IN_OUT_SINE } from "@/theme/eases";
import { useTransitionStore } from "@/stores/transitionStore";
import { ROUTE_TRANSITION_DURATION } from "@/contexts/applicationState";
import { COLOR_SCHEMES_GLSL } from "@/config/transition";

import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

// setup uniforms
const shaderUniforms = {
  uTime: { value: 0 },
  uRes: { value: new Vec2(0, 0) },
  uColor: { value: new Vec3(COLOR_SCHEMES_GLSL.secondary.foreground) },
  uProgress: { value: 0 },
};

// setup transition progress motion value and listeners
const progress = new MotionValue();
progress.set(0);

export const useTransitionAnimation = (
  transitionWrapperRef: RefObject<HTMLDivElement>,
) => {
  const {
    transitioning,
    transitionOverlayVisible,
    endTransition,
    bgColor,
    toggleBgColor,
    toggleTransitionColor,
  } = useTransitionStore();
  const canvasReady = useRef(false);

  useEffect(() => {
    progress.on("change", (value: number) => {
      shaderUniforms.uProgress.value = value;
    });

    // TODO: why does this event listener trigger twice?
    progress.on("animationComplete", endTransition);

    return () => progress.clearListeners();
  }, [endTransition, toggleBgColor]);

  useEffect(() => {
    if (!transitioning) return;
    animate(progress, 1, {
      duration: ROUTE_TRANSITION_DURATION / 1000,
      ease: EASE_IN_OUT_SINE,
      onComplete() {
        toggleBgColor();
      },
    });
  }, [toggleBgColor, transitioning]);

  useEffect(() => {
    if (transitionOverlayVisible) return;
    animate(progress, 0, { duration: 0 });
    toggleTransitionColor();
  }, [toggleTransitionColor, transitionOverlayVisible]);

  useEffect(() => {
    shaderUniforms.uColor.value = new Vec3(
      COLOR_SCHEMES_GLSL[bgColor].foreground,
    );
  }, [bgColor]);

  useEffect(() => {
    const wrapper = transitionWrapperRef.current;
    if (!wrapper || canvasReady.current === true) return;

    // setup WebGL Canvas
    const renderer = new Renderer({ alpha: true });
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
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program: shaderProgram });

    const renderFrame = (time: number) => {
      requestAnimationFrame(renderFrame);

      shaderProgram.uniforms.uTime.value = time * 0.001;

      renderer.render({ scene: mesh });
    };
    requestAnimationFrame(renderFrame);
  }, [transitionWrapperRef]);

  return shaderUniforms;
};
