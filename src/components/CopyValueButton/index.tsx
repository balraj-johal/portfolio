"use client";

import { useMemo, useState } from "react";

import css from "./style.module.scss";

const CONTENT = {
  success: "[ Copied! ]",
  prompt: "[ Copy ]",
};

const COPY_REPEAT_TIMEOUT = 600;

interface Props {
  value: string;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

const CopyValueButton = ({ value, ariaLabel, className, children }: Props) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, COPY_REPEAT_TIMEOUT);
  };

  const onClick = () => {
    if (copied) return;

    copy();
  };

  const contents = useMemo(() => {
    if (copied) {
      return <span className={css.SuccessLabel}>{CONTENT.success}</span>;
    } else {
      return (
        <>
          <span className={css.CopyLabel}>{CONTENT.prompt}</span>
          <span className={css.DefaultLabel}>{children}</span>
        </>
      );
    }
  }, [children, copied]);

  return (
    <button
      className={`${className} ${css.CopyValueButton}`}
      onClick={onClick}
      onTouchEnd={onClick}
      aria-label={ariaLabel}
    >
      {contents}
    </button>
  );
};

export default CopyValueButton;
