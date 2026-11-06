import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/lazaro/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Defs, Draw, Paper } from "../judas/Dark";
import { Drop, Face, Kneel, Serif } from "../sangre/Main";
import { Ground, Robe, Stone } from "../adultera/Dark";
import { Shot, Star } from "../navidad/Main";

// ZK Dark · "Jesús lloró" (Juan 11:35). La única gota roja es la lágrima. Bucle: el final vuelve a la Biblia.
const TH = 0.1;
const END = 25.35;
export const LAZARO_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["corto", "dos", "poder", "lágrimas", "lloró", "lázaro", "increíble", "minutos", "resucitar", "despertarlo", "dolor", "contigo", "navidad", "vacía"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const BigRed: React.FC<{ txt: string; y: number; p: number; size?: number }> = ({ txt, y, p, size = 170 }) => (
  <g filter="url(#brushH)"><text x={540} y={y} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={size} fill={RED} stroke={RED} strokeWidth={6} style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{txt}</text></g>
);

// la Biblia con renglones que corren; un renglón diminuto queda marcado
const Bible: React.FC<{ t: number; t0: number; scroll: number; mark: number }> = ({ t, scroll, mark }) => (
  <g>
    <Ink>
      <path d="M540 640 Q380 600 120 640 L120 1500 Q380 1460 540 1500 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
      <path d="M540 640 Q700 600 960 640 L960 1500 Q700 1460 540 1500 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
    </Ink>
    <clipPath id="bpage"><rect x={130} y={660} width={820} height={820} /></clipPath>
    <g clipPath="url(#bpage)">
      {Array.from({ length: 40 }, (_, i) => {
        const y = 680 + ((i * 40 - scroll) % 1600 + 1600) % 1600;
        const len = 120 + random(`ln${i}`) * 200;
        return <g key={i}><path d={`M170 ${y} L${170 + len} ${y}`} stroke="#F2F2F2" strokeWidth={5} opacity={0.5} /><path d={`M580 ${y + 20} L${580 + len} ${y + 20}`} stroke="#F2F2F2" strokeWidth={5} opacity={0.5} /></g>;
      })}
    </g>
    <rect x={576} y={1036} width={150} height={36} fill="none" stroke={RED} strokeWidth={6} opacity={mark} />
    <path d="M590 1054 L700 1054" stroke={RED} strokeWidth={8} opacity={mark} />
    <text x={540} y={560} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={88} fill="#F2F2F2" opacity={ip(t, [0.2, 0.4], [0, 1]) * (1 - mark)}>{Math.round(ip(t, [0.2, at("dos")], [31102, 1])).toLocaleString("es")}</text>
    <Serif txt="VERSÍCULOS" y={1620} size={52} o={ip(t, [0.2, 0.4], [0, 0.8]) * (1 - mark)} ls={14} />
  </g>
);

// ---------- escenas ----------
// 1 · gancho: 31.102 versículos corren… y queda uno solo
const C1: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("biblia"), 1.15, 50, 52, -2], [at("dos"), 1.6, 60, 55, 2]]}>
    {(t) => <Bible t={t} t0={t0} scroll={Math.min(t, at("dos")) * 1400} mark={ip(t, [at("dos"), at("dos") + 0.15], [0, 1])} />}
  </Shot>
);
// 2 · no habla de poder: el rayo se vuelve gota
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("poder"), 1.3, 50, 48, -2], [at("lágrimas"), 1.5, 50, 52, 2]]}>
    {(t) => {
      const melt = eo(ip(t, [at("habla", 1), at("lágrimas") + 0.1], [0, 1]));
      return (
        <>
          <Ink><g opacity={1 - melt} transform={`translate(540 1000) scale(${1 - melt * 0.6})`}><path d="M40 -380 L-140 40 L-10 40 L-60 380 L150 -60 L20 -60 L90 -380 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={10} /><path d="M40 -380 L-140 40 L-10 40 Z" fill="url(#h1)" opacity={0.6} /></g></Ink>
          {melt > 0 ? <Drop x={540} y={1000 + melt * 80} r={20 + melt * 70} o={melt} /> : null}
        </>
      );
    }}
  </Shot>
);
// 3 · Jesús lloró: el rostro y la lágrima roja
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("jesús"), 1.3, 46, 52], [at("lloró"), 1.9, 40, 52, -2]]}>
    {(t) => {
      const k = ip(t, [at("lloró"), at("lloró") + 0.5], [0, 1]);
      return <><Face p={eo(ip(t, [t0, t0 + 0.4], [0.3, 1]))} s={1.1} />{k > 0 ? <Drop x={452} y={1000 + k * 150} r={16} /> : null}</>;
    }}
  </Shot>
);
// 4 · la tumba de Lázaro en Betania
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("tumba"), 1.3, 62, 55, 2], [at("lázaro"), 1.0, 50, 58]]}>
    {(t) => (
      <>
        <Ink>
          <path d="M-20 1500 Q200 760 640 800 Q1000 820 1100 1100 L1100 1500 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          <path d="M-20 1500 Q200 760 640 800 Q1000 820 1100 1100 L1100 1500 Z" fill="url(#h2)" opacity={0.2} />
          <path d="M560 1500 L560 1150 Q680 1040 800 1150 L800 1500 Z" fill="#000" stroke="#F2F2F2" strokeWidth={6} />
        </Ink>
        <Stone x={760} y={1340} r={170} seed="tomb" />
        <Ground y={1500} />
        <Robe x={260} y={1500} s={0.9} />
        <Serif txt="BETANIA" y={640} size={70} o={ip(t, [t0 + 0.1, t0 + 0.25], [0, 0.85])} ls={14} />
      </>
    )}
  </Shot>
);
// 5 · pero aquí está lo increíble: golpe a la piedra
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.6, 70, 70], [at("increíble"), 2.2, 70, 70, 3]]}>
    {() => <><Ink><path d="M560 1500 L560 1150 Q680 1040 800 1150 L800 1500 Z" fill="#000" stroke="#F2F2F2" strokeWidth={6} /></Ink><Stone x={760} y={1340} r={170} seed="tomb" /><Ground y={1500} /></>}
  </Shot>
);
// 6 · ya sabía: el reloj corre; «unos minutos»
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("minutos"), 1.3, 50, 48, -2], [at("resucitar"), 1.0, 50, 50]]}>
    {(t) => {
      const a = (t - t0) * 720;
      return (
        <>
          <Ink><circle cx={540} cy={1000} r={330} fill="#050505" stroke="#F2F2F2" strokeWidth={12} />{Array.from({ length: 12 }, (_, i) => { const r = (i / 12) * Math.PI * 2; return <path key={i} d={`M${540 + Math.cos(r) * 280} ${1000 + Math.sin(r) * 280} L${540 + Math.cos(r) * 310} ${1000 + Math.sin(r) * 310}`} stroke="#F2F2F2" strokeWidth={8} />; })}</Ink>
          <path d={`M540 1000 L${540 + Math.cos(((a - 90) * Math.PI) / 180) * 250} ${1000 + Math.sin(((a - 90) * Math.PI) / 180) * 250}`} stroke="#F2F2F2" strokeWidth={10} strokeLinecap="round" />
          <path d={`M540 1000 L${540 + Math.cos(((a / 12 - 90) * Math.PI) / 180) * 160} ${1000 + Math.sin(((a / 12 - 90) * Math.PI) / 180) * 160}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          <circle cx={540} cy={1000} r={16} fill="#F2F2F2" />
        </>
      );
    }}
  </Shot>
);
// 7 · lo había dicho: Lázaro envuelto, dormido · JUAN 11:11
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 55], [at("despertarlo"), 1.35, 45, 55, 2]]}>
    {(t) => (
      <>
        <Ink>
          <path d="M220 1200 Q240 1120 330 1120 L860 1130 Q900 1160 860 1200 L330 1215 Q240 1220 220 1200 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${330 + i * 55} 1122 L${300 + i * 55} 1214`} stroke="#F2F2F2" strokeWidth={4} />)}
          <ellipse cx={270} cy={1165} rx={60} ry={48} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
        </Ink>
        <path d="M120 1240 L960 1240" stroke="#F2F2F2" strokeWidth={6} />
        <Serif txt="JUAN 11:11" y={820} size={80} o={ip(t, [t0 + 0.1, t0 + 0.25], [0, 0.9])} ls={8} />
        {[0, 1, 2].map((i) => <text key={i} x={330 + i * 70 + Math.sin(t * 2 + i) * 6} y={1060 - i * 60 - ((t * 60) % 40)} fontFamily="Georgia, serif" fontWeight={700} fontSize={50 + i * 12} fill="#F2F2F2" opacity={0.6}>z</text>)}
      </>
    )}
  </Shot>
);
// 8 · y aun así, lloró: primerísimo plano, la lágrima cae lenta
const C8: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 2.2, 42, 52], [at("lloró", 2), 2.7, 40, 55]]}>
    {(t) => { const k = ip(t, [at("lloró", 2), at("lloró", 2) + 0.9], [0, 1]); return <><Face p={1} s={1.1} /><Drop x={452} y={1000 + k * 120} r={16 + k * 4} /></>; }}
  </Shot>
);
// 9 · primero lo siente contigo: Él a tu lado, de rodillas contigo
const C9: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 60], [at("dolor"), 1.3, 45, 62, -2], [at("contigo"), 1.0, 50, 60]]}>
    {(t) => {
      const near = eo(ip(t, [t0, at("contigo")], [0, 1]));
      return (
        <>
          <circle cx={540} cy={1180} r={360} fill={`rgba(242,242,242,${0.08 + 0.1 * near})`} style={{ filter: "blur(30px)" }} />
          <Ground y={1500} />
          <g filter="url(#ink)" stroke="#F2F2F2" strokeWidth={5}><Kneel x={620} y={1480} s={1.3} color="#050505" /></g>
          <Robe x={260 + near * 150} y={1500} s={1.15} />
        </>
      );
    }}
  </Shot>
);
// 10 · la silla vacía en la mesa de Navidad
const C10: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("navidad"), 1.25, 50, 45, -2], [at("silla"), 1.6, 72, 56, 2], [at("mesa"), 1.1, 55, 52]]}>
    {(t) => {
      const fl = 1 + Math.sin(t * 17) * 0.08 + Math.sin(t * 7) * 0.05;
      const chair = (x: number, empty: boolean) => (
        <g key={x}><Ink><path d={`M${x - 60} 1500 L${x - 60} 1180 M${x + 60} 1500 L${x + 60} 1180 M${x - 60} 1180 L${x + 60} 1180 L${x + 60} 1300 L${x - 60} 1300`} stroke="#F2F2F2" strokeWidth={8} fill="none" /></Ink>{!empty ? <Robe x={x} y={1310} s={0.5} hood={x < 540} /> : <rect x={x - 70} y={1170} width={140} height={340} fill="rgba(242,242,242,0.06)" style={{ filter: "blur(8px)" }} />}</g>
      );
      return (
        <>
          <Ink><rect x={700} y={620} width={260} height={320} fill="#050505" stroke="#F2F2F2" strokeWidth={7} /><path d="M830 620 L830 940 M700 780 L960 780" stroke="#F2F2F2" strokeWidth={5} /></Ink>
          <Star x={880} y={690} r={34} />
          {chair(220, false)}{chair(440, false)}{chair(860, true)}
          <Ink><rect x={120} y={1260} width={900} height={40} fill="#050505" stroke="#F2F2F2" strokeWidth={7} /><path d="M180 1300 L180 1520 M960 1300 L960 1520" stroke="#F2F2F2" strokeWidth={10} /></Ink>
          <rect x={565} y={1150} width={30} height={110} fill="#F2F2F2" />
          <ellipse cx={580} cy={1125 - fl * 4} rx={16 * fl} ry={34 * fl} fill="#F2E6C8" style={{ filter: "drop-shadow(0 0 30px rgba(255,230,170,0.9))" }} />
        </>
      );
    }}
  </Shot>
);
// 11 · porque…: vuelve la Biblia del inicio (bucle)
const C11: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.15, 1.0])})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><Bible t={0.1} t0={0} scroll={t * 300} mark={0} /></svg>
    </AbsoluteFill>
  );
};
// portada: el rostro con la lágrima roja · ¿POR QUÉ LLORÓ?
const Cover: React.FC = () => (
  <AbsoluteFill style={{ transform: "scale(1.15)", transformOrigin: "45% 55%" }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <Face p={1} s={1.1} /><Drop x={452} y={1080} r={18} />
      <Serif txt="¿POR QUÉ" y={520} size={120} />
      <BigRed txt="LLORÓ?" y={690} p={1} size={180} />
    </svg>
  </AbsoluteFill>
);

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("y"), C2], [at("juan"), C3], [at("lloró", 1), C4], [at("pero"), C5], [at("jesús", 1), C6], [at("lo", 2), C7], [at("y", 1), C8], [at("porque"), C9], [at("mándaselo"), C10], [at("porque", 1), C11],
];
const SFX: [number, string, number][] = [[at("dos") - 0.05, "sfx/tick.wav", 0.35], [at("lloró") - 0.05, "sangre/gota.wav", 0.4], [at("lloró", 2) + 0.4, "sangre/gota.wav", 0.35]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Lazaro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 16 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 16 * kick}px) scale(${1 + 0.05 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><Cover /></AbsoluteFill> : null}
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
      <Audio src={staticFile("lazaro/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
