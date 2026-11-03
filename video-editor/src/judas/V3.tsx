import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import data from "../../public/judas/words.json";
import { Captions, FPS, Grain, S, Vignette, Word, groupWords } from "../kit/Kit";
import { Burst, Coin3D, T } from "./Fx";

// ZK · Judas v3 — se anima la acción de cada frase, paleta luminosa, planos llenos, protagonista fijo, pocos efectos.
const END = 55.7;
export const JUDAS3_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["judas", "30", "plata", "fortuna", "tiro", "14", "420", "puño", "denario", "4", "meses", "moisés", "éxodo", "buey", "esclavo", "dios", "templo", "sangre", "mucho", "poco", "asusta", "precio"]);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const pop = (d: number) => (d < 0 ? 0 : ip(d, [0, 5, 9], [0, 1.12, 1]));
const useD = (t0: number) => { const f = useCurrentFrame(); return { f, d: (at: number) => f - S(at - t0) }; };

// ---------- escenario luminoso ----------
const Sky: React.FC<{ top: string; bot: string; f: number; glow?: string }> = ({ top, bot, f, glow = "rgba(255,255,255,0.35)" }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(${top}, ${bot})` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 40% at 50% 30%, ${glow}, rgba(0,0,0,0) 70%)` }} />
    {Array.from({ length: 18 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: (random(`p${i}`) * 1080 + f * (0.4 + random(`pv${i}`))) % 1080, top: (random(`py${i}`) * 1920 - f * 0.6 + 1920) % 1920, width: 6 + random(`ps${i}`) * 10, height: 6 + random(`ps${i}`) * 10, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
    ))}
  </AbsoluteFill>
);

// ---------- moneda plana con brillo ----------
const Coin: React.FC<{ x: number; y: number; r: number; spin?: number; dull?: number }> = ({ x, y, r, spin = 0, dull = 0 }) => (
  <svg width={r * 2} height={r * 2} viewBox="0 0 100 100" style={{ position: "absolute", left: x - r, top: y - r, transform: `scaleX(${Math.max(0.08, Math.abs(Math.cos(spin)))})`, filter: dull ? `grayscale(${dull}) brightness(${1 - dull * 0.4})` : "none", overflow: "visible" }}>
    <defs><radialGradient id="c3" cx="35%" cy="30%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#D2D7E0" /><stop offset="1" stopColor="#8A909C" /></radialGradient></defs>
    <ellipse cx={50} cy={58} rx={48} ry={44} fill="rgba(0,0,0,0.25)" />
    <circle cx={50} cy={50} r={47} fill="url(#c3)" stroke="#6A707C" strokeWidth={3} />
    <circle cx={50} cy={50} r={37} fill="none" stroke="#9AA0AB" strokeWidth={2.5} strokeDasharray="3 4" />
    <path d="M50 28 Q62 36 60 50 L70 48 Q64 60 56 62 L58 74 L50 70 L42 74 L44 62 Q36 60 30 48 L40 50 Q38 36 50 28 Z" fill="#9AA0AB" />
  </svg>
);

