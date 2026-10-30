import React from "react";
import { AbsoluteFill, interpolate, random, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Kit de animación 2D hecho con código: luz, partículas, personajes con contraluz, objetos y datos
export const FPS = 30;
export const KFONT = "Kit Poppins";
loadFont({ family: KFONT, url: staticFile("fonts/poppins-latin-600-normal.woff2"), weight: "600" });
export const KFONTB = "Kit Poppins Black";
loadFont({ family: KFONTB, url: staticFile("fonts/poppins-latin-900-italic.woff2"), weight: "900", style: "italic" });

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ip = (f: number, i: number[], o: number[]) => interpolate(f, i, o, cl);
export const ease = (t: number) => t * t * (3 - 2 * t);
export const S = (t: number) => Math.round(t * FPS);
// entrada con rebote (sobrepasa un poco y se asienta)
export const pop = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 12) return 1;
  const u = t / 12;
  return 1 + Math.sin(u * Math.PI * 1.2) * 0.18 * (1 - u) + (u < 0.35 ? u / 0.35 - 1 : 0);
};

// ---------- cielo y ambiente ----------
export const Sky: React.FC<{ top: string; mid: string; bottom: string }> = ({ top, mid, bottom }) => (
  <AbsoluteFill style={{ background: `linear-gradient(${top}, ${mid} 55%, ${bottom})` }} />
);
export const Stars: React.FC<{ f: number; n?: number; seed?: string; h?: number }> = ({ f, n = 80, seed = "s", h = 1100 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={random(`${seed}x${i}`) * 1080} cy={random(`${seed}y${i}`) * h} r={0.7 + random(`${seed}r${i}`) * 1.8} fill="#fff" opacity={(0.35 + 0.65 * Math.abs(Math.sin(f / 20 + i * 1.7))) * 0.8} />
    ))}
  </svg>
);
export const Moon: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <div style={{ opacity: o }}>
    <div style={{ position: "absolute", left: x - r * 5, top: y - r * 5, width: r * 10, height: r * 10, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,255,0.28), rgba(220,230,255,0) 55%)" }} />
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #FBFBF4, #D9DCE4 70%)", boxShadow: "0 0 70px rgba(230,236,255,0.55)" }} />
  </div>
);
// rayos de luz volumétrica que vibran levemente
export const GodRays: React.FC<{ f: number; x: number; y: number; color: string; o?: number; n?: number; spread?: number }> = ({ f, x, y, color, o = 0.25, n = 7, spread = 70 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
    <defs>
      <linearGradient id={`gr${x}${y}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const a = ((i - (n - 1) / 2) * spread) / n + Math.sin(f / 40 + i) * 2;
      const w = 40 + random(`gw${i}`) * 90;
      return <path key={i} d={`M${x - 8} ${y} L${x + 8} ${y} L${x + w} ${y + 1900} L${x - w} ${y + 1900} Z`} fill={`url(#gr${x}${y})`} transform={`rotate(${a} ${x} ${y})`} opacity={0.5 + 0.5 * Math.sin(f / 25 + i * 2)} />;
    })}
  </svg>
);
export const Fog: React.FC<{ f: number; y: number; color?: string; o?: number }> = ({ f, y, color = "180,190,220", o = 0.25 }) => (
  <>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: -400 + ((f * (0.6 + i * 0.3) + i * 500) % 1400) - 300, top: y + i * 70, width: 1600, height: 260, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(${color},${o}), rgba(${color},0) 70%)`, filter: "blur(10px)" }} />
    ))}
  </>
);
export const Vignette: React.FC<{ s?: number }> = ({ s = 0.8 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 65% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,${s}) 100%)`, pointerEvents: "none" }} />
);
// grano de película: textura que cambia cada fotograma
export const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} />
    </filter>
    <rect width={1080} height={1920} filter="url(#grain)" />
  </svg>
);

