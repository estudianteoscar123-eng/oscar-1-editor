import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/thorfinn/words.json";

// SL · "Tú contra ti" — Thorfinn (Vinland Saga). Narración + anime, subtítulos estilo referencias (2 modos), cíclico.
const FPS = 30;
export const THORFINN_TOTAL = Math.round(77.9 * FPS);
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const out = Easing.out(Easing.cubic);

const SANS = "TfSans";
const SCRIPT = "TfScript";
const SERIF = "TfSerif";
loadFont({ family: SANS, url: staticFile("fonts/poppins-latin-800-normal.woff2"), weight: "800" });
loadFont({ family: SCRIPT, url: staticFile("fonts/kaushan-script-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: SERIF, url: staticFile("fonts/cinzel-latin-900-normal.woff2"), weight: "900" });

// ---------- planos ----------
const CUTS = [0.0, 1.1, 2.2, 4.5, 5.9, 6.7, 8.9, 10.2, 11.6, 12.6, 13.4, 14.7, 16.1, 17.8, 19.2, 20.9, 22.4, 24.0, 25.6, 26.6, 27.8, 29.4, 30.4, 31.8, 33.0, 34.4, 35.6, 37.0, 37.9, 39.2, 40.8, 42.8, 44.6, 46.2, 48.1, 49.8, 52.8, 54.5, 55.7, 57.2, 58.5, 59.8, 61.1, 62.6, 63.9, 66.0, 67.2, 68.6, 69.8, 71.9, 73.3, 74.8, 76.0];
const STILL = new Set([29]); // el vacío (blanco) queda quieto

const zoomOf = (i: number, f: number, len: number) => {
  if (STILL.has(i)) return 1;
  const a = i % 2 === 0 ? [1.0, 1.08] : [1.08, 1.0];
  return interpolate(f, [0, len], a) * ip(f, [0, 5], [1.06, 1]);
};

const Shot: React.FC<{ i: number; len: number }> = ({ i, len }) => {
  const f = useCurrentFrame();
  const z = zoomOf(i, f, len);
  const ox = 50 + (random(`ox${i}`) - 0.5) * 20;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% 45%`, filter: `blur(${ip(f, [0, 2], [6, 0])}px)` }}>
        <OffthreadVideo src={staticFile(`thorfinn/p${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- modo 2: línea caligráfica + serif grande con textura ----------
const Rough: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="tfrough">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} />
      <feDisplacementMap in="SourceGraphic" scale={4} />
    </filter>
  </svg>
);
const Card: React.FC<{ f: number; t0: number; small: string; big: string[]; y?: number; size?: number; red?: number }> = ({ f, t0, small, big, y = 820, size = 150, red = -1 }) => {
  const d = f - S(t0);
  if (d < 0) return null;
  const k = out(ip(d, [0, 8], [0, 1]));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center" }}>
      <div style={{ fontFamily: SCRIPT, fontSize: 70, color: "#F4F1EA", textAlign: "left", marginLeft: 90, opacity: k, transform: `translateX(${(1 - k) * -30}px) rotate(-4deg)`, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{small}</div>
      {big.map((b, j) => {
        const kk = out(ip(d - 4 - j * 5, [0, 8], [0, 1]));
        return (
          <div key={j} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.0, letterSpacing: 4, color: j === red ? "#C8102E" : "#EDE6DA", opacity: kk, transform: `scale(${1 + (1 - kk) * 0.25})`, filter: `url(#tfrough) blur(${(1 - kk) * 6}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.95)" }}>{b}</div>
        );
      })}
    </div>
  );
};
const CARDS = [
  { t0: 0.15, end: 2.2, small: "quien vive para", big: ["DESTRUIR"], size: 140 },
  { t0: 63.85, end: 66.0, small: "no tienes", big: ["ENEMIGOS"], size: 136 },
  { t0: 75.0, end: 77.9, small: "su verdadera batalla", big: ["NUNCA ESTUVO", "AFUERA"], size: 128, red: 1 },
];

// ---------- modo 1: 1–3 palabras, sans en mayúsculas; clave en caligráfica o en rojo ----------
type Wd = [string, number, number];
const W = words as Wd[];
const SCRIPT_KEYS = new Set(["odio", "padre", "hombre", "vacío", "herida", "pelear", "esclavo", "pesadillas", "golpes", "debilidad", "joven"]);
const RED_KEYS = new Set(["arma", "vengarse", "mató", "matar", "murió", "quitado", "asesino"]);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, "");
type G = { w: Wd[] };
const GROUPS: G[] = (() => {
  const gs: G[] = [];
  let cur: Wd[] = [];
  W.forEach((w, i) => {
    cur.push(w);
    const nx = W[i + 1];
    const brk = !nx || /[.,;:?!]$/.test(w[0]) || cur.length >= 3 || SCRIPT_KEYS.has(clean(w[0])) || RED_KEYS.has(clean(w[0])) || (nx && (SCRIPT_KEYS.has(clean(nx[0])) || RED_KEYS.has(clean(nx[0])))) || cur.map((x) => x[0]).join(" ").length > 13;
    if (brk) { gs.push({ w: cur }); cur = []; }
  });
  return gs;
})();
const inCard = (t: number) => CARDS.some((c) => t >= c.t0 - 0.05 && t < c.end);

const Caption: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  if (inCard(t)) return null;
  const gi = GROUPS.findIndex((g, i) => t >= g.w[0][1] - 0.04 && (i + 1 >= GROUPS.length || t < GROUPS[i + 1].w[0][1] - 0.04));
  if (gi < 0) return null;
  const g = GROUPS[gi];
  const chars = g.w.map((x) => x[0]).join(" ").length;
  const fit = Math.min(1, 15 / Math.max(1, chars));
  if (t > g.w[g.w.length - 1][2] + 0.6) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1180, textAlign: "center", whiteSpace: "nowrap" }}>
      {g.w.map((w, j) => {
        const d = f - S(w[1] - 0.04);
        if (d < 0) return null;
        const k = out(ip(d, [0, 4], [0, 1]));
        const key = clean(w[0]);
        const isScript = SCRIPT_KEYS.has(key);
        const isRed = RED_KEYS.has(key);
        const txt = isScript ? w[0].replace(/[.,;:]$/, "").toLowerCase() : w[0].replace(/[.,;:]$/, "").toUpperCase();
        return (
          <span key={j} style={{ display: "inline-block", margin: "0 12px", fontFamily: isScript ? SCRIPT : SANS, fontWeight: isScript ? 400 : 800, fontSize: (isScript ? 118 : 86) * (isScript ? 1 : fit), color: isScript ? "#4FD1C5" : isRed ? "#E0242F" : "#FFFFFF", letterSpacing: isScript ? 0 : 1, transform: `scale(${1 + (1 - k) * 0.3}) translateY(${(1 - k) * 14}px)`, opacity: k, textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 8px 26px rgba(0,0,0,0.9)", verticalAlign: "middle" }}>
            {txt}
          </span>
        );
      })}
    </div>
  );
};

// ---------- gancho: texto detrás de la figura ----------
const HookFg: React.FC = () => {
  const f = useCurrentFrame();
  const z = zoomOf(0, f, S(1.1));
  const ox = 50 + (random("ox0") - 0.5) * 20;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% 45%` }}>
      <Img src={staticFile(`thorfinn/fg/${String(Math.min(f, 32)).padStart(3, "0")}.png`)} style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="tfg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} /></filter>
    <rect width={1080} height={1920} filter="url(#tfg)" />
  </svg>
);

export const Thorfinn: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const card = CARDS.find((c) => t >= c.t0 && t < c.end);
  const dark = card && card.t0 > 1 ? ip(f - S(card.t0), [0, 8], [0, 0.55]) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Rough />
      <AbsoluteFill style={{ filter: "contrast(1.08) saturate(1.06)" }}>
        {CUTS.map((c, i) => {
          const end = CUTS[i + 1] ?? 77.9;
          return (
            <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
              <Shot i={i} len={S(end) - S(c)} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      {/* gancho: tarjeta entre el fondo y la figura recortada */}
      {t < CARDS[0].end ? <Card f={f} t0={CARDS[0].t0} small={CARDS[0].small} big={CARDS[0].big} size={CARDS[0].size} y={1150} /> : null}
      <Sequence from={0} durationInFrames={S(1.1)}>
        <HookFg />
      </Sequence>
      {CARDS.slice(1).map((c, i) => (t >= c.t0 && t < c.end ? <Card key={i} f={f} t0={c.t0} small={c.small} big={c.big} size={c.size} red={c.red} /> : null))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <Grain f={f} />
      <Caption f={f} />
      <Audio src={staticFile("thorfinn/mezcla.wav")} />
    </AbsoluteFill>
  );
};
