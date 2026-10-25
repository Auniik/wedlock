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
 * Trackpads keep firing fading "momentum" events after the fingers lift. Those are ignored; a new flick is
 * recognised by a pause in events or by the deltas growing again. Touch and keyboard keep native snapping,
 * and a card taller than the screen scrolls normally until its edge.
 */
export function useCardWheel(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const COOLDOWN = 650;
    let lastAt = 0;
    let lastAbs = 0;
    let peaked = true; // has the current swipe's speed started falling (momentum)?
    let trough = Infinity; // slowest delta seen since then
    let movedAt = -Infinity;
    let queued: number | null = null;
    let heading: number | null = null; // where the last move is scrolling to

    const snaps = () =>
      [...document.querySelectorAll<HTMLElement>(".card, .beat")]
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
        .sort((a, b) => a - b);

    /** The next snap point in a direction, or null when the current card still has content to scroll through. */
    const targetFor = (down: boolean) => {
      // while a move is still gliding, count from its destination, not from wherever the page is mid-way
      const y = heading !== null && performance.now() - movedAt < COOLDOWN + 300 ? heading : window.scrollY;
      const vh = window.innerHeight;
      const points = snaps();
      const t = down ? points.find((p) => p > y + 2) : [...points].reverse().find((p) => p < y - 2);
      if (t === undefined || (down ? t > y + vh + 2 : y - t > vh + 2)) return null;
      return t;
    };

    const move = (down: boolean) => {
      const t = targetFor(down);
      if (t === null) return;
      movedAt = performance.now();
      heading = t;
      peaked = false;
      trough = Infinity;
      window.scrollTo({ top: t, behavior: "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = performance.now();
      const abs = Math.abs(e.deltaY);
      const down = e.deltaY > 0;

      let fresh: boolean;
      if (now - lastAt > 220) {
        fresh = true; // first event after a pause
        peaked = true;
        trough = abs;
      } else {
        if (!peaked && abs < lastAbs) peaked = true;
        if (peaked) trough = Math.min(trough, abs);
        fresh = peaked && abs > lastAbs && abs > trough * 2 + 6; // speeding up again: a new swipe over old momentum
      }
      lastAt = now;
      lastAbs = abs;

      if (targetFor(down) === null) return; // let the browser scroll inside a tall card
      e.preventDefault();
      if (!fresh || abs < 2 || queued !== null) return; // a queued move already covers this swipe

      const wait = movedAt + COOLDOWN - now;
      if (wait <= 0) return move(down);
      // the previous move is still animating: run this one as soon as it lands
      if (queued === null) {
        queued = window.setTimeout(() => { queued = null; move(down); }, wait);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (queued !== null) clearTimeout(queued);
    };
  }, [enabled]);
}
