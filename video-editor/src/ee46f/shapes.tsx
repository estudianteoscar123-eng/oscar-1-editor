import React from "react";
import { Pal, mix } from "./theme";

// Ilustración plana monocroma: todo se pinta con tonos de un solo color por escena
export const Defs: React.FC<{ id: string; pal: Pal }> = ({ id, pal }) => (
  <defs>
    <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={mix(pal.l, "#ffffff", 0.25)} />
      <stop offset="1" stopColor={mix(pal.l, pal.m, 0.45)} />
    </linearGradient>
    <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stopColor={mix(pal.l, pal.m, 0.15)} />
      <stop offset="1" stopColor={mix(pal.m, "#000000", 0.1)} />
    </linearGradient>
    <linearGradient id={`${id}-pants`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={mix(pal.m, "#000000", 0.3)} />
      <stop offset="1" stopColor={mix(pal.m, "#000000", 0.62)} />
    </linearGradient>
    <linearGradient id={`${id}-obj`} x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor={mix(pal.l, "#ffffff", 0.2)} />
      <stop offset="1" stopColor={pal.m} />
    </linearGradient>
    <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={mix(pal.m, "#000000", 0.35)} />
      <stop offset="1" stopColor={mix(pal.m, "#000000", 0.75)} />
    </linearGradient>
    <radialGradient id={`${id}-screen`} cx="0.5" cy="0.35" r="0.8">
      <stop offset="0" stopColor={mix(pal.l, "#ffffff", 0.35)} />
      <stop offset="0.55" stopColor={pal.m} />
      <stop offset="1" stopColor={mix(pal.m, "#000000", 0.6)} />
    </radialGradient>
    <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
      <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0" result="b2" />
      <feMerge>
        <feMergeNode in="b2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export type Pt = [number, number];
const L1 = 128;
const L2 = 118;

// Cinemática inversa de dos huesos: dado hombro y mano, calcula el codo hacia fuera
const ik = (S: Pt, H: Pt, out: number): [Pt, Pt] => {
  const dx = H[0] - S[0];
  const dy = H[1] - S[1];
  const raw = Math.hypot(dx, dy) || 1;
  const ux = dx / raw;
  const uy = dy / raw;
  const d = Math.min(Math.max(raw, Math.abs(L1 - L2) + 2), L1 + L2 - 2);
  const hand: Pt = [S[0] + ux * d, S[1] + uy * d];
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const px = S[0] + ux * a;
  const py = S[1] + uy * a;
  const e1: Pt = [px - uy * h, py + ux * h];
  const e2: Pt = [px + uy * h, py - ux * h];
  return [(e2[0] - e1[0]) * out > 0 ? e2 : e1, hand];
};

export type Pose = { l: Pt; r: Pt; spread?: number; lean?: number; step?: number };
export const POSES = {
  stand: { l: [-124, -198], r: [124, -198] },
  phone: { l: [-12, -388], r: [38, -402] },
  lift: { l: [-158, -690], r: [158, -690], spread: 18 },
  hips: { l: [-70, -292], r: [70, -292], spread: 22 },
  hush: { l: [-124, -198], r: [6, -506] },
  point: { l: [-124, -198], r: [282, -446] },
  cross: { l: [52, -360], r: [-52, -350] },
} satisfies Record<string, Pose>;

// Persona sin rostro (como en las referencias), pies en (0,0), ~600 de alto
export const Figure: React.FC<{ id: string; pal: Pal; x: number; y: number; s?: number; pose: Pose; o?: number; flip?: boolean; children?: React.ReactNode }> = ({
  id,
  pal,
  x,
  y,
  s = 1,
  pose,
  o = 1,
  flip,
  children,
}) => {
  const sp = pose.spread ?? 6;
  const st = pose.step ?? 0;
  const hair = mix(pal.m, "#000000", 0.55);
  const shoe = mix(pal.m, "#000000", 0.78);
  const line = mix(pal.m, "#000000", 0.45);
  const arm = (side: -1 | 1, H: Pt) => {
    const S: Pt = [side * 80, -440];
    const [E, Hd] = ik(S, H, side);
    const sl: Pt = [S[0] + (E[0] - S[0]) * 0.62, S[1] + (E[1] - S[1]) * 0.62];
    return (
      <g key={side}>
        <path d={`M${S[0]} ${S[1]} L${E[0]} ${E[1]} L${Hd[0]} ${Hd[1]}`} stroke={`url(#${id}-skin)`} strokeWidth={27} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${S[0]} ${S[1]} L${sl[0]} ${sl[1]}`} stroke={`url(#${id}-shirt)`} strokeWidth={42} strokeLinecap="round" fill="none" />
        <circle cx={Hd[0]} cy={Hd[1]} r={17} fill={`url(#${id}-skin)`} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${pose.lean ?? 0})`} opacity={o} filter={`url(#${id}-glow)`}>
      {/* piernas y zapatos */}
      <path d={`M-30 -282 L${-36 - sp - st} -26`} stroke={`url(#${id}-pants)`} strokeWidth={50} strokeLinecap="round" />
      <path d={`M30 -282 L${36 + sp - st} -26`} stroke={`url(#${id}-pants)`} strokeWidth={50} strokeLinecap="round" />
      <ellipse cx={-44 - sp - st} cy={-12} rx={33} ry={14} fill={shoe} />
      <ellipse cx={44 + sp - st} cy={-12} rx={33} ry={14} fill={shoe} />
      {/* torso */}
      <path
        d="M-80 -452 C-96 -444 -95 -416 -90 -398 L-68 -272 C-40 -262 40 -262 68 -272 L90 -398 C95 -416 96 -444 80 -452 C50 -470 -50 -470 -80 -452 Z"
        fill={`url(#${id}-shirt)`}
      />
      <path d="M-66 -278 L66 -278" stroke={line} strokeWidth={7} strokeLinecap="round" />
      {/* cuello y cabeza */}
      <path d="M-17 -502 L-17 -462 Q0 -450 17 -462 L17 -502 Z" fill={mix(pal.l, pal.m, 0.55)} />
      <path d="M-26 -466 Q0 -440 26 -466" stroke={line} strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={-39} cy={-532} rx={8} ry={12} fill={mix(pal.l, pal.m, 0.4)} />
      <ellipse cx={39} cy={-532} rx={8} ry={12} fill={mix(pal.l, pal.m, 0.4)} />
      <ellipse cx={0} cy={-536} rx={39} ry={47} fill={`url(#${id}-skin)`} />
      <path d="M-41 -538 C-48 -586 -22 -602 6 -600 C36 -598 52 -578 43 -536 C38 -556 24 -566 6 -566 C-14 -567 -30 -556 -41 -538 Z" fill={hair} />
      {arm(-1, pose.l)}
      {arm(1, pose.r)}
      {children}
    </g>
  );
};

// ---------- objetos ----------
export const Phone: React.FC<{ id: string; w?: number; h?: number; children?: React.ReactNode }> = ({ id, w = 360, h = 720, children }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.12} fill={`url(#${id}-dark)`} stroke={`url(#${id}-obj)`} strokeWidth={6} />
    <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} rx={w * 0.09} fill={`url(#${id}-screen)`} />
    <rect x={-w * 0.14} y={-h / 2 + 30} width={w * 0.28} height={h * 0.035} rx={h * 0.02} fill="#000" opacity={0.75} />
    {children}
  </g>
);

export const Bubble: React.FC<{ id: string; w: number; h: number; tail?: "l" | "r"; fill?: string; children?: React.ReactNode }> = ({ id, w, h, tail = "l", fill, children }) => {
  const tx = tail === "l" ? -w / 2 + w * 0.22 : w / 2 - w * 0.22;
  const dir = tail === "l" ? -1 : 1;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.32} fill={fill ?? `url(#${id}-obj)`} />
      <path d={`M${tx - 26 * dir} ${h / 2 - 4} L${tx + 18 * dir} ${h / 2 + 46} L${tx + 30 * dir} ${h / 2 - 4} Z`} fill={fill ?? `url(#${id}-obj)`} />
      {children}
    </g>
  );
};

