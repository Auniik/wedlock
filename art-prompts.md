# Illustration prompts for Sumona & Anik (v2)

**Where:** Google Gemini (gemini.google.com). Do everything in **one chat** so faces and style stay locked.
**Save to:** `art-src/` with the exact filename given. JPEG from Gemini is fine; I convert everything.

## How this set works

Every scene is built as **layers** so the site can do real parallax and frame-to-frame animation:

- **Full frame**: the finished picture. It locks composition, light and style.
- **Plate**: the same picture with the people removed (background layer).
- **Cutout**: only the people (or object), same size and position, on flat white (character layer).

Sequences (marked **KEYFRAME**) are made by *editing the previous image*, never by starting fresh, so the camera,
background and positions stay identical and the crossfade on the site looks like animation.

Reusable edit prompts (copy these when a step says so):

> **PLATE EDIT:** Edit the previous image. Remove both people completely and fill the space with what would naturally be
> behind them. Keep the camera, framing, lighting, colours and every other object exactly the same.

> **CUTOUT EDIT:** Edit the previous image. Keep only [WHO/WHAT] exactly as they are (same pose, same size, same position
> in the frame) and replace everything else with a flat pure-white #FFFFFF background. No floor, no shadow, no texture.

> **KEYFRAME EDIT:** Edit the previous image. Keep the camera, framing, background, lighting, clothing and the position
> and size of both people exactly the same. Change only: [CHANGE].

If an edit drifts (camera moves, faces change), say "Undo that. Keep everything identical and change only …" and retry.

---

## 0. Style and characters (send first, with photos)

Upload 1–2 clear daylight photos of Sumona and of Anik (front-facing, no filters, no sunglasses), then send:

> We're making a series of illustrations for our Bengali Hindu wedding invitation website. Every image in this chat must
> use this exact style:
>
> **Style:** warm cinematic storybook illustration, soft painterly digital art. **Fine, thin linework only**: hairline
> warm-brown outlines (never black, never thick, no heavy ink borders, no comic-book outlines). Smooth cel shading with
> soft gradients, golden-hour light with gentle rim light and a soft bloom, light atmospheric haze, subtle depth of field
> in the background, a faint paper grain. Palette: vermilion and alta red, marigold, ivory, banana-leaf green, dusky
> rose, sunset orange, deep indigo for night. Characters slightly stylised with expressive eyes and catchlights, natural
> adult proportions (about 6.5 heads tall); not chibi, not anime, not a 3D render, not photorealistic.
>
> **Every image:** edge-to-edge composition with no frame, no border, no margin, no vignette. No text, letters, captions,
> logos or watermarks. Hands always have five correctly drawn fingers. Keep important subjects inside the central
> third of the frame so it can also be cropped to a phone screen.
>
> **Anik (groom)**, based on my photos (keep his face, glasses, beard, hairstyle and skin tone recognisable): tall white
> shola-pith topor (conical crown with lace-like carving and a small red flag on top), ivory silk panjabi with fine gold
> embroidery at collar and cuffs, an ivory uttariya (shawl) over one shoulder, white dhoti with a thin red border,
> sandalwood dots on the forehead, a thin red-and-yellow sacred thread on his right wrist, gold-brown nagra sandals.
> He is about a head taller than Sumona.
>
> **Sumona (bride)**, based on my photos (keep her face, hairstyle and skin tone recognisable): red Benarasi saree with
> gold zari border, the end of the saree draped over her head as a veil, white shola mukut (crown), a delicate arc of
> white and red chandan dots above the eyebrows, red bindi, gold nath (nose ring) with a fine chain to the ear, gold
> necklaces and jhumkas, shankha (white carved conch bangle) and pola (red coral bangle) with gold bangles on both
> wrists, fine mehendi on the backs of her hands, alta on fingertips and feet, a jasmine gajra around her bun.
>
> First make a **character turnaround sheet**: Anik and Sumona each shown front, three-quarter and side profile,
> full body, standing, on a flat pure-white background. 16:9.

Correct the faces now ("Anik's glasses are rounder", "Sumona's face is fuller") before going on. Save as `character-sheet.png`.

---

## 1. Opening: the two hands (gate of the site)

The site opens on this: their two hands drift towards each other, like Michelangelo's *Creation of Adam*, and touch when
the guest taps.

