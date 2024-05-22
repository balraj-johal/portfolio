"use client";

import { useEffect, useRef } from "react";

import { notFound } from "next/navigation";

import { SearchParams } from "@/types/routing";
// import WebGPUExplorationDebug from "@/libs/wgpu/debug";
import WebGPUExploration from "@/libs/wgpu";

import css from "./style.module.scss";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  if (!searchParams.secret) notFound();

  const loadedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (canvasRef.current) {
      const wgpu = new WebGPUExploration({ canvas: canvasRef.current });
      wgpu.initialize();
      // const wgpu = new WebGPUExplorationDebug({ canvas: canvasRef.current });
    }
  });

  return (
    <section className={css.CanvasWrapper}>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
}
