"use client";

import Image from "next/image";
import { useState } from "react";
import { ButterflyGlyph } from "./Butterfly";
import { couple, toBn, weddingDay } from "@/lib/wedding";
import { useNow } from "@/lib/hooks";
import { art } from "@/lib/art";

// alternate between the two of them; each line sits over the speaker's head in the illustration
const lines = [
  { who: "groom", text: "আসছি, নেত্রকোনা!" },
  { who: "bride", text: "দেরি কোরো না কিন্তু!" },
  { who: "groom", text: "Is the mishti ready?" },
  { who: "bride", text: "Topor straight, please." },
  { who: "groom", text: "Everyone has to come!" },
  { who: "bride", text: "সবাই আসবেন কিন্তু!" },
] as const;

function Couple() {
  const [n, setN] = useState(-1);
  const line = n >= 0 ? lines[n % lines.length] : null;
  return (
    <button
      type="button"
      className="hero-couple"
      aria-label={`Say hello to ${couple.bride.short} and ${couple.groom.short}`}
      onClick={() => setN((v) => v + 1)}
    >
      {line && (
        <span key={n} className={`bubble ${line.who === "groom" ? "bubble-groom" : "bubble-bride"}`}>
          {line.text}
        </span>
      )}
      <span key={`hop${n}`} className={`block ${n >= 0 ? "hop" : ""}`}>
        <Image
          src={art.heroCouple}
          alt="Illustration of Anik in a topor and Sumona in a red Benarasi saree, holding hands"
          sizes="(min-width: 768px) 34vw, 70vw"
          preload
          placeholder="blur"
          className="breathe h-auto w-full"
        />
      </span>
      {n >= 0 && <span key={`heart${n}`} className="float-heart" aria-hidden>♥</span>}
    </button>
  );
}

function Countdown() {
  const now = useNow();
  const target = new Date(weddingDay.start).getTime();
  const diff = now === null ? null : Math.max(0, target - now);
  const parts = diff === null
    ? null
    : [
        { v: Math.floor(diff / 86400000), bn: "দিন", en: "days" },
        { v: Math.floor(diff / 3600000) % 24, bn: "ঘণ্টা", en: "hours" },
        { v: Math.floor(diff / 60000) % 60, bn: "মিনিট", en: "minutes" },
        { v: Math.floor(diff / 1000) % 60, bn: "সেকেন্ড", en: "seconds" },
      ];
  return (
    <div className="mt-7 flex gap-4 sm:gap-7" aria-live="off">
      {(parts ?? [0, 1, 2, 3].map(() => null)).map((p, i) => (
        <div key={i} className="min-w-14 text-center">
          <div className="font-bangla text-3xl font-semibold tabular-nums text-alta sm:text-4xl">
            {p ? toBn(String(p.v).padStart(2, "0")) : "—"}
          </div>
          <div className="font-body text-xs leading-tight text-ink/70">{p ? <>{p.bn}<br />{p.en}</> : " "}</div>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const date = new Date(weddingDay.start).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka",
  });
  return (
    <section id="top" className="card laal-paar px-6 pb-16 pt-14 sm:px-10">
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 md:min-h-[calc(100svh-7.5rem)] md:grid-cols-[1.1fr_1fr] md:gap-[9vw]">
        <div className="reveal order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
          <div className="flex items-center gap-2 text-alta">
            <ButterflyGlyph className="h-6 w-8" />
            <span className="font-bangla text-sm sm:text-base">শ্রী শ্রী প্রজাপতয়ে নমঃ</span>
          </div>
          <h1 className="font-bangla-display mt-4 text-[clamp(3rem,8vw,6.5rem)] leading-[1.1] text-alta">
            {couple.bride.shortBn} <span className="text-marigold-deep">ও</span> {couple.groom.shortBn}
          </h1>
          <p className="font-display relative z-10 mt-2 max-w-[17ch] text-[clamp(1.6rem,3.4vw,2.7rem)] leading-tight text-ink">
            Sumona &amp; Anik are getting married
          </p>
          <p className="font-body mt-3 text-lg text-ink/80">{date}, in Netrokona</p>
          <Countdown />
          <a href="#journey" className="scroll-cue font-body mt-9 text-sm text-ink/70">
            Scroll to ride with the barjatri
            <span aria-hidden className="scroll-cue-train">🚂</span>
          </a>
        </div>
        <div className="px-layer px-front relative order-1 mx-auto w-[min(56vw,300px)] md:order-2 md:w-[min(28vw,400px)]">
          <Image src={art.kolagach} alt="" sizes="20vw" className="kolagach kolagach-left" />
          <Image src={art.kolagach} alt="" sizes="20vw" className="kolagach kolagach-right" />
          <Couple />
        </div>
      </div>
    </section>
  );
}
