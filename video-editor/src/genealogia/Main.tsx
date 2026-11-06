import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/genealogia/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Ground, Robe } from "../adultera/Dark";
import { Manger, Shot, Star } from "../navidad/Main";

// ZK Dark · "En el árbol genealógico de Jesús hay una prostituta" (Mateo 1:3-6). Ritmo ~0,7 s, bucle al árbol inicial.
const TH = 0.1;
const END = 28.25;
export const GENEALOGIA_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["jesús", "prostituta", "sorpresa", "cuatro", "tamar", "rahab", "rut", "betsabé", "borrado", "primera", "perfecta", "salvar", "pasado"]);
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

// ---------- el árbol ----------
const BR = ["M540 1760 C530 1500 560 1300 540 1000", "M540 1360 C440 1300 330 1260 230 1150", "M545 1300 C650 1240 760 1200 860 1090", "M540 1150 C460 1080 400 980 330 900", "M542 1110 C620 1040 690 960 760 880", "M540 1000 C520 900 560 820 540 720", "M300 1190 C240 1120 200 1060 170 980", "M820 1120 C880 1050 910 990 930 920"];
const LEAVES: [number, number][] = [[230, 1150], [860, 1090], [330, 900], [760, 880], [540, 720], [170, 980], [930, 920], [430, 1000], [650, 1010], [400, 1230], [690, 1180], [600, 830], [470, 800]];
const SPECIAL = [9, 2, 6, 1]; // Rahab (la primera que se enciende), Tamar, Rut, Betsabé
const Tree: React.FC<{ grow: number; lit: (number | undefined)[]; glow?: number }> = ({ grow, lit, glow = 0 }) => (
  <g>
    <Ink>
      <path d="M470 1780 Q540 1700 610 1780 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
      {BR.map((d, i) => <Draw key={i} d={d} p={ip(grow, [i * 0.07, i * 0.07 + 0.45], [0, 1])} w={i === 0 ? 26 : 12} len={900} />)}
      <Draw d="M540 1760 C530 1500 560 1300 540 1000" p={grow} w={14} len={900} color="#050505" />
    </Ink>
    {LEAVES.map(([x, y], i) => {
      const k = ip(grow, [0.35 + i * 0.03, 0.55 + i * 0.03], [0, 1]);
      const on = lit[i] ?? 0;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 47) % 70 - 35}) scale(${k * (1 + on * 0.35)})`}>
          {on > 0 ? <ellipse cx={0} cy={0} rx={70} ry={44} fill={RED} opacity={0.35 * on} style={{ filter: "blur(18px)" }} /> : null}
          <Ink><path d="M-46 0 Q0 -36 46 0 Q0 36 -46 0 Z" fill={on > 0 ? RED : "#050505"} stroke="#F2F2F2" strokeWidth={5} /><path d="M-40 0 L40 0" stroke="#F2F2F2" strokeWidth={3} /></Ink>
        </g>
      );
    })}
    {glow > 0 ? <circle cx={540} cy={1000} r={600} fill={`rgba(242,242,242,${0.08 * glow})`} style={{ filter: "blur(40px)" }} /> : null}
  </g>
);
const litAt = (t: number, times: number[]) => { const l: number[] = []; SPECIAL.forEach((idx, k) => { l[idx] = ip(t, [times[k], times[k] + 0.2], [0, 1]); }); return l; };

// ---------- escenas ----------
// 1 · gancho: el árbol de Jesús; una hoja se enciende en rojo · MATEO 1:5
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const red = ip(t, [at("prostituta") - 0.05, at("prostituta") + 0.15], [0, 1]);
  const close = t >= at("prostituta");
  return (
    <AbsoluteFill style={{ transform: frozen !== undefined ? "none" : close ? `scale(${1.7 - ip(t, [at("prostituta"), at("prostituta") + 0.6], [0.2, 0])})` : `scale(${ip(t, [0, 2], [1.08, 1.0])})`, transformOrigin: "37% 64%" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Tree grow={frozen !== undefined ? 1 : eo(ip(t, [0, 1.4], [0.45, 1]))} lit={[, , , , , , , , , red]} />
        <text x={300} y={1330} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={44} fill="#F2F2F2" letterSpacing={6} opacity={red * 0.9}>MATEO 1:5</text>
        {frozen !== undefined ? <><Serif txt="¿UNA" y={560} size={130} /><BigRed txt="PROSTITUTA?" y={740} p={1} size={150} /></> : null}
      </svg>
    </AbsoluteFill>
  );
};
// 2 · no es la única: se encienden tres hojas más
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("única"), 1.2, 50, 52, -2], [at("sorpresa"), 1.0, 50, 55]]}>
    {(t) => <Tree grow={1} lit={litAt(t, [t0 - 9, at("no") + 0.1, at("única"), at("sorpresa")])} />}
  </Shot>
);
// 3 · Mateo, primera página: el libro se abre y salen cuatro siluetas
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 55], [at("primera"), 1.35, 50, 50, -2], [at("menciona"), 1.0, 50, 60], [at("cuatro"), 1.2, 50, 62, 2]]}>
    {(t) => {
      const open = eo(ip(t, [t0, t0 + 0.35], [0, 1]));
      const fig = (k: number) => eo(ip(t, [at("cuatro") + k * 0.12, at("cuatro") + 0.3 + k * 0.12], [0, 1]));
      return (
        <>
          <Ink>
            <path d={`M540 1100 Q${540 - 200 * open} 1060 ${540 - 380 * open} 1100 L${540 - 380 * open} 1600 Q${540 - 200 * open} 1560 540 1600 Z`} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            <path d={`M540 1100 Q${540 + 200 * open} 1060 ${540 + 380 * open} 1100 L${540 + 380 * open} 1600 Q${540 + 200 * open} 1560 540 1600 Z`} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            {open > 0.9 ? Array.from({ length: 6 }, (_, i) => <path key={i} d={`M190 ${1200 + i * 60} L500 ${1200 + i * 60} M580 ${1200 + i * 60} L890 ${1200 + i * 60}`} stroke="#F2F2F2" strokeWidth={4} opacity={0.55} />) : null}
          </Ink>
          <text x={345} y={1180} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={54} fill="#F2F2F2" opacity={open}>MATEO</text>
          <text x={735} y={1180} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={54} fill={RED} opacity={open}>1:1-17</text>
          {[0, 1, 2, 3].map((k) => <Robe key={k} x={240 + k * 200} y={1080 - fig(k) * 40} s={0.55 * fig(k) + 0.001} hood o={fig(k)} />)}
        </>
      );
    }}
  </Shot>
);
// 4 · Tamar: velo, cordón y bastón del suegro · GÉNESIS 38
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("engañó"), 1.45, 46, 40, -2]]}>
    {(t) => (
      <>
        <Robe x={460} y={1500} s={1.25} hood />
        <Ink><path d={`M${380} 920 Q460 ${880 + Math.sin(t * 5) * 8} 540 920 L560 1100 Q460 1130 360 1100 Z`} fill="url(#h1)" stroke="#F2F2F2" strokeWidth={5} opacity={0.9} /></Ink>
        <Ink><path d="M760 1500 L760 860 q0 -50 -40 -60" stroke="#F2F2F2" strokeWidth={12} fill="none" /><circle cx={760} cy={1180} r={30} fill={RED} /></Ink>
        <Ground y={1500} />
        <Serif txt="GÉNESIS 38" y={1680} size={66} o={ip(t, [t0 + 0.1, t0 + 0.25], [0, 0.9])} ls={8} />
      </>
    )}
  </Shot>
);
// 5 · Rahab: la muralla de Jericó y el cordón rojo en la ventana · JOSUÉ 2:18
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("prostituta", 1), 1.5, 52, 46, 2], [at("jericó"), 1.0, 50, 52]]}>
    {(t) => {
      const cord = eo(ip(t, [t0 + 0.15, t0 + 0.6], [0, 1]));
      return (
        <>
          <Ink>
            <rect x={-20} y={760} width={1120} height={900} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            {Array.from({ length: 9 }, (_, r) => Array.from({ length: 6 }, (_, c) => <rect key={`${r}${c}`} x={-20 + c * 190 + (r % 2) * 95} y={760 + r * 100} width={190} height={100} fill="none" stroke="#F2F2F2" strokeWidth={3} opacity={0.5} />))}
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-20 + i * 200} y={700} width={110} height={70} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
            <rect x={470} y={960} width={140} height={170} fill="#0d0d0d" stroke="#F2F2F2" strokeWidth={7} />
          </Ink>
          <path d={`M540 1130 Q${560 + Math.sin(t * 4) * 20} ${1130 + 250 * cord} ${540 + Math.sin(t * 3) * 14} ${1130 + 520 * cord}`} stroke={RED} strokeWidth={16} fill="none" strokeLinecap="round" />
          <Serif txt="JOSUÉ 2:18" y={1780} size={66} o={ip(t, [t0 + 0.2, t0 + 0.35], [0, 0.9])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 6 · Rut: espigas en el campo de Belén · RUT 2
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("extranjera"), 1.4, 40, 62, -2], [at("moabita"), 1.0, 50, 55]]}>
    {(t) => (
      <>
        <Ground y={1420} />
        {Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 66; const sw = Math.sin(t * 3 + i) * 10; return <Ink key={i}><path d={`M${x} 1700 Q${x + sw} 1520 ${x + sw * 1.6} 1300`} stroke="#F2F2F2" strokeWidth={4} fill="none" />{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={x + sw * 1.6 + (k % 2 ? 9 : -9)} cy={1300 + k * 22} rx={8} ry={16} fill="#050505" stroke="#F2F2F2" strokeWidth={3} />)}</Ink>; })}
        <g transform={`translate(${ip(t, [t0, t0 + 1.7], [-30, 30])} 0)`}><Robe x={430} y={1420} s={0.95} hood /></g>
        <Serif txt="RUT 2" y={720} size={70} o={ip(t, [t0 + 0.1, t0 + 0.25], [0, 0.9])} ls={10} />
      </>
    )}
  </Shot>
);
// 7 · Betsabé: la corona del rey David se agrieta · 2 SAMUEL 11
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("betsabé"), 1.3, 50, 48, 2], [at("adulterio"), 1.6, 50, 50, -2], [at("david"), 1.1, 50, 52]]}>
    {(t) => {
      const crack = eo(ip(t, [at("adulterio"), at("adulterio") + 0.3], [0, 1]));
      return (
        <>
          <Ink>
            <path d="M260 1260 L300 900 L420 1060 L540 860 L660 1060 L780 900 L820 1260 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={10} />
            <path d="M260 1260 L820 1260 L820 1360 L260 1360 Z" fill="url(#h1)" stroke="#F2F2F2" strokeWidth={10} />
            {[300, 540, 780].map((x, i) => <circle key={i} cx={x} cy={i === 1 ? 860 : 900} r={22} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
          </Ink>
          <Brush d="M560 840 L520 1000 L580 1120 L530 1380" p={crack} w={30} len={600} v />
          <Serif txt="2 SAMUEL 11" y={1560} size={66} o={ip(t, [t0 + 0.2, t0 + 0.35], [0, 0.9])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 8 · pudo haberlas borrado: la goma pasa y los nombres siguen
const NAMES = ["TAMAR", "RAHAB", "RUT", "BETSABÉ"];
const C8: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("borrado"), 1.25, 50, 50, 2]]}>
    {(t) => {
      const sweep = ip(t, [at("borrado") - 0.2, at("borrado") + 0.4], [-300, 1300]);
      return (
        <>
          {NAMES.map((n, i) => <text key={n} x={540} y={780 + i * 170} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={120} fill={i === 1 ? RED : "#F2F2F2"} letterSpacing={10} filter="url(#ink)">{n}</text>)}
          <g transform={`translate(${sweep} 0) rotate(-8 0 1000)`} opacity={0.85}><rect x={-140} y={620} width={140} height={740} fill="rgba(242,242,242,0.18)" style={{ filter: "blur(10px)" }} /><rect x={-40} y={640} width={60} height={700} rx={20} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></g>
        </>
      );
    }}
  </Shot>
);
// 9 · pero las dejó en la primera página: el libro se ilumina (subida de zk1)
const C9: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.3, 50, 55], [at("dejó"), 1.0, 50, 52], [at("primera", 1), 1.25, 50, 50, -2]]}>
    {(t) => {
      const lite = ip(t, [at("dejó"), at("dejó") + 0.4], [0, 1]);
      return (
        <>
          <circle cx={540} cy={1060} r={520} fill={`rgba(242,242,242,${0.12 * lite})`} style={{ filter: "blur(50px)" }} />
          <Ink>
            <path d="M540 760 Q380 720 160 760 L160 1360 Q380 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            <path d="M540 760 Q700 720 920 760 L920 1360 Q700 1320 540 1360 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          </Ink>
          {NAMES.map((n, i) => <text key={n} x={i % 2 ? 730 : 350} y={960 + Math.floor(i / 2) * 200} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={60} fill={RED} opacity={ip(lite, [i * 0.15, i * 0.15 + 0.3], [0, 1])}>{n}</text>)}
          <Serif txt="MATEO 1:3-6" y={1560} size={70} o={lite * 0.9} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 10 · ninguna familia perfecta: el árbol entero, todas sus hojas rojas arriba la estrella
const C10: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 55], [at("familia"), 1.3, 50, 40, -2], [at("perfecta"), 1.0, 50, 50]]}>
    {(t) => (
      <>
        <Tree grow={1} lit={LEAVES.map((_, i) => (SPECIAL.includes(i) ? 1 : ip(t, [at("perfecta") + i * 0.03, at("perfecta") + 0.2 + i * 0.03], [0, 0.0])))} glow={ip(t, [t0, t0 + 1], [0, 1])} />
        <Star x={540} y={560} r={ip(t, [at("familia"), at("familia") + 0.2], [0, 90]) + Math.sin(t * 8) * 6} />
      </>
    )}
  </Shot>
);
// 11 · vino a salvar: el pesebre bajo la estrella
const C11: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 45], [at("salvar"), 1.3, 50, 72, 2]]}>
    {(t) => (
      <>
        <path d={`M540 560 L360 1650 L720 1650 Z`} fill="rgba(242,242,242,0.12)" />
        <Star x={540} y={560} r={100 + Math.sin(t * 8) * 8} />
        <Ground y={1640} />
        <Manger x={540} y={1650} s={1.2} glow={1} />
      </>
    )}
  </Shot>
);
// 12 · mándaselo…: el árbol vuelve al plano inicial (bucle)
const C12: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  const back = eo(ip(t, [t0, END - 0.3], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${1.25 - 0.17 * back})`, transformOrigin: "37% 64%" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Tree grow={1} lit={litAt(t, [t0 - 9, t0 - 9, t0 - 9, t0 - 9]).map((v, i) => (i === 9 ? v : v * (1 - back)))} />
      </svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("y"), C2], [at("mateo"), C3], [at("tamar"), C4], [at("rahab"), C5], [at("rut"), C6], [at("y", 1), C7], [at("pudo"), C8], [at("pero"), C9], [at("porque"), C10], [at("vino", 1), C11], [at("mándaselo"), C12],
];
const SFX: [number, string, number][] = [[at("prostituta") - 0.05, "judas/golpe.wav", 0.4], [at("adulterio") - 0.05, "sfx/crack.wav", 0.3], [at("borrado") - 0.15, "sfx/whoosh.wav", 0.3], [at("dejó") - 0.05, "sfx/shimmer.wav", 0.3]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Genealogia: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 18 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 18 * kick}px) scale(${1 + 0.06 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={at("prostituta") + 0.8} /></AbsoluteFill> : null}
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
      <Sequence from={0}><Audio src={staticFile("genealogia/mezcla.wav")} /></Sequence>
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
