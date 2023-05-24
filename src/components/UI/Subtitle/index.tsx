"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { SubtitleElement } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const Subtitle = ({ children, ...rest }: Props) => {
  const { loading } = useApplicationState();

  return (
    <SubtitleElement animate={!loading} {...rest}>
      {children}
    </SubtitleElement>
  );
};

export default Subtitle;
