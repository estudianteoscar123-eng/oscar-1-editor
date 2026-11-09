import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Paper } from "../judas/Dark";

// ZK Dark v2 · kit: proyección 2.5D por código, personaje de tinta con expresiones, escenarios y luz de cine.
export const RED = "#D30F17";
export const W = "#F2F2F2";
export const INK = "#050505";
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => o0 + (o1 - o0) * cl((v - a) / (b - a));
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- cámara ----------
// clave: [t, x, y, z, foco, rápido]. rápido = 1 → latigazo con ease y desenfoque de movimiento; 0 → empuje lineal lento
export type CK = [number, number, number, number, number, number?];
export type Cam = { x: number; y: number; z: number; fd: number; blur: number };
export const camAt = (keys: CK[], t: number): Cam => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1][0] <= t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  if (a === b) return { x: a[1], y: a[2], z: a[3], fd: a[4], blur: 0 };
  const u = cl((t - a[0]) / (b[0] - a[0]));
  const fast = (b[5] ?? 0) > 0;
  const p = fast ? eio(u) : u;
  const L = (j: number) => a[j]! + (b[j]! - a[j]!) * p;
  const far = Math.abs(b[1] - a[1]) > 2500;
  return { x: L(1), y: L(2), z: L(3), fd: L(4), blur: fast ? Math.sin(u * Math.PI) * (far ? 14 : 4) : 0 };
};
// las claves se escriben como "llegar a X en t": el latigazo dura `dur` y termina en t
export const whip = (t: number, dur: number, x: number, y: number, z: number, fd: number): CK[] => [[t - dur, NaN, NaN, NaN, NaN, -1], [t, x, y, z, fd, 1]];
export const buildKeys = (raw: CK[]): CK[] => {
  // resuelve las claves NaN (inicio de latigazo) con la pose que tenga la cámara en ese instante
  const out: CK[] = [];
  raw.forEach((k) => {
    if (Number.isNaN(k[1])) {
      const c = camAt(out, k[0]);
      out.push([k[0], c.x, c.y, c.z, c.fd, 0]);
    } else out.push(k);
  });
  return out;
};
export const F = 1100;
// capa: dibujo SVG anclado en (x, y) del mundo a la profundidad d
export const L: React.FC<{ cam: Cam; d: number; x: number; y: number; children: React.ReactNode; noBlur?: boolean; o?: number }> = ({ cam, d, x, y, children, noBlur, o = 1 }) => {
  const dz = d - cam.z;
  if (dz < 40 || o <= 0.01) return null;
  const k = F / dz;
  const sx = 540 + (x - cam.x) * k, sy = 960 + (y - cam.y) * k;
  if (sx < -7000 * k - 600 || sx > 1080 + 7000 * k + 600) return null;
  const b = noBlur ? 0 : Math.min(10, Math.abs(d - cam.fd) / 260 + cam.blur);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, zIndex: Math.round(100000 - d), filter: b >= 2.5 ? `blur(${Math.round(b)}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sx}px, ${sy}px) scale(${k})`, transformOrigin: "0 0" }}>
        <svg width={1} height={1} style={{ overflow: "visible", position: "absolute" }}>{children}</svg>
      </div>
    </div>
  );
};

