import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/judas/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";

// ZK Dark — marca: grabado en línea blanca sobre negro + una pincelada roja seca. Pruebas de 5 s.
export const DARK_TOTAL = 5 * FPS;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const RED = "#D30F17";
const KEYS = new Set(["judas", "30", "plata", "esclavo", "dios", "precio"]);

// filtros: trazo de grabado tembloroso, pincel seco y pincel con bordes rotos
export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <pattern id="h1" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1={0} y1={0} x2={0} y2={9} stroke="#fff" strokeWidth={1.8} /></pattern>
      <pattern id="h2" width={11} height={11} patternUnits="userSpaceOnUse" patternTransform="rotate(-42)"><line x1={0} y1={0} x2={0} y2={11} stroke="#fff" strokeWidth={1.3} /></pattern>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter>
      <filter id="brushH" filterUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves={3} seed={8} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.7" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={2} result="d" />
        <feDisplacementMap in="c" in2="d" scale={22} />
      </filter>
      <filter id="brushV" filterUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
        <feTurbulence type="fractalNoise" baseFrequency="0.16 0.006" numOctaves={3} seed={8} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.7" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={2} result="d" />
        <feDisplacementMap in="c" in2="d" scale={22} />
      </filter>
    </defs>
  </svg>
);

// trazo que se dibuja solo
export const Draw: React.FC<{ d: string; p: number; w?: number; color?: string; len?: number }> = ({ d, p, w = 5, color = "#fff", len = 3000 }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);
// pincelada roja pintándose
export const Brush: React.FC<{ d: string; p: number; w?: number; len?: number; v?: boolean }> = ({ d, p, w = 110, len = 2400, v }) => (
  <g filter={`url(#${v ? "brushV" : "brushH"})`}>
    <path d={d} fill="none" stroke={RED} strokeWidth={w} strokeLinecap="butt" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    <path d={d} fill="none" stroke={RED} strokeWidth={w * 0.55} strokeLinecap="butt" strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={v ? "translate(-26 0)" : "translate(0 -26)"} opacity={0.85} />
  </g>
);
// moneda grabada: contorno, anillo, águila y media sombra rayada
export const CoinG: React.FC<{ cx: number; cy: number; r: number; p: number }> = ({ cx, cy, r, p }) => (
  <g filter="url(#ink)">
    <clipPath id={`cc${cx}${cy}`}><path d={`M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} /></clipPath>
    <circle cx={cx} cy={cy} r={r} fill="#050505" />
    {p > 0.6 ? <circle cx={cx} cy={cy} r={r} fill="url(#h1)" clipPath={`url(#cc${cx}${cy})`} opacity={ip(p, [0.6, 1], [0, 0.9])} /> : null}
    <Draw d={`M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx + r - 0.1} ${cy - 0.5}`} p={p} w={r / 9} len={2 * Math.PI * r + 10} />
    <Draw d={`M${cx + r * 0.78} ${cy} A${r * 0.78} ${r * 0.78} 0 1 1 ${cx + r * 0.78 - 0.1} ${cy - 0.5}`} p={ip(p, [0.2, 0.8], [0, 1])} w={r / 18} len={2 * Math.PI * r} />
    <Draw d={`M${cx} ${cy - r * 0.45} Q${cx + r * 0.3} ${cy - r * 0.25} ${cx + r * 0.22} ${cy + r * 0.05} L${cx + r * 0.45} ${cy - r * 0.02} Q${cx + r * 0.3} ${cy + r * 0.3} ${cx + r * 0.1} ${cy + r * 0.32} L${cx} ${cy + r * 0.5} L${cx - r * 0.1} ${cy + r * 0.32} Q${cx - r * 0.3} ${cy + r * 0.3} ${cx - r * 0.45} ${cy - r * 0.02} L${cx - r * 0.22} ${cy + r * 0.05} Q${cx - r * 0.3} ${cy - r * 0.25} ${cx} ${cy - r * 0.45}`} p={ip(p, [0.4, 1], [0, 1])} w={r / 22} len={6 * r} />
  </g>
);
// bolsa de monedas grabada (pliegues + sombreado rayado)
export const BagG: React.FC<{ p: number; tilt: number }> = ({ p, tilt }) => {
  const body = "M-170 -120 Q-270 40 -235 200 Q-200 335 0 345 Q200 335 235 200 Q270 40 170 -120 Q100 -168 0 -160 Q-100 -168 -170 -120 Z";
  return (
    <g filter="url(#ink)" transform={`translate(560 1230) rotate(${tilt})`}>
      <clipPath id="bagR"><path d={body} transform="translate(40 0)" /></clipPath>
      <path d={body} fill="#050505" />
      <path d={body} fill="url(#h1)" clipPath="url(#bagR)" opacity={ip(p, [0.55, 1], [0, 0.75])} />
      <path d="M40 -150 Q140 60 90 330" fill="none" stroke="url(#h2)" strokeWidth={90} opacity={ip(p, [0.6, 1], [0, 0.6])} />
      <Draw d={body} p={p} w={8} len={2200} />
      <Draw d="M-125 -148 Q0 -108 125 -148" p={ip(p, [0.3, 0.7], [0, 1])} w={9} len={400} />
      <Draw d="M-90 -160 L-140 -260 M-40 -166 L-55 -275 M20 -166 L30 -278 M80 -160 L130 -258" p={ip(p, [0.4, 0.9], [0, 1])} w={6} len={900} />
      <Draw d="M-150 -40 Q-120 120 -170 260 M-60 -80 Q-20 120 -70 320 M60 -90 Q100 110 50 320" p={ip(p, [0.5, 1], [0, 1])} w={4} len={1300} />
      <Draw d="M110 -138 Q210 -190 260 -150" p={ip(p, [0.55, 1], [0, 1])} w={6} len={300} />
    </g>
  );
};
// etiqueta de precio grabada
export const TagG: React.FC<{ p: number; sw: number }> = ({ p, sw }) => (
  <g filter="url(#ink)" transform={`translate(540 640) rotate(${sw})`}>
    <Draw d="M0 -260 L0 -40" p={p} w={5} len={300} />
    <path d="M-300 -40 L220 -40 L320 140 L220 320 L-300 320 Z" fill="url(#h1)" opacity={ip(p, [0.5, 1], [0, 0.35])} />
    <Draw d="M-300 -40 L220 -40 L320 140 L220 320 L-300 320 Z" p={p} w={8} len={2000} />
    <circle cx={220} cy={140} r={26} fill="#050505" stroke="#fff" strokeWidth={6} opacity={ip(p, [0.6, 0.8], [0, 1])} />
  </g>
);

export const Ash: React.FC<{ f: number }> = ({ f }) => (
  <>{Array.from({ length: 40 }, (_, i) => {
    const s = 2 + random(`a${i}`) * 5;
    return <div key={i} style={{ position: "absolute", left: (random(`ax${i}`) * 1080 + Math.sin(f / 30 + i) * 30) % 1080, top: (random(`ay${i}`) * 1920 - f * (0.6 + random(`av${i}`) * 1.4) + 1920 * 2) % 1920, width: s, height: s, borderRadius: "50%", background: i % 6 ? "rgba(255,255,255,0.55)" : "rgba(211,15,23,0.8)" }} />;
  })}</>
);
export const Paper: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "screen", pointerEvents: "none" }}>
    <filter id="pp"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 6} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter="url(#pp)" />
  </svg>
);

