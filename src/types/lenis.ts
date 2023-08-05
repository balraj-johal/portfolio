export type LenisScrollEvent = {
  scroll: number;
  animatedScroll: number;
  dimensions: unknown;
  emitter: unknown;
  options: unknown; // instance options
  targetScroll: number;
  time: number;
  actualScroll: number;
  velocity: number;
  isHorizontal: boolean;
  isScrolling: boolean;
  isSmooth: boolean;
  isStopped: boolean; // more like is scroll allowed
  limit: number;
  progress: number; // 0-1
  rootElement: HTMLElement;
};

export type LenisScrollToOptions = {
  offset: number; // like scroll-padding-top
  lerp: number;
  duration: number;
  easing: unknown; //easing function
  immediate: boolean;
  lock: boolean;
  force: boolean;
  onComplete: unknown;
};
