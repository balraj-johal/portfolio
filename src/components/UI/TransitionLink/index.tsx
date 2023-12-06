"use client";

import { CSSProperties, ReactNode, SyntheticEvent } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useTransitionStore } from "@/stores/transitionStore";

interface Props {
  children: ReactNode;
  href: string;
  styles?: CSSProperties;
  className?: string;
}

const TransitionLink = ({ href, children, className, ...rest }: Props) => {
  const router = useRouter();
  const { startTransition } = useTransitionStore();

  const handleNavigation = (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition();
    setTimeout(() => {
      router.push(href);
    }, 0.3);
  };

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
