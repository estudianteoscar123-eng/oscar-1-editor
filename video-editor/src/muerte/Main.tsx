import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/muerte/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Drop, Serif } from "../sangre/Main";
import { Ground, Robe } from "../adultera/Dark";
import { Shot, Star } from "../navidad/Main";

// ZK Dark · "¿Qué pasa el segundo después de morir?" (Ec 12:7, Lc 23:43, 2 Co 5:8, Ap 21:4). Bucle: el monitor vuelve a latir.
const TH = 0.1;
const END = 25.6;
export const MUERTE_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["segundo", "morir", "palabra", "polvo", "espíritu", "dios", "criminal", "hoy", "paraíso", "mañana", "señor", "lágrima", "muerte"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => <circle cx={x} cy={y} r={r} fill={`rgba(242,242,242,${0.16 * o})`} style={{ filter: "blur(40px)" }} />;

// monitor cardíaco: la línea late y se aplana en `flat` (0 late, 1 plana)
const ECG: React.FC<{ t: number; flat: number; y?: number; color?: string }> = ({ t, flat, y = 1000, color = RED }) => {
  const pts: string[] = [];
  for (let x = 0; x <= 1080; x += 6) {
    const ph = ((x / 1080) * 3 - t * 1.2) % 1;
    const p = ph < 0 ? ph + 1 : ph;
    let v = 0;
    if (p > 0.40 && p < 0.44) v = -30; else if (p > 0.44 && p < 0.47) v = 220; else if (p > 0.47 && p < 0.50) v = -300; else if (p > 0.50 && p < 0.53) v = 80;
    const fade = ip(x / 1080, [0, 1], [1, 1 - flat]);
    pts.push(`${x},${y - v * (1 - flat) * fade}`);
  }
  return (
    <g>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
    </g>
  );
};
const Monitor: React.FC<{ t: number; flat: number; bpm?: string }> = ({ t, flat, bpm }) => (
  <g>
    <Ink><rect x={80} y={640} width={920} height={720} rx={40} fill="#050505" stroke="#F2F2F2" strokeWidth={8} /></Ink>
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M120 ${700 + i * 85} L960 ${700 + i * 85}`} stroke="#F2F2F2" strokeWidth={1} opacity={0.15} />)}
    <g clipPath="url(#mon)"><ECG t={t} flat={flat} /></g>
    <clipPath id="mon"><rect x={100} y={660} width={880} height={680} /></clipPath>
    <text x={920} y={740} textAnchor="end" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={70} fill={flat > 0.5 ? "#F2F2F2" : RED}>{bpm}</text>
  </g>
);

// ---------- escenas ----------
// 1 · gancho: el monitor late… y se aplana en "morir"
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const flat = frozen !== undefined ? 1 : ip(t, [at("morir") - 0.1, at("morir") + 0.25], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, at("morir")], [1.0, 1.1]) + flat * 0.12})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Monitor t={t} flat={flat} bpm={flat > 0.5 ? "0" : String(72 + Math.round(Math.sin(t * 3) * 2))} />
        {frozen !== undefined ? <><Serif txt="¿Y DESPUÉS" y={500} size={110} ls={6} /><Serif txt="QUÉ PASA?" y={1560} size={110} ls={6} /></> : null}
      </svg>
    </AbsoluteFill>
  );
};
// 2 · una sola palabra: un libro cerrado con una luz que se filtra
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("sola"), 1.35, 50, 52, -2]]}>
    {(t) => {
      const lite = ip(t, [at("sola") - 0.2, at("palabra") + 0.2], [0, 1]);
      return (
        <>
          <Glow x={540} y={1000} r={300 + lite * 200} o={lite} />
          <Ink><rect x={300} y={720} width={480} height={600} rx={20} fill="#050505" stroke="#F2F2F2" strokeWidth={8} /><rect x={300} y={720} width={60} height={600} fill="url(#h1)" opacity={0.6} /></Ink>
          <rect x={360} y={1005} width={420} height={10 + lite * 10} fill="#F2F2F2" style={{ filter: "drop-shadow(0 0 30px #fff)" }} opacity={lite} />
          <text x={540} y={1100} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={180} fill={RED} opacity={0.2 + lite * 0.25} style={{ filter: "blur(14px)" }}>???</text>
        </>
      );
    }}
  </Shot>
);
// 3 · el cuerpo vuelve al polvo, el espíritu sube a Dios (Ec 12:7)
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 70], [at("polvo"), 1.35, 50, 78, 2], [at("espíritu"), 1.0, 50, 50], [at("dios"), 1.2, 50, 35, -2]]}>
    {(t) => {
      const dust = ip(t, [at("polvo") - 0.2, at("polvo") + 0.8], [0, 1]);
      const rise = eo(ip(t, [at("espíritu") - 0.1, at("dios") + 0.4], [0, 1]));
      return (
        <>
          <Glow x={540} y={420} r={320} o={rise} />
          <Star x={540} y={420} r={60 * rise + 1} o={rise} />
          <Ground y={1560} />
          <g opacity={1 - dust}><Ink><path d="M260 1540 Q300 1490 380 1500 L760 1500 Q820 1505 830 1540 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><circle cx={300} cy={1500} r={40} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink></g>
          {Array.from({ length: 50 }, (_, i) => { const x = 260 + random(`dx${i}`) * 570; const y = 1500 + random(`dy${i}`) * 40 - dust * random(`dv${i}`) * 140; return dust > 0 ? <circle key={i} cx={x} cy={y} r={3 + random(`dr${i}`) * 4} fill="#F2F2F2" opacity={(1 - dust) * 0.9 + 0.1} /> : null; })}
          <g opacity={rise * 0.85} transform={`translate(0 ${-rise * 650})`}><Robe x={540} y={1530} s={0.9} /></g>
          <Serif txt="ECLESIASTÉS 12:7" y={1720} size={56} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.85])} ls={6} />
        </>
      );
    }}
  </Shot>
);
// 4 · tres cruces; la del centro brilla (Lc 23:43)
const Cross: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g opacity={o}><Ink><rect x={x - 14 * s} y={y - 340 * s} width={28 * s} height={420 * s} fill="#050505" stroke="#F2F2F2" strokeWidth={5} /><rect x={x - 110 * s} y={y - 270 * s} width={220 * s} height={26 * s} fill="#050505" stroke="#F2F2F2" strokeWidth={5} /></Ink></g>
);
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 60], [at("criminal"), 1.4, 75, 60, 2], [at("jesús"), 1.35, 50, 52], [at("hoy"), 1.0, 50, 55], [at("paraíso"), 1.2, 50, 50, -2]]}>
    {(t) => (
      <>
        <Glow x={540} y={1000} r={460} o={ip(t, [at("hoy"), at("paraíso")], [0.4, 1.4])} />
        <Ink><path d="M-20 1500 Q540 1280 1100 1500 L1100 1920 L-20 1920 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink>
        <Cross x={250} y={1420} s={1.0} o={0.7} />
        <Cross x={540} y={1340} s={1.25} />
        <Cross x={830} y={1420} s={1.0} />
        <Serif txt="LUCAS 23:43" y={1720} size={60} o={ip(t, [at("hoy"), at("hoy") + 0.2], [0, 0.9])} ls={8} />
      </>
    )}
  </Shot>
);
// 5 · no mañana, no en mil años: el calendario se tacha; queda 0 segundos
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 45], [at("mil"), 1.0, 50, 55], [at("hoy", 1), 1.4, 50, 72, -2]]}>
    {(t) => (
      <>
        <Serif txt="+1 DÍA" y={760} size={120} ls={6} o={ip(t, [t0, t0 + 0.1], [0, 1])} />
        <Brush d="M220 720 L860 740" p={eo(ip(t, [at("mañana") + 0.2, at("mañana") + 0.45], [0, 1]))} w={22} len={700} />
        <Serif txt="+1000 AÑOS" y={1010} size={120} ls={4} o={ip(t, [at("mil") - 0.05, at("mil") + 0.05], [0, 1])} />
        <Brush d="M140 970 L940 990" p={eo(ip(t, [at("años") + 0.2, at("años") + 0.45], [0, 1]))} w={22} len={850} />
        <g filter="url(#brushH)" opacity={ip(t, [at("hoy", 1) - 0.05, at("hoy", 1) + 0.05], [0, 1])} transform={`translate(540 1380) scale(${ip(t, [at("hoy", 1), at("hoy", 1) + 0.12], [1.5, 1])}) translate(-540 -1380)`}>
          <text x={540} y={1440} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={200} fill="#F2F2F2">0 s</text>
        </g>
      </>
    )}
  </Shot>
);
// 6 · salir del cuerpo es estar con el Señor: la figura cruza una puerta de luz (2 Co 5:8)
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("cuerpo", 1), 1.3, 40, 62, 2], [at("señor"), 1.25, 58, 52]]}>
    {(t) => {
      const walk = ip(t, [t0, at("señor") + 0.4], [0, 1]);
      return (
        <>
          <rect x={620} y={700} width={260} height={860} fill="#F2F2F2" opacity={0.9} style={{ filter: "drop-shadow(0 0 60px #fff)" }} />
          <path d="M620 1560 L880 1560 L1080 1920 L420 1920 Z" fill="rgba(242,242,242,0.16)" />
          <Ground y={1560} />
          <Robe x={200 + walk * 520} y={1560} s={0.95 - walk * 0.2} o={1 - walk * 0.4} />
          <Serif txt="2 CORINTIOS 5:8" y={1730} size={62} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.85])} ls={6} />
        </>
      );
    }}
  </Shot>
);
// 7 · Dios secará toda lágrima: la gota roja cae y se vuelve luz (Ap 21:4)
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("lágrima"), 1.5, 50, 52, 2], [at("muerte"), 1.0, 50, 50]]}>
    {(t) => {
      const fall = ip(t, [t0, at("lágrima") + 0.3], [0, 1]);
      const gone = ip(t, [at("lágrima") + 0.2, at("muerte") + 0.4], [0, 1]);
      return (
        <>
          <Glow x={540} y={1100} r={200 + gone * 400} o={gone * 1.5} />
          {gone < 1 ? <Drop x={540} y={700 + fall * 360} r={60 * (1 - gone) + 1} o={1 - gone} /> : null}
          {gone > 0 ? Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <Draw key={i} d={`M${540 + Math.cos(a) * 120} ${1100 + Math.sin(a) * 120} L${540 + Math.cos(a) * (140 + gone * 260)} ${1100 + Math.sin(a) * (140 + gone * 260)}`} p={gone} w={4} />; }) : null}
          <Serif txt="APOCALIPSIS 21:4" y={1600} size={62} o={ip(t, [at("lágrima"), at("lágrima") + 0.2], [0, 0.85])} ls={6} />
        </>
      );
    }}
  </Shot>
);
// 8 · bucle: el monitor plano… y vuelve a latir
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  const beat = ip(t, [END - 1.4, END - 0.3], [1, 0]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.2, 1.0])})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><Monitor t={t} flat={beat} bpm={beat > 0.5 ? "0" : "72"} /></svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("la"), C2], [at("cuerpo") - 0.12, C3], [at("y"), C4], [at("no"), C5], [at("pablo"), C6], [at("y", 1), C7], [at("mándaselo"), C8],
];
const SFX: [number, string, number][] = [[at("morir") - 0.05, "sfx/impact.wav", 0.35], [at("hoy", 1) - 0.05, "sfx/impact.wav", 0.35], [at("lágrima") + 0.3, "sfx/shimmer.wav", 0.3]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Muerte: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 16 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 16 * kick}px) scale(${1 + 0.05 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={3} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ opacity: flick, transform: cam }}>
        {SC.map(([t0, C], i) => {
          const end = SC[i + 1]?.[0] ?? END;
          return <Sequence key={i} from={S(t0)} durationInFrames={Math.max(1, S(end) - S(t0))}><C t0={t0} /></Sequence>;
        })}
      </AbsoluteFill>
      {t >= TH ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      {t >= TH ? <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} /> : null}
      <Audio src={staticFile("muerte/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
