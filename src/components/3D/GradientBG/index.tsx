"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { CanvasElement, CanvasWrapper } from "./styles";
import GradientBGPlane from "../GradientBGPlane";

const GradientBG = () => {
  const { mousePos } = useApplicationState();

  return (
    <>
      <CanvasWrapper>
        <CanvasElement>
          <GradientBGPlane mousePos={mousePos} />
        </CanvasElement>
      </CanvasWrapper>
    </>
  );
};

export default GradientBG;
