"use client";

import { useEffect, useState } from "react";

const SELECTION_COLORS = ["#C6DEF1", "#FAEDCB", "#C9E4DE"];

export const SelectionColorSwitcher = () => {
  const [colorIndex, setColorIndex] = useState(-1);

  useEffect(() => {
    const incrementColor = () => {
      setColorIndex((colorIndex) =>
        colorIndex >= SELECTION_COLORS.length - 1 ? 0 : colorIndex + 1,
      );
    };

    window.addEventListener("mousedown", incrementColor);
    window.addEventListener("DOMContentLoaded", () => setColorIndex(0));

    return () => {
      window.removeEventListener("mousedown", incrementColor);
    };
  }, []);

  if (colorIndex > -1) {
    document.documentElement.style.setProperty(
      "--selection-color",
      SELECTION_COLORS[colorIndex],
    );
  }

  return null;
};

export default SelectionColorSwitcher;
