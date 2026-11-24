import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/est3/voz.json";
import { FPS, KFONT, groupWords } from "../kit/Kit";
import { rnd } from "./Kit";

// Noé · 2 versiones de 5 s construidas con el sistema visual de las 7 referencias:
// ilustración plana con textura, proporciones reales, suelo en perspectiva con 3 capas,
// luz de atardecer con sombras proyectadas, paleta limitada, etiquetas "píldora",
// cámara que viaja sin cortes, grano + viñeta, partículas. Única regla propia: subtítulo con recuadro rojo.
type R = { chunks: { text: string; timestamp: [number, number] }[] };
const WS = (d as unknown as R).chunks.map((c) => ({ w: c.text.trim().replace("Noe", "Noé"), s: c.timestamp[0] + 0.05, e: c.timestamp[1] + 0.05 }));
export const REFNOE_TOTAL = Math.round((WS[WS.length - 1].e + 0.6) * FPS);
const RED = "#D30F17";
const KEYS = new Set(["noé", "arcoíris"]);
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (v: number, a: number, b: number) => { const p = cl((v - a) / (b - a)); return p * p * (3 - 2 * p); };
const at = (k: string) => WS.find((w) => w.w.toLowerCase().startsWith(k))?.s ?? 0;

type Pal = {
  sky: [string, string, string, string]; sun: string; glow: string; ground: [string, string]; mtnFar: string; mtn: string; mtnSh: string; snow: string;
  tuft: string; vine: string; vineSh: string; robe: string; robeSh: string; mantle: string; mantleSh: string; skin: string; skinSh: string; hair: string;
  rim: string; shadow: string; pill: string; pillDot: string; dust: string; night: boolean; rainbow: string[];
};
const DAY: Pal = {
  sky: ["#4A2448", "#B4466A", "#EE8A5A", "#F7C27E"], sun: "#FFE7B0", glow: "rgba(255,200,120,0.55)", ground: ["#C9955F", "#8C5F38"],
  mtnFar: "#B98A8C", mtn: "#7E5A66", mtnSh: "#5E404E", snow: "#F1D9D2", tuft: "#5C3C22", vine: "#4E6A34", vineSh: "#33481F",
  robe: "#D8C3A0", robeSh: "#A88E6C", mantle: "#7A3A2A", mantleSh: "#55241A", skin: "#C98A62", skinSh: "#9C6444", hair: "#EDE7DF",
  rim: "#FFD9A0", shadow: "rgba(70,35,20,0.38)", pill: "rgba(30,18,24,0.72)", pillDot: "#FFB24A", dust: "#FFE2B0", night: false,
  rainbow: ["#D9675F", "#E59A5C", "#E5C96A", "#86B46E", "#6C93C4", "#8A78B8"],
};
const DARK: Pal = {
  sky: ["#030409", "#0A0E1E", "#1A0E1C", "#3A0E14"], sun: "#E8E4DA", glow: "rgba(211,15,23,0.45)", ground: ["#342022", "#0C0809"],
  mtnFar: "#24151C", mtn: "#150D12", mtnSh: "#0A0609", snow: "#5A4A52", tuft: "#060405", vine: "#1C2116", vineSh: "#0E120A",
  robe: "#6A5C50", robeSh: "#352C26", mantle: "#4A0C10", mantleSh: "#260608", skin: "#7A5440", skinSh: "#43291E", hair: "#BDB6AE",
  rim: "#FF3A30", shadow: "rgba(0,0,0,0.6)", pill: "rgba(8,4,6,0.8)", pillDot: RED, dust: "#FF6A50", night: true,
  rainbow: ["#CFCFD6", "#CFCFD6", "#CFCFD6", "#CFCFD6", "#CFCFD6", "#CFCFD6"],
};

// cámara continua: [cx, cy, zoom]
const camAt = (t: number): [number, number, number] => {
  const a = io(t, 0, 2.7), b = io(t, 3.0, 5.6);
  const cx = 690 + (470 - 690) * a + (540 - 470) * b;
  const cy = 860 + (1230 - 860) * a + (1040 - 1230) * b;
  const z = 1.6 + (1.14 - 1.6) * a + (1.0 - 1.14) * b;
  return [cx, cy, z];
};
const Layer: React.FC<{ t: number; dep: number; children: React.ReactNode }> = ({ t, dep, children }) => {
  const [cx, cy, z] = camAt(t);
  const zz = 1 + (z - 1) * dep, x = 540 + (cx - 540) * dep, y = 960 + (cy - 960) * dep;
  return <g transform={`translate(540 960) scale(${zz}) translate(${-x} ${-y})`}>{children}</g>;
};

