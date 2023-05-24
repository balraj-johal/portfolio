"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { SubtitleElement } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const Subtitle = ({ children, ...rest }: Props) => {
  const { transitioning } = useApplicationState();

  return (
    <SubtitleElement animate={!transitioning} {...rest}>
      {children}
    </SubtitleElement>
  );
};

export default Subtitle;
