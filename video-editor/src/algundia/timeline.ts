import data from "../../public/algundia/data.json";
import { PAL, Pal } from "../ee46f/theme";
import { ICE, LILAC } from "../vaso/timeline";

// "¿Y si algún día fue la mentira que te robó?" — motion graphics, voz en off + beat en loop.
export const FPS = 30;
export const TOTAL = 2622; // 170 tiempos exactos del beat: el final empalma con el inicio
export const W = data.words;
export const wf = (i: number) => Math.round(W[i].s * FPS);

export type SceneId =
  | "gancho"
  | "lista"
  | "vida"
  | "plan"
  | "lunes"
  | "bien"
  | "compras"
  | "semanas"
  | "escalera"
  | "intereses"
  | "amigos"
  | "cuerpo"
  | "culpa"
  | "evitas"
  | "sefue"
  | "planes"
  | "hoy"
  | "pasos"
  | "subir"
  | "miedo"
  | "cierre";
export type Seg = { scene: SceneId; from: number; to: number; pal: Pal };

const CUTS: [number, SceneId, Pal][] = [
  [0, "gancho", PAL.silver],
  [10, "lista", PAL.steel],
  [33, "vida", PAL.green],
  [47, "plan", PAL.indigo],
  [64, "lunes", LILAC],
  [74, "bien", PAL.slate],
  [89, "compras", ICE],
  [105, "semanas", LILAC],
  [117, "escalera", PAL.green],
  [125, "intereses", PAL.red],
  [134, "amigos", PAL.steel],
  [143, "cuerpo", PAL.wine],
  [150, "culpa", PAL.indigo],
  [166, "evitas", PAL.slate],
  [188, "sefue", PAL.silver],
  [207, "planes", PAL.steel],
  [218, "hoy", PAL.green],
  [229, "pasos", LILAC],
  [252, "subir", ICE],
  [278, "miedo", PAL.slate],
  [300, "cierre", PAL.silver],
];
export const SEGS: Seg[] = CUTS.map(([w, scene, pal], k) => ({
  scene,
  pal,
  from: w === 0 ? 0 : wf(w) - 2,
  to: k + 1 < CUTS.length ? wf(CUTS[k + 1][0]) - 2 : TOTAL,
}));
export const segAt = (f: number) => SEGS.find((s) => f >= s.from && f < s.to) ?? SEGS[SEGS.length - 1];

export type Grp = { a: number; b: number; key: number[]; mode?: "stack" | "inline"; zone?: "top" | "center"; align?: "center" | "left" };
const g = (a: number, b: number, key: number[], zone?: "center"): Grp => ({ a, b, key, zone });
export const GROUPS: Grp[] = [
  g(0, 9, [7, 8, 9]),
  g(10, 20, [19, 20]),
  g(21, 23, [23]),
  g(24, 26, [26]),
  g(27, 32, [32]),
  g(33, 38, [38]),
  g(39, 41, [41]),
  g(42, 46, [46]),
  g(47, 57, [57]),
  g(58, 63, [63]),
  g(64, 68, [68]),
  g(69, 73, [72, 73]),
  g(74, 83, [83]),
  g(84, 88, [88]),
  g(89, 93, [93]),
  g(94, 98, [97, 98]),
  g(99, 104, [103, 104]),
  g(105, 107, [106, 107]),
  g(108, 110, [110]),
  g(111, 116, [116]),
  g(117, 124, [123, 124]),
  g(125, 131, [131]),
  g(132, 133, [133]),
  g(134, 136, [136]),
  g(137, 142, [141, 142]),
  g(143, 145, [145]),
  g(146, 149, [148, 149]),
  g(150, 156, [156]),
  g(157, 165, [164, 165]),
  g(166, 175, [174, 175]),
  g(176, 180, [180]),
  g(181, 187, [187]),
  g(188, 200, [199, 200]),
  g(201, 206, [201, 202, 203], "center"),
  g(207, 214, [213, 214]),
  g(215, 217, [217]),
  g(218, 225, [225]),
  g(226, 228, [228]),
  g(229, 232, [232]),
  g(233, 237, [237]),
  g(238, 240, [240]),
  g(241, 244, [244]),
  g(245, 251, [251]),
  g(252, 256, [255, 256]),
  g(257, 261, [261]),
  g(262, 266, [265, 266]),
  g(267, 277, [277]),
  g(278, 284, [284]),
  g(285, 287, [287]),
  g(288, 290, [290]),
  g(291, 299, [299]),
  g(300, 305, [305]),
  g(306, 307, [306, 307]),
];

export const WIN = GROUPS.map((gr, k) => {
  const seg = segAt(wf(gr.a));
  const s = Math.max(wf(gr.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg, cut: e === seg.to };
});