const HZ = 1080; // horizonte
const Sky: React.FC<{ p: Pal; t: number }> = ({ p, t }) => (
  <g>
    <rect x={-600} y={-400} width={2300} height={HZ + 400} fill="url(#rsky)" /><rect x={-600} y={HZ - 2} width={2300} height={900} fill={p.sky[3]} />
    {p.night ? Array.from({ length: 90 }, (_, i) => <circle key={i} cx={-300 + rnd(i) * 1700} cy={-300 + rnd(i + 50) * (HZ + 100)} r={1 + rnd(i + 9) * 2.2} fill="#fff" opacity={(0.25 + rnd(i + 3) * 0.6) * (0.75 + 0.25 * Math.sin(t * 3 + i))} />) : null}
    <circle cx={860} cy={p.night ? 470 : HZ - 150} r={p.night ? 380 : 520} fill="url(#rglow)" />
    <circle cx={860} cy={p.night ? 470 : HZ - 150} r={p.night ? 58 : 82} fill={p.sun} />
    {p.night ? <circle cx={884} cy={458} r={52} fill={p.sky[1]} /> : null}
    {/* nubes alargadas */}
    {[[-80, 640, 520], [520, 760, 640], [120, 880, 420]].map(([x, y, w], i) => (
      <rect key={i} x={x + t * (6 + i * 3)} y={y} width={w} height={16 + i * 4} rx={10} fill={p.night ? "#1A1424" : "#F6B08A"} opacity={p.night ? 0.7 : 0.45} />
    ))}
  </g>
);
const Rainbow: React.FC<{ p: Pal; on: number; crack: number }> = ({ p, on, crack }) => (
  <g opacity={on * (1 - crack * 0.75)} style={{ mixBlendMode: p.night ? "normal" : "screen" }}>
    {p.rainbow.map((c, i) => (
      <path key={i} d={`M${-60 + i * 22} ${HZ + 20} A ${640 - i * 22} ${640 - i * 22} 0 0 1 ${1220 - i * 22} ${HZ + 20}`} stroke={c} strokeWidth={p.night ? 5 : 22} fill="none" opacity={p.night ? 0.55 : 0.6} strokeDasharray={p.night ? "2400" : undefined} strokeDashoffset={p.night ? 2400 * (1 - on) : undefined} />
    ))}
    {crack > 0 ? <path d="M600 460 L 578 560 L 622 640 L 590 760" stroke={RED} strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - crack)} /> : null}
  </g>
);
const Mountain: React.FC<{ p: Pal }> = ({ p }) => (
  <g>
    <rect x={-600} y={HZ - 4} width={2300} height={700} fill={p.ground[0]} /><path d={`M-400 ${HZ} L 120 ${HZ - 170} L 300 ${HZ - 120} L 520 ${HZ - 210} L 760 ${HZ - 110} L 1500 ${HZ} Z`} fill={p.mtnFar} opacity={0.8} />
    <path d={`M140 ${HZ} L 600 ${HZ - 300} Q 690 ${HZ - 360} 760 ${HZ - 300} L 1260 ${HZ} Z`} fill={p.mtn} />
    <path d={`M690 ${HZ - 342} Q 720 ${HZ - 330} 760 ${HZ - 300} L 1260 ${HZ} L 860 ${HZ} Z`} fill={p.mtnSh} />
    <path d={`M600 ${HZ - 300} Q 690 ${HZ - 360} 760 ${HZ - 300} L 735 ${HZ - 285} L 712 ${HZ - 300} L 688 ${HZ - 280} L 660 ${HZ - 298} L 630 ${HZ - 282} Z`} fill={p.snow} />
    {/* el arca, varada en la cima */}
    <g transform={`translate(676 ${HZ - 352}) scale(0.16)`}>
      <path d="M-430 -20 Q -420 120 -330 170 L 330 170 Q 420 120 440 -20 Z" fill={p.night ? "#1E1210" : "#5A3A22"} />
      <rect x={-250} y={-150} width={500} height={130} fill={p.night ? "#2A1A14" : "#7A5232"} />
      <path d="M-300 -150 L 0 -240 L 300 -150 Z" fill={p.night ? "#140C0A" : "#4A2E1A"} />
    </g>
  </g>
);
const Ground: React.FC<{ p: Pal }> = ({ p }) => {
  const vp = 700; // punto de fuga de las hileras de la viña
  return (
    <g>
      <rect x={-600} y={HZ} width={2300} height={1400} fill="url(#rground)" />
      {/* hileras de la viña convergiendo al horizonte */}
      {Array.from({ length: 9 }, (_, i) => {
        const xb = -900 + i * 330;
        return <path key={i} d={`M${vp + (xb - vp) * 0.02} ${HZ + 4} L ${xb} 2400`} stroke={p.vineSh} strokeWidth={3} opacity={0.5} />;
      })}
      {Array.from({ length: 9 }, (_, i) =>
        Array.from({ length: 10 }, (_, j) => {
          const k = (j + 0.5) / 10, s = k * k;
          const y = HZ + 6 + s * 1300, xb = -900 + i * 330, x = vp + (xb - vp) * (0.02 + s * 0.98);
          const r = 4 + s * 60;
          return (
            <g key={`${i}-${j}`}>
              <ellipse cx={x + r * 0.5} cy={y + r * 0.15} rx={r * 1.3} ry={r * 0.18} fill={p.shadow} />
              <ellipse cx={x} cy={y - r * 0.55} rx={r} ry={r * 0.62} fill={p.vine} />
              <path d={`M${x - r} ${y - r * 0.55} A ${r} ${r * 0.62} 0 0 0 ${x + r * 0.2} ${y - r * 0.02} L ${x - r * 0.2} ${y - r * 0.4} Z`} fill={p.vineSh} />
              {s > 0.2 ? [0, 1, 2].map((q) => <circle key={q} cx={x - r * 0.4 + q * r * 0.35} cy={y - r * 0.2} r={r * 0.09} fill={p.night ? "#3A0A14" : "#5A1E3A"} />) : null}
            </g>
          );
        }),
      )}
      {/* matas secas, más grandes cuanto más cerca */}
      {Array.from({ length: 160 }, (_, i) => {
        const k = rnd(i + 200), y = HZ + 10 + k * k * 900, s = 0.2 + k * 1.6, x = -300 + rnd(i + 400) * 1700;
        return <path key={i} d={`M${x} ${y} l ${-6 * s} ${-14 * s} M ${x} ${y} l 0 ${-17 * s} M ${x} ${y} l ${6 * s} ${-13 * s}`} stroke={p.tuft} strokeWidth={1.4 + s} strokeLinecap="round" opacity={0.75} />;
      })}
    </g>
  );
};

