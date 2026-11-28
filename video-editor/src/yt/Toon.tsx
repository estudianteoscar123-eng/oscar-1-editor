import React from "react";

// Personaje expresivo de frente (estilo Noé Dark: plano a dos tonos + borde de luz).
// Pies en (0,0); altura ≈ 1000 a escala 1. Cabeza grande para leer la expresión desde lejos.
export type Expr = "neutral" | "happy" | "laugh" | "shock" | "sad" | "evil" | "cold" | "smug" | "think" | "angry";
export type Pose = "down" | "clap" | "up" | "point" | "hips" | "face" | "cup" | "chin" | "flowers" | "dance" | "hold";
export type TLook = {
  robe: string; robeSh: string; trim?: string; mantle?: string; skin: string; skinSh: string; hair: string;
  hairStyle?: "short" | "long" | "bald" | "veil" | "curly" | "white";
  beard?: "none" | "short" | "long" | "white";
  crown?: boolean; veil?: string; jewel?: boolean;
};
const RIM = "#FF3A30";

const Brow: React.FC<{ e: Expr; side: 1 | -1 }> = ({ e, side }) => {
  // ángulo de ceja por expresión (side: -1 izquierda, 1 derecha)
  const tilt: Record<Expr, number> = { neutral: 0, happy: -4, laugh: -6, shock: -10, sad: 14, evil: -16, cold: 10, smug: 0, think: 6, angry: -18 };
  const raise: Record<Expr, number> = { neutral: 0, happy: -4, laugh: -6, shock: -16, sad: -2, evil: 4, cold: -4, smug: 0, think: -4, angry: 6 };
  let a = tilt[e] * side, r = raise[e];
  if (e === "smug" && side === 1) { a = -10; r = -14; }
  if (e === "think" && side === -1) { r = 4; }
  return <rect x={side * 38 - 20} y={-54 + r} width={40} height={9} rx={4} fill="#140C0A" transform={`rotate(${a} ${side * 38} ${-50 + r})`} />;
};
const Eye: React.FC<{ e: Expr; side: 1 | -1; lx: number; ly: number; blink: boolean }> = ({ e, side, lx, ly, blink }) => {
  const cx = side * 38, cy = -22;
  if (blink || e === "laugh") return <path d={`M${cx - 15} ${cy + (e === "laugh" ? 4 : 0)} Q ${cx} ${cy - (e === "laugh" ? 14 : -4)} ${cx + 15} ${cy + (e === "laugh" ? 4 : 0)}`} stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
  const ry = e === "shock" ? 22 : e === "evil" || e === "smug" ? 11 : e === "sad" ? 15 : 18;
  const rx = e === "shock" ? 18 : 15;
  const pr = e === "shock" ? 6 : 8;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#F4EEE4" />
      <circle cx={cx + lx * 5} cy={cy + ly * 4 + (e === "evil" || e === "smug" ? 2 : 0)} r={pr} fill="#140C0A" />
      <circle cx={cx + lx * 5 + 3} cy={cy + ly * 4 - 3} r={2.5} fill="#fff" />
    </g>
  );
};
const Mouth: React.FC<{ e: Expr; t: number; talk: number }> = ({ e, t, talk }) => {
  const o = talk > 0 ? Math.abs(Math.sin(t * 22)) * talk : 0;
  switch (e) {
    case "happy": return <path d={`M-26 22 Q 0 ${46 + o * 14} 26 22 Z`} fill="#3A0E10" stroke="#140C0A" strokeWidth={3} />;
    case "laugh": return <g><path d={`M-34 16 Q 0 ${66 + o * 8} 34 16 Z`} fill="#3A0E10" /><path d="M-30 18 L 30 18 L 26 26 L -26 26 Z" fill="#F4EEE4" /><ellipse cx={0} cy={44} rx={14} ry={8} fill="#B8404A" /></g>;
    case "shock": return <ellipse cx={0} cy={34} rx={14} ry={20 + o * 4} fill="#2A0A0C" />;
    case "sad": return <path d="M-22 40 Q 0 22 22 40" stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
    case "evil": return <path d="M-30 24 Q 0 48 32 18" stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
    case "smug": return <path d="M-20 32 Q 6 40 30 22" stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
    case "cold": {
      const j = Math.sin(t * 60) * 2;
      return <g transform={`translate(${j} 0)`}><rect x={-24} y={22} width={48} height={20} rx={6} fill="#2A0A0C" /><path d="M-24 32 L 24 32" stroke="#F4EEE4" strokeWidth={8} /><path d="M-12 22 L -12 42 M 0 22 L 0 42 M 12 22 L 12 42" stroke="#2A0A0C" strokeWidth={2} /></g>;
    }
    case "think": return <path d="M-14 32 Q 4 28 18 34" stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
    case "angry": return <path d={`M-24 38 Q 0 ${24 - o * 6} 24 38`} stroke="#140C0A" strokeWidth={7} fill="none" strokeLinecap="round" />;
    default: return o > 0.15 ? <ellipse cx={0} cy={32} rx={14} ry={4 + o * 10} fill="#2A0A0C" /> : <path d="M-16 30 Q 0 36 16 30" stroke="#140C0A" strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
};

const Hair: React.FC<{ l: TLook; back?: boolean }> = ({ l, back }) => {
  const s = l.hairStyle ?? "short";
  if (back) {
    if (s === "long") return <path d="M-96 -30 Q -110 80 -80 140 L 80 140 Q 110 80 96 -30 Z" fill={l.hair} />;
    if (s === "veil") return <path d="M-104 -70 Q -130 120 -120 260 L 120 260 Q 130 120 104 -70 Z" fill={l.veil ?? "#4A0C20"} />;
    return null;
  }
  switch (s) {
    case "bald": return <path d="M-90 -40 Q -96 -70 -80 -66 M 90 -40 Q 96 -70 80 -66" stroke={l.hair} strokeWidth={14} fill="none" />;
    case "white": return <path d="M-96 -20 Q -104 -110 -30 -112 Q 0 -96 30 -112 Q 104 -110 96 -20 Q 80 -80 0 -78 Q -80 -80 -96 -20 Z" fill={l.hair} />;
    case "curly": return <g>{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-80 + i * 20} cy={-84 - Math.sin(i) * 10} r={24} fill={l.hair} />)}</g>;
    case "veil": return <path d="M-104 -30 Q -110 -124 0 -128 Q 110 -124 104 -30 Q 70 -96 0 -96 Q -70 -96 -104 -30 Z" fill={l.veil ?? "#4A0C20"} />;
    case "long": return <path d="M-98 -10 Q -104 -118 0 -118 Q 104 -118 98 -10 Q 86 -80 0 -84 Q -86 -80 -98 -10 Z" fill={l.hair} />;
    default: return <path d="M-94 -30 Q -98 -118 0 -116 Q 98 -118 94 -30 Q 70 -84 0 -86 Q -70 -84 -94 -30 Z" fill={l.hair} />;
  }
};
const Beard: React.FC<{ l: TLook }> = ({ l }) => {
  const b = l.beard ?? "none";
  if (b === "none") return null;
  const c = b === "white" ? "#E8E4DC" : l.hair;
  if (b === "short") return <path d="M-78 10 Q -74 80 0 92 Q 74 80 78 10 Q 60 54 0 58 Q -60 54 -78 10 Z" fill={c} />;
  return <path d="M-80 6 Q -86 120 0 170 Q 86 120 80 6 Q 60 60 0 62 Q -60 60 -80 6 Z" fill={c} />;
};

