"use client";

import { useEffect, useRef } from "react";

import { notFound } from "next/navigation";

import { SearchParams } from "@/types/routing";

import css from "./style.module.scss";
import WebGPUExplorationCompute from ".";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  if (!searchParams.secret) notFound();

  const loadedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log('render')

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (canvasRef.current) {
      const wgpu = new WebGPUExplorationCompute({ canvas: canvasRef.current });
      wgpu.start();
    }
  });

  return (
    <section className={css.CanvasWrapper}>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
}
