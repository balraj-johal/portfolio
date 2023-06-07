import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
  MouseEvent,
} from "react";

import { MousePos } from "@/types/events";
import useRouterURL from "@/hooks/useRouterURL";

interface ContextProps {
  transitioning: boolean;
  startTransitioning: () => void;
  loading: boolean;
  finishLoading: () => void;
  mousePos: MutableRefObject<MousePos>;
  updateMousePos: (e: MouseEvent) => void;
}

interface ProviderProps {
  children?: ReactNode;
}

const ApplicationStateContext = createContext<ContextProps>({} as ContextProps);

const TRANSITION_DURATION = 1000; // ms
const INITIAL_MOUSE_POS = { x: 0.5, y: 0.5 };

const ApplicationStateProvider = ({ children }: ProviderProps) => {
  const url = useRouterURL();
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const mousePos = useRef<MousePos>(INITIAL_MOUSE_POS);

  const finishLoading = () => setLoading(false);
  const startTransitioning = () => setTransitioning(true);

  // watch URL for changes, and begin timer for finishing load
  useEffect(() => {
    const loadedTimeout = setTimeout(() => {
      if (transitioning) setTransitioning(false);
    }, TRANSITION_DURATION);

    return () => {
      clearTimeout(loadedTimeout);
    };
  }, [url, transitioning]);

  const getRelativeMousePos = (e: MouseEvent): MousePos => {
    return {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  };

  const updateMousePos = useCallback((e: MouseEvent) => {
    mousePos.current = getRelativeMousePos(e);
  }, []);

  const contextProps: ContextProps = useMemo(
    () => ({
      transitioning,
      startTransitioning,
      loading,
      finishLoading,
      mousePos,
      updateMousePos,
    }),
    [loading, transitioning, updateMousePos]
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
