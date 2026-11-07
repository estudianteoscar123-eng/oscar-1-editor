import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import tl from "../../public/sl-gohan/timeline.json";
import { Card, Filters, Line } from "../thorfinn/SubTest2";

// SL · "Sin talento" — Rock Lee (doblaje latino) + voz en off. Subtítulos con 5 combinaciones tipográficas rotando.
// Formato de la ref del Gato con Botas: diálogos originales intercalados con la lección. Gancho = la pregunta de Ippo en el segundo 0.
const FPS = 30;
const T = tl as unknown as { end: number; shots: { T: number; T1: number; src: string; lb: boolean }[]; words: [string, number, number, string][]; beats: number[] };
const END = T.end;
export const SLGOHAN_TOTAL = Math.round(END * FPS);
const S = (t: number) => Math.round(t * FPS);
const BODY = "SLGohanBody";
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });
const FT: [string, string, string, string?][] = [["LBebas", "bebas-neue-latin-400-normal", "400"], ["LMarker", "permanent-marker-latin-400-normal", "400"], ["LCinzel", "cinzel-latin-900-normal", "900"], ["LKaushan", "kaushan-script-latin-400-normal", "400"], ["LYellow", "yellowtail-latin-400-normal", "400"], ["LInstr", "instrument-serif-latin-400-italic", "400", "italic"], ["LOld", "old-standard-tt-latin-700-normal", "700"], ["LPop6", "poppins-latin-600-normal", "600"]];
FT.forEach(([fam, file, w, st]) => loadFont({ family: fam, url: staticFile(`fonts/${file}.woff2`), weight: w, style: st ?? "normal" }));
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const GOLD = "#A77BF0", RED = "#D42A3C", WHITE = "#F4F4F4";

