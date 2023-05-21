import useRouterURL from "@/hooks/useRouterURL";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from "react";

interface ContextProps {
  loading: boolean;
  startLoading: () => void;
}

interface ProviderProps {
  children?: ReactNode;
}

const ApplicationStateContext = createContext<ContextProps>({} as ContextProps);

const TRANSITION_DURATION = 1000; // ms

const ApplicationStateProvider = ({ children }: ProviderProps) => {
  const url = useRouterURL();
  const [loading, setLoading] = useState(true);

  const startLoading = () => setLoading(true);

  // watch URL for changes, and begin timer for finishing load
  useEffect(() => {
    const loadedTimeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, TRANSITION_DURATION);

    return () => {
      clearTimeout(loadedTimeout);
    };
  }, [url, loading]);

  const contextProps: ContextProps = useMemo(
    () => ({
      loading,
      startLoading,
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
