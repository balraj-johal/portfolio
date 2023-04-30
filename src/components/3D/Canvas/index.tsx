"use client";

// TODO: come up with better name for this component

import { CanvasElement, CanvasWrapper } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Canvas = ({ children }: Props) => {
  return (
    <CanvasWrapper>
      <CanvasElement>{children}</CanvasElement>
    </CanvasWrapper>
  );
};

export default Canvas;
