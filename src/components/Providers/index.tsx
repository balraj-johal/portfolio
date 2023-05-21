"use client";

import { ApplicationStateProvider } from "@/contexts/applicationState";
import { GradientConfigProvider } from "@/contexts/gradient";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <ApplicationStateProvider>
      <GradientConfigProvider>{children}</GradientConfigProvider>
    </ApplicationStateProvider>
  );
};

export default Providers;
