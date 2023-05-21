"use client";

import { useApplicationState } from "@/contexts/applicationState";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href: string;
}

const TransitionLink = ({ href, children, ...rest }: Props) => {
  const { startLoading } = useApplicationState();

  return (
    <Link href={href} onClick={startLoading} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
