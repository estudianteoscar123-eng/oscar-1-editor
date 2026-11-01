import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/ladron/words.json";
import {
  Big, Bubble, Cam, Captions, Chip, Dust, Embers, Enter, Figure, Fog, FPS, GodRays, Grain, Layer, Rain, S, Soldier, Stars, Vignette, Word, ease, groupWords, ip, pop,
} from "../kit/Kit";

// ZK · "El ladrón en la cruz" (Lucas 23). Estándar ZK: un evento por palabra clave, cámara viva, 5 capas, sonido medido.
export const LADRON_TOTAL = S(37.6);

const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const QUOTE: Record<string, string> = { "nosotros": "«Nosotros", "esto.": "esto»", "Él": "«Él", "malo,": "malo»", "Jesús,": "«Jesús,", "mí.": "mí»", "hoy": "«Hoy", "paraíso.": "paraíso»" };
const WORDS: Word[] = RAW.map((c, i) => {
  let w = c.text.trim();
  const late = c.timestamp[0] > 15 && c.timestamp[0] < 27;
  if (late && QUOTE[w] && !(w === "Jesús," && c.timestamp[0] < 20)) w = QUOTE[w];
  if (w === "dijo," || w === "respondió,") w = w.replace(",", ":");
  if (w === "susurró.") w = "susurró:";
  return { w, s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 };
});
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["paraíso", "criminal", "muerte", "orado", "buena", "burlaba", "malo", "acuérdate", "hoy", "méritos", "tiempo", "mirara", "tarde"]);

type K = [number, number, number, number];
const camAt = (keys: K[], t: number): Cam => {
  let c: K = keys[keys.length - 1];
  if (t <= keys[0][0]) c = keys[0];
  else
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, x0, y0, z0] = keys[i];
      const [t1, x1, y1, z1] = keys[i + 1];
      if (t <= t1) {
        const u = ease((t - t0) / (t1 - t0));
        c = [t, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u];
        break;
      }
    }
  return [t, c[1] + 7 * Math.sin(t * 0.9) + 3 * Math.sin(t * 2.3), c[2] + 5 * Math.sin(t * 1.3), c[3] * (1 + 0.006 * Math.sin(t * 0.7))];
};

// cruz con su crucificado (brazos abiertos sobre el travesaño)
const Cross: React.FC<{ f: number; x: number; y: number; h: number; rim: string; cloth: string; glow?: number; head?: number; flip?: boolean }> = ({ f, x, y, h, rim, cloth, glow = 0, head = 0, flip }) => {
  const bar = y - h * 0.74;
  return (
    <>
      <div style={{ position: "absolute", left: x - h * 0.05, top: y - h * 1.12, width: h * 0.1, height: h * 1.35, background: "linear-gradient(90deg,#0c0907,#1c130d 50%,#0c0907)", boxShadow: `${flip ? -2 : 2}px 0 0 ${rim}55` }} />
      <div style={{ position: "absolute", left: x - h * 0.52, top: bar - h * 0.045, width: h * 1.04, height: h * 0.09, background: "linear-gradient(#1c130d,#0c0907)", boxShadow: `0 -2px 0 ${rim}44` }} />
      <Figure f={f} x={x} y={y} h={h} rim={rim} rimSide={flip ? -1 : 1} cloth={cloth} hood={false} arm={92} arm2={92} glow={glow} head={head} shadow={false} flip={flip} />
    </>
  );
};

// rayo que cae
const Bolt: React.FC<{ t: number; x: number }> = ({ t, x }) => {
  if (t < 0 || t > 8) return null;
  let p = `M${x} 0`;
  let cx = x;
  for (let k = 1; k <= 9; k++) {
    cx += (random(`b${x}${k}`) - 0.5) * 120;
    p += ` L${cx} ${k * 110}`;
  }
  return (
    <svg width={1900} height={2400} style={{ position: "absolute", inset: 0, opacity: ip(t, [0, 1, 8], [1, 1, 0]) }}>
      <path d={p} stroke="#E8EEFF" strokeWidth={6} fill="none" style={{ filter: "drop-shadow(0 0 18px #9EC2FF)" }} />
    </svg>
  );
};

