"use client";

import { motion } from "framer-motion";

import { HeroContentRightParagraph } from "./styles";

interface Props {
  text: string[];
  delay: number;
  stagger: number;
}

const HeroContentRight = ({ text, delay, stagger }: Props) => {
  return (
    <HeroContentRightParagraph>
      {text.map((text: string, i: number) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0, delay: delay + i * stagger }}
          key={text + i}
        >
          {text}
          <br />
        </motion.span>
      ))}
    </HeroContentRightParagraph>
  );
};

export default HeroContentRight;
