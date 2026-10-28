import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { DISPLAY, ip } from "../ee46f/theme";

// "Estilos de combate": el maniquí 3D (render de Blender) cortado al ritmo de la música
const RED = "#FF2A2A";
// la canción entra en el segundo 5: drop a 2,15 s; bombo desde 4,46 s, uno cada 0,577 s
export const BEAT = (k: number) => Math.round((4.46 + 0.577 * k) * 30);
export const TOTAL = 450;

type Shot = {
  from: number;
  to: number;
  src: string; // carpeta de fotogramas
  frames: number; // fotogramas de la toma
  start?: number; // primer fotograma de la toma que se usa
  speed?: number; // 1 normal, < 1 cámara lenta
  reverse?: boolean;
  label?: string;
  tag?: string; // BOXEO / MMA y número
  impact?: number; // fotograma local del impacto
};
const B = BEAT;
const SHOTS: Shot[] = [
  { from: 0, to: 64, src: "intro_orbit", frames: 64 },
  // previa del drop: cortes secos sobre los golpes de la canción
  { from: 64, to: 77, src: "uppercut", frames: 35, start: 0, speed: 0 },
  { from: 77, to: 90, src: "patada_alta", frames: 35, start: 0, speed: 0 },
  { from: 90, to: B(0), src: "directo", frames: 35, start: 0, speed: 0 },
  { from: B(0), to: B(2), src: "jab", frames: 35, label: "JAB", tag: "BOXEO · 01", impact: 17 },
  { from: B(2), to: B(4), src: "directo", frames: 35, label: "DIRECTO", tag: "BOXEO · 02", impact: 17 },
  { from: B(4), to: B(6), src: "gancho", frames: 35, label: "GANCHO", tag: "BOXEO · 03", impact: 17 },
  { from: B(6), to: B(8), src: "uppercut", frames: 35, label: "UPPERCUT", tag: "BOXEO · 04", impact: 17 },
  { from: B(8), to: B(9), src: "rodillazo", frames: 35, start: 0, speed: 0 },
  { from: B(9), to: B(11), src: "patada_alta", frames: 35, label: "PATADA LATERAL", tag: "MMA · 01", impact: 17 },
  { from: B(11), to: B(13), src: "rodillazo", frames: 35, label: "RODILLAZO", tag: "MMA · 02", impact: 17 },
  { from: B(13), to: B(15), src: "patada_frontal", frames: 35, label: "PATADA FRONTAL", tag: "MMA · 03", impact: 17 },
  { from: B(15), to: TOTAL, src: "intro_orbit", frames: 64, start: 63, speed: 1, reverse: true },
];
// golpes de bombo previos (2,15 · 2,58 · 3,01 · 3,59 s)
const PRE = [64, 77, 90, 108];

const frameFor = (s: Shot, f: number) => {
  const local = (f - s.from) * (s.speed ?? 1);
  const start = s.start ?? 0;
  const i = Math.round(s.reverse ? start - local : start + local);
  return Math.max(0, Math.min(s.frames - 1, i));
};
const src = (dir: string, i: number) => staticFile(`pelea/frames/${dir}/${String(i).padStart(4, "0")}.png`);

const Plate: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const local = f - s.from;
  const imp = s.impact !== undefined ? (s.speed ? (s.impact - (s.start ?? 0)) / s.speed : s.impact) : -99;
  const k = local - imp;
  // golpe de zoom al impacto y entrada con zoom en cada corte
  const punch = k >= 0 && k < 12 ? 1 + 0.07 * Math.exp(-k * 0.35) : 1;
  const enter = ip(local, [0, 6], [1.06, 1]);
  const still = s.speed === 0 ? 1 + local * 0.004 : 1;
  const shake = k >= 0 && k < 8 ? (random(`sx${s.from}${k}`) - 0.5) * 18 * Math.exp(-k * 0.4) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={src(s.src, frameFor(s, f))}
        style={{ width: 1080, height: 1920, objectFit: "cover", scale: punch * enter * still, translate: `${shake}px ${-shake * 0.6}px` }}
      />
    </AbsoluteFill>
  );
};

// brasas rojas que suben, como en la estética de la canción
const Embers: React.FC<{ f: number; boost: number }> = ({ f, boost }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: 46 }, (_, i) => {
      const sp = 2 + random(`e${i}`) * 5;
      const x = random(`x${i}`) * 1080 + Math.sin((f + i * 40) / 35) * 30;
      const y = 1950 - ((f * sp + random(`y${i}`) * 2000) % 2100);
      const s = 2 + random(`s${i}`) * 5;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: s,
            height: s * (2 + boost * 3),
            borderRadius: 99,
            background: "#FF5A3A",
            opacity: (0.35 + 0.5 * random(`o${i}`)) * (0.5 + boost),
            boxShadow: `0 0 ${10 + s * 3}px #FF2A1A`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const Title: React.FC<{ text: string; f: number; at: number; y: number; size: number; color?: string }> = ({ text, f, at, y, size, color = "#fff" }) => {
  const t = f - at;
  if (t < 0) return null;
  const s = ip(t, [0, 5], [1.5, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -2,
        color,
        scale: s,
        opacity: ip(t, [0, 3], [0, 1]),
        filter: `blur(${ip(t, [0, 4], [10, 0])}px)`,
        textShadow: color === "#fff" ? "0 6px 30px rgba(0,0,0,0.85)" : `0 0 40px ${RED}, 0 6px 30px rgba(0,0,0,0.85)`,
      }}
    >
      {text}
    </div>
  );
};

