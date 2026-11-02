import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

// SL · "Ya sé que duele" — escena del death crawl, montaje de momentos clave con subtítulos de dos niveles
// (línea pequeña de contexto + palabra clave grande con color por función).
const FPS = 30;
export const GIANTS_TOTAL = Math.round(22.42 * FPS);
const S = (t: number) => Math.round(t * FPS);

const SMALL = "GiantsSerifB";
const BIG = "GiantsSerifXB";
loadFont({ family: SMALL, url: staticFile("fonts/playfair-display-latin-700-italic.woff2"), weight: "700", style: "italic" });
loadFont({ family: BIG, url: staticFile("fonts/playfair-display-latin-800-italic.woff2"), weight: "800", style: "italic" });

const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const out = Easing.out(Easing.cubic);

// ---------- color por función ----------
const C = {
  dolor: "#FF3B3B", // dolor y negación
  capaz: "#A6FF2E", // capacidad
  accion: "#FFC21A", // acción y mandato
  logro: "#62C8FF", // resultado
  tu: "#F27BFF", // identidad
  blanco: "#FFFFFF",
};

// ---------- cortes (inicio de cada fragmento en el montaje) ----------
const CUTS = [0, 2.56, 5.41, 6.54, 8.22, 9.85, 12.87, 14.83, 16.33, 19.22];

// ---------- bloques de subtítulos ----------
type W = [string, number, string?]; // palabra, inicio (s), color (solo palabras grandes)
type Zone = "A" | "B" | "C" | "D";
type Block = { small?: W[]; big: W[]; zone: Zone; size?: number; until?: number };
const BLOCKS: Block[] = [
  { big: [["duele.", 0.1, C.dolor]], zone: "C", size: 150 },
  { small: [["ya", 0.8], ["sé", 1.0], ["que", 1.14]], big: [["duele,", 1.32, C.dolor]], zone: "A" },
  { small: [["pero", 1.66]], big: [["avanza.", 1.84, C.accion]], zone: "B" },
  { small: [["no", 2.76], ["vas", 2.88], ["a", 3.04]], big: [["poder.", 3.3, C.dolor]], zone: "A" },
  { small: [["no", 4.22], ["va", 4.32], ["a", 4.4]], big: [["llegar.", 4.52, C.dolor]], zone: "C" },
  { small: [["puedes", 5.5], ["dar", 5.74]], big: [["más", 5.9, C.capaz], ["que", 6.04, C.capaz], ["eso.", 6.26, C.capaz]], zone: "B" },
  { small: [["no", 6.66], ["te", 6.78], ["rindas", 6.92], ["hasta", 7.24], ["que", 7.38]], big: [["lo", 7.48, C.accion], ["des", 7.58, C.accion], ["todo.", 7.82, C.accion]], zone: "A" },
  { small: [["entrégame", 8.42]], big: [["el", 8.76, C.accion], ["corazón.", 9.08, C.accion]], zone: "D" },
  { small: [["tienes", 9.89]], big: [["más.", 10.21, C.capaz]], zone: "B", size: 110 },
  { small: [["tienes", 10.83]], big: [["más.", 11.14, C.capaz]], zone: "A", size: 135 },
  { small: [["tienes", 11.9]], big: [["más.", 12.21, C.capaz]], zone: "C", size: 175 },
  { big: [["tú", 12.88, C.tu], ["puedes,", 13.02, C.capaz]], zone: "B" },
  { small: [["no", 13.83], ["te", 13.92]], big: [["rindas.", 14.01, C.accion]], zone: "A", until: 14.83 },
  { small: [["arriba,", 16.46]], big: [["Brock.", 16.8, C.tu]], zone: "C" },
  { small: [["estás", 17.74], ["en", 17.84], ["la", 17.92], ["zona", 18.24], ["de", 18.4]], big: [["anotación.", 18.54, C.logro]], zone: "D", size: 124 },
  { small: [["¿y", 19.9], ["tú,", 20.1], ["hasta", 20.6], ["dónde", 20.8]], big: [["llegarías?", 21.1, C.tu]], zone: "C", size: 120 },
];
const blockStart = (b: Block) => (b.small?.[0]?.[1] ?? b.big[0][1]);
const blockLast = (b: Block) => b.big[b.big.length - 1][1];

// zonas: la palabra cae sobre la imagen y a veces se sale al negro, como en la referencia
const ZONES: Record<Zone, React.CSSProperties> = {
  A: { top: 560, right: 96, textAlign: "right", alignItems: "flex-end" },
  B: { top: 1120, left: 96, textAlign: "left", alignItems: "flex-start" },
  C: { top: 820, left: 0, right: 0, textAlign: "center", alignItems: "center" },
  D: { top: 1210, left: 0, right: 0, textAlign: "center", alignItems: "center" },
};