// ---------- etiqueta pegada al objeto (con línea de señal) ----------
const Tag: React.FC<{ d: number; txt: string; ax: number; ay: number; tx: number; ty: number; color?: string; size?: number }> = ({ d, txt, ax, ay, tx, ty, color = "#1F6FEB", size = 46 }) => {
  if (d < 0) return null;
  const k = eo(ip(d, [0, 8], [0, 1]));
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * k} y2={ay + (ty - ay) * k} stroke="#fff" strokeWidth={5} />
        <circle cx={ax} cy={ay} r={10} fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%,-50%) scale(${pop(d - 4)})`, padding: "10px 24px", borderRadius: 14, background: color, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: size, color: "#fff", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>{txt}</div>
    </>
  );
};
const Num: React.FC<{ d: number; txt: string; y: number; size?: number; color?: string }> = ({ d, txt, y, size = 220, color = "#FFFFFF" }) =>
  d < 0 ? null : <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: size, color, transform: `scale(${pop(d)})`, textShadow: "0 8px 0 rgba(0,0,0,0.25), 0 14px 40px rgba(0,0,0,0.35)", lineHeight: 1 }}>{txt}</div>;

// ---------- Judas: protagonista fijo ----------
type Pose = { armR?: number; armL?: number; head?: number; mood?: "neutral" | "greedy" | "sad"; eyes?: number };
const JudasChar: React.FC<{ x: number; y: number; s?: number; f: number; pose?: Pose; flip?: boolean }> = ({ x, y, s = 1, f, pose = {}, flip }) => {
  const { armR = 10, armL = -10, head = 0, mood = "neutral", eyes = 1 } = pose;
  const br = Math.sin(f / 18) * 3;
  const mouth = mood === "greedy" ? "M88 150 Q100 162 112 150" : mood === "sad" ? "M88 156 Q100 146 112 156" : "M90 153 L110 153";
  return (
    <svg width={200 * s} height={420 * s} viewBox="0 0 200 420" style={{ position: "absolute", left: x - 100 * s, top: y - 420 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <linearGradient id="robe" x1="0" x2="1"><stop offset="0" stopColor="#2E5A44" /><stop offset="0.55" stopColor="#3F7A5C" /><stop offset="1" stopColor="#23463A" /></linearGradient>
        <radialGradient id="skin" cx="40%" cy="35%"><stop offset="0" stopColor="#F2C29C" /><stop offset="1" stopColor="#C98C63" /></radialGradient>
      </defs>
      <ellipse cx={100} cy={414} rx={80} ry={10} fill="rgba(0,0,0,0.25)" />
      {/* brazo izquierdo (detrás) */}
      <g transform={`rotate(${armL} 60 210)`}><rect x={40} y={200} width={34} height={130} rx={17} fill="#2A5040" /><circle cx={57} cy={334} r={18} fill="url(#skin)" /></g>
      {/* cuerpo */}
      <path d={`M48 ${205 + br} Q100 ${180 + br} 152 ${205 + br} L172 410 L28 410 Z`} fill="url(#robe)" />
      <path d={`M90 ${200 + br} L100 300 L110 ${200 + br}`} stroke="#C9A050" strokeWidth={6} fill="none" />
      <rect x={60} y={292} width={80} height={12} rx={6} fill="#8A5A2A" />
      {/* cabeza */}
      <g transform={`rotate(${head} 100 170)`}>
        <path d="M54 130 Q52 60 100 52 Q148 60 146 130 L150 200 Q100 186 50 200 Z" fill="#2A4A3A" />
        <ellipse cx={100} cy={128} rx={36} ry={42} fill="url(#skin)" />
        <path d="M66 136 Q70 182 100 186 Q130 182 134 136 Q122 160 100 160 Q78 160 66 136 Z" fill="#4A2E1A" />
        <path d={mouth} stroke="#2A160C" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={mood === "sad" ? "M78 108 L92 112 M108 112 L122 108" : "M78 110 L92 106 M108 106 L122 110"} stroke="#3A2414" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={86} cy={122} rx={7} ry={7 * eyes} fill="#fff" /><ellipse cx={114} cy={122} rx={7} ry={7 * eyes} fill="#fff" />
        <circle cx={87} cy={123} r={3.5 * eyes} fill="#1A1A1A" /><circle cx={115} cy={123} r={3.5 * eyes} fill="#1A1A1A" />
      </g>
      {/* brazo derecho (delante) */}
      <g transform={`rotate(${armR} 140 210)`}><rect x={126} y={200} width={34} height={130} rx={17} fill="#3A7055" /><circle cx={143} cy={334} r={18} fill="url(#skin)" /></g>
    </svg>
  );
};

// ---------- balanza ----------
const Balance: React.FC<{ tilt: number; left: React.ReactNode; right: React.ReactNode; y?: number }> = ({ tilt, left, right, y = 900 }) => {
  const a = (tilt * Math.PI) / 180, L = 330;
  const lx = 540 - Math.cos(a) * L, ly = y - Math.sin(a) * L, rx = 540 + Math.cos(a) * L, ry = y + Math.sin(a) * L;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M500 ${y + 640} L580 ${y + 640} L556 ${y + 20} L524 ${y + 20} Z`} fill="#8A6A3A" />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#C9A050" strokeWidth={18} strokeLinecap="round" />
        <circle cx={540} cy={y} r={22} fill="#E0BC6A" />
        {[[lx, ly], [rx, ry]].map(([px, py], i) => (
          <g key={i}><line x1={px} y1={py} x2={px - 110} y2={py + 230} stroke="#B89650" strokeWidth={5} /><line x1={px} y1={py} x2={px + 110} y2={py + 230} stroke="#B89650" strokeWidth={5} /><ellipse cx={px} cy={py + 236} rx={130} ry={26} fill="#C9A050" /></g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: lx - 130, top: ly + 30, width: 260, height: 210, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{left}</div>
      <div style={{ position: "absolute", left: rx - 130, top: ry + 30, width: 260, height: 210, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{right}</div>
    </>
  );
};
const Pile: React.FC<{ n: number; r?: number }> = ({ n, r = 26 }) => (
  <div style={{ position: "relative", width: 240, height: 200 }}>{Array.from({ length: n }, (_, i) => <Coin key={i} x={60 + (i % 5) * 30} y={180 - Math.floor(i / 5) * 18 - (i % 2) * 6} r={r} />)}</div>
);
const CrossG: React.FC<{ h: number }> = ({ h }) => (
  <div style={{ position: "relative", width: h * 0.6, height: h, filter: "drop-shadow(0 0 30px rgba(255,236,180,0.9))" }}>
    <div style={{ position: "absolute", left: h * 0.25, top: 0, width: h * 0.1, height: h, background: "linear-gradient(90deg,#8A5A2A,#C08A50,#7A4A20)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 0, top: h * 0.22, width: h * 0.6, height: h * 0.1, background: "linear-gradient(#C08A50,#7A4A20)", borderRadius: 4 }} />
  </div>
);

// ---------- báscula digital ----------
const ScaleD: React.FC<{ grams: number; y?: number; children?: React.ReactNode }> = ({ grams, y = 1250, children }) => (
  <>
    <div style={{ position: "absolute", left: 240, top: y, width: 600, height: 200, borderRadius: 40, background: "linear-gradient(#F4F6F9,#C9CFD8)", boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 170, top: 92, width: 260, height: 84, borderRadius: 14, background: "#0E1A12", color: "#5CFF8A", fontFamily: "monospace", fontWeight: 700, fontSize: 64, textAlign: "center", lineHeight: "84px", textShadow: "0 0 14px #5CFF8A" }}>{Math.round(grams)} g</div>
    </div>
    <div style={{ position: "absolute", left: 200, top: y - 30, width: 680, height: 40, borderRadius: 20, background: "#E4E8EE" }} />
    {children}
  </>
);

// ---------- escenas ----------
type Sc = { t0: number; C: React.FC<{ t0: number }> };

// 1 · ¿Por cuánto vendió Judas a Jesús? Por 30 monedas de plata — las monedas caen en su mano y se cuentan
const S1: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const n = Math.min(30, Math.max(0, Math.floor(d(2.4) / 1.1)));
  return (
    <AbsoluteFill>
      <Sky top="#2B4C8C" bot="#122452" f={f} />
      <JudasChar x={540} y={1650} s={2.1} f={f} pose={{ armR: -70, mood: n > 10 ? "greedy" : "neutral" }} />
      {/* mano que paga, desde la derecha */}
      <div style={{ position: "absolute", left: ip(d(1.0), [0, 12], [1200, 760]), top: 700, width: 300, height: 120, borderRadius: 60, background: "linear-gradient(90deg,#C98C63,#E8B48C)" }} />
      {Array.from({ length: n }, (_, i) => { const tt = d(2.4) - i * 1.1; return <Coin key={i} x={830 - Math.min(1, tt / 8) * 60 + (i % 4) * 8} y={ip(tt, [0, 8], [760, 1040 - i * 4])} r={34} spin={tt / 3} />; })}
      <Tag d={d(2.45)} txt={`${n} MONEDAS`} ax={850} ay={1000} tx={760} ty={560} />
    </AbsoluteFill>
  );
};
// 2 · No era una fortuna — su bolsita frente a un tesoro: la balanza cae del lado del tesoro
const S2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const tilt = ip(d(4.6), [0, 16], [0, -16]);
  return (
    <AbsoluteFill>
      <Sky top="#E0A43C" bot="#8A4A12" f={f} glow="rgba(255,245,200,0.5)" />
      <Balance tilt={tilt} y={820} left={<div style={{ width: 230, height: 190, borderRadius: "50% 50% 20px 20px", background: "radial-gradient(circle at 50% 70%,#FFF1B0,#F2B83A 60%,#B07010)", boxShadow: "0 0 60px rgba(255,210,90,0.8)" }} />} right={<Pile n={5} />} />
      <Tag d={d(4.7)} txt="TESOROS" ax={210} ay={990} tx={230} ty={640} color="#B07010" />
      <Tag d={d(5.0)} txt="30 MONEDAS" ax={870} ay={1180} tx={850} ty={1420} />
    </AbsoluteFill>
  );
};
// 3 · Siclo de Tiro, 14 gramos — la moneda 3D cae a la báscula
const S3: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const drop = eo(ip(d(7.6), [0, 10], [0, 1]));
  return (
    <AbsoluteFill>
      <Sky top="#1F6F78" bot="#0D3A40" f={f} glow="rgba(200,255,250,0.35)" />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drop * 380}px) scale(${1 - drop * 0.45})`, transformOrigin: "540px 1000px" }}>
        <Coin3D size={900} top={480} spin={f / 14 + drop * 3} tilt={0.2 + drop * 0.7} />
      </div>
      <ScaleD grams={ip(d(7.9), [0, 10], [0, 14])} y={1380} />
      <Tag d={d(6.5)} txt="SICLO DE TIRO" ax={720} ay={760} tx={760} ty={480} />
    </AbsoluteFill>
  );
};
// 4 · 30 monedas, 420 gramos — las monedas caen una a una y la báscula sube
const S4: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const n = Math.min(30, Math.max(0, Math.floor(d(9.9) / 1.2)));
  return (
    <AbsoluteFill>
      <Sky top="#1F6F78" bot="#0D3A40" f={f} glow="rgba(200,255,250,0.35)" />
      <ScaleD grams={ip(d(11.2), [0, 12], [n * 14, 420]) > n * 14 ? ip(d(11.2), [0, 12], [n * 14, 420]) : n * 14} y={1380}>
        {Array.from({ length: n }, (_, i) => { const tt = d(9.9) - i * 1.2; return <Coin key={i} x={330 + (i % 8) * 60} y={ip(tt, [0, 7], [500, 1320 - Math.floor(i / 8) * 34])} r={38} spin={tt / 2} />; })}
      </ScaleD>
      <Num d={d(11.3)} txt="420 g" y={600} size={210} />
    </AbsoluteFill>
  );
};
// 5 · Lo que cabe en un puño — la mano de Judas se cierra sobre las monedas
const S5: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const c = eo(ip(d(13.6), [0, 10], [0, 1]));
  return (
    <AbsoluteFill>
      <Sky top="#3A5A9C" bot="#1A2A5A" f={f} />
      {Array.from({ length: 12 }, (_, i) => <Coin key={i} x={420 + (i % 4) * 80} y={1060 + Math.floor(i / 4) * 46} r={44} dull={0} />)}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="hand" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F2C29C" /><stop offset="1" stopColor="#C98C63" /></linearGradient></defs>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={400 + i * 80} y={ip(c, [0, 1], [760, 1000])} width={74} height={ip(c, [0, 1], [320, 150])} rx={37} fill="url(#hand)" stroke="#8A5A3A" strokeWidth={4} />)}
        <path d={`M380 ${ip(c, [0, 1], [1260, 1140])} Q540 ${ip(c, [0, 1], [1380, 1260])} 720 ${ip(c, [0, 1], [1260, 1140])} L720 1500 L380 1500 Z`} fill="url(#hand)" stroke="#8A5A3A" strokeWidth={4} />
        <rect x={330} y={ip(c, [0, 1], [1000, 1040])} width={86} height={200} rx={43} fill="url(#hand)" stroke="#8A5A3A" strokeWidth={4} transform={`rotate(${ip(c, [0, 1], [-30, 30])} 373 1100)`} />
      </svg>
      <Tag d={d(13.9)} txt="UN PUÑO" ax={560} ay={1180} tx={540} ty={600} />
    </AbsoluteFill>
  );
};
// 6 · Un jornalero ganaba un denario por día — siega, y cada día aparece una moneda
const S6: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const swing = Math.sin(f / 5) * 40;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#7EC8F0,#BDE6FA 50%,#E8C45A 52%,#B8902A)" }} />
      <div style={{ position: "absolute", left: 760, top: 220, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#FFFBE0,#FFE27A 60%,rgba(255,226,122,0))" }} />
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 27) % 1080, top: 1010 + (i % 5) * 30, width: 8, height: 140, background: "#C9A23A", transform: `rotate(${Math.sin(f / 12 + i) * 6}deg)`, transformOrigin: "50% 100%" }} />)}
      <JudasChar x={540} y={1560} s={1.7} f={f} pose={{ armR: -40 + swing, armL: 20 }} />
      {d(16.8) >= 0 ? <div style={{ transform: `translateY(${ip(d(16.8), [0, 10], [60, 0])}px)` }}><Coin x={760} y={720} r={70} spin={f / 8} /></div> : null}
      <Tag d={d(16.8)} txt="1 DENARIO = 1 DÍA" ax={740} ay={780} tx={540} ty={1720} color="#B07010" />
    </AbsoluteFill>
  );
};
// 7 · Cada siclo valía 4 denarios — el siclo se parte en cuatro
const S7: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const sp = eo(ip(d(19.6), [0, 12], [0, 1]));
  return (
    <AbsoluteFill>
      <Sky top="#5B3E9C" bot="#2A1A5A" f={f} glow="rgba(230,210,255,0.35)" />
      {sp < 0.05 ? <Coin x={540} y={960} r={200} spin={f / 18} /> : [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <Coin key={i} x={540 + sx * 220 * sp} y={960 + sy * 220 * sp} r={200 - 110 * sp} />)}
      <Tag d={d(18.4)} txt="1 SICLO" ax={540} ay={760} tx={540} ty={560} />
      <Num d={d(20.0)} txt="= 4 DENARIOS" y={1400} size={110} />
    </AbsoluteFill>
  );
};
// 8 · Unos 4 meses de trabajo — el calendario se arranca hoja a hoja
const S8: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const day = Math.round(ip(d(21.2), [0, 26], [1, 120]));
  return (
    <AbsoluteFill>
      <Sky top="#E0603C" bot="#8A2A1A" f={f} glow="rgba(255,230,210,0.4)" />
      {Array.from({ length: 6 }, (_, i) => { const tt = (f + i * 4) % 24; return d(21.2) >= 0 && day < 120 ? <div key={i} style={{ position: "absolute", left: 300 + tt * 12, top: 700 - tt * 28 + tt * tt, width: 480, height: 300, background: "#F4F1EA", borderRadius: 16, transform: `rotate(${tt * 9}deg)`, opacity: 1 - tt / 24 }} /> : null; })}
      <div style={{ position: "absolute", left: 270, top: 640, width: 540, height: 600, borderRadius: 30, background: "#F8F6F0", boxShadow: "0 30px 70px rgba(0,0,0,0.35)", overflow: "hidden" }}>
        <div style={{ height: 140, background: "#C9302C", color: "#fff", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 70, textAlign: "center", lineHeight: "140px" }}>DÍA</div>
        <div style={{ textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 280, color: "#1A1A1A", lineHeight: "440px" }}>{day}</div>
      </div>
      <Num d={d(22.0)} txt="4 MESES" y={1330} size={170} />
    </AbsoluteFill>
  );
};
// 9–10 · La ley de Moisés, Éxodo 21:32 — el rollo se despliega y se ilumina la frase
const S9: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const u = eo(ip(d(23.9), [0, 16], [0, 1]));
  const hl = ip(d(26.4), [0, 14], [0, 1]);
  return (
    <AbsoluteFill>
      <Sky top="#C9A060" bot="#6A4A20" f={f} glow="rgba(255,245,210,0.5)" />
      <div style={{ position: "absolute", left: 120, right: 120, top: 980 - 420 * u, height: 840 * u, background: "linear-gradient(90deg,#E2CB98,#F3E4BE,#E2CB98)", boxShadow: "0 30px 70px rgba(0,0,0,0.35)", overflow: "hidden" }}>
        <div style={{ marginTop: 70, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 84, color: "#3A2614" }}>{d(25.4) >= 0 ? "ÉXODO 21:32" : "LEY DE MOISÉS"}</div>
        {["Si el buey acorneare", "a un siervo o a una sierva,", "pagará su dueño"].map((l, i) => <div key={i} style={{ marginTop: 18, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 50, color: "#5A4028", opacity: ip(d(25.8) - i * 4, [0, 6], [0, 1]) }}>{l}</div>)}
        <div style={{ margin: "18px auto 0", width: "fit-content", padding: "4px 14px", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 58, color: "#3A2614", background: `linear-gradient(90deg, rgba(255,214,90,0.9) ${hl * 100}%, rgba(255,214,90,0) ${hl * 100}%)` }}>treinta siclos de plata</div>
      </div>
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 90, right: 90, top: s < 0 ? 960 - 420 * u : 960 + 420 * u, height: 44, borderRadius: 22, background: "linear-gradient(#9A7040,#5A3A18)" }} />)}
    </AbsoluteFill>
  );
};
// 11 · Si un buey mataba a un esclavo… 30 siclos — el buey entra caminando, cae la etiqueta de precio
const S11: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const walk = ip(d(28.0), [0, 30], [-700, 0]);
  const leg = Math.sin(f / 3) * 14 * (walk < -5 ? 1 : 0);
  const tagY = eo(ip(d(30.8), [0, 10], [-300, 0]));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#E8B45A,#F2D08A 55%,#A8782A 56%,#7A541A)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${540 + walk} 1250)`}>
          {[-180, -90, 90, 180].map((x, i) => <rect key={i} x={x - 24} y={70} width={48} height={190} rx={14} fill="#5A3A22" transform={`rotate(${i % 2 ? leg : -leg} ${x} 70)`} />)}
          <ellipse cx={0} cy={0} rx={280} ry={150} fill="#7A4E2E" />
          <ellipse cx={-40} cy={-30} rx={200} ry={90} fill="#8E5E38" />
          <path d="M240 -70 Q340 -110 400 -40 Q420 50 340 80 Q280 70 240 30 Z" fill="#6A4026" />
          <path d="M340 -90 Q380 -170 440 -160 M300 -95 Q270 -175 220 -168" stroke="#EDE2C8" strokeWidth={16} fill="none" strokeLinecap="round" />
          <circle cx={370} cy={-20} r={10} fill="#1A1A1A" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 340, top: 520 + tagY, width: 400, textAlign: "center" }}>
        <div style={{ margin: "0 auto", width: 6, height: 120, background: "#5A3A18" }} />
        <div style={{ padding: "28px 0", background: "#F3E4BE", border: "6px solid #8A6A3A", borderRadius: "60px 20px 20px 60px", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 84, color: "#3A2614", transform: `rotate(${Math.sin(f / 8) * 6}deg)` }}>30 SICLOS</div>
      </div>
      <Tag d={d(29.1)} txt="ESCLAVO" ax={700} ay={1100} tx={860} ty={980} color="#C9302C" />
    </AbsoluteFill>
  );
};
// 12 · Ese era el precio de un esclavo — el sello cae y deja la tinta
const S12: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const hit = d(33.3);
  return (
    <AbsoluteFill>
      <Sky top="#E8D8B8" bot="#B89A6A" f={f} glow="rgba(255,255,255,0.5)" />
      <div style={{ position: "absolute", left: 190, top: 640, width: 700, height: 460, background: "#F3E4BE", border: "8px solid #8A6A3A", borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 120, color: "#3A2614", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>30 SICLOS</div>
      {/* sello que baja */}
      {hit < 4 ? <div style={{ position: "absolute", left: 380, top: ip(hit, [-14, 0], [-500, 760]), width: 320, height: 260 }}><div style={{ width: 120, height: 160, margin: "0 auto", background: "#5A3A22", borderRadius: 20 }} /><div style={{ height: 100, background: "#8A1A1A", borderRadius: 18 }} /></div> : null}
      {hit >= 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", transform: `rotate(-6deg) scale(${ip(hit, [0, 3], [1.3, 1])})` }}><span style={{ display: "inline-block", padding: "14px 34px", border: "10px solid #C41E1E", color: "#C41E1E", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 74, whiteSpace: "nowrap", opacity: 0.92 }}>PRECIO DE UN ESCLAVO</span></div> : null}
    </AbsoluteFill>
  );
};
// 13 · Vendió al Hijo de Dios por el precio de un esclavo — Judas pone las monedas en la balanza
const S13: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const tilt = ip(d(36.0), [0, 18], [0, 12]);
  return (
    <AbsoluteFill>
      <Sky top="#2B4C8C" bot="#122452" f={f} />
      <Balance tilt={tilt} y={760} left={<CrossG h={200} />} right={<Pile n={10} />} />
      <JudasChar x={880} y={1760} s={1.3} f={f} pose={{ armL: ip(d(35.0), [0, 12], [0, -60]), mood: "greedy" }} flip />
      <Tag d={d(35.2)} txt="HIJO DE DIOS" ax={210} ay={940} tx={240} ty={560} color="#B07010" />
    </AbsoluteFill>
  );
};
// 14 · Y ni siquiera lo disfrutó — Judas sentado, las monedas se apagan
const S14: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const g = ip(d(38.0), [0, 14], [0, 1]);
  return (
    <AbsoluteFill>
      <Sky top="#4A5A7A" bot="#222A3A" f={f} glow="rgba(200,210,240,0.25)" />
      <JudasChar x={540} y={1620} s={2.0} f={f} pose={{ armR: -20, armL: 20, head: 12, mood: "sad", eyes: 0.6 }} />
      {Array.from({ length: 6 }, (_, i) => <Coin key={i} x={400 + i * 56} y={1340} r={34} dull={g} />)}
    </AbsoluteFill>
  );
};
// 15 · Tiró las monedas en el templo — lanza y rebotan en el suelo de piedra
const S15: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const th = d(39.9);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#E9CE98,#D2AE70 58%,#B88E52 59%,#8A6A3A)" }} />
      {[110, 300, 780, 970].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 60, top: 240, width: 120, height: 900, background: "linear-gradient(90deg,#C9A870,#F0DCAE,#B8945A)", borderRadius: 8 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, height: 60, background: "#B8945A" }} />
      <JudasChar x={300} y={1520} s={1.4} f={f} pose={{ armR: ip(th, [-6, 0, 8], [40, -120, -40]), mood: "sad" }} />
      {Array.from({ length: 24 }, (_, i) => {
        const tt = th - random(`t${i}`) * 4;
        if (tt < 0) return null;
        const vx = 10 + random(`tx${i}`) * 22, vy = -26 - random(`ty${i}`) * 14;
        let x = 420 + vx * tt, y = 1020 + vy * tt + 1.2 * tt * tt;
        if (y > 1300) { const over = y - 1300; y = 1300 - Math.abs(Math.sin(over / 60)) * 80 * Math.exp(-tt / 25); x = Math.min(x, 1000); }
        return <Coin key={i} x={x} y={y} r={30} spin={tt / 2 + i} />;
      })}
      <Tag d={d(41.1)} txt="TEMPLO" ax={540} ay={250} tx={540} ty={420} />
    </AbsoluteFill>
  );
};
// 16–17 · Compraron un campo para extranjeros: el campo de sangre — se clavan las tumbas, el cielo enrojece
const S16: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const red = ip(d(45.9), [0, 16], [0, 1]);
  const c = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * red)).join(",")})`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${c([126, 190, 230], [200, 40, 40])}, ${c([220, 236, 245], [240, 120, 80])} 52%, ${c([120, 160, 70], [120, 60, 40])} 53%, ${c([80, 110, 40], [70, 30, 20])})` }} />
      {Array.from({ length: 9 }, (_, i) => { const tt = d(43.0) - i * 3; return tt < 0 ? null : <div key={i} style={{ position: "absolute", left: 110 + (i % 5) * 190 + (i > 4 ? 90 : 0), top: (i > 4 ? 1280 : 1140) + ip(tt, [0, 6], [-200, 0]), width: 90, height: 120, borderRadius: "45px 45px 8px 8px", background: "linear-gradient(#B8B0A8,#7A726A)" }} />; })}
      {d(45.5) >= 0 ? <div style={{ position: "absolute", left: 300, top: 640 + ip(d(45.5), [0, 8], [-400, 0]), width: 480, textAlign: "center" }}>
        <div style={{ padding: "22px 0", background: "#7A4A2A", border: "6px solid #3A2010", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#F6E2C0" }}>CAMPO DE SANGRE</div>
        <div style={{ margin: "0 auto", width: 26, height: 300, background: "#4A2A14" }} />
      </div> : null}
      <Tag d={d(43.9)} txt="EXTRANJEROS" ax={560} ay={1250} tx={540} ty={1560} />
    </AbsoluteFill>
  );
};
// 18–19 · No lo vendió por mucho, lo vendió por muy poco — la cruz enorme, una moneda diminuta que rueda y cae
const S18: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const roll = ip(d(49.4), [0, 20], [0, 1]);
  return (
    <AbsoluteFill>
      <Sky top="#F2D9A0" bot="#C9944A" f={f} glow="rgba(255,255,240,0.6)" />
      <div style={{ position: "absolute", left: 540 - 330, top: 340 }}><CrossG h={1100} /></div>
      <div style={{ transform: `translate(${roll * 260}px, ${roll > 0.7 ? (roll - 0.7) * 900 : 0}px)` }}><Coin x={430} y={1420} r={26} spin={roll * 20} /></div>
      <Tag d={d(48.4)} txt="MUCHO" ax={540} ay={820} tx={860} ty={700} color="#B07010" />
      <Tag d={d(50.0)} txt="MUY POCO" ax={450} ay={1420} tx={300} ty={1600} color="#C9302C" />
    </AbsoluteFill>
  );
};
// 20 · Y eso es lo que más asusta — primer plano de Judas, cierra los ojos
const S20: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  return (
    <AbsoluteFill>
      <Sky top="#3A3A5A" bot="#14142A" f={f} glow="rgba(220,200,255,0.25)" />
      <JudasChar x={540} y={2500} s={4.4} f={f} pose={{ mood: "sad", head: -4, eyes: ip(d(51.2), [0, 10], [1, 0.15]) }} />
    </AbsoluteFill>
  );
};
// 21 · Mándaselo a ese amigo — el mensaje se envía
const S21: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, d } = useD(t0);
  const sent = d(53.6) >= 0;
  return (
    <AbsoluteFill>
      <Sky top="#2B6CE0" bot="#123A8A" f={f} />
      <div style={{ position: "absolute", left: 270, top: 520, width: 540, height: 1060, borderRadius: 64, background: "#F5F7FA", border: "12px solid #1A1F2A", boxShadow: "0 40px 90px rgba(0,0,0,0.4)", overflow: "hidden" }}>
        <div style={{ height: 120, background: "#E9EDF2", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 40, lineHeight: "120px", paddingLeft: 40, color: "#1A1F2A" }}>Ese amigo 👤</div>
        <div style={{ margin: "60px 30px 0 auto", width: 400, padding: "26px 30px", borderRadius: 30, background: "#25D366", color: "#fff", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 40, transform: `translateY(${sent ? 0 : 500}px) scale(${sent ? pop(d(53.6)) : 1})` }}>¿Sabías por cuánto vendió Judas a Jesús? 🪙</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 100, borderRadius: 50, background: "#E9EDF2", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 14 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#25D366", transform: `scale(${sent ? ip(d(53.6), [0, 4, 8], [1, 0.8, 1]) : 1 + 0.06 * Math.sin(f / 4)})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Sc[] = [
  { t0: 0, C: S1 }, { t0: 3.9, C: S2 }, { t0: 5.7, C: S3 }, { t0: 9.9, C: S4 }, { t0: 13.1, C: S5 }, { t0: 14.5, C: S6 }, { t0: 17.9, C: S7 }, { t0: 20.7, C: S8 },
  { t0: 23.1, C: S9 }, { t0: 27.9, C: S11 }, { t0: 32.4, C: S12 }, { t0: 34.5, C: S13 }, { t0: 37.5, C: S14 }, { t0: 39.1, C: S15 }, { t0: 41.6, C: S16 },
  { t0: 47.1, C: S18 }, { t0: 50.7, C: S20 }, { t0: 52.3, C: S21 },
];
// solo tres transiciones con zoom (entrar en la moneda, en el rollo y en la cruz); el resto, cortes limpios
const ZOOM_AT = new Set([2, 8, 15]);
const TR = 10;
const STARTS = SCENES.map((sc, i) => (i === 0 ? 0 : S(sc.t0) - (ZOOM_AT.has(i) ? TR / 2 : 0)));
const DURS = SCENES.map((_, i) => (i + 1 < SCENES.length ? STARTS[i + 1] + (ZOOM_AT.has(i + 1) ? TR : 0) - STARTS[i] : S(END) - STARTS[i]));
const IMPACTS = [2.45, 33.3, 50.1];
const SFX: [number, string, number][] = [
  [2.4, "judas/monedas.wav", 0.45], [7.9, "judas/moneda.wav", 0.45], [10.0, "judas/monedas.wav", 0.35], [19.6, "judas/moneda.wav", 0.35], [30.8, "judas/moneda.wav", 0.4],
  [33.25, "sfx/lib/cinematic-drop.mp3", 0.45], [39.9, "judas/monedas.wav", 0.5], [50.0, "sfx/impact.wav", 0.35],
  [5.55, "sfx/whoosh.wav", 0.2], [22.9, "sfx/whoosh.wav", 0.2], [46.95, "sfx/whoosh.wav", 0.2],
];

