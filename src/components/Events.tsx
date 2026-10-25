"use client";

import Image from "next/image";
import { events, mapsUrl, toBn, type WeddingEvent } from "@/lib/wedding";
import { eventArt } from "@/lib/art";
import { Toran } from "./Alpona";

const tz = "Asia/Dhaka";
const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleString("en-GB", { timeZone: tz, ...o });
const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function downloadIcs(e: WeddingEvent) {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sumona & Anik//Wedding//EN", "BEGIN:VEVENT",
    `UID:${e.id}-sumona-anik@wedding`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(e.start)}`, `DTEND:${icsDate(e.end)}`,
    `SUMMARY:${e.name} (${e.bn}) — Sumona & Anik`,
    `LOCATION:${e.venue}, ${e.mapQuery}`.replace(/,/g, "\\,"),
    `DESCRIPTION:${e.meaning}`.replace(/,/g, "\\,"),
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.id}-sumona-anik.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Events() {
  return (
    <section id="ceremonies" className="card ceremonies-bg flex flex-col" aria-labelledby="ceremonies-title">
      <Toran className="toran w-full" />
      <div className="reveal mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center pb-20 md:pb-8">
        <h2 id="ceremonies-title" className="px-5 text-center">
          <span className="font-bangla-display block text-4xl text-marigold sm:text-5xl">চারটি অনুষ্ঠান</span>
          <span className="font-display mt-1 block text-xl text-shola sm:text-2xl">Four ceremonies, one long celebration</span>
        </h2>
        <p className="font-body mt-2 text-center text-sm text-shola/60 md:hidden">Swipe to see all four</p>

        <ol className="ceremony-row mt-6 md:mt-9">
          {events.map((e) => (
            <li key={e.id} className={`ceremony event-${e.id}`}>
              <div className="doorway">
                <div className="doorway-art">
                  <Image src={eventArt[e.id]} alt="" fill sizes="(min-width: 768px) 22vw, 70vw" placeholder="blur" className="object-cover" />
                </div>
                <div className="doorway-date" aria-hidden>
                  <span className="font-bangla text-2xl font-semibold leading-none">{toBn(fmt(e.start, { day: "numeric" }))}</span>
                  <span className="font-body text-[0.7rem] leading-none">{fmt(e.start, { month: "short" })}</span>
                </div>
              </div>
              <h3 className="mt-10 text-center">
                <span className="font-bangla-display block text-3xl leading-tight text-marigold">{e.bn}</span>
                <span className="font-display block text-lg text-shola">{e.name}</span>
              </h3>
              <dl className="font-body mt-2 space-y-0.5 text-center text-sm text-shola/85">
                <div>
                  <dt className="sr-only">When</dt>
                  <dd>
                    {fmt(e.start, { weekday: "long", day: "numeric", month: "long" })},{" "}
                    {fmt(e.start, { hour: "numeric", minute: "2-digit", hour12: true })}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Where</dt>
                  <dd>{e.venue}</dd>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-shola/70">
                  <dt>Wear</dt>
                  <dd className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full ring-1 ring-shola/40" style={{ background: e.wear.swatch }} />
                    {e.wear.label}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex justify-center gap-4 text-sm">
                <a className="door-link" href={mapsUrl(e.mapQuery)} target="_blank" rel="noreferrer">Map</a>
                <button type="button" className="door-link" onClick={() => downloadIcs(e)}>Add to calendar</button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
