import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/naaman/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { CK, Embers, Finish, INK, L, Palm, Person, RED, Sky, Smoke, Tag, W, camAt, fogDefs, hash, ip, Hills } from "../dv2/Kit";

// ZK Dark v2 · Naamán (2 Reyes 5). Un solo plano continuo: Naamán → casa de Eliseo → río sucio → ríos de Damasco → Jordán.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const FIX: Record<string, string> = { Naaman: "Naamán", "¿No": "«¿No", "tierra?": "tierra?»", Si: "«Si", "harías.": "harías»." };
const WORDS: Word[] = RAW.map((c) => ({ w: FIX[c.text.trim()] ?? c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const END = 29.2;
export const NAAMAN_TOTAL = S(END);
const KEYS = new Set(["siria", "lepra", "siete", "sucio", "sirviente", "furioso", "ríos", "difícil", "séptima", "niño", "milagro"]);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

const HOUSE = 7000, RIVER = 14000, DAMASCO = 21000, NX = 6200;
const DIPS = [at("vez"), at("dos"), at("nada", 1) + 0.05, at("nada", 1) + 0.3, at("nada", 1) + 0.55, at("y", 1) - 0.05, at("séptima")];
const T_CLEAN = at("piel");
const K: CK[] = [
  [0, 0, -480, -720, 0],
  [at("lepra") - 0.1, 30, -470, -600, 0],
  [at("lepra") + 0.15, 40, -520, -380, 0, 1],
  [at("profeta") - 0.15, 55, -525, -330, 0],
  [at("profeta") + 0.25, HOUSE, -420, -1250, 0, 1],
  [at("río") - 0.2, HOUSE + 40, -430, -1050, 0],
  [at("río") + 0.2, RIVER, -300, -1450, 300, 1],
  [at("ni") - 0.15, RIVER + 60, -280, -1280, 300],
  [at("ni") + 0.25, HOUSE, -430, -900, 0, 1],
  [at("naamán") - 0.15, HOUSE + 20, -420, -760, 0],
  [at("naamán") + 0.2, NX, -480, -700, 0, 1],
  [at("no") - 0.15, NX + 20, -480, -560, 0],
  [at("no") + 0.25, DAMASCO, -380, -1300, 0, 1],
  [at("sus") - 0.15, DAMASCO + 50, -400, -1100, 0],
  [at("sus") + 0.25, NX + 150, -430, -1200, 0, 1],
  [at("mete") - 0.2, NX + 180, -440, -980, 0],
  [at("mete") + 0.2, RIVER, -420, -1150, 0, 1],
  [at("séptima") - 0.05, RIVER, -460, -780, 0],
  [at("séptima") + 0.2, RIVER, -500, -560, 0, 1],
  [at("mándaselo") - 0.1, RIVER + 10, -510, -470, 0],
  [at("mándaselo") + 0.35, RIVER, -700, -2600, 0, 1],
  [END - 0.5, RIVER - 50, -760, -2900, 0],
  [END, 0, -480, -720, 0, 1],
];

const dipAt = (t: number) => DIPS.reduce((m, d) => Math.max(m, ip(t, d - 0.05, d + 0.12) * (1 - ip(t, d + 0.28, d + 0.5))), 0);
const countAt = (t: number) => DIPS.filter((d) => d <= t + 0.02).length;

const Horse: React.FC<{ t: number; seed: number }> = ({ t, seed }) => {
  const b = Math.sin(t * 2.2 + seed) * 4;
  return (
    <g filter="url(#ink)">
      {[-110, -70, 70, 110].map((x, i) => <path key={i} d={`M${x} -170 L${x + Math.sin(t * 2 + i + seed) * 4} 0`} stroke={W} strokeWidth={9} />)}
      <ellipse cx={0} cy={-210 + b} rx={150} ry={70} fill={INK} stroke={W} strokeWidth={5} />
      <path d={`M120 ${-240 + b} Q170 -330 190 ${-380 + b} L250 ${-350 + b} L235 ${-320 + b} Q190 -290 160 ${-210 + b}`} fill={INK} stroke={W} strokeWidth={5} />
      <circle cx={222} cy={-355 + b} r={6} fill={W} />
      <path d={`M150 ${-300 + b} Q120 -340 140 ${-380 + b}`} stroke={RED} strokeWidth={8} fill="none" />
      <path d={`M-150 ${-220 + b} Q-210 -200 -200 ${-130 + b}`} stroke={W} strokeWidth={6} fill="none" />
    </g>
  );
};
const Chariot: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <g transform="translate(-330 0)"><Horse t={t} seed={1} /></g>
    <g transform="translate(-260 30) scale(0.92)" opacity={0.85}><Horse t={t} seed={2} /></g>
    <path d="M-120 -230 L120 -230 L150 -90 L-90 -90 Z" fill={INK} stroke={W} strokeWidth={6} />
    <path d="M-120 -230 L120 -230 L150 -90 L-90 -90 Z" fill="url(#h1)" opacity={0.4} />
    <path d="M-120 -170 L-200 -140" stroke={W} strokeWidth={6} />
    <g transform={`translate(40 -90) rotate(${t * 40})`}><circle r={90} fill="none" stroke={W} strokeWidth={8} />{[0, 45, 90, 135].map((a) => <path key={a} d={`M${-90 * Math.cos((a * Math.PI) / 180)} ${-90 * Math.sin((a * Math.PI) / 180)} L${90 * Math.cos((a * Math.PI) / 180)} ${90 * Math.sin((a * Math.PI) / 180)}`} stroke={W} strokeWidth={4} />)}</g>
  </g>
);
const House: React.FC<{ t: number; door: number }> = ({ t, door }) => (
  <g filter="url(#ink)">
    <path d="M-420 0 L-420 -620 L420 -620 L420 0 Z" fill={INK} stroke={W} strokeWidth={7} />
    <path d="M-420 -620 L420 -620 L420 0 L120 0 Z" fill="url(#h2)" opacity={0.35} />
    {Array.from({ length: 9 }, (_, r) => <path key={r} d={`M-420 ${-60 - r * 62} L420 ${-60 - r * 62}`} stroke={W} strokeWidth={2} opacity={0.35} />)}
    <path d="M-460 -620 L460 -620 L460 -660 L-460 -660 Z" fill={INK} stroke={W} strokeWidth={6} />
    <rect x={-120} y={-380} width={240} height={380} fill="#120404" stroke={W} strokeWidth={7} />
    <rect x={-120} y={-380} width={240 * (1 - door)} height={380} fill={INK} stroke={W} strokeWidth={5} />
    <rect x={-120 + 240 * (1 - door)} y={-380} width={240 * door} height={380} fill="#FF6A1F" opacity={0.35 * door} />
    <rect x={200} y={-460} width={120} height={110} fill="#FF7A2A" opacity={0.55 + 0.1 * Math.sin(t * 7)} stroke={W} strokeWidth={6} />
  </g>
);
// río: banda con olas; sucio = barro, limpio = azul
const Water: React.FC<{ t: number; w: number; dirty: boolean; y?: number; front?: boolean }> = ({ t, w, dirty, y = -250, front }) => (
  <g>
    <rect x={-w / 2} y={y} width={w} height={front ? 600 : 900} fill={dirty ? "url(#mud)" : "url(#clear)"} opacity={front ? 0.88 : 1} />
    {Array.from({ length: front ? 6 : 14 }, (_, i) => <path key={i} d={`M${-w / 2 + ((i * 337 + t * 120) % w)} ${y + 20 + (i % 4) * 60} q60 -16 120 0 t120 0`} stroke={dirty ? "#C9A27A" : "#DDF2FF"} strokeWidth={4} fill="none" opacity={0.6} />)}
    <path d={`M${-w / 2} ${y} L${w / 2} ${y}`} stroke={W} strokeWidth={5} />
  </g>
);
const Reeds: React.FC<{ t: number; n: number; w: number; seed: number }> = ({ t, n, w, seed }) => (
  <g>{Array.from({ length: n }, (_, i) => { const x = -w / 2 + (w * i) / n + hash(i + seed) * 40; return <path key={i} d={`M${x} 0 Q${x + 8 + Math.sin(t * 2 + i) * 10} -120 ${x + Math.sin(t * 2.3 + i) * 24} ${-200 - hash(i * 3 + seed) * 160}`} stroke={W} strokeWidth={5} fill="none" opacity={0.85} />; })}</g>
);

export const Naaman: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? at("dos") - 0.35 : f / FPS;
  const cam0 = camAt(K, t);
  const c = { ...cam0, x: cam0.x + Math.sin(t * 1.3) * 6 + Math.sin(t * 3.1) * 2, y: cam0.y + Math.cos(t * 1.1) * 5 };
  const spots = t >= T_CLEAN ? 1 - ip(t, T_CLEAN, T_CLEAN + 0.3) : ip(t, at("lepra") - 0.05, at("lepra") + 0.3);
  const glow = ip(t, T_CLEAN - 0.1, T_CLEAN + 0.3) * (1 - ip(t, at("mándaselo") + 0.5, END));
  const dip = dipAt(t);
  const n = countAt(t);
  const furious = t >= at("naamán") && t < at("sus");
  const convinced = t >= at("sus") && t < at("mete");
  const flash = 0.45 * Math.exp(-Math.max(0, t - T_CLEAN) * 7) * (t >= T_CLEAN ? 1 : 0);
  const naaman = (extra: Partial<React.ComponentProps<typeof Person>>) => <Person t={t} seed={1} head="helmet" beard sash={RED} spots={spots} {...extra} />;
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <Defs />
      {fogDefs}
      <Sky cam={c} t={t} glow={c.x > DAMASCO - 3000 ? "rgba(255,170,90,0.55)" : glow > 0.2 ? "rgba(255,200,140,0.6)" : "rgba(211,15,23,0.75)"} stars={0.4} />
      <AbsoluteFill style={{ filter: "contrast(1.08)" }}>
        {/* ===== A · Naamán en su tierra ===== */}
        <L cam={c} d={9000} x={0} y={-900} noBlur><circle r={900} fill="#FF5A1F" opacity={0.16} /><circle r={420} fill="#FF7A2A" opacity={0.2} /></L>
        {[2400, 1500, 900].map((d, i) => <L key={d} cam={c} d={d} x={0} y={-40 + i * 10}><Hills w={[9000, 7000, 5000][i]} seed={i * 2 + 1} amp={[70, 50, 35][i]} hatch={i === 2} /></L>)}
        {[-900, 1100, 1600].map((x, i) => <L key={i} cam={c} d={700 + i * 200} x={x} y={0}><Palm t={t} seed={i} s={1.4} /></L>)}
        <L cam={c} d={0} x={0} y={0}>{naaman({ expr: t < at("lepra") ? "calm" : "sad", armR: 25, look: t > at("lepra") ? 6 : 0 })}</L>
        {/* ===== B · casa de Eliseo ===== */}
        <L cam={c} d={2200} x={HOUSE} y={-30}><Hills w={8000} seed={7} amp={60} /></L>
        <L cam={c} d={120} x={HOUSE} y={0}><House t={t} door={ip(t, at("solo") - 0.2, at("solo") + 0.3)} /></L>
        <L cam={c} d={60} x={HOUSE} y={0} o={ip(t, at("solo") - 0.1, at("solo") + 0.3)}><g transform="scale(0.8)"><Person t={t} seed={4} head="hair" cape={false} expr="calm" armR={60} talk={t > at("solo") && t < at("naamán")} /></g></L>
        <L cam={c} d={20} x={NX - 300} y={0}><Chariot t={t} /></L>
        <L cam={c} d={0} x={NX} y={0}>{naaman({ expr: furious ? "shout" : convinced ? (t > at("harías") ? "calm" : "sad") : "calm", armR: furious ? 120 : 20, armL: furious ? 40 : 15, talk: furious && t > at("no"), flip: true })}</L>
        {[-1, 1].map((sd, i) => <L key={i} cam={c} d={-40} x={NX + 380 + i * 260} y={0} o={ip(t, at("sus") - 0.2, at("sus") + 0.2) * (1 - ip(t, at("mete") - 0.3, at("mete")))}><g transform="scale(0.78)"><Person t={t} seed={7 + i} head="hair" cape={false} expr={i ? "smug" : "calm"} armL={75} armR={75} talk={i === 0 && t > at("si") && t < at("harías") + 0.4} flip={sd > 0} /></g></L>)}
        {/* ===== C · el río sucio (Jordán) ===== */}
        <L cam={c} d={2600} x={RIVER} y={-60}><Hills w={9000} seed={11} amp={50} /></L>
        <L cam={c} d={700} x={RIVER - 900} y={-250}><Reeds t={t} n={40} w={2600} seed={3} /></L>
        <L cam={c} d={400} x={RIVER} y={0}><Water t={t} w={9000} dirty y={-250} /></L>
        {Array.from({ length: 10 }, (_, i) => <L key={i} cam={c} d={300} x={RIVER - 600 + i * 140 + Math.sin(t * 9 + i) * 40} y={-500 + Math.cos(t * 11 + i) * 40}><circle r={6} fill={W} /></L>)}
        <L cam={c} d={0} x={RIVER} y={dip * 640 - 30}>{naaman({ expr: glow > 0.2 ? (t > T_CLEAN + 0.5 ? "happy" : "shock") : dip > 0.3 ? "closed" : t > at("vez") ? "sad" : "calm", armL: glow > 0.2 ? 150 : 30, armR: glow > 0.2 ? 150 : 30, glow, cape: false, wet: t > at("vez") ? 1 : 0 })}</L>
        <L cam={c} d={-10} x={RIVER} y={0}><Water t={t} w={4000} dirty y={-250} front /></L>
        {DIPS.map((d, i) => <L key={i} cam={c} d={-12} x={RIVER} y={-250} o={ip(t, d, d + 0.05) * (1 - ip(t, d + 0.1, d + 0.55))}><g>{Array.from({ length: 9 }, (_, j) => { const a = -Math.PI + (j / 8) * Math.PI; const k = ip(t, d, d + 0.5); return <circle key={j} cx={Math.cos(a) * (90 + k * 220)} cy={Math.sin(a) * (40 + k * 260) + k * k * 200} r={14 - k * 8} fill={i === 6 ? "#FFF2C8" : "#C9A27A"} />; })}</g></L>)}
        <L cam={c} d={-300} x={RIVER - 520} y={60}><Reeds t={t} n={14} w={700} seed={9} /></L>
        {/* ===== D · ríos de Damasco ===== */}
        <L cam={c} d={2400} x={DAMASCO} y={-80}>
          <Hills w={9000} seed={5} amp={30} />
          {[-700, -250, 300, 760].map((x, i) => <g key={i} transform={`translate(${x} -40)`}><path d={`M-110 0 L-110 -${260 + i * 40} Q0 -${420 + i * 40} 110 -${260 + i * 40} L110 0 Z`} fill={INK} stroke={W} strokeWidth={5} /><circle cx={0} cy={-(430 + i * 40)} r={14} fill="#FFC86A" /></g>)}
        </L>
        <L cam={c} d={500} x={DAMASCO} y={0}><Water t={t} w={9000} dirty={false} y={-200} /></L>
        {[-800, 700].map((x, i) => <L key={i} cam={c} d={260} x={DAMASCO + x} y={-200}><Palm t={t} s={1.5} seed={i + 4} /></L>)}
        <L cam={c} d={30} x={DAMASCO} y={-190}><Smoke t={t} seed={3} color="#FFE7B0" n={5} /></L>
      </AbsoluteFill>
      <Embers t={t} cam={c} o={0.8} />
      <Finish f={f} t={t} flash={flash} rays={glow > 0.2 ? 1.6 : 1} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 150, letterSpacing: 6, color: W, textShadow: "0 0 40px rgba(0,0,0,0.9)" }}>¿7 <span style={{ color: RED }}>VECES</span>?</div>
      ) : (
        <>
          {n > 0 && t < T_CLEAN + 0.2 ? <Tag t={t} a={DIPS[0]} b={T_CLEAN + 0.2} y={1380} size={180} color={n === 7 ? RED : W}>{n}</Tag> : null}
          <Tag t={t} a={at("no") + 0.1} b={at("sus") - 0.1} size={64}>ABANÁ · FARFAR</Tag>
          <Tag t={t} a={T_CLEAN + 0.4} b={at("mándaselo")} size={64}>2 REYES 5:14</Tag>
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("naaman/mezcla.wav")} />
      {[[at("lepra") - 0.05, "sfx/impact.wav", 0.3], [at("séptima") - 0.03, "sfx/drop.wav", 0.4], [T_CLEAN - 0.05, "sfx/shimmer.wav", 0.4]].map(([a, nm, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={60}><Audio src={staticFile(nm as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
