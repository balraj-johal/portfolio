"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { TransitionSplashWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const TransitionSplash = ({ ...rest }: Props) => {
  const { transitioning } = useApplicationState();

  return (
    <TransitionSplashWrapper transitioning={transitioning} {...rest}>
      Transitioning...
    </TransitionSplashWrapper>
  );
};

export default TransitionSplash;
