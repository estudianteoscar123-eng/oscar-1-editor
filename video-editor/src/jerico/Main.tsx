import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/jerico/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { CK, Embers, Finish, Hills, INK, L, Palm, Person, RED, Sky, Smoke, Tag, W, camAt, eo, fogDefs, hash, ip } from "../dv2/Kit";

// ZK Dark v2 · Jericó (Josué 6). Un solo plano: la muralla → seis días de marcha → siete vueltas → trompetas, grito y derrumbe.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const END = 25.9;
export const JERICO_TOTAL = S(END);
const KEYS = new Set(["muralla", "jericó", "tocarla", "seis", "silencio", "séptimo", "siete", "trompetas", "gritó", "abajo", "armas", "absurda", "resultados"]);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

const TOP = 8000;
const T_TRUMP = at("sonaron");
const T_SHOUT = at("todo");
const T_FALL = at("muralla", 1);
const K: CK[] = [
  [0, 0, -700, -1500, 300],
  [at("sin") - 0.25, 0, -850, -1250, 300],
  [at("sin") + 0.15, 420, -430, -700, 0, 1],
  [at("durante") - 0.2, 440, -430, -600, 0],
  [at("durante") + 0.3, 0, -520, -2200, 200, 1],
  [at("silencio") - 0.3, 300, -490, -1900, 200],
  [at("silencio") + 0.05, 620, -420, -650, 0, 1],
  [at("séptimo") - 0.2, 630, -420, -560, 0],
  [at("séptimo") + 0.3, TOP, 0, -2100, 600, 1],
  [at("y") - 0.2, TOP, 0, -1800, 600],
  [at("y") + 0.25, 330, -470, -760, 0, 1],
  [T_SHOUT - 0.3, 340, -480, -600, 0],
  [T_SHOUT + 0.1, 0, -560, -1500, 250, 1],
  [T_FALL - 0.2, 0, -600, -1700, 300],
  [T_FALL + 0.2, 0, -760, -2400, 300, 1],
  [at("no") - 0.2, 0, -700, -2200, 300],
  [at("no") + 0.2, -5880, -120, -1050, -200, 1],
  [at("mándaselo") - 0.15, -5875, -130, -920, -200],
  [at("mándaselo") + 0.35, 0, -820, -3200, 300, 1],
  [END - 0.5, 60, -860, -3500, 300],
  [END, 0, -700, -1500, 300, 1],
];

