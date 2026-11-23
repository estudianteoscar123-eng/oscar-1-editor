import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/zkl/words.json";
import { Captions, FPS, Word, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { Character } from "./Kit";

// ZK Dark en formato horizontal (16:9): tinta negra con contorno blanco, rojo #D30F17, fuego, ceniza, grano de papel,
// transiciones ZK (zoom a través, barrido, iris), subtítulos ZK con la palabra clave enmarcada en rojo.
const RED = "#D30F17", WH = "#F2F2F2", INK = "#050505";
const VW = 1920, VH = 1080;
const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => Math.min(1, Math.max(0, (v - a) / (b - a))) * (o1 - o0) + o0;
const ws: Word[] = (d as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + 0.1, e: c.timestamp[1] + 0.1 }));
const at = (w: string, n = 0) => ws.filter((x) => x.w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "") === w)[n]?.s ?? 0;
export const ZKL_TOTAL = Math.round((ws[ws.length - 1].e + 1.0) * FPS);

const LScene: React.FC<{ t: number; a: number; b: number; tr?: number; push?: number; children: React.ReactNode }> = ({ t, a, b, tr = 0, push = 0.07, children }) => {
  if (t < a - 0.01 || t >= b) return null;
  const k = ip(t, a, a + 0.22), e = 1 - Math.pow(1 - k, 3), pz = 1 + ip(t, a, b) * push;
  const c = `translate(960 540) scale(${pz}) translate(-960 -540)`;
  const tf = tr === 0 ? `translate(960 540) scale(${(2.2 - 1.2 * e) * pz}) translate(-960 -540)` : tr === 1 ? `translate(${(1 - e) * -1920} 0) ${c}` : tr === 2 ? `translate(${(1 - e) * 1920} 0) ${c}` : c;
  const id = `ir${Math.round(a * 100)}`;
  return <g>{tr === 3 ? <defs><clipPath id={id}><circle cx={960} cy={540} r={60 + e * 1200} /></clipPath></defs> : null}<g clipPath={tr === 3 ? `url(#${id})` : undefined} transform={tf}>{children}</g></g>;
};
const Flames: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number }> = ({ t, x, y, w, h, n = 7 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const fx = x - w / 2 + (i + 0.5) * (w / n), fh = h * (0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i * 1.7))); return <g key={i}><path d={`M${fx - w / n / 1.6} ${y} Q${fx - w / n / 3} ${y - fh * 0.6} ${fx + Math.sin(t * 9 + i) * 10} ${y - fh} Q${fx + w / n / 3} ${y - fh * 0.5} ${fx + w / n / 1.6} ${y} Z`} fill="#FF5A14" opacity={0.9} /><path d={`M${fx - w / n / 3.5} ${y} Q${fx} ${y - fh * 0.5} ${fx + Math.sin(t * 11 + i) * 6} ${y - fh * 0.62} Q${fx + w / n / 5} ${y - fh * 0.3} ${fx + w / n / 3.5} ${y} Z`} fill="#FFD27A" /></g>; })}</g>
);
const Halo: React.FC<{ x: number; y: number; r: number; c: string; o?: number }> = ({ x, y, r, c, o = 1 }) => (
  <g><defs><radialGradient id={`hl${x}${y}`}><stop offset="0%" stopColor={c} stopOpacity={0.6 * o} /><stop offset="100%" stopColor={c} stopOpacity={0} /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#hl${x}${y})`} /></g>
);
// figura de tinta: el personaje del canal con túnica negra y contorno blanco
const Fig: React.FC<React.ComponentProps<typeof Character>> = (p) => <g filter="url(#wline)"><Character robe="#0E0C0B" robe2="#050505" sash={RED} {...p} /></g>;
const Skyline: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <g opacity={o} filter="url(#ink)">
    <path d="M520 760 L 760 470 L 1000 760 Z" fill="#0B0807" stroke={WH} strokeWidth={5} />
    <path d="M1000 760 L 1150 600 L 1300 760 Z" fill="#0B0807" stroke={WH} strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => { const x = i * 170 - 20, h = 140 + random(`h${i}`) * 160; return <g key={i}><rect x={x} y={860 - h} width={160} height={h} fill="#0B0807" stroke={WH} strokeWidth={5} /><rect x={x + 30} y={860 - h + 40} width={34} height={30} fill={i % 3 === 0 ? "#FFB24F" : "#0B0807"} stroke={WH} strokeWidth={3} /></g>; })}
    <rect y={860} width={VW} height={220} fill="#0B0807" />
  </g>
);
const BloodDoor: React.FC<{ x: number; y: number; s?: number; t: number; drip?: number }> = ({ x, y, s = 1, t, drip = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Halo x={100} y={180} r={420} c="#FF3A20" o={0.8 + Math.sin(t * 6) * 0.1} />
    <g filter="url(#ink)"><rect x={-40} y={-40} width={280} height={460} fill="#0B0807" stroke={WH} strokeWidth={6} /><rect x={0} y={0} width={200} height={420} fill="#140C08" stroke={WH} strokeWidth={5} />{[50, 100, 150].map((v) => <line key={v} x1={v} y1={0} x2={v} y2={420} stroke={WH} strokeWidth={3} opacity={0.5} />)}</g>
    <g fill={RED}><rect x={-46} y={-46} width={292} height={30} /><rect x={-46} y={-20} width={26} height={330} /><rect x={220} y={-20} width={26} height={300} />
      {[10, 60, 120, 170].map((v, i) => <g key={i}><rect x={v} y={-18} width={9} height={(30 + i * 18) * drip} rx={4} /><circle cx={v + 4.5} cy={-18 + (30 + i * 18) * drip} r={8} /></g>)}</g>
    <rect x={0} y={414} width={200} height={8} fill="#FFC46A" />
  </g>
);

export const ZKLargo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const t1 = at("eres") - 0.15, t2 = at("y") - 0.15, t3 = at("está") - 0.15, END = ZKL_TOTAL / FPS;
  const hits = [t1, t2, t3];
  const last = hits.filter((h) => h <= t).pop() ?? -9;
  const sh = Math.exp(-(t - last) * 10) * (t > 0.2 ? 1 : 0);
  const jx = (random(`jx${f}`) - 0.5) * 18 * sh, jy = (random(`jy${f}`) - 0.5) * 18 * sh;
  const keys = new Set(["minutos", "primer", "sangre", "calle"]);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Defs />
      <svg width={VW} height={VH} style={{ position: "absolute" }}>
        <defs>
          <filter id="wline" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius={4} result="d" /><feFlood floodColor={WH} /><feComposite in2="d" operator="in" result="o" /><feMerge><feMergeNode in="o" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g transform={`translate(${jx} ${jy})`}>
          {/* 1 · el reloj */}
          <LScene t={t} a={0} b={t1} push={0.1}>
            <Skyline o={0.55} />
            <circle cx={1500} cy={200} r={70} fill="none" stroke={WH} strokeWidth={5} /><Halo x={1500} y={200} r={220} c="#F2F2F2" o={0.4} />
            <g transform="translate(960 470)">
              <Halo x={0} y={0} r={420} c="#D30F17" o={0.5} />
              <g filter="url(#ink)"><circle r={300} fill="#0B0807" stroke={WH} strokeWidth={10} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-270} x2={0} y2={-236} stroke={WH} strokeWidth={i % 3 ? 5 : 12} transform={`rotate(${i * 30})`} />)}</g>
              <line x1={0} y1={0} x2={0} y2={-170} stroke={WH} strokeWidth={16} strokeLinecap="round" transform={`rotate(${-5 + t * 0.4})`} />
              <line x1={0} y1={0} x2={0} y2={-250} stroke={RED} strokeWidth={10} strokeLinecap="round" transform={`rotate(${294 + t * 6})`} />
              <circle r={18} fill={RED} />
            </g>
          </LScene>
          {/* 2 · el primer hijo */}
          <LScene t={t} a={t1} b={t2} tr={1} push={0.09}>
            <g filter="url(#ink)"><rect width={VW} height={VH} fill="#0B0807" />{Array.from({ length: 9 }, (_, r) => <line key={r} x1={0} y1={120 + r * 100} x2={VW} y2={120 + r * 100} stroke={WH} strokeWidth={2} opacity={0.12} />)}</g>
            <text x={1380} y={760} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={620} fill={RED} opacity={0.9} filter="url(#ink)">1°</text>
            <g opacity={0.55}><Fig id="zpa" t={t} x={420} y={960} s={0.85} hair="wig" pose={{ look: [0.6, 0], mouth: "flat", brow: -0.3 }} /><Fig id="zma" t={t} x={640} y={960} s={0.8} hair="long" dress pose={{ look: [0.6, 0], mouth: "worry", brow: 0.4, browTilt: -0.6 }} /></g>
            <Halo x={1000} y={560} r={420} c="#D30F17" o={0.55} />
            <Fig id="ztu" t={t} x={1000} y={1000} s={1.25} pose={{ look: [0, 0], mouth: "o", mouthOpen: 0.4, brow: 0.9, eyeOpen: 1.1 }} />
          </LScene>
          {/* 3 · la puerta con sangre */}
          <LScene t={t} a={t2} b={t3} tr={0} push={0.12}>
            <rect width={VW} height={VH} fill="#0B0807" />
            <Flames t={t} x={560} y={700} w={70} h={120} n={3} /><Flames t={t} x={1360} y={700} w={70} h={120} n={3} />
            <g filter="url(#ink)"><rect x={540} y={700} width={40} height={200} fill="#0B0807" stroke={WH} strokeWidth={4} /><rect x={1340} y={700} width={40} height={200} fill="#0B0807" stroke={WH} strokeWidth={4} /></g>
            <BloodDoor x={860} y={330} s={1.15} t={t} drip={ip(t, t2, t2 + 1.4, 0.3, 1)} />
            <rect y={880} width={VW} height={200} fill="#0B0807" />
          </LScene>
          {/* 4 · cruzar la calle */}
          <LScene t={t} a={t3} b={END + 1} tr={2} push={0.1}>
            <rect width={VW} height={VH} fill="#0B0807" />
            <g filter="url(#ink)"><rect x={0} y={250} width={420} height={640} fill="#0B0807" stroke={WH} strokeWidth={6} /><rect x={150} y={560} width={150} height={330} fill="#050505" stroke={WH} strokeWidth={5} /><rect x={130} y={680} width={190} height={22} fill={WH} opacity={0.8} /></g>
            <BloodDoor x={1560} y={470} s={0.95} t={t} />
            <g opacity={0.8}>{Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={(i * 330 + t * 60) % 2300 - 150} cy={930 + Math.sin(t + i) * 10} rx={260} ry={50} fill="#1A2A22" opacity={0.5} />)}</g>
            <Halo x={930} y={640} r={330} c="#FFB24F" o={0.8} />
            <Fig id="ztu2" t={t} x={kfz(t, t3, t3 + 2.6, 760, 900)} y={960} s={1.0} pose={{ walk: (t - t3) * 1.1, armR: [60, 20], look: [0.8, 0], brow: 0.6, browTilt: -0.6, mouth: "worry" }} holdR={<g><path d="M-30 0 Q -26 -20 0 -22 Q 26 -20 36 -9 L 50 -12 Q 44 -2 30 0 Z" fill="#B5703F" /><g transform="translate(48 -14)"><Flames t={t} x={0} y={0} w={20} h={36} n={1} /></g></g>} />
            <rect y={890} width={VW} height={190} fill="#0B0807" opacity={0.6} />
          </LScene>
        </g>
      </svg>
      {Array.from({ length: 50 }, (_, i) => { const s = 2 + random(`a${i}`) * 5; return <div key={i} style={{ position: "absolute", left: (random(`ax${i}`) * VW + Math.sin(f / 30 + i) * 30) % VW, top: (random(`ay${i}`) * VH - f * (0.6 + random(`av${i}`) * 1.4) + VH * 4) % VH, width: s, height: s, borderRadius: "50%", background: i % 6 ? "rgba(255,255,255,0.55)" : "rgba(211,15,23,0.8)" }} />; })}
      <svg width={VW} height={VH} style={{ position: "absolute", opacity: 0.1, mixBlendMode: "screen" }}><filter id="ppz"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 6} /><feColorMatrix type="saturate" values="0" /></filter><rect width={VW} height={VH} filter="url(#ppz)" /></svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(60,0,4,.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: sh * 0.2 }} />
      <Captions f={f} groups={groupWords(ws)} keys={keys} hl={RED} y={870} />
      <Audio src={staticFile("zkl/voz.wav")} />
    </AbsoluteFill>
  );
};
const kfz = (t: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * ip(t, a, b);
