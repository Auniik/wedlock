"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { art } from "@/lib/art";
import { BeatMarkers, beatOf, beatsHeight } from "./Beats";
import { couple, toBn } from "@/lib/wedding";
import { useScrollProgress } from "@/lib/hooks";

const ROUTE =
  "M130 820 C150 770 165 740 175 700 C190 650 195 625 210 590 C240 520 290 440 330 380 C360 335 390 290 420 250 C450 205 470 160 500 120";

const stops = [
  {
    x: 130, y: 820, bn: "মিরপুর, ঢাকা", en: "Mirpur, Dhaka",
    text: `North Pirerbag. ${couple.groom.father.name} and ${couple.groom.mother.name}'s son straightens his topor one last time. The barjatri is ready.`,
  },
  {
    x: 175, y: 700, bn: "টঙ্গী", en: "Tongi",
    text: "The city thins out. Somebody in coach three has already started singing.",
  },
  {
    x: 210, y: 590, bn: "গাজীপুর", en: "Gazipur",
    text: "Sal forests in the dark. The mishti boxes are counted, again.",
  },
  {
    x: 330, y: 380, bn: "ময়মনসিংহ", en: "Mymensingh",
    text: "Across the Brahmaputra. Halfway there, and the jhalmuri is long gone.",
  },
  {
    x: 420, y: 250, bn: "শ্যামগঞ্জ", en: "Shyamganj",
    text: "Paddy fields and haor wind through the window. A phone rings: “Where are you now?”",
  },
  {
    x: 500, y: 120, bn: "নেত্রকোনা", en: "Netrokona",
    text: `Akhrar Mor, Barhatta Road. ${couple.bride.father.name} and ${couple.bride.mother.name}'s home is strung with marigolds and fairy lights. Sumona is waiting.`,
  },
];

// deterministic "random" so server and client agree
const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};
const stars = Array.from({ length: 70 }, (_, i) => ({
  x: seeded(i) * 600, y: seeded(i + 100) * 900, r: 0.6 + seeded(i + 200) * 1.6, d: seeded(i + 300) * 4,
}));
const fireflies = Array.from({ length: 18 }, (_, i) => ({
  x: 380 + seeded(i + 400) * 200, y: 60 + seeded(i + 500) * 200, d: seeded(i + 600) * 3,
}));