const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${ip(f, [0, dur], [1.0, 1.05])})` }}>{children}</AbsoluteFill>;
};

export const Judas3: React.FC = () => {
  const f = useCurrentFrame();
  const imp = IMPACTS.reduce((o, t) => { const dd = f - S(t); return dd >= 0 && dd < 8 ? Math.max(o, 1 - dd / 8) : o; }, 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${(random(`ix${f}`) - 0.5) * 16 * imp}px, ${(random(`iy${f}`) - 0.5) * 16 * imp}px)` }}>
        <TransitionSeries>
          {SCENES.flatMap((sc, i) => {
            const el = (
              <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DURS[i]}>
                <Push dur={DURS[i]}><sc.C t0={STARTS[i] / FPS} /></Push>
              </TransitionSeries.Sequence>
            );
            return i + 1 < SCENES.length && ZOOM_AT.has(i + 1)
              ? [el, <TransitionSeries.Transition key={`t${i}`} presentation={T.zoom} timing={linearTiming({ durationInFrames: TR, easing: Easing.inOut(Easing.cubic) })} />]
              : [el];
          })}
        </TransitionSeries>
        {IMPACTS.map((t, i) => <Burst key={i} d={f - S(t)} y={i === 1 ? 1200 : i === 2 ? 1420 : 1000} color={i ? "255,90,80" : "255,225,150"} />)}
      </AbsoluteFill>
      <Grain f={f} />
      <Vignette s={0.35} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("judas/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={S(t)} durationInFrames={60}><Audio src={staticFile(n)} volume={v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
