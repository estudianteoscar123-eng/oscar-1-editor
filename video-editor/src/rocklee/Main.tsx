import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

// SL · "No hay forma" — Rock Lee, el talento de la perseverancia. Montaje de momentos clave con subtítulos de dos niveles.
const FPS = 30;
export const ROCKLEE_TOTAL = Math.round(22.9 * FPS);
const S = (t: number) => Math.round(t * FPS);

const SMALL = "RockLeeSerifB";
const BIG = "RockLeeSerifXB";
loadFont({ family: SMALL, url: staticFile("fonts/playfair-display-latin-700-italic.woff2"), weight: "700", style: "italic" });
loadFont({ family: BIG, url: staticFile("fonts/playfair-display-latin-800-italic.woff2"), weight: "800", style: "italic" });

const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const out = Easing.out(Easing.cubic);

const C = {
  dolor: "#FF3B3B",
  capaz: "#A6FF2E",
  accion: "#FFC21A",
  logro: "#62C8FF",
  tu: "#F27BFF",
  blanco: "#FFFFFF",
};

// cortes del montaje (inicio de cada fragmento)
const CUTS = [0, 1.54, 6.29, 9.54, 11.69, 14.16, 16.82, 22.02];

type W = [string, number, string?];
type Zone = "A" | "B" | "C" | "D";
type Block = { small?: W[]; big: W[]; zone: Zone; size?: number };
const BLOCKS: Block[] = [
  { big: [["¡Jamás", 0.08, C.dolor], ["serás", 0.58, C.dolor]], zone: "C", size: 124 },
  { big: [["un", 0.9, C.dolor], ["ninja!", 1.16, C.dolor]], zone: "A", size: 150 },
  { small: [["No", 1.69], ["hay", 1.79], ["forma", 1.97], ["de", 2.19], ["que", 2.27]], big: [["alguien", 2.49, C.dolor]], zone: "A", size: 130 },
  { small: [["que", 2.63], ["no", 2.77]], big: [["puede", 2.93, C.dolor], ["hacer", 3.17, C.dolor]], zone: "B", size: 130 },
  { small: [["un", 3.35]], big: [["ninjutsu", 3.51, C.dolor]], zone: "C", size: 150 },
  { small: [["pueda", 4.03]], big: [["convertirse", 4.33, C.accion]], zone: "A", size: 130 },
  { small: [["en", 4.85]], big: [["ninja.", 5.17, C.accion]], zone: "D", size: 150 },
  { small: [["¡Puedo", 5.39]], big: [["hacerlo!", 5.95, C.capaz]], zone: "B", size: 150 },
  { small: [["si", 6.44], ["no", 6.54], ["puedo", 6.74], ["hacer", 6.96]], big: [["mil", 7.16, C.accion], ["sentadillas", 7.38, C.accion]], zone: "A", size: 100 },
  { small: [["serán", 7.94]], big: [["mil", 8.22, C.accion], ["golpes.", 8.48, C.accion]], zone: "C", size: 150 },
  { small: [["pero", 9.62], ["me", 9.8]], big: [["esfuerzo", 10.1, C.capaz]], zone: "B", size: 150 },
  { small: [["y", 10.5]], big: [["jamás", 10.7, C.accion], ["me", 11.12, C.accion], ["rindo.", 11.3, C.accion]], zone: "A", size: 110 },
  { small: [["ese", 11.75], ["es", 11.97], ["mi", 12.09]], big: [["don,", 12.27, C.tu]], zone: "C", size: 150 },
  { small: [["ese", 12.61], ["es", 12.77], ["mi", 12.89]], big: [["camino,", 13.29, C.tu], ["ninja.", 13.69, C.tu]], zone: "B", size: 110 },
  { small: [["lo", 14.31], ["triste", 14.53], ["es", 14.91], ["que", 15.05]], big: [["jamás", 15.31, C.dolor]], zone: "A", size: 150 },
  { small: [["me", 15.67]], big: [["vencerás.", 15.85, C.dolor]], zone: "C", size: 170 },
  { small: [["si", 16.97], ["no", 17.11], ["puedo", 17.27], ["hacer", 17.51], ["mil", 17.69]], big: [["doscientos", 17.85, C.accion]], zone: "B", size: 130 },
  { small: [["sin", 18.35]], big: [["equivocarme.", 18.59, C.dolor]], zone: "A", size: 120 },
  { small: [["entonces", 19.59], ["daré", 19.87]], big: [["dos", 20.07, C.accion], ["mil", 20.25, C.accion], ["patadas.", 20.57, C.accion]], zone: "C", size: 110 },
  { big: [["¡Todo!", 22.15, C.accion]], zone: "C", size: 230 },
];
const blockStart = (b: Block) => (b.small?.[0]?.[1] ?? b.big[0][1]);
const blockLast = (b: Block) => b.big[b.big.length - 1][1];

const ZONES: Record<Zone, React.CSSProperties> = {
  A: { top: 560, right: 96, textAlign: "right", alignItems: "flex-end" },
  B: { top: 1120, left: 96, textAlign: "left", alignItems: "flex-start" },
  C: { top: 820, left: 90, right: 90, textAlign: "center", alignItems: "center" },
  D: { top: 1210, left: 90, right: 90, textAlign: "center", alignItems: "center" },
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
      const end = next ? S(blockStart(next)) : ROCKLEE_TOTAL + 10;
      if (f < s || f >= end) return null;
      const size = b.size ?? 112;
      const dim = ip(f - S(blockLast(b)), [S(0.7), S(1.0)], [1, 0.55]);
      const exit = ip(end - f, [0, 3], [0, 1]);
      return (
        <div key={i} style={{ position: "absolute", display: "flex", flexDirection: "column", ...ZONES[b.zone], opacity: Math.min(dim, exit) }}>
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

const SQ = 960;
const Clip: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  let k = 0;
  for (let i = 0; i < CUTS.length; i++) if (t >= CUTS[i]) k = i;
  const since = f - S(CUTS[k]);
  const punch = ip(since, [0, 8], [1.025, 1]);
  return (
    <div style={{ position: "absolute", left: (1080 - SQ) / 2, top: (1920 - SQ) / 2, width: SQ, height: SQ, borderRadius: 34, overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.06)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch})`, filter: "contrast(1.04)" }}>
        <OffthreadVideo src={staticFile("rocklee/base.mp4")} muted style={{ width: SQ, height: SQ }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
    </div>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="rg">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} />
    </filter>
    <rect width={1080} height={1920} filter="url(#rg)" />
  </svg>
);

export const RockLee: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip f={f} />
      <Grain f={f} />
      <Captions f={f} />
      <Audio src={staticFile("rocklee/mezcla.wav")} />
    </AbsoluteFill>
  );
};