const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñ0-9 ]/g, "");
const wt = (w: string, after = 0) => T.words.find((x) => norm(x[0]) === w && x[1] >= after)?.[1] ?? 0;
const wend = (w: string, after = 0) => T.words.find((x) => norm(x[0]) === w && x[1] >= after)?.[2] ?? 0;
const MOR = wt("moriré"), TIM = wt("de cobardía"), AMOR = wt("amor", TIM), PEL = wt("pelear", END - 12), QUIEN = wt("quién", END - 12);
const CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0, to: wend("completo") + 0.2, lines: [{ txt: "YO NO", at: 0, kind: "small" }, { txt: "MORIRÉ", at: 0, kind: "big", color: GOLD, italic: true }] },
  { from: wt("no", TIM - 3) - 0.1, to: wend("propio") + 0.3, lines: [{ txt: "2 TIMOTEO 1:7", at: wt("no", TIM - 3) - 0.1, kind: "small" }, { txt: "«NO NOS HA DADO", at: wt("no", TIM - 3), kind: "mid" }, { txt: "DIOS ESPÍRITU DE COBARDÍA,", at: TIM - 0.4, kind: "small" }, { txt: "SINO DE PODER, DE", at: wt("poder", TIM), kind: "small" }, { txt: "AMOR»", at: AMOR, kind: "big", color: GOLD }] },
  { from: QUIEN - 0.3, to: wend("pelear", QUIEN) + 0.4, lines: [{ txt: "POR QUIÉN", at: QUIEN - 0.3, kind: "small" }, { txt: "PELEAR", at: PEL, kind: "big", color: GOLD }] },
];
const HITS = [0.1, wt("sorprendente"), wt("investigador"), wt("palabras"), wt("saiyajin"), AMOR, PEL];
const PULSE = T.beats.filter((b) => b > wt("saiyajin") && b < END - 0.5);
const SFX: [number, string, number][] = [[0.05, "sfx/impact.wav", 0.4], [wt("saiyajin") - 0.05, "sfx/impact.wav", 0.35], [AMOR - 0.05, "sfx/whoosh.wav", 0.25], [PEL - 0.05, "sfx/impact.wav", 0.35]];

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
  for (let i = 0; i < out.length - 1; i++) {
    const g = out[i], nx = out[i + 1];
    if (nx.s - g.s < 0.5 && g.d === nx.d && g.w.length + nx.w.length <= 4) { g.w.push(...nx.w); g.e = nx.e; out.splice(i + 1, 1); i--; }
  }
  out.forEach((g, i) => { const nx = out[i + 1]; g.e = Math.min(nx ? nx.s : g.e + 0.5, Math.max(g.e + 0.4, g.s + 0.55)); });
  return out;
})();
const clean = (x: string) => x.replace(/[.,;:«»"]+$/g, "").replace(/^[«"]+/, "").toUpperCase();
const STOP = new Set(["el", "la", "los", "las", "de", "del", "que", "y", "a", "en", "un", "una", "no", "se", "te", "lo", "es", "por", "para", "con", "al", "tu", "mi", "me", "su", "sus", "más", "pero", "eso", "esa", "este", "esta", "ser", "o", "si", "ya", "le", "aunque", "yo", "digo", "mientras", "como", "porque", "hay", "algo", "solo", "también", "eh", "son", "cuando", "fue", "tan", "muy", "tú", "él", "ella", "cada", "otros", "así", "hoy", "sobre", "dice", "lo", "qué", "ni", "nos", "mis", "tus"]);
const PALETTE = ["#A77BF0", "#F1ECFA", "#C21C3A", "#7E52D8", "#E3D8F7", "#A77BF0"];
const KEYI = (g: G) => {
  let best = g.w.length - 1, sc = -1;
  g.w.forEach((w, i) => { const c = clean(w[0]).toLowerCase(); const v = (STOP.has(c) ? 0 : 100) + c.length + i * 0.5; if (v > sc) { sc = v; best = i; } });
  return best;
};
// 5 combinaciones tipográficas (línea pequeña + palabra clave grande), rotando sin repetirse seguidas
type P = { sf: string; ss?: string; sw: number; sz: number; bf: string; bw: number; bi?: boolean; grunge?: boolean; track: number; rot?: number; up: boolean };
const PRESETS: P[] = [
  { sf: "S2Kalam", sw: 700, sz: 58, bf: "S2Fat", bw: 900, grunge: true, track: 3, up: true },
  { sf: "LOld", sw: 700, sz: 50, bf: "LBebas", bw: 400, track: 10, up: true },
  { sf: "LPop6", sw: 600, sz: 44, bf: "LMarker", bw: 400, track: 2, rot: -3, up: true },
  { sf: "LYellow", sw: 400, sz: 64, bf: "LCinzel", bw: 900, track: 6, up: true },
  { sf: "LInstr", ss: "italic", sw: 400, sz: 60, bf: "LKaushan", bw: 400, track: 1, rot: -2, up: false },
];
const NARR = [0, 1, 3, 0, 3, 1, 0, 1];
const DIAL = [2, 4];
const PRE: number[] = (() => { let n = 0, d = 0, last = -1; return GROUPS.map((g) => { let p = g.d ? DIAL[d++ % 2] : NARR[n++ % NARR.length]; if (p === last) p = g.d ? DIAL[d++ % 2] : NARR[n++ % NARR.length]; last = p; return p; }); })();
const Subs: React.FC<{ t: number; f: number }> = ({ t }) => {
  const gi = GROUPS.findIndex((x) => t >= x.s - 0.04 && t < x.e);
  if (gi < 0) return null;
  const g = GROUPS[gi];
  const P = PRESETS[PRE[gi]];
  const k = KEYI(g);
  const key = g.w[k];
  const small = g.w.filter((_, i) => i !== k);
  const before = g.w.slice(0, k), after = g.w.slice(k + 1);
  const inP = ip(t - (g.s - 0.04), [0, 0.14], [0, 1]);
  const outP = ip(g.e - t, [0, 0.07], [0, 1]);
  const keyOn = t >= key[1] - 0.03;
  const pop = keyOn ? ip(t - key[1], [0, 0.09, 0.22], [1.28, 0.97, 1]) : 0.9;
  const col = g.d ? "#E2D4FF" : PALETTE[(gi * 7 + key[0].length) % PALETTE.length];
  const raw = clean(key[0]);
  const txt = P.up ? raw : raw.charAt(0) + raw.slice(1).toLowerCase();
  const wf = P.bf === "LBebas" ? 0.48 : P.bf === "LCinzel" ? 0.78 : P.bf === "LMarker" ? 0.66 : P.bf === "LKaushan" ? 0.6 : 0.7;
  const size = Math.min(P.bf === "LBebas" ? 210 : 176, 900 / Math.max(3, txt.length * wf));
  const fmt = (x: string) => (P.sf === "LYellow" || P.sf === "LInstr" ? x.charAt(0) + x.slice(1).toLowerCase() : x);
  const LINE = (ws: typeof g.w, top: boolean) => ws.length ? (
    <div style={{ fontFamily: P.sf, fontStyle: P.ss ?? "normal", fontWeight: P.sw, fontSize: P.sz, color: g.d ? "#E2D4FF" : "#F2F2F2", transform: P.sf === "S2Kalam" ? "skewX(-10deg)" : undefined, letterSpacing: P.sf === "LPop6" ? 6 : 2, lineHeight: 1.05, marginTop: top ? 0 : 6, textShadow: "0 3px 10px rgba(0,0,0,0.9)" }}>
      {g.d && top && ws.some((w) => t >= w[1] - 0.03) ? "«" : ""}
      {ws.map((w, i) => <span key={i} style={{ opacity: t >= w[1] - 0.03 ? 1 : 0, marginRight: 14 }}>{fmt(clean(w[0]))}</span>)}
      {g.d && !top && t >= ws[ws.length - 1][1] - 0.03 ? "»" : ""}
    </div>
  ) : null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1060, textAlign: "center", opacity: inP * outP, transform: `translateY(${(1 - inP) * 26}px) rotate(${P.rot ?? 0}deg)` }}>
      {LINE(before, true)}
      <div style={{ fontFamily: P.bf, fontStyle: P.bi ? "italic" : "normal", fontWeight: P.bw, fontSize: size, color: col, lineHeight: 0.95, letterSpacing: P.track, whiteSpace: "nowrap", opacity: keyOn ? 1 : 0, transform: `scale(${pop})`, filter: P.grunge ? "url(#s2grunge) drop-shadow(0 6px 14px rgba(0,0,0,0.85))" : "drop-shadow(0 6px 14px rgba(0,0,0,0.85))", WebkitTextStroke: P.bf === "LBebas" ? "1px rgba(0,0,0,0.25)" : undefined }}>
        {txt}{g.d && k === g.w.length - 1 ? "»" : ""}
      </div>
      {LINE(after, false)}
    </div>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "screen", pointerEvents: "none" }}>
    <filter id="SLGohang"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter="url(#SLGohang)" />
  </svg>
);

export const SLGohan: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const lastHit = HITS.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - lastHit) * 9);
  const lastBeat = PULSE.filter((b) => b <= t).pop() ?? -9;
  const beat = Math.exp(-(t - lastBeat) * 12);
  const cutT = T.shots.map((s) => s.T).filter((c) => c <= t).pop() ?? -9;
  const cutIn = Math.exp(-(t - cutT) * 16);
  const rewind = 0;
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
                <OffthreadVideo src={staticFile(`sl-gohan/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
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
      <Audio src={staticFile("sl-gohan/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
