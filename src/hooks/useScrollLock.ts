import { useEffect } from "react";

const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lock]);
};

export default useScrollLock;