export function Journey() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const pathRef = useRef<SVGPathElement>(null);
  const [train, setTrain] = useState({ x: 130, y: 820, a: -60, len: 1000 });
  // where each station sits along the route (0..1), so every beat stops the train exactly at a station
  const [atStop, setAtStop] = useState<number[] | null>(null);

  const { index: beat, f } = beatOf(p, stops.length);
  const k = Math.min(stops.length - 2, Math.floor(f));
  const travel = atStop ? atStop[k] + (atStop[k + 1] - atStop[k]) * (f - k) : 0;

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const samples = 400;
    setAtStop(
      stops.map((s) => {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i <= samples; i++) {
          const pt = path.getPointAtLength((len * i) / samples);
          const d = (pt.x - s.x) ** 2 + (pt.y - s.y) ** 2;
          if (d < bestD) { bestD = d; best = i / samples; }
        }
        return best;
      }),
    );
  }, []);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const d = travel * len;
    const pt = path.getPointAtLength(d);
    const ahead = path.getPointAtLength(Math.min(len, d + 2));
    const behind = path.getPointAtLength(Math.max(0, d - 2));
    const a = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    setTrain({ x: pt.x, y: pt.y, a, len });
  }, [travel]);

  const passed = (i: number) => i <= beat;
  const current = stops[beat];
  const km = Math.round(travel * 160);
  const arrived = beat === stops.length - 1;

  return (
    <section id="journey" ref={ref} className="journey relative bg-night text-shola" style={beatsHeight(stops.length)} aria-label="The barjatri’s journey">
      <BeatMarkers count={stops.length} />
      <div className="sticky top-0 grid h-svh grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:grid-rows-1">
        {/* map */}
        <div className="relative order-1 min-h-0 md:order-2">
          <svg viewBox="0 0 600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Route from Mirpur, Dhaka to Netrokona">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFF3C9" className="twinkle" style={{ animationDelay: `${s.d}s` }} />
            ))}
            {/* Brahmaputra */}
            <path d="M-20 430 C100 380 220 450 330 400 C440 350 520 420 620 380" stroke="#2E5E86" strokeWidth="16" fill="none" opacity="0.55" strokeLinecap="round" />
            <text x="40" y="452" className="map-label" fill="#7FA6C9">Brahmaputra</text>
            {/* haor near Netrokona */}
            <path d="M470 60 C520 30 590 50 600 90 C610 140 560 170 520 160 C480 150 440 100 470 60 Z" fill="#2E5E86" opacity="0.35" />
            {/* route */}
            <path d={ROUTE} stroke="#FFF8E6" strokeOpacity="0.18" strokeWidth="4" strokeDasharray="2 10" fill="none" strokeLinecap="round" />
            <path
              ref={pathRef}
              d={ROUTE}
              stroke="#F2A20C"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={train.len}
              strokeDashoffset={train.len * (1 - travel)}
            />
            {stops.map((s, i) => {
              const done = passed(i);
              return (
                <g key={s.en}>
                  <circle cx={s.x} cy={s.y} r={done ? 7 : 5} fill={done ? "#F2A20C" : "#1B2A4F"} stroke="#FFF8E6" strokeWidth="2" />
                  <text x={s.x + (s.x > 400 ? (s.x > 480 ? -32 : -14) : 14)} y={s.y + 5} textAnchor={s.x > 400 ? "end" : "start"} className="map-label" fill={done ? "#FFF8E6" : "#8A97B8"}>
                    {s.en}
                  </text>
                </g>
              );
            })}
            {/* the bride's home */}
            <g transform="translate(500 120)" className={arrived ? "home-lit" : ""}>
              <path d="M-20 -14 L0 -32 L20 -14 V8 H-20 Z" fill="#3B1A12" stroke="#F2A20C" strokeWidth="1.5" />
              <rect x="-5" y="-4" width="10" height="12" fill={arrived ? "#FFD27A" : "#5b2a17"} />
              {[-18, -10, -2, 6, 14].map((x, i) => (
                <circle key={x} cx={x} cy={-14 - (i % 2) * 3} r="1.8" fill="#FFD27A" className="fairy" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </g>
            {arrived && fireflies.map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r="2" fill="#FFE07A" className="firefly" style={{ animationDelay: `${f.d}s` }} />
            ))}
            {/* train */}
            <g transform={`translate(${train.x} ${train.y}) rotate(${train.a})`}>
              <g transform="translate(-46 -8)">
                <rect x="0" y="0" width="20" height="16" rx="3" fill="#2F5D3A" stroke="#FFF8E6" strokeWidth="1" />
                <rect x="23" y="0" width="20" height="16" rx="3" fill="#2F5D3A" stroke="#FFF8E6" strokeWidth="1" />
                <rect x="46" y="-1" width="26" height="18" rx="5" fill="#B3122E" stroke="#FFF8E6" strokeWidth="1" />
                {[4, 12, 27, 35].map((x) => <rect key={x} x={x} y="4" width="5" height="5" fill="#FFD27A" />)}
                <circle cx="70" cy="8" r="3" fill="#FFF3C9" />
              </g>
            </g>
          </svg>
        </div>

        {/* story panel */}
        <div className="relative order-2 flex flex-col justify-center gap-4 bg-night/90 px-5 pb-20 pt-4 md:order-1 md:px-12 md:pb-0 md:pt-0">
          <div className="train-window relative aspect-[16/10] w-full max-w-lg overflow-hidden rounded-[1.6rem] border-[6px] border-[#2F5D3A] max-md:hidden">
            <Image
              src={art.trainWindow}
              alt="Anik waving from the window of a green train at night, crossing paddy fields under a full moon"
              fill
              sizes="(min-width: 768px) 32rem, 0px"
              placeholder="blur"
              className="object-cover"
              style={{ transform: `scale(1.18) translateX(${(0.5 - p) * 12}%)`, transition: "transform 0.6s ease-out" }}
            />
          </div>
          <div aria-live="polite" key={current.en} className="stop-caption">
            <p className="font-bangla-display text-3xl text-marigold md:text-4xl">{current.bn}</p>
            <h2 className="font-display text-2xl md:text-3xl">{current.en}</h2>
            <p className="font-body mt-2 max-w-md text-base leading-relaxed text-shola/85 md:text-lg">{current.text}</p>
          </div>
          <p className="font-body text-sm text-shola/60">
            <span className="font-bangla text-base text-marigold">{toBn(km)}</span> of about 160 km to the bride&rsquo;s home
          </p>
        </div>
      </div>
    </section>
  );
}
