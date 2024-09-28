import localFont from "next/font/local";

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

const stellar = localFont({
  src: [
    {
      path: "files/Stellar/PPStellar-Light.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "files/Stellar/PPStellar-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "files/Stellar/PPStellar-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-stellar",
});

const fraktionMono = localFont({
  src: [
    {
      path: "files/Fraktion/PPFraktionMono-Light.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "files/Fraktion/PPFraktionMono-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "files/Fraktion/PPFraktionMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fraktion",
});

const neueMontrealMono = localFont({
  src: [
    {
      path: "files/NeueMontrealMono/PPNeueMontrealMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "files/NeueMontrealMono/PPNeueMontrealMono-Regular.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "files/NeueMontrealMono/PPNeueMontrealMono-Medium.woff2",
      weight: "530",
      style: "normal",
    },
    {
      path: "files/NeueMontrealMono/PPNeueMontrealMono-Book.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal-mono",
});

const neueMontreal = localFont({
  src: [
    {
      path: "files/NeueMontreal/PPNeueMontreal-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "files/NeueMontreal/PPNeueMontreal-Book.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
});

const mori = localFont({
  src: [
    {
      path: "files/Mori/PPMori-Book.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "files/Mori/PPMori-Extralight.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "files/Mori/PPMori-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "files/Mori/PPMori-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mori",
});

export const FONT_CLASSES = [
  protoMono.variable,
  stellar.variable,
  fraktionMono.variable,
  mori.variable,
  neueMontrealMono.variable,
  neueMontreal.variable,
].join(" ");
