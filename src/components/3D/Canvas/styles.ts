import { styled } from "@phntms/css-components";
import { Canvas } from "@react-three/fiber";
import css from "./style.module.css";

export const CanvasWrapper = styled("div", {
  css: css.CanvasWrapper,
})

export const CanvasElement = styled(Canvas, {
  css: css.CanvasElement,
})