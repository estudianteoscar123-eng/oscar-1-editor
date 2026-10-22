import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BACK, DISPLAY, INK, INOUT, SANS, alpha, ip, mix } from "../ee46f/theme";
import captions from "../../public/sopa2/captions.json";
import cutData from "../../public/sopa2/cuts.json";

const FPS = 30;
const VERTICAL = new Set(["f7", "f8"]);
const TONES = ["#E8383E", "#A9A5F6", "#CFE4EC", "#A9D46C"];

// Un corte: clip de fondo a pantalla completa 9:16, zoom de impacto y destello
const Cut: React.FC<{ src: string; start: number; kw: boolean; i: number; dur: number }> = ({ src, start, kw, i, dur }) => {
  const f = useCurrentFrame();
  const zoom = ip(f, [0, dur], [1.14, 1.0]);
  const shake = kw && f < 5 ? Math.sin(f * 2.7 + i) * 16 * (1 - f / 5) : 0;
  const flash = i % 3 === 0 ? ip(f, [0, 4, 12], [0.38, 0.2, 0]) : 0;
  const color = TONES[i % TONES.length];
  const vertical = VERTICAL.has(src);
  const style: React.CSSProperties = vertical
    ? { position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }
    : { position: "absolute", left: -1167, top: 0, width: 3414, height: 1920 };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <Video src={staticFile(`sopa2/${src}.mp4`)} trimBefore={Math.round(start * FPS)} muted style={{ ...style, filter: "contrast(1.12) saturate(1.15)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${alpha(color, 0.9)}, ${alpha(color, 0.15)} 70%)`, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

type Cap = { t0: number; t1: number; words: { text: string; t: number }[]; key: number; tone: string };

// Subtítulos dinámicos: contexto palabra por palabra y palabra clave grande en su tono
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
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, lineHeight: 1.2, letterSpacing: -0.8, color: INK, textAlign: "center", textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>
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

export const Sopa2: React.FC<{ subtitulos?: boolean }> = ({ subtitulos = true }) => {
  const step = cutData.step;
  const total = cutData.total;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {cutData.cuts.map((c, i) => {
        const from = i * step;
        const dur = Math.min(step, total - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Cut src={c.src} start={c.start} kw={c.kw} i={i} dur={dur} />
          </Sequence>
        );
      })}
      {subtitulos && (captions as Cap[]).map((c, k, arr) => {
        const from = Math.round(c.t0 * FPS);
        const next = arr[k + 1] ? Math.round(arr[k + 1].t0 * FPS) : total;
        const dur = Math.min(next - from, Math.max(10, Math.round((c.t1 - c.t0) * FPS) + 4));
        return (
          <Sequence key={k} from={from} durationInFrames={dur}>
            <Caption cap={c} from={from} dur={dur} />
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={Math.round(8.33 * FPS)}>
        <Audio src={staticFile("sopa2/intro.wav")} />
      </Sequence>
      <Sequence from={Math.round(8.33 * FPS)} durationInFrames={Math.round(24.0 * FPS)}>
        <Audio src={staticFile("sopa2/narr1.wav")} />
      </Sequence>
      <Sequence from={Math.round(32.33 * FPS)} durationInFrames={Math.round(34.8 * FPS)}>
        <Audio src={staticFile("sopa2/char.wav")} />
      </Sequence>
      <Sequence from={Math.round(67.13 * FPS)} durationInFrames={Math.round(26.4 * FPS)}>
        <Audio src={staticFile("sopa2/narr2.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
