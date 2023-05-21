"use client";

import { CSSProperties } from "react";

import Link from "next/link";

import { useApplicationState } from "@/contexts/applicationState";

interface Props {
  children: React.ReactNode;
  href: string;
  styles?: CSSProperties;
  className?: string;
}

const TransitionLink = ({ href, children, className, ...rest }: Props) => {
  const { startLoading } = useApplicationState();

  return (
    <Link href={href} onClick={startLoading} className={className} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
