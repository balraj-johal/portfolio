"use client";

import { CSSProperties, Children, useRef } from "react";

import css from "./style.module.scss";

interface Props {
  children: React.ReactNode;
}

const Carousel = ({ children, ...rest }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wasLastScrollALoopRef = useRef(false);

  const childrenAsArray = Children.toArray(children);
  const numberOfItems = childrenAsArray.length;

  const handleScroll = (event: React.UIEvent) => {
    const { target } = event;

    if (!(target instanceof HTMLElement)) return;
    const { scrollLeft, clientWidth, scrollWidth } = target;

    if (wasLastScrollALoopRef.current === false) {
      if (scrollLeft + clientWidth === scrollWidth) {
        target.scrollLeft = 1;
        wasLastScrollALoopRef.current = true;
      } else if (scrollLeft === 0) {
        target.scrollLeft = scrollWidth - 1;
        wasLastScrollALoopRef.current = true;
      }
    } else {
      wasLastScrollALoopRef.current = false;
    }
  };

  const style = { "--items": numberOfItems } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={css.CarouselContainer}
      style={style}
      onScroll={handleScroll}
      {...rest}
    >
      <div ref={trackRef} className={css.CarouselTrack}>
        {childrenAsArray.map((item, index) => (
          <div className={css.CarouselItem} key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
