"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
  speed?: number;
  delay?: number;
};

export default function AutoScrollToBottom({
  containerRef,
  speed = 83,
  delay = 2000,
}: Props) {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function step(time: number) {
      if (stoppedRef.current) return;

      const el = containerRef.current;
      if (!el) return; // ✅ guard

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const next = el.scrollTop + speed * dt;

      if (next >= maxScroll) {
        el.scrollTop = maxScroll;
        stoppedRef.current = true;
        return;
      }

      el.scrollTop = next;
      rafRef.current = requestAnimationFrame(step);
    }

    function start() {
      if (stoppedRef.current) return;
      rafRef.current = requestAnimationFrame(step);
    }

    timeoutRef.current = window.setTimeout(start, delay);

    function stopForever() {
      if (stoppedRef.current) return;
      stoppedRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    window.addEventListener("pointerdown", stopForever, { passive: true });
    window.addEventListener("wheel", stopForever, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", stopForever);
      window.removeEventListener("wheel", stopForever);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, speed, delay]);

  return null;
}
