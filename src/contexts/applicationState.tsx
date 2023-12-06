import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";

interface ContextProps {
  loading: boolean;
  finishLoading: () => void;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  headerVisible: boolean;
  setHeaderVisible: Dispatch<SetStateAction<boolean>>;
}

interface ProviderProps {
  children?: ReactNode;
}

const ApplicationStateContext = createContext<ContextProps>({} as ContextProps);

export const ROUTE_TRANSITION_DURATION = 1800; // ms

const ApplicationStateProvider = ({ children }: ProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const finishLoading = useCallback(() => setLoading(false), [setLoading]);

  const contextProps: ContextProps = useMemo(
    () => ({
      loading,
      finishLoading,
      menuOpen,
      setMenuOpen,
      headerVisible,
      setHeaderVisible,
    }),
    [finishLoading, headerVisible, loading, menuOpen],
  );

  return (
    <ApplicationStateContext.Provider value={contextProps}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

/** Provides details about the overall website state
 * @returns transitioning: boolean */
const useApplicationState = () => useContext(ApplicationStateContext);

export { ApplicationStateProvider, useApplicationState };
