import { RefObject, useEffect, useRef } from "react";

type MousePositionReturnType =
  | "raw"
  | "percentage"
  | "normalized"
  | "center-normalized";

const useMousePosition = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  returnType: MousePositionReturnType = "raw",
) => {
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const elementSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const elem = elementRef.current;
    if (!elem) return;

    const handleResize = () => {
      elementSizeRef.current.width = elem.clientWidth;
      elementSizeRef.current.height = elem.clientHeight;
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [elementRef]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height } = elementSizeRef.current;

      switch (returnType) {
        case "raw":
          mousePositionRef.current.x = clientX;
          mousePositionRef.current.y = clientY;
          break;
        case "normalized":
          const normalisedX = clientX / height;
          const normalisedY = clientY / width;
          mousePositionRef.current.x = normalisedX;
          mousePositionRef.current.y = normalisedY;
          break;
        case "center-normalized":
          const midX = height / 2;
          const midY = width / 2;
          const centerNormalisedX = clientX / midX - 1;
          const centerNormalisedY = clientY / midY - 1;
          mousePositionRef.current.x = centerNormalisedX;
          mousePositionRef.current.y = centerNormalisedY;
          break;
        case "percentage":
          // TODO: add this case's logic
          break;
      }
    };

    element.addEventListener("mousemove", updateMousePosition);

    return () => {
      element.removeEventListener("mousemove", updateMousePosition);
    };
  }, [elementRef, returnType]);

  return mousePositionRef;
};

export default useMousePosition;
