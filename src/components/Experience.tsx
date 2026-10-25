"use client";

import { useEffect, useState } from "react";
import { Gate } from "./Gate";
import { Hero } from "./Hero";
import { Journey } from "./Journey";
import { ShubhoDrishti } from "./ShubhoDrishti";
import { Families, Invitation } from "./Invitation";
import { Events } from "./Events";
import { DiyaRiver } from "./DiyaRiver";
import { Butterfly, ButterflyGlyph } from "./Butterfly";
import { SceneDots, type Scene } from "./SceneDots";
import { AlponaLotus } from "./Alpona";
import { weddingAudio } from "@/lib/audio";
import { useCardWheel, useReducedMotion } from "@/lib/hooks";
import { events } from "@/lib/wedding";

const scenes: Scene[] = [
  { id: "top", label: "Sumona & Anik" },
  { id: "journey", label: "The barjatri" },
  { id: "drishti", label: "Shubho Drishti" },
  { id: "nimontron-card", label: "Invitation" },
  { id: "families", label: "The families" },
  ...events.map((e) => ({ id: `event-${e.id}`, label: e.name })),
  { id: "wishes", label: "Wishes" },
  { id: "rsvp", label: "RSVP" },
  { id: "end", label: "See you there" },
];

export function Experience() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [sound, setSound] = useState(false);
  const reduced = useReducedMotion();
  useCardWheel(gone && !reduced);

  useEffect(() => {
    document.documentElement.style.overflow = gone ? "" : "hidden";
  }, [gone]);

  const open = (withSound: boolean) => {
    window.scrollTo(0, 0);
    setOpened(true);
    if (withSound) {
      const a = weddingAudio();
      a.conch();
      setTimeout(() => a.start(), 2600);
      setSound(true);
    }
    setTimeout(() => setGone(true), 1500);
  };

  const toggleSound = () => {
    const a = weddingAudio();
    if (sound) a.stop();
    else a.start();
    setSound(!sound);
  };

  return (
    <>
      {!gone && <Gate onOpen={open} />}
      <main aria-hidden={!opened} className={opened ? "" : "invisible"}>
        <Hero />
        <Journey />
        <ShubhoDrishti sound={sound} />
        <Invitation />
        <Families />
        <Events />
        <DiyaRiver />
        <footer id="end" className="card flex flex-col items-center justify-center bg-ink px-4 text-center text-shola">
          <div className="px-layer px-back pointer-events-none absolute inset-x-0 -inset-y-[25vh]" aria-hidden>
            <AlponaLotus className="absolute left-1/2 top-1/2 h-[min(110vw,110vh)] w-[min(110vw,110vh)] -translate-x-1/2 -translate-y-1/2 text-marigold/[0.08]" petals={16} />
          </div>
          <div className="reveal relative">
            <ButterflyGlyph className="mx-auto h-12 w-14" />
            <p className="font-bangla-display mt-6 text-5xl text-marigold sm:text-7xl">সবাই আসবেন কিন্তু!</p>
            <p className="font-body mt-3 text-lg text-shola/80">Everyone has to come. That&rsquo;s the rule.</p>
            <p className="font-body mt-10 text-sm text-shola/50">With love, the Chowdhury and Datta families</p>
          </div>
        </footer>
      </main>

      {gone && (
        <div className="fixed bottom-4 right-4 z-40 flex gap-2">
          <a href="#rsvp" className="pill-btn shadow-lg">RSVP</a>
          <button
            type="button"
            onClick={toggleSound}
            className="sound-btn"
            aria-pressed={sound}
            aria-label={sound ? "Turn music off" : "Turn music on"}
          >
            <span className={`sound-bars ${sound ? "is-on" : ""}`} aria-hidden>
              <i /><i /><i /><i />
            </span>
          </button>
        </div>
      )}
      {gone && <Butterfly />}
      {gone && <SceneDots scenes={scenes} />}
    </>
  );
}