// brazo: hombro → codo → mano (coordenadas relativas al hombro)
const ARMS: Record<Pose, [number, number, number, number][]> = {
  // [codoX, codoY, manoX, manoY] para brazo derecho (izq se espeja)
  down: [[30, 170, 40, 330]], clap: [[80, 150, -40, 200]], up: [[70, -150, 60, -320]], point: [[150, -30, 300, -80]],
  hips: [[120, 110, 40, 210]], face: [[110, 80, -20, -60]], cup: [[110, 140, 180, 90]], chin: [[100, 120, -10, 20]],
  flowers: [[90, 150, 60, 120]], dance: [[140, -110, 220, -250]], hold: [[90, 160, 20, 210]],
};
const Arm: React.FC<{ side: 1 | -1; pose: Pose; l: TLook; t: number; anim: number }> = ({ side, pose, l, t, anim }) => {
  let [[ex, ey, hx, hy]] = ARMS[pose];
  if (pose === "clap") { const c = Math.abs(Math.sin(t * 9)); hx = -40 + (1 - c) * 70; }
  if (pose === "dance") { hx += Math.sin(t * 6 + side) * 40; hy += Math.cos(t * 6 + side) * 30; }
  if (pose === "point" && side === -1) { [ex, ey, hx, hy] = ARMS.hips[0]; }
  if (pose === "cup" && side === -1) { [ex, ey, hx, hy] = ARMS.down[0]; }
  if (pose === "chin" && side === -1) { [ex, ey, hx, hy] = [70, 150, 120, 120]; }
  if (pose === "up") { hy += Math.sin(t * 10 + side) * 12 * anim; }
  const sx = side * 92, sy = -760;
  const p = `M${sx} ${sy} Q ${sx + side * ex} ${sy + ey} ${sx + side * hx} ${sy + hy}`;
  return (
    <g>
      <path d={p} stroke={l.robeSh} strokeWidth={64} fill="none" strokeLinecap="round" />
      <path d={p} stroke={l.robe} strokeWidth={52} fill="none" strokeLinecap="round" />
      <circle cx={sx + side * hx} cy={sy + hy} r={30} fill={l.skin} />
      <circle cx={sx + side * hx - side * 8} cy={sy + hy + 6} r={14} fill={l.skinSh} opacity={0.5} />
    </g>
  );
};

