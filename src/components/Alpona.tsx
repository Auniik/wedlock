// Alpona: white rice-paste floor patterns, drawn as a lotus mandala and a running border.

export function AlponaLotus({ className, petals = 12 }: { className?: string; petals?: number }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden fill="none" stroke="currentColor" strokeLinecap="round">
      <circle r="12" strokeWidth="2.4" />
      <circle r="4" fill="currentColor" stroke="none" />
      {Array.from({ length: petals }, (_, i) => (
        <g key={i} transform={`rotate(${(360 / petals) * i})`}>
          <path d="M0 -18 C14 -34 12 -54 0 -66 C-12 -54 -14 -34 0 -18 Z" strokeWidth="2.4" />
          <path d="M0 -28 L0 -56" strokeWidth="1.4" />
          <circle cy="-78" r="3.2" fill="currentColor" stroke="none" />
          <path d="M-9 -86 Q0 -96 9 -86" strokeWidth="2" />
        </g>
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <g key={`b${i}`} transform={`rotate(${(360 / petals) * i + 180 / petals})`}>
          <path d="M0 -26 C7 -36 7 -44 0 -50 C-7 -44 -7 -36 0 -26 Z" strokeWidth="1.8" />
        </g>
      ))}
      <circle r="92" strokeWidth="1.2" strokeDasharray="1 7" />
    </svg>
  );
}

export function AlponaBorder({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden preserveAspectRatio="none" height="28">
      <defs>
        <pattern id="alpona-run" width="56" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14 Q14 0 28 14 T56 14" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="14" cy="18" r="2.4" fill="currentColor" />
          <circle cx="42" cy="10" r="2.4" fill="currentColor" />
          <path d="M28 6 C31 10 31 18 28 22 C25 18 25 10 28 6 Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill="url(#alpona-run)" />
    </svg>
  );
}

/** A toran: swags of marigold strung across the top of a doorway, with mango leaves where they meet. */
export function Toran({ className }: { className?: string }) {
  const flowers = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    return { x: 6 + t * 108, y: 8 + Math.round(Math.sin(t * Math.PI) * 26 * 10) / 10, i };
  });
  return (
    <svg className={className} aria-hidden height="64">
      <defs>
        <pattern id="toran-swag" width="120" height="64" patternUnits="userSpaceOnUse">
          {flowers.map(({ x, y, i }) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={i % 2 ? "#F7C600" : "#F28C0F"} />
              <circle cx={x} cy={y} r="2.4" fill={i % 2 ? "#E08A00" : "#C25E00"} />
            </g>
          ))}
          <path d="M0 6 C-4 22 -2 34 0 44 C2 34 4 22 0 6 Z" fill="#3E7B34" />
          <path d="M120 6 C116 22 118 34 120 44 C122 34 124 22 120 6 Z" fill="#3E7B34" />
          <circle cx="0" cy="6" r="5" fill="#C8102E" />
          <circle cx="120" cy="6" r="5" fill="#C8102E" />
        </pattern>
      </defs>
      <rect width="100%" height="64" fill="url(#toran-swag)" />
    </svg>
  );
}
