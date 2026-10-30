import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import data from "../../public/vesna/words.json";

// "Cayó de 10.000 metros sin paracaídas": todo dibujado con código (SVG + CSS), sincronizado con la voz
const FPS = 30;
export const VESNA_TOTAL = 810;
const FONT = "Vesna Poppins";
loadFont({ family: FONT, url: staticFile("fonts/poppins-latin-600-normal.woff2"), weight: "600" });
const FONTB = "Vesna Poppins Black";
loadFont({ family: FONTB, url: staticFile("fonts/poppins-latin-900-italic.woff2"), weight: "900", style: "italic" });
const RED = "#FF3B3B";
const AMBER = "#FFB54A";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ip = (f: number, i: number[], o: number[]) => interpolate(f, i, o, cl);
const ease = (t: number) => t * t * (3 - 2 * t);

// ---------- palabras de la voz (con las correcciones de reconocimiento) ----------
type Wd = { w: string; s: number; e: number };
const FIX: Record<string, string> = { Besna: "Vesna", Zafata: "azafata." };
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Wd[] = [];
for (let i = 0; i < RAW.length; i++) {
  let w = RAW[i].text.trim();
  const s = RAW[i].timestamp[0];
  const e = RAW[i].timestamp[1] ?? s + 0.3;
  if (w === "10" && RAW[i + 1]?.text.trim().startsWith(".000")) {
    WORDS.push({ w: "10.000", s, e: RAW[i + 1].timestamp[1] });
    i++;
    continue;
  }
  if (w === "a" && RAW[i + 1]?.text.trim() === "Zafata.") {
    WORDS.push({ w: "azafata.", s, e: RAW[i + 1].timestamp[1] });
    i++;
    continue;
  }
  w = FIX[w.replace(/[.,]/g, "")] ?? w;
  WORDS.push({ w, s, e });
}
const KEY = new Set(["10.000", "paracaídas.", "1972.", "Vesna", "bomba", "tres.", "murieron.", "trineo.", "27", "caminar.", "Caminó", "volar.", "excusa"]);
// grupos de 1 a 3 palabras, cortados en la puntuación
const GROUPS: Wd[][] = [];
{
  let g: Wd[] = [];
  WORDS.forEach((w, i) => {
    g.push(w);
    const next = WORDS[i + 1];
    if (/[.,?]$/.test(w.w) || g.length === 3 || !next || next.s - w.e > 0.35) {
      GROUPS.push(g);
      g = [];
    }
  });
}