// Noé con proporciones reales (≈ 6,8 cabezas), sombreado plano en dos tonos, luz desde la derecha
const Noah: React.FC<{ p: Pal; t: number; tilt: number }> = ({ p, t, tilt }) => {
  const br = Math.sin(t * 2.2) * 2; // respiración
  return (
    <g>
      <path d="M-90 0 L 90 0 L -260 70 L -520 70 Z" fill={p.shadow} />
      <ellipse cx={-28} cy={-2} rx={26} ry={9} fill="#2A1A12" /><ellipse cx={30} cy={-2} rx={26} ry={9} fill="#2A1A12" />
      <g transform={`translate(0 ${br}) rotate(${tilt} 0 -300)`}>
        {/* túnica */}
        <path d="M-72 -500 Q -100 -250 -118 -12 L 118 -12 Q 100 -250 72 -500 Z" fill={p.robe} />
        <path d="M-72 -500 Q -100 -250 -118 -12 L -20 -12 Q -30 -250 -10 -500 Z" fill={p.robeSh} />
        {[-60, 0, 55].map((x, i) => <path key={i} d={`M${x} -300 Q ${x + 8} -150 ${x - 4 + i * 6} -14`} stroke={p.robeSh} strokeWidth={4} fill="none" opacity={0.7} />)}
        <path d="M72 -500 Q 100 -250 118 -12" stroke={p.rim} strokeWidth={5} fill="none" opacity={0.85} />
        {/* manto */}
        <path d="M-78 -505 Q -130 -300 -96 -150 L -40 -160 Q -50 -320 20 -500 Z" fill={p.mantle} />
        <path d="M-78 -505 Q -130 -300 -96 -150 L -70 -152 Q -88 -320 -30 -500 Z" fill={p.mantleSh} />
        {/* faja */}
        <path d="M-92 -330 Q 0 -310 92 -330 L 94 -300 Q 0 -282 -94 -300 Z" fill={p.mantleSh} />
        {/* brazo con la copa */}
        <path d="M44 -490 Q 92 -440 96 -360 L 150 -390 L 160 -372 L 100 -326 Q 60 -340 52 -420 Z" fill={p.robe} />
        <path d="M96 -360 L 150 -390 L 160 -372 L 100 -326 Z" fill={p.robeSh} opacity={0.6} />
        <ellipse cx={164} cy={-386} rx={15} ry={13} fill={p.skin} />
        <g transform="translate(170 -400)">
          <path d="M-20 -44 L 20 -44 Q 18 -14 0 -8 Q -18 -14 -20 -44 Z" fill={p.night ? "#6A6670" : "#C8A24A"} />
          <path d="M-18 -38 L 18 -38 Q 16 -18 0 -12 Q -16 -18 -18 -38 Z" fill={p.night ? "#5A0A12" : "#6A1A2A"} />
          <rect x={-3} y={-8} width={6} height={18} fill={p.night ? "#6A6670" : "#C8A24A"} /><ellipse cx={0} cy={11} rx={13} ry={4} fill={p.night ? "#6A6670" : "#C8A24A"} />
          <path d="M20 -44 Q 18 -14 0 -8" stroke={p.rim} strokeWidth={3} fill="none" />
        </g>
        {/* cuello y cabeza de perfil (mira hacia el monte) */}
        <path d="M-18 -520 L 22 -520 L 26 -490 L -22 -490 Z" fill={p.skinSh} />
        <path d="M-36 -560 Q -40 -610 4 -616 Q 42 -614 46 -576 L 56 -560 L 46 -552 Q 46 -530 28 -520 L -24 -520 Q -40 -536 -36 -560 Z" fill={p.skin} />
        <path d="M-36 -560 Q -40 -610 4 -616 Q -14 -590 -10 -540 L -24 -520 Q -40 -536 -36 -560 Z" fill={p.skinSh} />
        <path d="M46 -576 L 56 -560 L 46 -552" stroke={p.rim} strokeWidth={3} fill="none" />
        {/* pelo y barba blancos */}
        <path d="M-40 -574 Q -46 -540 -28 -516 Q -20 -560 -10 -590 Q -30 -600 -40 -574 Z" fill={p.hair} />
        <path d="M-12 -546 Q 6 -530 44 -540 Q 50 -500 30 -460 Q 10 -436 -6 -470 Q -16 -500 -12 -546 Z" fill={p.hair} />
        <path d="M30 -540 Q 50 -500 30 -460" stroke={p.rim} strokeWidth={3} fill="none" opacity={0.8} />
        <path d="M18 -548 Q 34 -546 44 -548" stroke="#3A2A22" strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={30} cy={-576} rx={4} ry={5} fill="#1A120E" />
        <path d="M18 -590 Q 30 -596 42 -590" stroke={p.hair} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

const Pill: React.FC<{ x: number; y: number; txt: string; p: Pal; on: number; lx?: number; ly?: number }> = ({ x, y, txt, p, on, lx, ly }) => {
  const w = txt.length * 26 + 90;
  return (
    <g opacity={on} transform={`translate(${x} ${y + (1 - on) * 16})`}>
      {lx !== undefined && ly !== undefined ? <path d={`M0 30 L ${lx - x} ${ly - y}`} stroke="#fff" strokeWidth={2.5} opacity={0.7} strokeDasharray="6 6" /> : null}
      <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={p.pill} stroke={p.night ? RED : "rgba(255,255,255,0.35)"} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 18px ${p.night ? "rgba(211,15,23,0.7)" : "rgba(255,190,110,0.7)"})` }} />
      <circle cx={-w / 2 + 34} cy={0} r={9} fill={p.pillDot} />
      <text x={-w / 2 + 58} y={13} fontFamily={KFONT} fontWeight={700} fontSize={38} fill="#fff" letterSpacing={1}>{txt}</text>
    </g>
  );
};

// subtítulo de la referencia (pequeño, arriba, palabras futuras en gris) con la clave en recuadro ROJO
const Cap: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, groups = groupWords(WS);
  const gi = groups.findIndex((g, i) => t >= g[0].s - 0.06 && t < (groups[i + 1]?.[0].s ?? 999) - 0.06);
  if (gi < 0) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 80, right: 80, textAlign: "center", fontFamily: KFONT, fontWeight: 600, fontSize: 60, lineHeight: 1.3, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)" }}>
      {groups[gi].map((w, i) => {
        const on = t >= w.s - 0.06, k = on && KEYS.has(w.w.replace(/[^\wáéíóúñ]/gi, "").toLowerCase());
        return (
          <React.Fragment key={i}>
            {i ? " " : ""}
            <span style={{ opacity: on ? 1 : 0.4, padding: k ? "0 12px" : undefined, background: k ? RED : undefined, borderRadius: 6 }}>{w.w}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Film: React.FC<{ f: number; p: Pal }> = ({ f, p }) => (
  <>
    <svg width={1080} height={1920} style={{ position: "absolute", mixBlendMode: "overlay", opacity: p.night ? 0.32 : 0.22 }}>
      <filter id="rgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 8} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={1080} height={1920} filter="url(#rgrain)" />
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${p.night ? 0.7 : 0.32}) 100%)` }} />
  </>
);

