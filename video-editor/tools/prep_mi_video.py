"""Corta silencios >0.3 s, recorta la franja útil del vídeo y genera public/mi-video/*.
Uso: python3 -I tools/prep_mi_video.py <video> <whisper.json> <musica>"""
import json, subprocess, sys, pathlib

VIDEO, WJSON, MUSIC = sys.argv[1:4]
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "mi-video"
OUT.mkdir(parents=True, exist_ok=True)
FPS = 30
GAP = 0.30   # silencio máximo permitido
PAD = 0.06   # aire que se deja a cada lado del corte
CROP = "crop=386:320:190:352"  # franja de cámara sin números ni marca de agua

FIXES = {1: "bebas", 62: "Sé", 63: None}  # errores de Whisper ("evas", "Se ha")

# Frases: (palabras de la línea, palabras destacadas, regla nº)
PHRASES = [
    ([0, 1], [2], 1), ([3, 4, 5, 6], [7], 2), ([8, 9, 10], [11], 3), ([12, 13], [14], 3),
    ([15, 16], [17], 4), ([18, 19], [20], 4), ([21, 22, 23], [24], 5), ([25, 26], [27], 5),
    ([28, 29], [30], 6), ([31], [32], 6), ([33, 34, 35, 36], [37], 7), ([38], [39], 8),
    ([40], [41], 9), ([42, 43], [44, 45], 10), ([46], [47], 10), ([48, 49, 50], [51], 11),
    ([52, 53], [54], 12), ([55, 56, 57], [58], 12), ([59, 60], [61], 12), ([62], [64], 13),
    ([65, 66, 67, 68, 69], [70], 13), ([71, 72], [73], 14), ([74, 75, 76], [], 14),
    ([77, 78], [79], 14), ([80, 81, 82], [83], 15), ([84, 85, 86, 87], [88, 89], 15),
]

words = json.load(open(WJSON))["chunks"]
w = [{"i": i, "text": c["text"].strip(), "s": c["timestamp"][0], "e": c["timestamp"][1]} for i, c in enumerate(words)]
for i, t in FIXES.items():
    w[i]["text"] = t

# Tramos a conservar
start = max(0.0, w[0]["s"] - PAD)
segs, cur = [], start
for a, b in zip(w, w[1:]):
    if b["s"] - a["e"] > GAP:
        segs.append((cur, a["e"] + PAD)); cur = b["s"] - PAD
segs.append((cur, w[-1]["e"] + 0.15))

def remap(t):
    acc = 0.0
    for s, e in segs:
        if t <= e:
            return acc + max(0.0, t - s)
        acc += e - s
    return acc

total = sum(e - s for s, e in segs)
for x in w:
    x["s"], x["e"] = round(remap(x["s"]), 3), round(remap(x["e"]), 3)

# Vídeo y voz recortados
vparts = "".join(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{k}];[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS[a{k}];" for k, (s, e) in enumerate(segs))
concat = "".join(f"[v{k}][a{k}]" for k in range(len(segs)))
fc = vparts + f"{concat}concat=n={len(segs)}:v=1:a=1[v][a];[v]{CROP},scale=1158:960:flags=lanczos,unsharp=5:5:0.6,fps={FPS}[vo];[a]loudnorm=I=-18:TP=-1.5:LRA=7[ao]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VIDEO, "-filter_complex", fc, "-map", "[vo]", "-an",
                "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", str(OUT / "camara.mp4"),
                "-map", "[ao]", "-ar", "48000", str(OUT / "voz.wav")], check=True)

# Música de fondo: bucle, ≈12 dB por debajo de la voz, fundido final
subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "3", "-i", MUSIC, "-vn", "-af",
                f"atrim=0:{total:.3f},loudnorm=I=-31:TP=-6,afade=t=in:d=0.3,afade=t=out:st={total-1.2:.3f}:d=1.2",
                "-ar", "48000", str(OUT / "musica.wav")], check=True)

phrases = []
for k, (line, hl, rule) in enumerate(PHRASES):
    ids = [i for i in line + hl if w[i]["text"]]
    s = min(w[i]["s"] for i in ids)
    phrases.append({"line": [i for i in line if w[i]["text"]], "hl": hl, "rule": rule, "start": s})
for k, p in enumerate(phrases):
    last = max(w[i]["e"] for i in p["line"] + p["hl"])
    nxt = phrases[k + 1]["start"] if k + 1 < len(phrases) else total
    p["end"] = round(min(nxt, last + 0.6), 3)

json.dump({"fps": FPS, "duration": round(total, 3), "segments": segs, "words": w, "phrases": phrases},
          open(OUT / "data.json", "w"), ensure_ascii=False, indent=1)
print(f"tramos={len(segs)} duración={total:.2f}s (original {words[-1]['timestamp'][1]:.2f}s de voz)")
