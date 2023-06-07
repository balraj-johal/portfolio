"use client";

import { useApplicationState } from "@/contexts/applicationState";

import GradientBGPlane from "../GradientBGPlane";
import { CanvasElement, CanvasWrapper } from "./styles";

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
