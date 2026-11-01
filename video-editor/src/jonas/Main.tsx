import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/jonas/words.json";
import { Captions, Dust, FPS, Figure, GodRays, Grain, Rain, S, Vignette, Word, ease, groupWords, ip, pop } from "../kit/Kit";

// ZK · Jonás en primera persona: tormenta → fondo del mar → dentro del pez → la orilla.
// Tres mundos de color, un estímulo cada 0,7–1,3 s, silencio negro antes del clímax y final que enlaza con el inicio.
export const JONAS_TOTAL = S(28.6);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["mar", "tormenta", "barco", "culpa", "dios", "agua", "hundes", "diez", "veinte", "aire", "enorme", "boca", "oscuridad", "tres", "pez", "luz", "salida", "oras", "escupe", "orilla", "jonás", "hondo", "tú"]);

const useT = (t0: number) => t0 + useCurrentFrame() / FPS;
const since = (t: number, at: number) => S(t) - S(at);

// ---------- piezas ----------
const Shake: React.FC<{ a: number; f: number; children: React.ReactNode }> = ({ a, f, children }) => (
  <AbsoluteFill style={{ transform: `translate(${(random(`x${f}`) - 0.5) * a}px, ${(random(`y${f}`) - 0.5) * a}px)` }}>{children}</AbsoluteFill>
);

const BigT: React.FC<{ t: number; text: string; y: number; size: number; color?: string; rot?: number }> = ({ t, text, y, size, color = "#fff", rot = 0 }) =>
  t < 0 ? null : (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: size, color, letterSpacing: -3, wordSpacing: size * 0.25, whiteSpace: "pre", lineHeight: 1, transform: `rotate(${rot}deg) scale(${ip(t, [0, 5], [1.5, 1])})`, opacity: ip(t, [0, 3], [0, 1]), textShadow: `0 0 40px ${color}, 0 8px 30px rgba(0,0,0,0.8)` }}>
      {text}
    </div>
  );

const Mark: React.FC<{ t: number; txt: string; top: number }> = ({ t, txt, top }) =>
  t < 0 ? null : (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 16, background: "rgba(8,10,16,0.85)", border: "3px solid #FF3B3B", transform: `scale(${pop(t)})`, boxShadow: t < 10 ? "0 0 40px rgba(255,59,59,0.7)" : "0 10px 30px rgba(0,0,0,0.5)" }}>
        <span style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 54, color: "#FF3B3B", lineHeight: 1 }}>✕</span>
        <span style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 46, color: "#fff" }}>{txt}</span>
      </div>
    </div>
  );

