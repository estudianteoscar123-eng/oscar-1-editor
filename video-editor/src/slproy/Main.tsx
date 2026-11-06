import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/sl-proy/words.json";
import cuts from "../../public/sl-proy/cuts.json";
import { Card, Filters, Line } from "../thorfinn/SubTest2";

// SL · "Para proyectar tu futuro, primero acepta que no lo controlas" (Pr 16:9) — material reciclado de Ippo/Joe/Black Clover/MHA.
// Estructura de las refs: tesis paradójica (escrita sobre la escena) → espejo → "Pero entonces…" → versículo → aplicación → aforismo. Cíclico.
const FPS = 30;
const C = (cuts as { cuts: number[]; end: number }).cuts;
const END = (cuts as { cuts: number[]; end: number }).end;
export const SLPROY_TOTAL = Math.round(END * FPS);
const S = (t: number) => Math.round(t * FPS);
const BODY = "SpBody";
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });
type Wd = [string, number, number];
const W = (words as Wd[]).map((w) => [w[0].replace(/[.,;:]+$/g, ""), w[1], w[2]] as Wd);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const clean = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñ0-9:]/g, "");
const at = (w: string, nth = 0) => W.filter((x) => clean(x[0]) === w)[nth]?.[1] ?? 0;

const GOLD = "#F5B51C", RED = "#D42A3C", BLUE = "#3E8BFF", WHITE = "#F4F4F4";
// tarjetas (texto en pantalla). Fuera de ellas: subtítulo palabra a palabra.
const CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0.1, to: at("primero") - 0.05, lines: [{ txt: "PARA PROYECTAR", at: at("para"), kind: "small" }, { txt: "TU FUTURO", at: at("futuro"), kind: "big", color: GOLD }] },
  { from: at("primero") - 0.05, to: at("por") - 0.1, lines: [{ txt: "PRIMERO ACEPTA", at: at("primero"), kind: "small" }, { txt: "QUE NO LO", at: at("no"), kind: "mid" }, { txt: "CONTROLAS", at: at("controlas"), kind: "big", color: RED, italic: true }] },
  { from: at("saldrá") - 0.3, to: at("y") - 0.05, lines: [{ txt: "NO SALDRÁ COMO", at: at("saldrá") - 0.3, kind: "small" }, { txt: "IMAGINABAS", at: at("imaginabas"), kind: "big", color: WHITE, italic: true }] },
  { from: at("será"), to: at("pues") - 0.05, lines: [{ txt: "LO QUE TE ROBA", at: at("robe"), kind: "small" }, { txt: "LA PAZ", at: at("paz"), kind: "big", color: BLUE }] },
  { from: at("pues") - 0.05, to: at("porque") - 0.05, lines: [{ txt: "PROVERBIOS 16:9", at: at("pues"), kind: "small" }, { txt: "«EL CORAZÓN DEL HOMBRE", at: at("corazón"), kind: "small" }, { txt: "PIENSA SU CAMINO;", at: at("piensa"), kind: "small" }, { txt: "MAS EL SEÑOR", at: at("mas"), kind: "mid" }, { txt: "ENDEREZA", at: at("endereza"), kind: "big", color: GOLD }, { txt: "SUS PASOS»", at: at("pasos"), kind: "small" }] },
  { from: at("convertirla") - 0.05, to: at("y", 2) - 0.05, lines: [{ txt: "CONVERTIRLA EN", at: at("convertirla"), kind: "small" }, { txt: "UNA CÁRCEL", at: at("cárcel"), kind: "big", color: RED }] },
  { from: at("fe") - 0.2, to: at("sabiendo") - 0.05, lines: [{ txt: "LA FE TE PERMITE", at: at("fe") - 0.2, kind: "small" }, { txt: "AVANZAR", at: at("avanzar"), kind: "big", color: GOLD, italic: true }] },
  { from: at("aprende"), to: at("seguir") - 0.3, lines: [{ txt: "APRENDE A PLANEAR", at: at("aprende"), kind: "small" }, { txt: "CON LAS MANOS", at: at("manos"), kind: "mid" }, { txt: "ABIERTAS", at: at("abiertas"), kind: "big", color: GOLD }] },
  { from: at("quedios"), to: at("porque", 1) - 0.05, lines: [{ txt: "DIOS VE EL MAPA", at: at("quedios"), kind: "small" }, { txt: "COMPLETO", at: at("completo"), kind: "big", color: BLUE, italic: true }] },
  { from: at("sino"), to: END, lines: [{ txt: "SINO EN SABER", at: at("sino"), kind: "small" }, { txt: "CON QUIÉN VAS A", at: at("con", 1), kind: "mid" }, { txt: "CAMINAR", at: at("caminar"), kind: "big", color: GOLD }] },
];
// golpes visuales: destello + sacudida + zoom
const HITS = [at("controlas"), at("imaginabas"), at("cárcel"), at("avanzar"), at("abiertas"), at("caminar")];
const SFX: [number, string, number][] = [[at("controlas") - 0.05, "sfx/impact.wav", 0.3], [at("endereza") - 0.15, "sfx/shimmer.wav", 0.3], [at("cárcel") - 0.05, "sfx/impact.wav", 0.3]];

