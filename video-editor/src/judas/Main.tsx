import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/judas/words.json";
import { Captions, Dust, FPS, Figure, GodRays, Grain, S, Vignette, Word, groupWords } from "../kit/Kit";

// ZK · "¿Por cuánto vendió Judas a Jesús?" — fórmula viral: pregunta, datos, comparación, giro y reenvío. Bucle.
const END = 55.7;
export const JUDAS_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["judas", "30", "plata", "fortuna", "tiro", "14", "420", "puño", "denario", "4", "meses", "moisés", "éxodo", "buey", "esclavo", "dios", "templo", "sangre", "mucho", "poco", "asusta", "precio"]);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const pop = (d: number) => (d < 0 ? 0 : ip(d, [0, 5, 9], [0, 1.15, 1]));

// ---------- piezas ----------
const Bg: React.FC<{ a: string; b: string; f: number; dust?: string }> = ({ a, b, f, dust = "220,220,235" }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 55%, ${a}, ${b})` }} />
    <Dust f={f} n={40} color={dust} />
  </AbsoluteFill>
);
const Coin: React.FC<{ x: number; y: number; r: number; spin?: number; o?: number }> = ({ x, y, r, spin = 0, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: o, transform: `scaleX(${Math.cos(spin) || 0.05})` }}>
    <svg width={r * 2} height={r * 2} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="cg" cx="38%" cy="32%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.45" stopColor="#C9CED8" /><stop offset="1" stopColor="#6E7480" /></radialGradient>
      </defs>
      <circle cx={50} cy={50} r={48} fill="url(#cg)" stroke="#4A4F58" strokeWidth={2} />
      <circle cx={50} cy={50} r={38} fill="none" stroke="#7D838E" strokeWidth={2} strokeDasharray="3 4" />
      <path d="M38 62 Q36 44 48 36 Q60 32 62 44 Q58 40 52 44 Q60 50 56 62 Z" fill="#8A909B" />
    </svg>
  </div>
);
const Chip: React.FC<{ d: number; txt: string; y: number; color?: string; size?: number }> = ({ d, txt, y, color = "#4FA3FF", size = 64 }) =>
  d < 0 ? null : (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${pop(d)})`, padding: "14px 34px", borderRadius: 18, background: "rgba(8,10,16,0.86)", border: `4px solid ${color}`, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: size, color: "#fff", boxShadow: `0 0 40px ${color}66` }}>{txt}</div>
    </div>
  );
const Big: React.FC<{ d: number; txt: string; y: number; size?: number; color?: string }> = ({ d, txt, y, size = 260, color = "#F2F4F8" }) =>
  d < 0 ? null : (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: size, color, transform: `scale(${pop(d)})`, textShadow: `0 0 50px ${color}88, 0 10px 30px rgba(0,0,0,0.9)`, whiteSpace: "pre", lineHeight: 1 }}>{txt}</div>
  );
const Counter: React.FC<{ d: number; dur: number; to: number; y: number; suffix?: string; size?: number; color?: string }> = ({ d, dur, to, y, suffix = "", size = 240, color }) =>
  d < 0 ? null : <Big d={d} txt={`${Math.round(ip(d, [0, dur], [0, to]))}${suffix}`} y={y} size={size} color={color} />;
