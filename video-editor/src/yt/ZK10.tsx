import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import dg from "../../public/zk10/goliat.json";
import { FPS, KFONT, groupWords } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, cl, io } from "./RefNoe";
import { CAM, Person } from "./ZK9";

// Demo 15 s · "dopamina": 8 planos con ángulos distintos (contrapicado, comparación, macro, cenital,
// primer plano, POV, cámara-proyectil, plano lateral), golpes de cámara, sonido en cada acción, música desde el 1er cuadro.
const RED = "#D30F17";
const P = DARK;
type R = { chunks: { text: string; timestamp: [number, number] }[] };
type Wd = { w: string; s: number; e: number };
const W: Wd[] = (() => {
  const raw = (dg as unknown as R).chunks.map((c) => ({ w: c.text.trim().replace(/^Goliath/, "Goliat"), s: Math.max(0, c.timestamp[0] - 0.04), e: c.timestamp[1] }));
  const out: Wd[] = [];
  raw.forEach((w) => { const pv = out[out.length - 1]; if (pv && pv.w === "me" && w.w.startsWith("día")) { pv.w = "medía"; pv.e = w.e; } else out.push({ ...w }); });
  return out;
})();
export const nrm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const F = (k: string, nth = 0, d = -1) => W.filter((w) => nrm(w.w).startsWith(nrm(k)))[nth]?.s ?? d;
const FE = (k: string, nth = 0, d = -1) => W.filter((w) => nrm(w.w).startsWith(nrm(k)))[nth]?.e ?? d;
export const ZKGOL_TOTAL = Math.round((W[W.length - 1].e + 0.45) * FPS);

const tTres = F("tres", 0, 1.0);
const tArm = F("su", 0, 2.0);
const tNum = Math.max(0, F("cincuenta", 0, F("57", 0, 2.8)));
const tKg = F("kilos", 0, tNum + 0.9);
const tDav = F("david", 0, 4.4);
const tCinco = F("cinco", 0, F("5", 0, 5.4));
const tSolo = F("solo", 0, 6.8);
const tTiro = F("tiro", 0, 8.4) - 0.25;
const tDir = F("directo", 0, 9.2);
const tFrente = F("frente", 0, 10.2);
const tGig = F("gigante", 0, 11.0) - 0.35;
const tCayo = F("cayo", 0, 11.7);
const tCara = F("cara", 0, 12.6);
const CUTS = [0, tTres, tArm, tDav, tSolo, tTiro, tDir, tGig];
const shotAt = (t: number) => { let i = 0; while (i < CUTS.length - 1 && t >= CUTS[i + 1]) i++; return i; };
export const kick = (t: number, t0: number, amp: number, k = 7) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * k));
export const shake = (t: number, amp: number) => [Math.sin(t * 93) * amp, Math.cos(t * 71) * amp];

