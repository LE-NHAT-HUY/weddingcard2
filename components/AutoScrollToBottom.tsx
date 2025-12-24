"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
  /** pixels per second */
  speed?: number;
  /** if true: when reach bottom, jump back to top and continue */
  loop?: boolean;
};

export default function AutoScrollToBottom({
  containerRef,
  speed = 80,
  loop = false,
}: Props) {
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const startScrollTopRef = useRef<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function step(time: number) {
      if (!runningRef.current) {
        lastTimeRef.current = null;
        return;
      }

      const el = containerRef.current;
      if (!el) {
        runningRef.current = false;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        startScrollTopRef.current = el.scrollTop;
      }

      const dt = (time - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = time;

      const maxScroll = el.scrollHeight - el.clientHeight;
      
      // If nothing to scroll, stop
      if (maxScroll <= 0) {
        runningRef.current = false;
        return;
      }

      const distance = speed * dt;
      let nextScrollTop = el.scrollTop + distance;

      if (nextScrollTop >= maxScroll) {
        if (loop) {
          // Jump to top and adjust start position
          el.scrollTop = 0;
          startScrollTopRef.current = 0;
          lastTimeRef.current = null; // Reset time for smooth continuation
        } else {
          el.scrollTop = maxScroll;
          runningRef.current = false;
          return;
        }
      } else {
        el.scrollTop = nextScrollTop;
      }

      rafRef.current = requestAnimationFrame(step);
    }

    function start() {
      if (runningRef.current) return;
      runningRef.current = true;
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(step);
    }

    function stop() {
      runningRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    }

    function toggle() {
      if (runningRef.current) stop();
      else start();
    }

    // Toggle on any pointerdown (covers touch + mouse). 
    // Ignore clicks inside inputs/contenteditable so it won't block typing.
    function onPointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return; // let input interactions behave normally
      }
      toggle();
    }

    window.addEventListener("pointerdown", onPointerDown);
    
    // pause when tab hidden to save CPU/battery
    function onVisibilityChange() {
      if (document.hidden) stop();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, speed, loop]);

  return null;
}