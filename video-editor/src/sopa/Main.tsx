import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BACK, DISPLAY, INK, INOUT, SANS, alpha, ip, mix } from "../ee46f/theme";
import captions from "../../public/sopa/captions.json";

// Edición "sopa": fragmentos de 3 s de varios edits, revueltos al ritmo de la narración
const FPS = 30;
const FRAG = 90;
const COLORS = ["#E8383E", "#2B5B7E", "#ECEAE3", "#35339A", "#2C7411"];

// [archivo, segundo de inicio en el edit, sección 0–4 de la narración]
const FRAGS: [string, number, number][] = [
  ["kaneki", 14.7, 0], ["yuji", 13.5, 0], ["kaneki", 20.0, 0], ["yuji", 23.9, 0], ["kaneki", 27.0, 0],
  ["kakashi", 16.3, 1], ["itachi", 24.5, 1], ["kakashi", 21.1, 1], ["itachi", 28.9, 1], ["kakashi", 25.1, 1],
  ["obito", 30.0, 2], ["itachi", 35.3, 2], ["obito", 36.5, 2], ["itachi", 40.9, 2], ["obito", 44.0, 2],
  ["naruto", 45.1, 3], ["thorfinn", 42.9, 3], ["naruto", 53.1, 3], ["thorfinn", 51.6, 3], ["naruto", 59.9, 3],
  ["ippo3", 10.2, 4], ["ippo3", 17.3, 4], ["ippo2", 22.0, 4], ["thorfinn", 72.0, 4], ["obito", 88.0, 4],
];
export const TOTAL = 2241;

const Frag: React.FC<{ src: string; start: number; sec: number; i: number; dur: number }> = ({ src, start, sec, i, dur }) => {
  const f = useCurrentFrame();
  const color = COLORS[sec];
  const zoom = interpolate(f, [0, dur], i % 2 ? [1.0, 1.1] : [1.1, 1.0]);
  const flash = ip(f, [0, 3, 9], [0.4, 0.22, 0]);
  const shake = f < 4 ? Math.sin(f * 2.3 + i) * 14 * (1 - f / 4) : 0;
  return (
    <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
      {/* encuadre a pantalla completa 9:16: el clip llena todo el cuadro, recortando los lados */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px) scale(${zoom})` }}>
        <Video src={staticFile(`sopa/${src}.mp4`)} trimBefore={Math.round(start * FPS)} muted style={{ position: "absolute", left: -1167, top: 0, width: 3414, height: 1920 }} />
      </AbsoluteFill>
      {/* destello de color al entrar cada fragmento */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${alpha(color, 0.9)}, ${alpha(color, 0.2)} 70%)`, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

type Cap = { t0: number; t1: number; words: { text: string; t: number }[]; key: number; tone: string };

// Subtítulos dinámicos: contexto que se enciende palabra por palabra y una palabra clave grande en su tono
const Caption: React.FC<{ cap: Cap; from: number; dur: number }> = ({ cap, from, dur }) => {
  const f = useCurrentFrame();
  const o = ip(f, [0, 4, dur - 5, dur], [0, 1, 1, 0]);
  const at = (t: number) => Math.round(t * FPS) - from;
  const kw = cap.words[cap.key];
  const kAt = at(kw.t);
  const kScale = ip(f, [kAt - 2, kAt + 8], [1.22, 1], BACK);
  const sweep = ip(f, [kAt + 4, kAt + 22], [-30, 130], INOUT);
  const ctx = cap.words.filter((_, k) => k !== cap.key);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", opacity: o }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, lineHeight: 1.2, letterSpacing: -0.8, color: INK, textAlign: "center", textShadow: "0 2px 18px rgba(0,0,0,0.75)" }}>
        {ctx.map((w, k) => (
          <span key={k} style={{ display: "inline-block", marginRight: "0.26em", opacity: f < at(w.t) - 4 ? 0.3 : ip(f, [at(w.t) - 4, at(w.t) + 2], [0.3, 1]) }}>
            {w.text}
          </span>
        ))}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: Math.max(104, Math.min(136, 900 / (kw.text.length * 0.62))),
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          marginTop: 14,
          backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%), linear-gradient(180deg, #FFFFFF 0%, ${mix("#ffffff", cap.tone, 0.45)} 38%, ${cap.tone} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          scale: `${kScale}`,
          filter: `drop-shadow(0 0 22px ${alpha(cap.tone, 0.5)}) drop-shadow(0 6px 16px rgba(0,0,0,0.6))`,
        }}
      >
        {kw.text}
      </div>
    </AbsoluteFill>
  );
};

export const Sopa: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
      {FRAGS.map(([src, start, sec], i) => {
        const from = i * FRAG;
        const dur = i === FRAGS.length - 1 ? TOTAL - from : FRAG;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Frag src={src} start={start} sec={sec} i={i} dur={dur} />
          </Sequence>
        );
      })}
      {captions.map((c, k) => {
        const from = Math.round(c.t0 * FPS);
        const next = captions[k + 1] ? Math.round(captions[k + 1].t0 * FPS) : TOTAL;
        const dur = Math.min(next - from, Math.max(10, Math.round((c.t1 - c.t0) * FPS) + 4));
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <Caption cap={c as Cap} from={from} dur={dur} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("sopa/narracion.mp3")} />
    </AbsoluteFill>
  );
};
