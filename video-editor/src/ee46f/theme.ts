import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";
import data from "../../public/ee46/data.json";

// Estilo F (estilo.md): A-roll + B-roll ilustrado con luz, cada escena en su propio color
export const FPS = 30;
export const W = data.words;
export const wf = (i: number) => Math.round(W[i].s * FPS);

export const SANS = "F Sans";
export const DISPLAY = "F Display";
export const SERIF = "F Serif";
for (const w of ["500", "600", "700"]) {
  loadFont({ family: SANS, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["800", "900"]) {
  loadFont({ family: DISPLAY, url: staticFile(`fonts/poppins-latin-${w}-italic.woff2`), weight: w, style: "italic" });
}
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const BACK = Easing.bezier(0.34, 1.4, 0.64, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ip = (f: number, i: number[], o: number[], easing = OUT) => interpolate(f, i, o, { ...clamp, easing });

const rgb = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = rgb(a);
  const B = rgb(b);
  return "#" + A.map((v, k) => Math.round(v + (B[k] - v) * t).toString(16).padStart(2, "0")).join("");
};
export const alpha = (h: string, a: number) => {
  const [r, g, b] = rgb(h);
  return `rgba(${r},${g},${b},${a})`;
};

export const BASE = "#07080B";
export const INK = "#F4F2EE";

// Cuatro tonos para las palabras clave del A-roll (sin amarillo)
export const TONE = { crimson: "#E8383E", ice: "#CFE4EC", lime: "#A9D46C", lilac: "#A9A5F6" };

// Un color por escena ilustrada, sacado de las paletas aprobadas
export type Pal = { m: string; l: string; acc?: string };
export const PAL = {
  red: { m: "#C40B11", l: "#F2595E" },
  indigo: { m: "#35339A", l: "#A09CF4" },
  steel: { m: "#2B5B7E", l: "#A6C9E0" },
  green: { m: "#2C7411", l: "#9DD65A" },
  slate: { m: "#3C6264", l: "#B7D5D2" },
  wine: { m: "#740A12", l: "#E36D73" },
  silver: { m: "#55534F", l: "#ECEAE3", acc: "#E0242B" },
} satisfies Record<string, Pal>;

// Aparición estándar: escala + desenfoque + subida, con frenado largo
export const pop = (f: number, at: number, d = 9, dist = 30, from = 0.86) => ({
  opacity: ip(f, [at, at + d * 0.6], [0, 1]),
  scale: ip(f, [at, at + d], [from, 1], BACK),
  filter: `blur(${ip(f, [at, at + d], [10, 0])}px)`,
  translate: `0px ${ip(f, [at, at + d], [dist, 0])}px`,
});