const Scene: React.FC<{ p: Pal }> = ({ p }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const tNoe = at("noé"), tY = at("y"), tArco = at("arcoíris");
  const rb = io(t, tArco - 0.15, tArco + 0.45);
  const crack = p.night ? io(t, tArco + 0.35, tArco + 0.75) : 0;
  const tilt = -2.5 * io(t, tY, tY + 0.8); // Noé tambalea (el vino)
  return (
    <AbsoluteFill style={{ background: p.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.sky[0]} /><stop offset="45%" stopColor={p.sky[1]} /><stop offset="80%" stopColor={p.sky[2]} /><stop offset="100%" stopColor={p.sky[3]} />
          </linearGradient>
          <radialGradient id="rglow"><stop offset="0%" stopColor={p.glow} /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></radialGradient>
          <linearGradient id="rground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.ground[0]} /><stop offset="100%" stopColor={p.ground[1]} /></linearGradient>
        </defs>
        <Layer t={t} dep={0.6}><Sky p={p} t={t} /><Rainbow p={p} on={rb} crack={crack} /></Layer>
        <Layer t={t} dep={0.85}><Mountain p={p} /></Layer>
        <Layer t={t} dep={1}>
          <Ground p={p} />
          <g transform="translate(400 1660)"><Noah p={p} t={t} tilt={tilt} /></g>
          <Pill x={420} y={950} txt="950 AÑOS" p={p} on={io(t, tNoe, tNoe + 0.3) * (1 - io(t, tArco - 0.4, tArco - 0.1))} lx={410} ly={1050} />
          <Pill x={720} y={1130} txt="GÉNESIS 9:21" p={p} on={io(t, tArco + 0.2, tArco + 0.5)} lx={570} ly={1250} />
        </Layer>
        {/* polvo flotando en primer plano */}
        <Layer t={t} dep={1.3}>
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={-200 + rnd(i + 900) * 1500 + Math.sin(t * 0.8 + i) * 20} cy={300 + ((rnd(i + 700) * 1700 - t * (12 + rnd(i) * 20)) % 1700)} r={1.5 + rnd(i + 30) * 3.5} fill={p.dust} opacity={0.35 + rnd(i + 5) * 0.45} />
          ))}
        </Layer>
      </svg>
      <Film f={f} p={p} />
      <Cap f={f} />
      <Audio src={staticFile("est3/voz.wav")} />
    </AbsoluteFill>
  );
};

export const RefNoe100: React.FC = () => <Scene p={DAY} />;
export const RefNoeDark: React.FC = () => <Scene p={DARK} />;
