import data from "../../public/vaso/data.json";
import { PAL, Pal } from "../ee46f/theme";

// Video 100 % motion graphics: voz en off + música en loop. El final empalma con el inicio.
export const FPS = 30;
export const TOTAL = 1956;
export const W = data.words;
export const wf = (i: number) => Math.round(W[i].s * FPS);

// Paletas extra derivadas de las aprobadas (azul nieve / Elegant), sin amarillo
export const ICE: Pal = { m: "#24425E", l: "#DCE9F2" };
export const LILAC: Pal = { m: "#3E3790", l: "#C4BEF8" };

export type SceneId =
  | "campo"
  | "vaso"
  | "llenar"
  | "foto"
  | "vacio"
  | "mas"
  | "tachas"
  | "grieta"
  | "caida"
  | "mes"
  | "critica"
  | "silencio"
  | "rompe"
  | "manos"
  | "rehace"
  | "paz"
  | "cierre";
export type Seg = { scene: SceneId; from: number; to: number; pal: Pal };

const CUTS: [number, SceneId, Pal][] = [
  [0, "campo", PAL.silver],
  [9, "vaso", PAL.steel],
  [20, "llenar", PAL.indigo],
  [34, "foto", PAL.green],
  [42, "vacio", PAL.slate],
  [55, "mas", PAL.wine],
  [79, "tachas", PAL.steel],
  [94, "grieta", PAL.red],
  [113, "caida", PAL.slate],
  [120, "mes", PAL.wine],
  [130, "critica", PAL.indigo],
  [136, "silencio", PAL.steel],
  [142, "rompe", PAL.silver],
  [162, "manos", ICE],
  [179, "rehace", LILAC],
  [198, "paz", PAL.green],
  [221, "cierre", PAL.silver],
];
export const SEGS: Seg[] = CUTS.map(([w, scene, pal], k) => ({
  scene,
  pal,
  from: w === 0 ? 0 : wf(w) - 2,
  to: k + 1 < CUTS.length ? wf(CUTS[k + 1][0]) - 2 : TOTAL,
}));
export const segAt = (f: number) => SEGS.find((s) => f >= s.from && f < s.to) ?? SEGS[SEGS.length - 1];

// Subtítulos: contexto + clave. zone "center" para los golpes (gancho, ERA EL VASO, PAZ, cierre)
export type Grp = { a: number; b: number; key: number[]; mode?: "stack" | "inline"; zone?: "top" | "center"; align?: "center" | "left" };
export const GROUPS: Grp[] = [
  { a: 0, b: 8, key: [8], zone: "center" },
  { a: 9, b: 15, key: [15] },
  { a: 16, b: 19, key: [19] },
  { a: 20, b: 25, key: [21, 23, 25], mode: "inline" },
  { a: 26, b: 28, key: [28] },
  { a: 29, b: 33, key: [33] },
  { a: 34, b: 36, key: [36] },
  { a: 37, b: 41, key: [41] },
  { a: 42, b: 47, key: [47] },
  { a: 48, b: 54, key: [54] },
  { a: 55, b: 59, key: [59] },
  { a: 60, b: 63, key: [60] },
  { a: 64, b: 68, key: [64] },
  { a: 69, b: 73, key: [69] },
  { a: 74, b: 78, key: [74] },
  { a: 79, b: 82, key: [81, 82] },
  { a: 83, b: 86, key: [86] },
  { a: 87, b: 88, key: [88] },
  { a: 89, b: 93, key: [93] },
  { a: 94, b: 99, key: [97, 98, 99] },
  { a: 100, b: 100, key: [100], zone: "center" },
  { a: 101, b: 106, key: [104, 105, 106] },
  { a: 107, b: 112, key: [110, 111, 112] },
  { a: 113, b: 119, key: [117, 118, 119] },
  { a: 120, b: 129, key: [126, 127, 128, 129] },
  { a: 130, b: 135, key: [135] },
  { a: 136, b: 141, key: [140, 141] },
  { a: 142, b: 149, key: [148, 149] },
  { a: 150, b: 158, key: [158] },
  { a: 159, b: 161, key: [159, 160, 161], zone: "center" },
  { a: 162, b: 169, key: [167, 168, 169] },
  { a: 170, b: 175, key: [175] },
  { a: 176, b: 178, key: [178] },
  { a: 179, b: 181, key: [181] },
  { a: 182, b: 186, key: [185, 186] },
  { a: 187, b: 188, key: [188] },
  { a: 189, b: 197, key: [194, 195, 196, 197] },
  { a: 198, b: 204, key: [203, 204] },
  { a: 205, b: 214, key: [212, 213, 214] },
  { a: 215, b: 215, key: [215], zone: "center" },
  { a: 216, b: 220, key: [219, 220] },
  { a: 221, b: 228, key: [227, 228] },
  { a: 229, b: 230, key: [229, 230], zone: "center" },
];

export const WIN = GROUPS.map((g, k) => {
  const seg = segAt(wf(g.a));
  const s = Math.max(wf(g.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg, cut: e === seg.to };
});
