"use client";

import { MainElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const DefaultContainer = ({ children, ...rest }: Props) => {
  return (
    <MainElement contained {...rest}>
      {children}
    </MainElement>
  );
};

export default DefaultContainer;
