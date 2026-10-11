import React from "react";
import { alpha, mix } from "../ee46f/theme";

// El vaso: protagonista de todo el video. Coordenadas locales, centro en (0,0), ~470 de alto.
const TOP = -230;
const BOT = 232;
const xl = (y: number) => -150 + ((y - TOP) / (BOT - TOP)) * 35; // borde izquierdo a la altura y
const xr = (y: number) => -xl(y);
export const GLASS_PATH = `M${xl(TOP)} ${TOP} L${xl(BOT - 16)} ${BOT - 16} Q${xl(BOT)} ${BOT} ${xl(BOT) + 20} ${BOT} L${xr(BOT) - 20} ${BOT} Q${xr(BOT)} ${BOT} ${xr(BOT - 16)} ${BOT - 16} L${xr(TOP)} ${TOP} Z`;

// Grieta: tronco que nace en el borde derecho y ramas que se abren al crecer
const CRACK_MAIN = "M128 -120 L96 -84 L108 -40 L72 6 L84 52 L50 104 L60 150 L34 214";
const CRACK_BRANCH = [
  "M108 -40 L140 -14",
  "M72 6 L30 -6 L6 18",
  "M84 52 L120 80",
  "M50 104 L8 120 L-20 104",
  "M60 150 L104 176",
  "M30 -6 L20 -52 L-14 -70",
  "M8 120 L-6 168 L-48 190",
  "M-20 104 L-62 70 L-90 84",
];

// Fragmentos para la rotura: cuadrícula irregular dentro del contorno
type Shard = { pts: [number, number][]; cx: number; cy: number; seed: number };
const rows = [TOP, -140, -40, 60, 150, BOT];
const cols = [0, 0.3, 0.62, 1];
const jit = (r: number, c: number) => (Math.sin(r * 12.9 + c * 78.2) * 43758.5453) % 1;
const vx = (r: number, c: number) => {
  const y = rows[r];
  const t = c === 0 || c === cols.length - 1 ? cols[c] : cols[c] + jit(r, c) * 0.08;
  return [xl(y) + (xr(y) - xl(y)) * t, r === 0 || r === rows.length - 1 ? y : y + jit(c, r) * 26] as [number, number];
};
export const SHARDS: Shard[] = [];
for (let r = 0; r < rows.length - 1; r++) {
  for (let c = 0; c < cols.length - 1; c++) {
    const pts = [vx(r, c), vx(r, c + 1), vx(r + 1, c + 1), vx(r + 1, c)];
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4;
    const cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    SHARDS.push({ pts, cx, cy, seed: r * 3 + c });
  }
}

export type GlassProps = {
  id: string;
  hue: string; // color claro de la escena
  f: number;
  level?: number; // 0–1 nivel del agua
  crack?: number; // 0–1 tronco de la grieta
  branches?: number; // 0–1 ramas
  leak?: number; // 0–1 intensidad del goteo
  shatter?: number; // 0–1 rotura (fragmentos se separan)
  seams?: number; // 0–1 costuras de luz al rehacerse
  glow?: number;
};

