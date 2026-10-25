"use client";

import { useState } from "react";
import { AlponaLotus } from "./Alpona";

function Shankh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden>
      <path d="M18 60 C10 40 30 18 62 16 C100 13 140 30 150 52 C156 66 146 76 128 76 C108 78 92 92 66 94 C38 96 24 80 18 60 Z" fill="#FFF8E6" />
      <path d="M128 76 C140 74 150 66 150 52 C142 60 132 62 122 60 C116 66 118 74 128 76 Z" fill="#F2C9A8" />
      <path d="M18 60 C14 52 6 50 2 52 C4 58 10 62 18 62" fill="#FFF8E6" />
      <path d="M40 30 C54 44 54 72 44 88 M62 18 C76 36 78 70 68 92 M86 16 C98 34 100 66 92 88 M108 20 C118 36 118 60 112 80" stroke="#E2C88A" strokeWidth="2" fill="none" />
      <path d="M30 70 C60 64 100 62 136 66" stroke="#E2B13C" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M30 70 C60 64 100 62 136 66" stroke="#B3122E" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
    </svg>
  );
}

export function Gate({ onOpen }: { onOpen: (withSound: boolean) => void }) {
  const [leaving, setLeaving] = useState(false);
  const open = (withSound: boolean) => {
    if (leaving) return;
    setLeaving(true);
    onOpen(withSound);
  };

  return (
    <div className={`gate ${leaving ? "gate-leaving" : ""}`} role="dialog" aria-label="Open the invitation">
      <div className="gate-half gate-left" />
      <div className="gate-half gate-right" />
      <div className="gate-content">
        <AlponaLotus className="gate-lotus" />
        <p className="font-bangla-display text-2xl text-shola/90 sm:text-3xl">শুভ বিবাহ</p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-shola sm:text-6xl">
          Sumona <span className="text-marigold">&amp;</span> Anik
        </h1>
        <button type="button" onClick={() => open(true)} className="shankh-btn group" aria-label="Blow the shankh and open the invitation, with sound">
          <Shankh className="shankh-icon" />
        </button>
        <p className="font-body text-lg text-shola">Tap the shankh to open the invitation</p>
        <p className="font-bangla text-shola/70">শাঁখ বাজিয়ে নিমন্ত্রণপত্র খুলুন</p>
        <button type="button" onClick={() => open(false)} className="mt-6 font-body text-sm text-shola/75 underline decoration-marigold/70 underline-offset-4 hover:text-shola">
          Open without sound
        </button>
      </div>
    </div>
  );
}