// ---------- partículas ----------
export const Embers: React.FC<{ f: number; x: number; y: number; w?: number; n?: number; seed?: string }> = ({ f, x, y, w = 220, n = 40, seed = "em" }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const life = 50 + random(`${seed}l${i}`) * 50;
      const t = (f + random(`${seed}o${i}`) * life) % life;
      const px = x + (random(`${seed}x${i}`) - 0.5) * w + Math.sin((t + i) / 7) * 18;
      const py = y - t * (4 + random(`${seed}v${i}`) * 5);
      const s = 3 + random(`${seed}s${i}`) * 5;
      return <div key={i} style={{ position: "absolute", left: px, top: py, width: s, height: s, borderRadius: "50%", background: i % 4 ? "#FFB44A" : "#FF6A2A", opacity: ip(t, [0, 8, life * 0.7, life], [0, 1, 0.8, 0]), boxShadow: "0 0 12px #FF8A2A" }} />;
    })}
  </>
);
export const Dust: React.FC<{ f: number; n?: number; color?: string; seed?: string }> = ({ f, n = 40, color = "255,230,190", seed = "du" }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: (random(`${seed}x${i}`) * 1080 + Math.sin(f / 50 + i) * 40 + f * 0.3) % 1080, top: (random(`${seed}y${i}`) * 1920 + Math.cos(f / 60 + i) * 40) % 1920, width: 3 + random(`${seed}s${i}`) * 4, height: 3 + random(`${seed}s${i}`) * 4, borderRadius: "50%", background: `rgba(${color},${0.25 + 0.4 * random(`${seed}o${i}`)})`, filter: "blur(1px)" }} />
    ))}
  </>
);
export const Rain: React.FC<{ f: number; n?: number; o?: number }> = ({ f, n = 90, o = 0.35 }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`rx${i}`) * 1100, top: ((random(`ry${i}`) * 1920 + f * (40 + random(`rv${i}`) * 20)) % 2000) - 80, width: 2, height: 70, background: `linear-gradient(rgba(190,210,255,0), rgba(190,210,255,${o}))`, rotate: "8deg" }} />
    ))}
  </>
);

// ---------- fuego ----------
export const Fire: React.FC<{ f: number; x: number; y: number; scale?: number; grow?: number }> = ({ f, x, y, scale = 1, grow = 1 }) => {
  const g = Math.max(0.001, grow);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${scale})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: -260, top: -180, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,60,0.45), rgba(255,120,40,0) 65%)", opacity: g * (0.8 + 0.2 * Math.sin(f / 3)) }} />
      <svg width={220} height={260} viewBox="0 0 220 260" style={{ position: "relative", left: -110, overflow: "visible" }}>
        {[
          { c: "#FF5A1F", w: 1, o: 0 },
          { c: "#FF9A2E", w: 0.75, o: 1.3 },
          { c: "#FFE08A", w: 0.45, o: 2.6 },
        ].map((l, i) => {
          const h = (200 + 30 * Math.sin(f / 3 + l.o)) * g * l.w + 20;
          const sway = 18 * Math.sin(f / 5 + l.o);
          const ww = 90 * l.w;
          return <path key={i} d={`M${110 - ww} 250 Q${110 - ww * 1.1} ${250 - h * 0.5} ${110 + sway} ${250 - h} Q${110 + ww * 1.1} ${250 - h * 0.5} ${110 + ww} 250 Z`} fill={l.c} style={{ filter: `drop-shadow(0 0 ${20 - i * 5}px ${l.c})` }} />;
        })}
        <path d="M30 250 L190 230 L195 248 L35 262 Z" fill="#2A160E" />
        <path d="M40 232 L185 258 L180 266 L36 244 Z" fill="#3A1F12" />
      </svg>
    </div>
  );
};

