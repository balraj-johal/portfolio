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

export const FONT_CLASSES = [supplySans.variable, supplyMono.variable].join(
  " ",
);
