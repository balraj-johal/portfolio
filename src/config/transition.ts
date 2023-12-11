import { ColorThemeGLSL, ColorThemeKey } from "@/types/transition";

export const COLOR_SCHEMES_GLSL: Record<ColorThemeKey, ColorThemeGLSL> = {
  primary: {
    foreground: 0.029,
    background: 0.99,
  },
  secondary: {
    foreground: 0.99,
    background: 0.029,
  },
};
