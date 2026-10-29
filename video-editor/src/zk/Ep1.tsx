import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DISPLAY, ip } from "../ee46f/theme";

// ZK · Episodio 1 — "Tu fuerza no sale del brazo" (18 s, 9:16, 30 fps)
const RED = "#FF2A2A";
export const EP1_TOTAL = 540;
const BEAT = (k: number) => Math.round((0.0 + 0.58 * k) * 30);

const Caption: React.FC<{ text: string; kw?: string; at: number; end: number; y?: number }> = ({ text, kw, at, end, y = 1180 }) => {
  const f = useCurrentFrame();
  if (f < at || f >= end) return null;
  const t = f - at;
  const o = ip(t, [0, 4], [0, 1]) * ip(f, [end - 5, end], [1, 0]);
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", top: y, left: 40, right: 40, textAlign: "center", fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 900, fontSize: 96, letterSpacing: -2, color: "#fff", opacity: o, scale: ip(t, [0, 4], [1.25, 1]), textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>
      {words.map((w, i) => (
        <span key={i} style={{ color: kw && w.toUpperCase() === kw.toUpperCase() ? RED : "#fff" }}>{i ? " " : ""}{w}</span>
      ))}
    </div>
  );
};

// Plano de ZK: fotogramas renderizados (cadena iluminada), con zoom de impacto
const ZKShot: React.FC<{ from: number; to: number; frames: number; start: number; speed?: number }> = ({ from, to, frames, start, speed = 1 }) => {
  const f = useCurrentFrame();
  const local = (f - from) * speed + start;
  const idx = Math.max(0, Math.min(frames - 1, Math.round(local)));
  const t = f - from;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#050506" }}>
      <Img src={staticFile(`zk/frames/${String(idx).padStart(3, "0")}.png`)} style={{ width: 1080, height: 1920, objectFit: "cover", scale: ip(t, [0, 8], [1.06, 1]) }} />
    </AbsoluteFill>
  );
};

// Plano del peleador real (movimiento copiado de un video)
const RealShot: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const t = f - from;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Video src={staticFile("zk/peleador_jab.mp4")} muted style={{ width: 1080, height: 1920, objectFit: "cover", scale: ip(t, [0, 12], [1.04, 1.0]) }} />
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ f: number; cuts: number[] }> = ({ f, cuts }) => {
  let o = 0;
  for (const c of cuts) if (f >= c) o = Math.max(o, ip(f - c, [0, 5], [0.5, 0]));
  return <AbsoluteFill style={{ background: `rgba(255,40,30,${o})`, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

export const Ep1: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [BEAT(0), BEAT(4), BEAT(8), BEAT(12), BEAT(16), BEAT(20), BEAT(24)];
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {/* 0–2 s: ZK en guardia (gancho en el primer segundo) */}
      <Sequence from={0} durationInFrames={60}>
        <ZKShot from={0} to={60} frames={36} start={0} speed={0.5} />
      </Sequence>
      {/* 2–5 s: la cadena se ilumina */}
      <Sequence from={60} durationInFrames={90}>
        <ZKShot from={60} to={150} frames={36} start={18} speed={0.4} />
      </Sequence>
      {/* 5–8 s: peleador real, giro de cadera del jab */}
      <Sequence from={150} durationInFrames={90}>
        <RealShot from={150} to={240} />
      </Sequence>
      {/* 8–11 s: cadena completa, primer plano del puño */}
      <Sequence from={240} durationInFrames={90}>
        <ZKShot from={240} to={330} frames={36} start={26} speed={0.4} />
      </Sequence>
      {/* 11–14 s: ejercicio con banda (mismo modelo, plano fijo) */}
      <Sequence from={330} durationInFrames={90}>
        <ZKShot from={330} to={420} frames={36} start={0} speed={0} />
      </Sequence>
      {/* 14–17 s: cierre con destello */}
      <Sequence from={420} durationInFrames={90}>
        <ZKShot from={420} to={510} frames={36} start={34} speed={0.15} />
      </Sequence>
      <Flash f={f} cuts={cuts} />

      <Caption text="Tu golpe no sale del brazo" kw="brazo" at={0} end={60} y={300} />
      <Caption text="Sale de los pies" kw="pies" at={60} end={150} />
      <Caption text="Y de la cadera" kw="cadera" at={150} end={240} />
      <Caption text="Si el brazo empuja solo, pierdes fuerza" kw="solo" at={240} end={330} />
      <Caption text="Entrena la cadena, no el brazo" kw="cadena" at={330} end={420} />
      <Caption text="Mañana: el músculo que evita el KO" kw="KO" at={420} end={510} />
      <Caption text="ZK" at={510} end={540} y={900} />

      <Audio src={staticFile("pelea/musica_zk_ep1.wav")} />
    </AbsoluteFill>
  );
};
