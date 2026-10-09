import { PAL, TONE, wf } from "./theme";

export type SceneId = "porno" | "metas" | "amigos" | "espejo" | "foco" | "planes" | "manana";
export type Seg = { kind: "A" | "B" | "OUT"; from: number; to: number; scene?: SceneId };

// Cortes justo antes de la palabra que abre cada bloque
const CUTS: [number, Seg["kind"], SceneId?][] = [
  [0, "A"],
  [3, "B", "porno"],
  [7, "B", "metas"],
  [15, "A"],
  [24, "B", "amigos"],
  [37, "B", "espejo"],
  [47, "A"],
  [63, "B", "foco"],
  [82, "A"],
  [88, "B", "planes"],
  [101, "A"],
  [110, "B", "manana"],
  [122, "A"],
  [129, "OUT"],
];
export const TOTAL = 984;
export const SEGS: Seg[] = CUTS.map(([w, kind, scene], k) => ({
  kind,
  scene,
  from: w === 0 ? 0 : wf(w) - 2,
  to: k + 1 < CUTS.length ? wf(CUTS[k + 1][0]) - 2 : TOTAL,
}));
export const segAt = (f: number) => SEGS.find((s) => f >= s.from && f < s.to) ?? SEGS[SEGS.length - 1];

export const SCENE_PAL: Record<SceneId, { m: string; l: string; acc?: string }> = {
  porno: PAL.red,
  metas: PAL.indigo,
  amigos: PAL.steel,
  espejo: PAL.green,
  foco: PAL.slate,
  planes: PAL.wine,
  manana: PAL.silver,
};

// Grupos de subtítulos: contexto pequeño + palabra clave grande (o en línea)
export type Grp = {
  a: number;
  b: number;
  key: number[];
  mode?: "stack" | "inline";
  tone?: string; // solo A-roll; en B-roll manda el color de la escena
  align?: "center" | "left";
  punch?: number; // encuadre del A-roll mientras dura el grupo
};
export const GROUPS: Grp[] = [
  { a: 0, b: 2, key: [2], tone: TONE.ice, punch: 1.1 },
  { a: 3, b: 6, key: [6] },
  { a: 7, b: 14, key: [14] },
  { a: 15, b: 23, key: [22, 23], tone: TONE.crimson, punch: 1.0 },
  { a: 24, b: 29, key: [28, 29], align: "left" },
  { a: 30, b: 36, key: [35, 36], align: "left" },
  { a: 37, b: 40, key: [40] },
  { a: 41, b: 46, key: [45, 46] },
  { a: 47, b: 54, key: [52, 53, 54], tone: TONE.lime, punch: 1.0 },
  { a: 55, b: 59, key: [58, 59], tone: TONE.lilac, punch: 1.16 },
  { a: 60, b: 62, key: [62], tone: TONE.ice, punch: 1.06 },
  { a: 63, b: 68, key: [66], mode: "inline" },
  { a: 69, b: 73, key: [72, 73] },
  { a: 74, b: 81, key: [79, 80, 81] },
  { a: 82, b: 87, key: [82, 83], tone: TONE.crimson, punch: 1.14 },
  { a: 88, b: 91, key: [91], align: "left" },
  { a: 92, b: 95, key: [95], align: "left" },
  { a: 96, b: 100, key: [99, 100] },
  { a: 101, b: 103, key: [103], tone: TONE.lilac, punch: 1.0 },
  { a: 104, b: 109, key: [108, 109], tone: TONE.lime, punch: 1.12 },
  { a: 110, b: 114, key: [113, 114] },
  { a: 115, b: 121, key: [116, 117, 118], mode: "inline" },
  { a: 122, b: 128, key: [127, 128], tone: TONE.crimson, punch: 1.0 },
];

// Ventana visible de cada grupo: entra unos fotogramas antes de su primera palabra y sale en el siguiente grupo o en el corte
export const WIN = GROUPS.map((g, k) => {
  const seg = segAt(wf(g.a));
  const s = Math.max(wf(g.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg, cut: e === seg.to };
});

// Capítulos de la lista (1–9)
export const CHAPTERS = [0, 3, 7, 15, 37, 55, 82, 110, 122];
