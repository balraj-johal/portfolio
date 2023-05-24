"use client";

import { useApplicationState } from "@/contexts/applicationState";

import { LoadingSplashWrapper } from "./styles";

interface Props {
  children?: React.ReactNode;
}

/** This component is used as a way to mask the initial
 * mount of the WebGL scene. It is rendered below the
 * main content, but above the WebGL canvas, to ensure
 * content is immediately visible onscreen. */
const LoadingSplash = ({ ...rest }: Props) => {
  const { loading } = useApplicationState();

  return <LoadingSplashWrapper loading={loading} {...rest} />;
};

export default LoadingSplash;
