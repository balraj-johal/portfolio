"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
export type Theme = "inverted" | "default";

interface ContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface ProviderProps {
  children?: ReactNode;
}

const ApplicationStateContext = createContext<ContextProps>({} as ContextProps);

const ApplicationStateProvider = ({ children }: ProviderProps) => {
  const [loading, setLoading] = useState(true);

  const contextProps: ContextProps = useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading]
  );

  return (
    <ApplicationStateContext.Provider value={contextProps}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

const useApplicationState = () => useContext(ApplicationStateContext);

export { ApplicationStateProvider, useApplicationState };
