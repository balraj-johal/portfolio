"use client";

import { useApplicationState } from "@/contexts/applicationState";
import { LoadingSplashWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

const LoadingSplash = ({ children, ...rest }: Props) => {
  const { loading } = useApplicationState();

  return (
    <LoadingSplashWrapper loading={loading} {...rest}>
      LOADING
    </LoadingSplashWrapper>
  );
};

export default LoadingSplash;