export const Glass: React.FC<GlassProps> = ({ id, hue, f, level = 0, crack = 0, branches = 0, leak = 0, shatter = 0, seams = 0, glow = 1 }) => {
  const wy = BOT - 8 - level * (BOT - TOP - 40);
  const wob = Math.sin(f / 9) * 6 * Math.min(1, level * 4);
  const glassFill = `url(#${id}-gl)`;
  const edge = mix(hue, "#ffffff", 0.55);
  const L = 560;
  const broken = shatter > 0.001;

  return (
    <g>
      <defs>
        <linearGradient id={`${id}-gl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.16} />
          <stop offset="0.25" stopColor="#ffffff" stopOpacity={0.05} />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity={0.03} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.14} />
        </linearGradient>
        <linearGradient id={`${id}-wa`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(hue, "#ffffff", 0.35)} stopOpacity={0.95} />
          <stop offset="1" stopColor={mix(hue, "#000000", 0.35)} stopOpacity={0.9} />
        </linearGradient>
        <clipPath id={`${id}-in`}>
          <path d={GLASS_PATH} />
        </clipPath>
        <filter id={`${id}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* sombra / luz en el suelo */}
      <ellipse cx={0} cy={BOT + 18} rx={190} ry={22} fill={alpha(hue, 0.22 * glow)} filter={`url(#${id}-bloom)`} />

      {!broken && (
        <>
          <path d={GLASS_PATH} fill={glassFill} />
          {/* agua */}
          {level > 0.005 && (
            <g clipPath={`url(#${id}-in)`}>
              <path d={`M-200 ${wy} Q-75 ${wy - wob} 0 ${wy} T200 ${wy} L200 260 L-200 260 Z`} fill={`url(#${id}-wa)`} />
              <ellipse cx={0} cy={wy} rx={xr(wy) - 4} ry={10} fill={mix(hue, "#ffffff", 0.6)} opacity={0.55} />
            </g>
          )}
          <path d={GLASS_PATH} fill="none" stroke={edge} strokeWidth={5} strokeLinejoin="round" filter={`url(#${id}-bloom)`} opacity={0.9 * glow} />
          <ellipse cx={0} cy={TOP} rx={150} ry={16} fill="none" stroke={edge} strokeWidth={4} opacity={0.85 * glow} />
          {/* reflejos */}
          <path d={`M${xl(TOP) + 34} ${TOP + 40} L${xl(BOT) + 30} ${BOT - 40}`} stroke="#ffffff" strokeWidth={10} strokeLinecap="round" opacity={0.28} />
          <path d={`M${xl(TOP) + 62} ${TOP + 60} L${xl(TOP) + 68} ${TOP + 150}`} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.22} />
          {/* grieta */}
          {crack > 0.001 && (
            <g filter={`url(#${id}-bloom)`}>
              <path d={CRACK_MAIN} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - crack)} />
              {CRACK_BRANCH.map((d, k) => {
                const p = Math.max(0, Math.min(1, branches * CRACK_BRANCH.length - k));
                return p > 0 ? <path key={k} d={d} fill="none" stroke="#ffffff" strokeWidth={3} strokeDasharray={200} strokeDashoffset={200 * (1 - p)} opacity={0.9} /> : null;
              })}
            </g>
          )}
          {/* goteo por la grieta */}
          {leak > 0.01 &&
            Array.from({ length: 6 }, (_, k) => {
              const t = ((f * (0.9 + leak * 1.6) + k * 17) % 60) / 60;
              const y0 = 60 + (k % 3) * 40;
              return <circle key={k} cx={88 + (k % 2) * 10 + t * 10} cy={y0 + t * t * 420} r={7 * (1 - t * 0.5)} fill={mix(hue, "#ffffff", 0.4)} opacity={leak * (1 - t)} />;
            })}
        </>
      )}

      {/* rotura y reconstrucción */}
      {(broken || seams > 0.001) &&
        SHARDS.map((s, k) => {
          const dir = Math.atan2(s.cy, s.cx + 0.001) + Math.sin(s.seed * 3.1) * 0.4;
          const d = shatter * (220 + (s.seed % 4) * 70);
          const tx = Math.cos(dir) * d;
          const ty = Math.sin(dir) * d * 0.7 + shatter * shatter * 260;
          const rot = shatter * (s.seed % 2 ? 1 : -1) * (40 + s.seed * 9);
          const pts = s.pts.map((p) => p.join(",")).join(" ");
          return (
            <g key={k} transform={`translate(${tx} ${ty}) rotate(${rot} ${s.cx} ${s.cy})`} opacity={1 - shatter * 0.25}>
              <polygon points={pts} fill={glassFill} />
              <polygon points={pts} fill="none" stroke={edge} strokeWidth={broken ? 3 : 0} opacity={0.9} />
            </g>
          );
        })}
      {seams > 0.001 && !broken && (
        <g filter={`url(#${id}-bloom)`}>
          {SHARDS.map((s, k) => (
            <polygon key={k} points={s.pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#ffffff" strokeWidth={3} opacity={seams * 0.9} strokeDasharray={900} strokeDashoffset={900 * (1 - seams)} />
          ))}
          <path d={GLASS_PATH} fill="none" stroke={edge} strokeWidth={5} opacity={0.9} />
          <ellipse cx={0} cy={TOP} rx={150} ry={16} fill="none" stroke={edge} strokeWidth={4} opacity={0.85} />
        </g>
      )}
    </g>
  );
};

// Gotas que salpican al romperse
export const Splash: React.FC<{ t: number; hue: string }> = ({ t, hue }) => (
  <g>
    {Array.from({ length: 22 }, (_, k) => {
      const a = -Math.PI / 2 + Math.sin(k * 7.7) * 1.4;
      const v = 260 + (k % 5) * 70;
      const x = Math.cos(a) * v * t;
      const y = Math.sin(a) * v * t + 520 * t * t;
      return <circle key={k} cx={x} cy={y + 120} r={(4 + (k % 4) * 3) * (1 - t * 0.4)} fill={mix(hue, "#ffffff", 0.4)} opacity={Math.max(0, 1 - t * 1.1)} />;
    })}
  </g>
);