// lista ✕ (lo que nunca hizo / lo que no le pidió)
const Marks: React.FC<{ f: number; items: [string, number][]; show: number; hide: number }> = ({ f, items, show, hide }) => {
  if (f < show || f > hide) return null;
  const o = ip(f - show, [0, 8], [0, 1]) * ip(f, [hide - 8, hide], [1, 0]);
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: o }}>
      {items.map(([txt, at], i) => {
        const t = f - at;
        if (t < 0) return null;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 28px", borderRadius: 18, background: "rgba(8,10,16,0.85)", border: "3px solid #FF3B3B", transform: `scale(${pop(t)})`, boxShadow: t < 10 ? "0 0 40px rgba(255,59,59,0.7)" : "0 10px 30px rgba(0,0,0,0.5)" }}>
            <span style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 56, color: "#FF3B3B", lineHeight: 1 }}>✕</span>
            <span style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 46, color: "#fff" }}>{txt}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- 1 · 0–5,1 s: el paraíso… y un criminal ----------
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const crim = t >= 3.62;
  const burst = ip(f - S(2.52), [0, 6, 30], [0, 1, 0.35]);
  const cam = camAt(crim ? [[3.62, 950, 1180, 1.55], [5.1, 950, 1200, 1.7]] : [[0, 950, 900, 1.0], [3.6, 950, 1000, 1.2]], t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {!crim ? (
        <>
          <Layer cam={cam} d={0.2}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#1A1230, #6A3E5E 45%, #E7A15E 75%, #FFD891)" }} />
            <div style={{ position: "absolute", left: 950 - 420, top: 700 - 420, width: 840, height: 840, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,246,214,${0.7 + 0.3 * burst}), rgba(255,210,130,0.35) 45%, rgba(255,200,120,0) 70%)` }} />
          </Layer>
          <Layer cam={cam} d={0.4}>
            <GodRays f={f} x={950} y={500} color="#FFE6B0" o={0.22 + 0.25 * burst} n={13} spread={160} />
          </Layer>
          <Layer cam={cam} d={0.8}>
            {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 260 + f * (1 + i * 0.15)) % 2300) - 300, top: 1200 + (i % 3) * 140, width: 900, height: 260, borderRadius: 140, background: "radial-gradient(ellipse, rgba(255,240,222,0.6), rgba(255,240,222,0) 70%)", filter: "blur(10px)" }} />)}
          </Layer>
          <Dust f={f} color="255,236,190" n={50} />
        </>
      ) : (
        <>
          <Layer cam={cam} d={0.2}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#08040A, #2A0E12 55%, #3A1214)" }} />
          </Layer>
          <Layer cam={cam} d={1}>
            <Cross f={f} x={950} y={1680} h={560} rim="#FF5A4A" cloth="#3A1A1A" head={-14} />
          </Layer>
          <AbsoluteFill style={{ background: `rgba(255,30,30,${ip(f - S(3.62), [0, 4, 30], [0.55, 0.25, 0.12])})`, mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", transform: `scale(${pop(f - S(4.24))}) rotate(-6deg)`, opacity: f >= S(4.24) ? 1 : 0 }}>
            <span style={{ display: "inline-block", padding: "10px 34px", border: "8px solid #FF3B3B", borderRadius: 14, fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: 110, color: "#FF3B3B", letterSpacing: 4, textShadow: "0 0 30px rgba(255,59,59,0.6)" }}>CRIMINAL</span>
          </div>
        </>
      )}
      <AbsoluteFill style={{ background: `rgba(255,255,255,${crim ? ip(f - S(3.62), [0, 5], [0.7, 0]) : 0})` }} />
      <Grain f={f} />
      <Vignette s={0.8} />
    </AbsoluteFill>
  );
};

// ---------- 2 · 5,1–27,7 s: el Gólgota (un único mundo, la cámara viaja) ----------
const G0 = 5.1;
const Golgota: React.FC = () => {
  const f = useCurrentFrame();
  const t = G0 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const cam = camAt(
    [
      [5.1, 950, 1250, 0.8], [7.0, 950, 1260, 0.9], // plano general: tres cruces
      [8.39, 950, 1240, 0.96], [8.4, 1300, 1450, 1.9], [12.49, 1300, 1440, 2.0], // el buen ladrón: nunca había orado
      [12.5, 600, 1450, 1.9], [14.79, 600, 1440, 2.0], // el otro ladrón se burla
      [14.8, 1300, 1450, 1.9], [19.89, 1300, 1440, 2.05], // "nosotros merecemos esto"
      [19.9, 1300, 1420, 2.6], [23.29, 1300, 1410, 2.8], // susurro: muy cerca
      [23.3, 950, 1330, 2.2], [24.93, 950, 1320, 2.35], // Jesús lo mira
      [24.94, 1130, 1300, 1.05], [27.7, 1130, 1310, 1.2], // "hoy estarás conmigo": se abre el cielo
    ],
    t,
  );
  const light = ease(ip(ft(24.94), [0, 30], [0, 1]));
  const thunder = [S(7.6), S(12.45)];
  const flash = thunder.reduce((o, k) => Math.max(o, S(t) >= k ? ip(S(t) - k, [0, 2, 10], [0, 0.85, 0]) : 0), 0);
  const quiet = ip(ft(19.9), [0, 10], [0, 1]) * ip(ft(23.3), [0, 10], [1, 0]);
  return (
    <AbsoluteFill style={{ background: "#05060C" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.15}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgb(${10 + 60 * light},${12 + 40 * light},${26 + 30 * light}), rgb(${30 + 150 * light},${22 + 90 * light},${34 + 40 * light}) 55%, rgb(${40 + 180 * light},${26 + 120 * light},${30 + 60 * light}) 80%)` }} />
          <Stars f={f} n={60} h={700} />
          {light > 0 ? <div style={{ position: "absolute", left: 1130 - 500, top: 200, width: 1000, height: 1000, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,240,200,${0.9 * light}), rgba(255,200,120,${0.3 * light}) 45%, rgba(0,0,0,0) 70%)` }} /> : null}
        </Layer>
        <Layer cam={cam} d={0.3}>
          {/* nubes de tormenta que se abren */}
          {Array.from({ length: 10 }, (_, i) => {
            const side = i % 2 ? 1 : -1;
            const open = light * 520 * side;
            return <div key={i} style={{ position: "absolute", left: ((i * 230 + f * (0.8 + i * 0.1)) % 2300) - 300 + open, top: 300 + (i % 4) * 120, width: 760, height: 220, borderRadius: 120, background: `rgba(${30 + 40 * light},${32 + 30 * light},${46 + 20 * light},0.85)`, filter: "blur(16px)" }} />;
          })}
          {light > 0 ? <GodRays f={f} x={1130} y={250} color="#FFE6B0" o={0.38 * light} n={9} spread={60} /> : null}
          <Bolt t={S(t) - thunder[0]} x={360} />
          <Bolt t={S(t) - thunder[1]} x={1600} />
        </Layer>
        <Layer cam={cam} d={0.6}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 1500 Q300 1380 620 1420 Q950 1300 1280 1420 Q1600 1380 1900 1480 L1900 2400 L0 2400 Z" fill={`rgb(${16 + 40 * light},${12 + 26 * light},${14 + 16 * light})`} />
          </svg>
          {/* Jerusalén a lo lejos */}
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0, opacity: 0.6 }}>
            <path d="M0 1460 L120 1460 L120 1400 L260 1400 L260 1440 L380 1440 L380 1360 Q420 1310 460 1360 L460 1450 L1500 1450 L1500 1390 L1600 1390 L1600 1420 L1900 1420 L1900 1500 L0 1500 Z" fill="#0A080C" />
          </svg>
        </Layer>
        <Layer cam={cam} d={1}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M200 2400 Q520 1640 950 1560 Q1380 1640 1700 2400 Z" fill={`rgb(${12 + 50 * light},${9 + 32 * light},${10 + 18 * light})`} />
          </svg>
          <Cross f={f} x={600} y={1700} h={330} rim="#9EB4D8" cloth="#2A2C3A" head={ft(12.5) >= 0 && ft(14.8) < 0 ? 18 : 6} flip />
          <Cross f={f} x={950} y={1610} h={380} rim="#FFE3B0" cloth="#D8D2C4" glow={0.35 + 0.65 * Math.max(light, ft(23.3) >= 0 ? 0.6 : 0)} head={ft(23.3) >= 0 ? 16 : 8} />
          <Cross f={f} x={1300} y={1700} h={330} rim={light > 0 ? "#FFD08A" : "#9EB4D8"} cloth="#5A1C1C" glow={light} head={ft(14.8) >= 0 ? -16 : -6} />
          {light > 0 ? <GodRays f={f} x={1300} y={900} color="#FFE9B8" o={0.35 * light} n={5} spread={36} /> : null}
          {/* soldados y multitud al pie */}
          <Soldier f={f} x={420} y={1980} h={260} torch />
          <Soldier f={f} x={1540} y={1990} h={250} flip />
          <Fog f={f} y={1820} color="150,160,190" o={0.16} />
          {light > 0 ? <Embers f={f} x={1300} y={1400} w={500} n={30} seed="ld" /> : null}
        </Layer>
      </Enter>
      {/* lluvia hasta que se abre el cielo */}
      <div style={{ opacity: 1 - light }}><Rain f={f} n={100} o={0.3} /></div>
      <AbsoluteFill style={{ background: `rgba(220,230,255,${flash})`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.35 * quiet})` }} />
      <Chip x={540} y={1640} t={ft(5.2)} text="clavado a su lado" out={S(2.4)} />
      <Marks f={S(t)} show={S(8.9)} hide={S(12.4)} items={[["orado", S(9.06)], ["obras buenas", S(11.6)]]} />
      <Bubble x={540} y={1080} t={ft(13.2)} text="«¡Sálvate a ti mismo!»" out={S(1.5)} />
      <Bubble x={540} y={1080} t={ft(16.16)} text="«Nosotros merecemos esto»" tail="right" size={44} out={S(1.6)} />
      <Bubble x={540} y={1080} t={ft(17.88)} text="«Él no hizo nada malo»" tail="right" size={46} out={S(1.9)} />
      <Bubble x={540} y={760} t={ft(21.4)} text="«Jesús, acuérdate de mí»" tail="right" size={40} bg="rgba(246,241,231,0.9)" out={S(1.8)} />
      <Big x={540} y={1520} t={ft(25.3)} text="«HOY»" size={170} color="#FFD58A" out={S(2.3)} />
      <Dust f={f} n={30} color={light > 0 ? "255,220,160" : "190,200,230"} />
      <Grain f={f} />
      <Vignette s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- 3 · 27,7–31,95 s: no le pidió méritos, ni tiempo… solo que lo mirara ----------
