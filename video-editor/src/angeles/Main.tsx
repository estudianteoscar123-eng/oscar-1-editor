import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/angeles/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Ground } from "../adultera/Dark";
import { Shot } from "../navidad/Main";
import { Kneel } from "../sangre/Main";

// ZK Dark · "Los ángeles reales de la Biblia" (Ez 1, Is 6, Lc 1–2). Ruedas de ojos, cuatro caras, seis alas. Bucle a las ruedas.
const TH = 0.1;
const END = 28.25;
export const ANGELES_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["ángel", "verdad", "corriendo", "bebés", "cuatro", "caras", "ruedas", "ojos", "seis", "alas", "cara", "temas", "poderoso", "miedo"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;

// ojo grabado que se abre (o: 0 cerrado, 1 abierto); el iris mira hacia (lx, ly)
const Eye: React.FC<{ x: number; y: number; r: number; o: number; rot?: number; red?: boolean; lx?: number; ly?: number }> = ({ x, y, r, o, rot = 0, red, lx = 0, ly = 0 }) => {
  const h = r * 0.62 * o;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M${-r} 0 Q0 ${-h * 1.6} ${r} 0 Q0 ${h * 1.6} ${-r} 0 Z`} fill="#050505" stroke="#F2F2F2" strokeWidth={Math.max(2, r / 7)} />
      {o > 0.15 ? <>
        <circle cx={lx * r * 0.3} cy={ly * r * 0.2} r={r * 0.42 * Math.min(1, o * 1.3)} fill={red ? RED : "#F2F2F2"} />
        <circle cx={lx * r * 0.3} cy={ly * r * 0.2} r={r * 0.18 * Math.min(1, o * 1.3)} fill="#050505" />
      </> : null}
    </g>
  );
};
// rueda con ojos en el aro (ofanim)
const Wheel: React.FC<{ cx: number; cy: number; r: number; spin: number; tilt: number; open: number; n?: number; red?: number }> = ({ cx, cy, r, spin, tilt, open, n = 12, red = -1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(1 ${Math.cos(tilt)})`}>
    <Ink>
      <circle r={r} fill="none" stroke="#F2F2F2" strokeWidth={10} />
      <circle r={r * 0.86} fill="none" stroke="url(#h1)" strokeWidth={r * 0.1} opacity={0.6} />
    </Ink>
    {Array.from({ length: n }, (_, i) => {
      const a = spin + (i / n) * Math.PI * 2;
      const o = ip(open, [i / n * 0.6, i / n * 0.6 + 0.4], [0, 1]);
      return <Eye key={i} x={Math.cos(a) * r * 0.93} y={Math.sin(a) * r * 0.93} r={r * 0.11} o={o} rot={(a * 180) / Math.PI + 90} red={i === red} />;
    })}
  </g>
);
// ala de plumas grabadas
const Wing: React.FC<{ x: number; y: number; s: number; rot: number; flip?: boolean; open?: number }> = ({ x, y, s, rot, flip, open = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot * open}) scale(${flip ? -s : s} ${s})`}>
    <Ink>
      <path d="M0 0 Q160 -220 420 -260 Q360 -180 400 -120 Q300 -100 330 -30 Q220 -20 240 40 Q120 30 0 0 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
      <path d="M0 0 Q160 -220 420 -260 Q360 -180 400 -120 Q300 -100 330 -30 Q220 -20 240 40 Q120 30 0 0 Z" fill="url(#h2)" opacity={0.4} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 30} ${-10 - i * 30} Q${160 + i * 40} ${-120 - i * 30} ${330 + i * 20} ${-150 - i * 25}`} stroke="#F2F2F2" strokeWidth={3} fill="none" opacity={0.7} />)}
    </Ink>
  </g>
);
const Glow: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => <circle cx={x} cy={y} r={r} fill={`rgba(242,242,242,${0.16 * o})`} style={{ filter: "blur(40px)" }} />;

