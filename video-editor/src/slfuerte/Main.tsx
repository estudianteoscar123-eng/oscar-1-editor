import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import tl from "../../public/sl-fuerte/timeline.json";
import { Card, Filters, Line } from "../thorfinn/SubTest2";

// SL · "¿Qué se siente ser fuerte?" — escenas canónicas de Hajime no Ippo (doblaje latino) + voz en off.
// Formato de la ref del Gato con Botas: diálogos originales intercalados con la lección. Gancho = la pregunta de Ippo en el segundo 0.
const FPS = 30;
const T = tl as unknown as { end: number; shots: { T: number; T1: number; src: string; lb: boolean }[]; words: [string, number, number, string][]; beats: number[] };
const END = T.end;
export const SLFUERTE_TOTAL = Math.round(END * FPS);
const S = (t: number) => Math.round(t * FPS);
const BODY = "SfBody";
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const GOLD = "#F5B51C", RED = "#D42A3C", WHITE = "#F4F4F4";

const CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0, to: 2.38, lines: [{ txt: "¿QUÉ SE SIENTE", at: 0, kind: "small" }, { txt: "SER FUERTE?", at: 0, kind: "big", color: GOLD }] },
  { from: 54.6, to: 57.13, lines: [{ txt: "PARA", at: 54.6, kind: "small" }, { txt: "DEBILUCHOS", at: 54.67, kind: "big", color: RED, italic: true }] },
  { from: 61.9, to: 63.3, lines: [{ txt: "QUIERO SER", at: 61.9, kind: "small" }, { txt: "OTRA PERSONA", at: 62.41, kind: "big", color: WHITE }] },
  { from: 80.2, to: 82.0, lines: [{ txt: "EN LOS DÍAS QUE", at: 80.2, kind: "small" }, { txt: "NADIE TE VE", at: 80.33, kind: "big", color: GOLD, italic: true }] },
  { from: 89.3, to: 97.1, lines: [{ txt: "ISAÍAS 40:29", at: 89.3, kind: "small" }, { txt: "«ÉL DA ESFUERZO", at: 90.87, kind: "mid" }, { txt: "AL CANSADO,", at: 93.15, kind: "mid" }, { txt: "Y MULTIPLICA LAS", at: 94.67, kind: "small" }, { txt: "FUERZAS»", at: 95.39, kind: "big", color: GOLD }] },
  { from: 101.75, to: 103.96, lines: [{ txt: "SINO EN", at: 101.75, kind: "small" }, { txt: "LEVANTARTE", at: 101.87, kind: "big", color: GOLD }] },
];
const HITS = [0.1, 10.37, 31.85, 71.22, 101.87];
const PULSE = T.beats.filter((b) => (b > 71.2 && b < 88.4) || (b > 97 && b < 104));
const SFX: [number, string, number][] = [[0.05, "sfx/impact.wav", 0.4], [5.55, "sfx/whoosh.wav", 0.3], [10.3, "sfx/impact.wav", 0.35], [71.17, "sfx/impact.wav", 0.45]];

const Body: React.FC<{ t: number }> = ({ t }) => {
  let k = -1;
  T.words.forEach((w, i) => { if (t >= w[1] - 0.03) k = i; });
  if (k < 0 || t > T.words[k][2] + 0.4) return null;
  const w = T.words[k];
  const pop = ip(t - w[1], [0, 0.07], [1.2, 1]);
  const isD = w[3] === "D";
  return <div style={{ position: "absolute", left: 40, right: 40, top: 1180, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 60, color: isD ? "#FFE08A" : "#fff", fontStyle: isD ? "italic" : "normal", letterSpacing: 0.5, transform: `scale(${pop})`, textShadow: "0 3px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.8)" }}>{w[0].replace(/[.,;:]+$/g, "").toUpperCase()}</div>;
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "screen", pointerEvents: "none" }}>
    <filter id="sfg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter="url(#sfg)" />
  </svg>
);

export const SLFuerte: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const lastHit = HITS.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - lastHit) * 9);
  const lastBeat = PULSE.filter((b) => b <= t).pop() ?? -9;
  const beat = Math.exp(-(t - lastBeat) * 12);
  const cutT = T.shots.map((s) => s.T).filter((c) => c <= t).pop() ?? -9;
  const cutIn = Math.exp(-(t - cutT) * 16);
  const rewind = ip(t, [5.55, 5.75, 6.05], [0, 1, 0]);
  const cam = `translate(${(random(`x${f}`) - 0.5) * 24 * kick}px, ${(random(`y${f}`) - 0.5) * 24 * kick}px) scale(${1 + 0.07 * kick + 0.025 * beat + 0.025 * cutIn + 0.12 * rewind})`;
  const card = CARDS.find((c) => t >= c.from && t < c.to);
  const dim = card ? 0.38 : 0.1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Filters />
      <AbsoluteFill style={{ transform: cam, filter: `contrast(1.06) saturate(1.12)${rewind > 0.05 ? ` blur(${rewind * 8}px) hue-rotate(${rewind * 40}deg)` : ""}` }}>
        {T.shots.map((s, i) => {
          const from = i === 0 ? 0 : S(s.T);
          const dur = Math.max(1, S(s.T1) - from);
          const z = s.lb ? 1 : ip(f - from, [0, dur], [1.03, 1.1]);
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${i % 2 ? 46 : 54}% 45%` }}>
                <OffthreadVideo src={staticFile(`sl-fuerte/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: 0.6 * Math.exp(-(t - lastHit) * 20) + 0.5 * rewind }} />
      <Grain f={f} />
      {card ? <Card t={f < 3 ? 99 : t} lines={card.lines} /> : <Body t={t} />}
      <Audio src={staticFile("sl-fuerte/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