export const Lock: React.FC<{ color: string; open?: number; s?: number }> = ({ color, open = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d={`M-24 ${-8 - open} V${-36 - open} A24 24 0 0 1 24 ${-36 - open} V${-8 - open}`} stroke={color} strokeWidth={11} fill="none" strokeLinecap="round" />
    <rect x={-38} y={-12} width={76} height={60} rx={12} fill={color} />
    <circle cx={0} cy={14} r={8} fill="#000" opacity={0.45} />
  </g>
);

export const Target: React.FC<{ color: string; s?: number }> = ({ color, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[70, 50, 30].map((r, k) => (
      <circle key={r} r={r} fill="none" stroke={color} strokeWidth={9} opacity={1 - k * 0.12} />
    ))}
    <circle r={11} fill={color} />
    <path d="M6 -6 L64 -64" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M64 -64 L60 -88 L80 -72 Z M64 -64 L88 -68 L72 -48 Z" fill={color} />
  </g>
);

export const Eye: React.FC<{ color: string; open: number; look?: number }> = ({ color, open, look = 0 }) => (
  <g transform={`scale(1 ${Math.max(0.04, open)})`}>
    <path d="M-66 0 Q0 -52 66 0 Q0 52 -66 0 Z" fill="none" stroke={color} strokeWidth={7} />
    <circle cx={look * 18} r={22} fill={color} />
    <circle cx={look * 18} r={9} fill="#000" opacity={0.7} />
  </g>
);

export const Dumbbell: React.FC<{ id: string; w: number }> = ({ id, w }) => (
  <g>
    <rect x={-w / 2} y={-8} width={w} height={16} rx={8} fill={`url(#${id}-obj)`} />
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <rect x={sd * (w / 2) - (sd > 0 ? 0 : 34)} y={-46} width={34} height={92} rx={9} fill={`url(#${id}-obj)`} />
        <rect x={sd * (w / 2 - 38) - (sd > 0 ? 0 : 26)} y={-34} width={26} height={68} rx={7} fill={`url(#${id}-obj)`} />
      </g>
    ))}
  </g>
);

