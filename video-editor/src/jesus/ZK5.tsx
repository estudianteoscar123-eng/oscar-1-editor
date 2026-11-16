import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import d1 from "../../public/serpiente/words.json";
import d2 from "../../public/gehena/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Defs, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Robe } from "../adultera/Dark";

// ZK Dark v4 · dinamismo de CONTENIDO: una escena nueva cada ~1,2 s, personajes y objetos que se mueven
// (caminan, caen, se encogen, señalan, arden), transición distinta en cada cambio (atravesar con zoom, barrido, iris, rebobinado).
// La cámara solo empuja suave; nada de reencuadres mecánicos.
export const TH = 0.1;
export const RED = "#D30F17", W = "#F2F2F2", INK = "#050505", GOLD = "#E8C66A";
export const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => interpolate(v, [a, b], [o0, o1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export type Raw = { chunks: { text: string; timestamp: [number, number] }[] };
export const words = (d: Raw, fix: Record<string, string>): Word[] => d.chunks.map((c, i) => { const w = c.text.trim(); return { w: fix[`${i}`] ?? fix[w] ?? w, s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }; });
export const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
export const finder = (ws: Word[]) => (w: string, n = 0) => ws.filter((x) => clean(x.w) === w)[n]?.s ?? 0;
export const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number; c?: string }> = ({ x, y, r, o = 1, c = "242,242,242" }) => <circle cx={x} cy={y} r={r} fill={`rgba(${c},${0.18 * o})`} style={{ filter: "blur(40px)" }} />;
export const Tag: React.FC<{ t: number; a: number; b: number; txt: string; y?: number }> = ({ t, a, b, txt, y = 1700 }) => <Serif txt={txt} y={y} size={58} ls={8} o={ip(t, a, a + 0.15) * ip(t, b - 0.15, b, 1, 0)} />;

// escena con transición de entrada (0 zoom a través, 1 barrido izq, 2 barrido der, 3 iris, 4 caída desde arriba) y empuje suave
export const Scene: React.FC<{ t: number; a: number; b: number; tr?: number; push?: number; children: React.ReactNode }> = ({ t, a, b, tr = 0, push = 0.08, children }) => {
  if (t < a - 0.01 || t >= b) return null;
  const k = ip(t, a, a + 0.22);
  const e = 1 - Math.pow(1 - k, 3);
  const pz = 1 + ip(t, a, b) * push;
  let tf = "";
  if (tr === 0) tf = `translate(540 960) scale(${(2.2 - 1.2 * e) * pz}) translate(-540 -960)`;
  if (tr === 1) tf = `translate(${(1 - e) * -1080} 0) translate(540 960) scale(${pz}) translate(-540 -960)`;
  if (tr === 2) tf = `translate(${(1 - e) * 1080} 0) translate(540 960) scale(${pz}) translate(-540 -960)`;
  if (tr === 3) tf = `translate(540 960) scale(${pz}) translate(-540 -960)`;
  if (tr === 4) tf = `translate(0 ${(1 - e) * -1920}) translate(540 960) scale(${pz}) translate(-540 -960)`;
  const id = `iris${Math.round(a * 100)}`;
  return (
    <g>
      {tr === 3 ? <defs><clipPath id={id}><circle cx={540} cy={960} r={60 + e * 1200} /></clipPath></defs> : null}
      <g clipPath={tr === 3 ? `url(#${id})` : undefined} transform={tf}>{children}</g>
    </g>
  );
};
export const Flames: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number; o?: number }> = ({ t, x, y, w, h, n = 9, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const fx = x - w / 2 + (i + 0.5) * (w / n);
      const fh = h * (0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i * 1.7)));
      return <g key={i}><path d={`M${fx - w / n / 1.6} ${y} Q${fx - w / n / 3} ${y - fh * 0.6} ${fx + Math.sin(t * 9 + i) * 14} ${y - fh} Q${fx + w / n / 3} ${y - fh * 0.5} ${fx + w / n / 1.6} ${y} Z`} fill="#FF5A14" opacity={0.9} /><path d={`M${fx - w / n / 3.5} ${y} Q${fx} ${y - fh * 0.5} ${fx + Math.sin(t * 11 + i) * 8} ${y - fh * 0.62} Q${fx + w / n / 5} ${y - fh * 0.3} ${fx + w / n / 3.5} ${y} Z`} fill="#FFD27A" /></g>;
    })}
  </g>
);
export const Sparks: React.FC<{ t: number; n?: number; c?: string }> = ({ t, n = 22, c = "#FF8A3A" }) => (
  <g>{Array.from({ length: n }, (_, i) => { const sp = 0.25 + random(`s${i}`) * 0.5; const p = (t * sp + random(`p${i}`)) % 1; const x = 80 + random(`x${i}`) * 920 + Math.sin(t * 2 + i) * 30; return <circle key={i} cx={x} cy={1900 - p * 1900} r={2 + random(`r${i}`) * 4} fill={c} opacity={Math.sin(p * Math.PI)} />; })}</g>
);
export const Shell: React.FC<{ f: number; t: number; cover: [string, string]; ws: Word[]; keys: Set<string>; audio: string; hits: number[]; tint: string; children: React.ReactNode }> = ({ f, t, cover, ws, keys, audio, hits, tint, children }) => {
  const last = hits.filter((h) => h <= t).pop() ?? -9;
  const sh = f < 3 ? 0 : Math.exp(-(t - last) * 10);
  const jx = (random(`jx${f}`) - 0.5) * 16 * sh, jy = (random(`jy${f}`) - 0.5) * 16 * sh;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Defs />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><g transform={`translate(${jx} ${jy})`}>{children}</g></svg>
      {f >= 3 ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 45%, ${tint} 100%)` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: sh * 0.22 }} />
      {f < 3 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><Serif txt={cover[0]} y={1460} size={100} ls={4} /><Serif txt={cover[1]} y={1610} size={160} ls={6} color={RED} /></svg>
      ) : <Captions f={f} groups={groupWords(ws)} keys={keys} hl={RED} />}
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

// ---------- personajes / objetos animados ----------
const Serpent: React.FC<{ t: number; x: number; y: number; s?: number; legs: number[]; up: number; walk?: number; flip?: boolean; dark?: boolean }> = ({ t, x, y, s = 1, legs, up, walk = 0, flip, dark }) => {
  const sw = Math.sin(t * 3) * 10;
  const neckY = -360 * up;
  const body = `M-260 ${40 + Math.sin(t * 5) * 10 * (1 - up)} Q-140 ${-20 - 40 * up + Math.sin(t * 5 + 1) * 14 * (1 - up)} -40 ${-30 * up} Q60 ${-60 * up} 80 ${neckY * 0.5} Q100 ${neckY * 0.85} ${40 + sw} ${neckY}`;
  const col = dark ? "#000" : "#1A3A22";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Ink>
        <path d={body} fill="none" stroke={col} strokeWidth={70} strokeLinecap="round" />
        {!dark ? <path d={body} fill="none" stroke={W} strokeWidth={6} strokeDasharray="30 22" opacity={0.6} /> : null}
        <ellipse cx={60 + sw} cy={neckY - 30} rx={78} ry={52} fill={col} stroke={dark ? "none" : W} strokeWidth={6} />
      </Ink>
      {[-20, 36].map((ex, i) => <ellipse key={i} cx={60 + sw + ex} cy={neckY - 44} rx={12} ry={7 * (Math.sin(t * 1.3 + 1) > 0.97 ? 0.15 : 1)} fill="#E8FF4A" />)}
      <path d={`M${120 + sw} ${neckY - 20} l40 ${8 + Math.sin(t * 14) * 6} l-14 4 l14 6`} stroke={RED} strokeWidth={5} fill="none" opacity={Math.sin(t * 4) > 0 ? 1 : 0} />
      {[[-150, 0], [-60, -20], [20, -50], [70, -140]].map(([lx, ly], i) => (
        <path key={i} d={`M${lx} ${ly * up} l${-20 + Math.sin(t * (walk ? 12 : 6) + i * 1.6) * (walk ? 34 : 10)} 110 l-30 10`} stroke={dark ? "#000" : W} strokeWidth={14} fill="none" strokeLinecap="round" opacity={legs[i] ?? 1} transform={`translate(0 ${(1 - (legs[i] ?? 1)) * 160})`} />
      ))}
    </g>
  );
};
const Tree: React.FC<{ t: number; x: number; y: number; s?: number; fruit?: number }> = ({ t, x, y, s = 1, fruit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t * 1.4) * 1.5})`}><Ink>
    <path d="M-40 0 Q-30 -260 -10 -420 L10 -420 Q30 -260 40 0 Z" fill="#0B0807" stroke={W} strokeWidth={6} />
    {[[-160, -480, 170], [130, -500, 160], [0, -620, 190]].map(([cx, cy, r], i) => <circle key={i} cx={cx + Math.sin(t * 1.6 + i) * 6} cy={cy} r={r} fill="#0B0807" stroke={W} strokeWidth={6} />)}
    {[[-120, -470], [90, -520], [20, -600], [-40, -520]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy + Math.sin(t * 2 + i) * 5} r={22} fill={RED} opacity={i === 1 ? fruit : 1} />)}
  </Ink></g>
);
const Leaves: React.FC<{ t: number; part: number }> = ({ t, part }) => (
  <g>{Array.from({ length: 10 }, (_, i) => { const side = i % 2 ? 1 : -1; const off = part * 520 * side; return <ellipse key={i} cx={540 + side * (60 + (i >> 1) * 70) + off} cy={500 + (i >> 1) * 230 + Math.sin(t * 2 + i) * 10} rx={230} ry={90} transform={`rotate(${side * (30 + i * 4)} ${540 + side * (60 + (i >> 1) * 70) + off} ${500 + (i >> 1) * 230})`} fill="#0F2A15" stroke={W} strokeWidth={5} filter="url(#ink)" />; })}</g>
);
const Book: React.FC<{ t: number; open: number; hl: number }> = ({ t, open, hl }) => (
  <g>
    <Ink>
      <path d={`M540 1260 L${540 - 370 * open} 1180 L${540 - 370 * open} 700 L540 780 Z`} fill="#0B0807" stroke={W} strokeWidth={8} />
      <path d="M540 1260 L910 1180 L910 700 L540 780 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
    </Ink>
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M600 ${840 + i * 52} L860 ${800 + i * 52}`} stroke={i === 3 ? RED : W} strokeWidth={i === 3 ? 12 : 5} opacity={i === 3 ? hl : 0.45 * open} />)}
    <g transform={`translate(${620 + ip(hl, 0, 1, 0, 200)} ${1000 + Math.sin(t * 3) * 10})`}><circle r={70} fill="rgba(255,255,255,0.08)" stroke={GOLD} strokeWidth={10} /><path d="M50 50 L120 120" stroke={GOLD} strokeWidth={18} strokeLinecap="round" /></g>
  </g>
);
export const Animal: React.FC<{ kind: "lion" | "sheep" | "bird"; x: number; y: number; t: number; s?: number }> = ({ kind, x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y + (kind === "bird" ? Math.sin(t * 6) * 12 : Math.abs(Math.sin(t * 8)) * -8)}) scale(${s})`}><Ink>
    {kind === "lion" ? <><ellipse cx={0} cy={0} rx={110} ry={60} fill="#0B0807" stroke={W} strokeWidth={5} /><circle cx={100} cy={-40} r={60} fill="#0B0807" stroke={GOLD} strokeWidth={9} />{[-70, -20, 30, 70].map((lx) => <path key={lx} d={`M${lx} 50 l0 60`} stroke={W} strokeWidth={10} />)}</> : null}
    {kind === "sheep" ? <><ellipse cx={0} cy={0} rx={90} ry={60} fill="#EDEDED" stroke={W} strokeWidth={5} /><ellipse cx={90} cy={-20} rx={30} ry={22} fill="#0B0807" stroke={W} strokeWidth={4} />{[-40, 40].map((lx) => <path key={lx} d={`M${lx} 50 l0 50`} stroke={W} strokeWidth={9} />)}</> : null}
    {kind === "bird" ? <path d={`M-60 0 Q-30 ${-30 + Math.sin(t * 12) * 20} 0 0 Q30 ${-30 + Math.sin(t * 12) * 20} 60 0`} stroke={W} strokeWidth={8} fill="none" /> : null}
  </Ink></g>
);
const Eve: React.FC<{ t: number; x: number; y: number; reach: number; s?: number }> = ({ t, x, y, reach, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Ink>
    <path d="M-60 0 Q-70 -200 -40 -300 L40 -300 Q70 -200 60 0 Z" fill="#0B0807" stroke={W} strokeWidth={6} />
    <circle cx={0} cy={-350} r={50} fill="#0B0807" stroke={W} strokeWidth={6} />
    <path d={`M-40 -360 Q-90 -260 -70 -140`} stroke={W} strokeWidth={10} fill="none" />
    <path d={`M-30 -260 Q${-90 - 60 * reach} ${-230 - 80 * reach} ${-110 - 120 * reach} ${-200 - 160 * reach}`} stroke={W} strokeWidth={14} fill="none" strokeLinecap="round" />
    {[-25, 25].map((lx, i) => <path key={lx} d={`M${lx} 0 l${Math.sin(t * 7 + i * 3) * 18} 80`} stroke={W} strokeWidth={14} strokeLinecap="round" />)}
  </Ink></g>
);
export const Beam: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g opacity={o}>
    <path d="M540 0 L360 1150 L720 1150 Z" fill="rgba(255,244,214,0.18)" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M540 0 L${300 + i * 96} 1150`} stroke="rgba(255,244,214,0.18)" strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(t * 5 + i)} />)}
    {[-1, 1].map((sd) => <ellipse key={sd} cx={540 + sd * (120 + o * 300)} cy={180} rx={260} ry={90} fill="#1B1B1B" stroke={W} strokeWidth={5} filter="url(#ink)" />)}
  </g>
);

// ===================== La serpiente del Edén =====================
const W1 = words(d1 as unknown as Raw, { "2": "del", "Ledén": "Edén", "lee": "Lee", "génesis": "Génesis" });
const a1 = finder(W1);
export const SERPIENTE_TOTAL = S(22.15);
const K1 = new Set(["serpiente", "edén", "arrastraba", "génesis", "castiga", "pecho", "polvo", "castigo", "antes", "astuto", "hablaba", "eva", "asustó", "realmente", "maldición"]);
export const Serpiente: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 1.6 : f / FPS;
  const A = a1;
  const hits = [A("arrastraba"), A("castiga"), A("pecho"), A("polvo"), A("castigo"), A("hablaba"), A("maldición")];
  const L = (i: number) => ip(t, A("andarás") - 0.3 + i * 0.12, A("andarás") + i * 0.12, 1, 0);
  return (
    <Shell f={f} t={t} cover={["¿TENÍA", "PATAS?"]} ws={W1} keys={K1} audio="serpiente/mezcla.wav" hits={hits} tint="rgba(0,20,6,0.75)">
      <Glow x={540} y={900} r={620} o={1.2} c="120,200,120" />
      <Sparks t={t} c="#B8FF7A" n={18} />
      {/* 1 · cabeza entre las hojas */}
      <Scene t={t} a={0} b={A("no")} tr={3} push={0.2}>
        <g transform={`translate(540 ${1450 - ip(t, 0, 0.9, 0, 260)}) scale(2.2) translate(-600 -1350)`}><Serpent t={t} x={600} y={1350} legs={[1, 1, 1, 1]} up={1} /></g>
        <Leaves t={t} part={ip(t, 0.05, 0.6)} />
      </Scene>
      {/* 2 · camina erguida */}
      <Scene t={t} a={A("no")} b={A("lee")} tr={1}>
        <Tree t={t} x={200} y={1450} s={0.8} />
        <Serpent t={t} x={ip(t, A("no"), A("lee"), 380, 760)} y={1380} s={0.9} legs={[1, 1, 1, 1]} up={1} walk={1} />
        <Animal kind="bird" x={ip(t, A("no"), A("lee"), 900, 300)} y={420} t={t} />
      </Scene>
      {/* 3 · Génesis se abre, la lupa encuentra la línea */}
      <Scene t={t} a={A("lee")} b={A("dios")} tr={0}>
        <Glow x={540} y={900} r={460} o={2} c="255,236,190" />
        <Book t={t} open={ip(t, A("lee"), A("lee") + 0.4)} hl={ip(t, A("atención") - 0.3, A("atención") + 0.4)} />
        <Tag t={t} a={A("lee")} b={A("dios")} txt="GÉNESIS 3:14" y={1450} />
      </Scene>
      {/* 4 · el cielo se abre */}
      <Scene t={t} a={A("dios")} b={A("sobre")} tr={4}>
        <Beam t={t} o={ip(t, A("dios"), A("castiga") + 0.3)} />
        <Serpent t={t} x={560} y={1400} s={0.9} legs={[1, 1, 1, 1]} up={1} />
      </Scene>
      {/* 5 · pierde las patas una por una */}
      <Scene t={t} a={A("sobre")} b={A("y")} tr={3}>
        <Beam t={t} o={0.7} />
        <Serpent t={t} x={560} y={1400} s={1} legs={[L(0), L(1), L(2), L(3)]} up={ip(t, A("andarás") + 0.1, A("andarás") + 0.5, 1, 0.15)} />
      </Scene>
      {/* 6 · se arrastra en el polvo */}
      <Scene t={t} a={A("y")} b={A("si")} tr={2} push={0.18}>
        <Serpent t={t} x={ip(t, A("y"), A("si"), 760, 420)} y={1450} s={1.2} legs={[0, 0, 0, 0]} up={0} />
        {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={200 + random(`d${i}`) * 700} cy={1500 - ((t * 140 + random(`q${i}`) * 260) % 300)} r={8 + random(`w${i}`) * 16} fill="#8A7A60" opacity={0.5 * ip(t, A("polvo") - 0.2, A("polvo") + 0.2)} />)}
      </Scene>
      {/* 7 · antes / después */}
      <Scene t={t} a={A("si")} b={A("antes")} tr={0}>
        <path d={`M540 ${1500 - ip(t, A("si"), A("si") + 0.4) * 1200} L540 1500`} stroke={RED} strokeWidth={6} />
        <Serpent t={t} x={300} y={1150} s={0.55} legs={[1, 1, 1, 1]} up={1} walk={1} />
        <Serpent t={t} x={790} y={1150} s={0.55} legs={[0, 0, 0, 0]} up={0} />
        <g transform={`translate(${430 + Math.sin(t * 6) * 10} 900)`}><path d="M0 0 L120 0 M90 -30 L120 0 L90 30" stroke={GOLD} strokeWidth={10} fill="none" /></g>
      </Scene>
      {/* 8 · rebobinado: vuelve a levantarse */}
      <Scene t={t} a={A("antes")} b={A("era")} tr={3}>
        <g filter="url(#ink)">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${random(`l${i}${Math.floor(t * 12)}`) * 1080} 0 l0 1920`} stroke={W} strokeWidth={2} opacity={0.25} />)}</g>
        <Serpent t={t} x={560} y={1400} s={1} legs={[1, 1, 1, 1].map((v, i) => ip(t, A("antes") + i * 0.1, A("antes") + 0.4 + i * 0.1))} up={ip(t, A("antes"), A("antes") + 0.6, 0.1, 1)} />
        <g transform="translate(540 520)" opacity={Math.sin(t * 10) > 0 ? 1 : 0.3}><path d="M40 -50 L-30 0 L40 50 Z M110 -50 L40 0 L110 50 Z" fill={W} transform="translate(-40 0)" /></g>
      </Scene>
      {/* 9 · el más astuto entre los animales */}
      <Scene t={t} a={A("era")} b={A("hablaba")} tr={1}>
        <Animal kind="lion" x={ip(t, A("era"), A("hablaba"), 1200, 760)} y={1400} t={t} s={0.9} />
        <Animal kind="sheep" x={ip(t, A("era"), A("hablaba"), -150, 260)} y={1430} t={t} s={0.9} />
        <Serpent t={t} x={540} y={1380} s={ip(t, A("astuto") - 0.2, A("astuto") + 0.4, 0.75, 1.05)} legs={[1, 1, 1, 1]} up={1} />
        <Tag t={t} a={A("era")} b={A("hablaba") + 1.2} txt="GÉNESIS 3:1" />
      </Scene>
      {/* 10 · habla */}
      <Scene t={t} a={A("hablaba")} b={A("eva")} tr={0} push={0.15}>
        <Serpent t={t} x={480} y={1500} s={1.15} legs={[1, 1, 1, 1]} up={1} />
        {[0, 1, 2].map((i) => { const r = ((t * 260 + i * 110) % 330) + 40; return <circle key={i} cx={760} cy={980} r={r} fill="none" stroke={GOLD} strokeWidth={6} opacity={1 - r / 370} />; })}
        <g opacity={ip(t, A("hablaba"), A("hablaba") + 0.15)}><Ink><path d="M700 820 Q700 720 820 720 Q940 720 940 800 Q940 880 820 880 L760 880 L720 930 L735 875 Q700 860 700 820 Z" fill={W} /></Ink>{[780, 820, 860].map((cx, i) => <circle key={cx} cx={cx} cy={800 + Math.sin(t * 10 + i) * 6} r={10} fill={INK} />)}</g>
      </Scene>
      {/* 11 · Eva se acerca sin miedo y estira la mano al fruto */}
      <Scene t={t} a={A("eva")} b={A("entonces")} tr={2}>
        <Tree t={t} x={420} y={1500} s={0.9} fruit={ip(t, A("verla"), A("verla") + 0.3, 1, 0)} />
        <Serpent t={t} x={330} y={1060} s={0.45} legs={[1, 1, 1, 1]} up={1} flip />
        <Eve t={t} x={ip(t, A("eva"), A("asustó") + 0.3, 1000, 700)} y={1520} reach={ip(t, A("al"), A("verla") + 0.3)} s={0.9} />
      </Scene>
      {/* 12 · ¿cómo era realmente? — siluetas posibles */}
      <Scene t={t} a={A("entonces")} b={A("antes", 1)} tr={3}>
        <Glow x={540} y={950} r={520} o={1.6} c="211,15,23" />
        {[0, 1, 2].map((k) => <g key={k} opacity={Math.floor((t - A("entonces")) / 0.45) % 3 === k ? 1 : 0}>
          {k === 0 ? <Serpent t={t} x={560} y={1400} s={1.1} legs={[1, 1, 1, 1]} up={1} dark /> : null}
          {k === 1 ? <g><Serpent t={t} x={560} y={1400} s={1.1} legs={[1, 1, 1, 1]} up={1} dark />{[-1, 1].map((sd) => <path key={sd} d={`M${600 + sd * 40} 1000 Q${600 + sd * 360} ${760 + Math.sin(t * 6) * 40} ${600 + sd * 300} 1180 Z`} fill="#000" stroke={RED} strokeWidth={5} />)}</g> : null}
          {k === 2 ? <Serpent t={t} x={560} y={1450} s={1.4} legs={[0, 0, 0, 0]} up={0.6} dark /> : null}
        </g>)}
        <Serif txt="?" y={700} size={300} color={RED} o={0.8 + 0.2 * Math.sin(t * 6)} />
      </Scene>
      {/* 13 · antes de la maldición: se gira hacia ti (empalma con el inicio) */}
      <Scene t={t} a={A("antes", 1)} b={99} tr={0} push={0.25}>
        <Glow x={540} y={900} r={520} o={2} c="120,200,120" />
        <Serpent t={t} x={560} y={1450} s={1.25} legs={[1, 1, 1, 1]} up={1} flip={t > A("maldición")} />
        <Leaves t={t} part={ip(t, A("maldición"), A("maldición") + 0.5, 1, 0.2)} />
      </Scene>
    </Shell>
  );
};