const Body: React.FC<{ t: number }> = ({ t }) => {
  let k = -1;
  W.forEach((w, i) => { if (t >= w[1] - 0.03) k = i; });
  if (k < 0 || t > W[k][2] + 0.5) return null;
  const pop = ip(t - W[k][1], [0, 0.08], [1.18, 1]);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 58, color: "#fff", letterSpacing: 0.5, transform: `scale(${pop})`, textShadow: "0 3px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.8)" }}>{W[k][0].toUpperCase()}</div>;
};

const Shots: React.FC<{ f: number }> = ({ f }) => (
  <>
    {C.map((c, i) => {
      const end = C[i + 1] ?? END;
      const from = i === 0 ? 0 : S(c);
      const dur = Math.max(1, S(end) - from);
      const local = f - from;
      const z = ip(local, [0, dur], [1.04, 1.12]);
      const ox = i % 2 ? 46 : 54;
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% 45%` }}>
            <OffthreadVideo src={staticFile(`sl-proy/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </>
);

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "screen", pointerEvents: "none" }}>
    <filter id="sgr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter="url(#sgr)" />
  </svg>
);

export const SLProy: React.FC<{ thumb?: boolean }> = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const last = HITS.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 9);
  const cutIn = Math.exp(-(t - (C.filter((c) => c <= t).pop() ?? -9)) * 16);
  const cam = `translate(${(random(`x${f}`) - 0.5) * 22 * kick}px, ${(random(`y${f}`) - 0.5) * 22 * kick}px) scale(${1 + 0.07 * kick + 0.03 * cutIn})`;
  const card = CARDS.find((c) => t >= c.from && t < c.to);
  const hook = t < at("por");
  const dim = card ? (hook ? 0.3 : 0.35) : 0.12;
  // portada: fotogramas 0–2, escena del gancho + "PARA SER / FUERTE" completos, sin subtítulos
  const thumb = f < 3 ? (
      <AbsoluteFill style={{ background: "#000", opacity: f === 2 ? 0.5 : 1 }}>
        <Filters />
        <AbsoluteFill style={{ transform: "scale(1.1)", filter: "contrast(1.08) saturate(1.15)" }}><OffthreadVideo src={staticFile("sl-proy/s00.mp4")} muted style={{ width: 1080, height: 1920 }} startFrom={8} /></AbsoluteFill>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.25)" }} />
        <Card t={99} lines={CARDS[0].lines} />
      </AbsoluteFill>
  ) : null;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Filters />
      <AbsoluteFill style={{ transform: cam, filter: "contrast(1.07) saturate(1.12)" }}>
        <Shots f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: 0.55 * Math.exp(-(t - last) * 22) }} />
      <Grain f={f} />
      {f < 3 ? null : card ? <Card t={t} lines={card.lines} /> : <Body t={t} />}
      <Audio src={staticFile("sl-proy/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
      {thumb}
    </AbsoluteFill>
  );
};
