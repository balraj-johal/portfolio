"use client";

import { CSSProperties, Children, useRef } from "react";

import css from "./style.module.scss";

interface Props {
  children: React.ReactNode;
}

const Carousel = ({ children, ...rest }: Props) => {
  const wasLastScrollALoopRef = useRef(false);

  const handleScroll = (e: React.UIEvent) => {
    const { target } = e;
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

  const childrenAsArray = Children.toArray(children);
  const style = { "--items": childrenAsArray.length } as CSSProperties;

  return (
    <div
      className={css.CarouselContainer}
      style={style}
      onScroll={handleScroll}
      {...rest}
    >
      <div className={css.CarouselTrack}>
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