// olas: varias capas con parallax; amp crece hacia delante
const wave = (f: number, y: number, amp: number, k: number, sp: number, seed: number) => {
  let d = `M-60 1980 L-60 ${y}`;
  for (let x = -60; x <= 1140; x += 30) {
    const yy = y + Math.sin(x * k + f * sp + seed) * amp + Math.sin(x * k * 2.3 - f * sp * 1.4 + seed * 2) * amp * 0.35;
    d += ` L${x} ${yy.toFixed(1)}`;
  }
  return d + " L1140 1980 Z";
};
const Sea: React.FC<{ f: number; y?: number; roll?: number; flash?: number; dawn?: number }> = ({ f, y = 1150, roll = 0, flash = 0, dawn = 0 }) => {
  const sky = dawn ? `linear-gradient(#3A5A8A, #F2A65A 62%, #FFD99A)` : `linear-gradient(#05080F, #10202C 55%, #1C3440)`;
  const cols = dawn ? ["#2E5872", "#244A62", "#1A3A50", "#122C3E"] : ["#0E1E28", "#0B1820", "#081218", "#050C10"];
  return (
    <AbsoluteFill style={{ transform: `rotate(${roll}deg) scale(1.25)`, transformOrigin: "50% 60%" }}>
      <AbsoluteFill style={{ background: sky }} />
      {!dawn ? (
        <>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: -300 + ((f * (2 + i) + i * 400) % 1600) - 200, top: 200 + i * 160, width: 1300, height: 380, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(60,80,100,0.5), rgba(60,80,100,0) 70%)", filter: "blur(16px)" }} />
          ))}
        </>
      ) : null}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {cols.map((c, i) => (
          <path key={i} d={wave(f, y + i * 150, 40 + i * 38, 0.006 - i * 0.0008, 0.09 + i * 0.03, i * 1.7)} fill={c} stroke={dawn ? "rgba(255,220,170,0.35)" : `rgba(150,200,220,${0.12 + 0.6 * flash})`} strokeWidth={3} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: `rgba(210,230,255,${flash * 0.75})`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const Bolt: React.FC<{ t: number; x: number; seed: string }> = ({ t, x, seed }) => {
  if (t < 0 || t > 6) return null;
  let px = x;
  let d = `M${x} -20`;
  for (let i = 1; i <= 9; i++) {
    px += (random(`${seed}${i}`) - 0.5) * 160;
    d += ` L${px} ${i * 110}`;
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ip(t, [0, 1, 6], [1, 1, 0]) }}>
      <path d={d} stroke="#E8F2FF" strokeWidth={9} fill="none" style={{ filter: "drop-shadow(0 0 20px #9CC8FF) drop-shadow(0 0 50px #6AA8FF)" }} />
    </svg>
  );
};

// barco que se parte en dos (split 0..1)
const Ship: React.FC<{ f: number; x: number; y: number; s: number; split?: number }> = ({ f, x, y, s, split = 0 }) => {
  const bob = Math.sin(f / 9) * 14;
  const tilt = Math.sin(f / 13) * 6;
  const half = (side: 1 | -1) => (
    <g transform={`translate(${side * split * 90} ${split * 60}) rotate(${side * split * 28} ${side > 0 ? 260 : 240} 260)`}>
      <path d={side < 0 ? "M20 200 L252 200 L252 300 L80 300 Z" : "M248 200 L480 200 L420 300 L248 300 Z"} fill="#2A1A12" stroke={split > 0 ? "#8FB8D0" : "none"} strokeWidth={3} />
      <rect x={side < 0 ? 140 : 340} y={20} width={10} height={180} fill="#1C120C" />
      <path d={side < 0 ? "M150 30 Q210 90 150 170 Z" : "M350 30 Q410 90 350 170 Z"} fill="#3A3028" stroke="#8FB8D0" strokeWidth={2} />
    </g>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-50%) scale(${s}) rotate(${tilt}deg)` }}>
      <svg width={500} height={320} style={{ overflow: "visible" }}>
        {half(-1)}
        {half(1)}
        {split > 0 ? <path d="M250 190 L262 230 L244 250 L258 300" stroke="#FFE7B0" strokeWidth={5} fill="none" opacity={1 - split} /> : null}
      </svg>
    </div>
  );
};

// mundo bajo el agua: deep 0 (superficie) .. 1 (abismo)
const Under: React.FC<{ f: number; deep: number; rays?: number }> = ({ f, deep, rays = 1 }) => {
  const a = (c0: number, c1: number) => Math.round(c0 + (c1 - c0) * deep);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(rgb(${a(40, 4)},${a(130, 18)},${a(150, 30)}), rgb(${a(8, 1)},${a(40, 4)},${a(60, 10)}))` }} />
      <GodRays f={f} x={540} y={-300} color="#9FE8F0" o={0.35 * rays * (1 - deep)} n={9} spread={90} />
      <Dust f={f} n={60} color="170,230,240" seed="pl" />
    </AbsoluteFill>
  );
};
const Bubbles: React.FC<{ f: number; n?: number; x?: number; w?: number; seed?: string; big?: number }> = ({ f, n = 30, x = 540, w = 900, seed = "b", big = 1 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const life = 40 + random(`${seed}l${i}`) * 40;
      const t = (f + random(`${seed}o${i}`) * life) % life;
      const r = (6 + random(`${seed}r${i}`) * 22) * big;
      return <div key={i} style={{ position: "absolute", left: x + (random(`${seed}x${i}`) - 0.5) * w + Math.sin((t + i) / 5) * 14, top: 1900 - t * (30 + random(`${seed}v${i}`) * 20), width: r, height: r, borderRadius: "50%", border: "2px solid rgba(220,250,255,0.7)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.05) 60%)" }} />;
    })}
  </>
);

