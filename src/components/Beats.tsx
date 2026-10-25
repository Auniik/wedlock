// A storytelling section is `count` screens tall with a sticky stage inside.
// Each screen gets its own snap point, so one swipe or wheel flick moves the story forward one beat.

export const beatsHeight = (count: number) => ({ height: `${count * 100}svh` });

export function BeatMarkers({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden className="beat" style={{ top: `${i * 100}svh` }} />
      ))}
    </>
  );
}

/** Which beat the progress is closest to, and the fractional position between beats. */
export const beatOf = (p: number, count: number) => {
  const f = p * (count - 1);
  return { index: Math.round(f), f };
};