// ---------- personajes ----------
// figura con túnica en silueta y borde de luz (contraluz); brazo animable
export type FigProps = {
  x: number;
  y: number; // pies
  h?: number; // altura en px
  rim?: string; // color del contraluz
  rimSide?: 1 | -1; // lado iluminado
  cloth?: string; // tela de acento (manto)
  arm?: number; // ángulo del brazo (0 = abajo, 90 = señalando al frente)
  armSide?: 1 | -1;
  flip?: boolean;
  hood?: boolean;
  kneel?: number; // 0..1
  lean?: number; // grados
  glow?: number; // aura de luz
  o?: number;
  f?: number; // fotograma: respiración, balanceo y tela que ondea
  head?: number; // giro/inclinación de la cabeza en grados
  shadow?: boolean;
  arm2?: number; // segundo brazo
};
export const Figure: React.FC<FigProps> = ({ x, y, h = 520, rim = "#FFB25A", rimSide = 1, cloth, arm = 0, armSide = 1, flip, hood = true, kneel = 0, lean = 0, glow = 0, o = 1, f = 0, head = 0, shadow = true, arm2 = 0 }) => {
  const s = h / 520;
  const ph = (x * 0.013) % 6; // fase propia para que no respiren todos a la vez
  const breathe = 1 + 0.014 * Math.sin(f / 19 + ph);
  const sway = 7 * Math.sin(f / 13 + ph);
  const idleArm = 3 * Math.sin(f / 17 + ph);
  const body = (fill: string) => (
    <g fill={fill}>
      <g transform={`rotate(${head} 100 112)`}>
        <ellipse cx={100} cy={hood ? 70 : 74} rx={hood ? 40 : 34} ry={hood ? 46 : 40} />
        {hood ? <path d="M60 60 Q100 10 140 60 L146 120 L54 120 Z" /> : null}
      </g>
      <path d={`M48 120 Q100 98 152 120 L${170 - kneel * 10} ${380 - kneel * 120} Q${178 + kneel * 20 + sway} ${460} ${182 + kneel * 20 + sway * 1.4} 520 Q100 ${528 + sway * 0.4} ${18 - kneel * 20 + sway * 1.1} 520 Q${24 - kneel * 20 + sway} 460 ${30 + kneel * 10} ${380 - kneel * 120} Z`} />
      <g transform={`rotate(${-(arm + idleArm) * armSide} ${armSide > 0 ? 140 : 60} 140)`}>
        <path d={armSide > 0 ? "M128 128 L158 132 L168 300 L144 304 Z" : "M72 128 L42 132 L32 300 L56 304 Z"} />
        <ellipse cx={armSide > 0 ? 156 : 44} cy={306} rx={16} ry={18} />
      </g>
      <g transform={`rotate(${(arm2 - idleArm) * armSide} ${armSide > 0 ? 60 : 140} 140)`}>
        <path d={armSide > 0 ? "M72 128 L42 132 L32 300 L56 304 Z" : "M128 128 L158 132 L168 300 L144 304 Z"} />
        <ellipse cx={armSide > 0 ? 44 : 156} cy={306} rx={16} ry={18} />
      </g>
    </g>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 200 * s, height: 520 * s, transform: `translate(-50%,-100%) scaleX(${flip ? -1 : 1}) rotate(${lean}deg) scaleY(${breathe})`, transformOrigin: "50% 100%", opacity: o }}>
      {shadow ? <div style={{ position: "absolute", left: -60 * s, top: 500 * s, width: 320 * s, height: 44 * s, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.7), rgba(0,0,0,0) 70%)" }} /> : null}
      {glow > 0 ? <div style={{ position: "absolute", left: -200 * s, top: -150 * s, width: 600 * s, height: 800 * s, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,226,170,${0.45 * glow}), rgba(255,226,170,0) 60%)` }} /> : null}
      <svg width={200 * s} height={520 * s} viewBox="0 0 200 520" style={{ overflow: "visible", position: "absolute", inset: 0 }}>
        <defs>
          <filter id="rimblur">
            <feGaussianBlur stdDeviation={2.2} />
          </filter>
        </defs>
        <g transform={`translate(${rimSide * 5} -2)`} filter="url(#rimblur)" opacity={0.95}>
          {body(rim)}
        </g>
        {body("#07080C")}
        {cloth ? <path d={`M64 130 Q100 118 132 132 L${120 - kneel * 6} ${330 - kneel * 80} L${74 + kneel * 6} ${330 - kneel * 80} Z`} fill={cloth} opacity={0.85} /> : null}
      </svg>
    </div>
  );
};
// gallo en silueta
export const Rooster: React.FC<{ x: number; y: number; s?: number; crow?: number }> = ({ x, y, s = 1, crow = 0 }) => (
  <svg width={220 * s} height={220 * s} viewBox="0 0 220 220" style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-100%)", overflow: "visible" }}>
    <g fill="#08090D">
      <path d="M60 150 Q40 90 70 70 Q60 40 85 30 Q100 22 108 38 L122 34 L112 50 Q130 70 120 110 Q160 80 190 40 Q205 90 175 140 Q150 175 100 175 Q70 175 60 150 Z" transform={`rotate(${-crow * 8} 100 120)`} />
      <path d="M95 175 L92 210 M110 175 L114 210" stroke="#08090D" strokeWidth={6} />
      <path d="M86 28 Q92 10 100 22 Q104 8 110 24" fill="#C42B2B" transform={`rotate(${-crow * 8} 100 120)`} />
    </g>
  </svg>
);
// oveja redondeada
export const Sheep: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = pop(t);
  if (t <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k * s})`, transformOrigin: "50% 100%" }}>
      <svg width={150} height={110} viewBox="0 0 150 110">
        <g fill="#F2EEE6">
          {[30, 55, 80, 105].map((cx, i) => <circle key={i} cx={cx} cy={50 + (i % 2) * 6} r={26} />)}
          <circle cx={70} cy={34} r={26} />
        </g>
        <ellipse cx={128} cy={52} rx={16} ry={20} fill="#2A2420" />
        <path d="M40 80 L40 106 M62 82 L62 106 M88 82 L88 106 M108 80 L108 106" stroke="#2A2420" strokeWidth={7} strokeLinecap="round" />
      </svg>
    </div>
  );
};
// árbol de olivo en silueta
export const Olive: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#05070C" }) => (
  <svg width={360 * s} height={460 * s} viewBox="0 0 360 460" style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-100%)" }}>
    <g fill={c}>
      <path d="M170 460 Q160 360 150 300 Q130 260 160 230 L190 230 Q210 270 196 320 Q192 380 200 460 Z" />
      {[[100, 170, 90], [180, 120, 110], [270, 170, 90], [140, 230, 80], [230, 230, 80], [190, 200, 100]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7} />)}
    </g>
  </svg>
);

