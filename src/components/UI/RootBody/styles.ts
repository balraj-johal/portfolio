import { styled } from "@phntms/css-components";
import { Manrope } from "next/font/google";
import css from "./style.module.css";

// If loading a variable font, you don't need to specify the font weight
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
})

export const RootBodyElement = styled('body', {
  css: [css.RootBodyElement, manrope.className],
})