// muralla: 8 tramos que caen escalonados
const Wall: React.FC<{ t: number; fall: number; crack: number }> = ({ t, fall, crack }) => (
  <g filter="url(#ink)">
    {Array.from({ length: 8 }, (_, i) => {
      const x0 = -3200 + i * 800;
      const k = eo(ip(fall, i * 0.06, i * 0.06 + 0.55));
      const tower = i % 2 === 0;
      const h = tower ? 1050 : 880;
      return (
        <g key={i} transform={`translate(${x0 + 400} ${k * 1300}) rotate(${(hash(i) - 0.5) * 50 * k}) translate(${-400} 0)`} opacity={1 - ip(k, 0.75, 1)}>
          <rect x={0} y={-h} width={800} height={h} fill={INK} stroke={W} strokeWidth={7} />
          <rect x={430} y={-h} width={370} height={h} fill="url(#h2)" opacity={0.35} />
          {Array.from({ length: Math.floor(h / 70) }, (_, r) => <path key={r} d={`M0 ${-60 - r * 70} L800 ${-60 - r * 70}`} stroke={W} strokeWidth={2} opacity={0.3} />)}
          {Array.from({ length: 6 }, (_, j) => <rect key={j} x={20 + j * 135} y={-h - 70} width={80} height={70} fill={INK} stroke={W} strokeWidth={6} />)}
          {tower ? <rect x={330} y={-h + 180} width={140} height={200} rx={70} fill="#FF7A2A" opacity={0.5 + 0.1 * Math.sin(t * 6 + i)} stroke={W} strokeWidth={6} /> : null}
          {crack > 0 ? <path d={`M${200 + hash(i) * 400} ${-h} l${-60} ${180 * crack} l${90} ${160 * crack} l${-70} ${200 * crack} l${60} ${220 * crack}`} stroke={RED} strokeWidth={10} fill="none" /> : null}
        </g>
      );
    })}
    {/* guardias en las almenas */}
    {fall < 0.05 ? Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${-2900 + i * 640} -1000) scale(0.32)`}><Person t={t} seed={30 + i} head="helmet" cape={false} expr={t > T_SHOUT ? "shock" : "smug"} /></g>) : null}
  </g>
);
const Ark: React.FC = () => (
  <g>
    <path d="M-260 -300 L260 -300" stroke={W} strokeWidth={10} />
    <rect x={-150} y={-420} width={300} height={170} fill={INK} stroke="#E8C66A" strokeWidth={8} />
    <rect x={-150} y={-420} width={300} height={170} fill="url(#h1)" opacity={0.35} />
    {[-1, 1].map((s) => <path key={s} d={`M${s * 40} -420 Q${s * 120} -560 ${s * 170} -470`} stroke="#E8C66A" strokeWidth={8} fill="none" />)}
  </g>
);
const Shofar: React.FC = () => <path d="M0 0 Q60 -10 90 -70 L110 -60 Q80 10 0 20 Z" fill="#E8C66A" stroke={W} strokeWidth={4} />;
// procesión que camina hacia la derecha; tipo: 0 soldado, 1 sacerdote con trompeta, 2 portadores del arca
const ORDER = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0];
const March: React.FC<{ t: number; speed: number; shout: number; trump: number; span?: number }> = ({ t, speed, shout, trump, span = 5200 }) => (
  <g>
    {ORDER.map((kind, i) => {
      const x = ((i * 300 + t * speed) % span) - span / 2;
      const bob = speed > 0 ? Math.abs(Math.sin(t * 7 + i)) * 12 : 0;
      return (
        <g key={i} transform={`translate(${x} ${-bob}) scale(0.5)`}>
          {kind === 2 && i % 2 === 0 ? <g transform="translate(150 -120)"><Ark /></g> : null}
          <Person t={t} seed={i} head={kind === 0 ? "helmet" : kind === 1 ? "turban" : "hood"} cape={kind === 0} beard={kind !== 0} sash={kind === 1 ? RED : undefined}
            expr={shout > 0 ? "shout" : "calm"} armL={shout > 0 ? 160 : kind === 2 ? 150 : 12} armR={shout > 0 || (kind === 1 && trump > 0) ? 150 : kind === 2 ? 150 : 20}
            hold={kind === 1 ? <g transform="scale(1.4)"><Shofar /></g> : kind === 0 ? <path d="M0 0 L0 -260" stroke={W} strokeWidth={6} /> : undefined} />
        </g>
      );
    })}
  </g>
);
// vista desde arriba: la ciudad como elipse y la procesión dando vueltas
const TopView: React.FC<{ t: number; laps: number }> = ({ t, laps }) => (
  <g>
    <ellipse cx={0} cy={0} rx={1300} ry={520} fill="#0B0505" stroke={W} strokeWidth={6} />
    <ellipse cx={0} cy={0} rx={900} ry={350} fill={INK} stroke={W} strokeWidth={22} />
    <ellipse cx={0} cy={0} rx={900} ry={350} fill="none" stroke={INK} strokeWidth={10} strokeDasharray="30 30" />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(hash(i) - 0.5) * 1300} y={(hash(i + 9) - 0.5) * 460} width={70} height={50} fill={INK} stroke={W} strokeWidth={3} />)}
    {Array.from({ length: 34 }, (_, i) => { const a = laps * Math.PI * 2 + (i / 34) * Math.PI * 0.9; return <circle key={i} cx={Math.cos(a) * 1100} cy={Math.sin(a) * 430} r={18} fill={i > 2 && i < 10 ? "#E8C66A" : W} />; })}
    <path d={`M${Math.cos(laps * Math.PI * 2) * 1100} ${Math.sin(laps * Math.PI * 2) * 430} A1100 430 0 0 0 ${Math.cos(laps * Math.PI * 2 - 1.2) * 1100} ${Math.sin(laps * Math.PI * 2 - 1.2) * 430}`} stroke={RED} strokeWidth={10} fill="none" opacity={0.8} />
  </g>
);

export const Jerico: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? at("trompetas") + 0.9 : f / FPS;
  const fall = ip(t, T_FALL - 0.1, T_FALL + 1.0);
  const crack = ip(t, T_SHOUT + 0.2, T_FALL);
  const shake = (ip(t, T_SHOUT, T_SHOUT + 0.2) * (1 - ip(t, T_FALL + 1.2, T_FALL + 1.8))) * (8 + fall * 26);
  const cam0 = camAt(K, t);
  const c = { ...cam0, x: cam0.x + Math.sin(t * 1.3) * 6 + (random(`sx${f}`) - 0.5) * shake, y: cam0.y + Math.cos(t * 1.1) * 5 + (random(`sy${f}`) - 0.5) * shake };
  // seis días: el cielo pasa de noche a día en cada vuelta
  const day = t >= at("durante") && t < at("séptimo") ? Math.min(6, Math.floor(ip(t, at("durante"), at("silencio") + 0.5) * 6) + 1) : 0;
  const cyc = t >= at("durante") && t < at("séptimo") ? Math.sin(ip(t, at("durante"), at("silencio") + 0.5) * Math.PI * 12) : 0;
  const laps = ip(t, at("dieron"), at("y") - 0.1) * 7;
  const lap = t >= at("dieron") - 0.1 && t < at("y") ? Math.min(7, Math.floor(laps) + 1) : 0;
  const shout = t >= T_SHOUT ? 1 : 0;
  const trump = t >= T_TRUMP ? 1 : 0;
  const marching = t < T_TRUMP;
  const flash = 0.5 * Math.exp(-Math.max(0, t - T_FALL) * 5) * (t >= T_FALL ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <Defs />
      {fogDefs}
      <Sky cam={c} t={t} glow={cyc > 0.3 ? "rgba(255,150,80,0.7)" : "rgba(211,15,23,0.75)"} stars={0.5 - cyc * 0.4} />
      <AbsoluteFill style={{ filter: "contrast(1.08)" }}>
        <L cam={c} d={9000} x={0} y={-900} noBlur><circle r={900} fill="#FF5A1F" opacity={0.16} /><circle r={420} fill="#FF7A2A" opacity={0.2} /></L>
        <L cam={c} d={2600} x={0} y={-40}><Hills w={11000} seed={3} amp={70} /></L>
        {/* casas de la ciudad detrás de la muralla */}
        <L cam={c} d={900} x={0} y={-560}>{Array.from({ length: 22 }, (_, i) => <rect key={i} x={-3000 + i * 280} y={-(80 + hash(i) * 260)} width={220} height={400} fill={INK} stroke={W} strokeWidth={4} />)}{Array.from({ length: 22 }, (_, i) => <rect key={`w${i}`} x={-2930 + i * 280} y={-(40 + hash(i) * 260)} width={50} height={50} fill="#FF7A2A" opacity={0.6} />)}</L>
        <L cam={c} d={300} x={0} y={0}><Wall t={t} fall={fall} crack={crack} /></L>
        {fall > 0 ? <L cam={c} d={250} x={0} y={-200}>{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${-2800 + i * 800} 0) scale(${2 + fall})`}><Smoke t={t * 1.5} seed={i * 7} color="#6E5E4C" n={6} spread={2} /></g>)}</L> : null}
        {fall > 0 ? <L cam={c} d={200} x={0} y={0}>{Array.from({ length: 40 }, (_, i) => { const k = ip(fall, hash(i) * 0.4, hash(i) * 0.4 + 0.5); return <rect key={i} x={(hash(i + 3) - 0.5) * 6000} y={-900 + k * 900} width={60 + hash(i) * 80} height={40} fill={INK} stroke={W} strokeWidth={4} transform={`rotate(${k * 200 * (hash(i + 5) - 0.5)} ${(hash(i + 3) - 0.5) * 6000} ${-900 + k * 900})`} opacity={k > 0 && k < 1 ? 1 : 0} />; })}</L> : null}
        {[-2600, 2700].map((x, i) => <L key={i} cam={c} d={120} x={x} y={0}><Palm t={t} s={1.5} seed={i} /></L>)}
        {/* la procesión */}
        <L cam={c} d={0} x={0} y={60}><March t={marching ? t : T_TRUMP} speed={marching ? 380 : 0} shout={shout} trump={trump} /></L>
        <L cam={c} d={-260} x={-6000} y={0}>
          <path d="M-1600 10 L1600 10 L1600 900 L-1600 900 Z" fill={INK} stroke={W} strokeWidth={4} /><g transform="rotate(-12) scale(2.2)"><Shofar /></g>
          {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-400 + hash(i) * 800} y={-30 - hash(i + 2) * 60} width={60 + hash(i + 4) * 70} height={36} fill={INK} stroke={W} strokeWidth={4} transform={`rotate(${(hash(i + 7) - 0.5) * 40})`} />)}
        </L>
        <L cam={c} d={-260} x={-6000} y={-200}><Smoke t={t * 0.6} seed={77} color="#B9A58C" n={5} /></L>
        {/* vista de arriba */}
        <L cam={c} d={600} x={TOP} y={0}><TopView t={t} laps={laps} /></L>
      </AbsoluteFill>
      <Embers t={t} cam={c} o={0.7} />
      <Finish f={f} t={t} flash={flash} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 132, letterSpacing: 4, color: W, textShadow: "0 0 40px rgba(0,0,0,0.9)" }}>¿SIN <span style={{ color: RED }}>TOCARLA</span>?</div>
      ) : (
        <>
          {day > 0 ? <Tag t={t} a={at("durante")} b={at("séptimo") - 0.05} y={1420} size={110}>DÍA {day}</Tag> : null}
          {lap > 0 ? <Tag t={t} a={at("dieron") - 0.1} b={at("y")} y={1420} size={110} color={lap === 7 ? RED : W}>VUELTA {lap}</Tag> : null}
          <Tag t={t} a={at("no") + 0.1} b={at("mándaselo")} size={64}>JOSUÉ 6:20</Tag>
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("jerico/mezcla.wav")} />
      {[[T_TRUMP - 0.05, "sfx/whoosh.wav", 0.3], [T_FALL - 0.05, "sfx/impact.wav", 0.5], [T_FALL + 0.2, "sfx/crack.wav", 0.35]].map(([a, nm, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={60}><Audio src={staticFile(nm as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
