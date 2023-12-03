"use client";

import { Suspense } from "react";

import { ApplicationStateProvider } from "@/contexts/applicationState";

interface Props {
  children: React.ReactNode;
}

/** This component wraps all application providers for cleaner TSX tree */
const Providers = ({ children }: Props) => {
  return (
    <Suspense fallback={null}>
      <ApplicationStateProvider>{children}</ApplicationStateProvider>
    </Suspense>
  );
};

export default Providers;
