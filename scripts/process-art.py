"""Turn the full-size Gemini JPEGs in art-src/ into light WebP files in src/art/.

Cutouts: the paper background is flood-filled away from the image edges, giving a transparent WebP.
Images in the same cutout group share one crop, so they stay aligned when crossfaded.
Scenes: resized and recompressed; optional crop removes the baked-in caption at the bottom.

    python3 scripts/process-art.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art-src"
OUT = ROOT / "src" / "art"

SENTINEL = (255, 0, 255)
PAD = 6

# groups of name -> source file, with a max height for the group
CUTOUTS = [
    ({"hero-couple": "hero-couple.png.jpeg"}, 1100),
    ({"groom-waiting": "groom-waiting.jpeg"}, 1100),
    ({"drishti-covered": "drishti-covered.jpeg", "drishti-revealed": "drishti-revealed.jpeg"}, 900),
    ({"mala-bodol": "mala-bodol.jpeg"}, 1000),
    ({"kolagach": "kolagach.jpeg"}, 1100),
]

# name -> (source file, max width, fraction of height kept from the top)
SCENES = {
    "train-window": ("train-window.png.jpeg", 1600, 1.0),
    "haor-boat": ("haor-boat.png.jpeg", 1800, 1.0),
    "holud": ("holud.png.jpeg", 900, 0.82),
    "biye": ("saat-paak.jpeg", 900, 0.82),
    "boubhat": ("boubhat.jpeg", 900, 0.82),
    "aashirbaad": ("Ashirbad.jpeg", 900, 0.82),
}


def cut_out(img: Image.Image, thresh: int = 42) -> Image.Image:
    rgb = img.convert("RGB")
    w, h = rgb.size
    filled = rgb.copy()
    step = 12
    seeds = [(x, 0) for x in range(0, w, step)] + [(x, h - 1) for x in range(0, w, step)]
    seeds += [(0, y) for y in range(0, h, step)] + [(w - 1, y) for y in range(0, h, step)]
    for xy in seeds:
        px = filled.getpixel(xy)
        if px == SENTINEL or sum(px) < 600:  # only start from paper-coloured pixels
            continue
        ImageDraw.floodfill(filled, xy, SENTINEL, thresh=thresh)

    mask = Image.new("L", (w, h), 255)
    mask.putdata([0 if p == SENTINEL else 255 for p in filled.getdata()])
    # pull the edge in by a pixel to drop the paper fringe, then soften
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = rgb.convert("RGBA")
    out.putalpha(mask)
    return out


def fit(img: Image.Image, max_w: int | None = None, max_h: int | None = None) -> Image.Image:
    w, h = img.size
    scale = min((max_w or w) / w, (max_h or h) / h, 1)
    return img.resize((round(w * scale), round(h * scale)), Image.LANCZOS) if scale < 1 else img


def save(img: Image.Image, name: str, **opts) -> None:
    path = OUT / f"{name}.webp"
    img.save(path, "WEBP", method=6, **opts)
    print(f"{name}.webp  {img.size}  {path.stat().st_size // 1024} KB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for group, max_h in CUTOUTS:
        cut = {name: cut_out(Image.open(SRC / src)) for name, src in group.items()}
        boxes = [img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox() for img in cut.values()]
        w, h = next(iter(cut.values())).size
        box = (
            max(0, min(b[0] for b in boxes) - PAD), max(0, min(b[1] for b in boxes) - PAD),
            min(w, max(b[2] for b in boxes) + PAD), min(h, max(b[3] for b in boxes) + PAD),
        )
        for name, img in cut.items():
            img = fit(img.crop(box), max_h=max_h)
            save(img, name, quality=84, alpha_quality=90)
            if name == "hero-couple":
                fit(img, max_h=520).save(OUT / "og-couple.png", "PNG", optimize=True)

    for name, (src, max_w, keep) in SCENES.items():
        img = Image.open(SRC / src).convert("RGB")
        if keep < 1:
            img = img.crop((0, 0, img.width, round(img.height * keep)))
        save(fit(img, max_w=max_w), name, quality=80)


if __name__ == "__main__":
    main()