export const Toon: React.FC<{
  x: number; y: number; s: number; l: TLook; e: Expr; pose?: Pose; t: number; talk?: number;
  lx?: number; ly?: number; tilt?: number; op?: number; flip?: boolean; shake?: number; spin?: number; hold?: React.ReactNode;
}> = ({ x, y, s, l, e, pose = "down", t, talk = 0, lx = 0, ly = 0, tilt = 0, op = 1, flip, shake = 0, spin = 0, hold }) => {
  const bob = Math.sin(t * 2.4 + x * 0.01) * 4;
  const sh = shake ? Math.sin(t * 50) * shake : 0;
  const blink = (t * 10 + x) % 37 < 1.2;
  const sx = spin ? Math.cos(t * 7) : 1;
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${s * (flip ? -1 : 1) * (spin ? 0.35 + 0.65 * Math.abs(sx) : 1)} ${s})`} opacity={op}>
      <ellipse cx={0} cy={6} rx={170} ry={26} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${bob}) rotate(${tilt} 0 -400)`}>
        <g transform="translate(0 -900)"><Hair l={l} back /></g>
        {/* cuerpo */}
        <path d={`M-110 -790 Q -150 -400 ${spin ? -200 : -150} 0 L ${spin ? 200 : 150} 0 Q 150 -400 110 -790 Q 0 -820 -110 -790 Z`} fill={l.robe} />
        <path d="M-110 -790 Q -150 -400 -150 0 L -40 0 Q -60 -400 -30 -805 Z" fill={l.robeSh} />
        <path d="M110 -790 Q 150 -400 150 0" stroke={RIM} strokeWidth={6} fill="none" opacity={0.85} />
        {l.mantle ? <path d="M-115 -790 Q -40 -500 -20 -60 L -90 -40 Q -140 -400 -150 -700 Z" fill={l.mantle} /> : null}
        {l.trim ? <path d="M-130 -360 Q 0 -330 130 -360 L 132 -330 Q 0 -300 -132 -330 Z" fill={l.trim} /> : null}
        {l.trim ? <path d="M-150 -10 L 150 -10" stroke={l.trim} strokeWidth={14} /> : null}
        <Arm side={-1} pose={pose} l={l} t={t} anim={1} />
        <Arm side={1} pose={pose} l={l} t={t} anim={1} />
        {hold ? <g transform={`translate(${92 + ARMS[pose][0][2]} ${-760 + ARMS[pose][0][3]})`}>{hold}</g> : null}
        {/* cuello y cabeza */}
        <rect x={-34} y={-830} width={68} height={60} fill={l.skinSh} />
        <g transform="translate(0 -900)">
          <ellipse cx={-96} cy={-6} rx={16} ry={24} fill={l.skinSh} /><ellipse cx={96} cy={-6} rx={16} ry={24} fill={l.skin} />
          <ellipse cx={0} cy={0} rx={96} ry={106} fill={l.skin} />
          <path d="M0 -106 Q -96 -100 -96 0 Q -96 96 0 106 Q -50 0 0 -106 Z" fill={l.skinSh} opacity={0.55} />
          <path d="M70 -70 Q 100 -20 92 30" stroke={RIM} strokeWidth={5} fill="none" opacity={0.8} />
          <Beard l={l} />
          {(e === "happy" || e === "laugh") ? <g><ellipse cx={-54} cy={14} rx={16} ry={9} fill="#D06A6A" opacity={0.5} /><ellipse cx={54} cy={14} rx={16} ry={9} fill="#D06A6A" opacity={0.5} /></g> : null}
          {e === "cold" ? <g><ellipse cx={-54} cy={14} rx={18} ry={10} fill="#7AA0D8" opacity={0.5} /><ellipse cx={54} cy={14} rx={18} ry={10} fill="#7AA0D8" opacity={0.5} /><ellipse cx={4} cy={6} rx={12} ry={10} fill="#D86A6A" /></g> : <path d="M-6 -8 Q -12 10 4 14" stroke={l.skinSh} strokeWidth={5} fill="none" />}
          <Eye e={e} side={-1} lx={lx} ly={ly} blink={blink} />
          <Eye e={e} side={1} lx={lx} ly={ly} blink={blink} />
          {(e === "evil" || e === "smug") ? <g><path d="M-56 -36 L -20 -30 L -20 -24 L -56 -28 Z" fill={l.skin} /><path d={`M20 -30 L 56 ${e === "smug" ? -40 : -36} L 56 -26 L 20 -24 Z`} fill={l.skin} /></g> : null}
          <Brow e={e} side={-1} /><Brow e={e} side={1} />
          <Mouth e={e} t={t} talk={talk} />
          {e === "sad" ? <path d="M-40 -2 Q -44 20 -38 30" stroke="#8AB4E8" strokeWidth={6} fill="none" opacity={0.8} /> : null}
          {e === "shock" ? <g><path d="M110 -90 L 130 -120 M 126 -70 L 160 -84 M 96 -112 L 102 -150" stroke="#F4EEE4" strokeWidth={6} strokeLinecap="round" /></g> : null}
          {e === "think" ? <g>{[0, 1, 2].map((k) => <circle key={k} cx={120 + k * 34} cy={-120 - k * 30} r={8 + k * 6} fill="#F4EEE4" opacity={0.5 + 0.5 * Math.sin(t * 4 - k)} />)}</g> : null}
          <Hair l={l} />
          {l.crown ? <g transform="translate(0 -112)"><path d="M-70 0 L -76 -62 L -38 -28 L 0 -80 L 38 -28 L 76 -62 L 70 0 Z" fill="#C9A04A" stroke="#3A2A10" strokeWidth={4} /><circle cx={0} cy={-80} r={9} fill={RIM} /><path d="M70 0 L 76 -62" stroke="#FFE08A" strokeWidth={4} /></g> : null}
          {l.jewel ? <g><circle cx={-98} cy={22} r={9} fill="#C9A04A" /><circle cx={98} cy={22} r={9} fill="#C9A04A" /></g> : null}
        </g>
      </g>
    </g>
  );
};