// ---------- elementos de texto y datos ----------
export const Bubble: React.FC<{ x: number; y: number; t: number; text: string; tail?: "left" | "right"; size?: number; bg?: string; color?: string; out?: number }> = ({ x, y, t, text, tail = "left", size = 50, bg = "#F6F1E7", color = "#15120E", out = 999 }) => {
  if (t < 0 || t > out) return null;
  const k = pop(t) * ip(t, [out - 6, out], [1, 0]);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: tail === "left" ? "20% 120%" : "80% 120%" }}>
      <div style={{ position: "relative", padding: "20px 34px", borderRadius: 34, background: bg, color, fontFamily: KFONT, fontWeight: 600, fontSize: size, whiteSpace: "nowrap", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
        {text}
        <div style={{ position: "absolute", bottom: -22, [tail === "left" ? "left" : "right"]: 50, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `26px solid ${bg}` }} />
      </div>
    </div>
  );
};
export const Chip: React.FC<{ x: number; y: number; t: number; text: string; accent?: string; small?: string; out?: number }> = ({ x, y, t, text, accent = "#fff", small, out = 9999 }) => {
  if (t < 0 || t > out) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) translateY(${ip(t, [0, 8], [24, 0])}px)`, opacity: ip(t, [0, 6], [0, 1]) * ip(t, [out - 6, out], [1, 0]), padding: "10px 22px", borderRadius: 12, background: "rgba(8,10,16,0.85)", border: "2px solid rgba(255,255,255,0.16)", fontFamily: KFONT, fontWeight: 600, fontSize: 40, color: accent, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", textAlign: "center" }}>
      {text}
      {small ? <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{small}</div> : null}
    </div>
  );
};
export const Big: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string; out?: number }> = ({ x, y, t, text, size = 160, color = "#fff", out = 9999 }) => {
  if (t < 0 || t > out) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) scale(${ip(t, [0, 6], [1.35, 1])})`, opacity: ip(t, [0, 4], [0, 1]) * ip(t, [out - 6, out], [1, 0]), fontFamily: KFONTB, fontStyle: "italic", fontWeight: 900, fontSize: size, color, whiteSpace: "nowrap", letterSpacing: -3, textShadow: `0 0 40px ${color === "#fff" ? "rgba(255,255,255,0.35)" : color}, 0 8px 30px rgba(0,0,0,0.8)` }}>
      {text}
    </div>
  );
};