const Word: React.FC<{ w: W; f: number; big: boolean; size: number }> = ({ w, f, big, size }) => {
  const t = f - S(w[1]);
  if (t < 0) return <span style={{ opacity: 0, marginRight: big ? size * 0.22 : 14 }}>{w[0]}</span>;
  const c = w[2] ?? C.blanco;
  const k = out(ip(t, [0, 5], [0, 1]));
  const flash = big ? ip(t, [0, 2, 8], [0.6, 0.6, 0]) : 0;
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: big ? size * 0.22 : 14,
        opacity: ip(t, [0, 3], [0, 1]),
        transform: `translateY(${(1 - k) * (big ? 26 : 12)}px) scale(${1 + (1 - k) * (big ? 0.35 : 0.2)})`,
        filter: `blur(${(1 - k) * 8}px) brightness(${1 + flash})`,
        color: c,
        textShadow: big
          ? `0 0 14px ${c}CC, 0 0 38px ${c}77, 0 6px 18px rgba(0,0,0,0.9)`
          : "0 0 10px rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.95)",
      }}
    >
      {w[0]}
    </span>
  );
};

const Captions: React.FC<{ f: number }> = ({ f }) => (
  <>
    {BLOCKS.map((b, i) => {
      const s = S(blockStart(b));
      const next = BLOCKS[i + 1];
      const end = b.until ? S(b.until) : next ? S(blockStart(next)) : GIANTS_TOTAL + 10;
      if (f < s || f >= end) return null;
      const size = b.size ?? 112;
      // al terminar de decirse, el bloque queda un poco atenuado hasta que entra el siguiente
      const dim = ip(f - S(blockLast(b)), [S(0.7), S(1.0)], [1, 0.55]);
      const exit = ip(end - f, [0, 3], [0, 1]);
      return (
        <div key={i} style={{ position: "absolute", display: "flex", flexDirection: "column", maxWidth: 900, ...ZONES[b.zone], opacity: Math.min(dim, exit) }}>
          {b.small ? (
            <div style={{ fontFamily: SMALL, fontStyle: "italic", fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: "#fff", whiteSpace: "nowrap" }}>
              {b.small.map((w, j) => <Word key={j} w={w} f={f} big={false} size={size} />)}
            </div>
          ) : null}
          <div style={{ fontFamily: BIG, fontStyle: "italic", fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: -1, marginTop: b.small ? -6 : 0, whiteSpace: "nowrap" }}>
            {b.big.map((w, j) => <Word key={j} w={w} f={f} big size={size} />)}
          </div>
        </div>
      );
    })}
  </>
);

// ---------- clip cuadrado ----------
const SQ = 960;
const Clip: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  let k = 0;
  for (let i = 0; i < CUTS.length; i++) if (t >= CUTS[i]) k = i;
  const since = f - S(CUTS[k]);
  const len = S((CUTS[k + 1] ?? 22.42) - CUTS[k]);
  const reveal = k === CUTS.length - 1;
  // golpe de entrada en cada corte + deriva lenta; el plano aéreo se abre despacio para mostrar el campo entero
  const punch = ip(since, [0, 6], [1.07, 1]);
  const drift = reveal ? ip(since, [0, len], [1.18, 1.0]) : ip(since, [0, len], [1.0, 1.06]);
  const ox = [50, 45, 55, 50, 40, 50, 55, 50, 45, 60][k];
  const flash = k > 0 && k !== 7 ? ip(since, [0, 1, 5], [0.22, 0.22, 0]) : 0;
  // el desplome entra en cámara lenta visual: leve desaturado
  const grade = k === 7 ? "saturate(0.6) contrast(1.1) brightness(0.9)" : reveal ? `brightness(${ip(since, [0, 20], [1.5, 1.05])}) saturate(1.1)` : "contrast(1.04)";
  return (
    <div style={{ position: "absolute", left: (1080 - SQ) / 2, top: (1920 - SQ) / 2, width: SQ, height: SQ, borderRadius: 34, overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.06)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch * drift})`, transformOrigin: `${ox}% 50%`, filter: grade }}>
        <OffthreadVideo src={staticFile("giants/base.mp4")} muted style={{ width: SQ, height: SQ }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />
    </div>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="gg">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} />
    </filter>
    <rect width={1080} height={1920} filter="url(#gg)" />
  </svg>
);

export const Giants: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip f={f} />
      <Grain f={f} />
      <Captions f={f} />
      <Audio src={staticFile("giants/mezcla.wav")} />
    </AbsoluteFill>
  );
};
