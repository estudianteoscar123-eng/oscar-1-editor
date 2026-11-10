import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/pared/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { CK, Embers, Finish, Flame, INK, L, Person, RED, Sky, Smoke, Tag, W, camAt, eo, fogDefs, hash, ip } from "../dv2/Kit";

// ZK Dark v2 · La mano en la pared (Daniel 5). Banquete → la mano escribe → los sabios no pueden → contado, pesado, dividido → esa noche.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const FIX: Record<string, string> = { "contado,": "«Contado,", "dividido.": "dividido».", "rey@12.28": "reino", "no@12.54": "" };
const WORDS: Word[] = RAW.map((c) => ({ w: FIX[`${c.text.trim()}@${c.timestamp[0]}`] ?? FIX[c.text.trim()] ?? c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH })).filter((w) => w.w !== "");
const END = 29.95;
export const PARED_TOTAL = S(END);
const KEYS = new Set(["fiesta", "copas", "sagradas", "mano", "pared", "rodillas", "sabio", "extraño", "contado", "pesado", "dividido", "alcanzó", "noche", "murió", "diría"]);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

const WALL = 4000, SYM = 9000;
const T_HAND = at("mano");
const T_DARK = at("esa");
const K: CK[] = [
  [0, 0, -480, -800, 0],
  [at("bebiendo") - 0.15, 30, -470, -650, 0],
  [at("bebiendo") + 0.15, 420, -300, -520, 0, 1],
  [at("templo") - 0.2, 440, -300, -430, 0],
  [at("templo") + 0.15, 0, -520, -1650, 300, 1],
  [T_HAND - 0.25, 20, -520, -1500, 300],
  [T_HAND + 0.15, WALL, -650, -950, 0, 1],
  [at("al") - 0.15, WALL + 20, -650, -780, 0],
  [at("al") + 0.15, 0, -440, -720, 0, 1],
  [at("ningún") - 0.2, 0, -330, -580, 0],
  [at("ningún") + 0.2, WALL, -480, -1750, 200, 1],
  [at("pero") - 0.1, WALL, -500, -1500, 200],
  [at("pero") + 0.25, WALL, -640, -1100, 0, 1],
  [at("decía") - 0.2, WALL + 10, -650, -820, 0],
  [at("decía") + 0.1, WALL, -650, -600, 0, 1],
  [at("contado") - 0.15, WALL, -650, -560, 0],
  [at("contado") + 0.1, SYM - 700, -480, -900, 0, 1],
  [at("pesado") - 0.1, SYM - 690, -480, -840, 0],
  [at("pesado") + 0.1, SYM, -480, -900, 0, 1],
  [at("dividido") - 0.1, SYM + 10, -480, -840, 0],
  [at("dividido") + 0.1, SYM + 700, -480, -900, 0, 1],
  [at("dios") - 0.1, SYM + 710, -480, -840, 0],
  [at("dios") + 0.25, SYM, -500, -1400, 0, 1],
  [T_DARK - 0.2, SYM, -520, -950, 0],
  [T_DARK + 0.2, 0, -520, -1300, 0, 1],
  [at("murió") - 0.2, 0, -150, -760, 0, 1],
  [at("y", 2) - 0.1, 10, -140, -700, 0],
  [at("y", 2) + 0.25, WALL, -650, -1150, 0, 1],
  [END - 0.5, WALL, -650, -880, 0],
  [END, 0, -480, -800, 0, 1],
];

