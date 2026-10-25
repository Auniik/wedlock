"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { art } from "@/lib/art";
import type { Wish } from "@/app/api/wishes/route";

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

/** Wishes float as diyas on the haor; the RSVP form sits beside them (below them on a phone). */
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
    <section id="rsvp" className="card wishes-card text-shola" aria-labelledby="wishes-title">
      <div className="wishes-bg px-layer px-back px-shallow">
        <Image
          src={art.haorBoat}
          alt="Sumona and Anik in a garlanded boat on a haor full of water lilies"
          fill
          sizes="100vw"
          placeholder="blur"
          className="haor-art object-cover object-[62%_70%] md:object-[100%_70%]"
        />
      </div>
      <div className="haor-dusk wishes-bg" aria-hidden />

      <div className="wishes-layout">
        <div className="wishes-scene">
          <div className="relative z-[1] px-5 pt-[6svh] text-center md:pt-[8svh] md:text-left">
            <h2 id="wishes-title" className="font-display text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-5xl">
              Float a wish on the haor
            </h2>
            <p className="font-bangla mt-2 text-xl text-marigold drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">আশীর্বাদের প্রদীপ ভাসান</p>
            <p className="font-body mt-2 max-w-md text-shola drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] max-md:mx-auto">
              Every wish becomes a diya on the water. Tap one to read it.
            </p>
          </div>

          {status === "ready" && floating.length === 0 && (
            <p className="river-note">The water is still. Float the first wish.</p>
          )}
          {status === "offline" && <p className="river-note">The wishes couldn’t load. Try again in a moment.</p>}
          <ul className="diya-lane" aria-label="Wishes from guests">
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
              <p className="font-body mt-3 text-sm text-ink/60">{open.name}</p>
              <button type="button" className="pill-btn pill-ghost mt-4" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          )}
        </div>

        <div className="wishes-form">
          <RsvpForm onSent={onSent} />
          <p className="font-body mt-4 text-center text-sm text-shola/70">With love, the Chowdhury and Datta families</p>
        </div>
      </div>
    </section>
  );
}

function RsvpForm({ onSent }: { onSent: (w: Wish | null) => void }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [excuse, setExcuse] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "done" | "error"; text?: string }>({ kind: "idle" });

  const first = name.trim().split(" ")[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, attending, guests, excuse, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", text: data.error ?? "Your reply wasn’t sent. Check your connection and try again." });
        return;
      }
      onSent(data.wish);
      setState({
        kind: "done",
        text: attending
          ? `${guests === 1 ? "Your plate is" : `${guests} plates are`} reserved, ${first}. See you in Netrokona!`
          : `Excuse noted, ${first}. The aunties will discuss it at length.`,
      });
    } catch {
      setState({ kind: "error", text: "Your reply wasn’t sent. Check your connection and try again." });
    }
  };

  if (state.kind === "done") {
    return (
      <div className="rsvp-card text-center" role="status">
        <p className="font-bangla-display text-4xl text-alta">{attending ? "অপেক্ষায় রইলাম!" : "মন খারাপ…"}</p>
        <p className="font-body mt-3 text-lg text-ink">{state.text}</p>
        {message.trim() && <p className="font-body mt-2 text-ink/70">Your diya is on the water.</p>}
        <button
          type="button"
          className="pill-btn pill-ghost mt-5"
          onClick={() => { setState({ kind: "idle" }); setName(""); setMessage(""); setExcuse(""); setGuests(1); setAttending(true); }}
        >
          Reply for someone else
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rsvp-card text-ink">
      <h3 className="font-bangla-display text-4xl leading-none text-alta">আসছেন তো?</h3>
      <p className="font-display mt-1 text-2xl">Will you come?</p>

      <label className="field mt-5">
        <span>Your bhalo naam</span>
        <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Rina Mashi" />
      </label>

      <fieldset className="field mt-4">
        <legend>So, are you coming?</legend>
        <div className="chips">
          <label className="chip">
            <input type="radio" name="attending" checked={attending} onChange={() => setAttending(true)} />
            <span>Of course! Keep the mishti ready</span>
          </label>
          <label className="chip">
            <input type="radio" name="attending" checked={!attending} onChange={() => setAttending(false)} />
            <span>Sadly, no</span>
          </label>
        </div>
      </fieldset>

      {attending ? (
        <div className="field mt-4">
          <span id="guests-label">How many plates should we lay out?</span>
          <div className="flex items-center gap-3">
            <div className="stepper" role="group" aria-labelledby="guests-label">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="One fewer plate">−</button>
              <output aria-live="polite">{guests}</output>
              <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))} aria-label="One more plate">+</button>
            </div>
            <small className="text-ink/55">
              {guests === 1 ? "Just you" : guests >= 6 ? "Bringing the whole para? Wonderful." : "Including you"}
            </small>
          </div>
        </div>
      ) : (
        <label className="field mt-4">
          <span>Your excuse (the aunties will review it)</span>
          <input
            required
            maxLength={200}
            value={excuse}
            onChange={(e) => setExcuse(e.target.value)}
            placeholder="e.g. Stuck in Dhaka traffic since Tuesday"
          />
        </label>
      )}

      <label className="field mt-4">
        <span>A blessing for the two of them (optional)</span>
        <textarea
          maxLength={280}
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="May your home always have mishti, laughter and good Wi-Fi."
        />
      </label>

      {state.kind === "error" && (
        <p className="font-body mt-3 rounded-lg bg-alta/10 px-4 py-2 text-alta" role="alert">{state.text}</p>
      )}

      <button type="submit" disabled={state.kind === "sending"} className="pill-btn mt-5 w-full justify-center py-3 text-lg">
        {state.kind === "sending" ? "Sending…" : message.trim() ? "Send RSVP and float my wish" : "Send RSVP"}
      </button>
    </form>
  );
}
