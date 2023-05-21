"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";

interface ContextProps {
  scrollDiff: MutableRefObject<number>;
  setScrollDiff: (velocity: number) => void;
}

interface ProviderProps {
  children?: ReactNode;
}

const GradientConfigContext = createContext<ContextProps>({} as ContextProps);

const GradientConfigProvider = ({ children }: ProviderProps) => {
  const scrollDiff = useRef<number>(0);

  const setScrollDiff = (velocity: number) => {
    scrollDiff.current = Math.abs(velocity);
  };

  const contextProps: ContextProps = useMemo(
    () => ({
      scrollDiff,
      setScrollDiff,
    }),
    []
  );

  return (
    <GradientConfigContext.Provider value={contextProps}>
      {children}
    </GradientConfigContext.Provider>
  );
};

const useGradientConfig = () => useContext(GradientConfigContext);

export { GradientConfigProvider, useGradientConfig };
