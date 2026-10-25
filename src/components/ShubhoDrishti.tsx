"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { art } from "@/lib/art";
import { AlponaLotus } from "./Alpona";
import { ease, range, useReducedMotion, useScrollProgress } from "@/lib/hooks";
import { weddingAudio } from "@/lib/audio";
import { BeatMarkers, beatOf, beatsHeight } from "./Beats";

const seeded = (i: number) => {
  const x = Math.sin(i * 7919 + 104729) * 10000;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};
const petals = Array.from({ length: 46 }, (_, i) => ({
  left: seeded(i) * 100,
  delay: seeded(i + 50) * 2.2,
  dur: 3.2 + seeded(i + 100) * 3,
  size: 10 + seeded(i + 150) * 12,
  hue: i % 3,
  drift: (seeded(i + 200) - 0.5) * 160,
}));

// one caption per beat
const captions = [
  { bn: "বর অপেক্ষায়", en: "Anik waits at the mandap, garland in hand." },
  { bn: "পিঁড়িতে কনে", en: "Sumona arrives on the piri, her face hidden behind two paan leaves." },
  { bn: "শুভদৃষ্টি", en: "The first look. Ulu, shankh, and everyone talking at once." },
  { bn: "মালাবদল", en: "Garlands are exchanged, three times, while the cousins cheer." },
  { bn: "সিঁদুরদান", en: "Sindoor, and two families become one." },
];

export function ShubhoDrishti({ sound }: { sound: boolean }) {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const reduced = useReducedMotion();
  const rang = useRef(false);

  // beats sit at p = 0, .25, .5, .75, 1; each change finishes as its beat snaps into place
  const { index: beat } = beatOf(p, captions.length);
  const enter = ease(range(p, 0.02, 0.25));
  const veil = 1 - ease(range(p, 0.3, 0.5));
  const met = p >= 0.45;
  const swap = ease(range(p, 0.55, 0.75));
  const caption = captions[beat];

  useEffect(() => {
    if (met && !rang.current) {
      rang.current = true;
      if (sound) weddingAudio().bells();
    }
    if (p < 0.4) rang.current = false;
  }, [met, p, sound]);

  return (
    <section id="drishti" ref={ref} className="relative bg-alta text-shola" style={beatsHeight(captions.length)} aria-label="Shubho Drishti">
      <BeatMarkers count={captions.length} />
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden">
        <AlponaLotus
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(130vw,130vh)] w-[min(130vw,130vh)] -translate-x-1/2 -translate-y-1/2 text-shola/10"
          petals={16}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,210,122,0.55), rgba(255,210,122,0) 65%)",
            opacity: met ? 1 : 0,
            transform: `translate(-50%,-50%) scale(${met ? 1 : 0.4})`,
            transition: "opacity 1.2s ease, transform 1.6s cubic-bezier(.2,.8,.2,1)",
          }}
        />

        <div key={caption.bn} className="stop-caption relative z-10 mt-[9vh] max-w-xl px-5 text-center">
          <p className={`font-bangla-display leading-none text-marigold ${beat === 2 ? "text-[clamp(3.4rem,12vw,8rem)]" : "text-[clamp(2.2rem,7vw,4rem)]"}`}>
            {caption.bn}
          </p>
          <p className="font-body mt-3 text-lg text-shola/90">{caption.en}</p>
        </div>

        <div className="drishti-stage relative z-10 mt-auto mb-20 w-full md:mb-[5vh]">
          {/* the two of them, before the garlands */}
          <div className="absolute inset-0 flex items-end justify-center gap-[3vw]" style={{ opacity: 1 - swap }}>
            <Image src={art.groomWaiting} alt="Anik waiting with a garland" sizes="20vh" className="h-full w-auto" />
            <div
              className="relative h-[74%]"
              style={{ aspectRatio: `${art.drishtiCovered.width} / ${art.drishtiCovered.height}`, transform: `translateX(${(1 - enter) * 70}vw)` }}
            >
              <div className={`absolute inset-0 ${p < 0.27 ? "carried" : ""}`}>
                <Image src={art.drishtiRevealed} alt="Sumona on the piri, paan leaves lowered, looking at Anik" fill sizes="40vh" className="object-contain" />
                <Image
                  src={art.drishtiCovered}
                  alt=""
                  fill
                  sizes="40vh"
                  className="object-contain"
                  style={{ opacity: veil }}
                  aria-hidden={veil < 0.5}
                />
              </div>
            </div>
          </div>
          {/* mala bodol */}
          <div className="absolute inset-0 flex items-end justify-center" style={{ opacity: swap }} aria-hidden={swap < 0.5}>
            <Image src={art.malaBodol} alt="Sumona and Anik exchanging garlands" sizes="50vh" className="h-full w-auto" />
          </div>
        </div>

        {met && !reduced && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
            {petals.map((pt, i) => (
              <span
                key={i}
                className={`petal petal-${pt.hue}`}
                style={{
                  left: `${pt.left}%`,
                  width: pt.size,
                  height: pt.size * 0.8,
                  animationDelay: `${pt.delay}s`,
                  animationDuration: `${pt.dur}s`,
                  ["--drift" as string]: `${pt.drift}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
