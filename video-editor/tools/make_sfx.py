"""Sintetiza los efectos de sonido en public/sfx/ (48 kHz, estéreo). Uso: python3 -I tools/make_sfx.py"""
import pathlib, wave
import numpy as np

SR = 48000
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def save(name, l, r=None, peak_db=-3.0):
    r = l if r is None else r
    x = np.stack([l, r], axis=1)
    x = x / (np.abs(x).max() + 1e-9) * 10 ** (peak_db / 20)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())


def bandpass_sweep(noise, f0, f1, q=2.5):
    # filtro de estado variable con frecuencia que barre de f0 a f1
    n = len(noise); out = np.zeros(n); low = band = 0.0
    freqs = np.geomspace(f0, f1, n)
    for i in range(n):
        f = 2 * np.sin(np.pi * freqs[i] / SR)
        high = noise[i] - low - band / q
        band += f * high; low += f * band
        out[i] = band
    return out


def env(n, attack, release):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    d = np.exp(-np.clip(t - attack, 0, None) / release)
    return a * d


# whoosh: ruido filtrado que sube de 350 a 4200 Hz, panorámica izquierda→derecha
n = int(0.55 * SR)
w = bandpass_sweep(rng.standard_normal(n), 350, 4200) * env(n, 0.22, 0.12)
pan = np.linspace(0, 1, n)
save("whoosh", w * np.cos(pan * np.pi / 2) * 1.2, w * np.sin(pan * np.pi / 2) * 1.2, -4)

# pop: seno 1100→380 Hz en 70 ms + clic
n = int(0.12 * SR); t = np.arange(n) / SR
f = 380 + 720 * np.exp(-t / 0.018)
p = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)
p[:60] += rng.standard_normal(60) * np.linspace(1, 0, 60) * 0.6
save("pop", p, peak_db=-6)

# tick suave para palabras de las etiquetas
n = int(0.05 * SR); t = np.arange(n) / SR
tk = np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.006)
save("tick", tk, peak_db=-10)

# impacto: sub 52 Hz con caída + golpe de ruido grave
n = int(1.2 * SR); t = np.arange(n) / SR
f = 52 + 70 * np.exp(-t / 0.05)
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35)
hit = bandpass_sweep(rng.standard_normal(n), 900, 120, q=1.2) * np.exp(-t / 0.08)
save("impact", sub + hit * 0.5, peak_db=-2)

# brillo: acorde agudo con armónicos que se apaga (para el cierre)
n = int(1.4 * SR); t = np.arange(n) / SR
sh = sum(np.sin(2 * np.pi * fr * t + k) / (k + 1) for k, fr in enumerate([1318.5, 1975.5, 2637, 3951]))
sh *= env(n, 0.02, 0.45) * (1 + 0.3 * np.sin(2 * np.pi * 7 * t))
save("shimmer", sh, peak_db=-8)
print(sorted(p.name for p in OUT.iterdir()))
