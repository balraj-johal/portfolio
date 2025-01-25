export function doArraysOverlap(first: unknown[], second: unknown[]) {
  for (const item of first) {
    if (second.includes(item)) return true;
  }

  return false;
}

export function toAllUpperCase(input: string[]) {
  return input.map((value) => value.toUpperCase());
}

export function shuffle<T extends unknown[]>(input: T) {
  let currentIndex = input.length;
  const array = [...input];

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