// interior del pez: costillas en perspectiva que respiran
const Ribs: React.FC<{ f: number; light?: number; close?: number }> = ({ f, light = 0.25, close = 0 }) => {
  const br = 1 + Math.sin(f / 14) * 0.03;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 45% at 50% 55%, rgba(${Math.round(90 * light * 2)},${Math.round(30 * light * 2)},${Math.round(30 * light * 2)},1), #050202 80%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `scale(${br})` }}>
        {Array.from({ length: 7 }, (_, i) => {
          const k = (i + ((f / 30) % 1)) / 7; // avanzan hacia la cámara
          const sc = 0.25 + k * 1.6;
          const w = 420 * sc * (1 - close * 0.45);
          const h = 620 * sc;
          return <path key={i} d={`M${540 - w} ${1050 + h * 0.5} Q${540 - w * 1.05} ${1050 - h * 0.6} 540 ${1050 - h * 0.7} Q${540 + w * 1.05} ${1050 - h * 0.6} ${540 + w} ${1050 + h * 0.5}`} stroke={`rgba(${200},${120},${110},${(0.12 + 0.5 * k) * light * 3})`} strokeWidth={10 + 30 * k} fill="none" strokeLinecap="round" />;
        })}
      </svg>
      {Array.from({ length: 6 }, (_, i) => {
        const life = 45;
        const t = (f + i * 9) % life;
        return <div key={i} style={{ position: "absolute", left: 200 + i * 130, top: 300 + t * t * 0.6, width: 8, height: 18, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `rgba(200,140,120,${light * 2})` }} />;
      })}
    </AbsoluteFill>
  );
};

