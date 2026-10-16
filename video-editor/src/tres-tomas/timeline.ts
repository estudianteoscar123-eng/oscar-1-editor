import data from "../../public/tres-tomas/data.json";
import { PAL, Pal } from "../ee46f/theme";

// Tres tomas a cámara + escenas ilustradas en los momentos de "estancado", "perdido", "tarde" y "caminos".
export const FPS = 30;
export const TOTAL = 890;
export const W = data.words;
export const wf = (i: number) => Math.round(W[i].s * FPS);

export type SceneId = "ancla" | "brujula" | "reloj" | "bifurcacion";
export type Seg = { kind: "A" | "B"; scene?: SceneId; from: number; to: number; pal: Pal };

// Cada corte cae justo antes de la palabra que abre el bloque
const CUTS: [number, "A" | "B", SceneId | undefined, Pal][] = [
  [0, "A", undefined, PAL.silver],
  [8, "B", "ancla", PAL.steel],
  [12, "A", undefined, PAL.silver],
  [14, "B", "brujula", PAL.green],
  [17, "A", undefined, PAL.silver],
  [19, "B", "reloj", PAL.wine],
  [23, "A", undefined, PAL.silver],
  [27, "B", "bifurcacion", PAL.indigo],
];
export const SEGS: Seg[] = CUTS.map(([w, kind, scene, pal], k) => ({
  kind,
  scene,
  pal,
  from: w === 0 ? 0 : wf(w) - 2,
  to: k + 1 < CUTS.length ? wf(CUTS[k + 1][0]) - 2 : TOTAL,
}));
export const segAt = (f: number) => SEGS.find((s) => f >= s.from && f < s.to) ?? SEGS[SEGS.length - 1];

// Grupos de subtítulos: contexto + palabra clave (keys = índices de palabra)
export type Grp = { a: number; b: number; key: number[]; tone: string };
export const GROUPS: Grp[] = [
  { a: 0, b: 7, key: [7], tone: "#E8383E" },
  { a: 8, b: 11, key: [11], tone: "#CFE4EC" },
  { a: 12, b: 13, key: [13], tone: "#A9D46C" },
  { a: 14, b: 16, key: [16], tone: "#A9A5F6" },
  { a: 17, b: 18, key: [18], tone: "#E8383E" },
  { a: 19, b: 22, key: [21, 22], tone: "#CFE4EC" },
  { a: 23, b: 26, key: [26], tone: "#A9D46C" },
  { a: 27, b: 34, key: [33, 34], tone: "#A9A5F6" },
];

export const WIN = GROUPS.map((g, k) => {
  const seg = segAt(wf(g.a));
  const s = Math.max(wf(g.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg };
});