**1a. `hands-full.png`**
> Same style. Wide 21:9 close-up of two hands reaching towards each other horizontally across the frame, composed like
> Michelangelo's Creation of Adam. Camera at the same height as the hands, looking straight at them from the side.
> From the left edge: **Anik's right hand**, palm down, relaxed, index finger extended and slightly drooping, other
> fingers loosely curled; ivory silk panjabi cuff with gold embroidery entering from the left edge; red-and-yellow
> sacred thread on the wrist. From the right edge: **Sumona's right hand**, palm down, reaching with intent, index finger
> pointing straight, other fingers gently curled; red Benarasi sleeve edge with gold zari entering from the right edge;
> shankha, pola and gold bangles at the wrist; fine mehendi on the back of the hand; alta red on the fingertips.
> The two index fingertips are almost touching, separated by a small gap (about 2% of the image width), exactly at
> the centre of the frame. Background: soft warm dusk gradient, deep red to marigold, with faint floating marigold
> petals. No glow between the fingers.

**1b. `hand-anik.png`**: CUTOUT EDIT with [Anik's hand and sleeve].
**1c. `hand-sumona.png`**: go back to `hands-full`, then CUTOUT EDIT with [Sumona's hand, bangles and sleeve].

---

## 2. Hero: the courtyard

**2a. `hero-full.png`**
> Same style. Wide 16:9. The wedding courtyard of a family home in Netrokona at blue-hour dusk: white alpona patterns
> on the floor, two banana trees with decorated brass mangal ghots at their base on the left and right edges, strands
> of marigold hanging from the top edge, a red-and-white cloth canopy, warm fairy lights, a few floating diyas.
> Camera at chest height, straight on, slightly wide lens. **Anik and Sumona stand in the centre, full body from topor
> to feet** with a little space above the topor and below the feet, holding hands between them. Anik on the left, body
> turned three-quarters towards Sumona, **looking at the viewer** with a big smile. Sumona on the right, body
> three-quarters towards Anik, **looking up at Anik** with a shy smile. Each wears a white rajanigandha-and-red-rose
> garland around the neck. Their free hands are relaxed at their sides.

**2b. `hero-plate.png`**: PLATE EDIT.
**2c. `hero-couple.png`**: go back to `hero-full`, then CUTOUT EDIT with [Anik and Sumona].
**2d. `hero-fg.png`**: go back to `hero-full`, then CUTOUT EDIT with [only the two banana trees, the mangal ghots and
the hanging marigold strands].

---

## 3. The barjatri train

**3a. `train-full.png`**
> Same style. Wide 21:9 night scene under a full moon. Camera low in the paddy field, looking side-on at a green
> Bangladesh Railway train crossing the frame from left to right on a raised embankment. Paddy fields with fireflies
> in the foreground, a line of palm and betel-nut trees behind, a few village lights. **Anik leans out of the third
> carriage window in his topor**, facing the direction of travel (right), waving with his right hand and laughing.
> Relatives at the neighbouring windows hold up sweet boxes. No text on the train.

**3b. `train-plate.png`**: PLATE EDIT, but remove **the whole train and everyone on it** (keep the embankment and track).
**3c. `train-cutout.png`**: go back to `train-full`, then CUTOUT EDIT with [the train and everyone on it].

---

## 4. Shubho Drishti → Mala Bodol → Sindoor Daan (KEYFRAME sequence)

The ritual is followed exactly: **the bride is lifted on the piri by her cousins until she is at the groom's eye
level**, so their eyes meet level. Mala bodol also happens while she is still on the raised piri. All four frames
share one camera.

Garland rule for every frame: **there are exactly two garlands. A garland is either held in someone's hands or worn
around a neck, never both, and never duplicated.**

**4a. `drishti-1.png`**
> Same style. Wide 16:9, night, the wedding mandap: banana trees at the four corners, red-and-white cloth canopy,
> marigold strands, brass lamps, alpona floor, warm lamp light from the left. Camera at the couple's eye level, side-on,
> both people in profile or near-profile, **full figures visible**. **Anik on the left third**, standing, facing right in
> three-quarter profile, hands loosely folded in front at waist height, **no garland on him**. **Sumona on the right
> third**, sitting cross-legged on a carved wooden piri that is **lifted to Anik's eye level by two young men** (only their
> arms and shoulders visible at the bottom of the frame, faces out of frame). Sumona faces left towards Anik and
> **holds two heart-shaped betel (paan) leaves in front of her face, covering her eyes and face completely**. The two
> garlands lie on a brass plate held by an aunt at the far right edge (only her hands and the plate visible).

**4b. `drishti-2.png`**: KEYFRAME EDIT, change only:
> Sumona lowers the paan leaves to her chin. **Sumona and Anik look directly into each other's eyes (clear eye contact,
> pupils aimed at each other)**, both with soft surprised smiles.