const Cup: React.FC<{ s?: number; tilt?: number }> = ({ s = 1, tilt = 0 }) => (
  <g transform={`scale(${s}) rotate(${tilt})`}>
    <path d="M-40 -120 L40 -120 Q36 -60 0 -50 Q-36 -60 -40 -120 Z" fill="#E8C66A" stroke={W} strokeWidth={4} />
    <path d="M0 -50 L0 -10 M-26 0 L26 0" stroke="#E8C66A" strokeWidth={8} />
    <path d="M-30 -112 L30 -112" stroke={RED} strokeWidth={6} />
  </g>
);
const Column: React.FC = () => (
  <g filter="url(#ink)">
    <rect x={-70} y={-1300} width={140} height={1300} fill={INK} stroke={W} strokeWidth={6} />
    {[-40, 0, 40].map((x) => <path key={x} d={`M${x} -1280 L${x} -20`} stroke={W} strokeWidth={2} opacity={0.4} />)}
    <rect x={-100} y={-1340} width={200} height={50} fill={INK} stroke={W} strokeWidth={6} />
    <rect x={-100} y={-20} width={200} height={30} fill={INK} stroke={W} strokeWidth={6} />
  </g>
);
const Lamp: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g>
    <path d="M0 0 L0 -420 M-160 -420 Q-160 -300 0 -300 Q160 -300 160 -420 M-90 -420 Q-90 -340 0 -340 Q90 -340 90 -420" stroke="#E8C66A" strokeWidth={8} fill="none" />
    {[-160, -90, 0, 90, 160].map((x, i) => <g key={i} transform={`translate(${x} -430)`}>{o > 0.05 ? <Flame t={t} s={0.35 * o} seed={i} logs={false} /> : <Smoke t={t} seed={i} n={3} />}</g>)}
  </g>
);
// la mano: dedos de tinta brillante, sin brazo; avanza mientras escribe
const Hand: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g opacity={o} transform={`rotate(${Math.sin(t * 6) * 3})`}>
    <ellipse cx={40} cy={-60} rx={220} ry={160} fill="#FFE7B0" opacity={0.22} />
    <path d="M-80 40 Q-90 -40 -40 -60 L-30 -170 Q-10 -190 10 -170 L12 -80 L30 -200 Q52 -216 70 -196 L60 -80 L90 -180 Q110 -196 126 -176 L100 -60 Q130 -110 150 -96 Q164 -80 140 -40 Q100 40 40 80 Q-40 100 -80 40 Z" fill="#FFF4DA" stroke={W} strokeWidth={6} />
    <path d="M-80 40 Q-120 70 -170 60" stroke="#FFF4DA" strokeWidth={30} strokeLinecap="round" opacity={0.25} />
  </g>
);
// escritura: cuatro palabras que se trazan solas
const GLY = ["M0 -90 L0 0 L55 0 M0 -90 L22 -110", "M0 -90 Q55 -92 52 -40 L52 0 M-6 0 L60 0", "M8 -90 L58 -90 Q36 -60 30 0", "M0 -60 Q0 -92 30 -92 Q60 -92 60 -52 L60 0 M30 -92 L30 -40"];
const Writing: React.FC<{ p: number; glow: number }> = ({ p, glow }) => (
  <g transform="translate(-520 0)">
    {Array.from({ length: 4 }, (_, w) => (
      <g key={w} transform={`translate(${w * 280} ${(w % 2) * 30})`}>
        {Array.from({ length: 3 }, (_, c) => {
          const k = ip(p, (w * 3 + c) / 12, (w * 3 + c + 1) / 12);
          return <path key={c} d={GLY[(w + c) % 4]} transform={`translate(${c * 80} 0)`} stroke={glow > 0 ? "#FFD27A" : W} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - k)} style={{ filter: glow > 0 ? `drop-shadow(0 0 ${14 * glow}px #FF9A3C)` : undefined }} />;
        })}
      </g>
    ))}
  </g>
);
const Scale: React.FC<{ t: number; tip: number }> = ({ t, tip }) => {
  const a = tip * 18 + Math.sin(t * 2) * 1.5;
  return (
    <g filter="url(#ink)">
      <path d="M0 0 L0 -700 M-140 0 L140 0" stroke={W} strokeWidth={10} />
      <g transform={`translate(0 -700) rotate(${a})`}>
        <path d="M-420 0 L420 0" stroke={W} strokeWidth={10} />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 400} 0) rotate(${-a})`}>
            <path d="M0 0 L-110 260 M0 0 L110 260" stroke={W} strokeWidth={4} />
            <path d="M-140 260 Q0 330 140 260 Z" fill={INK} stroke={W} strokeWidth={6} />
            {sd < 0 ? <g transform="translate(0 250) scale(0.6)"><path d="M-60 0 L-70 -70 L-35 -35 L0 -85 L35 -35 L70 -70 L60 0 Z" fill="#E8C66A" stroke={W} strokeWidth={6} /></g> : <circle cx={0} cy={200} r={40} fill={RED} opacity={0.9} />}
          </g>
        ))}
      </g>
    </g>
  );
};
const Tally: React.FC<{ p: number }> = ({ p }) => (
  <g>{Array.from({ length: 12 }, (_, i) => { const k = ip(p, i / 12, (i + 1) / 12); const g = Math.floor(i / 5); const j = i % 5; return j === 4 ? <path key={i} d={`M${g * 230 - 20} -200 L${g * 230 + 170} -40`} stroke={RED} strokeWidth={14} strokeDasharray={260} strokeDashoffset={260 * (1 - k)} /> : <path key={i} d={`M${g * 230 + j * 40} -230 L${g * 230 + j * 40} -10`} stroke={W} strokeWidth={14} strokeDasharray={230} strokeDashoffset={230 * (1 - k)} />; })}</g>
);
const CrownSplit: React.FC<{ k: number }> = ({ k }) => (
  <g transform="scale(2.2)">
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${sd * k * 60} ${k * 20}) rotate(${sd * k * 14})`}>
        <path d={sd < 0 ? "M-60 0 L-70 -70 L-35 -35 L0 -85 L0 0 Z" : "M0 0 L0 -85 L35 -35 L70 -70 L60 0 Z"} fill="#E8C66A" stroke={W} strokeWidth={5} />
      </g>
    ))}
    {k > 0 ? <path d="M0 -95 L-8 -60 L6 -40 L-6 -10 L0 10" stroke={RED} strokeWidth={6} fill="none" opacity={1 - k * 0.5} /> : null}
  </g>
);

