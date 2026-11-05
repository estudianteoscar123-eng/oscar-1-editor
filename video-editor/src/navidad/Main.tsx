import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/navidad/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Ground, Robe, Stone } from "../adultera/Dark";

// ZK Dark · "Jesús no nació en diciembre" (Lucas 2:8). Ritmo rápido: un encuadre cada ~0,7 s. Bucle: el final vuelve al calendario.
const TH = 0.1;
const END = 28.03;
export const NAVIDAD_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["diciembre", "biblia", "pista", "pastores", "ovejas", "frío", "25", "300", "fecha", "dios", "dónde", "comedero", "nadie", "él", "mándaselo"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{children}</svg>;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;

// encuadres dentro de una escena: [tiempo, escala, origen x %, origen y %, giro]
type Cut = [number, number, number, number, number?];
const Shot: React.FC<{ t0: number; cuts: Cut[]; kind: number; children: (t: number) => React.ReactNode }> = ({ t0, cuts, kind, children }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  const c = cuts.filter((k) => k[0] <= t).pop() ?? [t0, 1, 50, 50, 0];
  const since = t - c[0];
  const entry = ip(f, [0, 5], [1, 0]);
  const drift = 1 + since * 0.035;
  const whip = kind % 2 === 0;
  return (
    <AbsoluteFill style={{ transform: `${whip ? `translateX(${entry * 340}px)` : ""} scale(${c[1] * drift * (whip ? 1 : 1 + entry * 0.7)}) rotate(${(c[4] ?? 0) + Math.sin(t * 1.3) * 0.6}deg)`, transformOrigin: `${c[2]}% ${c[3]}%`, filter: entry > 0.05 ? `blur(${entry * 10}px)` : undefined }}>
      <Svg>{children(t)}</Svg>
    </AbsoluteFill>
  );
};

// ---------- dibujos ----------
const Calendar: React.FC<{ tear: number; label?: boolean }> = ({ tear, label = true }) => {
  const half = (sd: number) => (
    <g transform={`translate(${sd * tear * 120} ${tear * 40}) rotate(${sd * tear * 6} ${540 + sd * 160} 940)`}>
      <clipPath id={`cal${sd}`}><path d={sd < 0 ? "M0 0 L560 0 L520 760 L575 980 L530 1250 L0 1920 Z" : "M560 0 L1080 0 L1080 1920 L530 1250 L575 980 L520 760 Z"} /></clipPath>
      <g clipPath={`url(#cal${sd})`}>
        <Ink>
          <rect x={220} y={560} width={640} height={760} fill="#050505" stroke="#F2F2F2" strokeWidth={9} />
          <rect x={220} y={560} width={640} height={170} fill={RED} />
          <rect x={220} y={1180} width={640} height={140} fill="url(#h1)" opacity={0.4} />
          {[340, 540, 740].map((x) => <rect key={x} x={x - 14} y={520} width={28} height={80} rx={14} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
        </Ink>
        <text x={540} y={680} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={84} fill="#F2F2F2" letterSpacing={6}>DICIEMBRE</text>
        <text x={540} y={1110} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={380} fill="#F2F2F2" filter="url(#ink)">25</text>
      </g>
    </g>
  );
  return <g>{half(-1)}{half(1)}{label ? null : null}</g>;
};
const Sheep: React.FC<{ x: number; y: number; s: number; bob: number }> = ({ x, y, s, bob }) => (
  <g transform={`translate(${x} ${y + Math.sin(bob) * 4}) scale(${s})`}>
    <Ink>
      {[[-14, 54], [44, 54]].map(([lx, ly]) => <rect key={lx} x={lx} y={ly - 30} width={12} height={46} fill="#F2F2F2" />)}
      <path d="M-70 10 q-6 -50 40 -52 q18 -28 52 -10 q38 -20 58 14 q42 6 30 46 q4 40 -40 38 q-26 22 -56 4 q-34 18 -56 -6 q-40 2 -28 -34 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
      <path d="M-40 -30 q20 -14 40 0 M10 -36 q22 -10 40 6" stroke="url(#h1)" strokeWidth={30} fill="none" opacity={0.6} />
      <ellipse cx={-86} cy={-6} rx={26} ry={34} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    </Ink>
  </g>
);
const Hills: React.FC = () => (
  <Ink>
    <path d="M-20 1300 Q260 1150 520 1260 Q780 1130 1100 1240 L1100 1920 L-20 1920 Z" fill="#050505" />
    <path d="M-20 1300 Q260 1150 520 1260 Q780 1130 1100 1240 L1100 1420 L-20 1420 Z" fill="url(#h2)" opacity={0.2} />
    <Draw d="M-20 1300 Q260 1150 520 1260 Q780 1130 1100 1240" p={1} w={5} />
  </Ink>
);
const Moon: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <Ink><circle cx={x} cy={y} r={r} fill="url(#h1)" opacity={0.5} /><circle cx={x} cy={y} r={r} fill="none" stroke="#F2F2F2" strokeWidth={5} /></Ink>
);
const Star: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <g opacity={o} style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.95))" }}>
    <path d={`M${x} ${y - r} Q${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y} Q${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r} Q${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y} Q${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r} Z`} fill="#F2F2F2" />
  </g>
);
const Shepherd: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g><Robe x={x} y={y} s={s} hood /><Ink><path d={`M${x + 150 * s} ${y} L${x + 150 * s} ${y - 560 * s} q0 -60 -50 -60`} stroke="#F2F2F2" strokeWidth={9} fill="none" /></Ink></g>
);
const Manger: React.FC<{ x: number; y: number; s: number; glow: number }> = ({ x, y, s, glow }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-120} rx={260} ry={110} fill={`rgba(242,242,242,${0.25 * glow})`} style={{ filter: "blur(30px)" }} />
    <Ink>
      <path d="M-230 -170 L230 -170 L180 -20 L-180 -20 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={8} />
      <path d="M-230 -170 L230 -170 L180 -20 L-180 -20 Z" fill="url(#h1)" opacity={0.45} />
      {[-150, -60, 30, 120].map((k, i) => <path key={k} d={`M${k} -170 l${30 - i * 10} -50`} stroke="#F2F2F2" strokeWidth={5} />)}
      <path d="M-160 -20 L-190 60 M160 -20 L190 60" stroke="#F2F2F2" strokeWidth={10} />
    </Ink>
  </g>
);