// ---------------- dibujos ----------------
export const Defs = () => (
  <defs>
    <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#030409" /><stop offset="55%" stopColor="#0C0F20" /><stop offset="85%" stopColor="#2A0C14" /><stop offset="100%" stopColor="#5A1014" /></linearGradient>
    <linearGradient id="gground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24161A" /><stop offset="100%" stopColor="#08050A" /></linearGradient>
    <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3A2410" /><stop offset="45%" stopColor="#8A5A28" /><stop offset="75%" stopColor="#5A3816" /><stop offset="100%" stopColor="#1A0E06" /></linearGradient>
    <pattern id="scales" width={44} height={32} patternUnits="userSpaceOnUse">
      <rect width={44} height={32} fill="#24160A" />
      <path d="M0 32 A22 22 0 0 1 44 32" fill="#6A4420" stroke="#140A04" strokeWidth={3} />
      <path d="M-22 16 A22 22 0 0 1 22 16 M22 16 A22 22 0 0 1 66 16" fill="#5A3818" stroke="#140A04" strokeWidth={3} />
    </pattern>
    <radialGradient id="rglowg"><stop offset="0%" stopColor="rgba(211,15,23,0.6)" /><stop offset="100%" stopColor="rgba(211,15,23,0)" /></radialGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A1A22" /><stop offset="100%" stopColor="#061016" /></linearGradient>
    <radialGradient id="stoneg" cx="35%" cy="30%"><stop offset="0%" stopColor="#9A9490" /><stop offset="60%" stopColor="#5A5450" /><stop offset="100%" stopColor="#1E1A18" /></radialGradient>
  </defs>
);
export const Valley: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-1000} y={-1000} width={3080} height={2300} fill="url(#gsky)" />
    {Array.from({ length: 80 }, (_, i) => <circle key={i} cx={-500 + rnd(i) * 2080} cy={-200 + rnd(i + 40) * 1200} r={1 + rnd(i + 7) * 2} fill="#fff" opacity={0.2 + rnd(i + 3) * 0.5} />)}
    <ellipse cx={540} cy={1250} rx={1200} ry={260} fill="url(#rglowg)" />
    <path d="M-1000 1300 Q -300 980 300 1180 L 300 1300 Z" fill="#140A10" />
    <path d="M780 1300 L 780 1170 Q 1400 960 2080 1300 Z" fill="#100810" />
    {/* ejércitos en las colinas */}
    {Array.from({ length: 70 }, (_, i) => { const left = i < 35, u = rnd(i + 300); const x = left ? -600 + u * 860 : 820 + u * 900; const y = left ? 1290 - Math.sin(u * 2.4) * 150 : 1290 - Math.sin((1 - u) * 2.4) * 140; return <g key={i}><rect x={x} y={y - 22} width={7} height={22} fill="#050305" /><path d={`M${x + 8} ${y - 40} L ${x + 8} ${y}`} stroke="#050305" strokeWidth={2} /></g>; })}
    <rect x={-1000} y={1290} width={3080} height={1200} fill="url(#gground)" />
    {Array.from({ length: 60 }, (_, i) => { const k = rnd(i + 90), y = 1300 + k * k * 700, s = 0.4 + k * 2; const x = -400 + rnd(i + 11) * 1900; return <path key={i} d={`M${x} ${y} l ${-5 * s} ${-12 * s} M ${x} ${y} l 0 ${-15 * s} M ${x} ${y} l ${5 * s} ${-11 * s}`} stroke="#050304" strokeWidth={1 + s} strokeLinecap="round" />; })}
    {Array.from({ length: 25 }, (_, i) => <circle key={i} cx={-200 + rnd(i + 500) * 1500 + Math.sin(t + i) * 15} cy={((rnd(i + 600) * 1900 - t * 30) % 1900 + 1900) % 1900} r={1.5 + rnd(i) * 3} fill="#FF6A50" opacity={0.4} />)}
  </g>
);

