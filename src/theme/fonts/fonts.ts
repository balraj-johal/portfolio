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

export const FONT_CLASSES = [protoMono.variable].join(" ");
