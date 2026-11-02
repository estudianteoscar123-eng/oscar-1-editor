import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Figure, GodRays, Dust, Rain, Stars, Grain, Vignette, Captions, groupWords, Word as KWord } from "../kit/Kit";
import data from "../../public/pedro2/words.json";

// ZK · "Pedro camina sobre el agua" (Mateo 14:22–33). Noche, viento, la ola que hunde y la mano que rescata.
const FPS = 30;
export const PEDRO2_TOTAL = Math.round(22.4 * FPS);
const S = (t: number) => Math.round(t * FPS);


const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const out = Easing.out(Easing.cubic);
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

const C = { dolor: "#D3122B", capaz: "#16A34A", accion: "#D4A017", logro: "#2563EB", tu: "#9333EA", blanco: "#F1EEE8" };

// ---------- escenario ----------
const Night: React.FC<{ f: number; moon?: boolean }> = ({ f, moon = true }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(#03060C, #0B1622 52%, #142A38 60%)" }} />
    <Stars f={f} n={90} seed="pn" h={900} />
    {moon ? <div style={{ position: "absolute", left: 800 - 70, top: 300 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #FBFBF4, #D9DCE4 70%)", boxShadow: "0 0 120px rgba(230,236,255,0.55)" }} /> : null}
  </AbsoluteFill>
);

// mar: capas de olas con parallax; "amp" controla el oleaje
const wave = (f: number, y: number, amp: number, k: number, sp: number, seed: number) => {
  let d = `M-60 1980 L-60 ${y}`;
  for (let x = -60; x <= 1140; x += 24) {
    const yy = y + Math.sin(x * k + f * sp + seed) * amp + Math.sin(x * k * 2.3 - f * sp * 1.4 + seed * 2) * amp * 0.35;
    d += ` L${x} ${yy.toFixed(1)}`;
  }
  return d + " L1140 1980 Z";
};
const Sea: React.FC<{ f: number; y?: number; amp?: number; tilt?: number }> = ({ f, y = 1250, amp = 1, tilt = 0 }) => {
  const cols = ["#0E2430", "#0A1A24", "#071219", "#040A0F"];
  return (
    <AbsoluteFill style={{ transform: `rotate(${tilt}deg) scale(1.2)`, transformOrigin: "50% 60%" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {cols.map((c, i) => (
          <path key={i} d={wave(f, y + i * 130, (26 + i * 24) * amp, 0.007 - i * 0.001, 0.08 + i * 0.03, i * 1.7)} fill={c} stroke="rgba(150,210,230,0.18)" strokeWidth={2.5} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// reflejo de la luna en el agua
const Glint: React.FC<{ f: number; y: number }> = ({ f, y }) => (
  <>
    {Array.from({ length: 9 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 800 - 120 + random(`g${i}`) * 240 + Math.sin(f / 9 + i) * 10, top: y + i * 38, width: 60 + random(`gw${i}`) * 80, height: 4, borderRadius: 4, background: "rgba(230,240,255,0.45)", opacity: 0.4 + 0.4 * Math.sin(f / 6 + i) }} />
    ))}
  </>
);

// barco lejano (silueta)
const Boat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={520} height={260} style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    <path d="M20 110 L500 110 L450 180 L70 180 Z" fill="#0A0F14" />
    <rect x={250} y={-10} width={8} height={130} fill="#0A0F14" />
    <path d="M258 0 Q370 40 430 100 L258 100 Z" fill="#1A222A" />
  </svg>
);

// viento: rayas que cruzan la pantalla
const Wind: React.FC<{ f: number; n?: number; o?: number }> = ({ f, n = 26, o = 0.5 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const y = random(`wy${i}`) * 1700 + 80;
      const len = 120 + random(`wl${i}`) * 260;
      const x = ((random(`wx${i}`) * 1400 - f * (34 + random(`wv${i}`) * 26)) % 1400 + 1400) % 1400 - 200;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: len, height: 3, borderRadius: 3, background: `linear-gradient(90deg, rgba(200,230,255,0), rgba(200,230,255,${o}))` }} />;
    })}
  </>
);

// figura de Pedro sumergido: el agua sube y lo cubre
const Water: React.FC<{ level: number }> = ({ level }) => (
  <div style={{ position: "absolute", left: -200, right: -200, top: level, bottom: -200, background: "linear-gradient(#0E2A38, #06141C)", opacity: 0.95, boxShadow: "0 -12px 30px rgba(120,200,230,0.25)" }} />
);

// mano de luz que baja
const Hand: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o, overflow: "visible" }}>
    <defs>
      <filter id="hglow"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <path d={`M${x} -40 L${x - 20} ${y - 60} Q${x - 4} ${y - 8} ${x + 6} ${y}`} stroke="rgba(255,240,200,0.7)" strokeWidth={78} strokeLinecap="round" fill="none" filter="url(#hglow)" />
    <path d={`M${x} -40 L${x - 20} ${y - 60} Q${x - 4} ${y - 8} ${x + 6} ${y}`} stroke="#FFF2D6" strokeWidth={46} strokeLinecap="round" fill="none" />
    <ellipse cx={x + 8} cy={y + 6} rx={40} ry={34} fill="#FFF2D6" />
  </svg>
);

// halo de Jesús
const Halo: React.FC<{ f: number; x: number; y: number; r: number; o?: number }> = ({ f, x, y, r, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,246,220,${0.55 * o}), rgba(255,236,190,${0.18 * o}) 45%, rgba(255,230,170,0) 70%)`, transform: `scale(${1 + 0.03 * Math.sin(f / 18)})` }} />
);

// ---------- subtítulos ZK (estilo fijo: arriba, 1–3 palabras, clave enmarcada en azul) ----------
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: KWord[] = RAW.map((c) => ({ w: c.text.trim().replace("Sólo", "Solo"), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["barco", "viento", "contra", "caminas", "agua", "ola", "hundes", "mano", "toma", "jesús", "grita", "pregunta", "dudaste", "hoy", "él"]);

// ---------- escenas ----------
// 0 · 0–3,1: estás afuera del barco, con el viento en contra
const Scene0: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  return (
    <AbsoluteFill>
      <Night f={f} />
      <Sea f={f} y={1250} amp={0.6} />
      <Boat x={150} y={1120} s={0.9} />
      <Figure f={f} x={760} y={1330} h={250} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} arm={10} arm2={-10} shadow={false} o={0.95} />
      <Wind f={f} n={20} o={0.35} />
      <Rain f={f} n={120} o={0.3} />
    </AbsoluteFill>
  );
};
// 1 · 3,1–6,95: caminas sobre el agua (cámara baja, pies sobre el agua)
const Scene1: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const push = ip(f, [0, 110], [1.0, 1.45]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 74%" }}>
        <Night f={f} moon={false} />
        <Sea f={f} y={1380} amp={0.8} />
        <Glint f={f} y={1450} />
        <Figure f={f} x={540} y={1560} h={560} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} lean={ip(f, [0, 60], [0, 2])} o={1} />
        {/* anillos del paso sobre el agua */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 540 - 200 - i * 40, top: 1560 - 12 + i * 10, width: 400 + i * 80, height: 60 + i * 14, borderRadius: "50%", border: "3px solid rgba(160,220,240,0.5)", opacity: 0.8 - i * 0.2, transform: `scale(${1 + ((f + i * 12) % 36) / 60})` }} />
        ))}
      </AbsoluteFill>
      <Wind f={f} n={14} o={0.3} />
    </AbsoluteFill>
  );
};
// 2 · 6,95–9,5: la ola (miras la ola) y el viento (sólo ves el viento)
const Scene2: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const rise = ease(ip(f, [0, 22], [0, 1]));
  const shake = f > 36 ? 12 * (1 - Math.min(1, (f - 36) / 18)) : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${(random(`s2x${f}`) - 0.5) * shake}px, ${(random(`s2y${f}`) - 0.5) * shake}px)` }}>
      <Night f={f} moon={false} />
      <Sea f={f} y={1250 - rise * 260} amp={1 + rise * 1.2} />
      <Figure f={f} x={540} y={1640} h={520} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} head={ip(f, [30, 50], [0, 26])} shadow={false} />
      <Wind f={f + 40} n={46} o={0.7} />
    </AbsoluteFill>
  );
};
// 3 · 9,5–12,0: te hundes… y una mano te toma
const Scene3: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const sink = ip(f, [0, 60], [1500, 1080]);
  const hand = ip(f, [40, 62], [0, 1]);
  return (
    <AbsoluteFill>
      <Night f={f} moon={false} />
      <Sea f={f} y={1250} amp={1.8} />
      <Figure f={f} x={540} y={1640 - (f * 1.5)} h={520} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} head={-20} shadow={false} />
      <Water level={sink} />
      {/* burbujas al hundirse */}
      {Array.from({ length: 14 }, (_, i) => {
        const life = 30 + random(`bl${i}`) * 25;
        const tt = (f + random(`bo${i}`) * life) % life;
        return <div key={i} style={{ position: "absolute", left: 420 + random(`bx${i}`) * 240, top: 1400 - tt * 10, width: 10 + random(`bw${i}`) * 14, height: 10 + random(`bw${i}`) * 14, borderRadius: "50%", border: "2px solid rgba(200,240,255,0.7)", opacity: ip(tt, [0, 6, life], [0, 1, 0]) }} />;
      })}
      <Hand x={560} y={ip(hand, [0, 1], [-200, 1080])} o={hand} />
      <Wind f={f + 10} n={24} o={0.4} />
    </AbsoluteFill>
  );
};
// 4 · 12,0–16,7: Jesús no te grita, te pregunta
const Scene4: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const lift = ease(ip(f, [0, 30], [0, 1]));
  return (
    <AbsoluteFill>
      <Night f={f} moon={false} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 42%, rgba(255,236,190,${0.35 + 0.1 * Math.sin(f / 20)}), rgba(0,0,0,0) 70%)` }} />
      <Sea f={f} y={1300} amp={0.8} />
      <Halo f={f} x={540} y={760} r={230} o={1} />
      <Figure f={f} x={600} y={1300} h={700} rim="#FFF6DA" rimSide={1} cloth="#F4EEE2" hood={false} glow={0.9} shadow={false} head={-6} />
      <Figure f={f} x={380} y={1440 - lift * 60} h={360} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} arm={ip(lift, [0, 1], [10, 120])} o={0.95} />
      <GodRays f={f} x={540} y={-100} color="#FFF0C8" o={0.22 + 0.1 * Math.sin(f / 14)} n={9} spread={120} />
      <Dust f={f} n={28} color="255,240,200" seed="pd" />
    </AbsoluteFill>
  );
};
// 5 · 16,7–19,7: ¿por qué dudaste?
const Scene5: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const pulse = ip(f, [0, 4, 30], [0, 1, 0.6]);
  return (
    <AbsoluteFill style={{ background: "#020408" }}>
      <Halo f={f} x={540} y={820} r={300} o={0.6} />
      <Sea f={f} y={1400} amp={0.6} />
      <Figure f={f} x={520} y={1450} h={420} rim="#FFF6DA" rimSide={1} cloth="#F4EEE2" hood={false} glow={0.6} shadow={false} />
      <Figure f={f} x={360} y={1500} h={300} rim="#9FD8FF" rimSide={-1} cloth="#3A4650" hood={false} head={16} o={0.9} />
      <Vignette s={0.8} />
    </AbsoluteFill>
  );
};
// 6 · 19,7–22,4: la ola o él
const Scene6: React.FC<{ o?: number }> = ({ o = 0 }) => {
  const f = useCurrentFrame() + o;
  const toHim = f >= S(21.2 - 19.7);
  return (
    <AbsoluteFill style={{ background: "#03060B" }}>
      {/* lado de la ola (izquierda) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1920, overflow: "hidden", opacity: toHim ? 0.25 : 1 }}>
        <Sea f={f} y={1150} amp={2} />
      </div>
      {/* lado de él (derecha) */}
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden", background: `radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,240,200,${toHim ? 0.7 : 0.1}), rgba(0,0,0,0) 70%)` }}>
        <Figure f={f} x={270} y={1450} h={480} rim="#FFF6DA" rimSide={1} cloth="#F4EEE2" hood={false} glow={toHim ? 1 : 0.3} shadow={false} />
      </div>
      <Wind f={f} n={16} o={0.3} />
      <div style={{ position: "absolute", left: 540, top: 0, width: 2, height: 1920, background: "rgba(255,255,255,0.25)" }} />
    </AbsoluteFill>
  );
};

// ---------- montaje dinámico: un plano cada ~0,9 s ----------
const SCENES: React.FC<{ o?: number }>[] = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
const SC = [0, 3.1, 6.95, 9.5, 12.0, 16.7, 19.7];
// [inicio, escena, zoom inicial, zoom final, punto x, punto y, giro]
type Shot = [number, number, number, number, number, number, number];
const SHOTS: Shot[] = [
  [0, 0, 1.25, 1.05, 540, 1150, -2],
  [0.9, 0, 2.3, 2.6, 760, 1240, 1],
  [1.8, 0, 1.9, 1.7, 300, 1180, -1],
  [2.32, 0, 1.15, 1.3, 540, 1100, -5],
  [3.1, 1, 2.2, 1.9, 540, 1560, 0],
  [3.94, 1, 1.15, 1.35, 540, 1300, 2],
  [5.22, 1, 2.8, 3.1, 540, 1580, -1],
  [6.12, 1, 2.4, 2.7, 540, 1040, 1],
  [6.92, 2, 1.0, 1.25, 540, 1200, 3],
  [7.6, 2, 2.3, 2.5, 540, 1180, -2],
  [8.58, 2, 1.3, 1.5, 540, 1250, -6],
  [9.5, 3, 1.3, 1.5, 540, 1300, 0],
  [10.06, 3, 2.1, 2.4, 540, 1280, 4],
  [10.96, 3, 1.6, 1.4, 540, 1150, -2],
  [11.44, 3, 1.0, 1.15, 540, 900, 0],
  [12.0, 4, 1.45, 1.05, 540, 1000, 0],
  [13.18, 4, 2.2, 2.4, 600, 720, 1],
  [14.02, 4, 1.35, 1.5, 500, 1000, -1],
  [15.18, 4, 1.9, 2.1, 470, 1180, 1],
  [16.7, 5, 1.0, 1.2, 540, 1200, 0],
  [17.16, 5, 1.6, 1.8, 480, 1250, -3],
  [18.36, 5, 1.0, 1.35, 540, 1100, 0],
  [19.7, 6, 1.05, 1.0, 540, 960, 0],
  [20.12, 6, 1.7, 1.9, 270, 1250, -2],
  [21.2, 6, 1.7, 1.5, 810, 1150, 2],
  [21.6, 6, 1.25, 1.1, 540, 1050, 0],
];
// palabras clave: sacudida + golpe de zoom
const IMPACTS = [0.0, 2.32, 6.92, 8.58, 10.06, 11.98, 14.02, 17.16, 18.96, 21.6];
const impactAt = (f: number) => IMPACTS.reduce((o, t) => { const d = f - S(t); return d >= 0 && d < 10 ? Math.max(o, 1 - d / 10) : o; }, 0);

const Shot: React.FC<{ sh: Shot; len: number }> = ({ sh, len }) => {
  const f = useCurrentFrame();
  const [t, k, z0, z1, ox, oy, rot] = sh;
  const Cmp = SCENES[k];
  const z = interpolate(f, [0, len], [z0, z1], { extrapolateRight: "clamp" }) * ip(f, [0, 6], [1.12, 1]);
  const pan = Math.min(1, (z - 1) * 1.1);
  const jx = Math.sin(f / 7 + t) * 5 + Math.sin(f / 3.1) * 2;
  const jy = Math.cos(f / 8 + t) * 5;
  const blur = ip(f, [0, 3], [10, 0]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${ox}px ${oy}px`, transform: `translate(${(540 - ox) * pan + jx}px, ${(960 - oy) * pan + jy}px) scale(${z}) rotate(${rot * ip(f, [0, len], [0.4, 1])}deg)`, filter: `blur(${blur}px)` }}>
        <Cmp o={S(t - SC[k]) + f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// rayo de tormenta (cielo) en el gancho y en "sólo ves el viento"
const BOLTS = [0.1, 2.3, 8.55];
const Lightning: React.FC<{ f: number }> = ({ f }) => {
  const b = BOLTS.find((t) => f >= S(t) && f < S(t) + 9);
  if (b === undefined) return null;
  const d = f - S(b);
  let x = 200 + random(`bx${b}`) * 680;
  let path = `M${x} -20`;
  for (let i = 1; i <= 8; i++) { x += (random(`b${b}${i}`) - 0.5) * 170; path += ` L${x} ${i * 120}`; }
  const o = d < 2 ? 1 : d < 4 ? 0.3 : d < 5 ? 0.8 : ip(d, [5, 9], [0.6, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(170,200,255,${0.32 * o})`, mixBlendMode: "screen" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o }}>
        <path d={path} stroke="#EAF2FF" strokeWidth={7} fill="none" style={{ filter: "drop-shadow(0 0 18px #9CC8FF) drop-shadow(0 0 44px #6AA8FF)" }} />
      </svg>
    </AbsoluteFill>
  );
};

// salpicadura al hundirse
const Splash: React.FC<{ f: number }> = ({ f }) => {
  const d = f - S(10.06);
  if (d < 0 || d > 40) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 46 }, (_, i) => {
        const a = Math.PI * (0.1 + 0.8 * random(`sa${i}`));
        const v = 14 + random(`sv${i}`) * 26;
        const r = 6 + random(`sr${i}`) * 16;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * v * d * (random(`sd${i}`) > 0.5 ? 1 : -1), top: 1250 - Math.sin(a) * v * d + 0.9 * d * d, width: r, height: r, borderRadius: "50%", background: "rgba(205,235,250,0.9)", opacity: ip(d, [0, 30, 40], [1, 0.8, 0]) }} />;
      })}
    </AbsoluteFill>
  );
};

const SFX: [number, string, number][] = [
  [0.05, "jonas/trueno", 0.4], [6.88, "sfx/whoosh", 0.45], [8.5, "jonas/trueno", 0.3],
  [10.0, "jonas/agua", 0.55], [11.95, "sfx/shimmer", 0.4], [21.58, "sfx/impact", 0.5],
];
const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={S(t)} durationInFrames={90}>
    <Audio src={staticFile(`${name}.wav`)} volume={v} />
  </Sequence>
);

export const Pedro2: React.FC = () => {
  const f = useCurrentFrame();
  const imp = impactAt(f);
  const warm = ip(f - S(11.98), [0, 2, 12], [0, 0.55, 0]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.1) saturate(1.12)", transform: `translate(${(random(`ix${f}`) - 0.5) * 22 * imp}px, ${(random(`iy${f}`) - 0.5) * 22 * imp}px) scale(${1 + 0.05 * imp})` }}>
        {SHOTS.map((sh, i) => {
          const end = SHOTS[i + 1]?.[0] ?? 22.4;
          return (
            <Sequence key={i} from={S(sh[0])} durationInFrames={S(end) - S(sh[0])}>
              <Shot sh={sh} len={S(end) - S(sh[0])} />
            </Sequence>
          );
        })}
        <Lightning f={f} />
        <Splash f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,232,190,${warm})`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <Grain f={f} />
      <Vignette s={0.75} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("pedro2/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
