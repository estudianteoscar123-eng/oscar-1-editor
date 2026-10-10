"""Prepara un video crudo para editarlo en Estilo F.

Uso (desde la raíz del repo):
  python3 -I .claude/skills/editar-video/scripts/prep_video.py <video> <slug> [--crop W:H:X:Y] [--lang spanish] [--check-dir DIR] [--solo-aroll]

--solo-aroll rehace solo el recorte de cámara (cuando la hoja de contacto muestra barras o texto quemado).

Genera en video-editor/public/<slug>/:
  voz.wav    voz a -16 LUFS, 48 kHz estéreo, con salida suave al final
  data.json  {"duration", "fps", "frames", "words": [{"text","s","e"}]} con tiempos por palabra (Whisper)
  aroll.mp4  franja útil de la cámara, limpia y ampliada a 1200 px de alto (sin audio)
y una hoja de contacto del A-roll en --check-dir (por defecto video-editor/analysis/<slug>/) para ubicar la cara.
"""
import argparse
import collections
import json
import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
VE = ROOT / "video-editor"
WHISPER = VE / "tools" / "whisper"
MODEL = WHISPER / "models" / "Xenova" / "whisper-small" / "onnx"
FPS = 30


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, text=True, capture_output=True, **kw)


def probe(path):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", str(path)]).stdout
    j = json.loads(out)
    return j["streams"][0]["width"], j["streams"][0]["height"], float(j["format"]["duration"])


def ensure_whisper():
    # El modelo no está en git (pesa ~250 MB): se baja del paquete npm sts-whisper-small (Hugging Face está bloqueado)
    if MODEL.exists():
        return
    print("Instalando Whisper small (una sola vez)…", file=sys.stderr)
    WHISPER.mkdir(parents=True, exist_ok=True)
    run(["npm", "pack", "sts-whisper-small", "-q"], cwd=WHISPER)
    tgz = sorted(WHISPER.glob("sts-whisper-small-*.tgz"))[-1]
    run(["tar", "xzf", tgz.name], cwd=WHISPER)
    if (WHISPER / "models").exists():
        shutil.rmtree(WHISPER / "models")
    shutil.move(str(WHISPER / "package" / "models"), str(WHISPER / "models"))
    shutil.rmtree(WHISPER / "package")
    tgz.unlink()
    if not (WHISPER / "node_modules" / "@huggingface" / "transformers").exists():
        run(["npm", "i", "-q"], cwd=WHISPER)


def detect_crop(video, dur):
    # Franja con imagen real (sin barras negras). Ojo: no detecta texto quemado dentro de la franja.
    err = subprocess.run(
        ["ffmpeg", "-hide_banner", "-t", str(min(dur, 20)), "-i", str(video), "-vf", "cropdetect=24:2:0", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    crops = re.findall(r"crop=(\d+:\d+:\d+:\d+)", err)
    return collections.Counter(crops).most_common(1)[0][0] if crops else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("slug")
    ap.add_argument("--crop", help="W:H:X:Y de la franja de cámara; por defecto se detecta")
    ap.add_argument("--lang", default="spanish")
    ap.add_argument("--check-dir", default=None)
    ap.add_argument("--solo-aroll", action="store_true", help="no rehace voz ni transcripción")
    a = ap.parse_args()

    video = pathlib.Path(a.video).resolve()
    out = VE / "public" / a.slug
    out.mkdir(parents=True, exist_ok=True)
    w, h, dur = probe(video)
    tmp = pathlib.Path(a.check_dir or VE / "analysis" / a.slug).resolve()  # analysis/ está en .gitignore
    tmp.mkdir(parents=True, exist_ok=True)

    words = json.load(open(out / "data.json"))["words"] if a.solo_aroll else []
    frames = int(round(dur * FPS))

    # 1. voz
    fade = max(0.0, dur - 0.6)
    if not a.solo_aroll:
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn", "-af", f"loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st={fade:.2f}:d=0.6", "-ar", "48000", "-ac", "2", str(out / "voz.wav")])

    # 2. transcripción por palabra
    if not a.solo_aroll:
        ensure_whisper()
        w16 = tmp / f"{a.slug}-16k.wav"
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(w16)])
        wj = tmp / f"{a.slug}-whisper.json"
        run(["node", str(WHISPER / "transcribe.mjs"), str(w16), str(wj), a.lang])
        chunks = json.load(open(wj))["chunks"]
        words = [{"text": c["text"].strip(), "s": round(c["timestamp"][0], 3), "e": round((c["timestamp"][1] or c["timestamp"][0] + 0.2), 3)} for c in chunks]
        json.dump({"duration": round(dur, 3), "fps": FPS, "frames": frames, "words": words}, open(out / "data.json", "w"), ensure_ascii=False)

    # 3. A-roll limpio
    crop = a.crop or detect_crop(video, dur) or f"{w}:{h}:0:0"
    cw, ch = map(int, crop.split(":")[:2])
    ow = int(round(cw * 1200 / ch / 2)) * 2
    vf = [f"crop={crop}"]
    if ch < 900:
        vf.append("hqdn3d=2:1.5:4:3")  # fuente pequeña o muy comprimida: quitar bloques antes de ampliar
    vf += [f"scale={ow}:1200:flags=lanczos", "cas=0.55", f"fps={FPS}", "format=yuv420p"]
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-an", "-vf", ",".join(vf), "-c:v", "libx264", "-crf", "15", "-preset", "medium", str(out / "aroll.mp4")])

    # 4. hoja de contacto para ubicar la cara y revisar texto quemado
    sheet = tmp / f"{a.slug}-aroll.png"
    step = max(dur / 8, 0.5)
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out / "aroll.mp4"), "-vf", f"fps=1/{step:.3f},scale=300:-1,tile=4x2", "-frames:v", "1", str(sheet)])
    full = tmp / f"{a.slug}-source.png"
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{dur / 2:.2f}", "-i", str(video), "-frames:v", "1", "-vf", "scale=360:-1", str(full)])

    print(json.dumps({
        "slug": a.slug, "source": f"{w}x{h}", "duration": round(dur, 3), "frames": frames,
        "crop": crop, "aroll": f"{ow}x1200", "words": len(words),
        "sheet": str(sheet), "source_frame": str(full),
    }, ensure_ascii=False, indent=2))
    print("\nTRANSCRIPCIÓN (índice:palabra@segundo):")
    print(" ".join(f"{i}:{x['text']}@{x['s']}" for i, x in enumerate(words)))


if __name__ == "__main__":
    main()
