export const defaultTransition = {
  ease: [0.2, 0.85, 0.45, 1.0],
  duration: 0.2,
};

export const revealDown = {
  initial: { clipPath: "inset(0% 0% 100% 0%)" },
  animate: { clipPath: "inset(0% 0% 0% 0%)" },
};

export const revealUp = {
  initial: { clipPath: "inset(100% 0% 0% 0%)" },
  animate: { clipPath: "inset(0% 0% 0% 0%)" },
};