const Cross: React.FC<{ x: number; y: number; h: number; glow?: number }> = ({ x, y, h, glow = 1 }) => (
  <div style={{ position: "absolute", left: x - h * 0.3, top: y - h, width: h * 0.6, height: h, filter: `drop-shadow(0 0 ${40 * glow}px rgba(255,230,170,${0.8 * glow}))` }}>
    <div style={{ position: "absolute", left: h * 0.25, top: 0, width: h * 0.1, height: h, background: "linear-gradient(90deg,#6A4A2A,#9A7046,#5A3A20)" }} />
    <div style={{ position: "absolute", left: 0, top: h * 0.22, width: h * 0.6, height: h * 0.09, background: "linear-gradient(#9A7046,#5A3A20)" }} />
  </div>
);
const Scroll: React.FC<{ d: number; lines: string[]; y: number }> = ({ d, lines, y }) => {
  const u = ip(d, [0, 12], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 140, right: 140, top: y, height: 560 * u, overflow: "hidden", background: "linear-gradient(#E9D7AE,#D2B983)", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", borderTop: "22px solid #8A6A3A", borderBottom: "22px solid #8A6A3A" }}>
      {lines.map((l, i) => <div key={i} style={{ marginTop: i ? 10 : 60, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: i ? 52 : 90, color: "#3A2614", opacity: ip(d - 8 - i * 6, [0, 6], [0, 1]) }}>{l}</div>)}
    </div>
  );
};

// cámara: dos encuadres por escena (abre y corta a uno más cerrado a la mitad) + golpe de entrada
const Cam: React.FC<{ dur: number; ox?: number; oy?: number; children: React.ReactNode }> = ({ dur, ox = 540, oy = 1050, children }) => {
  const f = useCurrentFrame();
  const mid = Math.floor(dur * 0.55);
  const z = f < mid ? ip(f, [0, mid], [1.0, 1.06]) * ip(f, [0, 5], [1.08, 1]) : ip(f, [mid, dur], [1.16, 1.24]) * ip(f - mid, [0, 5], [1.07, 1]);
  return <AbsoluteFill style={{ transform: `scale(${z}) rotate(${Math.sin(f / 23) * 0.6}deg)`, transformOrigin: `${ox}px ${oy}px` }}>{children}</AbsoluteFill>;
};

// ---------- escenas (t0 = inicio en el video) ----------
type Sc = { t0: number; C: React.FC<{ t0: number }>; ox?: number; oy?: number };
const useD = (t0: number) => { const f = useCurrentFrame(); return { f, d: (at: number) => f - S(at - t0) }; };

