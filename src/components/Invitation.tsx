import { couple } from "@/lib/wedding";
import { AlponaBorder, AlponaLotus } from "./Alpona";

function Family({ side }: { side: "bride" | "groom" }) {
  const c = couple[side];
  return (
    <div className="family-card">
      <p className="font-bangla text-sm text-alta sm:text-base">
        {side === "bride" ? "কন্যাপক্ষ" : "বরপক্ষ"}
        <span className="font-body block text-xs text-ink/55 sm:text-sm">{side === "bride" ? "The bride’s family" : "The groom’s family"}</span>
      </p>
      <p className="font-bangla-display mt-2 text-2xl leading-tight text-ink sm:text-4xl">{c.bn}</p>
      <p className="font-display text-lg text-ink sm:text-2xl">{c.name}</p>
      <dl className="font-body mt-3 space-y-2 text-sm text-ink/85 sm:text-base">
        <div>
          <dt className="text-xs text-ink/55 sm:text-sm">{side === "bride" ? "Daughter of" : "Son of"}</dt>
          <dd>{c.father.name} &amp; {c.mother.name}</dd>
          <dd className="font-bangla text-ink/70 max-sm:hidden">{c.father.bn} ও {c.mother.bn}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink/55 sm:text-sm">Home</dt>
          <dd>{c.home}</dd>
          <dd className="font-bangla text-ink/70 max-sm:hidden">{c.homeBn}</dd>
        </div>
      </dl>
    </div>
  );
}

export function Invitation() {
  return (
    <section id="nimontron-card" className="card flex items-center bg-shola px-4 text-ink" aria-labelledby="nimontron">
      <div className="px-layer px-back pointer-events-none absolute inset-x-0 -inset-y-[25vh]" aria-hidden>
        <AlponaLotus className="absolute left-1/2 top-1/2 h-[min(120vw,120vh)] w-[min(120vw,120vh)] -translate-x-1/2 -translate-y-1/2 text-alta/[0.06]" petals={16} />
      </div>
      <AlponaBorder className="absolute inset-x-0 top-4 w-full text-alta/25" />
      <AlponaBorder className="absolute inset-x-0 bottom-4 w-full text-alta/25" />
      <div className="reveal relative mx-auto w-full max-w-4xl py-12 text-center">
        <h2 id="nimontron" className="font-bangla-display text-5xl text-alta sm:text-6xl">সাদর নিমন্ত্রণ</h2>
        <p className="font-bangla mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/90 sm:text-xl sm:leading-loose">
          সবিনয় নিবেদন, শুভ লগ্নে সুমনা ও অনিকের শুভ বিবাহ অনুষ্ঠানে আপনি সপরিবারে আমন্ত্রিত।
          আপনার উপস্থিতি ও আশীর্বাদ একান্ত কাম্য।
        </p>
        <p className="font-body mx-auto mt-3 max-w-xl text-ink/75 sm:text-lg">
          With the blessings of our elders, the Chowdhury and Datta families invite you and your family to the wedding of
          Sumona and Anik.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3 text-left sm:gap-6">
          <Family side="bride" />
          <Family side="groom" />
        </div>
      </div>
    </section>
  );
}
