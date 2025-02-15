"use client";

import { MainElement } from "./styles";

interface Props {
  contained?: boolean;
  children: React.ReactNode;
}

const DefaultContainer = ({ contained = true, children, ...rest }: Props) => {
  return (
    <MainElement contained={contained} {...rest}>
      {children}
    </MainElement>
  );
};

export default DefaultContainer;
