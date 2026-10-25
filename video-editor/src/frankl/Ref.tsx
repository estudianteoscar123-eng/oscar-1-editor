import React from "react";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ip } from "../ee46f/theme";
import plan from "../../public/frankl/plan2.json";

// Estilo de referencia (estilo-referencia.md): 5 tipos de plano y subtítulos de 1–3 palabras, blancos, sin cajas
const FPS = 30;
const RED = "#FF3B3B";
const FONT = "Ref Poppins";
loadFont({ family: FONT, url: staticFile("fonts/poppins-latin-600-normal.woff2"), weight: "600" });

type Shot = { from: number; to: number; kind: "H" | "I"; src: string | null; scale?: number };
type Word = { text: string; t: number };
const P = plan as unknown as { total: number; shots: Shot[]; caps: { words: Word[] }[] };
const fr = (t: number) => Math.round(t * FPS);
const KEYS = new Set(["todo", "manuscrito", "robaron", "reescribirlo", "vez"]);

// Bloques de 1–3 palabras: corte en puntuación, en pausas o a las 3 palabras
const WORDS: Word[] = P.caps.flatMap((c) => c.words);
const CHUNKS: { t: number; words: Word[] }[] = [];
{
  let cur: Word[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const punct = /[,.?]$/.test(w.text);
    if (cur.length >= 3 || punct || !next || next.t - w.t > 0.55) {
      CHUNKS.push({ t: cur[0].t, words: cur });
      cur = [];
    }
  });
}

// Tipo de plano: H alterna cámara completa / cámara en tarjeta; I rota entre imagen completa, pantalla partida y tarjeta roja
type Layout = "camFull" | "camCard" | "img" | "split" | "redCard";
const LAYOUTS: Layout[] = (() => {
  let h = 0;
  let im = 0;
  const cycle: Layout[] = ["img", "split", "img", "redCard", "split"];
  return P.shots.map((s) => (s.kind === "H" ? (h++ % 2 ? "camCard" : "camFull") : cycle[im++ % cycle.length]));
})();
const layoutAt = (frame: number): Layout => {
  const i = P.shots.findIndex((s) => frame >= fr(s.from) && frame < fr(s.to));
  return LAYOUTS[Math.max(0, i)];
};
// Altura del subtítulo según el plano (en tu cara, por debajo del mentón)
const CAPTION_Y: Record<Layout, number> = { camFull: 1180, camCard: 1360, img: 960, split: 1104, redCard: 1460 };

const Cam: React.FC<{ s: Shot; style: React.CSSProperties }> = ({ s, style }) => (
  <Video src={staticFile("frankl/cut03.mp4")} trimBefore={fr(s.from)} muted style={{ position: "absolute", ...style }} />
);
const Picture: React.FC<{ src: string; d: number; i: number; style?: React.CSSProperties }> = ({ src, d, i, style }) => {
  const f = useCurrentFrame();
  const z = i % 2 ? interpolate(f, [0, d], [1.0, 1.08]) : interpolate(f, [0, d], [1.08, 1.0]);
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      <Img src={staticFile(`frankl/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "sepia(0.18) saturate(1.06) contrast(1.05)" }} />
    </div>
  );
};

const ShotView: React.FC<{ s: Shot; i: number; layout: Layout }> = ({ s, i, layout }) => {
  const f = useCurrentFrame();
  const d = fr(s.to - s.from);
  const push = interpolate(f, [0, d], [1, 1.03]);
  if (layout === "camFull") {
    return (
      <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${(s.scale ?? 1) * push})`, transformOrigin: "50% 38%" }}>
          <Cam s={s} style={{ left: 0, top: 0, width: 1080, height: 1920 }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (layout === "camCard") {
    // tú dentro de una tarjeta redondeada sobre fondo claro
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, #F4F4F4 0%, #D6D6D6 60%, #A9A9A9 100%)" }}>
        <div style={{ position: "absolute", left: 70, top: 640, width: 940, height: 640, borderRadius: 30, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.35)" }}>
          <Cam s={s} style={{ left: 0, top: -330, width: 940, height: 1671 }} />
        </div>
      </AbsoluteFill>
    );
  }
  if (layout === "img") {
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <Picture src={s.src!} d={d} i={i} style={{ left: 0, top: 0, width: 1080, height: 1920 }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      </AbsoluteFill>
    );
  }
  if (layout === "split") {
    // imagen arriba, tú abajo, línea blanca en medio
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <Picture src={s.src!} d={d} i={i} style={{ left: 0, top: 0, width: 1080, height: 1104 }} />
        <div style={{ position: "absolute", left: 0, top: 1104, width: 1080, height: 816, overflow: "hidden" }}>
          <Cam s={s} style={{ left: 0, top: -300, width: 1080, height: 1920 }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 1098, width: 1080, height: 12, background: "#FFFFFF", boxShadow: "0 0 24px rgba(255,255,255,0.8)" }} />
      </AbsoluteFill>
    );
  }
  // imagen en tarjeta sobre fondo rojo
  return (
    <AbsoluteFill style={{ background: "#C8161D" }}>
      <Picture src={s.src!} d={d} i={i} style={{ left: 90, top: 520, width: 900, height: 860, borderRadius: 30, boxShadow: "0 30px 70px rgba(0,0,0,0.45)" }} />
    </AbsoluteFill>
  );
};

const Chunk: React.FC<{ words: Word[]; y: number }> = ({ words, y }) => {
  const f = useCurrentFrame();
  const sc = ip(f, [0, 4], [0.9, 1]);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, transform: `translateY(-50%) scale(${sc})`, textAlign: "center" }}>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 68, lineHeight: 1.1, letterSpacing: -0.5, color: "#FFFFFF", textShadow: "0 4px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)" }}>
        {words.map((w, k) => (
          <span key={k} style={{ color: KEYS.has(w.text.toLowerCase().replace(/[^a-záéíóúñ]/g, "")) ? RED : "#FFFFFF" }}>
            {w.text}
            {k < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </div>
  );
};

export const FranklRef: React.FC = () => {
  const total = fr(P.total);
  return (
    <AbsoluteFill style={{ background: "#07080B", overflow: "hidden" }}>
      {P.shots.map((s, i) => (
        <Sequence key={`p${i}`} from={fr(s.from)} durationInFrames={Math.max(1, fr(s.to) - fr(s.from))}>
          <ShotView s={s} i={i} layout={LAYOUTS[i]} />
        </Sequence>
      ))}
      {CHUNKS.map((c, k) => {
        const from = fr(c.t);
        const to = CHUNKS[k + 1] ? fr(CHUNKS[k + 1].t) : total;
        return (
          <Sequence key={`c${k}`} from={from} durationInFrames={Math.max(1, to - from)}>
            <Chunk words={c.words} y={CAPTION_Y[layoutAt(from)]} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("frankl/cut03.mp4")} />
    </AbsoluteFill>
  );
};
