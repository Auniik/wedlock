"use client";

import Image from "next/image";
import { events, mapsUrl, toBn, type WeddingEvent } from "@/lib/wedding";
import { eventArt } from "@/lib/art";

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
    <>
      {events.map((e, i) => (
        <section
          key={e.id}
          id={`event-${e.id}`}
          className={`card event-card event-${e.id} flex items-center px-4`}
          aria-labelledby={`event-title-${e.id}`}
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-5 py-8 md:grid-cols-[1.15fr_1fr] md:gap-14">
            <div className="px-layer px-front relative">
              <Image src={eventArt[e.id]} alt="" sizes="(min-width: 768px) 50vw, 92vw" placeholder="blur" className="event-art" />
              <div className="event-date" aria-hidden>
                <span className="font-bangla text-4xl font-semibold leading-none sm:text-5xl">{toBn(fmt(e.start, { day: "numeric" }))}</span>
                <span className="font-body mt-1 text-xs sm:text-sm">{fmt(e.start, { month: "short" })}</span>
              </div>
            </div>
            <div className="reveal">
              <p className="font-body text-sm text-ink/55">
                Ceremony {i + 1} of {events.length}
              </p>
              <h2 id={`event-title-${e.id}`} className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="font-bangla-display text-5xl text-alta sm:text-6xl">{e.bn}</span>
                <span className="font-display text-2xl text-ink sm:text-3xl">{e.name}</span>
              </h2>
              <p className="font-body mt-3 max-w-prose text-ink/80 sm:text-lg">{e.meaning}</p>
              <dl className="font-body mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-ink">
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-sm text-ink/55">When</dt>
                  <dd>
                    {fmt(e.start, { weekday: "long", day: "numeric", month: "long" })},{" "}
                    {fmt(e.start, { hour: "numeric", minute: "2-digit", hour12: true })}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-sm text-ink/55">Where</dt>
                  <dd>{e.venue}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-ink/55">What to wear</dt>
                  <dd className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 rounded-full border border-ink/20" style={{ background: e.wear.swatch }} />
                    {e.wear.label}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className="pill-btn" href={mapsUrl(e.mapQuery)} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
                <button type="button" className="pill-btn pill-ghost" onClick={() => downloadIcs(e)}>
                  Add to calendar
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