// ---------- A · el gancho (0–5 s) ----------
const A: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const hand = eo(ip(t, [0, 1.6], [0, 1]));
  const slash = eo(ip(t, [1.05, 1.5], [0, 1]));
  const n30 = eo(ip(t, [2.45, 3.0], [0, 1]));
  const coins = [0.6, 0.9, 1.2, 1.5, 1.8, 2.1];
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 5], [1.0, 1.08])})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Brush d="M-40 1060 Q540 960 1120 1020" p={slash} w={150} len={1300} />
        <BagG p={hand} tilt={ip(t, [1.6, 2.4], [0, 18])} />
        {coins.map((at, i) => {
          const k = ip(t, [at + 1.0, at + 1.6], [0, 1]);
          if (k <= 0) return null;
          const x = 720 + k * (60 + i * 40), y = 1100 + k * k * (520 - (i % 3) * 30);
          return <CoinG key={i} cx={x} cy={y} r={58} p={ip(t, [at + 1.0, at + 1.5], [0, 1])} />;
        })}
      </svg>
      {n30 > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g filter="url(#brushH)">
            <text x={540} y={860} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={430} fill={RED} stroke={RED} strokeWidth={10} style={{ clipPath: `inset(0 ${(1 - n30) * 100}% 0 0)` }}>30</text>
          </g>
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- B · el giro (32,4–37,4 s): el precio de un esclavo → la cruz roja sobre las monedas ----------
const B: React.FC<{ f: number }> = ({ f }) => {
  const t = 32.4 + f / FPS;
  const tag = eo(ip(t, [32.4, 33.3], [0, 1]));
  const x = eo(ip(t, [33.3, 33.7], [0, 1]));
  const part2 = t >= 34.5;
  const crossV = eo(ip(t, [35.1, 35.6], [0, 1]));
  const crossH = eo(ip(t, [35.6, 36.0], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [32.4, 37.4], [1.0, 1.08])})` }}>
      {!part2 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <TagG p={tag} sw={Math.sin(f / 9) * 4} />
          <text x={460} y={820} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={100} fill="#fff" opacity={ip(t, [32.9, 33.2], [0, 1])} filter="url(#ink)" transform={`rotate(${Math.sin(f / 9) * 4} 540 640)`}>30 SICLOS</text>
          <Brush d="M160 1150 L920 1350" p={x} w={120} len={900} />
          <Brush d="M920 1130 L160 1370" p={eo(ip(t, [33.55, 33.9], [0, 1]))} w={120} len={900} />
          <text x={540} y={1560} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={96} fill="#fff" letterSpacing={6} opacity={ip(t, [33.4, 33.7], [0, 1])}>ESCLAVO</text>
        </svg>
      ) : (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }, (_, i) => <CoinG key={i} cx={300 + (i % 3) * 240} cy={1040 + Math.floor(i / 3) * 200 - (i % 2) * 30} r={96} p={ip(t, [34.5 + i * 0.05, 35.2 + i * 0.05], [0, 1])} />)}
          <Brush d="M540 380 L540 1720" p={crossV} w={140} len={1400} v />
          <Brush d="M190 760 L890 760" p={crossH} w={130} len={760} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const ZkDark: React.FC<{ v: "A" | "B" }> = ({ v }) => {
  const f = useCurrentFrame();
  const t0 = v === "A" ? 0 : 32.4;
  const words: Word[] = RAW.filter((c) => c.timestamp[0] >= t0 - 0.05 && c.timestamp[0] < t0 + 5).map((c) => ({ w: c.text.trim(), s: c.timestamp[0] - t0, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) - t0 }));
  const flick = 0.92 + 0.08 * random(`fl${Math.floor(f / 2)}`);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      <AbsoluteFill style={{ opacity: flick }}>{v === "A" ? <A f={f} /> : <B f={f} />}</AbsoluteFill>
      <Ash f={f} />
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)" }} />
      <Captions f={f} groups={groupWords(words)} keys={KEYS} />
      <Audio src={staticFile("judas/mezcla.wav")} trimBefore={S(t0)} />
    </AbsoluteFill>
  );
};
