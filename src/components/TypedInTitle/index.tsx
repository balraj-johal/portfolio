import cssUtils from "../../theme/utils.module.scss";
import { TypedInLetter } from "./styles";

interface Props {
  text: string;
  className?: string;
  /** ms */
  revealInterval?: number;
  /** ms */
  baseDelay?: number;
}

const getAnimDelay = (
  index: number,
  interval: number,
  baseDelay: number,
  randomRange: number
) => {
  const randomOffset = Math.random() * randomRange;
  return `${baseDelay + index * interval + randomOffset}ms`;
};

const TypedInTitle = ({
  text,
  className,
  revealInterval = 75,
  baseDelay = 500,
}: Props) => {
  const letters = text.split("");
  const delays = letters.map((_, i) =>
    getAnimDelay(i, revealInterval, baseDelay, 20)
  );

  return (
    <>
      <h1 className={cssUtils.ScreenReaderOnly}>{text}</h1>
      <h1 aria-hidden className={className}>
        {letters.map((letter, i) => (
          <TypedInLetter key={letter} style={{ animationDelay: delays[i] }}>
            {letter}
          </TypedInLetter>
        ))}
      </h1>
    </>
  );
};

export default TypedInTitle;
