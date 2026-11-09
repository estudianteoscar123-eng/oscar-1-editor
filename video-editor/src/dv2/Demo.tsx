import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/gedeon/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Defs, Paper } from "../judas/Dark";

// ZK Dark v2 · demo de 5 s: motion graphics por código con profundidad real (proyección 2.5D), luz de cine y cámara continua.
const END = 5.4;
export const DV2_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] })).filter((w) => w.s < 5.15);
const KEYS = new Set(["32000", "ejército", "imposible"]);
const RED = "#D30F17";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => o0 + (o1 - o0) * cl((v - a) / (b - a));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- cámara 2.5D ----------
type Cam = { x: number; y: number; z: number; fd: number; blur: number };
type K = [number, number, number, number, number]; // t, x, y, z, foco
const KEYF: { t: number; e: number; k: K }[] = [
  { t: 0, e: 0, k: [0, 0, -470, -700, 0] },
  { t: 0.95, e: 0.0, k: [0.95, 20, -440, -540, 0] },
  { t: 1.75, e: 0.8, k: [1.75, -150, -760, -2500, 1000] },
  { t: 2.62, e: 0.0, k: [2.62, 250, -700, -2200, 1000] },
  { t: 3.12, e: 0.5, k: [3.12, 9000, -520, -900, 600] },
  { t: 4.55, e: 0.0, k: [4.55, 9080, -430, 1500, 2300] },
  { t: 5.4, e: 0.85, k: [5.4, 9180, -300, 2200, 2700] },
];
const camAt = (t: number): Cam => {
  let i = 0;
  while (i + 1 < KEYF.length && KEYF[i + 1].t <= t) i++;
  const a = KEYF[i], b = KEYF[Math.min(i + 1, KEYF.length - 1)];
  if (a === b) return { x: a.k[1], y: a.k[2], z: a.k[3], fd: a.k[4], blur: 0 };
  const span = b.t - a.t;
  // tramos con e > 0 son movimientos rápidos (latigazo/retroceso); el resto, empuje lento lineal
  const u = cl((t - a.t) / span);
  const p = b.e > 0 ? eio(u) : u;
  const lerp = (j: number) => a.k[j] + (b.k[j] - a.k[j]) * p;
  const speed = b.e > 0 ? Math.sin(u * Math.PI) : 0;
  return { x: lerp(1), y: lerp(2), z: lerp(3), fd: lerp(4), blur: speed * (Math.abs(b.k[1] - a.k[1]) > 3000 ? 16 : 3) };
};
const F = 1100;
// una capa: un dibujo SVG anclado en (x, y) del mundo a la profundidad d
const L: React.FC<{ cam: Cam; d: number; x: number; y: number; children: React.ReactNode; noBlur?: boolean; o?: number }> = ({ cam, d, x, y, children, noBlur, o = 1 }) => {
  const dz = d - cam.z;
  if (dz < 40) return null;
  const k = F / dz;
  const sx = 540 + (x - cam.x) * k, sy = 960 + (y - cam.y) * k;
  if (sx < -6000 * k - 400 || sx > 1080 + 6000 * k + 400) return null;
  const b = noBlur ? 0 : Math.min(18, Math.abs(d - cam.fd) / 160 + cam.blur);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sx}px, ${sy}px) scale(${k})`, transformOrigin: "0 0", filter: b > 0.4 ? `blur(${b / Math.max(k, 0.25)}px)` : undefined, opacity: o, zIndex: Math.round(100000 - d) }}>
      <svg width={1} height={1} style={{ overflow: "visible", position: "absolute" }}>{children}</svg>
    </div>
  );
};

// ---------- dibujos de tinta ----------
const W = "#F2F2F2";
const Gideon: React.FC<{ t: number }> = ({ t }) => {
  const blink = (t % 2.6) > 2.48;
  const br = Math.sin(t * 2.2) * 4;
  const wind = Math.sin(t * 3.1) * 10;
  const look = ip(t, 2.4, 2.7, 0, 9);
  return (
    <g filter="url(#ink)">
      {/* manto que ondea */}
      <path d={`M-120 -380 Q-230 -180 -250 ${-10} L${-200 + wind} 0 L${230 + wind} 0 Q 250 -200 130 -380 Z`} fill="#070707" stroke={W} strokeWidth={6} />
      <path d={`M40 -370 Q 160 -200 ${210 + wind} 0 L${230 + wind} 0 Q 250 -200 130 -380 Z`} fill="url(#h1)" opacity={0.75} />
      {/* luz de contra roja */}
      <path d={`M-120 -380 Q-230 -180 -250 -10`} fill="none" stroke={RED} strokeWidth={9} opacity={0.9} />
      {/* cuerpo y cinto */}
      <path d={`M-110 -400 Q-150 -${210 + br} -170 -20 L170 -20 Q150 -${210 + br} 110 -400 Z`} fill="#050505" stroke={W} strokeWidth={6} />
      <path d="M-150 -170 L150 -170" stroke={RED} strokeWidth={14} />
      <path d="M60 -380 Q 120 -210 150 -30" fill="none" stroke="url(#h2)" strokeWidth={60} opacity={0.5} />
      {/* lanza */}
      <path d="M210 -720 L190 0" stroke={W} strokeWidth={7} />
      <path d="M210 -760 L196 -700 L224 -700 Z" fill={W} />
      <path d="M150 -330 Q190 -350 205 -330" stroke={W} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* cabeza */}
      <g transform={`translate(0 ${-525 + br * 0.5})`}>
        <circle r={98} fill="#060606" stroke={W} strokeWidth={6} />
        <path d="M-98 0 A98 98 0 0 1 -60 -78" fill="none" stroke={RED} strokeWidth={10} />
        <path d="M-92 -30 Q0 -150 92 -30 Q60 -80 0 -88 Q-60 -80 -92 -30 Z" fill={W} opacity={0.92} />
        {/* barba de tinta */}
        <path d="M-80 25 Q-70 110 0 130 Q70 110 80 25 Q40 60 0 62 Q-40 60 -80 25 Z" fill="url(#h1)" stroke={W} strokeWidth={4} />
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${s * 52 - 22} -28 L${s * 52 + 22} ${-28 + s * 4}`} stroke={W} strokeWidth={7} strokeLinecap="round" />
            {blink ? <path d={`M${s * 40 - 14 + look} -6 L${s * 40 + 14 + look} -6`} stroke={W} strokeWidth={6} /> : <ellipse cx={s * 40 + look} cy={-6} rx={11} ry={15} fill={W} />}
          </g>
        ))}
        <path d="M-22 48 Q0 54 22 48" stroke={W} strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};
