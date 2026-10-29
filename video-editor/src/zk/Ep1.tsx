import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { DISPLAY, ip } from "../ee46f/theme";

// ZK · Episodio 1 — "Tu fuerza no sale del brazo". 18 s, todo con ZK en movimiento (captura de movimiento real)
const RED = "#FF2A2A";
export const EP1_TOTAL = 540;
const b = (k: number) => Math.round(17.4 * k); // bombo de la canción: uno cada 0,58 s desde el inicio

type Shot = {
  from: number;
  to: number;
  src: "frente" | "lenta" | "mal" | "orbita";
  n: number; // fotogramas renderizados de la toma
  start: number;
  speed: number;
  reverse?: boolean;
  impacts?: number[]; // fotogramas de la toma donde impacta el golpe
  gray?: boolean;
};
const N = { frente: 78, lenta: 78, mal: 25, orbita: 78 } as const;
const IMP = { frente: [5, 12, 23, 40, 67, 73], lenta: [42], mal: [13], orbita: [5, 12, 23, 40, 67, 73] };
const SHOTS: Shot[] = [
  { from: 0, to: b(3), src: "frente", n: N.frente, start: 0, speed: 1, impacts: IMP.frente },
  { from: b(3), to: b(8), src: "lenta", n: N.lenta, start: 0, speed: 0.9, impacts: IMP.lenta },
  { from: b(8), to: b(11), src: "mal", n: N.mal, start: 0, speed: 0.5, impacts: IMP.mal, gray: true },
  { from: b(11), to: b(14), src: "lenta", n: N.lenta, start: 14, speed: 0.95, impacts: IMP.lenta },
  { from: b(14), to: b(21), src: "orbita", n: N.orbita, start: 0, speed: 0.64, impacts: IMP.orbita },
  // montaje al ritmo: un corte por golpe de bombo
  { from: b(21), to: b(22), src: "frente", n: N.frente, start: 34, speed: 1, impacts: IMP.frente },
  { from: b(22), to: b(23), src: "orbita", n: N.orbita, start: 60, speed: 1, impacts: IMP.orbita },
  { from: b(23), to: b(24), src: "lenta", n: N.lenta, start: 30, speed: 1, impacts: IMP.lenta },
  { from: b(24), to: b(25), src: "frente", n: N.frente, start: 58, speed: 1, impacts: IMP.frente },
  { from: b(25), to: b(26), src: "orbita", n: N.orbita, start: 20, speed: 1, impacts: IMP.orbita },
  { from: b(26), to: b(27), src: "frente", n: N.frente, start: 62, speed: 1, impacts: IMP.frente },
  { from: b(27), to: EP1_TOTAL, src: "orbita", n: N.orbita, start: 77, speed: 0.7, reverse: true },
];

const local = (s: Shot, f: number) => {
  const i = s.reverse ? s.start - (f - s.from) * s.speed : s.start + (f - s.from) * s.speed;
  return Math.max(0, Math.min(s.n - 1, Math.round(i)));
};
// fotograma del video en que cae cada impacto de una toma
const impactsOf = (s: Shot) =>
  (s.impacts ?? [])
    .map((i) => s.from + (s.reverse ? (s.start - i) / s.speed : (i - s.start) / s.speed))
    .filter((v) => v >= s.from && v < s.to)
    .map(Math.round);
const ALL_IMPACTS = SHOTS.flatMap(impactsOf);

const Plate: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const near = impactsOf(s).map((i) => f - i).filter((k) => k >= 0 && k < 12);
  const k = near.length ? Math.min(...near) : 99;
  const punch = k < 12 ? 1 + 0.08 * Math.exp(-k * 0.35) : 1;
  const shake = k < 8 ? (random(`s${s.from}${k}`) - 0.5) * 22 * Math.exp(-k * 0.4) : 0;
  const enter = ip(t, [0, 6], [1.07, 1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={staticFile(`zk/ep1/${s.src}/${String(local(s, f)).padStart(4, "0")}.png`)}
        style={{
          width: 1080,
          height: 1920,
          objectFit: "cover",
          scale: punch * enter,
          translate: `${shake}px ${-shake * 0.6}px`,
          filter: s.gray ? "grayscale(1) brightness(0.75) contrast(1.1)" : undefined,
        }}
      />
    </AbsoluteFill>
  );
};

const Embers: React.FC<{ f: number; boost: number }> = ({ f, boost }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: 50 }, (_, i) => {
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

// texto grande: entra con golpe de escala y desenfoque; la palabra clave en rojo
const T: React.FC<{ f: number; at: number; end: number; y: number; size: number; text: string; kw?: string }> = ({ f, at, end, y, size, text, kw }) => {
  if (f < at || f >= end) return null;
  const t = f - at;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 30,
        right: 30,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -2,
        color: "#fff",
        scale: ip(t, [0, 5], [1.45, 1]),
        opacity: ip(t, [0, 3], [0, 1]) * ip(f, [end - 4, end], [1, 0]),
        filter: `blur(${ip(t, [0, 4], [10, 0])}px)`,
        textShadow: "0 8px 34px rgba(0,0,0,0.9)",
      }}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ color: kw && w.replace(/[^\wÁÉÍÓÚÑáéíóúñ]/g, "") === kw ? RED : "#fff", textShadow: kw && w.replace(/[^\wÁÉÍÓÚÑáéíóúñ]/g, "") === kw ? `0 0 40px ${RED}, 0 8px 34px rgba(0,0,0,0.9)` : undefined }}>
          {i ? " " : ""}
          {w}
        </span>
      ))}
    </div>
  );
};

