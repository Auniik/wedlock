"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { art } from "@/lib/art";
import { events } from "@/lib/wedding";
import type { Wish } from "@/app/api/wishes/route";

const sideLabel: Record<Wish["side"], string> = {
  bride: "Sumona’s side",
  groom: "Anik’s side",
  friend: "Friend of both",
};

const seeded = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
};

function Diya({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 50" className={className} aria-hidden>
      <ellipse cx="30" cy="20" rx="20" ry="18" fill="#FFB347" opacity="0.18" className="diya-glow" />
      <path className="diya-flame" d="M30 6 C36 14 35 22 30 25 C25 22 24 14 30 6 Z" fill="#FFC94D" />
      <path d="M30 12 C33 17 32.5 21 30 23 C27.5 21 27 17 30 12 Z" fill="#FFF3C9" className="diya-flame" />
      <path d="M6 26 Q30 22 54 26 Q50 42 30 43 Q10 42 6 26 Z" fill="#A4512A" />
      <path d="M6 26 Q30 30 54 26" stroke="#7A3519" strokeWidth="2" fill="none" />
      <path d="M14 33 Q30 37 46 33" stroke="#E2B13C" strokeWidth="1.4" fill="none" strokeDasharray="2 3" />
    </svg>
  );
}

type Status = "loading" | "ready" | "offline";

