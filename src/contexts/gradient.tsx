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
  setScrollDiff: (delta: number) => void;
}

interface ProviderProps {
  children?: ReactNode;
}

const GradientConfigContext = createContext<ContextProps>({} as ContextProps);

const GradientConfigProvider = ({ children }: ProviderProps) => {
  const scrollDiff = useRef<number>(0);

  const setScrollDiff = (delta: number) => {
    scrollDiff.current = Math.abs(delta);
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
