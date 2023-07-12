"use client";

import { Suspense } from "react";

import { GradientConfigProvider } from "@/contexts/gradient";
import { ApplicationStateProvider } from "@/contexts/applicationState";

interface Props {
  children: React.ReactNode;
}

/** This component wraps all application providers for cleaner TSX tree */
const Providers = ({ children }: Props) => {
  return (
    <Suspense fallback={null}>
      <ApplicationStateProvider>
        <GradientConfigProvider>{children}</GradientConfigProvider>
      </ApplicationStateProvider>
    </Suspense>
  );
};

export default Providers;
