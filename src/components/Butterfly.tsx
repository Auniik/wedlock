"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

export function ButterflyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="-30 -24 60 48" className={className} aria-hidden>
      <g className="wing wing-l">
        <path d="M-2 -2 C-14 -26 -32 -20 -26 -4 C-22 4 -10 4 -2 0 Z" fill="#C8102E" />
        <path d="M-2 2 C-12 4 -24 10 -18 20 C-12 26 -4 14 -2 4 Z" fill="#E2B13C" />
        <circle cx="-17" cy="-10" r="3.2" fill="#FFF8E6" />
        <circle cx="-12" cy="13" r="2" fill="#C8102E" />
      </g>
      <g className="wing wing-r">
        <path d="M2 -2 C14 -26 32 -20 26 -4 C22 4 10 4 2 0 Z" fill="#C8102E" />
        <path d="M2 2 C12 4 24 10 18 20 C12 26 4 14 2 4 Z" fill="#E2B13C" />
        <circle cx="17" cy="-10" r="3.2" fill="#FFF8E6" />
        <circle cx="12" cy="13" r="2" fill="#C8102E" />
      </g>
      <ellipse cx="0" cy="2" rx="2" ry="11" fill="#2A0F12" />
      <path d="M-1 -8 Q-5 -18 -9 -20 M1 -8 Q5 -18 9 -20" stroke="#2A0F12" strokeWidth="1" fill="none" />
    </svg>
  );
}

/** The Prajapati, a butterfly that drifts after the cursor (or the last tap). */
export function Butterfly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current!;
    let tx = window.innerWidth * 0.8, ty = window.innerHeight * 0.3;
    let x = tx, y = ty, angle = 0, frame = 0, t = 0;
    const onMove = (e: PointerEvent) => { tx = e.clientX + 26; ty = e.clientY - 18; };
    const loop = () => {
      t += 0.016;
      const dx = tx - x, dy = ty - y;
      x += dx * 0.045 + Math.sin(t * 2.1) * 0.9;
      y += dy * 0.045 + Math.cos(t * 2.9) * 0.9;
      angle += (Math.max(-35, Math.min(35, dx * 0.25)) - angle) * 0.08;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={ref} className="prajapati" aria-hidden>
      <ButterflyGlyph className="h-9 w-11" />
    </div>
  );
}
