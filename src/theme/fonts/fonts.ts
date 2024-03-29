import localFont from "next/font/local";
import { Inter } from "next/font/google";

const supplySans = localFont({
  src: [
    {
      path: "files/Supply/PPSupplySans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "files/Supply/PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-sans",
});

const supplyMono = localFont({
  src: [
    {
      path: "files/Supply/PPSupplyMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "files/Supply/PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-mono",
});

const cascadiaMono = localFont({
  src: [
    {
      path: "files/CascadiaMono/CascadiaMono.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-cascadia-mono",
});

const protoMono = localFont({
  src: [
    {
      path: "files/ProtoMono/ProtoMono-Light.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "files/ProtoMono/ProtoMono-Medium.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "files/ProtoMono/ProtoMono-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "files/ProtoMono/ProtoMono-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-proto-mono",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const FONT_CLASSES = [
  supplySans.variable,
  supplyMono.variable,
  protoMono.variable,
  cascadiaMono.variable,
  inter.variable,
].join(" ");
