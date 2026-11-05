import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/sl-ippo/words.json";
import cuts from "../../public/sl-ippo/cuts.json";
import { Card, Filters, Line } from "../thorfinn/SubTest2";

// SL · "Para ser fuerte, primero debes aceptar que eres débil" (2 Co 12:9) — Hajime no Ippo + anime.
// Estructura de las refs: tesis paradójica (escrita sobre la escena) → espejo → "Pero entonces…" → versículo → aplicación → aforismo. Cíclico.
const FPS = 30;
const C = (cuts as { cuts: number[]; end: number }).cuts;
const END = (cuts as { cuts: number[]; end: number }).end;
export const SLIPPO_TOTAL = Math.round(END * FPS);
const S = (t: number) => Math.round(t * FPS);
const BODY = "SiBody";
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });
type Wd = [string, number, number];
const W = (words as Wd[]).map((w) => [w[0].replace(/[.,;:]+$/g, ""), w[1], w[2]] as Wd);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const clean = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñ0-9:]/g, "");
const at = (w: string, nth = 0) => W.filter((x) => clean(x[0]) === w)[nth]?.[1] ?? 0;

const GOLD = "#F5B51C", RED = "#D42A3C", BLUE = "#3E8BFF", WHITE = "#F4F4F4";
// tarjetas (texto en pantalla). Fuera de ellas: subtítulo palabra a palabra.
const CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0.1, to: at("primero") - 0.05, lines: [{ txt: "PARA SER", at: at("para"), kind: "small" }, { txt: "FUERTE", at: at("fuerte"), kind: "big", color: GOLD }] },
  { from: at("primero") - 0.05, to: at("porque") - 0.1, lines: [{ txt: "PRIMERO DEBES", at: at("primero"), kind: "small" }, { txt: "ACEPTAR QUE ERES", at: at("aceptar"), kind: "mid" }, { txt: "DÉBIL", at: at("débil"), kind: "big", color: RED, italic: true }] },
  { from: at("siempre"), to: at("que", 3), lines: [{ txt: "SIEMPRE LLEGARÁ", at: at("siempre"), kind: "small" }, { txt: "UN GOLPE", at: at("golpe") - 0.1, kind: "big", color: WHITE }] },
  { from: at("terminará"), to: at("no") - 0.05, lines: [{ txt: "TERMINARÁ POR", at: at("terminará"), kind: "small" }, { txt: "ROMPERTE", at: at("romperte"), kind: "big", color: RED }] },
  { from: at("no") - 0.05, to: at("porque", 1), lines: [{ txt: "¿NO ESTÁS", at: at("no"), kind: "small" }, { txt: "CANSADO DE", at: at("cansado"), kind: "mid" }, { txt: "SONREÍR?", at: at("sonreír"), kind: "big", color: GOLD, italic: true }] },
  { from: at("pero") - 0.05, to: at("la", 0) - 0.05, lines: [{ txt: "PERO ENTONCES", at: at("pero"), kind: "small" }, { txt: "¿QUÉ PUEDO", at: at("qué"), kind: "mid" }, { txt: "HACER?", at: at("hacer"), kind: "big", color: WHITE }] },
  { from: at("estar"), to: at("por", 2) - 0.05, lines: [{ txt: "ESTAR", at: at("estar"), kind: "small" }, { txt: "SOLO", at: at("solo"), kind: "big", color: BLUE, italic: true }] },
  { from: at("segunda") - 0.05, to: at("y", 4) - 0.05, lines: [{ txt: "2 CORINTIOS 12:9", at: at("segunda"), kind: "small" }, { txt: "«BÁSTATE", at: at("bástate"), kind: "mid" }, { txt: "MI GRACIA»", at: at("gracia"), kind: "mid" }, { txt: "MI PODER SE", at: at("poder"), kind: "small" }, { txt: "PERFECCIONA EN LA", at: at("perfecciona"), kind: "small" }, { txt: "DEBILIDAD»", at: at("debilidad", 2), kind: "big", color: GOLD }] },
  { from: at("y", 4) - 0.05, to: at("espera", 1) - 0.05, lines: [{ txt: "DIOS NO ESPERA", at: at("dios", 1), kind: "small" }, { txt: "QUE LLEGUES", at: at("llegues"), kind: "mid" }, { txt: "FUERTE", at: at("fuerte", 1), kind: "big", color: WHITE }] },
  { from: at("espera", 1) - 0.05, to: at("porque", 3) - 0.05, lines: [{ txt: "ESPERA QUE", at: at("espera", 1), kind: "small" }, { txt: "LLEGUES", at: at("llegues", 1), kind: "mid" }, { txt: "SINCERO", at: at("sincero"), kind: "big", color: GOLD, italic: true }] },
  { from: at("donde"), to: at("no", 2) - 0.05, lines: [{ txt: "DONDE ÉL MOSTRARÁ", at: at("donde"), kind: "small" }, { txt: "SU PODER", at: at("su"), kind: "big", color: GOLD }] },
  { from: at("no", 4) - 0.05, to: at("definen", 1) - 0.05, lines: [{ txt: "NO DEFINEN", at: at("definen"), kind: "small" }, { txt: "QUIÉN ERES", at: at("quién"), kind: "big", color: RED, italic: true }] },
  { from: at("aprende"), to: at("aprende", 1) - 0.05, lines: [{ txt: "APRENDE A", at: at("aprende"), kind: "small" }, { txt: "CAER SIN", at: at("caer"), kind: "mid" }, { txt: "RENDIRTE", at: at("rendirte"), kind: "big", color: RED }] },
  { from: at("verdadera") - 0.15, to: at("sino") - 0.05, lines: [{ txt: "LA VERDADERA", at: at("verdadera") - 0.15, kind: "small" }, { txt: "FUERZA", at: at("fuerza"), kind: "big", color: GOLD }] },
  { from: at("tener"), to: END, lines: [{ txt: "TENER A QUIÉN", at: at("tener"), kind: "small" }, { txt: "AFERRARTE", at: at("aferrarte"), kind: "big", color: WHITE, italic: true }] },
];
// golpes visuales: destello + sacudida + zoom
const HITS = [at("golpe"), at("romperte"), at("solo"), at("bástate"), at("poder", 1) + 0.6, at("golpes"), at("tumban"), at("rendirte"), at("fuerza"), at("débil")];
const SFX: [number, string, number][] = [[at("golpe") - 0.05, "sfx/impact.wav", 0.35], [at("bástate") - 0.15, "sfx/shimmer.wav", 0.3], [at("golpes") - 0.05, "sfx/impact.wav", 0.3]];

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
            <OffthreadVideo src={staticFile(`sl-ippo/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
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

export const SLIppo: React.FC<{ thumb?: boolean }> = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const last = HITS.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 9);
  const cutIn = Math.exp(-(t - (C.filter((c) => c <= t).pop() ?? -9)) * 16);
  const cam = `translate(${(random(`x${f}`) - 0.5) * 22 * kick}px, ${(random(`y${f}`) - 0.5) * 22 * kick}px) scale(${1 + 0.07 * kick + 0.03 * cutIn})`;
  const card = CARDS.find((c) => t >= c.from && t < c.to);
  const hook = t < at("porque");
  const dim = card ? (hook ? 0.5 : 0.35) : 0.12;
  // portada: fotogramas 0–2, escena del gancho + "PARA SER / FUERTE" completos, sin subtítulos
  const thumb = f < 3 ? (
      <AbsoluteFill style={{ background: "#000", opacity: f === 2 ? 0.5 : 1 }}>
        <Filters />
        <AbsoluteFill style={{ transform: "scale(1.1)", filter: "contrast(1.08) saturate(1.15)" }}><OffthreadVideo src={staticFile("sl-ippo/s00.mp4")} muted style={{ width: 1080, height: 1920 }} startFrom={8} /></AbsoluteFill>
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.42)" }} />
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
      <Audio src={staticFile("sl-ippo/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
      {thumb}
    </AbsoluteFill>
  );
};