// ---------- escenas ----------
// 1 · gancho: el calendario del 25 se rasga (y el plano final vuelve a él: bucle)
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const tear = eo(ip(t, [at("diciembre") - 0.02, at("diciembre") + 0.35], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 1.5], [1.12, 1.0]) * (t < at("nació") ? 1 : 1.08)})` }}>
      <Svg>
        <Brush d="M560 470 L520 760 L575 980 L530 1250 L555 1380" p={tear} w={60} len={1300} v />
        <Calendar tear={tear} />
        {frozen !== undefined ? <><Serif txt="¿NO FUE" y={1560} size={120} ls={6} /><Serif txt="EL 25?" y={1700} size={120} ls={6} /></> : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 2 · la Biblia y la lupa: LUCAS 2:8
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1, 50, 55], [at("pista"), 1.35, 62, 50, -2], [at("nadie"), 1.8, 64, 49, 2]]}>
    {(t) => {
      const flip = ip(t, [t0, t0 + 0.6], [1, -1]);
      const mx = ip(t, [t0 + 0.2, at("pista")], [330, 720]);
      return (
        <>
          <Ink>
            <path d="M540 760 Q380 720 160 760 L160 1360 Q380 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            <path d="M540 760 Q700 720 920 760 L920 1360 Q700 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            {Array.from({ length: 9 }, (_, i) => <g key={i}><path d={`M200 ${830 + i * 56} L500 ${830 + i * 56}`} stroke="#F2F2F2" strokeWidth={4} opacity={0.6} /><path d={`M580 ${830 + i * 56} L880 ${830 + i * 56}`} stroke="#F2F2F2" strokeWidth={4} opacity={0.6} /></g>)}
            <g transform={`translate(540 0) scale(${flip} 1) translate(-540 0)`}><path d="M540 760 Q700 720 920 760 L920 1360 Q700 1320 540 1360 Z" fill="#0A0A0A" stroke="#F2F2F2" strokeWidth={6} opacity={Math.abs(flip) < 0.98 ? 1 : 0} /></g>
          </Ink>
          <clipPath id="lens"><circle cx={mx} cy={1010} r={170} /></clipPath>
          <g clipPath="url(#lens)"><rect x={mx - 170} y={840} width={340} height={340} fill="#050505" /><text x={mx} y={1032} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={60} fill={RED}>LUCAS 2:8</text></g>
          <Ink><circle cx={mx} cy={1010} r={170} fill="none" stroke="#F2F2F2" strokeWidth={14} /><path d={`M${mx + 120} ${1130} L${mx + 240} ${1260}`} stroke="#F2F2F2" strokeWidth={34} strokeLinecap="round" /></Ink>
        </>
      );
    }}
  </Shot>
);
// 3 · noche en el campo: pastor y ovejas
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("noche"), 1.25, 78, 30], [at("pastores"), 1.5, 30, 62, -2], [at("campo"), 1.0, 50, 60], [at("cuidando"), 1.7, 62, 72, 2], [at("ovejas"), 2.1, 72, 74]]}>
    {(t) => (
      <>
        <Moon x={820} y={560} r={130} />
        <Hills />
        <Shepherd x={300} y={1420} s={0.95} />
        {[[560, 1450, 1], [730, 1490, 0.9], [880, 1440, 0.8], [640, 1580, 1.1]].map(([x, y, s], i) => <Sheep key={i} x={x} y={y} s={s} bob={t * 5 + i} />)}
      </>
    )}
  </Shot>
);
// 4 · pero en diciembre: lluvia, termómetro a 3 °C, los rebaños se encierran
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("belén"), 1.3, 50, 40, -2], [at("llueve"), 1.0, 50, 50], [at("frío"), 1.8, 80, 42, 2], [at("rebaños"), 1.2, 50, 66], [at("guardan"), 1.5, 50, 70, -2]]}>
    {(t) => {
      const rain = ip(t, [at("llueve") - 0.1, at("llueve") + 0.1], [0, 1]);
      const temp = ip(t, [at("frío") - 0.1, at("frío") + 0.5], [18, 3]);
      const pen = eo(ip(t, [at("rebaños"), at("guardan") + 0.1], [0, 1]));
      const gate = eo(ip(t, [at("guardan"), at("guardan") + 0.15], [0, 1]));
      return (
        <>
          <Hills />
          <Ink>
            <path d="M140 1640 Q140 1400 360 1380 L720 1380 Q940 1400 940 1640" fill="none" stroke="#F2F2F2" strokeWidth={10} />
            {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={170 + i * 82} cy={1640} rx={40} ry={22} fill="#050505" stroke="#F2F2F2" strokeWidth={5} />)}
          </Ink>
          {[[760, 1500], [880, 1540], [640, 1560]].map(([x, y], i) => <Sheep key={i} x={x - pen * (280 + i * 30)} y={y} s={0.8} bob={t * 9 + i} />)}
          <g transform={`rotate(${(1 - gate) * -70} 940 1640)`}><Ink><rect x={930} y={1440} width={24} height={200} fill="#F2F2F2" /><path d="M940 1460 L1060 1460 M940 1540 L1060 1540 M940 1620 L1060 1620" stroke="#F2F2F2" strokeWidth={10} /></Ink></g>
          <g transform="translate(860 700)">
            <Ink><rect x={-36} y={-250} width={72} height={380} rx={36} fill="#050505" stroke="#F2F2F2" strokeWidth={7} /><circle cx={0} cy={170} r={70} fill={RED} stroke="#F2F2F2" strokeWidth={7} /></Ink>
            <rect x={-18} y={120 - temp * 16} width={36} height={temp * 16 + 40} fill={RED} />
            <text x={-90} y={30} textAnchor="end" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={110} fill="#F2F2F2">{Math.round(temp)}°C</text>
          </g>
          <g opacity={rain}>{Array.from({ length: 70 }, (_, i) => { const x = (random(`rx${i}`) * 1200 + t * 120) % 1200 - 60; const y = (random(`ry${i}`) * 2000 + t * 2600) % 2000 - 80; return <path key={i} d={`M${x} ${y} l-14 60`} stroke="#F2F2F2" strokeWidth={3} opacity={0.55} />; })}</g>
        </>
      );
    }}
  </Shot>
);
// 5 · ¿por qué el 25? el contador de años rueda hasta 336 d.C. · ROMA
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("25"), 1.25, 50, 42, -3], [at("eligió"), 1.0, 50, 55], [at("300"), 1.3, 50, 58, 2]]}>
    {(t) => {
      const yr = Math.round(ip(t, [at("eligió"), at("después") + 0.2], [0, 336]));
      const big = t >= at("eligió");
      return (
        <>
          {!big ? (
            <>
              <Serif txt="¿POR QUÉ" y={700} size={110} o={ip(t, [at("por"), at("por") + 0.1], [0, 1])} ls={6} />
              <g filter="url(#brushH)" transform={`translate(540 1150) scale(${ip(t, [at("25"), at("25") + 0.12], [1.6, 1])}) translate(-540 -1150)`} opacity={ip(t, [at("25"), at("25") + 0.06], [0, 1])}><text x={540} y={1280} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={520} fill={RED}>25?</text></g>
            </>
          ) : (
            <>
              <Ink><rect x={140} y={840} width={800} height={380} fill="#050505" stroke="#F2F2F2" strokeWidth={9} /></Ink>
              <text x={540} y={1110} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={260} fill="#F2F2F2">{yr}</text>
              <Serif txt="d.C." y={1330} size={80} ls={10} />
              <g opacity={yr >= 336 ? 1 : 0} transform={`translate(540 1520) scale(${yr >= 336 ? 1 : 1.4}) translate(-540 -1520)`}><BigRedText txt="ROMA" y={1560} /></g>
            </>
          )}
        </>
      );
    }}
  </Shot>
);
const BigRedText: React.FC<{ txt: string; y: number; size?: number }> = ({ txt, y, size = 180 }) => (
  <g filter="url(#brushH)"><text x={540} y={y} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={size} fill={RED} stroke={RED} strokeWidth={6}>{txt}</text></g>
);
// 6 · la Biblia nunca dio la fecha: el calendario se vacía, día por día
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("fecha"), 1.3, 40, 45, -2], [at("dios"), 1.0, 50, 50], [at("cuándo"), 1.4, 55, 55, 2]]}>
    {(t) => (
      <>
        {Array.from({ length: 35 }, (_, i) => {
          const c = i % 7, r = Math.floor(i / 7); const x = 120 + c * 120, y = 640 + r * 150;
          const fall = ip(t, [at("porque") + random(`cf${i}`) * 1.2, at("porque") + random(`cf${i}`) * 1.2 + 0.45], [0, 1]);
          return (
            <g key={i} transform={`translate(0 ${fall * fall * 1400}) rotate(${fall * (random(`cr${i}`) - 0.5) * 90} ${x + 55} ${y + 65})`}>
              <Ink><rect x={x} y={y} width={110} height={130} fill="#050505" stroke="#F2F2F2" strokeWidth={5} /></Ink>
              <text x={x + 55} y={y + 90} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={54} fill={i === 24 ? RED : "#F2F2F2"}>{i + 1 <= 31 ? i + 1 : ""}</text>
            </g>
          );
        })}
        <Ink><Draw d="M120 600 L960 600" p={1} w={8} /></Ink>
      </>
    )}
  </Shot>
);
// 7 · le importó dónde: la estrella baja hasta el pesebre · PESEBRE = COMEDERO
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 30], [at("dónde"), 1.3, 50, 28, -2], [at("comedero"), 1.3, 50, 84], [at("animales"), 1.7, 50, 86, 2]]}>
    {(t) => {
      const beam = eo(ip(t, [at("dónde"), at("comedero")], [0, 1]));
      return (
        <>
          <path d={`M540 520 L330 ${520 + beam * 1100} L750 ${520 + beam * 1100} Z`} fill="rgba(242,242,242,0.13)" />
          <Star x={540} y={520} r={ip(t, [t0, t0 + 0.2], [0, 110]) + Math.sin(t * 8) * 8} />
          <Ground y={1640} />
          <Manger x={540} y={1650} s={1.25} glow={beam} />
          <Serif txt="PESEBRE =" y={1130} size={70} o={ip(t, [at("comedero"), at("comedero") + 0.1], [0, 1])} ls={6} />
        </>
      );
    }}
  </Shot>
);
// 8 · para que nadie se sintiera demasiado bajo: todos llegan al pesebre, a ras de suelo
const C8: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 70], [at("sintiera"), 1.35, 30, 75, -2], [at("bajo"), 1.9, 50, 86, 0], [at("llegar"), 1.0, 50, 70], [at("él"), 1.25, 50, 72]]}>
    {(t) => {
      const walk = ip(t, [t0, at("él")], [0, 1]);
      return (
        <>
          <Star x={540} y={700} r={80 + Math.sin(t * 8) * 6} />
          <Ground y={1640} />
          <Manger x={540} y={1650} s={0.9} glow={1} />
          {[-1, 1].map((sd) => [0, 1, 2].map((i) => <Robe key={`${sd}${i}`} x={540 + sd * (760 - walk * 300 - i * 150)} y={1640} s={0.62 - i * 0.07} hood={i === 1} />))}
          <circle cx={540} cy={1500} r={ip(t, [at("él"), at("él") + 0.25], [0, 900])} fill="rgba(242,242,242,0.9)" opacity={ip(t, [at("él"), at("él") + 0.3], [0, 0.7])} />
        </>
      );
    }}
  </Shot>
);
// 9 · mándaselo…: el calendario se recompone → es el primer plano (bucle)
const C9: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  const heal = eo(ip(t, [t0, END - 0.25], [1, 0]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.3, 1.12])})` }}>
      <Svg>
        <Calendar tear={heal} />
      </Svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("y"), C2], [at("lucas"), C3], [at("pero"), C4], [at("entonces"), C5], [at("la", 1), C6], [at("le", 1), C7], [at("para"), C8], [at("mándaselo"), C9],
];
const SFX: [number, string, number][] = [
  [at("diciembre") - 0.05, "sfx/crack.wav", 0.35], [at("guardan") - 0.02, "sfx/impact.wav", 0.3], [at("después") + 0.15, "sfx/tick.wav", 0.35], [at("dónde") - 0.1, "sfx/shimmer.wav", 0.3],
];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Navidad: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 18 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 18 * kick}px) scale(${1 + 0.06 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={1.45} /></AbsoluteFill> : null}
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
      <Sequence from={S(TH)}><Audio src={staticFile("navidad/mezcla.wav")} /></Sequence>
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