// Goliat de frente: pies en (0,0), ~1700 de alto
export const Goliath: React.FC<{ crack?: number; t: number; glow?: number }> = ({ crack = 0, t, glow = 0 }) => (
  <g>
    <ellipse cx={0} cy={6} rx={330} ry={40} fill="rgba(0,0,0,0.6)" />
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 105 - 70} -730 Q ${sd * 105 - 80} -520 ${sd * 105 - 58} -420 Q ${sd * 105 - 40} -200 ${sd * 105 - 42} -40 L ${sd * 105 + 42} -40 Q ${sd * 105 + 46} -200 ${sd * 105 + 62} -420 Q ${sd * 105 + 80} -560 ${sd * 105 + 70} -730 Z`} fill="url(#bronze)" />
        <ellipse cx={sd * 105} cy={-430} rx={64} ry={46} fill="#6A4420" stroke="#140A04" strokeWidth={5} />
        <path d={`M${sd * 105 - 62} -600 L ${sd * 105 + 62} -600 M ${sd * 105 - 58} -420 L ${sd * 105 + 58} -420`} stroke="#140A04" strokeWidth={6} />
        <ellipse cx={sd * 110} cy={-18} rx={95} ry={34} fill="#100806" />
        <path d={`M${sd * 105 + 62} -730 L ${sd * 105 + 52} -40`} stroke={P.rim} strokeWidth={5} opacity={sd > 0 ? 0.9 : 0} />
      </g>
    ))}
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-260 + i * 52} y={-950} width={46} height={260} rx={8} fill={i % 2 ? "#3A1A12" : "#24100A"} stroke="#0A0404" strokeWidth={3} />)}
    <path d="M-280 -1370 L 280 -1370 L 250 -900 L -250 -900 Z" fill="url(#scales)" />
    <path d="M-280 -1370 L -60 -1370 L -40 -900 L -250 -900 Z" fill="#000" opacity={0.35} />
    <path d="M280 -1370 L 250 -900" stroke={P.rim} strokeWidth={7} />
    <rect x={-262} y={-950} width={524} height={56} rx={10} fill="url(#bronze)" />
    {/* brazos */}
    <path d="M-280 -1360 Q -360 -1200 -350 -900 L -280 -900 Q -290 -1150 -230 -1300 Z" fill="url(#scales)" />
    <ellipse cx={-318} cy={-880} rx={44} ry={50} fill="#5A3A28" />
    <ellipse cx={-280} cy={-1330} rx={110} ry={70} fill="url(#bronze)" stroke="#140A04" strokeWidth={5} />
    <ellipse cx={280} cy={-1330} rx={110} ry={70} fill="url(#bronze)" stroke="#140A04" strokeWidth={5} />
    <path d="M280 -1360 Q 370 -1250 380 -1060 L 310 -1050 Q 300 -1200 230 -1300 Z" fill="url(#scales)" />
    <ellipse cx={348} cy={-1040} rx={46} ry={50} fill="#5A3A28" />
    {/* lanza como rodillo de telar */}
    <rect x={330} y={-1980} width={42} height={1900} fill="#2A1A10" /><path d="M372 -1980 L 372 -80" stroke={P.rim} strokeWidth={4} />
    <path d="M300 -1980 L 351 -2200 L 402 -1980 Z" fill="#7A7680" /><path d="M351 -2200 L 402 -1980" stroke={P.rim} strokeWidth={4} />
    {/* cuello y cabeza */}
    <rect x={-60} y={-1460} width={120} height={110} fill="#3A2418" />
    <ellipse cx={0} cy={-1520} rx={112} ry={132} fill="#6E4A36" />
    <path d="M0 -1652 Q -112 -1640 -112 -1520 Q -112 -1400 0 -1388 Q -50 -1520 0 -1652 Z" fill="#3A2418" />
    <path d="M-110 -1500 Q -100 -1390 0 -1330 Q 100 -1390 110 -1500 Q 60 -1440 0 -1450 Q -60 -1440 -110 -1500 Z" fill="#0E0806" />
    <path d="M-70 -1555 L -18 -1535 M 70 -1555 L 18 -1535" stroke="#0A0505" strokeWidth={12} strokeLinecap="round" />
    <ellipse cx={-42} cy={-1515} rx={16} ry={10} fill="#0A0505" /><ellipse cx={42} cy={-1515} rx={16} ry={10} fill="#0A0505" />
    <circle cx={-38} cy={-1517} r={4} fill={RED} opacity={0.5 + glow * 0.5} /><circle cx={46} cy={-1517} r={4} fill={RED} opacity={0.5 + glow * 0.5} />
    <path d="M-128 -1560 Q -130 -1730 0 -1745 Q 130 -1730 128 -1560 L 128 -1480 L 100 -1500 L 92 -1580 L -92 -1580 L -100 -1500 L -128 -1480 Z" fill="url(#bronze)" />
    <rect x={-12} y={-1582} width={24} height={80} fill="#6A4420" />
    <path d="M128 -1560 Q 130 -1730 0 -1745" stroke={P.rim} strokeWidth={6} fill="none" />
    <path d={`M-20 -1745 Q 0 -1830 ${60 + Math.sin(t * 6) * 10} -1860 Q 40 -1790 20 -1745 Z`} fill="#5A0A10" />
    {crack > 0 ? (
      <g opacity={crack}>
        <circle cx={0} cy={-1600} r={28} fill="#1A0505" />
        <path d="M0 -1600 L -60 -1660 M 0 -1600 L 70 -1650 M 0 -1600 L -50 -1540 M 0 -1600 L 55 -1560 M 0 -1600 L 6 -1690" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - crack)} />
      </g>
    ) : null}
  </g>
);
export const Stone: React.FC<{ r: number }> = ({ r }) => (
  <g>
    <ellipse cx={0} cy={0} rx={r * 1.12} ry={r} fill="url(#stoneg)" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={(rnd(i + 70) - 0.5) * r * 1.3} cy={(rnd(i + 80) - 0.5) * r * 1.2} r={r * 0.06} fill="#2A2624" opacity={0.6} />)}
    <path d={`M${r * 0.8} ${-r * 0.5} A ${r * 1.12} ${r} 0 0 1 ${r * 0.6} ${r * 0.8}`} stroke={P.rim} strokeWidth={r * 0.07} fill="none" />
  </g>
);
export const Speed: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 60, op = 0.5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(i + 5) * Math.PI * 2, ph = (t * 3.5 + rnd(i)) % 1, r0 = 250 + ph * 1300, len = 120 + ph * 400;
      return <path key={i} d={`M${540 + Math.cos(a) * r0} ${960 + Math.sin(a) * r0} L ${540 + Math.cos(a) * (r0 + len)} ${960 + Math.sin(a) * (r0 + len)}`} stroke={i % 5 === 0 ? RED : "#fff"} strokeWidth={2 + rnd(i + 2) * 4} opacity={op * ph} />;
    })}
  </g>
);
export const Pill: React.FC<{ x: number; y: number; txt: string; on: number; big?: boolean }> = ({ x, y, txt, on, big }) => {
  const fs = big ? 64 : 40, w = txt.length * fs * 0.66 + 100, h = fs * 1.75;
  return (
    <g opacity={cl(on)} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * io(on, 0, 1) + kick(on, 0.5, 0)})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="rgba(8,4,6,0.82)" stroke={RED} strokeWidth={3} style={{ filter: "drop-shadow(0 0 22px rgba(211,15,23,0.75))" }} />
      <circle cx={-w / 2 + h / 2} cy={0} r={fs * 0.22} fill={RED} />
      <text x={-w / 2 + h / 2 + fs * 0.6} y={fs * 0.36} fontFamily={KFONT} fontWeight={700} fontSize={fs} fill="#fff" letterSpacing={1}>{txt}</text>
    </g>
  );
};

// ---------------- planos ----------------
const S1Contrapicado: React.FC<{ t: number }> = ({ t }) => {
  const u = io(t, 0, tTres);
  const step = kick(t, 0.02, 1, 6) + kick(t, tTres * 0.55, 0.7, 6);
  const [sx, sy] = shake(t, step * 14);
  const h = Math.round(29 * io(t, 0.1, tTres - 0.05));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${sy}px) scale(${2.1 - u * 0.95}) translateY(${-330 + u * 420}px) rotate(${-3 + u * 3}deg)`, transformOrigin: "50% 100%" }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <Defs />
          <Valley t={t} />
          <g transform="translate(540 1880) scale(1.02)"><Goliath t={t} glow={u} /></g>
        </svg>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g opacity={io(t, 0.1, 0.3)}>
          <path d={`M980 1800 L 980 ${1800 - 1250 * io(t, 0.1, tTres - 0.05)}`} stroke={RED} strokeWidth={8} />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M960 ${1800 - i * 139} L 1000 ${1800 - i * 139}`} stroke="#fff" strokeWidth={3} opacity={1800 - i * 139 >= 1800 - 1250 * io(t, 0.1, tTres - 0.05) ? 0.8 : 0} />)}
        </g>
        <Pill x={830} y={1800 - 1250 * io(t, 0.1, tTres - 0.05) - 70} txt={`${(h / 10).toFixed(1).replace(".", ",")} M`} on={io(t, 0.1, 0.3)} big />
      </svg>
    </AbsoluteFill>
  );
};
const S1bComparacion: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const z = 1.25 - io(lt, 0, 0.9) * 0.2;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <g transform={`translate(540 1300) scale(${z}) translate(-540 -1300)`}>
        <rect width={1080} height={1920} fill="#05060C" />
        {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M0 ${i * 80} L 1080 ${i * 80}`} stroke="#141828" strokeWidth={2} />)}
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} 0 L ${i * 80} 1920`} stroke="#141828" strokeWidth={2} />)}
        <rect x={0} y={1500} width={1080} height={420} fill="#0C0809" />
        <g transform="translate(640 1500) scale(0.59)"><Goliath t={t} /></g>
        <Person x={250} y={1500} s={0.97} look={CAM} face={1} t={t} />
        <path d="M120 1500 L 120 900" stroke="#fff" strokeWidth={3} strokeDasharray="10 8" opacity={io(lt, 0.1, 0.3)} />
        <path d={`M120 ${1500 - 600} L 380 ${1500 - 600}`} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" opacity={io(lt, 0.1, 0.3)} />
        <path d={`M120 ${1500 - 1003} L 1000 ${1500 - 1003}`} stroke={RED} strokeWidth={4} strokeDasharray="14 8" strokeDashoffset={-lt * 60} opacity={io(lt, 0.2, 0.4)} />
      </g>
      <Pill x={250} y={1500 * 1 - 600 * 1.2 - 40} txt="1,75 M" on={io(lt, 0.15, 0.35)} />
      <Pill x={870} y={560} txt="2,9 M" on={io(lt, 0.25, 0.45)} big />
    </svg>
  );
};
const S2Armadura: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const z = 2.6 + 3.4 * Math.exp(-lt * 5);
  const stamp = t >= tKg ? 1 : 0;
  const [sx, sy] = shake(t, kick(t, tKg, 22, 6));
  const n = Math.round(57 * io(t, tNum, tKg));
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <rect width={1080} height={1920} fill="#05050A" />
      <g transform={`translate(${540 + sx} ${980 + sy}) rotate(${-6 + lt * 2}) scale(${z}) translate(0 1130)`}><Goliath t={t} /></g>
      <rect width={1080} height={1920} fill="url(#rglowg)" opacity={0.25 + kick(t, tKg, 0.6, 4)} />
      <g opacity={io(t, tNum - 0.1, tNum + 0.05)} transform={`translate(540 1150) scale(${stamp ? 1 + kick(t, tKg, 1.4, 12) : 1}) rotate(-4)`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={stamp ? 300 : 240} fill={stamp ? "#fff" : "rgba(255,255,255,0.85)"} style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.9))" }}>{n}</text>
        <text x={0} y={110} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={110} fill={RED} opacity={stamp}>KG</text>
        <rect x={-260} y={150} width={520 * stamp} height={14} fill={RED} />
      </g>
    </svg>
  );
};
const S3Cenital: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const rot = lt * 6, z = 1.1 + lt * 0.08;
  const sAt = (k: number) => tDav + 0.15 + k * ((tCinco + 0.3 - tDav) / 5);
  const pos = [[330, 820], [700, 760], [520, 1040], [300, 1220], [760, 1180]];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <g transform={`translate(540 960) rotate(${rot}) scale(${z}) translate(-540 -960)`}>
        <rect x={-500} y={-500} width={2080} height={2920} fill="url(#water)" />
        {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${-300 + rnd(i) * 1700} ${((rnd(i + 9) * 2600 + t * 260) % 2600) - 400} q 40 30 0 90`} stroke="#2A5A6A" strokeWidth={3} fill="none" opacity={0.5} />)}
        {Array.from({ length: 150 }, (_, i) => <ellipse key={i} cx={-200 + rnd(i + 30) * 1500} cy={-200 + rnd(i + 31) * 2300} rx={10 + rnd(i + 32) * 22} ry={8 + rnd(i + 33) * 16} fill={i % 3 ? "#1E2A2E" : "#2E3A3C"} />)}
        {/* sombra de David desde arriba */}
        <g transform="translate(540 1720)" opacity={0.85}><ellipse cx={0} cy={0} rx={250} ry={120} fill="#020405" /><circle cx={0} cy={-40} r={95} fill="#020405" /></g>
        {pos.map(([x, y], k) => {
          const on = io(t, sAt(k), sAt(k) + 0.12);
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${on * (1 + kick(t, sAt(k), 0.5, 10))})`}>
              <circle r={95} fill="none" stroke={RED} strokeWidth={6} opacity={0.9} />
              <Stone r={62} />
              <text x={0} y={-120} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={60} fill="#fff">{k + 1}</text>
            </g>
          );
        })}
      </g>
      <Pill x={540} y={1560} txt="1 SAMUEL 17:40" on={io(lt, 0.2, 0.45)} />
    </svg>
  );
};
const S4Palma: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const z = 1 + lt * 0.12, fall = io(lt, 0.05, 0.6);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <rect width={1080} height={1920} fill="#06070E" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={rnd(i + 3) * 1080} cy={rnd(i + 4) * 1100} r={40 + rnd(i) * 90} fill={i % 3 ? "rgba(255,80,50,0.08)" : "rgba(211,15,23,0.12)"} />)}
      <g transform={`translate(540 1180) scale(${z}) translate(-540 -1180)`}>
        {/* mano */}
        <path d="M200 1920 L 250 1350 Q 270 1180 420 1150 L 760 1150 Q 900 1170 900 1300 L 880 1920 Z" fill="#6E4A36" />
        <path d="M200 1920 L 250 1350 Q 270 1180 420 1150 L 470 1150 Q 340 1300 360 1920 Z" fill="#3A2418" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${300 + i * 150} 1190 Q ${290 + i * 150} 1010 ${340 + i * 150} 990 Q ${390 + i * 150} 1000 ${400 + i * 150} 1170`} fill="#6E4A36" stroke="#3A2418" strokeWidth={6} />)}
        <path d="M900 1300 L 880 1920" stroke={P.rim} strokeWidth={6} />
        <g transform="translate(560 1170)"><circle r={150 + Math.sin(lt * 10) * 8} fill="none" stroke={RED} strokeWidth={8} /><Stone r={105} /></g>
        {[[260, 1100, -1], [380, 960, -1], [760, 960, 1], [880, 1100, 1]].map(([x, y, d], i) => (
          <g key={i} transform={`translate(${x + d * fall * 260} ${y + fall * fall * 1100}) rotate(${fall * d * 140})`} opacity={1 - fall * 0.6}><Stone r={62} /></g>
        ))}
      </g>
      <Pill x={540} y={760} txt="SOLO 1" on={io(lt, 0.15, 0.35)} big />
    </svg>
  );
};
const S5POV: React.FC<{ t: number; lt: number; dur: number }> = ({ t, lt, dur }) => {
  const sp = 7 + lt * 9, ang = Math.PI + lt * sp;
  const [sx, sy] = shake(t, 5 + lt * 4);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <g transform={`translate(${540 + sx} ${960 + sy}) rotate(${Math.sin(lt * 4) * 3}) scale(${1 + lt * 0.1}) translate(-540 -960)`}>
        <Valley t={t} />
        <g transform="translate(540 1330) scale(0.3)"><Goliath t={t} glow={1} /></g>
        <circle cx={540} cy={1020} r={70} fill="none" stroke={RED} strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(lt * 12)} />
      </g>
      {/* la honda girando (primera persona) */}
      {Array.from({ length: 8 }, (_, k) => {
        const a = ang - k * 0.09, cx = 760, cy = 1420, px = cx + Math.cos(a) * 420, py = cy + Math.sin(a) * 230;
        return (
          <g key={k} opacity={k === 0 ? 1 : 0.35 - k * 0.035}>
            <path d={`M${cx} ${cy} L ${px} ${py}`} stroke="#3A2A1A" strokeWidth={k === 0 ? 8 : 5} />
            <g transform={`translate(${px} ${py})`}><ellipse rx={80} ry={52} fill="#2A1A10" /><Stone r={50} /></g>
          </g>
        );
      })}
      <path d="M1080 1920 L 720 1470 Q 760 1380 840 1400 L 1080 1600 Z" fill="#6E4A36" />
      <path d="M720 1470 Q 760 1380 840 1400" stroke={P.rim} strokeWidth={5} fill="none" />
      <rect width={1080} height={1920} fill={RED} opacity={io(lt, dur - 0.25, dur) * 0.25} />
    </svg>
  );
};
const S6Proyectil: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const d0 = tFrente - tDir, u = cl(lt / d0);
  const hit = t >= tFrente;
  const zf = hit ? 3.0 + (t - tFrente) * 0.15 : 0.25 + Math.pow(u, 3) * 2.75;
  const [sx, sy] = shake(t, hit ? kick(t, tFrente, 40, 5) : 6);
  const freeze = hit && t - tFrente < 0.12;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <rect width={1080} height={1920} fill="#05050A" />
      <g transform={`translate(${540 + sx} ${960 + sy})`}>
        <g transform={`scale(${zf * 0.5}) translate(0 1600)`}>
          <g transform="translate(0 0)"><Valley t={t} /></g>
        </g>
        <g transform={`scale(${zf}) translate(0 ${1600 - 60 / Math.max(zf, 0.3)})`}><Goliath t={t} glow={1} crack={io(t, tFrente, tFrente + 0.2)} /></g>
      </g>
      {!hit ? <Speed t={t} n={70} op={0.7} /> : null}
      {!hit ? (
        <g transform={`translate(${540 + Math.sin(lt * 20) * 6} ${1120 - u * 160}) scale(${1.6 - u * 1.1})`}>
          {[6, 5, 4, 3, 2, 1].map((k) => <ellipse key={k} cx={0} cy={k * 40} rx={90 - k * 8} ry={80 - k * 8} fill="#fff" opacity={0.05} />)}
          <Stone r={90} />
        </g>
      ) : null}
      <rect width={1080} height={1920} fill={freeze ? "#fff" : RED} opacity={hit ? (freeze ? 0.85 : kick(t, tFrente + 0.12, 0.45, 3)) : 0} />
      {hit ? <Pill x={540} y={1520} txt="1 SAMUEL 17:49" on={io(t, tFrente + 0.25, tFrente + 0.5)} /> : null}
    </svg>
  );
};
const S7Caida: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const u = io(t, tCayo - 0.15, tCara + 0.1);
  const fall = Math.pow(cl((t - (tCayo - 0.15)) / (tCara + 0.1 - (tCayo - 0.15))), 2);
  const landed = t >= tCara + 0.1;
  const [sx, sy] = shake(t, kick(t, tCara + 0.1, 36, 4));
  const z = 1.15 + u * 0.2;
  const dust = landed ? cl((t - tCara - 0.1) / 0.8) : 0;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Defs />
      <g transform={`translate(${540 + sx} ${1250 + sy}) scale(${z}) rotate(${-2 + lt * 1.5}) translate(-600 -1250)`}>
        <Valley t={t} />
        <g transform={`translate(980 1520) rotate(${-fall * 86}) scale(0.42)`}><Goliath t={t} crack={1} /></g>
        <Person x={110} y={1530} s={0.5} look={CAM} face={1} t={t} />
        {Array.from({ length: 26 }, (_, i) => {
          const a = Math.PI + rnd(i + 3) * Math.PI, r = dust * (150 + rnd(i) * 420);
          return <circle key={i} cx={280 + Math.cos(a) * r} cy={1520 + Math.sin(a) * r * 0.35} r={30 + dust * 90 * rnd(i + 1)} fill="#3A2A2A" opacity={(1 - dust) * 0.7} />;
        })}
      </g>
      <rect width={1080} height={1920} fill="#fff" opacity={landed && t - tCara - 0.1 < 0.07 ? 0.5 : 0} />
    </svg>
  );
};

