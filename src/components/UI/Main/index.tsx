"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { MainElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Main = ({ children, ...rest }: Props) => {
  const { transitioning } = useApplicationState();

  return (
    <MainElement transitioning={transitioning} {...rest}>
      {children}
    </MainElement>
  );
};

export default Main;
