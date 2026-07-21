"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps a chat thread pinned to its newest message.
 *
 * Returns a ref to put on the scrolling container. Pass the message count —
 * the thread is re-pinned whenever it changes, which covers the initial load,
 * a reply being sent, and a message arriving over the socket.
 *
 * The first positioning is unanimated. A smooth scroll from the top of a
 * freshly loaded thread is long enough that the next content change can
 * interrupt it, leaving the thread parked somewhere in the middle. Later
 * scrolls are short, so they can animate.
 *
 * The container is scrolled directly rather than by calling scrollIntoView on
 * a sentinel element: scrollIntoView walks every scrollable ancestor, so it
 * drags the page itself down alongside the thread.
 */
export function useScrollToLatest<T extends HTMLElement>(messageCount: number) {
  const containerRef = useRef<T>(null);
  const hasPositionedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || messageCount === 0) return;

    const behavior = hasPositionedRef.current ? "smooth" : "auto";
    hasPositionedRef.current = true;
    container.scrollTo({ top: container.scrollHeight, behavior });
  }, [messageCount]);

  return containerRef;
}