// ---------- subtítulos palabra por palabra ----------
export type Word = { w: string; s: number; e: number };
export const groupWords = (words: Word[]) => {
  const out: Word[][] = [];
  let g: Word[] = [];
  words.forEach((w, i) => {
    g.push(w);
    const n = words[i + 1];
    if (/[.,?»!]$/.test(w.w) || g.length === 3 || !n || n.s - w.e > 0.4) {
      out.push(g);
      g = [];
    }
  });
  return out;
};
export const Captions: React.FC<{ f: number; groups: Word[][]; keys: Set<string>; y?: number; hl?: string }> = ({ f, groups, keys, y = 250, hl = "#4FA3FF" }) => {
  const t = f / FPS;
  const gi = groups.findIndex((g, i) => t >= g[0].s - 0.06 && t < (groups[i + 1]?.[0].s ?? 999) - 0.06);
  if (gi < 0) return null;
  const g = groups[gi];
  const last = g[g.length - 1];
  if (t > last.e + 1.2 && gi === groups.length - 1) return null;
  return (
    <div style={{ position: "absolute", top: y, left: 70, right: 70, textAlign: "center", fontFamily: KFONT, fontWeight: 600, fontSize: 62, lineHeight: 1.25, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.8)" }}>
      {g.map((w, i) => {
        const on = t >= w.s - 0.06;
        const k = keys.has(w.w.replace(/[^\wáéíóúñÁÉÍÓÚÑ]/g, "").toLowerCase());
        return (
          <span key={i} style={{ opacity: on ? 1 : 0.32, padding: k && on ? "0 8px" : undefined, margin: k && on ? "0 4px" : undefined, border: k && on ? `3px solid ${hl}` : undefined, borderRadius: 8, background: k && on ? "rgba(79,163,255,0.14)" : undefined }}>
            {i && !(k && on) ? " " : ""}
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// capa con parallax: d < 1 se mueve menos que la cámara (fondo), d > 1 más (primer plano)
export type Cam = [number, number, number, number];
export const Layer: React.FC<{ cam: Cam; d: number; cx0?: number; cy0?: number; shake?: number; children: React.ReactNode }> = ({ cam, d, cx0 = 950, cy0 = 1250, shake = 0, children }) => {
  const [, x, y, z] = cam;
  const zz = 1 + (z - 1) * d;
  const cx = cx0 + (x - cx0) * d;
  const cy = cy0 + (y - cy0) * d;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1900, height: 2400, transformOrigin: "0 0", transform: `translate(${540 - cx * zz + shake * d}px, ${960 - cy * zz + shake * 0.6 * d}px) scale(${zz})` }}>{children}</div>
  );
};
// humo que sube y se disipa
export const Smoke: React.FC<{ f: number; x: number; y: number; n?: number; seed?: string; color?: string }> = ({ f, x, y, n = 10, seed = "sm", color = "120,110,120" }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const life = 90;
      const t = (f + i * (life / n)) % life;
      const u = t / life;
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(u * 4 + i) * 40 * u + (random(`${seed}${i}`) - 0.5) * 30, top: y - u * 520, width: 80 + u * 200, height: 80 + u * 200, translate: "-50% -50%", borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},${0.22 * (1 - u)}), rgba(${color},0) 70%)`, filter: "blur(6px)" }} />;
    })}
  </>
);
// antorcha de pared o en mano
export const Torch: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => (
  <>
    <div style={{ position: "absolute", left: x - 150 * s, top: y - 150 * s, width: 300 * s, height: 300 * s, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,70,0.38), rgba(255,160,70,0) 65%)", opacity: 0.8 + 0.2 * Math.sin(f / 3 + x) }} />
    <svg width={40 * s} height={70 * s} viewBox="0 0 40 70" style={{ position: "absolute", left: x - 20 * s, top: y - 50 * s, overflow: "visible" }}>
      <path d={`M8 50 Q4 ${30 + 4 * Math.sin(f / 2 + x)} ${20 + 5 * Math.sin(f / 3 + x)} ${4 + 3 * Math.sin(f / 2.5)} Q36 30 32 50 Z`} fill="#FF9A2E" style={{ filter: "drop-shadow(0 0 10px #FF8A2A)" }} />
      <path d={`M14 50 Q12 38 ${20 + 3 * Math.sin(f / 2 + x)} 22 Q28 38 26 50 Z`} fill="#FFE08A" />
      <rect x={16} y={48} width={8} height={22} fill="#2A160E" />
    </svg>
  </>
);
// soldado con lanza
export const Soldier: React.FC<{ f: number; x: number; y: number; h?: number; rim?: string; torch?: boolean; flip?: boolean }> = ({ f, x, y, h = 380, rim = "#FFB25A", torch, flip }) => (
  <>
    <div style={{ position: "absolute", left: x + (flip ? -1 : 1) * h * 0.2, top: y - h * 1.25, width: 5, height: h * 1.25, background: "#07080C", boxShadow: `1px 0 0 ${rim}` }} />
    <svg width={30} height={40} viewBox="0 0 30 40" style={{ position: "absolute", left: x + (flip ? -1 : 1) * h * 0.2 - 12, top: y - h * 1.25 - 34 }}>
      <path d="M15 0 L28 40 L2 40 Z" fill="#B9C0CC" />
    </svg>
    <Figure x={x} y={y} h={h} rim={rim} rimSide={flip ? -1 : 1} hood={false} f={f} flip={flip} arm={torch ? 70 : 10} armSide={-1} />
    {torch ? <Torch f={f} x={x - (flip ? -1 : 1) * h * 0.32} y={y - h * 0.86} s={h / 380} /> : null}
  </>
);
// pájaros en vuelo
export const Birds: React.FC<{ f: number; x0: number; y0: number; n?: number }> = ({ f, x0, y0, n = 6 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + f * (3 + i * 0.4) + i * 50;
      const y = y0 - f * 0.8 + Math.sin(f / 9 + i) * 10 + i * 24;
      const w = 10 * Math.sin(f / 4 + i * 2);
      return <path key={i} d={`M${x - 18} ${y - w} Q${x - 8} ${y - 6} ${x} ${y} Q${x + 8} ${y - 6} ${x + 18} ${y - w}`} stroke="#1A0E18" strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
  </svg>
);
// entrada de escena: llega con un leve empuje y desenfoque
export const Enter: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${ip(f, [0, 9], [1.1, 1])})`, filter: f < 9 ? `blur(${ip(f, [0, 9], [9, 0])}px)` : undefined }}>{children}</AbsoluteFill>
);