const Hook: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#2A2230" b="#07060A" f={f} />
      <GodRays f={f} x={540} y={-100} color="#FFD9A0" o={0.18} n={7} />
      <Figure f={f} x={540} y={1620} h={760} rim="#E8B060" rimSide={1} cloth="#3A2A20" hood arm={60} />
      {Array.from({ length: 22 }, (_, i) => { const tt = d(2.4) - random(`h${i}`) * 14; return tt < 0 ? null : <Coin key={i} x={320 + random(`hx${i}`) * 440} y={760 + tt * tt * 0.9} r={30} spin={tt / 3 + i} />; })}
      <Counter d={d(2.45)} dur={8} to={30} y={620} />
    </AbsoluteFill>
  );
};
const Fortuna: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const s = ip(d(4.5), [0, 18], [1, 0.35]);
  return (
    <AbsoluteFill>
      <Bg a="#3A2A10" b="#0A0704" f={f} dust="255,220,150" />
      <div style={{ position: "absolute", left: 540 - 300, top: 1000 - 200, width: 600, height: 420, transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: "40% 0 0 0", background: "linear-gradient(#7A4A1A,#3A200A)", border: "8px solid #C89A3A", borderRadius: 18 }} />
        <div style={{ position: "absolute", left: 30, right: 30, top: "10%", height: "36%", borderRadius: "50% 50% 8px 8px", background: "radial-gradient(circle at 50% 70%, #FFE7A0, #E0A830 60%, #A06A10)", boxShadow: "0 0 90px rgba(255,200,80,0.7)" }} />
      </div>
      <Big d={d(4.5)} txt="✕" y={680} size={320} color="#FF4A4A" />
    </AbsoluteFill>
  );
};
const Siclo: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#2A3040" b="#06080C" f={f} />
      <Coin x={540} y={1080} r={260} spin={f / 12} />
      <Chip d={d(6.5)} txt="SICLO DE TIRO" y={560} />
      <Big d={d(8.0)} txt="14 g" y={1400} size={200} color="#C9D6E8" />
    </AbsoluteFill>
  );
};
const Gramos: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const n = Math.round(ip(d(9.9), [0, 30], [0, 30]));
  return (
    <AbsoluteFill>
      <Bg a="#2A3040" b="#06080C" f={f} />
      {Array.from({ length: n }, (_, i) => <Coin key={i} x={330 + (i % 6) * 84} y={1500 - Math.floor(i / 6) * 70} r={44} />)}
      <Big d={d(9.9)} txt="14 × 30" y={560} size={130} color="#9FB4D0" />
      <Counter d={d(11.3)} dur={14} to={420} suffix=" g" y={740} size={230} />
    </AbsoluteFill>
  );
};
const Puno: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const c = ip(d(13.7), [0, 10], [0, 1]);
  return (
    <AbsoluteFill>
      <Bg a="#30241C" b="#080504" f={f} />
      {Array.from({ length: 9 }, (_, i) => <Coin key={i} x={430 + (i % 3) * 90} y={1100 + Math.floor(i / 3) * 40} r={44} o={1 - c * 0.9} />)}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 1180) scale(${1 + c * 0.1})`}>
          <path d={`M-260 ${120 - c * 40} Q-280 -60 -150 ${-120 + c * 60} L150 ${-120 + c * 60} Q280 -60 260 ${120 - c * 40} Q200 260 0 280 Q-200 260 -260 ${120 - c * 40} Z`} fill="#B98466" stroke="#3A2216" strokeWidth={8} />
          {[-150, -50, 50, 150].map((x, i) => <rect key={i} x={x - 45} y={-150 + c * 80 - (i === 1 || i === 2 ? 30 : 0) * (1 - c)} width={90} height={180 - c * 90} rx={45} fill="#C8937A" stroke="#3A2216" strokeWidth={6} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
const Jornalero: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#F2B36A, #E07A3A 45%, #6A4A20 46%, #3A2810)" }} />
      <div style={{ position: "absolute", left: 540 - 140, top: 560, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,#FFF4C8,#FFC860 60%,rgba(255,200,96,0))" }} />
      <Figure f={f} x={540} y={1560} h={640} rim="#FFE0A0" rimSide={1} cloth="#6A4A2A" hood={false} arm={ip(Math.sin(f / 6), [-1, 1], [20, 90])} />
      <Chip d={d(16.8)} txt="1 DENARIO = 1 DÍA" y={1640} color="#F2C14E" size={58} />
    </AbsoluteFill>
  );
};
const Equivale: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#2A3040" b="#06080C" f={f} />
      <Coin x={540} y={760} r={150} spin={f / 20} />
      <Big d={d(18.9)} txt="=" y={900} size={180} />
      {[0, 1, 2, 3].map((i) => (d(19.7) - i * 3 >= 0 ? <div key={i} style={{ transform: `scale(${pop(d(19.7) - i * 3)})` }}><Coin x={270 + i * 180} y={1320} r={70} /></div> : null))}
      <Chip d={d(20.0)} txt="4 DENARIOS" y={1450} color="#F2C14E" />
    </AbsoluteFill>
  );
};
const Meses: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const day = Math.round(ip(d(21.2), [0, 26], [1, 120]));
  return (
    <AbsoluteFill>
      <Bg a="#30303A" b="#08080C" f={f} />
      <div style={{ position: "absolute", left: 240, top: 640, width: 600, height: 640, borderRadius: 30, background: "#F4F1EA", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden", transform: `rotateX(${(f % 3) * 2}deg)` }}>
        <div style={{ height: 150, background: "#C9302C", color: "#fff", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 70, textAlign: "center", lineHeight: "150px" }}>DÍA</div>
        <div style={{ textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 300, color: "#1A1A1A", lineHeight: "460px" }}>{day}</div>
      </div>
      <Big d={d(22.0)} txt="4 MESES" y={1360} size={170} color="#F2C14E" />
    </AbsoluteFill>
  );
};
const Ley: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#3A2A18" b="#0A0704" f={f} dust="255,220,160" />
      <GodRays f={f} x={540} y={-100} color="#FFE2A8" o={0.25} n={9} />
      <Scroll d={d(24.2)} lines={["LEY DE MOISÉS"]} y={720} />
    </AbsoluteFill>
  );
};
const Exodo: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#3A2A18" b="#0A0704" f={f} dust="255,220,160" />
      <Scroll d={d(25.4) + 12} lines={["ÉXODO 21:32", "«…pagará su dueño", "treinta siclos de plata»"]} y={640} />
    </AbsoluteFill>
  );
};
const Buey: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const ox = ip(d(28.2), [0, 14], [-500, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#3A2A30,#140C10 60%,#0A0606)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${560 + ox} 1180)`} fill="#120A08" stroke="#E0A060" strokeWidth={5}>
          <ellipse cx={0} cy={0} rx={300} ry={170} />
          <path d="M260 -60 Q360 -100 420 -40 Q440 40 360 70 Q300 60 260 30 Z" />
          <path d="M370 -80 Q420 -170 470 -150 M330 -90 Q300 -180 250 -170" fill="none" strokeWidth={12} />
          {[-200, -90, 90, 200].map((x, i) => <rect key={i} x={x - 26} y={120} width={52} height={200} />)}
        </g>
      </svg>
      {d(29.1) >= 0 ? <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ip(d(29.1), [0, 6], [0, 1]) }}>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={160 + i * 95} cy={1560 + Math.sin(i) * 10} rx={44} ry={26} fill="none" stroke="#9AA0AA" strokeWidth={12} />)}</svg> : null}
      <Chip d={d(30.8)} txt="30 SICLOS" y={600} color="#F2C14E" size={90} />
    </AbsoluteFill>
  );
};
const Precio: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const sw = Math.sin(f / 9) * 8;
  return (
    <AbsoluteFill>
      <Bg a="#2A1416" b="#080404" f={f} dust="255,180,170" />
      <div style={{ position: "absolute", left: 540 - 300, top: 700, width: 600, height: 360, transform: `rotate(${sw}deg)`, transformOrigin: "50% -120px" }}>
        <div style={{ position: "absolute", left: 296, top: -120, width: 8, height: 130, background: "#C9A060" }} />
        <div style={{ position: "absolute", inset: 0, background: "#E9D7AE", borderRadius: "40px 18px 18px 40px", border: "6px solid #8A6A3A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 110, color: "#3A2614" }}>30 SICLOS</div>
      </div>
      {d(33.3) >= 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", transform: `rotate(-8deg) scale(${ip(d(33.3), [0, 4], [2.2, 1])})`, opacity: ip(d(33.3), [0, 3], [0, 1]) }}><span style={{ display: "inline-block", padding: "16px 40px", border: "10px solid #D42A2A", color: "#D42A2A", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 68, letterSpacing: 3, whiteSpace: "nowrap" }}>PRECIO DE UN ESCLAVO</span></div> : null}
    </AbsoluteFill>
  );
};
const Balanza: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const tilt = ip(d(36.8), [0, 20], [0, -14]);
  return (
    <AbsoluteFill>
      <Bg a="#2A2430" b="#07060A" f={f} />
      <div style={{ position: "absolute", left: 535, top: 820, width: 10, height: 760, background: "#9A8060" }} />
      <div style={{ position: "absolute", left: 140, top: 820, width: 800, height: 10, background: "#C9A060", transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: -10, top: 0 }}><Cross x={70} y={-10} h={560} glow={1} /></div>
        {Array.from({ length: 8 }, (_, i) => <Coin key={i} x={740 + (i % 3) * 40 - 40} y={-30 - Math.floor(i / 3) * 34} r={36} />)}
      </div>
      <Chip d={d(35.2)} txt="HIJO DE DIOS" y={560} color="#F2C14E" />
    </AbsoluteFill>
  );
};
const Arrepentido: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#1E1A24" b="#040306" f={f} />
      <Figure f={f} x={540} y={1600} h={640} rim="#8A98B8" rimSide={-1} cloth="#2A2228" hood kneel={0.8} head={-20} />
    </AbsoluteFill>
  );
};
const Templo: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#2A2418,#120E08 62%,#3A3020 63%,#1A140A)" }} />
      {[120, 330, 750, 960].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 50, top: 300, width: 100, height: 900, background: "linear-gradient(90deg,#5A4A30,#9A8460,#4A3A24)" }} />)}
      <GodRays f={f} x={540} y={-80} color="#FFE6B0" o={0.22} n={9} />
      {Array.from({ length: 30 }, (_, i) => {
        const tt = d(40.0) - random(`t${i}`) * 6;
        if (tt < 0) return null;
        const vx = (random(`tx${i}`) - 0.5) * 30;
        const y = Math.min(1380, 700 + tt * 22 + 0.6 * tt * tt);
        const bounce = y >= 1380 ? Math.abs(Math.sin(tt / 3)) * 60 * Math.exp(-tt / 20) : 0;
        return <Coin key={i} x={540 + vx * tt} y={y - bounce} r={30} spin={tt / 2 + i} />;
      })}
      <Chip d={d(41.1)} txt="TEMPLO" y={1500} />
    </AbsoluteFill>
  );
};
const Campo: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const red = ip(d(46.0), [0, 12], [0, 1]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(rgb(${60 + 140 * red},${50 - 20 * red},${60 - 30 * red}), rgb(${30 + 60 * red},10,10) 58%, #1A120C 59%, #0C0806)` }} />
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 130, top: 1180 + (i % 2) * 40, width: 80, height: 110, borderRadius: "40px 40px 6px 6px", background: "#3A3430", opacity: ip(d(43.4) - i * 2, [0, 6], [0, 1]) }} />)}
      {d(45.6) >= 0 ? <div style={{ position: "absolute", left: 300, top: 860, width: 480, transform: `rotate(-3deg) scale(${pop(d(45.6))})` }}>
        <div style={{ background: "#5A3A20", border: "6px solid #2A1A0A", padding: "20px 0", textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#F0D8B0" }}>CAMPO DE SANGRE</div>
        <div style={{ margin: "0 auto", width: 26, height: 260, background: "#3A2414" }} />
      </div> : null}
      <Chip d={d(43.9)} txt="EXTRANJEROS" y={1460} />
    </AbsoluteFill>
  );
};
const Mucho: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const shrink = ip(d(49.5), [0, 18], [1, 0.25]);
  return (
    <AbsoluteFill>
      <Bg a="#2A2430" b="#07060A" f={f} />
      <GodRays f={f} x={540} y={-100} color="#FFE2A8" o={0.3} n={11} />
      <Cross x={540} y={1460} h={ip(d(47.1), [0, 20], [700, 900])} />
      <div style={{ transform: `scale(${shrink})`, transformOrigin: "540px 1540px" }}>
        {Array.from({ length: 6 }, (_, i) => <Coin key={i} x={400 + i * 56} y={1540} r={40} />)}
      </div>
      <Chip d={d(50.1)} txt="MUY POCO" y={1600} color="#FF5A4A" />
    </AbsoluteFill>
  );
};
const Asusta: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f } = useD(t0);
  return (
    <AbsoluteFill style={{ background: "#020203" }}>
      <Figure f={f} x={540} y={1700} h={900} rim="#6A2A2A" rimSide={1} cloth="#1A1012" hood o={ip(f, [0, 20], [0.3, 1])} />
      <Vignette s={0.95} />
    </AbsoluteFill>
  );
};
const Enviar: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Bg a="#1E2A3A" b="#05070C" f={f} />
      <div style={{ position: "absolute", left: 290, top: 560, width: 500, height: 980, borderRadius: 60, background: "#0E1218", border: "10px solid #2A3340", boxShadow: "0 30px 90px rgba(0,0,0,0.7)" }}>
        <div style={{ margin: "120px 40px 0", padding: "26px 30px", borderRadius: 30, background: "#1F6FEB", color: "#fff", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 40, transform: `scale(${pop(d(53.1))})` }}>¿Sabías por cuánto vendió Judas a Jesús? 👀</div>
        <Coin x={250} y={600} r={90} spin={f / 14} />
        <div style={{ position: "absolute", left: 150, bottom: 60, width: 200, height: 90, borderRadius: 45, background: "#25D366", color: "#fff", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "90px", transform: `scale(${1 + 0.06 * Math.sin(f / 4)})` }}>ENVIAR</div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Sc[] = [
  { t0: 0, C: Hook }, { t0: 3.9, C: Fortuna }, { t0: 5.7, C: Siclo }, { t0: 9.9, C: Gramos }, { t0: 13.1, C: Puno }, { t0: 14.5, C: Jornalero, oy: 1200 },
  { t0: 17.9, C: Equivale }, { t0: 20.7, C: Meses }, { t0: 23.1, C: Ley }, { t0: 25.5, C: Exodo }, { t0: 27.9, C: Buey }, { t0: 32.4, C: Precio },
  { t0: 34.5, C: Balanza }, { t0: 37.5, C: Arrepentido, oy: 1300 }, { t0: 39.1, C: Templo }, { t0: 41.6, C: Campo }, { t0: 47.1, C: Mucho, oy: 1300 }, { t0: 50.7, C: Asusta, oy: 900 }, { t0: 52.3, C: Enviar },
];
const IMPACTS = [2.45, 8.0, 11.3, 22.0, 30.8, 33.3, 35.2, 40.0, 46.0, 50.1];

