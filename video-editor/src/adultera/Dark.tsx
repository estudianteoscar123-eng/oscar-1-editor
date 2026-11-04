import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/adultera/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";
import { Face, Kneel, Serif } from "../sangre/Main";

// ZK Dark v2 · "La mujer adúltera" (Juan 8). Grabado blanco sobre negro; el rojo solo marca la condena.
const TH = 0.1;
const END = 35.2;
export const ADULTERA_DARK_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["único", "piedra", "adulterio", "ley", "jesús", "suelo", "pecado", "piedras", "él", "condeno", "señalan", "condenarte", "hacerlo"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const useT = (t0: number) => { const f = useCurrentFrame(); return { f, t: t0 + f / FPS }; };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{children}</svg>;
const BigRed: React.FC<{ txt: string; y: number; p: number; size?: number }> = ({ txt, y, p, size = 170 }) => (
  <g filter="url(#brushH)"><text x={540} y={y} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={size} fill={RED} stroke={RED} strokeWidth={6} style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{txt}</text></g>
);

// ---------- dibujos ----------
const Stone: React.FC<{ x: number; y: number; r: number; p?: number; seed?: string }> = ({ x, y, r, p = 1, seed = "s" }) => {
  const n = 8;
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.3; const k = r * (0.72 + 0.4 * random(`${seed}${i}`)); return [x + Math.cos(a) * k * 1.12, y + Math.sin(a) * k * 0.8]; });
  const mid = (i: number) => { const a = pts[i % n], b = pts[(i + 1) % n]; return `${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2}`; };
  const d = `M${mid(0)} ${pts.map((_, i) => `Q${pts[(i + 1) % n].join(" ")} ${mid(i + 1)}`).join(" ")} Z`;
  const id = `st${seed}${Math.round(x)}${Math.round(y)}`;
  return (
    <g filter="url(#ink)">
      <clipPath id={id}><rect x={x} y={y - r * 0.2} width={r * 1.4} height={r * 1.4} /></clipPath>
      <path d={d} fill="#050505" />
      <path d={d} fill="url(#h1)" clipPath={`url(#${id})`} opacity={0.8 * p} />
      <Draw d={d} p={p} w={Math.max(3, r / 14)} len={r * 8} />
      <Draw d={`M${x - r * 0.4} ${y - r * 0.2} Q${x} ${y - r * 0.45} ${x + r * 0.3} ${y - r * 0.15}`} p={ip(p, [0.5, 1], [0, 1])} w={Math.max(2, r / 24)} len={r * 2} />
    </g>
  );
};
// puño que sostiene una piedra, saliendo desde abajo
const Fist: React.FC<{ x: number; y: number; s: number; rot?: number; open?: number; stoneY?: number; dim?: boolean }> = ({ x, y, s, rot = 0, open = 0, stoneY = 0, dim }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={dim ? 0.4 : 1}>
    {open < 1 || stoneY > 0 ? <Stone x={0} y={-150 + stoneY} r={115} seed="fist" /> : null}
    <g filter="url(#ink)">
      <path d="M-62 60 L-80 900 L80 900 L62 60 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
      <path d="M-40 120 L-50 900 M10 120 L14 900" stroke="url(#h2)" strokeWidth={40} opacity={0.5} />
      {open < 0.5 ? (
        <>
          <path d="M-95 20 Q-100 110 -62 130 L62 130 Q100 110 95 20 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          {[-72, -24, 24, 72].map((k, i) => <rect key={k} x={k - 25} y={-70 + Math.abs(i - 1.5) * 10} width={50} height={110} rx={25} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
          {[-72, -24, 24, 72].map((k, i) => <path key={k} d={`M${k - 14} ${-30 + Math.abs(i - 1.5) * 10} q14 10 28 0`} stroke="#F2F2F2" strokeWidth={4} fill="none" />)}
          <rect x={-108} y={30} width={150} height={48} rx={24} transform="rotate(-12 -30 54)" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
          <rect x={-95} y={80} width={190} height={50} fill="url(#h1)" opacity={0.6} />
        </>
      ) : (
        <>
          <path d="M-95 100 Q-110 0 -90 -40 L90 -40 Q110 0 95 100 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          {[-70, -25, 20, 65].map((k, i) => <rect key={k} x={k - 18} y={-40 - 150 * open + i * 8} width={40} height={150 * open + 10} rx={20} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
          <rect x={-150} y={-10} width={40} height={120} rx={20} transform="rotate(-40 -130 50)" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
        </>
      )}
    </g>
  </g>
);
// mano que señala hacia la derecha (rotar para otras direcciones)
const Point: React.FC<{ x: number; y: number; s: number; rot: number; push?: number }> = ({ x, y, s, rot, push = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) translate(${push} 0) scale(${s})`} filter="url(#ink)">
    <path d="M-900 -55 L-90 -60 L-90 60 L-900 55 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    <path d="M-900 0 L-90 10" stroke="url(#h2)" strokeWidth={60} opacity={0.5} />
    <rect x={-110} y={-60} width={140} height={130} rx={40} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
    <rect x={10} y={-56} width={190} height={40} rx={20} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    {[0, 30, 60].map((k) => <path key={k} d={`M30 ${-10 + k} q20 12 0 26`} stroke="#F2F2F2" strokeWidth={5} fill="none" />)}
  </g>
);
// figura de pie con túnica
const Robe: React.FC<{ x: number; y: number; s: number; hood?: boolean; o?: number }> = ({ x, y, s, hood, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#ink)" opacity={o}>
    <path d="M-44 -370 Q-115 -300 -125 -100 L-175 0 L175 0 L125 -100 Q115 -300 44 -370 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    <path d="M20 -350 Q90 -250 110 0 L175 0 L125 -100 Q115 -300 44 -370 Z" fill="url(#h1)" opacity={0.7} />
    {hood ? <path d="M-62 -380 Q-60 -490 0 -495 Q60 -490 62 -380 Q30 -350 0 -352 Q-30 -350 -62 -380 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} /> : <circle cx={0} cy={-420} r={48} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />}
  </g>
);
// Jesús agachado escribiendo con el dedo
const Writer: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#ink)">
    <path d="M-150 -130 L-40 -120 Q60 -130 110 -80 L130 0 L-250 0 Q-230 -70 -150 -130 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    <path d="M-250 0 Q-230 -70 -150 -130 L-110 -126 Q-170 -60 -170 0 Z" fill="url(#h1)" opacity={0.7} />
    <path d="M-70 -400 Q20 -420 70 -360 Q40 -230 -30 -120 L-160 -130 Q-160 -300 -70 -400 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    <path d="M-160 -130 Q-160 -300 -70 -400 L-40 -398 Q-110 -300 -110 -126 Z" fill="url(#h1)" opacity={0.7} />
    <path d="M10 -350 Q140 -250 205 -14" stroke="#F2F2F2" strokeWidth={50} fill="none" strokeLinecap="round" />
    <path d="M10 -350 Q140 -250 205 -14" stroke="#050505" strokeWidth={38} fill="none" strokeLinecap="round" />
    <ellipse cx={80} cy={-440} rx={56} ry={50} fill="#050505" stroke="#F2F2F2" strokeWidth={6} transform="rotate(30 80 -440)" />
    <path d="M60 -490 Q130 -480 135 -410" stroke="url(#h1)" strokeWidth={26} fill="none" opacity={0.7} />
  </g>
);
const Ground: React.FC<{ y: number }> = ({ y }) => (
  <g filter="url(#ink)">
    <path d={`M-20 ${y} L1100 ${y} L1100 1940 L-20 1940 Z`} fill="#050505" />
    <path d={`M-20 ${y} L1100 ${y} L1100 ${y + 160} L-20 ${y + 160} Z`} fill="url(#h2)" opacity={0.22} />
    <Draw d={`M-20 ${y} L1100 ${y}`} p={1} w={5} />
  </g>
);
const Crowd: React.FC<{ y: number; n: number; s: number; o?: number }> = ({ y, n, s, o = 0.55 }) => (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => <Robe key={i} x={60 + (i * 960) / (n - 1)} y={y + (i % 2) * 30} s={s * (0.9 + 0.2 * random(`cr${i}`))} hood={i % 3 === 0} />)}</g>
);
const Stamp: React.FC<{ txt: string; p: number; y?: number; rot?: number }> = ({ txt, p, y = 1060, rot = -7 }) => (
  <g transform={`translate(540 ${y}) rotate(${rot}) scale(${ip(p, [0, 1], [1.7, 1])})`} opacity={ip(p, [0, 0.3], [0, 1])} filter="url(#ink)">
    <rect x={-400} y={-110} width={800} height={200} fill="none" stroke="#F2F2F2" strokeWidth={12} />
    <text x={0} y={42} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={130} fill="#F2F2F2" letterSpacing={8}>{txt}</text>
  </g>
);

// ---------- escenas ----------
// 1 · gancho: el puño con la primera piedra se levanta; PIEDRA en rojo
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 3], [1.1, 1.0])})` }}>
      <Svg>
        {[[130, 1660, -16], [330, 1740, -6], [750, 1740, 7], [950, 1660, 16]].map(([x, y, r], i) => <Fist key={i} x={x} y={y + ip(t, [0.1 + i * 0.12, 0.7 + i * 0.12], [400, 0])} s={0.8} rot={r} dim />)}
        <Fist x={540} y={1800 - 420 * eo(ip(t, [0.1, 0.7], [0, 1]))} s={1.75} />
        <Serif txt="LA PRIMERA" y={560} size={100} o={ip(t, [at("la") - 0.05, at("la") + 0.1], [0, 1])} ls={10} />
        <BigRed txt="PIEDRA" y={790} p={eo(ip(t, [at("piedra") - 0.05, at("piedra") + 0.22], [0, 1]))} size={230} />
      </Svg>
    </AbsoluteFill>
  );
};
// 2 · la mano abierta: no la tiró
const C2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <Svg>
        <Stone x={760} y={1560} r={80} seed="c2" />
        <Ground y={1640} />
        <Fist x={480} y={1180} s={1.6} open={eo(ip(t, [t0, t0 + 0.5], [0, 1]))} />
        <Serif txt="EL ÚNICO" y={640} size={120} o={ip(t, [at("único", 1) - 0.05, at("único", 1) + 0.1], [0, 1])} ls={10} />
        <BigRed txt="NO LA TIRÓ" y={1800} p={eo(ip(t, [at("no"), at("no") + 0.35], [0, 1]))} size={140} />
      </Svg>
    </AbsoluteFill>
  );
};
// 3 · la mujer de rodillas + sello ADULTERIO
const C3: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)"><circle cx={540} cy={1180} r={360} fill="url(#h1)" opacity={0.25} /><Draw d="M900 1180 A360 360 0 1 1 899.9 1179.5" p={ip(t, [t0, t0 + 0.6], [0, 1])} w={5} len={2300} /></g>
        <Ground y={1500} />
        <g filter="url(#ink)"><Kneel x={520} y={1470} s={1.5} color="#050505" /></g>
        <g filter="url(#ink)" opacity={0.9}><path d="M450 1010 m-60 0 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0" fill="none" stroke="#F2F2F2" strokeWidth={5} /></g>
        <Stamp txt="ADULTERIO" p={ip(t, [at("adulterio") - 0.05, at("adulterio") + 0.15], [0, 1])} y={700} />
      </Svg>
    </AbsoluteFill>
  );
};
// 4 · vista cenital: el círculo de todos y ella en medio
const C4: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `rotate(${ip(t, [t0, t0 + 2.2], [-4, 6])}deg) scale(${ip(t, [t0, t0 + 2.2], [1.25, 1.0])})` }}>
      <Svg>
        <g filter="url(#ink)">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2; const x = 540 + Math.cos(a) * 400, y = 1100 + Math.sin(a) * 400; const k = ip(t, [t0 + i * 0.04, t0 + 0.3 + i * 0.04], [0, 1]);
            return (
              <g key={i} opacity={k} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}>
                <ellipse cx={x} cy={y + 30} rx={80} ry={40} fill="#050505" stroke="#F2F2F2" strokeWidth={5} />
                <circle cx={x} cy={y} r={42} fill="url(#h1)" stroke="#F2F2F2" strokeWidth={5} />
                <Stone x={x + 70} y={y - 30} r={22} seed={`r${i}`} />
              </g>
            );
          })}
        </g>
        <circle cx={540} cy={1100} r={ip(t, [at("medio"), at("medio") + 0.3], [0, 46])} fill={RED} filter="url(#brushH)" />
        <circle cx={540} cy={1100} r={ip(t, [at("medio"), at("todos") + 0.4], [46, 160])} fill="none" stroke={RED} strokeWidth={6} opacity={ip(t, [at("medio"), at("todos") + 0.4], [0.9, 0])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 5 · la ley: las tablas, LEVÍTICO 20:10 y la lluvia de piedras
const C5: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const a0 = at("apedrearla");
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          {[-1, 1].map((sd) => {
            const x = 540 + sd * 170; const d = `M${x - 160} 1400 L${x - 160} 760 Q${x - 160} 600 ${x} 600 Q${x + 160} 600 ${x + 160} 760 L${x + 160} 1400 Z`;
            return <g key={sd}><path d={d} fill="#050505" /><path d={d} fill="url(#h2)" opacity={0.25} /><Draw d={d} p={ip(t, [t0, t0 + 0.5], [0, 1])} w={7} len={2300} />{[820, 920, 1020, 1120, 1220].map((y, i) => <Draw key={y} d={`M${x - 110} ${y} L${x + 110} ${y}`} p={ip(t, [t0 + 0.2 + i * 0.06, t0 + 0.4 + i * 0.06], [0, 1])} w={5} len={230} />)}</g>;
          })}
        </g>
        <Serif txt="LEVÍTICO 20:10" y={1520} size={78} o={ip(t, [at("ley") + 0.1, at("ley") + 0.3], [0, 1])} ls={4} />
        {Array.from({ length: 9 }, (_, i) => { const k = ip(t, [a0 + i * 0.07, a0 + 0.35 + i * 0.07], [0, 1]); return k > 0 ? <Stone key={i} x={150 + i * 98} y={-100 + k * (1760 - (i % 3) * 40)} r={46 + (i % 3) * 10} seed={`l${i}`} /> : null; })}
      </Svg>
    </AbsoluteFill>
  );
};
// 6 · todos señalan; «¿TÚ QUÉ DICES?»
const C6: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const q = ip(t, [at("tú") - 0.05, at("tú") + 0.15], [0, 1]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground y={1560} />
        <Robe x={540} y={1560} s={1.15} />
        <Point x={0} y={1040} s={0.9} rot={18} push={ip(t, [t0, t0 + 0.4], [-200, 140])} />
        <Point x={1080} y={980} s={0.9} rot={162} push={ip(t, [t0 + 0.1, t0 + 0.5], [-200, 140])} />
        <Point x={0} y={1380} s={0.8} rot={-8} push={ip(t, [t0 + 0.2, t0 + 0.6], [-200, 90])} />
        <g transform={`translate(540 600) scale(${ip(q, [0, 1], [0.6, 1])})`} opacity={q}>
          <rect x={-330} y={-80} width={660} height={150} rx={40} fill="#F2F2F2" />
          <path d="M-30 68 L0 120 L30 68 Z" fill="#F2F2F2" />
          <text x={0} y={22} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={70} fill="#050505">¿TÚ QUÉ DICES?</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
// 7 · PORTADA: Jesús se agacha y escribe en el suelo · ¿QUÉ ESCRIBIÓ?
const C7: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const w = ip(t, [at("escribió") - 0.1, at("suelo") + 0.3], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.9], [1.0, 1.1])})`, transformOrigin: "60% 75%" }}>
      <Svg>
        <Crowd y={1330} n={7} s={0.62} o={0.45} />
        <Ground y={1330} />
        <ellipse cx={720} cy={1600} rx={330} ry={70} fill="rgba(242,242,242,0.12)" />
        <Writer x={420} y={1610} s={1.35} />
        <g stroke="#F2F2F2" strokeWidth={9} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.9))" }}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${640 + i * 80} ${1625 + (i % 2) * 20} q22 -34 44 0 t44 0`} strokeDasharray={140} strokeDashoffset={140 * (1 - ip(w, [i * 0.22, i * 0.22 + 0.3], [0, 1]))} />)}
        </g>
        <Serif txt="¿QUÉ" y={680} size={150} o={frozen !== undefined ? 1 : ip(t, [at("escribió"), at("escribió") + 0.15], [0, 1])} />
        <BigRed txt="ESCRIBIÓ?" y={880} p={frozen !== undefined ? 1 : eo(ip(t, [at("escribió") + 0.1, at("suelo") + 0.1], [0, 1]))} size={180} />
      </Svg>
    </AbsoluteFill>
  );
};
// 8 · el rostro: «SIN PECADO»
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 2.2], [1.0, 1.12])})` }}>
      <Svg>
        <Face p={eo(ip(t, [t0, t0 + 0.9], [0.2, 1]))} s={1.05} />
        <Serif txt="«SIN PECADO»" y={1760} size={110} o={ip(t, [at("sinpecado"), at("sinpecado") + 0.15], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 9 · la primera piedra, gigante · JUAN 8:7
const C9: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.7], [1.15, 1.0])})` }}>
      <Svg>
        <Brush d="M-40 1080 L1120 1040" p={eo(ip(t, [at("piedra", 1) - 0.1, at("piedra", 1) + 0.25], [0, 1]))} w={200} len={1200} />
        <Stone x={540} y={1060} r={300} p={eo(ip(t, [t0, t0 + 0.7], [0, 1]))} seed="big" />
        <Serif txt="JUAN 8:7" y={1600} size={90} o={ip(t, [t0 + 0.3, t0 + 0.5], [0, 0.9])} ls={8} />
      </Svg>
    </AbsoluteFill>
  );
};
// 10 · uno a uno: las piedras caen y el contador baja de 7 a 0
const C10: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const drops = Array.from({ length: 7 }, (_, i) => at("uno") + i * 0.3);
  const landed = drops.filter((d) => t >= d + 0.35).length;
  const leave = ip(t, [at("fueron") - 0.2, at("fueron") + 0.5], [0, 1]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground y={1560} />
        <g opacity={1 - leave} transform={`translate(${leave * 200} 0)`}><Crowd y={1560} n={7} s={0.72} o={0.6} /></g>
        {drops.map((d, i) => { const k = ip(t, [d, d + 0.35], [0, 1]); const x = 120 + i * 140; return <Stone key={i} x={x} y={1150 + k * k * 380} r={40} seed={`d${i}`} />; })}
        <text x={540} y={900} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={330} fill={landed === 7 ? "#F2F2F2" : "#F2F2F2"} opacity={0.95} transform={`translate(540 800) scale(${1 + 0.12 * Math.exp(-(t - (drops[landed - 1] ?? -9) - 0.35) * 10)}) translate(-540 -800)`}>{7 - landed}</text>
        <Serif txt="PIEDRAS" y={1020} size={60} o={0.8} ls={14} />
      </Svg>
    </AbsoluteFill>
  );
};
// 11 · solo quedó él: plano enorme y vacío
const C11: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.3], [1.0, 1.08])})` }}>
      <Svg>
        <g filter="url(#ink)"><circle cx={540} cy={900} r={260} fill="url(#h1)" opacity={0.35} /><Draw d="M800 900 A260 260 0 1 1 799.9 899.5" p={1} w={5} len={1700} /></g>
        <Ground y={1420} />
        {Array.from({ length: 7 }, (_, i) => <Stone key={i} x={120 + i * 140 + (i % 2) * 30} y={1440 + (i % 3) * 30} r={20} seed={`d${i}`} />)}
        <Robe x={600} y={1420} s={0.55} />
        <g filter="url(#ink)"><Kneel x={450} y={1415} s={0.5} color="#050505" /></g>
      </Svg>
    </AbsoluteFill>
  );
};
// 12 · el único sin pecado: la cruz roja
const C12: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.3], [1.06, 1.0])})` }}>
      <Svg>
        <Brush d="M540 420 L540 1640" p={eo(ip(t, [at("único", 2) - 0.05, at("único", 2) + 0.35], [0, 1]))} w={140} len={1300} v />
        <Brush d="M200 760 L880 760" p={eo(ip(t, [at("sin", 0) - 0.05, at("sin", 0) + 0.3], [0, 1]))} w={130} len={720} />
        <Serif txt="EL ÚNICO" y={1780} size={110} o={ip(t, [t0, t0 + 0.15], [0, 1])} ls={10} />
      </Svg>
    </AbsoluteFill>
  );
};
// 13 · la mano que se acerca a la mujer
const C13: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const k = eo(ip(t, [t0, t0 + 1.1], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.2], [1.0, 1.1])})` }}>
      <Svg>
        <Point x={1080} y={760} s={1.1} rot={150} push={-100 + k * 330} />
        <Point x={0} y={1380} s={1.0} rot={-30} push={-100 + k * 290} />
        <circle cx={600} cy={1060} r={ip(t, [t0 + 0.8, t0 + 1.2], [0, 70])} fill="rgba(242,242,242,0.25)" style={{ filter: "blur(18px)" }} />
      </Svg>
    </AbsoluteFill>
  );
};
// 14 · NI YO TE CONDENO: el sello CULPABLE tachado en rojo
const C14: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.2], [1.0, 1.06])})` }}>
      <Svg>
        <Stamp txt="CULPABLE" p={ip(t, [t0, t0 + 0.15], [0, 1])} y={1000} />
        <Brush d="M120 880 L960 1130" p={eo(ip(t, [at("condeno"), at("condeno") + 0.3], [0, 1]))} w={56} len={1000} />
        <Serif txt="JUAN 8:11" y={1400} size={70} o={ip(t, [at("condeno") + 0.3, at("condeno") + 0.5], [0, 0.85])} ls={8} />
      </Svg>
    </AbsoluteFill>
  );
};
// 15 · vete y no peques más: ella camina hacia la luz, las piedras quedan atrás
const C15: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const k = ip(t, [t0, t0 + 2.2], [0, 1]);
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          <circle cx={540} cy={1000} r={300 + k * 60} fill="url(#h1)" opacity={0.45} />
          {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <Draw key={i} d={`M${540 + Math.cos(a) * 380} ${1000 + Math.sin(a) * 380} L${540 + Math.cos(a) * 560} ${1000 + Math.sin(a) * 560}`} p={ip(t, [t0 + i * 0.04, t0 + 0.4 + i * 0.04], [0, 1])} w={4} len={200} />; })}
        </g>
        <Ground y={1400} />
        {Array.from({ length: 5 }, (_, i) => <Stone key={i} x={180 + i * 180} y={1700 + (i % 2) * 60} r={50} seed={`d${i}`} />)}
        <Robe x={540} y={1400 - k * 60} s={1.0 - k * 0.45} hood />
      </Svg>
    </AbsoluteFill>
  );
};
// 16 · si sientes que todos te señalan
const C16: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const push = ip(t, [at("señalan") - 0.1, at("señalan") + 0.3], [0, 90]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 2.1], [1.0, 1.1])})` }}>
      <Svg>
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.4; const x = 540 + Math.cos(a) * 760, y = 1060 + Math.sin(a) * 760; return <Point key={i} x={x} y={y} s={0.75} rot={(a * 180) / Math.PI + 180} push={ip(t, [t0 + i * 0.08, t0 + 0.5 + i * 0.08], [-150, 260]) + push} />; })}
        <Draw d="M640 1060 A100 100 0 1 1 639.9 1059.5" p={ip(t, [t0, t0 + 0.5], [0, 1])} w={5} len={700} />
      </Svg>
    </AbsoluteFill>
  );
};
// 17 · recuerda: el puño con la piedra vuelve (callback del gancho)
const C17: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 3], [1.0, 1.14])})` }}>
      <Svg>
        <Brush d="M-40 1010 Q540 900 1120 960" p={eo(ip(t, [at("condenarte") - 0.1, at("condenarte") + 0.3], [0, 1]))} w={170} len={1300} />
        <Fist x={540} y={1240} s={1.7} />
        <Serif txt="DERECHO A CONDENARTE" y={1780} size={66} o={ip(t, [at("derecho"), at("derecho") + 0.15], [0, 1])} ls={4} />
      </Svg>
    </AbsoluteFill>
  );
};
// 18 · eligió no hacerlo: la mano se abre, la piedra cae · funde al gancho (bucle)
const C18: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const o = eo(ip(t, [at("no", 1) - 0.1, at("no", 1) + 0.3], [0, 1]));
  const fall = ip(t, [at("no", 1), at("hacerlo") + 0.4], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: ip(t, [END - 0.4, END], [1, 0]) }}>
      <Svg>
        <Ground y={1700} />
        <Fist x={540} y={1240} s={1.7} open={o} stoneY={fall * fall * 260} />
        <Serif txt="ELIGIÓ NO HACERLO" y={640} size={84} o={ip(t, [t0, t0 + 0.15], [0, 1])} ls={6} />
      </Svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("fue"), C2], [at("la", 2), C3], [at("y"), C4], [at("la", 4), C5],
  [at("y", 1), C6], [at("él"), C7], [at("y", 2), C8], [at("tire") - 0.2, C9], [at("uno"), C10], [at("solo"), C11],
  [at("el", 3), C12], [at("y", 4), C13], [at("ni"), C14], [at("vete"), C15], [at("así"), C16], [at("recuerda"), C17], [at("eligió"), C18],
];
const SCN = SC.slice().sort((a, b) => a[0] - b[0]);
const SFX: [number, string, number][] = [
  [at("piedra") - 0.05, "judas/golpe.wav", 0.4], [at("adulterio") - 0.1, "sfx/impact.wav", 0.3],
  [at("uno") + 0.35, "sfx/drop.wav", 0.35], [at("uno") + 1.25, "sfx/drop.wav", 0.3], [at("ni") - 0.15, "judas/pincel.wav", 0.4],
];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const AdulteraDark: React.FC<{ only?: number }> = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.93 + 0.07 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const cut = SCN.map((s) => s[0]).filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 9);
  const cutIn = Math.exp(-(t - cut) * 14);
  const cam = `translate(${Math.sin(f / 17) * 5 + (random(`kx${Math.floor(f)}`) - 0.5) * 14 * kick}px, ${Math.cos(f / 23) * 6 + (random(`ky${Math.floor(f)}`) - 0.5) * 14 * kick}px) rotate(${Math.sin(f / 41) * 0.5}deg) scale(${1 + 0.05 * kick + 0.08 * cutIn})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C7 t0={at("él")} frozen={at("suelo") + 0.6} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ opacity: flick, transform: cam }}>
        {SCN.map(([t0, C], i) => {
          const end = SCN[i + 1]?.[0] ?? END;
          return <Sequence key={i} from={S(t0)} durationInFrames={Math.max(1, S(end) - S(t0))}><C t0={t0} /></Sequence>;
        })}
      </AbsoluteFill>
      {t >= TH ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      {t >= TH ? <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} /> : null}
      <Sequence from={S(TH)}><Audio src={staticFile("adultera/mezcla.wav")} /></Sequence>
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
