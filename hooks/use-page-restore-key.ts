"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Changes when a document is restored from the browser back/forward cache.
 * Add the returned value to API-loading effect dependencies.
 */
export function usePageRestoreKey() {
  const [key, setKey] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const scheduleRefresh = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setKey((value) => value + 1);
        frame.current = null;
      });
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) scheduleRefresh();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", scheduleRefresh);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", scheduleRefresh);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return key;
}
