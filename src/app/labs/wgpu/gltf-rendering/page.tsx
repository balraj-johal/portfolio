"use client";

import { useEffect, useRef } from "react";

import { notFound } from "next/navigation";

import { SearchParams } from "@/types/routing";

import css from "./style.module.scss";
import WebGPUExplorationGLTF from ".";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  if (!searchParams.secret) notFound();

  const loadedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (canvasRef.current) {
      const wgpu = new WebGPUExplorationGLTF({ canvas: canvasRef.current });
      wgpu.start();
    }
  });

  return (
    <section className={css.CanvasWrapper}>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
}
