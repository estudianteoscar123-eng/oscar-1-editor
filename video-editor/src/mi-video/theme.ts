import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Paleta de las referencias (estilo.md §7)
export const C = {
  bg: "#FBFAFD",
  blob: "#D3E0FE",
  card: "#FFFFFF",
  cardBorder: "#EEF0F5",
  ink: "#111111",
  blue: "#0051FF",
  blueSoft: "#E8EFFF",
  muted: "#8A8F99",
  line: "#F0F2F7",
  white: "#FFFFFF",
};

export const SANS = "Inter Tight";
export const MONO = "JetBrains Mono";
export const SERIF = "Instrument Serif";

for (const w of ["600", "700", "800", "900"]) {
  loadFont({ family: SANS, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), style: "italic", weight: "400" });
for (const w of ["500", "700"]) {
  loadFont({ family: MONO, url: staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`), weight: w });
}

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// estilo.md §5: blur 10→0, opacidad 0→1, translateY 20→0 en 7 fotogramas
export const enter = (frame: number, at: number, dur = 7) => ({
  opacity: interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE }),
  filter: `blur(${interpolate(frame, [at, at + dur], [10, 0], { ...clamp, easing: EASE })}px)`,
  translate: `0px ${interpolate(frame, [at, at + dur], [20, 0], { ...clamp, easing: EASE })}px`,
});

export const monoLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: 22,
  letterSpacing: 2.5,
  textTransform: "uppercase",
  color: C.muted,
};

export const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 28,
  boxShadow: "0 20px 60px rgba(20,40,120,0.12)",
};
