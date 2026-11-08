import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/reyes/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Ground, Robe } from "../adultera/Dark";
import { Manger, Shot, Star } from "../navidad/Main";

// ZK Dark · "Los Reyes Magos no eran tres" (Mt 2:1, 2:11, 2:16). Bucle: vuelven las tres coronas.
const TH = 0.1;
const END = 27.75;
export const REYES_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["tres", "reyes", "cuántos", "magos", "oriente", "regalos", "oro", "incienso", "mirra", "siglos", "pesebre", "casa", "niño", "meses", "encontraron"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => <circle cx={x} cy={y} r={r} fill={`rgba(242,242,242,${0.16 * o})`} style={{ filter: "blur(40px)" }} />;

const Crown: React.FC<{ x: number; y: number; s: number; fall?: number }> = ({ x, y, s, fall = 0 }) => (
  <g transform={`translate(${x + fall * 60} ${y + fall * fall * 900}) rotate(${fall * 120}) scale(${s})`} opacity={1 - fall * 0.6}>
    <Ink><path d="M-60 0 L-70 -70 L-35 -35 L0 -85 L35 -35 L70 -70 L60 0 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /><rect x={-60} y={-6} width={120} height={18} fill="url(#h1)" stroke="#F2F2F2" strokeWidth={5} /></Ink>
  </g>
);
const King: React.FC<{ x: number; s: number; fall: number; o?: number }> = ({ x, s, fall, o = 1 }) => (
  <g opacity={o}><Robe x={x} y={1500} s={s} /><Crown x={x} y={1500 - 470 * s} s={s * 0.9} fall={fall} /></g>
);

// 1 · gancho: tres reyes; las coronas caen en "reyes"
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const fall = frozen !== undefined ? 0 : ip(t, [at("reyes", 1) - 0.05, at("reyes", 1) + 0.6], [0, 1]);
  const doubt = frozen !== undefined ? 0 : ip(t, [at("tres") - 0.05, at("tres") + 0.2], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 2.8], [1.0, 1.1])})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={520} r={260} o={1} />
        <Star x={540} y={520} r={70 + Math.sin(t * 6) * 5} />
        <Ground y={1500} />
        {[300, 540, 780].map((x, i) => <King key={i} x={x} s={i === 1 ? 0.85 : 0.75} fall={ip(fall, [i * 0.15, i * 0.15 + 0.6], [0, 1])} o={i === 1 ? 1 : 1 - doubt * 0.65} />)}
        {frozen !== undefined ? <><Serif txt="¿DE VERDAD" y={1660} size={96} ls={4} /><Serif txt="ERAN TRES?" y={1780} size={96} ls={4} /></> : null}
      </svg>
    </AbsoluteFill>
  );
};
// 2 · la Biblia nunca dice cuántos: libro abierto, el número tachado
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("cuántos"), 1.3, 50, 48, -2]]}>
    {(t) => (
      <>
        <Ink>
          <path d="M540 760 Q380 720 160 760 L160 1360 Q380 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          <path d="M540 760 Q700 720 920 760 L920 1360 Q700 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M200 ${830 + i * 60} L500 ${830 + i * 60} M580 ${830 + i * 60} L880 ${830 + i * 60}`} stroke="#F2F2F2" strokeWidth={4} opacity={0.5} />)}
        </Ink>
        <text x={540} y={1180} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={300} fill="#F2F2F2" opacity={ip(t, [at("cuántos") - 0.1, at("cuántos") + 0.1], [0, 0.9])}>3</text>
        <Brush d="M380 1180 L720 940" p={eo(ip(t, [at("fueron"), at("fueron") + 0.3], [0, 1]))} w={70} len={450} />
      </>
    )}
  </Shot>
);
// 3 · magos del oriente: la estrella al este y una caravana sin número
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("magos", 1), 1.25, 30, 60, 2], [at("oriente"), 1.0, 70, 40]]}>
    {(t) => {
      const walk = (t - t0) * 40;
      return (
        <>
          <Glow x={880} y={500} r={240} o={1} />
          <Star x={880} y={500} r={60 + Math.sin(t * 6) * 5} />
          <Ink><path d="M-20 1420 Q300 1330 600 1400 Q860 1460 1100 1380 L1100 1920 L-20 1920 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink>
          {Array.from({ length: 7 }, (_, i) => <Robe key={i} x={80 + i * 120 + walk} y={1420 - (i % 2) * 12} s={0.42} hood={i % 2 === 0} o={ip(i, [0, 6], [1, 0.45])} />)}
          <Serif txt="MATEO 2:1" y={1680} size={60} o={ip(t, [t0 + 0.2, t0 + 0.4], [0, 0.85])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 4 · tres regalos ≠ tres personas: cofre, incensario y frasco aparecen en su palabra
const Gift: React.FC<{ k: number; x: number; p: number; t: number }> = ({ k, x, p, t }) => (
  <g transform={`translate(${x} 1080) scale(${0.5 + p * 0.5})`} opacity={p}>
    <Ink>
      {k === 0 ? <><rect x={-90} y={-60} width={180} height={120} fill="#050505" stroke="#F2F2F2" strokeWidth={7} /><path d="M-90 -60 Q0 -130 90 -60" fill="url(#h1)" stroke="#F2F2F2" strokeWidth={7} /><rect x={-12} y={-30} width={24} height={30} fill={RED} /></> : null}
      {k === 1 ? <><path d="M-60 60 L60 60 L40 -20 L-40 -20 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />{[0, 1, 2].map((i) => <path key={i} d={`M${-20 + i * 20} -30 q${20 * Math.sin(t * 3 + i)} -60 0 -120`} stroke="#F2F2F2" strokeWidth={5} fill="none" opacity={0.7} />)}</> : null}
      {k === 2 ? <><path d="M-30 -100 L30 -100 L30 -60 Q80 -20 70 60 L-70 60 Q-80 -20 -30 -60 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} /><path d="M-60 20 L60 20 L65 60 L-65 60 Z" fill="url(#h2)" /></> : null}
    </Ink>
  </g>
);
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("oro"), 1.3, 22, 56, -2], [at("incienso"), 1.3, 50, 56], [at("mirra"), 1.3, 78, 56, 2]]}>
    {(t) => (
      <>
        <Glow x={540} y={1080} r={420} o={1} />
        {[["oro", 230], ["incienso", 540], ["mirra", 850]].map(([w, x], k) => <Gift key={k} k={k} x={x as number} t={t} p={eo(ip(t, [at(w as string) - 0.1, at(w as string) + 0.15], [0, 1]))} />)}
        <Serif txt="3 REGALOS ≠ 3 PERSONAS" y={1460} size={64} o={ip(t, [at("mirra") + 0.2, at("mirra") + 0.4], [0, 0.95])} ls={3} />
      </>
    )}
  </Shot>
);
// 5 · los nombres llegaron siglos después: etiquetas que se sellan "SIGLO VI"
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("siglos"), 1.25, 50, 52, 2]]}>
    {(t) => (
      <>
        {[["melchor", "MELCHOR", 760], ["gaspar", "GASPAR", 950], ["baltasar", "BALTASAR", 1140]].map(([w, n, y], i) => (
          <g key={i} opacity={ip(t, [at(w as string) - 0.1, at(w as string) + 0.1], [0, 1])}>
            <Ink><rect x={250} y={(y as number) - 90} width={580} height={130} rx={14} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink>
            <text x={540} y={(y as number) + 2} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={84} fill="#F2F2F2" letterSpacing={6}>{n}</text>
          </g>
        ))}
        <g transform={`translate(540 1420) rotate(-8) scale(${ip(t, [at("siglos"), at("siglos") + 0.15], [1.6, 1])})`} opacity={ip(t, [at("siglos"), at("siglos") + 0.1], [0, 1])} filter="url(#brushH)">
          <rect x={-260} y={-90} width={520} height={160} fill="none" stroke={RED} strokeWidth={14} />
          <text x={0} y={30} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={110} fill={RED}>SIGLO VI</text>
        </g>
      </>
    )}
  </Shot>
);
// 6 · nunca llegaron al pesebre: el pesebre tachado
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 60], [at("nunca", 1), 1.3, 50, 72, -2]]}>
    {(t) => (
      <>
        <Glow x={540} y={1300} r={360} o={1} />
        <Ground y={1560} />
        <Manger x={540} y={1570} s={1.3} glow={1} />
        <Brush d="M200 1100 L880 1520" p={eo(ip(t, [at("pesebre") - 0.05, at("pesebre") + 0.3], [0, 1]))} w={60} len={820} />
        <Brush d="M880 1100 L200 1520" p={eo(ip(t, [at("pesebre") + 0.2, at("pesebre") + 0.5], [0, 1]))} w={60} len={820} />
      </>
    )}
  </Shot>
);
// 7 · entraron en una casa y vieron al niño (Mt 2:11)
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("casa"), 1.3, 50, 58, 2], [at("niño"), 1.6, 50, 64]]}>
    {(t) => {
      const lit = ip(t, [at("casa") - 0.2, at("niño")], [0.3, 1]);
      return (
        <>
          <Glow x={540} y={440} r={220} o={1} />
          <Star x={540} y={440} r={60} />
          <path d="M540 440 L420 900 L660 900 Z" fill="rgba(242,242,242,0.1)" />
          <Ink>
            <path d="M260 1500 L260 1050 L540 840 L820 1050 L820 1500 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={8} />
            <path d="M260 1050 L540 840 L820 1050" fill="url(#h1)" opacity={0.4} />
            <rect x={470} y={1300} width={140} height={200} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
          </Ink>
          <rect x={360} y={1120} width={150} height={120} fill={`rgba(242,232,200,${lit})`} style={{ filter: `drop-shadow(0 0 ${30 * lit}px #fff)` }} />
          <rect x={570} y={1120} width={150} height={120} fill={`rgba(242,232,200,${lit})`} style={{ filter: `drop-shadow(0 0 ${30 * lit}px #fff)` }} />
          <Ground y={1500} />
          <Serif txt="MATEO 2:11" y={1700} size={60} o={ip(t, [at("casa"), at("casa") + 0.2], [0, 0.9])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 8 · buscaron por meses: lunas que pasan sobre el camino (Mt 2:16)
const C8: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("meses"), 1.25, 50, 40, -2], [at("encontraron"), 1.0, 50, 55]]}>
    {(t) => {
      const ph = ip(t, [t0, at("encontraron")], [0, 1]);
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => { const k = ip(ph, [i / 6, i / 6 + 0.25], [0, 1]); return <g key={i} opacity={k}><Ink><circle cx={160 + i * 152} cy={620} r={46} fill="#050505" stroke="#F2F2F2" strokeWidth={5} /><circle cx={160 + i * 152 + 46 - i * 15} cy={620} r={46} fill="#050505" opacity={i === 2 ? 0 : 1} /></Ink></g>; })}
          <Ink><path d="M540 1920 L480 1100 L600 1100 Z" fill="url(#h2)" opacity={0.4} /><path d="M-20 1100 L1100 1100" stroke="#F2F2F2" strokeWidth={5} /></Ink>
          {Array.from({ length: 3 }, (_, i) => <Robe key={i} x={480 + i * 60} y={1100 + 160 - ph * 140} s={0.3 + (1 - ph) * 0.15} hood />)}
          <Glow x={540} y={1000} r={200} o={ip(t, [at("encontraron"), at("encontraron") + 0.4], [0, 1.5])} />
          <Serif txt="MATEO 2:16" y={1680} size={56} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.8])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 9 · bucle: vuelven los tres reyes
const C9: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.25, 1.0])})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={520} r={260} o={1} />
        <Star x={540} y={520} r={70 + Math.sin(t * 6) * 5} />
        <Ground y={1500} />
        {[300, 540, 780].map((x, i) => <King key={i} x={x} s={i === 1 ? 0.85 : 0.75} fall={0} />)}
      </svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("la"), C2], [at("mateo"), C3], [at("lo"), C4], [at("y", 2), C5], [at("pero"), C6], [at("mateo", 1), C7], [at("buscaron"), C8], [at("mándaselo"), C9],
];
const SFX: [number, string, number][] = [[at("reyes", 1) - 0.05, "sfx/impact.wav", 0.35], [at("siglos") - 0.05, "sfx/impact.wav", 0.3], [at("pesebre") - 0.05, "sfx/impact.wav", 0.35]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Reyes: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 16 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 16 * kick}px) scale(${1 + 0.05 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={2} /></AbsoluteFill> : null}
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
      <Audio src={staticFile("reyes/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