const Captions: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const gi = GROUPS.findIndex((g, i) => t >= g[0].s - 0.05 && t < (GROUPS[i + 1]?.[0].s ?? 99) - 0.05);
  if (gi < 0) return null;
  const g = GROUPS[gi];
  const gt = f - Math.round((g[0].s - 0.05) * FPS);
  return (
    <div style={{ position: "absolute", top: 300, left: 60, right: 60, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 70, lineHeight: 1.15, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.75)", scale: ip(gt, [0, 4], [0.92, 1]), opacity: ip(gt, [0, 3], [0, 1]) }}>
      {g.map((w, i) => {
        const on = t >= w.s - 0.05;
        const k = KEY.has(w.w);
        return (
          <span key={i} style={{ color: k ? RED : "#fff", opacity: on ? 1 : 0.35 }}>
            {i ? " " : ""}
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- piezas de dibujo ----------
const Stars: React.FC<{ f: number; n?: number; seed?: string }> = ({ f, n = 90, seed = "s" }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const x = random(`${seed}x${i}`) * 1080;
      const y = random(`${seed}y${i}`) * 1300;
      const r = 0.8 + random(`${seed}r${i}`) * 2;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 18 + i));
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={tw * 0.8} />;
    })}
  </svg>
);
const Moon: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <>
    <div style={{ position: "absolute", left: x - r * 4, top: y - r * 4, width: r * 8, height: r * 8, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,210,0.35), rgba(255,240,210,0) 60%)" }} />
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #FFF8E6, #E9DDC0 70%)", boxShadow: "0 0 60px rgba(255,240,200,0.6)" }} />
  </>
);
const Cloud: React.FC<{ x: number; y: number; w: number; o: number; c?: string }> = ({ x, y, w, o, c = "#9BA7C4" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.32, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 60%, ${c}, rgba(0,0,0,0) 70%)`, opacity: o, filter: "blur(8px)" }} />
);
const Clouds: React.FC<{ f: number; speed: number; y0?: number; seed?: string; c?: string }> = ({ f, speed, y0 = 0, seed = "c", c }) => (
  <>
    {Array.from({ length: 14 }, (_, i) => {
      const w = 500 + random(`${seed}w${i}`) * 700;
      const x = ((random(`${seed}x${i}`) * 1900 - f * speed * (0.5 + random(`${seed}v${i}`))) % 1900) - 400;
      const y = y0 + random(`${seed}y${i}`) * 1900;
      return <Cloud key={i} x={x < -900 ? x + 1900 : x} y={y} w={w} o={0.25 + random(`${seed}o${i}`) * 0.35} c={c} />;
    })}
  </>
);
// avión de pasajeros en vista lateral; split separa las tres piezas
const Plane: React.FC<{ split?: number; lit?: number }> = ({ split = 0, lit = 1 }) => {
  const win = Array.from({ length: 16 }, (_, i) => 150 + i * 34);
  const piece = (k: number, children: React.ReactNode) => {
    const dx = (k - 1) * 120 * split;
    const dy = (k === 1 ? 40 : k === 0 ? -20 : 70) * split;
    const rot = (k - 1) * 26 * split;
    return (
      <g transform={`translate(${dx} ${dy}) rotate(${rot} ${200 + k * 220} 90)`}>{children}</g>
    );
  };
  return (
    <svg width={760} height={240} viewBox="0 0 760 240" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="fus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7ECF5" />
          <stop offset="1" stopColor="#8D97AD" />
        </linearGradient>
      </defs>
      {piece(0, <>
        <path d="M60 70 Q20 90 60 112 L250 112 L250 70 Z" fill="url(#fus)" />
        <path d="M70 76 Q48 86 64 92 L96 92 L96 76 Z" fill="#2B3550" />
      </>)}
      {piece(1, <>
        <rect x={250} y={70} width={230} height={42} fill="url(#fus)" />
        <path d="M300 104 L420 104 L520 178 L470 178 Z" fill="#B7C0D3" />
      </>)}
      {piece(2, <>
        <path d="M480 70 L640 76 L720 20 L752 20 L720 96 L640 112 L480 112 Z" fill="url(#fus)" />
        <path d="M640 92 L700 92 L730 120 L700 120 Z" fill="#B7C0D3" />
      </>)}
      {win.map((x, i) => {
        const k = x < 250 ? 0 : x < 480 ? 1 : 2;
        const dx = (k - 1) * 120 * split;
        const dy = (k === 1 ? 40 : k === 0 ? -20 : 70) * split;
        return <rect key={i} x={x + dx} y={82 + dy} width={14} height={10} rx={3} fill={AMBER} opacity={lit * (0.75 + 0.25 * Math.sin(i))} style={{ filter: "drop-shadow(0 0 6px #FFB54A)" }} />;
      })}
    </svg>
  );
};
// silueta humana sencilla (cuerpo, brazos y piernas como trazos redondeados)
const Person: React.FC<{ pose: "fall" | "stand" | "lie"; color?: string; scale?: number }> = ({ pose, color = "#0B0F1A", scale = 1 }) => {
  const P = {
    fall: { a1: "M50 50 L10 20", a2: "M50 50 L90 25", l1: "M50 95 L25 140", l2: "M50 95 L80 135" },
    stand: { a1: "M50 50 L32 92", a2: "M50 50 L68 92", l1: "M50 95 L40 150", l2: "M50 95 L60 150" },
    lie: { a1: "M50 50 L32 92", a2: "M50 50 L68 92", l1: "M50 95 L44 150", l2: "M50 95 L56 150" },
  }[pose];
  return (
    <svg width={100 * scale} height={160 * scale} viewBox="0 0 100 160" style={{ overflow: "visible" }}>
      <g stroke={color} strokeWidth={14} strokeLinecap="round" fill="none">
        <path d="M50 42 L50 95" strokeWidth={22} />
        <path d={P.a1} />
        <path d={P.a2} />
        <path d={P.l1} />
        <path d={P.l2} />
      </g>
      <circle cx={50} cy={22} r={15} fill={color} />
    </svg>
  );
};
// etiqueta de dato al estilo de las referencias
const Chip: React.FC<{ text: string; x: number; y: number; f: number; at: number; accent?: string }> = ({ text, x, y, f, at, accent = "#fff" }) => {
  if (f < at) return null;
  const t = f - at;
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "12px 24px", borderRadius: 14, background: "rgba(10,14,24,0.82)", border: "2px solid rgba(255,255,255,0.18)", fontFamily: FONT, fontWeight: 600, fontSize: 44, color: accent, whiteSpace: "nowrap", translate: `-50% ${ip(t, [0, 8], [20, 0])}px`, opacity: ip(t, [0, 6], [0, 1]), boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      {text}
    </div>
  );
};
const BigNum: React.FC<{ value: string; x: number; y: number; size: number; color?: string; f: number; at: number }> = ({ value, x, y, size, color = "#fff", f, at }) => {
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% 0", fontFamily: FONTB, fontStyle: "italic", fontWeight: 900, fontSize: size, color, letterSpacing: -3, whiteSpace: "nowrap", textShadow: `0 0 40px ${color === "#fff" ? "rgba(255,255,255,0.35)" : color}`, scale: ip(f - at, [0, 6], [1.3, 1]) }}>
      {value}
    </div>
  );
};
const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />;
// la cámara se mueve siempre: zoom y deriva lenta
const Cam: React.FC<{ f: number; dur: number; z0?: number; z1?: number; x?: number; y?: number; children: React.ReactNode }> = ({ f, dur, z0 = 1, z1 = 1.12, x = 0, y = 0, children }) => {
  const u = ease(Math.min(1, f / dur));
  return <AbsoluteFill style={{ transform: `translate(${x * u}px, ${y * u}px) scale(${z0 + (z1 - z0) * u})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>;
};

