"use client";

import { useEffect, useRef } from "react";

import { notFound } from "next/navigation";

import { SearchParams } from "@/types/routing";

import WebGPUExploration from "../../../libs/wgpu";
import css from "./style.module.scss";

// export const metadata: Metadata = {
//   title: `WebGPU Exploration | Balraj Johal`,
//   description: "Creative Developer | Based in London",
//   openGraph: {
//     // images: [
//     //   {
//     //     url: ENTRY.heroImagePath,
//     //     width: 1200,
//     //     height: 630,
//     //   },
//     // ],
//     type: "website",
//     locale: "en_GB",
//   },
//   robots: {
//     index: false,
//   },
// };

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  if (!searchParams.secret) notFound();

  const loadedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (canvasRef.current) {
      const wgpu = new WebGPUExploration(canvasRef.current);
      wgpu.initialize();
    }
  });

  return <canvas className={css.MainCanvas} ref={canvasRef}></canvas>;
}
