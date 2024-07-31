import clsx from "clsx";

import css from "./style.module.scss";

interface Props {
  title: string;
  className?: string;
}

const HOW_LONG_IS_LONG = 20; // chars

/**
 * NOTE: Can be styled from a parent css component.
 *       Can accept two font sizes in the form of the following css custom properties:
 *          --font-size
 *          --is-long-font-size
 */
const SplitTitle = ({ title, className }: Props) => {
  const isLong = title.length >= HOW_LONG_IS_LONG;

  const headerClasses = clsx(className, css.Title, isLong && css.IsLong);

  return (
    <h1 className={headerClasses} aria-label={title}>
      {title.split(" ").map((word, index) => (
        <span aria-hidden key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </h1>
  );
};

export default SplitTitle;
