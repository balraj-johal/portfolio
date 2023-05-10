import { styled } from "@phntms/css-components";
import { Anton, Abel } from "next/font/google";
import css from "./style.module.css";

// If loading a variable font, you don't need to specify the font weight
const ANTON = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-anton'
})

const ABEL = Abel({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-abel'
})

export const RootBodyElement = styled('body', {
  css: [css.RootBodyElement, ANTON.variable, ABEL.variable],
})