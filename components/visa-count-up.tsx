"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Eases a number toward its new value, but only when the value changes: the first paint
// (and server render) always shows the real number, so nothing counts up from zero on load.
// With prefers-reduced-motion the number simply swaps.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

export function CountUp({ value, duration = 800 }: { value: number; duration?: number }) {
  const reduced = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, () => true);
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;

    const start = performance.now();
    const length = reduced ? 0 : duration;
    let frame = 0;

    const tick = (now: number) => {
      const t = length === 0 ? 1 : Math.min(1, Math.max(0, (now - start) / length));
      const next = t === 1 ? value : Math.round(from + (value - from) * (1 - (1 - t) ** 3));
      shownRef.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced, duration]);

  return <span className="tabular-nums">{reduced ? value : shown}</span>;
}