// ===================== Gehena =====================
const W2 = words(d2 as unknown as Raw, { "gejena,": "Gehena,", "gejena": "Gehena", "41": "dios" });
const a2 = finder(W2);
export const GEHENA_TOTAL = S(22.4);
const K2 = new Set(["jesús", "infierno", "imaginario", "palabra", "gehena", "existía", "valle", "jerusalén", "reyes", "judá", "hijos", "fuego", "maldito", "mente", "advertirte"]);
export const Jesus: React.FC<{ t: number; x: number; y: number; s?: number; arm?: number; eyes?: number }> = ({ t, x, y, s = 1, arm = 0, eyes = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink>
      <path d={`M-150 0 Q-140 -300 -90 -420 L90 -420 Q140 -300 ${150 + Math.sin(t * 3) * 12} 0 Z`} fill="#F2F2F2" stroke={W} strokeWidth={6} />
      <path d="M-40 -420 Q-80 -300 -60 -150" stroke="#B5121B" strokeWidth={26} fill="none" />
      <circle cx={0} cy={-500} r={70} fill="#0B0807" stroke={W} strokeWidth={6} />
      <path d="M-70 -520 Q-90 -420 -60 -380 M70 -520 Q90 -420 60 -380" stroke="#0B0807" strokeWidth={30} fill="none" />
      <path d={`M80 -380 Q${160 + 60 * arm} ${-380 - 120 * arm} ${180 + 120 * arm} ${-300 - 260 * arm}`} stroke="#F2F2F2" strokeWidth={34} fill="none" strokeLinecap="round" />
    </Ink>
    {[-25, 25].map((ex) => <ellipse key={ex} cx={ex} cy={-505} rx={12} ry={7} fill={W} opacity={eyes} />)}
  </g>
);
const King: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y + Math.abs(Math.sin(t * 6)) * -6}) scale(${s})`}><Ink>
    <path d={`M-130 0 Q-150 -260 -70 -360 L70 -360 Q150 -260 ${130 + Math.sin(t * 3) * 20} 0 Z`} fill="#3A0A0A" stroke={W} strokeWidth={6} />
    <circle cx={0} cy={-420} r={60} fill="#0B0807" stroke={W} strokeWidth={6} />
    <path d="M-55 -470 L-55 -520 L-25 -490 L0 -530 L25 -490 L55 -520 L55 -470 Z" fill={GOLD} stroke={W} strokeWidth={4} />
    {[-30, 30].map((lx, i) => <path key={lx} d={`M${lx} 0 l${Math.sin(t * 6 + i * 3) * 16} 70`} stroke={W} strokeWidth={14} strokeLinecap="round" />)}
  </Ink></g>
);
const Idol: React.FC<{ t: number; o: number; belly: number }> = ({ t, o, belly }) => (
  <g opacity={o} transform="translate(540 1080)">
    <Ink>
      <path d="M-170 380 L-150 -80 Q-150 -220 0 -230 Q150 -220 150 -80 L170 380 Z" fill="#120404" stroke={W} strokeWidth={7} />
      <path d="M-110 -200 Q-230 -330 -200 -420 Q-150 -300 -60 -230 Z M110 -200 Q230 -330 200 -420 Q150 -300 60 -230 Z" fill="#120404" stroke={W} strokeWidth={7} />
      <path d={`M-150 60 L${-300} ${-20 + Math.sin(t * 2) * 10} M150 60 L300 ${-20 + Math.sin(t * 2) * 10}`} stroke={W} strokeWidth={24} strokeLinecap="round" />
    </Ink>
    <Flames t={t} x={0} y={260} w={220} h={200 * belly} n={5} />
    {[-50, 50].map((ex) => <ellipse key={ex} cx={ex} cy={-130} rx={22} ry={12} fill="#FF5A14" opacity={0.6 + 0.4 * Math.sin(t * 8)} />)}
  </g>
);
const Valley: React.FC<{ t: number; dark?: boolean }> = ({ t, dark }) => (
  <g>
    <Ink><path d="M60 760 L60 600 L120 600 L120 560 L180 560 L180 600 L320 600 L320 500 L400 460 L480 500 L480 600 L700 600 L700 540 L760 540 L760 600 L1020 600 L1020 760 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
    <Ink><path d="M0 820 Q300 1500 540 1560 Q780 1500 1080 820 L1080 1920 L0 1920 Z" fill={dark ? "#070202" : "#0B0807"} stroke={W} strokeWidth={6} /></Ink>
    <Flames t={t} x={540} y={1560} w={420} h={180} n={7} />
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={420 + i * 50 + Math.sin(t + i) * 30} cy={1400 - ((t * 90 + i * 70) % 500)} r={60 + i * 8} fill="rgba(120,120,120,0.15)" style={{ filter: "blur(12px)" }} />)}
    {[0, 1, 2].map((i) => <Animal key={i} kind="bird" x={540 + Math.cos(t * 0.9 + i * 2) * 260} y={1050 + Math.sin(t * 0.9 + i * 2) * 90} t={t + i} s={0.6} />)}
  </g>
);
export const Gehena: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 12.6 : f / FPS;
  const A = a2;
  const hits = [A("infierno"), A("gehena", 1), A("existía"), A("reyes"), A("quemaron"), A("maldito"), A("advertirte")];
  return (
    <Shell f={f} t={t} cover={["EL INFIERNO", "EXISTE"]} ws={W2} keys={K2} audio="gehena/mezcla.wav" hits={hits} tint="rgba(30,4,0,0.8)">
      <Sparks t={t} />
      {/* 1 · Jesús enseña ante la gente */}
      <Scene t={t} a={0} b={A("del")} tr={3}>
        <Glow x={540} y={700} r={500} o={1.6} c="255,236,190" />
        <Ink><path d="M0 1500 Q540 1300 1080 1500 L1080 1920 L0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
        <Jesus t={t} x={540} y={1430} s={0.9} arm={0.4 + 0.3 * Math.sin(t * 3)} />
        {[160, 290, 790, 920].map((x, i) => <Robe key={x} x={x} y={1700} s={0.55} hood={i % 2 === 0} />)}
      </Scene>
      {/* 2 · estalla el fuego, la gente retrocede */}
      <Scene t={t} a={A("del")} b={A("no")} tr={0}>
        <Glow x={540} y={1300} r={600} o={2.6} c="255,90,20" />
        <Flames t={t} x={540} y={1920} w={1100} h={ip(t, A("infierno") - 0.1, A("infierno") + 0.3, 60, 620)} n={12} />
        {[200, 360, 720, 880].map((x, i) => <Robe key={x} x={x + (x < 540 ? -1 : 1) * ip(t, A("infierno"), A("infierno") + 0.6, 0, 120)} y={1500} s={0.7} hood={i % 2 === 1} />)}
      </Scene>
      {/* 3 · no es un lugar imaginario: el infierno de fantasía se tacha */}
      <Scene t={t} a={A("no")} b={A("usó")} tr={2}>
        <g transform={`translate(540 900) rotate(${Math.sin(t * 2) * 3})`}>
          <Ink><path d="M-300 -200 Q-200 -320 -60 -260 Q40 -360 180 -260 Q320 -300 300 -140 Q360 40 200 80 Q100 180 -60 120 Q-240 180 -300 40 Q-380 -80 -300 -200 Z" fill="#1A1A1A" stroke={W} strokeWidth={6} /></Ink>
          {[-120, 0, 120].map((x, i) => <path key={i} d={`M${x - 30} -40 L${x} -120 L${x + 30} -40`} fill="#5A1A1A" stroke={W} strokeWidth={4} />)}
        </g>
        <path d="M200 620 L880 1180 M880 620 L200 1180" stroke={RED} strokeWidth={50} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - ip(t, A("imaginario") - 0.2, A("imaginario") + 0.2))} />
      </Scene>
      {/* 4 · una palabra: se escribe sola */}
      <Scene t={t} a={A("usó")} b={A("y")} tr={4}>
        <Glow x={540} y={900} r={480} o={2} c="255,90,20" />
        <Ink><rect x={180} y={720} width={720} height={420} rx={20} fill="#1A120A" stroke={GOLD} strokeWidth={10} /></Ink>
        <g style={{ clipPath: `inset(0 ${100 - ip(t, A("gehena") - 0.2, A("gehena") + 0.5) * 100}% 0 0)` }}><Serif txt="גֵּיא הִנֹּם" y={990} size={140} color={GOLD} /></g>
        <Flames t={t} x={540} y={1140} w={720} h={ip(t, A("gehena"), A("gehena") + 0.5, 0, 120)} n={10} />
        <Tag t={t} a={A("gehena")} b={A("y")} txt="MATEO 10:28" y={1450} />
      </Scene>
      {/* 5 · existía: el mapa y el alfiler */}
      <Scene t={t} a={A("y")} b={A("era")} tr={0}>
        <Ink><path d="M140 560 L940 520 L980 1360 L120 1400 Z" fill="#1E1A12" stroke={W} strokeWidth={6} /></Ink>
        <Ink><path d="M420 760 L620 740 L660 920 L440 940 Z" fill="none" stroke={W} strokeWidth={8} /></Ink>
        <Serif txt="JERUSALÉN" y={720} size={44} ls={4} />
        <path d="M380 1000 Q480 1120 640 1060" stroke={RED} strokeWidth={22} fill="none" opacity={0.8} />
        <g transform={`translate(470 ${ip(t, A("existía") - 0.2, A("existía") + 0.1, 600, 1060)})`}><path d="M0 0 L-30 -70 A35 35 0 1 1 30 -70 Z" fill={RED} stroke={W} strokeWidth={5} /></g>
      </Scene>
      {/* 6 · el valle real, humo y cuervos */}
      <Scene t={t} a={A("era")} b={A("donde")} tr={4} push={0.15}>
        <Valley t={t} />
      </Scene>
      {/* 7 · un rey avanza */}
      <Scene t={t} a={A("donde")} b={A("quemaron")} tr={1}>
        <Glow x={540} y={1100} r={520} o={1.6} c="255,60,10" />
        <King t={t} x={ip(t, A("donde"), A("quemaron"), 260, 600)} y={1480} s={1.1} />
        <Tag t={t} a={A("reyes")} b={A("quemaron") + 1.6} txt="2 REYES 16:3" />
      </Scene>
      {/* 8 · el ídolo con fuego en el vientre */}
      <Scene t={t} a={A("quemaron")} b={A("para")} tr={0}>
        <Glow x={540} y={1200} r={620} o={2.8} c="255,60,10" />
        <Idol t={t} o={1} belly={ip(t, A("quemaron"), A("fuego") + 0.2, 0.3, 1.6)} />
        <Flames t={t} x={540} y={1700} w={900} h={ip(t, A("hijos"), A("fuego"), 80, 360)} n={10} />
      </Scene>
      {/* 9 · dios falso: los ojos arden y se agrieta */}
      <Scene t={t} a={A("para")} b={A("un", 3)} tr={3} push={0.3}>
        <g transform="translate(540 960) scale(1.6) translate(-540 -960)"><Idol t={t} o={1} belly={1.4} /></g>
        {[[540, 700, 420, 1100], [540, 700, 700, 1200]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2 + 40} ${(y1 + y2) / 2} L${x2} ${y2}`} stroke={RED} strokeWidth={10} strokeDasharray={700} strokeDashoffset={700 * (1 - ip(t, A("falso") - 0.1, A("falso") + 0.3))} />)}
      </Scene>
      {/* 10 · lugar maldito: la tierra se raja */}
      <Scene t={t} a={A("un", 3)} b={A("que")} tr={2}>
        <Valley t={t} dark />
        {[[540, 1560, 380, 1100], [540, 1560, 760, 1000], [540, 1560, 300, 1450], [540, 1560, 860, 1400]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2} L${x2} ${y2}`} stroke={RED} strokeWidth={9} strokeDasharray={900} strokeDashoffset={900 * (1 - ip(t, A("maldito") - 0.1 + i * 0.1, A("maldito") + 0.4 + i * 0.1))} />)}
      </Scene>
      {/* 11 · "nunca pasó por su mente": el pergamino arde */}
      <Scene t={t} a={A("que")} b={A("y", 1)} tr={0}>
        <Glow x={540} y={900} r={500} o={2} c="255,236,190" />
        <Ink>
          <rect x={250} y={640} width={580} height={620} fill="#E8DCC0" stroke={W} strokeWidth={6} />
          <ellipse cx={540} cy={640} rx={310} ry={40} fill="#C9B890" stroke={W} strokeWidth={6} />
          <ellipse cx={540} cy={1260} rx={310} ry={40} fill="#C9B890" stroke={W} strokeWidth={6} />
        </Ink>
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M310 ${720 + i * 70} L${770 - (i % 3) * 60} ${720 + i * 70}`} stroke="#3A2A1A" strokeWidth={8} opacity={0.7} />)}
        <path d="M310 930 L760 930" stroke={RED} strokeWidth={14} strokeDasharray={460} strokeDashoffset={460 * (1 - ip(t, A("nunca") - 0.1, A("mente")))} />
        <Flames t={t} x={540} y={1300} w={640} h={ip(t, A("mente") - 0.3, A("mente") + 0.4, 0, 220)} n={8} />
        <Tag t={t} a={A("que")} b={A("y", 1)} txt="JEREMÍAS 7:31" y={1500} />
      </Scene>
      {/* 12 · Jesús eligió ese nombre */}
      <Scene t={t} a={A("y", 1)} b={A("para", 1)} tr={4}>
        <Glow x={540} y={800} r={520} o={2} c="255,236,190" />
        <Jesus t={t} x={540} y={1560} s={1.1} arm={0.2} />
      </Scene>
      {/* 13 · para advertirte: te mira y te señala */}
      <Scene t={t} a={A("para", 1)} b={99} tr={0} push={0.35}>
        <Flames t={t} x={540} y={1920} w={1200} h={520} n={14} />
        <Jesus t={t} x={540} y={1700} s={1.6} arm={ip(t, A("advertirte") - 0.2, A("advertirte") + 0.4)} eyes={ip(t, A("para", 1), A("para", 1) + 0.3)} />
      </Scene>
    </Shell>
  );
};
