"""Extrae ilustraciones de @iconify-json/fluent-emoji-flat y las tiñe en azul monocromo (estilo refC/refD).
Uso: python3 -I tools/make_illus.py <icons.json>"""
import json, re, sys, pathlib

ICONS = json.load(open(sys.argv[1]))
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "illus"
OUT.mkdir(parents=True, exist_ok=True)

NAMES = [
    "wine-glass", "beer-mug", "cigarette", "pill", "syringe", "prohibited", "alarm-clock", "mobile-phone",
    "mobile-phone-off", "person-in-bed", "hourglass-not-done", "mirror-ball", "party-popper", "clinking-beer-mugs",
    "bottle-with-popping-cork", "open-book", "books", "brain", "church", "folded-hands", "prayer-beads",
    "crescent-moon", "sleeping-face", "sunrise-over-mountains", "sun", "man-lifting-weights", "flexed-biceps",
    "spiral-calendar", "man-running", "green-salad", "broccoli", "green-apple", "red-apple", "man-facepalming",
    "broken-heart", "cloud-with-rain", "sun-behind-rain-cloud", "sparkles", "glowing-star", "trophy",
    "person-with-crown", "mountain", "man-standing", "thumbs-up", "heart-with-arrow", "bell", "man-in-lotus-position",
    "rocket", "fire", "check-mark-button", "cross-mark", "speech-balloon", "red-heart",
]

# rampa azul: luminancia 0 → azul noche, 1 → cian casi blanco
RAMP = [(0.00, (3, 10, 30)), (0.25, (8, 40, 110)), (0.50, (20, 95, 220)), (0.75, (70, 165, 255)), (1.00, (205, 240, 255))]


def ramp(l):
    for (a, ca), (b, cb) in zip(RAMP, RAMP[1:]):
        if l <= b:
            t = (l - a) / (b - a)
            return tuple(round(ca[i] + (cb[i] - ca[i]) * t) for i in range(3))
    return RAMP[-1][1]


def recolor(m):
    h = m.group(1)
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    l = 0.2126 * r + 0.7152 * g + 0.0722 * b
    l = min(1.0, max(0.0, (l - 0.05) / 0.9)) ** 0.9  # más contraste
    return "#%02X%02X%02X" % ramp(l)


w, h = ICONS.get("width", 32), ICONS.get("height", 32)
for n in NAMES:
    ic = ICONS["icons"].get(n)
    if not ic:
        print("falta", n); continue
    body = re.sub(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b", recolor, ic["body"])
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ic.get("width", w)} {ic.get("height", h)}">{body}</svg>'
    (OUT / f"{n}.svg").write_text(svg)
print("ilustraciones:", len(list(OUT.glob("*.svg"))))