const Mirada: React.FC = () => {
  const f = useCurrentFrame();
  const t = 27.7 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const beam = ip(ft(31.04), [0, 12], [0, 1]);
  const cam = camAt([[27.7, 950, 1250, 1.2], [31.0, 950, 1260, 1.3], [31.95, 950, 1260, 1.38]], t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.2}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#2A1C30, #8A4A4E 50%, #E39A5E)" }} />
        </Layer>
        <Layer cam={cam} d={1}>
          <Figure f={f} x={720} y={1720} h={620} rim="#FFE3B0" rimSide={-1} cloth="#D8D2C4" hood={false} glow={0.6 + 0.4 * beam} head={10} flip />
          <Figure f={f} x={1180} y={1720} h={600} rim="#FFD08A" rimSide={1} cloth="#5A1C1C" hood={false} glow={beam} head={-10} />
          {beam > 0 ? (
            <svg width={1900} height={2400} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
              <defs>
                <linearGradient id="mira" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#FFE9C0" stopOpacity={0.85 * beam} />
                  <stop offset="1" stopColor="#FFE9C0" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <path d="M760 1150 L1140 1130 L1140 1190 L760 1170 Z" fill="url(#mira)" />
            </svg>
          ) : null}
        </Layer>
      </Enter>
      <Marks f={S(t)} show={S(28.2)} hide={S(30.9)} items={[["méritos", S(28.38)], ["tiempo", S(29.84)]]} />
      <Big x={540} y={1500} t={ft(31.04)} text="solo una mirada" size={96} color="#FFD58A" />
      <Dust f={f} color="255,220,170" />
      <Grain f={f} />
      <Vignette s={0.75} />
    </AbsoluteFill>
  );
};

