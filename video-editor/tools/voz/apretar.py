"""Acorta TODAS las pausas de la voz (regla: ninguna pausa > 0,4 s) y reajusta los tiempos de las palabras.
Uso: python3 apretar.py voz.wav voz.json [pausa_max=0.22]
- Detecta silencios (< -35 dB, > 0,3 s) y los deja en `pausa_max` segundos.
- Nunca toca la voz: solo quita silencio del medio de cada pausa. La cola final queda en 0,5 s.
- Sobrescribe voz.wav y voz.json.
"""
import json, re, subprocess, sys

wav, js = sys.argv[1], sys.argv[2]
keep = float(sys.argv[3]) if len(sys.argv) > 3 else 0.22
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-af', 'silencedetect=n=-35dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', log)]
ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', log)]
cuts = []  # (a, b): tramo de silencio a eliminar
for s, e in zip(starts, ends):
    if s < 0.05 or e > dur - 0.05:
        continue
    a, b = s + keep / 2, e - keep / 2
    if b - a > 0.02:
        cuts.append((a, b))
# tramos a conservar
segs, pos = [], 0.0
for a, b in cuts:
    segs.append((pos, a)); pos = b
segs.append((pos, dur))
parts = ''.join(f'[0]atrim={a:.4f}:{b:.4f},asetpts=N/SR/TB[s{i}];' for i, (a, b) in enumerate(segs))
fc = parts + ''.join(f'[s{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1,apad=pad_dur=0.5,atrim=0:{sum(b - a for a, b in segs) + 0.5:.3f}[o]'
tmp = wav + '.tmp.wav'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', tmp], check=True)
subprocess.run(['mv', tmp, wav], check=True)

def remap(t):
    shift = sum(min(b, max(a, t)) - a for a, b in cuts)
    return round(t - shift, 2)

d = json.load(open(js))
for c in d['chunks']:
    c['timestamp'] = [remap(c['timestamp'][0]), remap(c['timestamp'][1])]
json.dump(d, open(js, 'w'), ensure_ascii=False)
print(f'{len(cuts)} pausas acortadas · {dur:.2f}s → {sum(b - a for a, b in segs):.2f}s')