const MoveLabel: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const out = ip(f, [s.to - 4, s.to], [1, 0]);
  return (
    <>
      {s.tag ? (
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 70,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: ip(t, [0, 4], [0, 1]) * out,
            translate: `${ip(t, [0, 6], [-40, 0])}px 0`,
          }}
        >
          <div style={{ width: 12, height: 54, background: RED, boxShadow: `0 0 24px ${RED}` }} />
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: 2 }}>{s.tag}</div>
        </div>
      ) : null}
      {s.label ? (
        <div
          style={{
            position: "absolute",
            top: 1420,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: DISPLAY,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: s.label.length > 12 ? 96 : s.label.length > 10 ? 108 : 150,
            letterSpacing: -3,
            color: "#fff",
            opacity: out,
            scale: ip(t, [0, 4], [1.35, 1]),
            filter: `blur(${ip(t, [0, 3], [8, 0])}px)`,
            textShadow: "0 8px 34px rgba(0,0,0,0.9)",
          }}
        >
          {s.label.split(" ").map((w, i) => (
            <span key={i} style={{ color: i === s.label!.split(" ").length - 1 && s.label!.includes(" ") ? RED : "#fff" }}>
              {i ? " " : ""}
              {w}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
};

// destello en cada corte e impacto
const Flash: React.FC<{ f: number }> = ({ f }) => {
  let o = 0;
  for (const s of SHOTS) {
    if (s.from > 0 && f >= s.from) o = Math.max(o, ip(f - s.from, [0, 5], [0.55, 0]));
    if (s.impact !== undefined) {
      const imp = s.from + (s.speed ? (s.impact - (s.start ?? 0)) / s.speed : s.impact);
      if (f >= imp) o = Math.max(o, ip(f - imp, [0, 4], [0.75, 0]));
    }
  }
  for (const p of PRE) if (f >= p) o = Math.max(o, ip(f - p, [0, 6], [0.8, 0]));
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(255,255,255,${o}), rgba(255,40,30,${o * 0.8}) 60%, rgba(120,0,0,${o * 0.6}))`, mixBlendMode: "screen" }} />;
};

const Sfx: React.FC<{ at: number; name: string; v: number }> = ({ at, name, v }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={40}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

export const Pelea: React.FC = () => {
  const f = useCurrentFrame();
  const s = SHOTS.find((x) => f >= x.from && f < x.to) ?? SHOTS[SHOTS.length - 1];
  const drop = f >= 64;
  const impacts = SHOTS.filter((x) => x.impact !== undefined).map((x) => Math.round(x.from + (x.speed ? (x.impact! - (x.start ?? 0)) / x.speed : x.impact!)));
  const nearImpact = impacts.some((i) => f >= i && f < i + 8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Plate s={s} f={f} />
      {/* gradación: negro profundo y viñeta roja */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(40,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)" }} />
      <AbsoluteFill style={{ background: `rgba(255,30,20,${drop ? 0.06 : 0.03})`, mixBlendMode: "overlay" }} />
      <Embers f={f} boost={drop ? (nearImpact ? 1 : 0.5) : 0.15} />
      <Flash f={f} />

      {/* intro */}
      {f < 64 ? (
        <>
          <Title text="BOXEO" f={f} at={4} y={1330} size={150} />
          <Title text="vs" f={f} at={20} y={1480} size={70} />
          <Title text="MMA" f={f} at={34} y={1550} size={170} color={RED} />
        </>
      ) : null}
      {f >= 90 && f < B(0) ? <Title text="BOXEO" f={f} at={108} y={820} size={210} /> : null}
      {f >= 90 && f < 108 ? <Title text="ROUND 1" f={f} at={90} y={860} size={140} color={RED} /> : null}
      {f >= B(8) && f < B(9) ? <Title text="MMA" f={f} at={B(8)} y={800} size={260} color={RED} /> : null}
      {f >= B(15) ? (
        <>
          <Title text="¿BOXEO" f={f} at={B(15)} y={1290} size={140} />
          <Title text="o MMA?" f={f} at={B(16)} y={1430} size={140} color={RED} />
          <Title text="comenta tu estilo" f={f} at={B(17)} y={1620} size={70} />
        </>
      ) : null}
      <MoveLabel s={s} f={f} />

      <Audio src={staticFile("pelea/musica.wav")} />
      {impacts.map((i, k) => (
        <React.Fragment key={k}>
          <Sfx at={i - 6} name="whoosh" v={0.22} />
          <Sfx at={i} name="impact" v={0.32} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
