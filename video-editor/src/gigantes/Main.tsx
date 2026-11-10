import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/gigantes/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { CK, Embers, Finish, Hills, INK, L, Person, RED, Sky, Smoke, Tag, W, camAt, eo, fogDefs, hash, ip } from "../dv2/Kit";

// ZK Dark v2 · Los gigantes (Génesis 6:4; Números 13:33). Gigantes → héroes → el cielo → hijos de Dios → los espías → ¿ángeles u hombres?
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const FIX: Record<string, string> = { Genesis: "Génesis", "cayos,": "caídos,", pareciamos: "parecíamos", quienes: "quiénes", a: "a", "ver,": "ver:" };
const WORDS: Word[] = RAW.map((c) => ({ w: FIX[c.text.trim()] ?? c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const END = 29.9;
export const GIGANTES_TOTAL = S(END);
const KEYS = new Set(["diluvio", "gigantes", "héroes", "famosos", "extraño", "padres", "dios", "hijas", "nacieron", "espías", "langostas", "ángeles", "caídos", "hombres", "eran"]);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

const GEN = 6000, SPY = 12000, DEB = 18000;
const K: CK[] = [
  [0, 0, -450, -900, 150],
  [at("gigantes") - 0.25, 20, -460, -800, 150],
  [at("gigantes") + 0.15, 300, -1300, -1400, 300, 1],
  [at("eran") - 0.4, 320, -1350, -1250, 300],
  [at("eran") + 0.1, 0, -900, -2600, 300, 1],
  [at("pero") - 0.2, 30, -950, -2400, 300],
  [at("pero") + 0.25, 0, -3200, -1500, 600, 1],
  [at("génesis") - 0.3, 0, -3300, -1200, 600],
  [at("génesis") + 0.1, GEN, -600, -1500, 0, 1],
  [at("siglos") - 0.3, GEN + 30, -620, -1250, 0],
  [at("siglos") + 0.1, SPY, -450, -1100, 0, 1],
  [at("espías") - 0.2, SPY + 10, -460, -1000, 0],
  [at("espías") + 0.15, SPY, -380, -720, 0, 1],
  [at("lado") - 0.4, SPY + 10, -380, -660, 0],
  [at("lado") - 0.2, SPY + 300, -1200, -1900, 800, 1],
  [at("langostas") - 0.15, SPY + 310, -1220, -1800, 800],
  [at("langostas") + 0.1, SPY, -380, -700, 0, 1],
  [at("unos") - 0.2, SPY + 10, -380, -640, 0],
  [at("unos") + 0.2, DEB, -560, -1500, 0, 1],
  [at("tú") - 0.2, DEB, -580, -1300, 0],
  [at("tú") + 0.1, DEB, -560, -1000, 0, 1],
  [END - 0.5, DEB, -570, -900, 0],
  [END, 0, -450, -900, 150, 1],
];

const Giant: React.FC<{ t: number; s: number; seed: number; spear?: boolean; walk?: number }> = ({ t, s, seed, spear, walk = 0 }) => (
  <g transform={`translate(${walk} ${-Math.abs(Math.sin(t * 2 + seed)) * 14 * (walk ? 1 : 0)}) scale(${s})`}>
    <Person t={t} seed={seed} head="helmet" beard cape sash={RED} expr="smug" armR={spear ? 170 : 20} hold={spear ? <path d="M0 0 L0 -520 M-14 -520 L0 -570 L14 -520 Z" stroke={W} strokeWidth={9} fill={W} /> : undefined} />
  </g>
);
const Being: React.FC<{ t: number; seed: number; glow: number; wings?: number; fallen?: boolean }> = ({ t, seed, glow, wings = 0, fallen }) => (
  <g>
    {wings > 0 ? [-1, 1].map((sd) => (
      <path key={sd} d={`M${sd * 60} -420 Q${sd * 360} ${-760 + Math.sin(t * 2) * 20} ${sd * 420} -300 Q${sd * 300} -360 ${sd * 260} -200 Q${sd * 200} -300 ${sd * 60} -300 Z`} fill={fallen ? "#1A0404" : "#FFF4DA"} stroke={fallen ? RED : W} strokeWidth={6} opacity={wings} transform={fallen ? `rotate(${sd * 18} ${sd * 60} -380)` : undefined} />
    )) : null}
    {glow > 0 ? <ellipse cx={0} cy={-400} rx={300} ry={460} fill="#FFF2C8" opacity={0.25 * glow} /> : null}
    <Person t={t} seed={seed} head="hood" cape={false} expr={fallen ? "angry" : "closed"} glow={glow} />
    {fallen ? <path d="M-60 -460 L-20 -380 L-50 -320" stroke={RED} strokeWidth={8} fill="none" /> : null}
  </g>
);
const Locust: React.FC = () => (
  <g filter="url(#ink)">
    <ellipse cx={0} cy={-40} rx={110} ry={34} fill={INK} stroke={W} strokeWidth={5} />
    <circle cx={110} cy={-50} r={26} fill={INK} stroke={W} strokeWidth={5} />
    <circle cx={120} cy={-56} r={6} fill={W} />
    <path d="M40 -30 L90 30 L140 10 M-10 -30 L-40 30 M10 -30 L20 30 M130 -70 Q170 -140 220 -150 M120 -72 Q150 -150 190 -170" stroke={W} strokeWidth={5} fill="none" />
    <path d="M-80 -60 Q0 -130 80 -60" fill="none" stroke={W} strokeWidth={4} opacity={0.7} />
  </g>
);
const Grapes: React.FC = () => (
  <g>
    <path d="M-260 -10 L260 -10" stroke={W} strokeWidth={8} />
    {Array.from({ length: 16 }, (_, i) => { const r = Math.floor(i / 4), c = i % 4; return <circle key={i} cx={-60 + c * 40 + (r % 2) * 20} cy={30 + r * 36} r={22} fill="#5A1A4A" stroke={W} strokeWidth={3} />; })}
  </g>
);

export const Gigantes: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? at("lado") + 0.2 : f / FPS;
  const cam0 = camAt(K, t);
  const c = { ...cam0, x: cam0.x + Math.sin(t * 1.3) * 6, y: cam0.y + Math.cos(t * 1.1) * 5 };
  const descend = eo(ip(t, at("padres") - 0.6, at("dice", 1) + 0.4));
  const unite = ip(t, at("unieron"), at("hijas"));
  const born = eo(ip(t, at("nacieron") - 0.1, at("ellos") + 0.3));
  const loc = eo(ip(t, at("langostas") - 0.05, at("langostas") + 0.25));
  const angel = Math.max(0.3, ip(t, at("ángeles") - 0.1, at("ángeles") + 0.2));
  const man = Math.max(0.3, ip(t, at("otros") - 0.1, at("otros") + 0.2));
  const q = ip(t, at("tú") - 0.1, at("tú") + 0.2);
  const lightning = (Math.sin(t * 3.7) > 0.97 ? 1 : 0) * (t < at("eran") ? 1 : 0.3);
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <Defs />
      {fogDefs}
      <Sky cam={c} t={t} glow={c.y < -2500 ? "rgba(255,240,200,0.35)" : "rgba(211,15,23,0.75)"} stars={c.y < -2500 ? 1 : 0.4} />
      <AbsoluteFill style={{ filter: "contrast(1.08)" }}>
        {/* ===== tierra antes del diluvio ===== */}
        <L cam={c} d={6000} x={0} y={-1400} noBlur>{Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={(i - 3) * 1300} cy={(i % 2) * 120} rx={900} ry={260} fill="#160909" stroke={W} strokeWidth={4} opacity={0.9} />)}</L>
        {[2600, 1500].map((d, i) => <L key={d} cam={c} d={d} x={0} y={-30}><Hills w={[11000, 8000][i]} seed={i + 2} amp={[90, 60][i]} hatch={i === 1} /></L>)}
        <L cam={c} d={900} x={-1500} y={0}><Giant t={t} s={2.4} seed={5} spear walk={Math.sin(t * 0.5) * 80} /></L>
        <L cam={c} d={300} x={300} y={0}><Giant t={t} s={2.8} seed={3} spear={t > at("eran")} walk={0} /></L>
        {Array.from({ length: 7 }, (_, i) => <L key={i} cam={c} d={150 + (i % 2) * 30} x={-500 + i * 180} y={0}><g transform="scale(0.36)"><Person t={t + i} seed={40 + i} head={i % 2 ? "hood" : "hair"} cape={false} expr={t > at("eran") ? "closed" : "shock"} armL={t > at("eran") && t < at("pero") ? 150 : 15} armR={t > at("eran") && t < at("pero") ? 150 : 15} look={-6} /></g></L>)}
        {/* ===== el cielo: algo baja ===== */}
        {Array.from({ length: 30 }, (_, i) => <L key={i} cam={c} d={900 + hash(i) * 2000} x={(hash(i + 1) - 0.5) * 5000} y={-2800 - hash(i + 2) * 1400} o={0.8}><circle r={7 + hash(i + 3) * 6} fill={W} /></L>)}
        <L cam={c} d={800} x={0} y={-3300}><ellipse cx={0} cy={0} rx={600} ry={220} fill="#FFF2C8" opacity={0.3} /><path d="M-400 0 Q0 -60 400 0 Q0 60 -400 0 Z" fill="#FFF8E0" opacity={0.7} /></L>
        {[-1, 0, 1].map((i) => <L key={i} cam={c} d={700} x={i * 380} y={-3200 + descend * 900}><g transform="scale(0.8)"><Being t={t} seed={60 + i} glow={1} /></g></L>)}
        {/* ===== Génesis 6 ===== */}
        <L cam={c} d={2400} x={GEN} y={-40}><Hills w={9000} seed={9} amp={50} /></L>
        {[-1, 1].map((sd, i) => <L key={i} cam={c} d={60} x={GEN - 380 + unite * 140 * (sd > 0 ? 0 : 1) + i * 300} y={0}><g transform="scale(0.95)"><Being t={t} seed={70 + i} glow={1 - unite * 0.4} /></g></L>)}
        {[0, 1].map((i) => <L key={i} cam={c} d={60} x={GEN + 380 - unite * 140 + i * 300} y={0}><g transform="scale(0.85)"><Person t={t} seed={80 + i} head="hood" cape={false} expr={unite > 0.5 ? "calm" : "shock"} flip /></g></L>)}
        <L cam={c} d={500} x={GEN + 200} y={0} o={born}><g transform={`scale(${0.8 + born * 2})`} opacity={0.85}><Person t={t} seed={90} head="helmet" cape expr="smug" sash={RED} /></g></L>
        {/* ===== los espías ===== */}
        <L cam={c} d={2600} x={SPY} y={-40}><Hills w={9000} seed={13} amp={70} /></L>
        <L cam={c} d={1400} x={SPY + 300} y={0}><Giant t={t} s={3.0} seed={7} spear walk={Math.sin(t * 0.7) * 160} /></L>
        <L cam={c} d={900} x={SPY - 900} y={0}><Giant t={t} s={2.6} seed={8} walk={Math.sin(t * 0.6 + 1) * 120} /></L>
        {[-1, 0, 1].map((i) => <L key={i} cam={c} d={20} x={SPY - 120 + i * 230} y={30}><g transform="scale(0.5)"><Person t={t} seed={100 + i} head="hood" beard={i !== 0} cape={false} expr={t > at("ver") ? "shock" : "calm"} look={4} armR={i === 0 ? 150 : 20} /></g></L>)}
        <L cam={c} d={10} x={SPY + 40} y={-230}><g transform="scale(0.6)"><Grapes /></g></L>
        <L cam={c} d={-20} x={SPY} y={40}><path d="M-700 0 Q-500 -260 -200 -200 Q100 -300 300 -180 Q600 -240 760 0 L760 300 L-700 300 Z" fill={INK} stroke={W} strokeWidth={6} /><path d="M-700 0 Q-500 -260 -200 -200 Q100 -300 300 -180" fill="none" stroke={RED} strokeWidth={4} opacity={0.6} /></L>
        <L cam={c} d={0} x={SPY + 380} y={-200} o={loc}><g transform={`scale(${0.4 + loc * 0.6})`}><Locust /></g></L>
        {/* ===== ¿ángeles u hombres? ===== */}
        <L cam={c} d={300} x={DEB} y={-60}><path d="M-3000 0 L3000 0" stroke={W} strokeWidth={3} opacity={0.4} /><path d="M0 -1400 L0 400" stroke={RED} strokeWidth={8} opacity={0.7} /></L>
        <L cam={c} d={0} x={DEB - 300} y={0} o={angel}><g transform="scale(0.85)"><Being t={t} seed={110} glow={0} wings={1} fallen /></g></L>
        <L cam={c} d={0} x={DEB + 300} y={0} o={man}><g transform="scale(0.85)"><Person t={t} seed={111} head="helmet" beard cape sash={RED} expr="smug" /></g></L>
        <L cam={c} d={-40} x={DEB} y={-560} o={q}><text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={520} fill={RED} opacity={0.9} style={{ filter: "drop-shadow(0 0 30px rgba(211,15,23,0.8))" }}>?</text></L>
        <L cam={c} d={200} x={DEB} y={-300}><Smoke t={t} seed={5} n={5} /></L>
      </AbsoluteFill>
      <Embers t={t} cam={c} o={0.7} />
      <Finish f={f} t={t} flash={lightning * 0.35 + 0.4 * Math.exp(-Math.max(0, t - at("padres")) * 5) * (t >= at("padres") ? 1 : 0)} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 130, letterSpacing: 6, color: W, textShadow: "0 0 40px rgba(0,0,0,0.9)" }}>¿QUIÉNES <span style={{ color: RED }}>ERAN</span>?</div>
      ) : (
        <>
          <Tag t={t} a={at("génesis") + 0.2} b={at("siglos")} size={64}>GÉNESIS 6:4</Tag>
          <Tag t={t} a={at("langostas")} b={at("unos")} size={64}>NÚMEROS 13:33</Tag>
          <Tag t={t} a={at("tú") - 0.05} b={END} y={1440} size={54}><span style={{ color: RED }}>1</span> = ÁNGELES · <span style={{ color: RED }}>2</span> = HOMBRES</Tag>
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("gigantes/mezcla.wav")} />
      {[[at("gigantes") - 0.05, "sfx/impact.wav", 0.35], [at("padres") - 0.05, "sfx/shimmer.wav", 0.4], [at("langostas") - 0.05, "sfx/pop.wav", 0.4], [at("tú") - 0.05, "sfx/impact.wav", 0.3]].map(([a, nm, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={60}><Audio src={staticFile(nm as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
