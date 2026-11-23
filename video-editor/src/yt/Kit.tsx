import React from "react";
import { interpolate, Easing } from "remotion";

// Kit ZK YouTube: estilo "¿Y si…?" (2D vectorial con volumen, degradados suaves, sombras de contacto, bruma de profundidad).
export const W = 1920, H = 1080;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = Easing.bezier(0.45, 0, 0.25, 1);
export const ip = (v: number, i: number[], o: number[], e = ease) =>
  interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
// keyframes [[t, v], ...]
export const kf = (t: number, k: [number, number][], e = ease) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, v0] = k[i], [t1, v1] = k[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * e(clamp((t - t0) / (t1 - t0)));
  }
  return k[k.length - 1][1];
};
export const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------- Personaje ----------------
export type Mouth = "smile" | "flat" | "o" | "grin" | "worry";
export type Pose = {
  armL?: [number, number]; armR?: [number, number]; // [hombro°, codo°] desde abajo; + = hacia afuera/adelante
  look?: [number, number]; brow?: number; browTilt?: number; mouth?: Mouth; mouthOpen?: number;
  lean?: number; headTilt?: number; walk?: number; squash?: number; eyeOpen?: number;
};
export type CharP = {
  id: string; x: number; y: number; s?: number; t: number; facing?: 1 | -1; pose?: Pose;
  robe?: string; robe2?: string; sash?: string; hood?: boolean; light?: number; lightX?: number; holdR?: React.ReactNode;
};
const BLK = "#111114";
export const Character: React.FC<CharP> = ({ id, x, y, s = 1, t, facing = 1, pose = {}, robe = "#B86B3C", robe2 = "#7E3F1F", sash = "#E2B866", hood, light = 0, lightX = 1, holdR }) => {
  const walk = pose.walk;
  const ph = walk !== undefined ? walk * Math.PI * 2 : 0;
  const isWalk = walk !== undefined;
  const legA = isWalk ? Math.sin(ph) * 24 : 0;
  const bob = isWalk ? -Math.abs(Math.cos(ph)) * 9 : 0;
  const breath = Math.sin(t * 2.4) * 2.2;
  const sq = pose.squash ?? 0;
  const blinkT = (t * 0.37 + rnd(id.length) * 3) % 1;
  const blink = blinkT < 0.045 ? 0.08 : 1;
  const eo = (pose.eyeOpen ?? 1) * blink;
  const look = pose.look ?? [0.4, 0];
  const brow = pose.brow ?? 0, bt = pose.browTilt ?? 0;
  const swing = isWalk ? Math.sin(ph) * 22 : 0;
  const armL = pose.armL ?? [8 - swing, 10];
  const armR = pose.armR ?? [8 + swing, 10];
  const arm = (side: number, [a, b]: [number, number]) => {
    const sx = side * 46, sy = -272;
    const r1 = ((a * side) * Math.PI) / 180, r2 = (((a + b) * side) * Math.PI) / 180;
    const ex = sx + Math.sin(r1) * 82, ey = sy + Math.cos(r1) * 82;
    const hx = ex + Math.sin(r2) * 76, hy = ey + Math.cos(r2) * 76;
    return { sx, sy, ex, ey, hx, hy };
  };
  const L = arm(-1, armL), R = arm(1, armR);
  const mo = pose.mouthOpen ?? 0;
  const mouth = pose.mouth ?? "flat";
  const lx = look[0] * 10, ly = look[1] * 8;
  const g = `${id}`;
  const ArmEl = ({ a, front }: { a: ReturnType<typeof arm>; front: boolean }) => (
    <g>
      <path d={`M${a.sx} ${a.sy} L${a.ex} ${a.ey}`} stroke={front ? robe : robe2} strokeWidth={30} strokeLinecap="round" />
      <path d={`M${a.ex} ${a.ey} L${a.hx} ${a.hy}`} stroke={BLK} strokeWidth={15} strokeLinecap="round" />
      <circle cx={a.hx} cy={a.hy} r={15} fill={BLK} />
      <circle cx={a.hx - 4} cy={a.hy - 5} r={5} fill="#3A3A42" opacity={0.7} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing * (1 + sq * 0.08)} ${s * (1 - sq * 0.1)})`}>
      <defs>
        <radialGradient id={`hd${g}`} cx="36%" cy="30%" r="75%"><stop offset="0%" stopColor="#4A4A52" /><stop offset="45%" stopColor="#1D1D22" /><stop offset="100%" stopColor="#060608" /></radialGradient>
        <linearGradient id={`rb${g}`} x1="0" y1="0" x2="1" y2="0.15"><stop offset="0%" stopColor={robe} /><stop offset="55%" stopColor={robe} /><stop offset="100%" stopColor={robe2} /></linearGradient>
        <radialGradient id={`sh${g}`}><stop offset="0%" stopColor="#000" stopOpacity="0.45" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
        <radialGradient id={`lt${g}`} cx={lightX > 0 ? "80%" : "20%"} cy="40%" r="70%"><stop offset="0%" stopColor="#FFC46B" stopOpacity={0.55 * light} /><stop offset="100%" stopColor="#FFC46B" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={0} cy={2} rx={95} ry={16} fill={`url(#sh${g})`} />
      <g transform={`translate(0 ${bob}) rotate(${pose.lean ?? 0} 0 -150)`}>
        {/* piernas */}
        {[-1, 1].map((sd) => {
          const a = ((sd * legA) * Math.PI) / 180;
          const fx = sd * 22 + Math.sin(a) * 70, fy = -6 + (1 - Math.cos(a)) * -8;
          return (
            <g key={sd}>
              <path d={`M${sd * 20} -80 L${fx} ${fy}`} stroke="#2A211C" strokeWidth={17} strokeLinecap="round" />
              <path d={`M${fx - 10} ${fy + 2} Q ${fx + 8} ${fy - 10} ${fx + 26} ${fy + 2}`} stroke="#6B4527" strokeWidth={9} fill="#8A5A33" strokeLinecap="round" />
            </g>
          );
        })}
        {/* brazo trasero */}
        <ArmEl a={L} front={false} />
        {/* túnica */}
        <g transform={`translate(0 ${breath * 0.3})`}>
          <path d="M-50 -286 C -70 -250, -78 -160, -86 -70 Q 0 -52 86 -70 C 78 -160, 70 -250, 50 -286 Q 0 -298 -50 -286 Z" fill={`url(#rb${g})`} />
          <path d="M-50 -286 C -70 -250, -78 -160, -86 -70 Q 0 -52 86 -70 C 78 -160, 70 -250, 50 -286 Q 0 -298 -50 -286 Z" fill={`url(#lt${g})`} />
          <path d="M-18 -284 L 0 -244 L 18 -284" stroke={robe2} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M-74 -168 Q 0 -150 74 -168" stroke={sash} strokeWidth={15} fill="none" />
          <path d="M40 -162 L 52 -112" stroke={sash} strokeWidth={9} strokeLinecap="round" />
          <path d="M-30 -230 Q -40 -160 -44 -80" stroke="#000" strokeOpacity={0.12} strokeWidth={5} fill="none" />
          <path d="M22 -140 Q 28 -100 30 -66" stroke="#000" strokeOpacity={0.12} strokeWidth={5} fill="none" />
        </g>
        {/* cabeza */}
        <g transform={`translate(${lx * 0.4} ${-350 + breath}) rotate(${pose.headTilt ?? 0} 0 50)`}>
          <rect x={-12} y={38} width={24} height={24} fill={BLK} />
          {hood ? <path d="M-74 30 C -84 -60, -40 -86, 0 -86 C 40 -86, 84 -60, 74 30 L 60 46 L -60 46 Z" fill={robe2} /> : null}
          <circle r={62} fill={`url(#hd${g})`} />
          <path d="M-46 -38 A 62 62 0 0 1 24 -58" stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={6} fill="none" strokeLinecap="round" />
          {light > 0 ? <circle r={62} fill="none" stroke="#FFB65A" strokeOpacity={0.5 * light} strokeWidth={5} strokeDasharray="120 400" transform={`rotate(${lightX > 0 ? -40 : 140})`} /> : null}
          {!hood ? [[-30, -50, -42, -78], [-10, -60, -14, -92], [12, -60, 18, -90], [32, -48, 50, -72], [-44, -34, -66, -50]].map(([a, b, c, d], i) => (
            <path key={i} d={`M${a} ${b} Q ${(a + c) / 2 + 6} ${(b + d) / 2} ${c} ${d}`} stroke={BLK} strokeWidth={6} fill="none" strokeLinecap="round" />
          )) : null}
          {/* cara */}
          <g transform={`translate(${lx} ${ly})`}>
            {[-1, 1].map((sd) => (
              <g key={sd} transform={`translate(${sd * 22} -6)`}>
                <ellipse rx={12} ry={15 * eo} fill="#FFFFFF" />
                {eo > 0.3 ? <circle cx={look[0] * 4} cy={look[1] * 4 + 1} r={6.5} fill={BLK} /> : null}
                <path d={`M${-13} ${-24 - brow * 8 + sd * bt * 5} L ${13} ${-24 - brow * 8 - sd * bt * 5}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
              </g>
            ))}
            {mouth === "smile" ? <path d="M-16 22 Q 0 34 16 22" stroke="#FFF" strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
            {mouth === "flat" ? <path d="M-11 26 L 11 26" stroke="#FFF" strokeWidth={5} strokeLinecap="round" /> : null}
            {mouth === "worry" ? <path d="M-14 30 Q 0 20 14 30" stroke="#FFF" strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
            {mouth === "o" ? <ellipse cx={0} cy={28} rx={8 + mo * 3} ry={9 + mo * 6} fill="#FFF" /> : null}
            {mouth === "grin" ? <path d="M-20 18 Q 0 44 20 18 Z" fill="#FFF" /> : null}
          </g>
        </g>
        {/* brazo delantero */}
        <ArmEl a={R} front />
        {holdR ? <g transform={`translate(${R.hx} ${R.hy})`}>{holdR}</g> : null}
      </g>
    </g>
  );
};

// ---------------- Props ----------------
export const Flame: React.FC<{ t: number; s?: number; seed?: number }> = ({ t, s = 1, seed = 0 }) => {
  const f = 1 + Math.sin(t * 23 + seed) * 0.08 + Math.sin(t * 37 + seed * 2) * 0.06;
  const sw = Math.sin(t * 11 + seed) * 3;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M0 0 C -10 -10, -8 ${-26 * f}, ${sw} ${-40 * f} C 8 ${-26 * f}, 10 -10, 0 0 Z`} fill="#FF9A2E" />
      <path d={`M0 -2 C -5 -8, -4 ${-18 * f}, ${sw * 0.6} ${-26 * f} C 4 ${-18 * f}, 5 -8, 0 -2 Z`} fill="#FFE59A" />
    </g>
  );
};
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number; c?: string; id: string }> = ({ x, y, r, o = 1, c = "#FFB55A", id }) => (
  <g>
    <defs><radialGradient id={`gw${id}`}><stop offset="0%" stopColor={c} stopOpacity={0.55 * o} /><stop offset="35%" stopColor={c} stopOpacity={0.22 * o} /><stop offset="100%" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#gw${id})`} />
  </g>
);
export const OilLamp: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M-34 0 Q -30 -22 0 -24 Q 30 -22 40 -10 L 56 -14 Q 50 -2 34 0 Z" fill="#B5703F" />
    <path d="M-34 0 Q 0 8 34 0" stroke="#6E3E1E" strokeWidth={4} fill="none" />
    <ellipse cx={-4} cy={-20} rx={12} ry={4} fill="#5A3218" />
    <path d="M-26 -12 Q -10 -18 10 -16" stroke="#E2A06A" strokeWidth={3} fill="none" opacity={0.7} />
    <g transform="translate(52 -14)"><Flame t={t} s={0.55} /></g>
  </g>
);
export const Jar: React.FC<{ c?: string; s?: number }> = ({ c = "#A65F34", s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-16 -96 L 16 -96 L 14 -82 Q 44 -70 44 -36 Q 44 -4 0 0 Q -44 -4 -44 -36 Q -44 -70 -14 -82 Z" fill={c} />
    <path d="M-30 -60 Q -36 -30 -20 -10" stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M-40 -46 Q 0 -36 40 -46" stroke="#000" strokeOpacity={0.15} strokeWidth={4} fill="none" />
  </g>
);
export const Palm: React.FC<{ t: number; s?: number; seed?: number; c?: string; trunk?: string }> = ({ t, s = 1, seed = 0, c = "#2F5A3A", trunk = "#6B4A33" }) => {
  const sw = Math.sin(t * 1.3 + seed) * 4;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M0 0 Q ${10 + sw * 0.3} -160 ${20 + sw} -300`} stroke={trunk} strokeWidth={22} fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-8 + sw * 0.1} ${-i * 32} L ${12 + sw * 0.1} ${-i * 32 - 6}`} stroke="#000" strokeOpacity={0.18} strokeWidth={4} transform={`translate(${i * 2.2} 0)`} />)}
      <g transform={`translate(${20 + sw} -300)`}>
        {[-160, -120, -75, -30, 15, 55, 100, 140].map((a, i) => {
          const r = (a * Math.PI) / 180, w = Math.sin(t * 2.1 + i + seed) * 4;
          const ex = Math.cos(r) * 150, ey = Math.sin(r) * 70 + 60;
          return <path key={i} d={`M0 0 Q ${ex * 0.5} ${ey * 0.2 - 50 + w} ${ex} ${ey + w}`} stroke={c} strokeWidth={22 - Math.abs(i - 3.5) * 1.5} fill="none" strokeLinecap="round" />;
        })}
      </g>
    </g>
  );
};
// Subtítulo estilo referencia: palabra por palabra, amarillo con contorno oscuro
export const Caption: React.FC<{ words: [string, number][]; t: number; x: number; y: number; size?: number }> = ({ words, t, x, y, size = 64 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", gap: size * 0.28, whiteSpace: "nowrap" }}>
    {words.filter(([, a]) => t >= a).map(([w, a], i) => {
      const p = ip(t, [a, a + 0.12], [0, 1]);
      const sc = ip(t, [a, a + 0.09, a + 0.18], [0.4, 1.15, 1], Easing.out(Easing.quad));
      return (
        <span key={i} style={{ fontFamily: "YCap", fontSize: size, color: "#FFD23F", WebkitTextStroke: `${size * 0.16}px #3B2208`, paintOrder: "stroke fill", letterSpacing: 1, opacity: p, transform: `scale(${sc}) rotate(${(i % 2 ? 1 : -1) * 2}deg)`, display: "inline-block", textShadow: "0 6px 0 rgba(0,0,0,.25)" }}>{w}</span>
      );
    })}
  </div>
);
export const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 70, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: 70, background: "#000" }} />
  </>
);
