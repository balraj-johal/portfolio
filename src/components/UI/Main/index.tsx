"use client";

import { useApplicationState } from "@/contexts/applicationState";
import { MainElement } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Main = ({ children, ...rest }: Props) => {
  const { loading } = useApplicationState();

  return (
    <MainElement loading={loading} {...rest}>
      {children}
    </MainElement>
  );
};

export default Main;
