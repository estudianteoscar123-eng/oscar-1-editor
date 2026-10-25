import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BACK, INK, INOUT, SANS, ip } from "../ee46f/theme";
import plan from "../../public/frankl/plan.json";

const FPS = 30;
// ¿El cuadro es tu cara o una imagen de apoyo? (en tu cara, el texto va debajo del mentón)
const onHead = (frame: number) => !P.imgs.some((m) => frame >= m.t * FPS && frame < (m.t + m.d) * FPS);
const HEAD_SHIFT = 520;
const RED = "#E8383E";
type W = { text: string; t: number; tend: number };
type Cap = { t0: number; t1: number; words: W[]; key: number };
const P = plan as unknown as { total: number; caps: Cap[]; cards: { t: number; text: string }[]; imgs: { src: string; t: number; d: number }[] };

// Tu cara a pantalla completa, con un empuje lento y oscurecimiento inferior para el texto
const Head: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, P.total * FPS], [1.0, 1.05]);
  return (
    <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 40%" }}>
        <Video src={staticFile("frankl/cut.mp4")} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,11,0) 55%, rgba(7,8,11,0.6) 80%, rgba(7,8,11,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

// Imagen de apoyo con movimiento lento y fundidos
const Still: React.FC<{ src: string; d: number }> = ({ src, d }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, d * FPS], [1.0, 1.12]);
  const o = ip(f, [0, 6, d * FPS - 6, d * FPS], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        <Img src={staticFile(`frankl/${src}.jpg`)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,11,0.25) 0%, rgba(7,8,11,0) 40%, rgba(7,8,11,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// Tarjeta roja con la palabra clave en un golpe
const Card: React.FC<{ text: string; y: number }> = ({ text, y }) => {
  const f = useCurrentFrame();
  const sc = ip(f, [0, 6], [1.25, 1], BACK);
  const o = ip(f, [0, 3, 16, 20], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, translate: `0px ${y}px` }}>
      <div style={{ background: RED, padding: "26px 50px", borderRadius: 18, transform: `scale(${sc}) rotate(-2deg)`, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 150, color: "#FFFFFF", letterSpacing: -2, lineHeight: 1 }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

// Subtítulo: contexto palabra por palabra, palabra clave en caja roja
const Caption: React.FC<{ cap: Cap; from: number; dur: number; hideAt: number[] }> = ({ cap, from, dur, hideAt }) => {
  const f = useCurrentFrame();
  const at = (t: number) => Math.round(t * FPS) - from;
  const hidden = hideAt.some((h) => from + f >= h && from + f < h + 20);
  const o = hidden ? 0 : ip(f, [0, 4, dur - 5, dur], [0, 1, 1, 0]);
  const kw = cap.words[cap.key];
  const kAt = at(kw.t);
  const kSc = ip(f, [kAt - 2, kAt + 8], [1.18, 1], BACK);
  const ctx = cap.words.filter((_, k) => k !== cap.key);
  const size = Math.max(60, Math.min(96, 880 / (kw.text.length * 0.66)));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", opacity: o, translate: `0px ${onHead(from + 5) ? HEAD_SHIFT : 0}px` }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 60, lineHeight: 1.2, color: INK, textAlign: "center", textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>
        {ctx.map((w, k) => (
          <span key={k} style={{ display: "inline-block", marginRight: "0.26em", opacity: f < at(w.t) - 3 ? 0.25 : ip(f, [at(w.t) - 3, at(w.t) + 2], [0.25, 1]) }}>
            {w.text}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 18, transform: `scale(${kSc})`, background: RED, padding: "6px 26px 10px", borderRadius: 10, boxShadow: "0 10px 30px rgba(232,56,62,0.45)" }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: -1 }}>
          {kw.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Frankl: React.FC = () => {
  const total = Math.round(P.total * FPS);
  return (
    <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={total}>
        <Head />
      </Sequence>
      {P.imgs.map((m, k) => (
        <Sequence key={`i${k}`} from={Math.round(m.t * FPS)} durationInFrames={Math.round(m.d * FPS)}>
          <Still src={m.src} d={m.d} />
        </Sequence>
      ))}
      {P.cards.map((c, k) => (
        <Sequence key={`c${k}`} from={Math.round(c.t * FPS)} durationInFrames={20}>
          <Card text={c.text} y={onHead(Math.round(c.t * FPS)) ? HEAD_SHIFT : 0} />
        </Sequence>
      ))}
      {P.caps.map((c, k, arr) => {
        const from = Math.round(c.t0 * FPS);
        const next = arr[k + 1] ? Math.round(arr[k + 1].t0 * FPS) : total;
        const dur = Math.max(10, Math.min(next - from, Math.round((c.t1 - c.t0) * FPS) + 10));
        return (
          <Sequence key={`s${k}`} from={from} durationInFrames={dur}>
            <Caption cap={c} from={from} dur={dur} hideAt={P.cards.map((x) => Math.round(x.t * FPS))} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("frankl/cut.mp4")} />
    </AbsoluteFill>
  );
};