const Soldier: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 3 + i) * 1.5}) scale(${s})`}>
    <path d="M0 -112 L-3 0" stroke={W} strokeWidth={2.2} />
    <path d="M-15 0 L-11 -40 Q0 -48 11 -40 L15 0 Z" fill="#050505" stroke={W} strokeWidth={2.2} />
    <circle cx={0} cy={-52} r={11} fill="#050505" stroke={W} strokeWidth={2.2} />
    <path d="M-12 -55 A12 12 0 0 1 12 -55" fill={W} />
  </g>
);
const Ridge: React.FC<{ n: number; w: number; t: number; seed: number; s?: number }> = ({ n, w, t, seed, s = 1 }) => {
  const yAt = (x: number) => Math.sin(x / 420 + seed) * 40 + Math.sin(x / 170 + seed * 2) * 14;
  const pts = Array.from({ length: 41 }, (_, i) => { const x = -w / 2 + (w * i) / 40; return `${x},${yAt(x)}`; }).join(" L");
  return (
    <g>
      {Array.from({ length: n }, (_, i) => { const x = -w / 2 + (w * (i + 0.5)) / n + (hash(i + seed) - 0.5) * 18; return <Soldier key={i} x={x} y={yAt(x) + 4 + (i % 2) * 10} s={s * (0.9 + hash(i * 3 + seed) * 0.25)} t={t} i={i} />; })}
      <path d={`M${pts} L${w / 2},900 L${-w / 2},900 Z`} fill="#050505" stroke={W} strokeWidth={3} />
      <path d={`M${pts}`} fill="none" stroke={RED} strokeWidth={2} opacity={0.6} transform="translate(0 6)" />
    </g>
  );
};
const Tent: React.FC<{ x: number; y: number; s: number; glow: number; flip?: boolean }> = ({ x, y, s, glow, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-110 0 L0 -130 L110 0 Z" fill="#060606" stroke={W} strokeWidth={3.5} />
    <path d="M0 -130 L110 0 L30 0 Z" fill="url(#h1)" opacity={0.55} />
    <path d="M-10 0 L0 -60 L10 0 Z" fill={glow > 0.5 ? "#FF7A2A" : W} opacity={0.4 + glow * 0.6} />
    <path d="M0 -130 L0 -150" stroke={W} strokeWidth={3} />
  </g>
);
const Flame: React.FC<{ t: number; s: number; seed: number }> = ({ t, s, seed }) => {
  const f = (k: number) => Math.sin(t * (13 + k) + seed * 3 + k) * 0.18 + 1;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={-40} rx={130} ry={110} fill="#FF4A12" opacity={0.18} />
      <path d={`M-38 0 Q-50 ${-60 * f(1)} -6 ${-130 * f(2)} Q-2 -70 14 ${-95 * f(3)} Q50 ${-50 * f(4)} 38 0 Z`} fill="#FF6A1F" />
      <path d={`M-20 0 Q-24 ${-40 * f(5)} 0 ${-80 * f(6)} Q22 ${-40 * f(7)} 20 0 Z`} fill="#FFD27A" />
      <path d="M-45 4 L45 -4 M-40 -6 L40 6" stroke={W} strokeWidth={6} />
    </g>
  );
};
const Smoke: React.FC<{ t: number; seed: number }> = ({ t, seed }) => (
  <g>
    {Array.from({ length: 7 }, (_, i) => { const life = (t * 0.25 + i / 7 + hash(seed)) % 1; return <circle key={i} cx={Math.sin(life * 4 + seed) * 60 * life} cy={-life * 900} r={60 + life * 220} fill="#8A8A8A" opacity={0.14 * (1 - life)} />; })}
  </g>
);

// ---------- escena ----------
export const Dv2Demo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const hx = Math.sin(t * 1.3) * 6 + Math.sin(t * 3.1) * 2, hy = Math.cos(t * 1.1) * 5;
  const c: Cam = { ...cam, x: cam.x + hx, y: cam.y + hy };
  const inValley = c.x > 4500;
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <Defs />
      {/* cielo: rojo de horizonte que se mueve poco (paralaje casi nulo) */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 140% 55% at ${50 - (c.x % 9000) / 400}% ${62 + (c.y + 500) / 60}%, ${inValley ? "rgba(211,15,23,0.85)" : "rgba(255,120,60,0.55)"} 0%, rgba(120,8,10,0.55) 28%, rgba(10,3,3,0.0) 62%), linear-gradient(#020202 0%, #0A0505 45%, #1A0607 70%, #050303 100%)` }} />
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: (hash(i) * 1080 - (c.x % 9000) * 0.01 + 1080) % 1080, top: hash(i + 9) * 620, width: 2, height: 2, borderRadius: 2, background: "#fff", opacity: 0.25 + 0.35 * Math.sin(t * 2 + i) }} />)}
      <AbsoluteFill style={{ filter: "contrast(1.08)" }}>
        {/* ===== colina de Gedeón ===== */}
        <L cam={c} d={9000} x={0} y={-900} noBlur><circle r={900} fill="#FF5A1F" opacity={0.16} /><circle r={420} fill="#FF7A2A" opacity={0.2} /></L>
        {[2600, 1900, 1400, 1000].map((d, i) => <L key={d} cam={c} d={d} x={0} y={-60 - i * 10}><Ridge n={[90, 80, 64, 52][i]} w={[9000, 7000, 5600, 4600][i]} t={t} seed={i * 3 + 1} s={[1.1, 1.05, 1, 1][i]} /></L>)}
        <L cam={c} d={1250} x={0} y={-420} o={0.5}><rect x={-6000} y={-120} width={12000} height={260} fill="url(#fogR)" /></L>
        <L cam={c} d={60} x={0} y={0}>
          <path d="M-3500 40 Q-1200 -40 0 -10 Q1400 20 3500 -30 L3500 3000 L-3500 3000 Z" fill="#040404" stroke={W} strokeWidth={4} />
          <path d="M-3500 40 Q-1200 -40 0 -10 Q1400 20 3500 -30 L3500 600 L-3500 600 Z" fill="url(#h2)" opacity={0.25} />
        </L>
        <L cam={c} d={0} x={0} y={0}><Gideon t={t} /></L>
        <L cam={c} d={-320} x={-380} y={30}>{Array.from({ length: 26 }, (_, i) => <path key={i} d={`M${i * 34} 0 Q${i * 34 + 10 + Math.sin(t * 2 + i) * 14} -90 ${i * 34 + Math.sin(t * 2.4 + i) * 30} ${-170 - hash(i) * 120}`} stroke={W} strokeWidth={6} fill="none" opacity={0.85} />)}</L>
        {/* ===== valle de Madián ===== */}
        {Array.from({ length: 16 }, (_, row) => {
          const d = 300 + row * 260;
          return (
            <L key={row} cam={c} d={d} x={9000} y={-20 + row * -6}>
              {Array.from({ length: 18 }, (_, j) => { const x = (j - 8.5) * 300 + (hash(row * 31 + j) - 0.5) * 160 + (row % 2) * 120; return <Tent key={j} x={x} y={(hash(j + row) - 0.5) * 30} s={1.1 + hash(row + j * 7) * 0.5} glow={hash(row * 7 + j)} flip={hash(j * 3 + row) > 0.5} />; })}
              {row % 3 === 1 ? Array.from({ length: 4 }, (_, j) => <g key={`f${j}`} transform={`translate(${(j - 1.5) * 1100 + row * 90} 10)`}><Flame t={t} s={0.9} seed={row + j} /><Smoke t={t} seed={row * 5 + j} /></g>) : null}
              <path d="M-6000 4 L6000 4" stroke={W} strokeWidth={2} opacity={0.35} />
            </L>
          );
        })}
        <L cam={c} d={2700} x={9180} y={0}><Flame t={t} s={2.4} seed={9} /><Smoke t={t} seed={42} /></L>
        <L cam={c} d={5200} x={9000} y={-80}><path d="M-9000 0 Q-3000 -260 0 -120 Q3000 -300 9000 -40 L9000 900 L-9000 900 Z" fill="#070404" stroke={W} strokeWidth={4} /></L>
        <L cam={c} d={120} x={9000} y={40}><path d="M-2600 0 Q-1800 -260 -1300 -60 Q-1100 0 -800 10 L-2600 400 Z" fill="#030303" stroke={W} strokeWidth={5} /><path d="M2600 0 Q1900 -320 1250 -40 L800 20 L2600 400 Z" fill="#030303" stroke={W} strokeWidth={5} /></L>
      </AbsoluteFill>
      {/* rayos de luz y niebla roja */}
      <AbsoluteFill style={{ background: "conic-gradient(from 200deg at 50% 38%, rgba(255,90,40,0) 0deg, rgba(255,90,40,0.10) 12deg, rgba(255,90,40,0) 24deg, rgba(255,90,40,0.07) 40deg, rgba(255,90,40,0) 60deg)", mixBlendMode: "screen", opacity: inValley ? 0.6 : 1 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(120,10,12,0.22) 80%, rgba(0,0,0,0.5) 100%)" }} />
      {/* brasas */}
      {Array.from({ length: 46 }, (_, i) => { const life = (t * (0.18 + hash(i) * 0.2) + hash(i + 4)) % 1; return <div key={i} style={{ position: "absolute", left: (hash(i + 7) * 1080 + Math.sin(t + i) * 40 - c.x * 0.02 % 1080 + 1080) % 1080, top: 1920 - life * 2100, width: 3 + hash(i) * 5, height: 3 + hash(i) * 5, borderRadius: 9, background: i % 3 ? "#FF7A2A" : "#FFD27A", opacity: (1 - life) * 0.8, boxShadow: "0 0 10px #FF5A1F" }} />; })}
      <svg width={0} height={0} style={{ position: "absolute" }}><defs><linearGradient id="fogR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B01015" stopOpacity="0" /><stop offset="0.5" stopColor="#B01015" stopOpacity="0.5" /><stop offset="1" stopColor="#B01015" stopOpacity="0" /></linearGradient></defs></svg>
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: 0.35 * Math.exp(-Math.max(0, t - 2.62) * 12) * (t > 2.62 ? 1 : 0) + random(`fl${Math.floor(f / 2)}`) * 0.02 }} />
      <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
      <Audio src={staticFile("dv2/demo.wav")} />
    </AbsoluteFill>
  );
};