// ---------- personaje de tinta ----------
export type Expr = "calm" | "angry" | "shout" | "shock" | "happy" | "sad" | "smug" | "closed";
export type PersonP = {
  t: number; seed?: number; expr?: Expr; talk?: boolean; flip?: boolean;
  head?: "hair" | "helmet" | "turban" | "hood" | "bald"; beard?: boolean; cape?: boolean; sash?: string;
  armL?: number; armR?: number; hold?: React.ReactNode; holdL?: React.ReactNode; spots?: number; glow?: number; look?: number; wet?: number;
};
export const Person: React.FC<PersonP> = (p) => {
  const { t, seed = 0, expr = "calm" } = p;
  const blink = ((t + seed * 0.7) % 2.9) > 2.78 && expr !== "shock";
  const br = Math.sin(t * 2.2 + seed) * 4;
  const wind = Math.sin(t * 3.1 + seed) * 14;
  const look = p.look ?? 0;
  const armA = (a: number | undefined, sd: number) => ((a ?? 12) * Math.PI) / 180 * sd;
  const Arm = ({ sd, a, hold }: { sd: number; a?: number; hold?: React.ReactNode }) => {
    const ang = armA(a, sd);
    const sx = 92 * sd, sy = -380;
    const ex = sx + Math.sin(ang) * 240, ey = sy + Math.cos(ang) * 240;
    const mx = sx + Math.sin(ang) * 120 + sd * 10, my = sy + Math.cos(ang) * 120;
    return (
      <g>
        <path d={`M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`} stroke={W} strokeWidth={34} strokeLinecap="round" fill="none" />
        <path d={`M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`} stroke={INK} strokeWidth={22} strokeLinecap="round" fill="none" />
        <circle cx={ex} cy={ey} r={19} fill={INK} stroke={W} strokeWidth={5} />
        {p.spots ? <circle cx={ex + 4} cy={ey - 3} r={7} fill={W} opacity={p.spots} /> : null}
        {hold ? <g transform={`translate(${ex} ${ey})`}>{hold}</g> : null}
      </g>
    );
  };
  const eyes = () => {
    if (blink || expr === "closed") return [-1, 1].map((s) => <path key={s} d={`M${s * 36 - 13 + look} -6 Q${s * 36 + look} ${expr === "happy" ? -16 : 0} ${s * 36 + 13 + look} -6`} stroke={W} strokeWidth={6} fill="none" />);
    if (expr === "happy") return [-1, 1].map((s) => <path key={s} d={`M${s * 36 - 14} -2 Q${s * 36} -20 ${s * 36 + 14} -2`} stroke={W} strokeWidth={7} fill="none" />);
    const r = expr === "shock" ? 1.45 : 1;
    return [-1, 1].map((s) => <ellipse key={s} cx={s * 36 + look} cy={-6} rx={10 * r} ry={14 * r} fill={W} />);
  };
  const browA: Record<Expr, number> = { calm: 0, angry: -14, shout: -12, shock: 10, happy: 6, sad: 14, smug: 4, closed: 0 };
  const browY = expr === "shock" ? -44 : -30;
  const open = p.talk ? 0.35 + 0.35 * Math.abs(Math.sin(t * 16 + seed)) : expr === "shout" ? 0.9 + 0.1 * Math.sin(t * 14) : expr === "shock" ? 0.75 : 0;
  return (
    <g filter="url(#ink)" transform={p.flip ? "scale(-1 1)" : undefined}>
      {p.cape !== false ? (
        <>
          <path d={`M-95 -400 C-200 -300 -250 -150 ${-300 + wind} 10 L${-60 + wind * 0.5} -20 C-40 -150 -60 -300 -95 -400 Z`} fill="#070707" stroke={W} strokeWidth={5} />
          <path d={`M-95 -400 C-200 -300 -250 -150 ${-300 + wind} 10`} fill="none" stroke={RED} strokeWidth={10} />
        </>
      ) : null}
      <path d={`M-85 -410 C-120 -${300 + br} -150 -150 -175 0 L175 0 C150 -150 120 -${300 + br} 85 -410 Q0 -440 -85 -410 Z`} fill={INK} stroke={W} strokeWidth={6} />
      <path d={`M30 -400 C80 -280 120 -140 150 0 L175 0 C150 -150 120 -${300 + br} 85 -410 Z`} fill="url(#h1)" opacity={0.8} />
      {[-60, -10, 40].map((x, i) => <path key={i} d={`M${x} -330 C${x - 10} -220 ${x + 8} -120 ${x - 6} 0`} stroke={W} strokeWidth={3} fill="none" opacity={0.55} />)}
      {p.sash ? <path d="M-128 -200 Q0 -180 128 -200" stroke={p.sash} strokeWidth={13} fill="none" /> : null}
      {p.wet ? <path d="M-170 -10 L170 -10" stroke="#9FD3FF" strokeWidth={8} opacity={p.wet} /> : null}
      <Arm sd={-1} a={p.armL} hold={p.holdL} />
      <Arm sd={1} a={p.armR} hold={p.hold} />
      <g transform={`translate(0 ${-515 + br * 0.5})`}>
        {p.glow ? <circle r={150 + 40 * p.glow} fill="#FFF2C8" opacity={0.35 * p.glow} /> : null}
        <circle r={96} fill={INK} stroke={W} strokeWidth={6} />
        <path d="M-96 6 A96 96 0 0 1 -56 -78" fill="none" stroke={RED} strokeWidth={11} />
        {p.head === "helmet" ? <><path d="M-100 -42 Q-96 -112 0 -116 Q96 -112 100 -42 Z" fill={INK} stroke={W} strokeWidth={6} /><path d="M-100 -42 L100 -42" stroke={W} strokeWidth={8} /><path d="M0 -116 Q30 -170 90 -160 Q40 -130 0 -116" fill={RED} /></> : null}
        {p.head === "turban" ? <><path d="M-98 -18 Q-110 -120 0 -124 Q110 -120 98 -18 Q50 -50 0 -50 Q-50 -50 -98 -18 Z" fill="url(#h2)" stroke={W} strokeWidth={6} /></> : null}
        {p.head === "hood" ? <path d="M-120 60 Q-140 -130 0 -132 Q140 -130 120 60 Q100 -60 0 -70 Q-100 -60 -120 60 Z" fill="#080808" stroke={W} strokeWidth={6} /> : null}
        {p.head === "hair" || p.head === undefined ? <path d="M-90 -28 Q-60 -105 0 -100 Q70 -100 92 -26 Q55 -62 0 -66 Q-50 -64 -90 -28 Z" fill="url(#h1)" stroke={W} strokeWidth={5} /> : null}
        {p.beard ? <path d="M-70 36 C-64 96 -28 124 0 126 C28 124 64 96 70 36 C40 60 20 56 0 56 C-20 56 -40 60 -70 36 Z" fill="url(#h2)" stroke={W} strokeWidth={5} /> : null}
        {eyes()}
        {[-1, 1].map((s) => <path key={s} d={`M${s * 40 - 20} ${browY} L${s * 40 + 20} ${browY + s * browA[expr] * 0.6}`} stroke={W} strokeWidth={7} strokeLinecap="round" transform={`rotate(${s * browA[expr]} ${s * 40} ${browY})`} />)}
        {open > 0.05 ? <ellipse cx={0} cy={36} rx={18} ry={8 + open * 16} fill={INK} stroke={W} strokeWidth={5} /> : expr === "happy" || expr === "smug" ? <path d="M-22 30 Q0 48 22 30" stroke={W} strokeWidth={5} fill="none" /> : expr === "sad" ? <path d="M-18 42 Q0 30 18 42" stroke={W} strokeWidth={5} fill="none" /> : <path d="M-18 36 Q0 40 18 36" stroke={W} strokeWidth={5} fill="none" />}
        {p.spots ? [[-50, 20], [40, 50], [60, -40], [-30, -55], [5, 75]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9 + (i % 2) * 5} fill={W} opacity={p.spots! * 0.9} />) : null}
      </g>
    </g>
  );
};