**4c. `drishti-3.png`**: KEYFRAME EDIT, change only:
> Mala bodol. The paan leaves are gone. Anik lifts **one garland with both hands over Sumona's head**, about to place it
> on her. Sumona holds **the other garland with both hands** at chest height, ready to give it. Neither is wearing a
> garland yet. The aunt's plate is now empty. Both are laughing and still looking at each other.

**4d. `drishti-4.png`**: KEYFRAME EDIT, change only:
> The garlands are exchanged: **Sumona wears one garland, Anik wears the other**. Nobody holds a garland in their hands.
> Their hands are free: Anik's hands folded, Sumona's resting on her knees. Marigold petals fall through the air,
> and they keep smiling at each other.

**4e. `sindoor.png`** (new composition, same mandap)
> Same style, same mandap and lighting. Wide 16:9, camera at seated eye level, three-quarter front view. Sumona sits on
> a low piri facing the viewer at three-quarters, veil pushed back to show her hair parting, eyes closed, gentle smile,
> wearing her garland. Anik kneels just behind her right shoulder, wearing his garland, holding a small open silver
> sindoor box in his left hand and **drawing a line of red sindoor along her hair parting with a gold ring held in his
> right hand**. A few grains of sindoor have fallen on the bridge of her nose. Elders blur softly in the background.

**4f. `lojja-bostro.png`** (optional): KEYFRAME EDIT of `sindoor`, change only:
> Anik gently drapes a new red-bordered white saree over Sumona's head as a veil (lojja bostro); the sindoor box is set
> down; she opens her eyes and looks up at him.

---

## 5. Ceremony cards (each one full-screen on the site)

Same style, same faces. **Wide 3:2, edge-to-edge, no text, no frame.** Camera at eye level, three-quarter view.

- **`aashirbaad.png`**: Anik and Sumona sit side by side on a decorated mat with hands folded; elders from both families
  bless them by placing dhaan (paddy) and durba grass on their heads from a brass plate. Both look down respectfully.
- **`holud.png`**: Sumona in a yellow saree sits on a low stool, laughing, eyes squeezed shut, while two aunties smear
  turmeric paste on her cheeks; brass bowls of turmeric and marigolds around; morning sunlight.
- **`biye.png`**: Saat Paak / sacred fire: the couple walks around the fire, Anik ahead, Sumona behind holding the end of
  his uttariya, which is tied to her saree end in a knot; both wear their garlands; priest seated at the side.
- **`boubhat.png`**: At the Datta home in Dhaka, Sumona (red-bordered white saree, sindoor in her parting) serves rice
  from a brass bowl onto a banana leaf; Anik and his parents sit on the floor smiling; the evening's lights are warm.

---

## 6. Wishes on the haor

**6a. `haor-full.png`**
> Same style. Wide 16:9, a haor in Netrokona at dusk: calm water reflecting an orange-pink sky, pink shapla (water lilies)
> and lotus leaves, white egrets, distant village and palm trees on the horizon. **The couple sits in a small wooden
> nouka decorated with marigold garlands on the right third, in the upper half of the frame**, Sumona leaning on Anik's
> shoulder, both looking out across the water towards the left. **The lower 40% of the frame is open, calm water** with
> only a few lily pads (guests' diyas will float there). No diyas in the image.

**6b. `haor-plate.png`**: PLATE EDIT, remove [the boat and the couple].
**6c. `haor-boat.png`**: go back to `haor-full`, then CUTOUT EDIT with [the boat and the couple].

---

## 7. Last scene

**7a. `sunset.png`**
> Same style. Wide 16:9, golden-hour sunset by the Kangsha river. **Seen from behind**: Anik and Sumona sit close on the
> top step of an old brick ghat, Sumona's head resting on Anik's shoulder, his arm around her. Sumona's bun with a
> jasmine gajra, red-and-gold saree; Anik's ivory panjabi and shawl. A large low sun on the horizon, a Bengali terracotta
> temple silhouette and palm trees on the far bank, branches with leaves framing the top edge. **Keep the upper-left
> quarter of the sky clear** for text.

---

### Minimum set if you're short on time
`hands-full` + both hand cutouts, `hero-full` + plate + couple, `drishti-1` → `drishti-4`, `sindoor`, `sunset`.
Everything else can stay as the current images.
