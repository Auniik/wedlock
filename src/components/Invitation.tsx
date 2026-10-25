import { couple } from "@/lib/wedding";
import { AlponaBorder, AlponaLotus } from "./Alpona";

function Family({ side }: { side: "bride" | "groom" }) {
  const c = couple[side];
  return (
    <div className="family-card">
      <p className="font-bangla text-alta">{side === "bride" ? "কন্যাপক্ষ" : "বরপক্ষ"}</p>
      <p className="font-body text-sm text-ink/60">{side === "bride" ? "The bride’s family" : "The groom’s family"}</p>
      <p className="font-bangla-display mt-3 text-3xl text-ink sm:mt-4 sm:text-4xl">{c.bn}</p>
      <p className="font-display text-2xl text-ink">{c.name}</p>
      <dl className="font-body mt-4 space-y-3 text-ink/85">
        <div>
          <dt className="text-sm text-ink/55">{side === "bride" ? "Daughter of" : "Son of"}</dt>
          <dd className="text-lg">
            {c.father.name} &amp; {c.mother.name}
          </dd>
          <dd className="font-bangla text-ink/70">{c.father.bn} ও {c.mother.bn}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink/55">Home</dt>
          <dd>{c.home}</dd>
          <dd className="font-bangla text-ink/70">{c.homeBn}</dd>
        </div>
      </dl>
    </div>
  );
}

export function Invitation() {
  return (
    <section id="nimontron-card" className="card flex items-center justify-center bg-shola px-5 text-ink" aria-labelledby="nimontron">
      <div className="px-layer px-back pointer-events-none absolute inset-x-0 -inset-y-[25vh]" aria-hidden>
        <AlponaLotus className="absolute left-1/2 top-1/2 h-[min(120vw,120vh)] w-[min(120vw,120vh)] -translate-x-1/2 -translate-y-1/2 text-alta/[0.07]" petals={16} />
      </div>
      <AlponaBorder className="absolute inset-x-0 top-6 w-full text-alta/25" />
      <AlponaBorder className="absolute inset-x-0 bottom-6 w-full text-alta/25" />
      <div className="reveal relative mx-auto max-w-2xl text-center">
        <h2 id="nimontron" className="font-bangla-display text-5xl text-alta sm:text-7xl">সাদর নিমন্ত্রণ</h2>
        <p className="font-bangla mx-auto mt-8 max-w-xl text-xl leading-loose text-ink/90 sm:text-2xl sm:leading-loose">
          সবিনয় নিবেদন, শুভ লগ্নে সুমনা ও অনিকের শুভ বিবাহ অনুষ্ঠানে আপনি সপরিবারে আমন্ত্রিত।
          আপনার উপস্থিতি ও আশীর্বাদ একান্ত কাম্য।
        </p>
        <p className="font-body mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          With the blessings of our elders, the Chowdhury and Datta families invite you and your family to the wedding of Sumona and Anik.
          Come for the rituals, stay for the food, and bless the two of them in person.
        </p>
      </div>
    </section>
  );
}

export function Families() {
  return (
    <section id="families" className="card flex items-center bg-[#f7efe0] px-4 text-ink" aria-label="The two families">
      <div className="reveal mx-auto w-full max-w-4xl py-6 sm:py-10">
        <h2 className="text-center">
          <span className="font-bangla-display block text-4xl text-alta sm:text-5xl">দুই পরিবার, এক উৎসব</span>
          <span className="font-display mt-1 block text-xl text-ink sm:text-2xl">Two families, one celebration</span>
        </h2>
        <div className="mt-5 grid gap-3 sm:mt-8 md:grid-cols-2 md:gap-6">
          <Family side="bride" />
          <Family side="groom" />
        </div>
      </div>
    </section>
  );
}
