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

const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñ0-9 ]/g, "");
const wt = (w: string, after = 0) => T.words.find((x) => norm(x[0]) === w && x[1] >= after)?.[1] ?? 0;
const wend = (w: string, after = 0) => T.words.find((x) => norm(x[0]) === w && x[1] >= after)?.[2] ?? 0;
const DEB = wt("debiluchos"), OTRA = wt("otra", 40), NADIE = wt("nadie", 70), ISA = wt("isaías"), EL = wt("él", ISA), CANS = wt("al cansado", ISA), MULT = wt("multiplica", ISA), FZ = wt("fuerzas", ISA), LEV = wt("levantarte", ISA);
const CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0, to: wend("fuerte", 0) + 0.25, lines: [{ txt: "¿QUÉ SE SIENTE", at: 0, kind: "small" }, { txt: "SER FUERTE?", at: 0, kind: "big", color: GOLD }] },
  { from: DEB - 0.1, to: wend("respetar") + 0.1, lines: [{ txt: "PARA", at: DEB - 0.1, kind: "small" }, { txt: "DEBILUCHOS", at: DEB, kind: "big", color: RED, italic: true }] },
  { from: OTRA - 0.5, to: wend("persona", OTRA) + 0.3, lines: [{ txt: "QUIERO SER", at: OTRA - 0.5, kind: "small" }, { txt: "OTRA PERSONA", at: OTRA, kind: "big", color: WHITE }] },
  { from: NADIE - 0.15, to: NADIE + 1.7, lines: [{ txt: "EN LOS DÍAS QUE", at: NADIE - 0.15, kind: "small" }, { txt: "NADIE TE VE", at: NADIE, kind: "big", color: GOLD, italic: true }] },
  { from: ISA, to: wend("ningunas", ISA) + 0.3, lines: [{ txt: "ISAÍAS 40:29", at: ISA, kind: "small" }, { txt: "«ÉL DA ESFUERZO", at: EL, kind: "mid" }, { txt: "AL CANSADO,", at: CANS, kind: "mid" }, { txt: "Y MULTIPLICA LAS", at: MULT, kind: "small" }, { txt: "FUERZAS»", at: FZ, kind: "big", color: GOLD }] },
  { from: LEV - 0.12, to: wend("piernas") + 0.2, lines: [{ txt: "SINO EN", at: LEV - 0.12, kind: "small" }, { txt: "LEVANTARTE", at: LEV, kind: "big", color: GOLD }] },
];
const HITS = [0.1, wt("toma"), wt("maldito") - 0.4, 90.95, LEV];
const MONT = T.shots.find((x) => x.src === "train" && x.T > 60)?.T ?? 70;
const PULSE = T.beats.filter((b) => (b > MONT && b < ISA) || (b > 91 && b < END - 1));
const SFX: [number, string, number][] = [[0.05, "sfx/impact.wav", 0.4], [wt("volver") - 0.2, "sfx/whoosh.wav", 0.3], [wt("toma") - 0.05, "sfx/impact.wav", 0.35], [90.9, "sfx/impact.wav", 0.4]];

// subtítulos de cine: bloques de 1–3 palabras; la palabra que se dice se enciende en dorado, las que vienen esperan tenues.
type G = { w: [string, number, number, string][]; s: number; e: number; d: boolean };
const GROUPS: G[] = (() => {
  const out: G[] = [];
  let cur: G | null = null;
  T.words.forEach((w, i) => {
    const prev = T.words[i - 1];
    const brk = !cur || cur.w.length >= 3 || prev[3] !== w[3] || w[1] - prev[2] > 0.35 || /[.,;:?!]$/.test(prev[0]);
    if (brk) { cur = { w: [], s: w[1], e: w[2], d: w[3] === "D" }; out.push(cur); }
    cur!.w.push(w); cur!.e = w[2];
  });
  out.forEach((g, i) => { const nx = out[i + 1]; g.e = Math.min(nx ? nx.s : g.e + 0.5, g.e + 0.45); });
  return out;
})();
const clean = (x: string) => x.replace(/[.,;:]+$/g, "").toUpperCase();
const Subs: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const g = GROUPS.find((x) => t >= x.s - 0.04 && t < x.e);
  if (!g) return null;
  const inP = ip(t - (g.s - 0.04), [0, 0.16], [0, 1]);
  const outP = ip(g.e - t, [0, 0.08], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1150, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0 18px", opacity: inP * outP, transform: `translateY(${(1 - inP) * 34}px)`, filter: inP < 1 ? `blur(${(1 - inP) * 6}px)` : undefined }}>
      {g.d ? <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 64, color: "#FFE08A", opacity: 0.8 }}>«</span> : null}
      {g.w.map((w, i) => {
        const on = t >= w[1] - 0.03 && t < (g.w[i + 1]?.[1] ?? g.e);
        const past = t >= (g.w[i + 1]?.[1] ?? g.e);
        const fut = t < w[1] - 0.03;
        const pop = on ? ip(t - w[1], [0, 0.08, 0.2], [1.22, 1.1, 1.08]) : 1;
        const col = on ? GOLD : g.d ? "#FFF3D1" : "#FFFFFF";
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: BODY, fontWeight: 700, fontStyle: g.d ? "italic" : "normal", fontSize: g.d ? 60 : 66, letterSpacing: 1, color: col, opacity: fut ? 0.32 : past ? 0.92 : 1, transform: `scale(${pop})`, transformOrigin: "50% 70%", textShadow: on ? `0 0 26px rgba(245,181,28,0.55), 0 4px 10px rgba(0,0,0,0.95)` : "0 4px 10px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)" }}>{clean(w[0])}</span>
        );
      })}
      {g.d ? <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 64, color: "#FFE08A", opacity: 0.8 }}>»</span> : null}
      {g.d ? <div style={{ flexBasis: "100%", height: 0 }} /> : null}
      {g.d ? <div style={{ height: 5, width: `${ip(t, [g.s, g.e], [10, 46])}%`, background: `linear-gradient(90deg, rgba(245,181,28,0), ${GOLD}, rgba(245,181,28,0))`, marginTop: 10, borderRadius: 3 }} /> : null}
    </div>
  );
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
  const VOL = wt("volver");
  const rewind = ip(t, [VOL - 0.15, VOL + 0.05, VOL + 0.35], [0, 1, 0]);
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
      {card ? <Card t={f < 3 ? 99 : t} lines={card.lines} /> : <Subs t={t} f={f} />}
      <Audio src={staticFile("sl-fuerte/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
