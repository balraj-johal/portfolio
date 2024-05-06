import localFont from "next/font/local";
import {
  Albert_Sans,
  Chakra_Petch,
  Gothic_A1,
  Inter_Tight,
  Khand,
  Saira,
  Saira_Condensed,
} from "next/font/google";

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

const moldiv = localFont({
  src: [
    {
      path: "files/Moldiv/Moldiv.ttf",
      style: "normal",
    },
  ],
  variable: "--font-simple",
});

const simpleFont = Saira_Condensed({
  subsets: ["latin"],
  variable: "--font-simples",
  weight: ["300", "500"],
});
// const simpleFont = Chakra_Petch({
//   subsets: ["latin"],
//   variable: "--font-chakra",
//   weight: ["300", "500"],
// });

export const FONT_CLASSES = [
  protoMono.variable,
  simpleFont.variable,
  moldiv.variable,
].join(" ");