// ---------- escenas ----------
const S = (t: number) => Math.round(t * FPS);
// 1 · 0–3,2 s: cae entre nubes, el altímetro baja
const Caida: React.FC = () => {
  const f = useCurrentFrame();
  const dur = S(3.2);
  const alt = Math.round(ip(f, [0, dur], [10000, 7400]) / 10) * 10;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#060B1C, #10203F 60%, #1C2F55)" }}>
      <Stars f={f} />
      <Cam f={f} dur={dur} z0={1.25} z1={1.0}>
        <Clouds f={f * 6} speed={-3} seed="a" />
        <div style={{ position: "absolute", left: 540, top: 820, translate: "-50% -50%", rotate: `${Math.sin(f / 9) * 18}deg` }}>
          <Person pose="fall" color="#05070D" scale={2.6} />
        </div>
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`w${i}`) * 1080, top: ((random(`h${i}`) * 1920 - f * 60) % 1920 + 1920) % 1920, width: 3, height: 120, background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.35))" }} />
        ))}
      </Cam>
      <BigNum value={`${String(alt).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} m`} x={540} y={1380} size={150} f={f} at={0} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 2 · 3,2–7,5 s: el avión cruza la luna, 1972
const Vuelo: React.FC = () => {
  const f = useCurrentFrame();
  const dur = S(4.3);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#050914, #0E1B38 55%, #1D2C52)" }}>
      <Stars f={f} seed="v" />
      <Cam f={f} dur={dur} z0={1.0} z1={1.15} y={-40}>
        <Moon x={720} y={700} r={120} />
        <Clouds f={f} speed={1.5} y0={500} seed="b" c="#6E7BA0" />
        <div style={{ position: "absolute", left: ip(f, [0, dur], [-700, 420]), top: 760, scale: 1.1 }}>
          <Plane />
        </div>
      </Cam>
      <Chip text="1972" x={540} y={1250} f={f} at={S(0.6)} />
      <Chip text="Vesna · 22 años" x={540} y={1350} f={f} at={S(2.2)} accent={AMBER} />
      <Chip text="azafata" x={540} y={1450} f={f} at={S(3.3)} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 3 · 7,5–10,5 s: la bomba parte el avión en tres
const Bomba: React.FC = () => {
  const f = useCurrentFrame();
  const boom = S(1.6);
  const split = ease(ip(f, [boom, boom + 30], [0, 1]));
  const fl = f >= boom ? ip(f - boom, [0, 10], [1, 0]) : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#060914, #160F1E 60%, #2A1418)" }}>
      <Stars f={f} seed="x" n={50} />
      <Cam f={f} dur={S(3)} z0={1.2} z1={1.35} x={f > boom ? Math.sin(f) * 8 : 0}>
        <div style={{ position: "absolute", left: 160, top: 800, scale: 1.25 }}>
          <Plane split={split} lit={1 - split * 0.8} />
        </div>
        {f >= boom
          ? Array.from({ length: 40 }, (_, i) => {
              const a = random(`a${i}`) * Math.PI * 2;
              const v = 8 + random(`v${i}`) * 22;
              const t = f - boom;
              return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * v * t, top: 900 + Math.sin(a) * v * t + 0.6 * t * t, width: 8, height: 8, borderRadius: 4, background: i % 3 ? "#FFB54A" : "#FF4A2A", opacity: ip(t, [0, 30], [1, 0]), boxShadow: "0 0 14px #FF7A2A" }} />;
            })
          : null}
        {f >= boom ? <div style={{ position: "absolute", left: 540, top: 900, width: 40, height: 40, translate: "-50% -50%", borderRadius: "50%", border: "3px solid rgba(255,220,170,0.9)", scale: 1 + (f - boom) * 2.2, opacity: ip(f - boom, [0, 10], [0.9, 0]) }} /> : null}
      </Cam>
      {f >= boom ? <BigNum value="× 3" x={540} y={1300} size={170} color={RED} f={f} at={boom + 8} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 47%, rgba(255,240,200,${fl}), rgba(255,90,40,${fl * 0.7}) 40%, rgba(0,0,0,0) 80%)` }} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 4 · 10,5–13,9 s: el trozo del fuselaje gira entre nubes
const Trozo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0A1022, #1A2440 60%, #2E3A5C)" }}>
      <Cam f={f} dur={S(3.4)} z0={1.0} z1={1.2}>
        <Clouds f={f * 5} speed={-4} seed="d" />
        <div style={{ position: "absolute", left: 540, top: 860, translate: "-50% -50%", rotate: `${f * 4}deg`, scale: 1.4 }}>
          <svg width={260} height={120} viewBox="0 0 260 120">
            <path d="M10 20 L40 30 L30 10 L230 18 L250 40 L232 60 L250 100 L30 104 L50 84 L12 92 Z" fill="#C6CEDD" />
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={60 + i * 28} y={44} width={14} height={10} rx={3} fill="#1B2236" />)}
          </svg>
        </div>
      </Cam>
      <Chip text="28 a bordo" x={540} y={1250} f={f} at={S(0.3)} />
      <BigNum value="1 viva" x={540} y={1340} size={140} color={RED} f={f} at={S(1.5)} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 5 · 13,9–17,9 s: el trozo cae sobre la ladera nevada y desliza como un trineo
const Montana: React.FC = () => {
  const f = useCurrentFrame();
  const dur = S(4);
  const u = ease(ip(f, [0, dur], [0, 1]));
  const px = 120 + u * 760;
  const py = 560 + u * 820;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0C1430, #27355E 50%, #46598A)" }}>
      <Stars f={f} seed="m" n={40} />
      <Cam f={f} dur={dur} z0={1.05} z1={1.22} x={-60} y={-80}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M-100 1100 L300 520 L520 820 L760 600 L1200 1300 L1200 1920 L-100 1920 Z" fill="#2B3A63" />
          <path d="M-100 1500 L100 600 L1180 1500 L1180 1920 L-100 1920 Z" fill="#E9EEF7" />
          <path d="M100 600 L220 740 L160 760 L60 800 Z" fill="#FFFFFF" />
          <path d="M-100 1500 L100 600 L1180 1500" fill="none" stroke="#B8C4DE" strokeWidth={6} />
        </svg>
        {Array.from({ length: 36 }, (_, i) => {
          const t = (f - i * 0.6 + 200) % 24;
          return <div key={i} style={{ position: "absolute", left: px - 40 - t * (4 + random(`q${i}`) * 6), top: py + 10 - t * (3 + random(`r${i}`) * 4) + t * t * 0.3, width: 10, height: 10, borderRadius: 5, background: "#fff", opacity: ip(t, [0, 24], [0.9, 0]) }} />;
        })}
        <div style={{ position: "absolute", left: px, top: py, translate: "-50% -50%", rotate: "38deg" }}>
          <svg width={240} height={100} viewBox="0 0 260 120">
            <path d="M10 20 L40 30 L30 10 L230 18 L250 40 L232 60 L250 100 L30 104 L50 84 L12 92 Z" fill="#C6CEDD" />
          </svg>
        </div>
        {Array.from({ length: 70 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: (random(`n${i}`) * 1080 + Math.sin(f / 20 + i) * 30) % 1080, top: (random(`k${i}`) * 1920 + f * (2 + random(`z${i}`) * 3)) % 1920, width: 5, height: 5, borderRadius: 3, background: "#fff", opacity: 0.7 }} />
        ))}
      </Cam>
      <Chip text="ladera nevada · ángulo" x={540} y={1550} f={f} at={S(1.8)} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 6 · 17,9–22,2 s: hospital, coma 27 días, monitor de pulso
const Hospital: React.FC = () => {
  const f = useCurrentFrame();
  const days = Math.min(27, Math.max(1, Math.round(ip(f, [S(0.2), S(1.4)], [1, 27]))));
  const pts: string[] = [];
  for (let x = 0; x <= 760; x += 8) {
    const ph = ((x + f * 9) % 190) - 95;
    const y = Math.abs(ph) < 6 ? -70 * Math.sign(ph + 0.1) : Math.abs(ph) < 14 ? 20 : 0;
    pts.push(`${x},${120 + y}`);
  }
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#071016, #0E1D24 60%, #13262C)" }}>
      <Cam f={f} dur={S(4.3)} z0={1.15} z1={1.0}>
        <div style={{ position: "absolute", left: 160, top: 560, width: 760, height: 260, borderRadius: 24, background: "#05090C", border: "4px solid #24424A", boxShadow: "0 0 60px rgba(60,255,160,0.15)" }}>
          <svg width={760} height={260}>
            <polyline points={pts.join(" ")} fill="none" stroke="#3CFFA0" strokeWidth={6} style={{ filter: "drop-shadow(0 0 8px #3CFFA0)" }} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 140, top: 1040, width: 800, height: 120, borderRadius: 30, background: "#1F343C" }} />
        <div style={{ position: "absolute", left: 210, top: 960 }}>
          <svg width={700} height={110} viewBox="0 0 700 110">
            <ellipse cx={90} cy={60} rx={60} ry={40} fill="#E8EEF0" />
            <path d="M150 50 Q400 10 660 60 L660 100 L150 100 Z" fill="#CFDDE2" />
          </svg>
        </div>
      </Cam>
      <BigNum value={`día ${days}`} x={540} y={1260} size={150} color={days === 27 ? RED : "#fff"} f={f} at={0} />
      <Chip text="«no volverá a caminar»" x={540} y={1470} f={f} at={S(2.4)} />
      <Vignette />
    </AbsoluteFill>
  );
};
// 7 · 22,2–24,3 s: se levanta y vuelve a volar al amanecer
const Amanecer: React.FC<{ final?: boolean }> = ({ final }) => {
  const f = useCurrentFrame();
  const sun = ip(f, [0, S(2)], [1380, 1180]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2A1B3D, #8A3B46 45%, #F08A4B 75%, #FFC37A)" }}>
      <Cam f={f} dur={S(final ? 3.3 : 2.1)} z0={1.0} z1={1.1}>
        <div style={{ position: "absolute", left: 540 - 180, top: sun - 180, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, #FFF2C9, #FFC46B 60%, rgba(255,196,107,0) 72%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M0 1320 Q540 1270 1080 1320 L1080 1920 L0 1920 Z" fill="#1A1020" />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 95} y={1352} width={40} height={6} fill="#FFC37A" opacity={0.5} />)}
        </svg>
        <div style={{ position: "absolute", left: 540, top: 1150, translate: "-50% 0" }}>
          <Person pose="stand" color="#140A18" scale={1.3} />
        </div>
        {!final || f < S(1.5) ? (
          <div style={{ position: "absolute", left: ip(f, [0, S(2.1)], [600, 1100]), top: ip(f, [0, S(2.1)], [1180, 860]), scale: 0.45, rotate: "-12deg" }}>
            <Plane />
          </div>
        ) : null}
      </Cam>
      {final ? <BigNum value="¿y tú?" x={540} y={760} size={170} f={f} at={S(0.4)} /> : null}
      <Vignette />
    </AbsoluteFill>
  );
};

const CUTS = [0, 3.2, 7.5, 10.5, 13.9, 17.9, 22.2, 24.3];
const Sfx: React.FC<{ at: number; name: string; v: number }> = ({ at, name, v }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={50}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);
export const Vesna: React.FC = () => {
  const f = useCurrentFrame();
  const seg = (a: number, b: number) => ({ from: S(a), durationInFrames: S(b) - S(a) });
  const flash = CUTS.slice(1).reduce((o, c) => (f >= S(c) ? Math.max(o, ip(f - S(c), [0, 6], [0.35, 0])) : o), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence {...seg(0, 3.2)}><Caida /></Sequence>
      <Sequence {...seg(3.2, 7.5)}><Vuelo /></Sequence>
      <Sequence {...seg(7.5, 10.5)}><Bomba /></Sequence>
      <Sequence {...seg(10.5, 13.9)}><Trozo /></Sequence>
      <Sequence {...seg(13.9, 17.9)}><Montana /></Sequence>
      <Sequence {...seg(17.9, 22.2)}><Hospital /></Sequence>
      <Sequence {...seg(22.2, 24.3)}><Amanecer /></Sequence>
      <Sequence from={S(24.3)} durationInFrames={VESNA_TOTAL - S(24.3)}><Amanecer final /></Sequence>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})`, pointerEvents: "none" }} />
      <Captions f={f} />
      <Audio src={staticFile("vesna/voz.wav")} />
      {CUTS.slice(1).map((c, i) => <Sfx key={i} at={S(c) - 6} name="whoosh" v={0.18} />)}
      <Sfx at={S(7.5 + 1.6)} name="impact" v={0.4} />
      <Sfx at={S(13.9 + 0.2)} name="drop" v={0.25} />
      <Sfx at={S(22.2)} name="shimmer" v={0.25} />
    </AbsoluteFill>
  );
};