// ---------- escenario ----------
export const Hills: React.FC<{ w: number; seed: number; amp?: number; fill?: string; rim?: string; hatch?: boolean }> = ({ w, seed, amp = 40, fill = INK, rim = RED, hatch }) => {
  const yAt = (x: number) => Math.sin(x / 420 + seed) * amp + Math.sin(x / 170 + seed * 2) * amp * 0.35;
  const pts = Array.from({ length: 51 }, (_, i) => { const x = -w / 2 + (w * i) / 50; return `${x},${yAt(x)}`; }).join(" L");
  return (
    <g>
      <path d={`M${pts} L${w / 2},2400 L${-w / 2},2400 Z`} fill={fill} stroke={W} strokeWidth={3} />
      {hatch ? <path d={`M${pts} L${w / 2},500 L${-w / 2},500 Z`} fill="url(#h2)" opacity={0.25} /> : null}
      <path d={`M${pts}`} fill="none" stroke={rim} strokeWidth={2.5} opacity={0.6} transform="translate(0 6)" />
    </g>
  );
};
export const Flame: React.FC<{ t: number; s?: number; seed?: number; logs?: boolean }> = ({ t, s = 1, seed = 0, logs = true }) => {
  const f = (k: number) => Math.sin(t * (13 + k) + seed * 3 + k) * 0.18 + 1;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={-40} rx={130} ry={110} fill="#FF4A12" opacity={0.18} />
      <path d={`M-38 0 Q-50 ${-60 * f(1)} -6 ${-130 * f(2)} Q-2 -70 14 ${-95 * f(3)} Q50 ${-50 * f(4)} 38 0 Z`} fill="#FF6A1F" />
      <path d={`M-20 0 Q-24 ${-40 * f(5)} 0 ${-80 * f(6)} Q22 ${-40 * f(7)} 20 0 Z`} fill="#FFD27A" />
      {logs ? <path d="M-45 4 L45 -4 M-40 -6 L40 6" stroke={W} strokeWidth={6} /> : null}
    </g>
  );
};
export const Smoke: React.FC<{ t: number; seed: number; color?: string; n?: number; spread?: number }> = ({ t, seed, color = "#8A8A8A", n = 7, spread = 1 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const life = (t * 0.25 + i / n + hash(seed)) % 1; return <circle key={i} cx={Math.sin(life * 4 + seed + i) * 60 * life * spread} cy={-life * 900} r={60 + life * 220} fill={color} opacity={0.14 * (1 - life)} />; })}</g>
);
export const Palm: React.FC<{ s?: number; t: number; seed?: number }> = ({ s = 1, t, seed = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0 0 Q-20 -200 10 -420" stroke={W} strokeWidth={14} fill="none" />
    <path d="M0 0 Q-20 -200 10 -420" stroke={INK} strokeWidth={6} fill="none" />
    {Array.from({ length: 7 }, (_, i) => { const a = -150 + i * 50 + Math.sin(t * 1.5 + i + seed) * 4; const r = (a * Math.PI) / 180; return <path key={i} d={`M10 -420 Q${10 + Math.cos(r) * 120} ${-460 + Math.sin(r) * 60} ${10 + Math.cos(r) * 230} ${-400 + Math.abs(Math.sin(r)) * 80}`} stroke={W} strokeWidth={6} fill="none" />; })}
  </g>
);
// cielo + estrellas: fondo de pantalla, casi sin paralaje
export const Sky: React.FC<{ cam: Cam; t: number; glow: string; gx?: number; gy?: number; stars?: number; top?: string }> = ({ cam, t, glow, gx = 50, gy = 62, stars = 0.5, top = "#020202" }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 140% 55% at ${gx - (cam.x % 20000) / 900}% ${gy + (cam.y + 500) / 70}%, ${glow} 0%, rgba(120,8,10,0.45) 30%, rgba(10,3,3,0) 64%), linear-gradient(${top} 0%, #0A0505 45%, #1A0607 70%, #050303 100%)` }} />
    {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: (hash(i) * 1080 - cam.x * 0.01 + 3240) % 1080, top: hash(i + 9) * 640, width: 2, height: 2, borderRadius: 2, background: "#fff", opacity: stars * (0.5 + 0.5 * Math.sin(t * 2 + i)) }} />)}
  </>
);
export const Embers: React.FC<{ t: number; cam: Cam; n?: number; o?: number }> = ({ t, cam, n = 46, o = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => { const life = (t * (0.18 + hash(i) * 0.2) + hash(i + 4)) % 1; return <div key={i} style={{ position: "absolute", left: (hash(i + 7) * 1080 + Math.sin(t + i) * 40 - (cam.x * 0.02) % 1080 + 2160) % 1080, top: 1920 - life * 2100, width: 3 + hash(i) * 5, height: 3 + hash(i) * 5, borderRadius: 9, background: i % 3 ? "#FF7A2A" : "#FFD27A", opacity: (1 - life) * 0.8 * o, boxShadow: "0 0 10px #FF5A1F" }} />; })}</>
);
// acabado de cine: rayos, niebla roja, grano, viñeta, parpadeo
export const Finish: React.FC<{ f: number; t: number; rays?: number; flash?: number }> = ({ f, rays = 1, flash = 0 }) => (
  <>
    <AbsoluteFill style={{ background: "conic-gradient(from 200deg at 50% 38%, rgba(255,90,40,0) 0deg, rgba(255,90,40,0.10) 12deg, rgba(255,90,40,0) 24deg, rgba(255,90,40,0.07) 40deg, rgba(255,90,40,0) 60deg)", mixBlendMode: "screen", opacity: rays }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(120,10,12,0.22) 80%, rgba(0,0,0,0.5) 100%)" }} />
    <Paper f={f} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)" }} />
    <AbsoluteFill style={{ background: "#fff", opacity: flash + random(`fl${Math.floor(f / 2)}`) * 0.02 }} />
  </>
);
// texto en pantalla (dato que no se dice): cita o contador
export const Tag: React.FC<{ t: number; a: number; b: number; children: React.ReactNode; y?: number; size?: number; color?: string }> = ({ t, a, b, children, y = 1460, size = 84, color = W }) => {
  if (t < a || t > b) return null;
  const k = eo(ip(t, a, a + 0.16));
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: size, letterSpacing: 6, color, transform: `scale(${1.25 - 0.25 * k})`, opacity: k * ip(t, b - 0.15, b, 1, 0), textShadow: "0 0 30px rgba(0,0,0,0.9), 0 4px 0 rgba(0,0,0,0.6)" }}>{children}</div>;
};
export const fogDefs = (
  <svg width={0} height={0} style={{ position: "absolute" }}><defs>
    <linearGradient id="fogR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B01015" stopOpacity="0" /><stop offset="0.5" stopColor="#B01015" stopOpacity="0.5" /><stop offset="1" stopColor="#B01015" stopOpacity="0" /></linearGradient>
    <linearGradient id="mud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A3A1E" /><stop offset="1" stopColor="#1E140A" /></linearGradient>
    <linearGradient id="clear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3FA3DE" stopOpacity="0.85" /><stop offset="1" stopColor="#0B2A4A" /></linearGradient>
  </defs></svg>
);