const Cap: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, groups = groupWords(W);
  const keys = new Set(["goliat", "tres", "57", "cincuenta", "kilos", "cinco", "5", "una", "tiro", "frente", "gigante", "cara"]);
  const gi = groups.findIndex((g, i) => t >= (i === 0 ? 0 : g[0].s - 0.06) && t < (groups[i + 1]?.[0].s ?? 999) - 0.06);
  if (gi < 0) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 70, right: 70, textAlign: "center", fontFamily: KFONT, fontWeight: 700, fontSize: 64, lineHeight: 1.3, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.8)" }}>
      {groups[gi].map((w, i) => {
        const on = t >= w.s - 0.06 || (gi === 0 && i === 0), k = on && keys.has(nrm(w.w));
        const pop = k ? 1 + kick(t, w.s - 0.06, 0.25, 12) : 1;
        return (
          <React.Fragment key={i}>
            {i ? " " : ""}
            <span style={{ display: "inline-block", transform: `scale(${pop})`, opacity: on ? 1 : 0.4, padding: k ? "0 12px" : undefined, background: k ? RED : undefined, borderRadius: 6 }}>{w.w}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none"><Audio src={staticFile(`zk10/sfx/${src}.wav`)} volume={vol} /></Sequence>
);

export const ZKGoliat: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKGOL_TOTAL / FPS;
  const i = shotAt(t), lt = t - CUTS[i], dur = (CUTS[i + 1] ?? T) - CUTS[i];
  const punch = 1 + kick(lt, 0, 0.1, 9);
  const whip = i > 0 ? 1 - io(lt, 0, 0.14) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${whip * (i % 2 ? 260 : -260)}px) scale(${punch})`, filter: whip > 0.05 ? `blur(${whip * 14}px)` : undefined }}>
        {i === 0 ? <S1Contrapicado t={t} /> : null}
        {i === 1 ? <S1bComparacion t={t} lt={lt} /> : null}
        {i === 2 ? <S2Armadura t={t} lt={lt} /> : null}
        {i === 3 ? <S3Cenital t={t} lt={lt} /> : null}
        {i === 4 ? <S4Palma t={t} lt={lt} /> : null}
        {i === 5 ? <S5POV t={t} lt={lt} dur={dur} /> : null}
        {i === 6 ? <S6Proyectil t={t} lt={lt} /> : null}
        {i === 7 ? <S7Caida t={t} lt={lt} /> : null}
      </AbsoluteFill>
      <Film f={f} p={P} />
      <Cap f={f} />
      <Audio src={staticFile("zk10/goliat.wav")} />
      <Audio src={staticFile("zk/songs/short2.mp3")} trimBefore={80 * FPS} volume={(fr) => 0.3 * (1 - io(fr / FPS, T - 0.4, T))} />
      <Sfx at={0} src="boom" vol={0.9} />
      <Sfx at={tTres * 0.55} src="boom" vol={0.6} />
      {CUTS.slice(1).map((c, k) => <Sfx key={k} at={c - 0.12} src="whoosh" vol={0.55} />)}
      <Sfx at={tKg} src="hit" vol={0.9} />
      {[0, 1, 2, 3, 4].map((k) => <Sfx key={k} at={tDav + 0.15 + k * ((tCinco + 0.3 - tDav) / 5)} src="tick" vol={0.8} />)}
      <Sfx at={tTiro} src="whirr" vol={0.8} />
      <Sfx at={tDir} src="riser" vol={0.7} />
      <Sfx at={tFrente} src="hit" vol={1} />
      <Sfx at={tFrente} src="boom" vol={0.8} />
      <Sfx at={tCara + 0.1} src="boom" vol={1} />
    </AbsoluteFill>
  );
};
