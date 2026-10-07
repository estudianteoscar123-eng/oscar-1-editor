import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Estilo B (refC/refD): azul noche, foco cenital, ilustración azul monocroma
export const B = {
  bg0: "#02060F",
  bg1: "#0A2A66",
  cyanTop: "#B8F6FF",
  cyan: "#3BE3FF",
  blue: "#0A7BFF",
  deep: "#0A3FA8",
  white: "#FFFFFF",
  glow: "rgba(40,150,255,0.75)",
};

export const POPPINS = "Poppins";
for (const [w, s] of [["500", "normal"], ["600", "normal"], ["700", "italic"], ["800", "italic"], ["900", "italic"]] as const) {
  loadFont({ family: POPPINS, url: staticFile(`fonts/poppins-latin-${w}-${s}.woff2`), weight: w, style: s });
}

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