// ---------- escenas ----------
// 1 · gancho: ruedas dentro de ruedas girando; los ojos se abren de golpe en "verdad"
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const open = frozen !== undefined ? 1 : ip(t, [at("verdad") - 0.15, at("verdad") + 0.35], [0, 1]);
  const z = frozen !== undefined ? 1 : t < at("saldrías") ? ip(t, [0, at("saldrías")], [1.0, 1.08]) : 1.25;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={980} r={480} o={open} />
        <Wheel cx={540} cy={980} r={380} spin={t * 0.6} tilt={0.9} open={open} n={14} red={3} />
        <g transform="rotate(70 540 980)"><Wheel cx={540} cy={980} r={340} spin={-t * 0.8} tilt={1.0} open={open} n={12} /></g>
        <Eye x={540} y={980} r={110} o={ip(t, [at("corriendo") - 0.1, at("corriendo") + 0.15], [frozen !== undefined ? 1 : 0, 1])} red lx={Math.sin(t * 2) * 0.5} />
        {frozen !== undefined ? <><Serif txt="¿ASÍ SON" y={520} size={120} ls={6} /><Serif txt="LOS ÁNGELES?" y={1560} size={110} ls={4} /></> : null}
      </svg>
    </AbsoluteFill>
  );
};
// 2 · el angelito de postal, tachado en rojo
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("bebés"), 1.35, 50, 48, -2]]}>
    {(t) => (
      <>
        <g transform={`translate(0 ${Math.sin(t * 3) * 10})`}>
          <Wing x={520} y={980} s={0.55} rot={-10} flip />
          <Wing x={560} y={980} s={0.55} rot={10} />
          <Ink><circle cx={540} cy={900} r={90} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><path d="M450 1000 Q540 1180 630 1000 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><path d="M500 905 q10 10 20 0 M560 905 q10 10 20 0 M515 940 q25 18 50 0" stroke="#F2F2F2" strokeWidth={5} fill="none" /></Ink>
          <ellipse cx={540} cy={790} rx={80} ry={18} fill="none" stroke="#F2F2F2" strokeWidth={6} />
        </g>
        <Brush d="M160 760 L920 1240" p={eo(ip(t, [at("bebés"), at("alas")], [0, 1]))} w={60} len={950} />
        <Brush d="M920 760 L160 1240" p={eo(ip(t, [at("alas") - 0.05, at("alas") + 0.3], [0, 1]))} w={60} len={950} />
      </>
    )}
  </Shot>
);
// 3 · cuatro caras: hombre, león, buey, águila (Ez 1:10)
const Face4: React.FC<{ k: number; x: number; y: number; p: number }> = ({ k, x, y, p }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + p * 0.4})`} opacity={p}>
    <Ink>
      <circle r={120} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
      {k === 0 ? <><path d="M-45 -15 q15 -12 30 0 M15 -15 q15 -12 30 0" stroke="#F2F2F2" strokeWidth={6} fill="none" /><path d="M0 0 L-10 40 L10 42 M-30 70 q30 14 60 0" stroke="#F2F2F2" strokeWidth={5} fill="none" /></> : null}
      {k === 1 ? <>{Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 110} ${Math.sin(a) * 110} L${Math.cos(a) * 170} ${Math.sin(a) * 170}`} stroke="#F2F2F2" strokeWidth={8} />; })}<path d="M-40 -10 l20 0 M20 -10 l20 0 M0 10 L-20 50 L20 50 Z" stroke="#F2F2F2" strokeWidth={6} fill="#050505" /></> : null}
      {k === 2 ? <><path d="M-110 -70 Q-200 -140 -150 -200 M110 -70 Q200 -140 150 -200" stroke="#F2F2F2" strokeWidth={14} fill="none" /><ellipse cx={0} cy={60} rx={60} ry={40} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><circle cx={-20} cy={60} r={8} fill="#F2F2F2" /><circle cx={20} cy={60} r={8} fill="#F2F2F2" /></> : null}
      {k === 3 ? <><path d="M10 -10 Q120 0 60 80 Q40 30 10 30 Z" fill="#F2F2F2" /><circle cx={-30} cy={-30} r={14} fill="#F2F2F2" /><circle cx={-30} cy={-30} r={6} fill="#050505" /></> : null}
    </Ink>
  </g>
);
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("hombre"), 1.25, 30, 42], [at("león"), 1.25, 70, 42, 2], [at("buey"), 1.25, 30, 62, -2], [at("águila"), 1.25, 70, 62], [at("y", 1), 1.0, 50, 52]]}>
    {(t) => (
      <>
        <Glow x={540} y={1000} r={420} o={1} />
        <Ink><circle cx={540} cy={1000} r={60} fill={RED} /></Ink>
        {[["hombre", 330, 800], ["león", 750, 800], ["buey", 330, 1220], ["águila", 750, 1220]].map(([w, x, y], k) => <Face4 key={k} k={k} x={x as number} y={y as number} p={eo(ip(t, [at(w as string) - 0.1, at(w as string) + 0.15], [0, 1]))} />)}
        <Serif txt="EZEQUIEL 1:10" y={1560} size={62} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.85])} ls={8} />
      </>
    )}
  </Shot>
);
// 4 · ruedas dentro de ruedas: giroscopio que se abre lleno de ojos (Ez 1:18)
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("ruedas", 1), 1.3, 50, 50, 3], [at("ojos"), 1.65, 50, 50, -3]]}>
    {(t) => {
      const open = ip(t, [at("ojos") - 0.3, at("ojos") + 0.3], [0, 1]);
      return (
        <>
          <Glow x={540} y={1000} r={500} o={open} />
          {[0, 1, 2].map((k) => <g key={k} transform={`rotate(${k * 60 + t * 20} 540 1000)`}><Wheel cx={540} cy={1000} r={330 - k * 40} spin={t * (0.7 + k * 0.3) * (k % 2 ? -1 : 1)} tilt={1.1 + Math.sin(t + k) * 0.2} open={open} n={10} red={k === 1 ? 2 : -1} /></g>)}
          <Serif txt="EZEQUIEL 1:18" y={1560} size={62} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.85])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 5 · serafín de seis alas: dos cubren el rostro (Is 6:2)
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("seis"), 1.2, 50, 45, 2], [at("cara"), 1.55, 50, 40]]}>
    {(t) => {
      const cover = eo(ip(t, [at("tapaban") - 0.2, at("cara")], [0, 1]));
      const flap = Math.sin(t * 6) * 6;
      return (
        <>
          <Glow x={540} y={980} r={480} o={1} />
          <Wing x={510} y={1180} s={1.0} rot={20 + flap} flip />
          <Wing x={570} y={1180} s={1.0} rot={-20 - flap} />
          <Wing x={510} y={1000} s={1.05} rot={-15 - flap} flip />
          <Wing x={570} y={1000} s={1.05} rot={15 + flap} />
          <Ink><path d="M470 860 L610 860 L640 1300 L440 1300 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><circle cx={540} cy={790} r={80} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink>
          <path d="M520 560 Q540 500 560 560 Q600 620 540 650 Q480 620 520 560 Z" fill={RED} opacity={0.85} style={{ filter: "blur(2px)" }} />
          <g opacity={cover}>
            <Wing x={540} y={830} s={0.6 * cover + 0.01} rot={-60} flip />
            <Wing x={540} y={830} s={0.6 * cover + 0.01} rot={60} />
          </g>
          <Serif txt="ISAÍAS 6:2" y={1560} size={62} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.85])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 6 · "no temas": la luz inmensa frente a una persona de rodillas (Lc 1:30)
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("ángel", 1), 1.3, 50, 40, -2], [at("no", 1), 1.0, 50, 60], [at("temas"), 1.4, 40, 72, 2]]}>
    {(t) => {
      const calm = ip(t, [at("no", 1), at("temas") + 0.6], [0, 1]);
      return (
        <>
          <Glow x={540} y={720} r={560 - calm * 140} o={1.6 - calm * 0.6} />
          {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2 + t * 0.2; return <Draw key={i} d={`M${540 + Math.cos(a) * 260} ${720 + Math.sin(a) * 260} L${540 + Math.cos(a) * (520 - calm * 120)} ${720 + Math.sin(a) * (520 - calm * 120)}`} p={1} w={4} />; })}
          <Wheel cx={540} cy={720} r={200} spin={t * 0.8} tilt={0.7} open={1 - calm * 0.7} n={10} />
          <Ground y={1560} />
          <g filter="url(#ink)" stroke="#F2F2F2" strokeWidth={5}><Kneel x={460} y={1550} s={1.2} color="#050505" /></g>
          <Serif txt="LUCAS 1:30" y={1720} size={56} o={ip(t, [at("temas"), at("temas") + 0.2], [0, 0.85])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 7 · lo más poderoso del cielo te cubre: alas que abrazan, luz cálida
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 55], [at("cielo"), 1.2, 50, 52, 2], [at("miedo"), 1.35, 50, 62]]}>
    {(t) => {
      const wrap = eo(ip(t, [t0, at("miedo")], [0, 1]));
      return (
        <>
          <Glow x={540} y={1150} r={520} o={0.6 + wrap * 0.6} />
          <Ground y={1560} />
          <Wing x={420} y={1250} s={1.1} rot={-30 + wrap * 50} flip open={1} />
          <Wing x={660} y={1250} s={1.1} rot={30 - wrap * 50} open={1} />
          <g filter="url(#ink)" stroke="#F2F2F2" strokeWidth={5}><Kneel x={470} y={1550} s={1.2} color="#050505" /></g>
        </>
      );
    }}
  </Shot>
);
// 8 · bucle: vuelven las ruedas; los ojos se cierran justo antes del inicio
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  const close = ip(t, [t0, END - 0.2], [1, 0]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.3, 1.0])})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={980} r={480} o={close} />
        <Wheel cx={540} cy={980} r={380} spin={t * 0.6} tilt={0.9} open={close} n={14} red={3} />
        <g transform="rotate(70 540 980)"><Wheel cx={540} cy={980} r={340} spin={-t * 0.8} tilt={1.0} open={close} n={12} /></g>
        <Eye x={540} y={980} r={110} o={close} red />
      </svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("porque"), C2], [at("ezequiel"), C3], [at("y", 1), C4], [at("isaías"), C5], [at("por"), C6], [at("porque", 1), C7], [at("mándaselo"), C8],
];
const SFX: [number, string, number][] = [[at("verdad") - 0.1, "sfx/impact.wav", 0.4], [at("ojos") - 0.1, "sfx/shimmer.wav", 0.3], [at("temas") - 0.1, "sfx/shimmer.wav", 0.3]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Angeles: React.FC = () => {
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
      <Audio src={staticFile("angeles/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