const SFX: [number, string, number][] = [
  [2.4, "judas/monedas", 0.5], [11.3, "judas/moneda", 0.5], [19.7, "judas/moneda", 0.35], [30.8, "judas/moneda", 0.45],
  [33.3, "sfx/impact", 0.45], [40.0, "judas/monedas", 0.55], [46.0, "sfx/impact", 0.35], [52.3, "sfx/whoosh", 0.3],
];

export const Judas: React.FC = () => {
  const f = useCurrentFrame();
  const imp = IMPACTS.reduce((o, t) => { const dd = f - S(t); return dd >= 0 && dd < 9 ? Math.max(o, 1 - dd / 9) : o; }, 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.08) saturate(1.1)", transform: `translate(${(random(`ix${f}`) - 0.5) * 18 * imp}px, ${(random(`iy${f}`) - 0.5) * 18 * imp}px) scale(${1 + 0.035 * imp})` }}>
        {SCENES.map((sc, i) => {
          const end = SCENES[i + 1]?.t0 ?? END;
          const dur = S(end) - S(sc.t0);
          return (
            <Sequence key={i} from={S(sc.t0)} durationInFrames={dur}>
              <Cam dur={dur} ox={sc.ox} oy={sc.oy}><sc.C t0={sc.t0} /></Cam>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${CUTF(f)})`, pointerEvents: "none" }} />
      <Grain f={f} />
      <Vignette s={0.7} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("judas/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={S(t)} durationInFrames={60}><Audio src={staticFile(`${n}.wav`)} volume={v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
const CUTF = (f: number) => SCENES.slice(1).reduce((o, sc) => { const dd = f - S(sc.t0); return dd >= 0 && dd < 4 ? Math.max(o, 0.16 * (1 - dd / 4)) : o; }, 0);
