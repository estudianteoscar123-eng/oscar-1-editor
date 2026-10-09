import { loadFont } from "@remotion/fonts";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/ee46/data.json";

// Paleta cerrada: negro azulado, texto cálido, dorado suave como acento único
const P = { base: "#070A12", ink: "#F4F1EA", gold: "#D9B26F", goldHi: "#F2D9A6", cyan: "#7FC8E8" };
const SANS = "EE46 Sans";
const SERIF = "EE46 Serif";
loadFont({ family: SANS, url: staticFile("fonts/inter-tight-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: SANS, url: staticFile("fonts/inter-tight-latin-800-normal.woff2"), weight: "800" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), style: "italic", weight: "400" });

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = data.words;
const FPS = 30;
const wf = (i: number) => Math.round(W[i].s * FPS);
// Tres zonas de la cuadrícula: rotan para que el ojo no prevea dónde aparece el texto
const ZONES = [300, 900, 1200];

const Line: React.FC<{ idx: number[]; f: number; size: number; top: number; key2: string }> = ({ idx, f, size, top }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top, textAlign: "center", fontFamily: SANS, fontWeight: 700,
    fontSize: size, lineHeight: 1.18, letterSpacing: -0.8, color: P.ink }}>
    {idx.map((i) => {
      const at = wf(i);
      return (
        <span key={i} style={{ display: "inline-block", marginRight: "0.22em",
          opacity: interpolate(f, [at - 2, at + 4], [0, 1], { ...clamp, easing: EASE }),
          filter: `blur(${interpolate(f, [at - 2, at + 5], [8, 0], { ...clamp, easing: EASE })}px)`,
          translate: `0px ${interpolate(f, [at - 2, at + 5], [14, 0], { ...clamp, easing: EASE })}px` }}>
          {W[i].text}
        </span>
      );
    })}
  </div>
);

const Key: React.FC<{ idx: number[]; f: number; top: number; style: string; big: boolean }> = ({ idx, f, top, style, big }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", lineHeight: 1.02 }}>
    {idx.map((i) => {
      const at = wf(i);
      const o = interpolate(f, [at, at + 5], [0, 1], { ...clamp, easing: EASE });
      const b = interpolate(f, [at, at + 6], [10, 0], { ...clamp, easing: EASE });
      const sc = interpolate(f, [at, at + 7], [1.06, 1], { ...clamp, easing: EASE });
      const common: React.CSSProperties = { display: "inline-block", opacity: o, filter: `blur(${b}px)`, scale: sc };
      if (style === "serif")
        return <span key={i} style={{ ...common, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: big ? 150 : 120, color: P.gold, textShadow: "0 2px 18px rgba(217,178,111,0.25)" }}>{W[i].text.replace(/[.,¿?¡!]/g, "")}</span>;
      if (style === "caps")
        return <span key={i} style={{ ...common, fontFamily: SANS, fontWeight: 800, textTransform: "uppercase", fontSize: big ? 118 : 96, letterSpacing: -2, color: P.ink, borderBottom: `4px solid ${P.gold}`, paddingBottom: 6 }}>{W[i].text.replace(/[.,¿?¡!]/g, "")}</span>;
      return <span key={i} style={{ ...common, fontFamily: SANS, fontWeight: 800, fontSize: big ? 130 : 110, letterSpacing: -2.5, color: P.goldHi }}>{W[i].text.replace(/[.,¿?¡!]/g, "")}</span>;
    })}
  </div>
);

export const EE46: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / FPS;
  const pi = Math.max(0, data.phrases.findIndex((p) => t >= p.start && t < p.end));
  const p = data.phrases[pi];
  const last = pi === data.phrases.length - 1;
  const zone = ZONES[pi % ZONES.length];
  const lineTop = zone;
  const keyTop = zone + (zone === 1200 ? -140 : 130);
  // cámara: empuje lento y micro-acercamiento por frase, sin filtros de pantalla completa
  const push = interpolate(f, [0, durationInFrames], [1.0, 1.04], clamp);
  const punch = pi % 2 === 0 ? 1.0 : 1.025;
  // salida suave de la frase: se atenúa en los últimos 4 fotogramas
  const endF = Math.round(p.end * FPS);
  const out = interpolate(f, [endF - 4, endF], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: P.base, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: push * punch, transformOrigin: "50% 40%" }}>
        <Video src={staticFile("ee46/camara.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      {/* sombra inferior suave para la legibilidad, sin filtros de pantalla completa */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,10,18,0.0) 55%, rgba(7,10,18,0.55) 100%)" }} />
      <div style={{ opacity: out }}>
        <Line idx={p.line} f={f} size={last ? 56 : 52} top={lineTop} key2={String(pi)} />
        {p.hl.length > 0 && <Key idx={p.hl} f={f} top={keyTop} style={p.style} big={last} />}
      </div>
      <Audio src={staticFile("ee46/voz.wav")} />
    </AbsoluteFill>
  );
};
