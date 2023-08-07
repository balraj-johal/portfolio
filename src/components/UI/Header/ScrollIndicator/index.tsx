"use client";

import { motion, useScroll } from "framer-motion";

import { ScrollIndicatorWrapper } from "./styles";

interface Props {
  visible?: boolean;
}

const STROKE_WIDTH = 3;
const SIZE = 30;

const ScrollInidcator = ({ visible }: Props) => {
  const { scrollYProgress } = useScroll();

  return (
    <ScrollIndicatorWrapper visible={visible}>
      <svg id="progress" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - STROKE_WIDTH / 2}
          pathLength="1"
          fill="none"
          stroke="black"
          strokeWidth={STROKE_WIDTH}
          className="indicator"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
    </ScrollIndicatorWrapper>
  );
};

export default ScrollInidcator;
