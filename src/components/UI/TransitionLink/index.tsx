"use client";

import { ReactNode, SyntheticEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useTransitionStore } from "@/stores/transitionStore";

interface Props {
  children: ReactNode;
  href: string;
  className?: string;
}

const TransitionLink = ({ href, children, className, ...rest }: Props) => {
  const router = useRouter();
  const { transitioning, startTransition } = useTransitionStore();
  const [clicked, setClicked] = useState(false);

  const handleNavigation = (e: SyntheticEvent) => {
    e.preventDefault();

    if (clicked) return;
    setClicked(true);

    startTransition();
  };

  // TODO: does this still work w no JS?
  useEffect(() => {
    if (clicked && !transitioning) router.push(href);
  }, [clicked, href, router, transitioning]);

  return (
    <Link
      href={href}
      onClick={handleNavigation}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