export function DiyaRiver() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [open, setOpen] = useState<Wish | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wishes")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setWishes(data.wishes);
        setStatus("ready");
      })
      .catch(() => setStatus("offline"));
  }, []);

  const onSent = (w: Wish | null) => {
    if (!w) return;
    setWishes((list) => [w, ...list]);
    setFresh(w.id);
    setOpen(w);
  };

  const floating = wishes.slice(0, 24);

  return (
    <>
      <section id="wishes" className="card text-shola" aria-labelledby="wishes-title">
        <div className="px-layer px-back px-shallow absolute inset-x-0 -inset-y-[8vh]">
          <Image
            src={art.haorBoat}
            alt="Sumona and Anik in a garlanded boat on a haor full of water lilies"
            fill
            sizes="100vw"
            placeholder="blur"
            className="haor-art object-cover object-[62%_70%]"
          />
        </div>
        <div className="haor-dusk" aria-hidden />
        <div className="reveal relative z-[1] mx-auto max-w-3xl px-5 pt-[6svh] text-center">
          <h2 id="wishes-title" className="font-display text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-6xl">Float a wish on the haor</h2>
          <p className="font-bangla mt-2 text-xl text-marigold drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">আশীর্বাদের প্রদীপ ভাসান</p>
          <p className="font-body mx-auto mt-3 max-w-md text-shola drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
            Every wish becomes a diya on the water. Tap one to read it.
          </p>
        </div>

        {status === "ready" && floating.length === 0 && (
          <p className="river-note">The water is still. Float the first wish.</p>
        )}
        {status === "offline" && (
          <p className="river-note">Wishes will float here once the guestbook is connected.</p>
        )}
        <ul aria-label="Wishes from guests">
          {floating.map((w, i) => {
            const r = seeded(w.id);
            const lane = 62 + ((i * 37 + r * 50) % 24); // the open water in the lower part of the scene
            const dur = 38 + r * 30;
            return (
              <li
                key={w.id}
                className={`diya ${fresh === w.id ? "diya-fresh" : ""}`}
                style={{
                  top: `${lane}%`,
                  animationDuration: `${dur}s`,
                  animationDelay: fresh === w.id ? "0s" : `${-r * dur - i * 3}s`,
                  ["--i" as string]: Math.round(r * 85),
                }}
              >
                <button type="button" onClick={() => setOpen(w)} aria-label={`Read the wish from ${w.name}`}>
                  <Diya className="h-12 w-14" />
                  <span className="diya-name">{w.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {open && (
          <div className="wish-card" role="dialog" aria-label={`Wish from ${open.name}`}>
            <p className="font-body text-lg leading-relaxed text-ink">&ldquo;{open.message}&rdquo;</p>
            <p className="font-body mt-3 text-sm text-ink/60">
              {open.name}, {sideLabel[open.side]}
            </p>
            <button type="button" className="pill-btn pill-ghost mt-4" onClick={() => setOpen(null)}>
              Close
            </button>
          </div>
        )}
      </section>

      <section id="rsvp" className="card river-bg flex items-center px-4 py-12" aria-label="RSVP">
        <RsvpForm onSent={onSent} />
      </section>
    </>
  );
}

function RsvpForm({ onSent }: { onSent: (w: Wish | null) => void }) {
  const [name, setName] = useState("");
  const [side, setSide] = useState<Wish["side"]>("friend");
  const [attending, setAttending] = useState(true);
  const [chosen, setChosen] = useState<string[]>(events.map((e) => e.id));
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "done" | "error"; text?: string }>({ kind: "idle" });

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, side, attending, events: chosen, guests, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", text: data.error ?? "Your reply wasn't sent. Check your connection and try again." });
        return;
      }
      onSent(data.wish);
      setState({
        kind: "done",
        text: attending
          ? `Thank you, ${name.split(" ")[0]}! We’ve saved ${guests === 1 ? "your seat" : `${guests} seats`}.${data.wish ? " Your diya is on the water." : ""}`
          : `Thank you, ${name.split(" ")[0]}. We’ll miss you.${data.wish ? " Your diya is on the water." : ""}`,
      });
    } catch {
      setState({ kind: "error", text: "Your reply wasn't sent. Check your connection and try again." });
    }
  };

  if (state.kind === "done") {
    return (
      <div className="rsvp-card reveal mx-auto w-full max-w-xl text-center" role="status">
        <p className="font-bangla-display text-4xl text-alta">ধন্যবাদ!</p>
        <p className="font-body mt-3 text-lg text-ink">{state.text}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {message.trim() && <a href="#wishes" className="pill-btn">See your diya</a>}
          <button type="button" className="pill-btn pill-ghost" onClick={() => { setState({ kind: "idle" }); setName(""); setMessage(""); }}>
            Reply for someone else
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rsvp-card reveal mx-auto w-full max-w-xl text-ink">
      <h3 className="font-display text-3xl">Will you come?</h3>
      <p className="font-bangla text-alta">আসছেন তো?</p>

      <label className="field mt-6">
        <span>Your name</span>
        <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Rina Mashi" />
      </label>

      <fieldset className="field mt-5">
        <legend>You&rsquo;re from</legend>
        <div className="chips">
          {(["bride", "groom", "friend"] as const).map((s) => (
            <label key={s} className="chip">
              <input type="radio" name="side" checked={side === s} onChange={() => setSide(s)} />
              <span>{sideLabel[s]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field mt-5">
        <legend>Can you make it?</legend>
        <div className="chips">
          <label className="chip">
            <input type="radio" name="attending" checked={attending} onChange={() => setAttending(true)} />
            <span>Yes, I&rsquo;ll be there</span>
          </label>
          <label className="chip">
            <input type="radio" name="attending" checked={!attending} onChange={() => setAttending(false)} />
            <span>Sadly, no</span>
          </label>
        </div>
      </fieldset>

      {attending && (
        <>
          <fieldset className="field mt-5">
            <legend>Which ceremonies?</legend>
            <div className="chips">
              {events.map((ev) => (
                <label key={ev.id} className="chip">
                  <input type="checkbox" checked={chosen.includes(ev.id)} onChange={() => toggle(ev.id)} />
                  <span>{ev.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field mt-5">
            <span id="guests-label">How many people, including you?</span>
            <div className="stepper" role="group" aria-labelledby="guests-label">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="One fewer person">−</button>
              <output aria-live="polite">{guests}</output>
              <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))} aria-label="One more person">+</button>
            </div>
          </div>
        </>
      )}

      <label className="field mt-5">
        <span>A wish for Sumona &amp; Anik (optional)</span>
        <textarea maxLength={280} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Shubho bibaho! May your home always be full of mishti and laughter." />
        <small className="text-ink/50">{280 - message.length} characters left</small>
      </label>

      {state.kind === "error" && (
        <p className="font-body mt-4 rounded-lg bg-alta/10 px-4 py-3 text-alta" role="alert">{state.text}</p>
      )}

      <button type="submit" disabled={state.kind === "sending"} className="pill-btn mt-6 w-full justify-center py-3 text-lg">
        {state.kind === "sending" ? "Sending…" : message.trim() ? "Send RSVP and float my wish" : "Send RSVP"}
      </button>
    </form>
  );
}
