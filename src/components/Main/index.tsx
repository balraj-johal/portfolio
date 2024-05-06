"use client";

import { MainElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Main = ({ children, ...rest }: Props) => {
  return (
    <MainElement contained {...rest}>
      {children}
    </MainElement>
  );
};

export default Main;