export const Bottle: React.FC<{ color: string }> = ({ color }) => (
  <path d="M-12 -70 h24 v26 c0 10 22 22 22 44 v80 c0 8 -6 12 -12 12 h-44 c-6 0 -12 -4 -12 -12 v-80 c0 -22 22 -34 22 -44 Z" fill={color} />
);
export const Cig: React.FC<{ color: string; f: number }> = ({ color, f }) => (
  <g>
    <rect x={-80} y={-10} width={160} height={20} rx={6} fill={color} />
    <rect x={44} y={-10} width={36} height={20} rx={4} fill="#000" opacity={0.25} />
    {[0, 1].map((k) => (
      <path key={k} d={`M${-84 - k * 10} -16 c-18 -20 ${16 + Math.sin(f / 9 + k) * 10} -34 -4 -58 c-14 -16 ${12 + Math.cos(f / 11 + k) * 8} -30 -2 -48`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55} />
    ))}
  </g>
);
export const Dice: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x={-50} y={-50} width={100} height={100} rx={20} fill={color} />
    {[
      [-24, -24],
      [24, -24],
      [0, 0],
      [-24, 24],
      [24, 24],
    ].map(([x, y], k) => (
      <circle key={k} cx={x} cy={y} r={9} fill="#000" opacity={0.5} />
    ))}
  </g>
);

export const Clock: React.FC<{ id: string; r: number; t: number; arc?: number; arcColor?: string }> = ({ id, r, t, arc = 0, arcColor }) => {
  const a1 = -90 + 6 * 30; // 6 h
  const a2 = a1 + 60 * arc; // hasta 2 h
  const p = (deg: number, rr: number) => [Math.cos((deg * Math.PI) / 180) * rr, Math.sin((deg * Math.PI) / 180) * rr];
  const [x1, y1] = p(a1, r * 0.78);
  const [x2, y2] = p(a2, r * 0.78);
  return (
    <g>
      <circle r={r} fill={`url(#${id}-obj)`} />
      <circle r={r * 0.9} fill={mix("#ffffff", "#000000", 0.04)} opacity={0.94} />
      {arc > 0.01 && (
        <path d={`M0 0 L${x1} ${y1} A${r * 0.78} ${r * 0.78} 0 0 1 ${x2} ${y2} Z`} fill={arcColor} opacity={0.9} />
      )}
      {Array.from({ length: 60 }, (_, k) => {
        const [ax, ay] = p(k * 6, r * 0.84);
        const [bx, by] = p(k * 6, k % 5 === 0 ? r * 0.7 : r * 0.78);
        return <line key={k} x1={ax} y1={ay} x2={bx} y2={by} stroke="#1a1a1a" strokeWidth={k % 5 === 0 ? 7 : 3} />;
      })}
      <line x1={0} y1={0} x2={p(t * 0.5 - 90, r * 0.45)[0]} y2={p(t * 0.5 - 90, r * 0.45)[1]} stroke="#1a1a1a" strokeWidth={13} strokeLinecap="round" />
      <line x1={0} y1={0} x2={p(t * 6 - 90, r * 0.66)[0]} y2={p(t * 6 - 90, r * 0.66)[1]} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
      <circle r={12} fill="#1a1a1a" />
    </g>
  );
};
