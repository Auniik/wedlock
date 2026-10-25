"use client";

import { useEffect, useState } from "react";

export type Scene = { id: string; label: string };

/** Dots on the right edge: where you are in the story, and a way to jump to any scene. */
export function SceneDots({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(scenes[0]?.id);

  useEffect(() => {
    // whichever scene crosses the middle of the screen is the current one
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    scenes.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [scenes]);

  return (
    <nav className="scene-dots" aria-label="Scenes">
      {scenes.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={s.id === active ? "is-active" : ""} aria-current={s.id === active ? "step" : undefined}>
          <span className="scene-dot" aria-hidden />
          <span className="scene-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