// el pez visto de frente: boca que se abre (open 0..1) y se acerca (z)
const Maw: React.FC<{ f: number; open: number; z: number; eye?: number }> = ({ f, open, z, eye = 1 }) => (
  <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 52%" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <ellipse cx={540} cy={1000} rx={760} ry={560} fill="#0A1A22" stroke="rgba(120,200,220,0.35)" strokeWidth={6} />
      <ellipse cx={540} cy={1000} rx={600 * (0.3 + 0.7 * open)} ry={20 + 380 * open} fill="#000" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 540 + (i - 4) * 120 * (0.3 + 0.7 * open);
        const top = 1000 - (20 + 380 * open) * Math.sqrt(Math.max(0, 1 - ((i - 4) / 5) ** 2));
        const bot = 1000 + (20 + 380 * open) * Math.sqrt(Math.max(0, 1 - ((i - 4) / 5) ** 2));
        return (
          <g key={i} fill="#C9C0A8" opacity={open > 0.05 ? 1 : 0}>
            <path d={`M${x - 22} ${top - 4} L${x + 22} ${top - 4} L${x} ${top + 70 * open}`} />
            <path d={`M${x - 22} ${bot + 4} L${x + 22} ${bot + 4} L${x} ${bot - 60 * open}`} />
          </g>
        );
      })}
      {[300, 780].map((x, i) => (
        <g key={i} opacity={eye}>
          <circle cx={x} cy={560} r={46} fill="#E8F8E0" style={{ filter: "drop-shadow(0 0 30px #9CFFCF)" }} />
          <ellipse cx={x} cy={560} rx={10} ry={36 + Math.sin(f / 6) * 4} fill="#000" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// ---------- escenas ----------
// 1 · 0–1,45: estás en medio del mar (tormenta, cámara que rueda)
const E1: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sea f={f + 40} roll={Math.sin(f / 10) * 9} flash={ip(f, [0, 2, 8], [1, 0.8, 0])} y={1050} />
      <Ship f={f} x={540} y={1020} s={1.2} />
      <Rain f={f} n={140} o={0.55} />
      <Bolt t={S(t)} x={760} seed="a" />
    </AbsoluteFill>
  );
};
// 2 · 1,45–3,3: la tormenta parte el barco en dos
const E2: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(1.45);
  const split = ease(ip(since(t, 2.92), [0, 12], [0, 1]));
  const flash = Math.max(ip(since(t, 1.7), [0, 2, 9], [0, 1, 0]), ip(since(t, 2.92), [0, 2, 8], [0, 0.8, 0]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={t >= 2.92 ? 30 * (1 - Math.min(1, since(t, 2.92) / 12)) : 4} f={f}>
        <Sea f={f + 80} roll={Math.sin(f / 9) * 12} flash={flash} y={1180} />
        <Ship f={f} x={540} y={1150} s={ip(f, [0, 55], [1.6, 2.0])} split={split} />
        <Rain f={f} n={140} o={0.55} />
        <Bolt t={since(t, 1.7)} x={420} seed="b" />
        <Bolt t={since(t, 2.92)} x={600} seed="c" />
      </Shake>
    </AbsoluteFill>
  );
};
// 3 · 3,3–4,45: y es por tu culpa (todos te señalan)
const E3: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(3.3);
  const pts = [3.42, 3.62, 3.82, 4.02];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `rotate(${Math.sin(f / 8) * 6}deg) scale(${ip(f, [0, 34], [1.05, 1.25])})` }}>
        <AbsoluteFill style={{ background: "linear-gradient(#060A10, #142430)" }} />
        <Rain f={f} n={100} o={0.45} />
        {[180, 400, 680, 900].map((x, i) => (
          <Figure key={i} f={f + i * 9} x={x} y={1560 + (i % 2) * 70} h={620 - (i % 2) * 60} rim="#8FC8FF" rimSide={x < 540 ? 1 : -1} cloth="#2A3440" hood={i % 2 === 0} flip={x > 540} arm={t >= pts[i] ? ip(since(t, pts[i]), [0, 4], [0, 90]) : 0} armSide={x < 540 ? 1 : -1} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,0,0,0) 30%, rgba(170,0,0,${ip(since(t, 4.12), [0, 6], [0, 0.6])}) 100%)` }} />
      <BigT t={since(t, 4.12)} text="TU CULPA" y={820} size={170} color="#FF4A3A" rot={-3} />
    </AbsoluteFill>
  );
};
// 4 · 3,3–5,55: huiste de Dios (corres en sentido contrario a la luz)
const E4: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(4.45);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: "linear-gradient(#1A1420, #4A3A3A 60%, #2A1E1A)" }} />
      <GodRays f={f} x={880} y={-200} color="#FFF0C8" o={ip(since(t, 5.08), [0, 8], [0.25, 0.7])} n={11} spread={70} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M-50 1500 Q540 1380 1130 1500 L1130 1920 L-50 1920 Z" fill="#140E0C" />
      </svg>
      <div style={{ position: "absolute", left: 620, top: 1130, padding: "10px 22px", background: "#3A2A1A", border: "4px solid #FFD58A", borderRadius: 10, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 52, color: "#FFD58A", transform: `rotate(-4deg) scale(${pop(S(t) - S(4.45))})` }}>NÍNIVE →</div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${-f * 7}px)` }}>
        <Figure f={f * 3} x={540} y={1520} h={340} rim="#FFE3B0" rimSide={1} cloth="#5A4030" hood={false} flip lean={-12} arm={ip(Math.sin(f / 2), [-1, 1], [-30, 40])} arm2={ip(Math.sin(f / 2), [-1, 1], [40, -30])} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1610, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 64, color: "#FFE3B0", opacity: ip(f, [4, 8], [0, 1]) }}>← tú</div>
    </AbsoluteFill>
  );
};
// 5 · 5,55–6,6: te lanzan al agua (caes del barco, el mar sube hacia ti)
const E5: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(5.55);
  const fall = ip(since(t, 5.78), [0, 15], [0, 1]);
  const hit = since(t, 6.3);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `rotate(${ip(fall, [0, 1], [0, 160])}deg) scale(${1 + fall * 0.8})`, transformOrigin: "50% 50%" }}>
        <Sea f={f} y={ip(fall, [0, 1], [1500, 300])} flash={0} />
        <Rain f={f} n={120} o={0.5} />
      </AbsoluteFill>
      {fall < 0.4 ? (
        <>
          {[[-1, 300], [1, 780]].map(([s, x], i) => (
            <svg key={i} width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateY(${-fall * 900}px)` }}>
              <path d={`M${x} 1920 L${x + s * 20} 1300 Q${x + s * 40} 1180 ${540 + s * 80} 1150 L${540 + s * 110} 1250 Q${x + s * 120} 1300 ${x + s * 160} 1920 Z`} fill="#2A2A30" stroke="#8FC8FF" strokeWidth={3} />
            </svg>
          ))}
        </>
      ) : null}
      {hit >= 0 ? <AbsoluteFill style={{ background: `rgba(220,245,255,${ip(hit, [0, 2, 8], [1, 0.9, 0])})` }} /> : null}
    </AbsoluteFill>
  );
};
// 6 · 6,6–7,6: te hundes (la luz de la superficie se aleja)
const E6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Under f={f} deep={ip(f, [0, 30], [0, 0.25])} />
      <div style={{ position: "absolute", left: 540 - ip(f, [0, 30], [500, 200]), top: -260, width: ip(f, [0, 30], [1000, 400]), height: 420, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(220,255,255,0.8), rgba(220,255,255,0) 70%)" }} />
      <AbsoluteFill style={{ transform: `translateY(${ip(f, [0, 30], [-200, 260])}px)` }}>
        <Figure f={f} x={540} y={1250} h={420} rim="#9FE8F0" rimSide={1} cloth="#3A2A2A" hood={false} arm={160} arm2={150} lean={6} />
      </AbsoluteFill>
      <Bubbles f={f} n={40} seed="e6" big={1.2} />
    </AbsoluteFill>
  );
};
// 7 · 7,6–9,2: diez metros… veinte (medidor de profundidad)
const E7: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(7.6);
  const step = t >= 8.6 ? 2 : 1;
  const sinceStep = since(t, step === 2 ? 8.6 : 7.68);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + sinceStep * 0.004})` }}>
        <Under f={f} deep={step === 2 ? 0.62 : 0.4} rays={0.8} />
        <Figure f={f} x={540} y={1300 + sinceStep * 3} h={step === 2 ? 200 : 300} rim="#7FC8D8" rimSide={1} cloth="#2A2020" hood={false} arm={160} arm2={150} o={step === 2 ? 0.75 : 1} />
        <Bubbles f={f} n={18} seed="e7" w={300} big={0.7} />
      </AbsoluteFill>
      {/* regla de profundidad */}
      <div style={{ position: "absolute", left: 70, top: 380, width: 8, height: 1200, background: "rgba(160,230,240,0.3)" }}>
        {Array.from({ length: 13 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: i * 100 - ((step * 300 + sinceStep * 6) % 100), width: i % 2 ? 26 : 46, height: 4, background: "rgba(160,230,240,0.6)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontStyle: "italic", fontSize: 230, color: step === 2 ? "#5FD0E8" : "#9FF0FF", transform: `scale(${pop(sinceStep)})`, textShadow: "0 0 50px rgba(95,208,232,0.7)" }}>
        −{step * 10} m
      </div>
    </AbsoluteFill>
  );
};
// 8 · 9,2–10,25: sin aire (la última burbuja y la barra de aire vacía)
const E8: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(9.2);
  const air = ip(since(t, 9.26), [0, 22], [0.35, 0]);
  const pulse = Math.abs(Math.sin(f / 4));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.3 + f * 0.006})` }}>
        <Under f={f} deep={0.78} rays={0.4} />
        {/* tu rostro de perfil, de cerca */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M1080 700 L760 720 Q640 760 610 880 L560 960 L620 990 L600 1040 Q640 1080 630 1120 L680 1180 Q700 1260 780 1300 L1080 1320 Z" fill="#0A0F14" stroke="#7FC8D8" strokeWidth={4} />
        </svg>
        <Bubbles f={f} n={7} x={600} w={60} seed="e8" big={1.6} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.6 + 0.3 * pulse}) 100%)` }} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1480, height: 46, borderRadius: 23, border: "4px solid rgba(255,255,255,0.8)", overflow: "hidden" }}>
        <div style={{ width: `${air * 100}%`, height: "100%", background: "#FF3B3B", boxShadow: "0 0 30px #FF3B3B" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1550, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 54, color: "#FF5A4A", opacity: 0.6 + 0.4 * pulse }}>AIRE {Math.round(air * 100)}%</div>
    </AbsoluteFill>
  );
};
// 9 · 10,25–11,35: y entonces… un ojo enorme se abre en la oscuridad
const E9: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(10.25);
  const open = ease(ip(since(t, 10.66), [0, 10], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#010407" }}>
      <Dust f={f} n={40} color="120,190,210" seed="e9" />
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.01})` }}>
        <div style={{ position: "absolute", left: 540 - 300, top: 900 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,255,200,0.35), rgba(140,255,200,0) 65%)", opacity: open }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={540} cy={900} rx={200} ry={200 * open} fill="#D8F8E0" style={{ filter: "drop-shadow(0 0 40px #9CFFCF)" }} />
          <ellipse cx={540} cy={900} rx={34} ry={170 * open} fill="#000" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// 10 · 11,35–12,6: algo enorme abre la boca y te traga
const E10: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(11.35);
  const open = ease(ip(since(t, 11.88), [0, 12], [0.05, 1]));
  const z = ip(f, [0, 20, 37], [0.55, 0.8, 4.5]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Under f={f} deep={0.85} rays={0.2} />
      <Shake a={since(t, 11.6) > 0 ? 10 : 0} f={f}>
        <Maw f={f} open={open} z={z} eye={ip(f, [26, 34], [1, 0])} />
      </Shake>
      <Bubbles f={f} n={20} seed="e10" big={1} />
    </AbsoluteFill>
  );
};
// 11 · 12,6–14,0: oscuridad total (solo un latido)
const E11: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(12.6);
  const b = Math.min(...[12.96, 13.6].map((x) => (t >= x ? since(t, x) : 99)));
  const pulse = b < 10 ? 1 - b / 10 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: 0.25 + 0.4 * pulse }}>
        <Ribs f={f} light={0.12 + 0.15 * pulse} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(120,0,0,${0.35 * pulse}), rgba(0,0,0,0) 45%)` }} />
    </AbsoluteFill>
  );
};
// 12 · 14,0–15,6: tres días dentro de un pez (contador de días)
const E12: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(14.0);
  const marks = [14.1, 14.56, 15.04];
  const n = marks.filter((m) => t >= m).length;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 + f * 0.004})` }}>
        <Ribs f={f + 60} light={0.35} />
        <Figure f={f} x={540} y={1420} h={300} rim="#FF9A7A" rimSide={1} cloth="#3A2020" hood={false} kneel={0.6} o={0.9} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 46 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 22, height: 200, borderRadius: 8, background: i < n ? "#FFD58A" : "rgba(255,213,138,0.15)", transform: `rotate(${i === 2 ? 0 : -6}deg) scaleY(${i < n ? pop(since(t, marks[i])) : 1})`, boxShadow: i < n ? "0 0 26px #FFB54A" : "none" }} />
        ))}
      </div>
      <BigT t={since(t, 14.1)} text={`DÍA ${Math.max(1, n)}`} y={830} size={150} color="#FFD58A" />
    </AbsoluteFill>
  );
};
// 13 · 15,6–16,55: sin luz
const E13: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(15.6);
  const out = since(t, 15.96);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Ribs f={f + 90} light={0.22} close={0.3} />
      <div style={{ position: "absolute", left: 540, top: 1150, transform: "translate(-50%,-100%)" }}>
        <div style={{ position: "absolute", left: -200, top: -260, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,90,0.6), rgba(255,190,90,0) 65%)", opacity: out < 0 ? 1 : ip(out, [0, 4], [1, 0]) }} />
        <div style={{ width: 34, height: 70, borderRadius: "50% 50% 40% 40%", background: "#FFD58A", opacity: out < 0 ? 0.8 + 0.2 * Math.sin(f) : ip(out, [0, 3], [1, 0]), boxShadow: "0 0 30px #FFB54A" }} />
        {out >= 0 ? <div style={{ position: "absolute", left: 0, top: -ip(out, [0, 20], [0, 220]), width: 30, height: 30, borderRadius: "50%", background: "rgba(140,140,150,0.35)", filter: "blur(8px)" }} /> : null}
      </div>
      <Mark t={since(t, 15.96)} txt="luz" top={620} />
    </AbsoluteFill>
  );
};
// 14 · 16,55–17,35: sin salida (las paredes se cierran)
const E14: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(16.55);
  const close = ease(ip(f, [0, 24], [0.1, 1]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={6} f={f}>
        <Ribs f={f + 120} light={0.3} close={close} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120 + close * 260, background: "linear-gradient(90deg, #120606, #2A0E0E)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120 + close * 260, background: "linear-gradient(270deg, #120606, #2A0E0E)" }} />
      </Shake>
      <Mark t={since(t, 16.88)} txt="salida" top={620} />
    </AbsoluteFill>
  );
};
// 15 · 17,35–19,6: y aun así, desde el fondo, oras (una luz nace en tu pecho)
const E15: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(17.35);
  const pray = ip(since(t, 19.36), [0, 8], [0, 1]);
  const zoom = ip(f, [0, 67], [1.0, 1.35]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
        <Ribs f={f + 150} light={0.2 + 0.2 * pray} />
        <Figure f={f} x={540} y={1440} h={430} rim={pray > 0 ? "#FFE3B0" : "#FF9A7A"} rimSide={1} cloth="#3A2A20" hood={false} kneel={1} arm={60} arm2={60} head={-10} glow={0.2 + 0.8 * pray} />
        <div style={{ position: "absolute", left: 540 - 30, top: 1180, width: 60, height: ip(pray, [0, 1], [0, 1200]), transform: "translateY(-100%)", background: "linear-gradient(rgba(255,240,200,0), rgba(255,240,200,0.85))", filter: "blur(6px)" }} />
      </AbsoluteFill>
      <Dust f={f} n={30} color="255,220,170" seed="e15" />
    </AbsoluteFill>
  );
};
// 16 · 19,6–20,18: silencio: todo negro, una grieta de luz
const E16: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 540 - 3, top: 960 - ip(f, [0, 17], [0, 300]), width: 6, height: ip(f, [0, 17], [0, 600]), background: "#FFF4D8", boxShadow: "0 0 40px #FFE3A0, 0 0 90px #FFC46B", opacity: ip(f, [4, 10], [0, 1]) }} />
    </AbsoluteFill>
  );
};
// 17 · 20,18–21,95: el pez te escupe en la orilla (estallido de luz)
const E17: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(20.18);
  const spit = since(t, 20.86);
  const fly = ease(ip(spit, [0, 14], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={spit >= 0 && spit < 12 ? 26 * (1 - spit / 12) : 0} f={f}>
        <Sea f={f} y={1050} dawn={1} />
        <div style={{ position: "absolute", left: 540 - 220, top: 760 - 220, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #FFF6DA, #FFD58A 45%, rgba(255,200,120,0) 70%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M-50 1500 Q500 1400 1130 1470 L1130 1920 L-50 1920 Z" fill="#D8B07A" />
          <path d="M-50 1560 Q500 1480 1130 1540 L1130 1920 L-50 1920 Z" fill="#B88E5A" />
        </svg>
        {/* el pez asoma y se retira */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateY(${ip(spit, [0, 30], [0, 240])}px)` }}>
          <path d="M760 1300 Q920 1060 1180 1160 L1180 1420 Q980 1430 760 1300 Z" fill="#1A3040" stroke="#FFD99A" strokeWidth={4} />
          <circle cx={900} cy={1210} r={12} fill="#D8F8E0" />
        </svg>
        {spit >= 0 ? (
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${ip(fly, [0, 1], [780, 380])}px, ${ip(fly, [0, 0.5, 1], [1260, 1080, 1530])}px) rotate(${ip(fly, [0, 1], [-160, 0])}deg)` }}>
            <Figure f={f} x={0} y={0} h={300} rim="#FFE3B0" rimSide={1} cloth="#5A4030" hood={false} kneel={fly > 0.95 ? 1 : 0} arm={fly > 0.95 ? 30 : 150} />
          </div>
        ) : null}
        {spit >= 0 ? Array.from({ length: 30 }, (_, i) => {
          const a = Math.PI + random(`sp${i}`) * Math.PI * 0.9;
          const v = 10 + random(`sv${i}`) * 22;
          const tt = spit;
          return <div key={i} style={{ position: "absolute", left: 780 + Math.cos(a) * v * tt, top: 1260 + Math.sin(a) * v * tt + 0.6 * tt * tt, width: 14, height: 14, borderRadius: "50%", background: "rgba(220,245,255,0.85)", opacity: ip(tt, [0, 30], [1, 0]) }} />;
        }) : null}
      </Shake>
      <AbsoluteFill style={{ background: `rgba(255,250,235,${ip(f, [0, 3, 14], [1, 0.95, 0])})` }} />
    </AbsoluteFill>
  );
};
// 18 · 21,95–23,45: Jonás aprendió algo (de pie, frente al sol)
const E18: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${ip(f, [0, 45], [1.0, 1.12])}) translateX(${ip(f, [0, 45], [30, -30])}px)` }}>
        <Sea f={f + 50} y={1080} dawn={1} />
        <div style={{ position: "absolute", left: 540 - 300, top: 820 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #FFF6DA, #FFD58A 40%, rgba(255,200,120,0) 70%)" }} />
        <GodRays f={f} x={540} y={820} color="#FFF0C8" o={0.35} n={14} spread={360} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M-50 1500 Q500 1420 1130 1480 L1130 1920 L-50 1920 Z" fill="#C89A64" />
        </svg>
        <Figure f={f} x={540} y={1560} h={520} rim="#FFE3B0" rimSide={1} cloth="#5A4030" hood={false} glow={0.5} arm={ip(f, [10, 30], [0, 40])} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540, top: 1600, transform: "translateX(-50%)", padding: "8px 22px", borderRadius: 10, background: "rgba(8,10,16,0.8)", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 40, color: "#FFD58A", opacity: ip(f, [3, 8], [0, 1]) }}>Jonás</div>
      <Dust f={f} n={30} color="255,230,180" seed="e18" />
    </AbsoluteFill>
  );
};
// 19 · 23,45–24,7: no hay lugar tan hondo (corte vertical del mar hasta el fondo)
const E19: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(23.45);
  const dive = ease(ip(f, [0, 37], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translateY(${-dive * 1500}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 700, background: "linear-gradient(#5A7AA0, #F2B070)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 2900, background: "linear-gradient(#2E7A90, #0A2A3A 40%, #01070C)" }} />
        <svg width={1080} height={3600} style={{ position: "absolute", inset: 0 }}>
          <path d={wave(f, 700, 20, 0.008, 0.1, 1)} fill="none" stroke="#BFF0FF" strokeWidth={4} />
          <path d="M-20 3300 Q300 3150 540 3260 Q800 3140 1100 3300 L1100 3600 L-20 3600 Z" fill="#000" />
        </svg>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ position: "absolute", left: 70, top: 1100 + i * 480, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 44, color: "rgba(160,230,240,0.6)" }}>−{(i + 1) * 1000} m</div>
        ))}
      </AbsoluteFill>
      <BigT t={since(t, 24.38)} text="TAN HONDO" y={820} size={150} color="#5FD0E8" />
    </AbsoluteFill>
  );
};
// 20 · 24,7–26,2: donde Dios no te encuentre (un rayo de luz llega hasta el fondo)
const E20: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(24.7);
  const beam = ease(ip(since(t, 25.1), [0, 10], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: "linear-gradient(#0A2A3A, #01070C)" }} />
      <Dust f={f} n={50} color="170,230,240" seed="e20" />
      <div style={{ position: "absolute", left: 540 - 140, top: 0, width: 280, height: 1900 * beam, background: "linear-gradient(rgba(255,246,220,0.95), rgba(255,230,170,0.5))", filter: "blur(18px)" }} />
      <div style={{ position: "absolute", left: 540 - 40, top: 0, width: 80, height: 1900 * beam, background: "rgba(255,252,240,0.9)", filter: "blur(4px)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M-20 1700 Q300 1600 540 1680 Q800 1590 1100 1700 L1100 1920 L-20 1920 Z" fill="#000" />
      </svg>
      <Figure f={f} x={540} y={1700} h={220} rim="#FFE3B0" rimSide={1} cloth="#3A2A20" hood={false} kneel={1} glow={beam} arm={ip(beam, [0, 1], [60, 170])} />
      <AbsoluteFill style={{ background: `rgba(255,250,235,${ip(since(t, 25.1), [0, 2, 10], [0, 0.6, 0])})` }} />
    </AbsoluteFill>
  );
};
// 21 · 26,2–28,6: ¿dónde estás tú? (vuelta a la tormenta: enlaza con el inicio)
const E21: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(26.2);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${ip(f, [0, 72], [1.3, 1.0])})` }}>
        <Sea f={f + 40} roll={Math.sin(f / 10) * 7} flash={ip(since(t, 26.86), [0, 2, 9], [0, 0.7, 0])} y={1050} />
        <Ship f={f} x={540} y={1020} s={1.2} />
        <Rain f={f} n={140} o={0.55} />
        <Bolt t={since(t, 26.86)} x={300} seed="z" />
      </AbsoluteFill>
      <BigT t={since(t, 26.24)} text={"¿DÓNDE\nESTÁS TÚ?"} y={760} size={150} color="#FFFFFF" />
    </AbsoluteFill>
  );
};

const CUTS: [number, React.FC][] = [
  [0, E1], [1.45, E2], [3.3, E3], [4.45, E4], [5.55, E5], [6.6, E6], [7.6, E7], [9.2, E8], [10.25, E9], [11.35, E10], [12.6, E11],
  [14.0, E12], [15.6, E13], [16.55, E14], [17.35, E15], [19.6, E16], [20.18, E17], [21.95, E18], [23.45, E19], [24.7, E20], [26.2, E21],
];
// cortes que entran sin destello (oscuridad, silencio)
const NOFLASH = new Set([10.25, 12.6, 19.6]);
const SFX: [number, string, number][] = [
  [0.0, "jonas/trueno", 0.55], [1.65, "jonas/trueno", 0.45], [2.9, "sfx/crack", 0.45],
  [6.28, "jonas/agua", 0.7], [6.6, "jonas/burbujas", 0.35],
  [12.2, "jonas/trago", 0.8], [12.96, "jonas/latido", 0.7], [13.6, "jonas/latido", 0.6],
  [19.6, "jonas/latido", 0.45],
  [20.18, "sfx/impact", 0.45], [20.86, "jonas/agua", 0.6],
  [25.08, "sfx/shimmer", 0.3], [26.84, "jonas/trueno", 0.35],
];
const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t))} durationInFrames={90}>
    <Audio src={staticFile(`${name}.wav`)} volume={v} />
  </Sequence>
);

export const Jonas: React.FC = () => {
  const f = useCurrentFrame();
  const cutFlash = CUTS.slice(1).reduce((o, [c]) => (!NOFLASH.has(c) && f >= S(c) ? Math.max(o, ip(f - S(c), [0, 4], [0.28, 0])) : o), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.1) saturate(1.15)" }}>
        {CUTS.map(([c, C], i) => {
          const end = CUTS[i + 1]?.[0] ?? 28.6;
          return (
            <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
              <AbsoluteFill style={{ transform: `scale(${NOFLASH.has(c) ? 1 : ip(f - S(c), [0, 6], [1.08, 1])})` }}>
                <C />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${cutFlash})`, pointerEvents: "none" }} />
      <Grain f={f} />
      <Vignette s={0.75} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("jonas/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