const Mark: React.FC<{ f: number; at: number; end: number; ok: boolean }> = ({ f, at, end, ok }) => {
  if (f < at || f >= end) return null;
  const t = f - at;
  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: 220,
        color: ok ? "#3BFF7A" : RED,
        scale: ip(t, [0, 6], [2, 1]),
        opacity: ip(t, [0, 3], [0, 1]) * ip(f, [end - 4, end], [1, 0]),
        textShadow: `0 0 60px ${ok ? "#3BFF7A" : RED}`,
      }}
    >
      {ok ? "✓" : "✗"}
    </div>
  );
};

const Flash: React.FC<{ f: number }> = ({ f }) => {
  let o = 0;
  for (const s of SHOTS) if (s.from > 0 && f >= s.from) o = Math.max(o, ip(f - s.from, [0, 5], [0.45, 0]));
  for (const i of ALL_IMPACTS) if (f >= i) o = Math.max(o, ip(f - i, [0, 4], [0.7, 0]));
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, rgba(255,255,255,${o}), rgba(255,40,30,${o * 0.8}) 60%, rgba(120,0,0,${o * 0.6}))`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const Sfx: React.FC<{ at: number; name: string; v: number }> = ({ at, name, v }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={40}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

export const Ep1: React.FC = () => {
  const f = useCurrentFrame();
  const s = SHOTS.find((x) => f >= x.from && f < x.to) ?? SHOTS[SHOTS.length - 1];
  const nearImpact = ALL_IMPACTS.some((i) => f >= i && f < i + 8);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Plate s={s} f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(40,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)" }} />
      <Embers f={f} boost={nearImpact ? 1 : 0.45} />
      <Flash f={f} />

      {/* etiqueta de la serie */}
      <div style={{ position: "absolute", top: 150, left: 64, display: "flex", alignItems: "center", gap: 16, opacity: ip(f, [0, 8], [0, 1]) }}>
        <div style={{ width: 12, height: 54, background: RED, boxShadow: `0 0 24px ${RED}` }} />
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 2 }}>ZK · EP. 01</div>
      </div>

      {/* gancho */}
      <T f={f} at={0} end={b(1.4)} y={1380} size={130} text="TU GOLPE" />
      <T f={f} at={b(1.4)} end={b(3)} y={1330} size={120} text="NO SALE DEL BRAZO" kw="BRAZO" />
      {/* la onda sube por el cuerpo */}
      <T f={f} at={b(3) + 6} end={b(4.5)} y={1420} size={120} text="SALE DEL PIE" kw="PIE" />
      <T f={f} at={b(4.5)} end={b(6)} y={1420} size={110} text="GIRA LA CADERA" kw="CADERA" />
      <T f={f} at={b(6)} end={b(8)} y={1360} size={120} text="EXPLOTA EN EL PUÑO" kw="PUÑO" />
      {/* mal / bien */}
      <Mark f={f} at={b(8)} end={b(11)} ok={false} />
      <T f={f} at={b(8)} end={b(11)} y={1420} size={120} text="SOLO BRAZO" kw="BRAZO" />
      <T f={f} at={b(9.2)} end={b(11)} y={1560} size={70} text="= sin fuerza" />
      <Mark f={f} at={b(11)} end={b(14)} ok />
      <T f={f} at={b(11)} end={b(14)} y={1420} size={110} text="TODO EL CUERPO" kw="CUERPO" />
      <T f={f} at={b(12.2)} end={b(14)} y={1560} size={80} text="= KO" kw="KO" />
      {/* cómo entrenarlo */}
      <T f={f} at={b(14)} end={b(16.5)} y={1400} size={120} text="ENTRÉNALO ASÍ" kw="ASÍ" />
      <T f={f} at={b(16.5)} end={b(19)} y={1380} size={100} text="SOMBRA GIRANDO LA CADERA" kw="CADERA" />
      <T f={f} at={b(19)} end={b(21)} y={1420} size={130} text="3 × 1 MIN" kw="MIN" />
      {/* cierre */}
      <T f={f} at={b(27)} end={b(28.5)} y={1360} size={110} text="MAÑANA:" kw="MAÑANA" />
      <T f={f} at={b(28.5)} end={EP1_TOTAL} y={1300} size={100} text="EL MÚSCULO QUE EVITA EL KO" kw="KO" />

      <Audio src={staticFile("pelea/musica_zk_ep1.wav")} />
      {ALL_IMPACTS.map((i, k) => (
        <React.Fragment key={k}>
          <Sfx at={i - 6} name="whoosh" v={0.2} />
          <Sfx at={i} name="impact" v={0.3} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
