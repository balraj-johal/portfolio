import { styled } from "@phntms/css-components";
import { Anton } from "next/font/google";
import css from "./style.module.css";

// If loading a variable font, you don't need to specify the font weight
const anton = Anton({
  weight: "400",
  subsets: ["latin"]
})

export const RootBodyElement = styled('body', {
  css: [css.RootBodyElement, anton.className],
})