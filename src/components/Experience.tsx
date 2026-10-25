"use client";

import { useEffect, useState } from "react";
import { Gate } from "./Gate";
import { Hero } from "./Hero";
import { Journey } from "./Journey";
import { ShubhoDrishti } from "./ShubhoDrishti";
import { Invitation } from "./Invitation";
import { Events } from "./Events";
import { DiyaRiver } from "./DiyaRiver";
import { Butterfly } from "./Butterfly";
import { SceneDots, type Scene } from "./SceneDots";
import { weddingAudio } from "@/lib/audio";
import { useCardWheel, useReducedMotion } from "@/lib/hooks";

const scenes: Scene[] = [
  { id: "top", label: "Sumona & Anik" },
  { id: "journey", label: "The barjatri" },
  { id: "drishti", label: "Shubho Drishti" },
  { id: "nimontron-card", label: "Invitation" },
  { id: "ceremonies", label: "Ceremonies" },
  { id: "rsvp", label: "Wishes & RSVP" },
];

export function Experience() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [sound, setSound] = useState(false);
  const reduced = useReducedMotion();
  useCardWheel(gone && !reduced);
  const [atRsvp, setAtRsvp] = useState(false);

  useEffect(() => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtRsvp(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        <Events />
        <DiyaRiver />
      </main>

      {gone && (
        <div className="fixed bottom-4 right-4 z-40 flex gap-2">
          {!atRsvp && <a href="#rsvp" className="pill-btn shadow-lg">RSVP</a>}
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
