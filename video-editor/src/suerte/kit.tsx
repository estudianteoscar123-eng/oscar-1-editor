import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "../../public/suerte/words.json";

// Estilo C (estilo.md): casi negro + una luz suave + un solo acento azul eléctrico
export const K = {
  bg: "#0A0A0D",
  card: "rgba(28,28,34,0.72)",
  cardSolid: "#16161B",
  stroke: "rgba(255,255,255,0.08)",
  text: "#F5F5F7",
  dim: "#8E8E96",
  faint: "#3A3A42",
  blue: "#0A84FF",
  cyan: "#5AC8FA",
  glow: "rgba(10,132,255,0.55)",
};
export const FONT = "Inter Tight";
for (const w of ["400", "500", "600", "700", "800"]) {
  loadFont({ family: FONT, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}

export const W = words.words;
export const FPS = 30;
export const wf = (i: number) => Math.round(W[i].s * FPS); // fotograma en que empieza la palabra i

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1); // llega rápido y frena largo
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const ip = (f: number, i: number[], o: number[], easing = OUT) => interpolate(f, i, o, { ...clamp, easing });

// aparición estándar: escala 0,9→1 + desenfoque 12→0 + subida 24 px (estilo C · Movimiento)
export const rise = (f: number, at: number, dur = 10, dist = 24, blur = 12, from = 0.9): React.CSSProperties => ({
  opacity: ip(f, [at, at + dur * 0.6], [0, 1]),
  filter: `blur(${ip(f, [at, at + dur], [blur, 0])}px)`,
  translate: `0px ${ip(f, [at, at + dur], [dist, 0])}px`,
  scale: ip(f, [at, at + dur], [from, 1]),
});

// salida hacia arriba con estela (desenfoque de movimiento simulado)
export const leave = (f: number, at: number, dur = 9, dist = -260): React.CSSProperties => ({
  opacity: ip(f, [at, at + dur], [1, 0], INOUT),
  filter: `blur(${ip(f, [at, at + dur], [0, 18], INOUT)}px)`,
  translate: `0px ${ip(f, [at, at + dur], [0, dist], Easing.in(Easing.cubic))}px`,
});

export const glass: React.CSSProperties = {
  background: K.card,
  border: `1px solid ${K.stroke}`,
  borderRadius: 36,
  boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
};

export const accentText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${K.cyan} 0%, ${K.blue} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// Fondo: casi negro, luz azul suave desde arriba que respira, viñeta y grano
export const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const breathe = 0.85 + Math.sin(f / 40) * 0.08;
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -300,
          top: -700,
          width: 1680,
          height: 1500,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(10,132,255,0.42), rgba(10,132,255,0.10) 55%, rgba(10,132,255,0) 100%)",
          opacity: breathe,
          translate: `${Math.sin(f / 70) * 40}px 0px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 200,
          bottom: -700,
          width: 1100,
          height: 1000,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(90,200,250,0.10), rgba(90,200,250,0) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)" }} />
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.06, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="1080" height="1920" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Titular sincronizado: grupos de palabras que entran una a una con desenfoque; claves en azul
const GROUPS: [number, number][] = [
  [13, 16], [17, 20], [21, 23], [24, 24], [25, 29],
  [30, 37], [38, 39],
  [40, 44], [45, 53],
  [54, 58], [59, 63],
  [64, 67], [68, 71],
];
const KEYS = new Set([14, 19, 23, 24, 29, 32, 35, 39, 41, 48, 50, 57, 58, 63, 64, 71]);

export const Headline: React.FC<{ top?: number }> = ({ top = 250 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const gi = GROUPS.findIndex(([a], k) => {
    const start = wf(a) - 2;
    const end = k + 1 < GROUPS.length ? wf(GROUPS[k + 1][0]) - 2 : durationInFrames;
    return f >= start && f < end;
  });
  if (gi < 0) return null;
  const [a, b] = GROUPS[gi];
  const end = gi + 1 < GROUPS.length ? wf(GROUPS[gi + 1][0]) - 2 : durationInFrames + 10;
  const out = ip(f, [end - 4, end], [0, 1], INOUT);
  const idx = Array.from({ length: b - a + 1 }, (_, k) => a + k);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 58,
        fontWeight: 600,
        lineHeight: 1.18,
        letterSpacing: -1.2,
        color: K.text,
        opacity: 1 - out,
        filter: `blur(${out * 12}px)`,
        translate: `0px ${-out * 30}px`,
      }}
    >
      {idx.map((i) => {
        const at = wf(i);
        const key = KEYS.has(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              opacity: ip(f, [at - 1, at + 3], [0, 1]),
              filter: `blur(${ip(f, [at - 1, at + 4], [10, 0])}px)${key ? ` drop-shadow(0 0 18px ${K.glow})` : ""}`,
              translate: `0px ${ip(f, [at - 1, at + 5], [14, 0])}px`,
              ...(key ? accentText : {}),
            }}
          >
            {W[i].t}
          </span>
        );
      })}
    </div>
  );
};
