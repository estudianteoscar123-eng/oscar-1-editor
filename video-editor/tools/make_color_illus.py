"""Ilustraciones planas en color original (fluent-emoji-flat). Uso: python3 -I tools/make_color_illus.py <icons.json>"""
import json, sys, pathlib

ICONS = json.load(open(sys.argv[1]))
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "illus-color"
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
w, h = ICONS.get("width", 32), ICONS.get("height", 32)
for n in NAMES:
    ic = ICONS["icons"].get(n)
    if not ic:
        print("falta", n); continue
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ic.get("width", w)} {ic.get("height", h)}">{ic["body"]}</svg>'
    (OUT / f"{n}.svg").write_text(svg)
print("ilustraciones:", len(list(OUT.glob("*.svg"))))
