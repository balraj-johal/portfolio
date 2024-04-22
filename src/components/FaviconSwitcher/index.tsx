"use client";

import { useEffect, useRef, useState } from "react";

import { FaviconLinkPath } from "@/config/meta";

export const FaviconSwitcher = () => {
  const [visibleIcon, setVisibleIcon] = useState<FaviconLinkPath>(
    FaviconLinkPath.DEFAULT,
  );
  const faviconRef = useRef<HTMLElement>();

  useEffect(() => {
    const element = document.querySelector<HTMLLinkElement>("#favicon-svg");
    if (element) faviconRef.current = element;

    const visibilityChangeHandler = () => {
      if (!faviconRef.current) {
        throw new Error("Favicon element not present");
      }

      if (document.visibilityState === "hidden") {
        setVisibleIcon(FaviconLinkPath.SAD);
      } else {
        setVisibleIcon(FaviconLinkPath.DEFAULT);
      }
    };

    document.addEventListener("visibilitychange", visibilityChangeHandler);

    return () => {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    };
  }, []);

  faviconRef.current?.setAttribute("href", visibleIcon);

  return null;
};

export default FaviconSwitcher;