export const Pared: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? at("decía") + 0.4 : f / FPS;
  const dark = ip(t, T_DARK, at("noche") + 0.3) * (1 - ip(t, at("y", 2) + 0.1, at("y", 2) + 0.6));
  const lamp = 1 - dark;
  const shake = t >= at("al") && t < at("ningún") ? 10 : 0;
  const cam0 = camAt(K, t);
  const c = { ...cam0, x: cam0.x + Math.sin(t * 1.3) * 6 + (random(`sx${f}`) - 0.5) * shake, y: cam0.y + Math.cos(t * 1.1) * 5 + (random(`sy${f}`) - 0.5) * shake };
  const write = ip(t, T_HAND + 0.2, at("pared") + 0.2);
  const hand = ip(t, T_HAND - 0.1, T_HAND + 0.2) * (1 - ip(t, at("al") + 0.4, at("ningún"))) + ip(t, at("escribiera"), at("escribiera") + 0.3) * 1;
  const glow = ip(t, at("pero") + 0.2, at("decía"));
  const tip = ip(t, at("pesado", 1), at("alcanzó") + 0.2);
  const split = ip(t, at("dividido"), at("dividido") + 0.4);
  const crownFall = eo(ip(t, at("murió") - 0.3, at("murió") + 0.4));
  const kingExpr = t >= at("al") && t < at("esa") ? "shock" : t < T_HAND ? "happy" : "calm";
  const guests = (x: number, i: number) => <L key={i} cam={c} d={120 + (i % 2) * 60} x={x} y={0}><g transform="scale(0.75)"><Person t={t + i} seed={10 + i} head={i % 2 ? "turban" : "hair"} beard={i % 3 === 0} cape={false} expr={t < T_HAND ? "happy" : "shock"} talk={t < T_HAND} armR={t < T_HAND ? 140 : 40} hold={t < T_HAND ? <g transform="translate(0 30)"><Cup s={0.7} /></g> : undefined} flip={x > 0} /></g></L>;
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <Defs />
      {fogDefs}
      <Sky cam={c} t={t} glow={`rgba(211,15,23,${0.75 * lamp + 0.1})`} stars={0.3} />
      <AbsoluteFill style={{ filter: `contrast(1.08) brightness(${1 - dark * 0.55})` }}>
        {/* ===== salón del banquete ===== */}
        {[-1400, -700, 700, 1400].map((x, i) => <L key={i} cam={c} d={500} x={x} y={0}><Column /></L>)}
        <L cam={c} d={700} x={0} y={-900} noBlur><path d="M-3000 0 L3000 0 L3000 -800 L-3000 -800 Z" fill="#080404" stroke={W} strokeWidth={4} /><path d="M-3000 -40 L3000 -40" stroke={RED} strokeWidth={6} opacity={0.6} /></L>
        {[-900, 900].map((x, i) => <L key={i} cam={c} d={300} x={x} y={0}><Lamp t={t} o={lamp} /></L>)}
        {[-760, -420, 420, 760].map((x, i) => guests(x, i))}
        <L cam={c} d={20} x={0} y={0}><g transform="scale(1.05)"><Person t={t} seed={1} head="hair" beard sash={RED} expr={kingExpr} talk={t < T_HAND} armR={t < at("al") ? 130 : 30} hold={t < at("al") ? <g transform="translate(0 40)"><Cup s={0.9} tilt={t > T_HAND ? 60 : 0} /></g> : undefined} /></g><g transform={`translate(${crownFall * 260} ${-660 + crownFall * 640}) rotate(${crownFall * 220}) scale(1.1)`}><path d="M-60 0 L-70 -70 L-35 -35 L0 -85 L35 -35 L70 -70 L60 0 Z" fill="#E8C66A" stroke={W} strokeWidth={6} /></g></L>
        <L cam={c} d={-60} x={0} y={0}>
          <path d="M-1800 -250 L1800 -250 L1800 -200 L-1800 -200 Z" fill={INK} stroke={W} strokeWidth={6} />
          <path d="M-1800 -200 L1800 -200 L1800 300 L-1800 300 Z" fill="url(#h2)" opacity={0.3} />
          {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${-1200 + i * 300} -250)`}><Cup s={0.9} tilt={t > at("al") + 0.2 && i % 3 === 1 ? 80 : 0} /></g>)}
          {[-1000, 0, 1000].map((x) => <g key={x} transform={`translate(${x} -260)`}><Flame t={t} s={0.3 * lamp} seed={x} logs={false} /></g>)}
        </L>
        {/* ===== la pared ===== */}
        <L cam={c} d={200} x={WALL} y={0}>
          <path d="M-1600 0 L-1600 -1500 L1600 -1500 L1600 0 Z" fill="#0B0606" stroke={W} strokeWidth={6} />
          {Array.from({ length: 14 }, (_, r) => <path key={r} d={`M-1600 ${-100 - r * 100} L1600 ${-100 - r * 100}`} stroke={W} strokeWidth={2} opacity={0.18} />)}
          <ellipse cx={0} cy={-650} rx={900} ry={420} fill="#FF7A2A" opacity={0.12 * lamp + 0.05} />
          <g transform="translate(0 -620)"><Writing p={write} glow={glow} /></g>
          {t >= at("escribiera") - 0.1 ? <path d="M-60 -760 Q-60 -860 20 -860 Q100 -860 100 -780 Q100 -720 20 -690 L20 -620 M20 -560 L20 -550" stroke={RED} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - ip(t, at("escribiera") + 0.2, at("diría")))} /> : null}
        </L>
        <L cam={c} d={100} x={WALL + 330 - write * 520 + (t > at("escribiera") ? 400 : 0)} y={-560 + Math.sin(t * 9) * 12}><Hand t={t} o={hand} /></L>
        <L cam={c} d={260} x={WALL - 1300} y={0}><Lamp t={t} o={lamp} /></L>
        {[-1, 0, 1].map((i) => <L key={i} cam={c} d={0} x={WALL + i * 420} y={0} o={ip(t, at("ningún") - 0.3, at("ningún")) * (1 - ip(t, at("pero") + 0.2, at("decía")))}><g transform="scale(0.85)"><Person t={t} seed={20 + i} head="hood" beard expr={i === 0 ? "shock" : "sad"} armL={i === 0 ? 150 : 30} armR={i ? 160 : 40} flip={i > 0} /></g></L>)}
        {/* ===== contado, pesado, dividido ===== */}
        <L cam={c} d={300} x={SYM} y={-60}><path d="M-3000 0 L3000 0" stroke={W} strokeWidth={3} opacity={0.4} /></L>
        <L cam={c} d={0} x={SYM - 760} y={-200}><Tally p={ip(t, at("contado") - 0.05, at("contado") + 0.6)} /></L>
        <L cam={c} d={0} x={SYM} y={160}><Scale t={t} tip={tip - ip(t, at("pesado"), at("pesado") + 0.4) * 0.3} /></L>
        <L cam={c} d={0} x={SYM + 700} y={-260}><CrownSplit k={split} /></L>
        {Array.from({ length: 14 }, (_, i) => <L key={i} cam={c} d={400 + hash(i) * 900} x={SYM + (hash(i + 3) - 0.5) * 3000} y={-300 - hash(i + 5) * 800} o={0.6}><circle r={6} fill={W} /></L>)}
      </AbsoluteFill>
      <Embers t={t} cam={c} o={0.7 * lamp} />
      <Finish f={f} t={t} flash={0.45 * Math.exp(-Math.max(0, t - T_HAND) * 6) * (t >= T_HAND ? 1 : 0) + 0.35 * Math.exp(-Math.max(0, t - at("murió")) * 6) * (t >= at("murió") ? 1 : 0)} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 140, letterSpacing: 6, color: W, textShadow: "0 0 40px rgba(0,0,0,0.9)" }}>¿QUÉ <span style={{ color: RED }}>DECÍA</span>?</div>
      ) : (
        <>
          <Tag t={t} a={at("decía") - 0.1} b={at("contado") + 0.1} size={70}>MENE · MENE · TEKEL · UPARSIN</Tag>
          <Tag t={t} a={at("alcanzó") - 0.6} b={T_DARK} size={64}>DANIEL 5:27</Tag>
          <Tag t={t} a={at("murió")} b={at("y", 2)} size={64}>DANIEL 5:30</Tag>
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("pared/mezcla.wav")} />
      {[[T_HAND - 0.05, "sfx/shimmer.wav", 0.4], [at("al") - 0.05, "sfx/impact.wav", 0.3], [T_DARK - 0.05, "sfx/whoosh.wav", 0.3], [at("murió") - 0.05, "sfx/impact.wav", 0.4]].map(([a, nm, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={60}><Audio src={staticFile(nm as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
