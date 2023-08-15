import localFont from "next/font/local";

const supplySans = localFont({
  src: [
    {
      path: "files/PPSupplySans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "files/PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-sans",
});

const supplyMono = localFont({
  src: [
    {
      path: "files/PPSupplyMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "files/PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-mono",
});

const protoMono = localFont({
  src: [
    {
      path: "files/Proto Mono Medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "files/Proto Mono Light.ttf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-proto-mono",
});

export const FONT_CLASSES = [
  supplySans.variable,
  supplyMono.variable,
  protoMono.variable,
].join(" ");
