# Sumona & Anik — শুভ বিবাহ

A scroll-driven wedding invitation: blow the shankh, ride the barjatri train from Mirpur to Netrokona,
watch the Shubho Drishti, then RSVP and float a wish on the haor.

## Edit the details

All names, dates, venues and dress hints live in `src/lib/wedding.ts`.
Lines marked `PLACEHOLDER` still need real dates, times and venue names.

## Illustrations

Originals from Gemini live in `art-src/` (not deployed). After adding or replacing one, run

```bash
python3 scripts/process-art.py
```

It cuts the paper background off the character art, crops captions off the ceremony scenes, and writes small WebP
files to `src/art/`. Prompts used to make them are in `art-prompts.md`.

## Run it

```bash
npm run dev        # http://localhost:3000
```

RSVPs and wishes are stored in Upstash Redis (provisioned through the Vercel Marketplace).
`vercel env pull` writes the `KV_REST_API_URL` / `KV_REST_API_TOKEN` variables into `.env.local`.

- `wishes`: public list shown as diyas on the river
- `rsvps`: every reply, with guest count and chosen ceremonies (read it in the Upstash data browser)

## Map of the code

- `src/components/Journey.tsx`: the Dhaka → Netrokona train ride
- `src/components/ShubhoDrishti.tsx`: paan-leaf reveal, mala bodol, sindoor
- `src/components/DiyaRiver.tsx`: wishes wall + RSVP form
- `src/lib/audio.ts`: tanpura drone, Raag Bhupali melody, shankh and bells, all synthesised in the browser
