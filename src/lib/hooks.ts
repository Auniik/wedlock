"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Map p from [a,b] to [0,1], clamped. */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** How far the viewport has travelled through a tall section with a sticky child (0 → 1). */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      setProgress(span > 0 ? clamp(-r.top / span) : r.top < 0 ? 1 : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return [ref, progress] as const;
}

const motionQuery = "(prefers-reduced-motion: reduce)";
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(motionQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, intervalMs);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [intervalMs]);
  return now;
}

/**
 * Mouse wheel / trackpad: one deliberate flick moves exactly one card or beat (`.card`, `.beat`).
 * Momentum events are swallowed until the gesture settles. Touch and keyboard keep native scroll snapping,
 * and a card taller than the screen scrolls normally until its edge.
 */
export function useCardWheel(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lockUntil = 0;
    let lastWheel = 0;
    let acc = 0;

    const snaps = () =>
      [...document.querySelectorAll<HTMLElement>(".card, .beat")]
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
        .sort((a, b) => a - b);

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (now < lockUntil) {
        e.preventDefault();
        if (gap < 160) lockUntil = Math.max(lockUntil, now + 160); // still the same flick's momentum
        return;
      }
      const y = window.scrollY;
      const vh = window.innerHeight;
      const points = snaps();
      const down = e.deltaY > 0;
      const target = down ? points.find((t) => t > y + 2) : [...points].reverse().find((t) => t < y - 2);
      if (target === undefined) return;
      // there is more of the current card to see first: scroll natively
      if (down ? target > y + vh + 2 : y - target > vh + 2) return;
      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) < 12) return;
      acc = 0;
      lockUntil = now + 750;
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled]);
}