// ---------- 4 · 31,95–37,6 s: ¿tarde? → llegó a tiempo ----------
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const t = 31.95 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const dawn = ease(ip(ft(34.78), [0, 40], [0, 1]));
  const cam = camAt([[31.95, 950, 1300, 1.25], [34.7, 950, 1280, 1.12], [37.6, 950, 1200, 0.95]], t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.2}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgb(${8 + 40 * dawn},${8 + 30 * dawn},${18 + 50 * dawn}), rgb(${14 + 170 * dawn},${12 + 90 * dawn},${22 + 60 * dawn}) 60%, rgb(${20 + 235 * dawn},${16 + 170 * dawn},${26 + 90 * dawn}) 80%)` }} />
          <div style={{ position: "absolute", left: 950 - 300, top: 1520 - 300 - 160 * dawn, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,243,207,${dawn}), rgba(255,196,107,${0.6 * dawn}) 55%, rgba(0,0,0,0) 72%)` }} />
        </Layer>
        <Layer cam={cam} d={0.4}>
          {dawn > 0 ? <GodRays f={f} x={950} y={1360} color="#FFD08A" o={0.25 * dawn} n={11} spread={140} /> : null}
          <Stars f={f} n={60} h={900} />
        </Layer>
        <Layer cam={cam} d={1}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 1560 Q950 1460 1900 1560 L1900 2400 L0 2400 Z" fill="#0B070C" />
            {[[640, 1520, 0.8], [950, 1470, 1], [1260, 1520, 0.8]].map(([x, y, s], i) => (
              <g key={i} fill="#0B070C">
                <rect x={x - 9 * s} y={y - 300 * s} width={18 * s} height={300 * s} />
                <rect x={x - 90 * s} y={y - 230 * s} width={180 * s} height={16 * s} />
              </g>
            ))}
          </svg>
        </Layer>
      </Enter>
      {/* reloj que se detiene */}
      {ft(33.76) >= 0 && dawn < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 760, transform: `translate(-50%,-50%) scale(${pop(ft(33.76))})`, opacity: 1 - dawn }}>
          <svg width={260} height={260} viewBox="0 0 260 260">
            <circle cx={130} cy={130} r={118} fill="rgba(8,10,16,0.75)" stroke="#fff" strokeWidth={8} />
            <line x1={130} y1={130} x2={130} y2={40} stroke="#FF3B3B" strokeWidth={10} strokeLinecap="round" transform={`rotate(${Math.min(354, ft(33.76) * 30)} 130 130)`} />
            <line x1={130} y1={130} x2={190} y2={130} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
      <Big x={540} y={700} t={ft(35.76)} text="llegó a tiempo" size={110} color="#FFD58A" />
      <Dust f={f} color="255,220,170" />
      <Grain f={f} />
      <Vignette s={0.75} />
    </AbsoluteFill>
  );
};

// efectos: solo al abrir un bloque o antes de un giro (≈2 por cada 10 s)
const SFX: [number, string, number][] = [
  [0.0, "whoosh", 0.15], [3.55, "impact", 0.32], [5.05, "whoosh", 0.16], [12.4, "whoosh", 0.14],
  [23.2, "shimmer", 0.24], [27.65, "whoosh", 0.15], [31.9, "drop", 0.2], [34.7, "shimmer", 0.26],
];
const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t))} durationInFrames={45}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

export const Ladron: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "brightness(1.15) contrast(1.12) saturate(1.12)" }}>
        <Sequence from={0} durationInFrames={S(5.1)}><Gancho /></Sequence>
        <Sequence from={S(5.1)} durationInFrames={S(27.7) - S(5.1)}><Golgota /></Sequence>
        <Sequence from={S(27.7)} durationInFrames={S(31.95) - S(27.7)}><Mirada /></Sequence>
        <Sequence from={S(31.95)} durationInFrames={LADRON_TOTAL - S(31.95)}><Final /></Sequence>
      </AbsoluteFill>
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("ladron/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
