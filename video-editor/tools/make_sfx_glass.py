"""Sintetiza los sonidos de cristal y agua para el video del vaso (48 kHz, estéreo).
Uso: python3 -I tools/make_sfx_glass.py"""
import pathlib, wave
import numpy as np

SR = 48000
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(11)


def save(name, l, r=None, peak_db=-3.0):
    r = l if r is None else r
    x = np.stack([l, r], axis=1)
    x = x / (np.abs(x).max() + 1e-9) * 10 ** (peak_db / 20)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())


def tink(n, at, freq, decay, amp):
    t = np.arange(n - at) / SR
    y = np.zeros(n)
    y[at:] = amp * np.sin(2 * np.pi * freq * t) * np.exp(-t / decay) * (1 + 0.3 * np.sin(2 * np.pi * freq * 1.51 * t))
    return y


def hp(x, a=0.97):  # paso alto simple
    y = np.zeros_like(x)
    for i in range(1, len(x)):
        y[i] = a * (y[i - 1] + x[i] - x[i - 1])
    return y


# grieta: chasquido seco + crujido corto agudo
n = int(0.5 * SR)
t = np.arange(n) / SR
crack = hp(rng.normal(0, 1, n)) * np.exp(-t / 0.018) * 1.2
for k in range(7):
    at = int((0.01 + k * 0.035 + rng.uniform(0, 0.02)) * SR)
    crack += hp(rng.normal(0, 1, n)) * np.exp(-np.clip(t - at / SR, 0, None) / 0.008) * (t >= at / SR) * (0.6 - k * 0.06)
    crack += tink(n, at, rng.uniform(3200, 6500), 0.03, 0.25)
save("crack", crack, np.roll(crack, 40))

# rotura: golpe + estallido de ruido + lluvia de fragmentos que tintinean
n = int(1.6 * SR)
t = np.arange(n) / SR
sh = hp(rng.normal(0, 1, n)) * np.exp(-t / 0.12) * 1.0
sh += np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.06) * 0.8
L = sh.copy(); R = sh.copy()
for k in range(70):
    at = int(rng.uniform(0.0, 0.9) ** 1.6 * SR)
    tk = tink(n, at, rng.uniform(2500, 8000), rng.uniform(0.02, 0.12), rng.uniform(0.08, 0.35) * (1 - at / n))
    p = rng.uniform(0, 1)
    L += tk * (1 - p); R += tk * p
save("shatter", L, R)

# gota: "bloop" que cae de tono
n = int(0.35 * SR)
t = np.arange(n) / SR
f = 1100 * np.exp(-t / 0.05) + 380
ph = 2 * np.pi * np.cumsum(f) / SR
drop = np.sin(ph) * np.exp(-t / 0.07) * np.clip(t / 0.003, 0, 1)
save("drop", drop, peak_db=-4)
print("ok")
