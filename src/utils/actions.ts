import { KeysInput } from "@/libs/wgpu/types/input";
import { toAllUpperCase, doArraysOverlap } from "@/utils/array";

export function getKeyboardActions<T extends string>(
  maps: Record<T, string[]>,
  rawPressedKeys: KeysInput,
): T[] {
  const actions: T[] = [];
  const pressedKeys = toAllUpperCase(Object.values(rawPressedKeys));

  for (const [action, map] of Object.entries(maps)) {
    if (!doArraysOverlap(map as string[], pressedKeys)) continue;
    actions.push(action as T);
  }

  return actions;
}
