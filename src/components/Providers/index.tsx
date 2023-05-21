"use client";

import { ApplicationStateProvider } from "@/contexts/applicationState";
import { GradientConfigProvider } from "@/contexts/gradient";

interface Props {
  children: React.ReactNode;
}

/** This component wraps all application providers for cleaner TSX tree */
const Providers = ({ children }: Props) => {
  return (
    <ApplicationStateProvider>
      <GradientConfigProvider>{children}</GradientConfigProvider>
    </ApplicationStateProvider>
  );
};

export default Providers;
