import input from "@/libs/controllers/input";
import { toAllUpperCase, doArraysOverlap } from "@/utils/array";

export function getKeyboardActions<T extends string>(
  maps: Record<T, string[]>,
): T[] {
  const actions: T[] = [];
  const pressedKeys = toAllUpperCase(Object.values(input.pressedKeys));

  for (const [action, map] of Object.entries(maps)) {
    if (!doArraysOverlap(map as string[], pressedKeys)) continue;
    actions.push(action as T);
  }

  return actions;
}
