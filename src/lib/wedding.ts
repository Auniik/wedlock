// Everything the site says about the wedding lives here.
// Dates, times and venue names marked PLACEHOLDER still need confirming.

export const couple = {
  bride: {
    name: "Sumona Chowdhury",
    short: "Sumona",
    bn: "সুমনা চৌধুরী",
    shortBn: "সুমনা",
    father: { name: "Tapan Chowdhury", bn: "শ্রী তপন চৌধুরী" },
    mother: { name: "Sima Rani Chowdhury", bn: "শ্রীমতী সীমা রানী চৌধুরী" },
    home: "Akhrar Mor, Barhatta Road, Netrokona",
    homeBn: "আখড়ার মোড়, বারহাট্টা রোড, নেত্রকোনা",
  },
  groom: {
    name: "Anik Datta",
    short: "Anik",
    bn: "অনিক দত্ত",
    shortBn: "অনিক",
    father: { name: "Arun Datta", bn: "শ্রী অরুণ দত্ত" },
    mother: { name: "Pallabi Datta", bn: "শ্রীমতী পল্লবী দত্ত" },
    home: "North Pirerbag, Mirpur, Dhaka",
    homeBn: "উত্তর পীরেরবাগ, মিরপুর, ঢাকা",
  },
};

export type WeddingEvent = {
  id: "aashirbaad" | "holud" | "biye" | "boubhat";
  name: string;
  bn: string;
  meaning: string;
  start: string; // ISO with +06:00
  end: string;
  venue: string;
  mapQuery: string;
  wear: { label: string; swatch: string };
};

export const events: WeddingEvent[] = [
  {
    id: "aashirbaad",
    name: "Aashirbaad",
    bn: "আশীর্বাদ",
    meaning: "Both families bless the bride and groom with dhaan, durba and gold.",
    start: "2027-01-20T11:00:00+06:00", // PLACEHOLDER
    end: "2027-01-20T14:00:00+06:00",
    venue: "Both family homes", // PLACEHOLDER
    mapQuery: couple.bride.home,
    wear: { label: "Soft pastels", swatch: "#E9C7C2" },
  },
  {
    id: "holud",
    name: "Gaye Holud",
    bn: "গায়ে হলুদ",
    meaning: "Turmeric, music and a lot of laughing. Expect to get yellow.",
    start: "2027-01-22T09:00:00+06:00", // PLACEHOLDER
    end: "2027-01-22T13:00:00+06:00",
    venue: "Chowdhury residence, Netrokona", // PLACEHOLDER
    mapQuery: couple.bride.home,
    wear: { label: "Haldi yellow", swatch: "#F2B705" },
  },
  {
    id: "biye",
    name: "Biye",
    bn: "বিয়ে",
    meaning: "Shubho Drishti, Mala Bodol, Saat Paak and Sindoor Daan, under the evening lagna.",
    start: "2027-01-22T19:30:00+06:00", // PLACEHOLDER
    end: "2027-01-23T01:00:00+06:00",
    venue: "Chowdhury residence, Netrokona", // PLACEHOLDER
    mapQuery: couple.bride.home,
    wear: { label: "Red, gold, your best", swatch: "#A3132B" },
  },
  {
    id: "boubhat",
    name: "Bou Bhat",
    bn: "বৌভাত",
    meaning: "Sumona's first meal at the Datta home, and a big dinner for everyone.",
    start: "2027-01-24T19:00:00+06:00", // PLACEHOLDER
    end: "2027-01-24T23:00:00+06:00",
    venue: "Near North Pirerbag, Mirpur, Dhaka", // PLACEHOLDER
    mapQuery: couple.groom.home,
    wear: { label: "Festive, any colour", swatch: "#2F5D3A" },
  },
];

export const weddingDay = events.find((e) => e.id === "biye")!;

export const mapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const bnDigits = "০১২৩৪৫৬৭৮৯";
export const toBn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => bnDigits[Number(d)]);
