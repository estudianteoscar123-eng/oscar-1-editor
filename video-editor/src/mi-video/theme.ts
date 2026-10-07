import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const C = {
  bg: "#0A0E27",
  card: "#11162F",
  cardBorder: "rgba(255,255,255,0.08)",
  red: "#E63946",
  blue: "#1E90FF",
  white: "#FFFFFF",
  muted: "#8A93B2",
};

export const SANS = "Inter Tight";
export const MONO = "JetBrains Mono";

for (const w of ["600", "700", "800", "900"]) {
  loadFont({ family: SANS, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}
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
  fontSize: 24,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: C.muted,
};

export const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 28,
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
};
