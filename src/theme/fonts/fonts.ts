import localFont from "next/font/local";

const supplySans = localFont({
  src: [
    {
      path: "./PPSupplySans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-sans",
});

const supplyMono = localFont({
  src: [
    {
      path: "./PPSupplyMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./PPSupplySans-Ultralight.otf",
      weight: "200",
      style: "light",
    },
  ],
  variable: "--font-supply-mono",
});

export const FONT_CLASSES = [supplySans.variable, supplyMono.variable].join(
  " ",
);
