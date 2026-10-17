import { PAL, Pal, TONE, wf } from "./theme";

export type SceneId = "meta" | "rutina" | "realidad" | "camino" | "progreso" | "vida" | "golpes" | "levantarse" | "marcador";
export type Seg = { kind: "A" | "B" | "OUT"; from: number; to: number; scene?: SceneId };

// Cortes justo antes de la palabra que abre cada bloque
const CUTS: [number, Seg["kind"], SceneId?][] = [
  [0, "A"],
  [5, "B", "meta"],
  [13, "B", "rutina"],
  [20, "A"],
  [28, "B", "realidad"],
  [32, "A"],
  [41, "B", "camino"],
  [49, "A"],
  [58, "B", "progreso"],
  [62, "A"],
  [76, "B", "vida"],
  [82, "B", "golpes"],
  [90, "A"],
  [100, "B", "levantarse"],
  [112, "B", "marcador"],
  [119, "A"],
];
// El cierre entra cuando termina la voz (1499 fotogramas) y dura poco más de un segundo
export const OUT_FROM = 1500;
export const TOTAL = 1540;
export const SEGS: Seg[] = [
  ...CUTS.map(([w, kind, scene], k) => ({
    kind,
    scene,
    from: w === 0 ? 0 : wf(w) - 2,
    to: k + 1 < CUTS.length ? wf(CUTS[k + 1][0]) - 2 : OUT_FROM,
  })),
  { kind: "OUT", from: OUT_FROM, to: TOTAL },
];
export const segAt = (f: number) => SEGS.find((s) => f >= s.from && f < s.to) ?? SEGS[SEGS.length - 1];

// Un color por escena; nunca el mismo en dos escenas seguidas
export const SCENE_PAL: Record<SceneId, Pal> = {
  meta: PAL.indigo,
  rutina: PAL.silver,
  realidad: PAL.green,
  camino: PAL.steel,
  progreso: PAL.teal,
  vida: PAL.slate,
  golpes: PAL.red,
  levantarse: PAL.green,
  marcador: PAL.indigo,
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
  { a: 0, b: 4, key: [3, 4], tone: TONE.ice, punch: 1.1 },
  { a: 5, b: 8, key: [8] },
  { a: 9, b: 12, key: [12] },
  { a: 13, b: 16, key: [15, 16] },
  { a: 17, b: 18, key: [17] },
  { a: 19, b: 19, key: [19] },
  { a: 20, b: 23, key: [23], tone: TONE.lime, punch: 1.0 },
  { a: 24, b: 27, key: [27], tone: TONE.lilac, punch: 1.12 },
  { a: 28, b: 31, key: [31] },
  { a: 32, b: 36, key: [35, 36], tone: TONE.crimson, punch: 1.06 },
  { a: 37, b: 40, key: [40], tone: TONE.ice, punch: 1.0 },
  { a: 41, b: 44, key: [43, 44] },
  { a: 45, b: 48, key: [47, 48] },
  { a: 49, b: 54, key: [53, 54], tone: TONE.lime, punch: 1.1 },
  { a: 55, b: 57, key: [57], tone: TONE.crimson, punch: 1.0 },
  { a: 58, b: 61, key: [61] },
  { a: 62, b: 68, key: [68], tone: TONE.lilac, punch: 1.0 },
  { a: 69, b: 75, key: [73, 74], mode: "inline", tone: TONE.ice, punch: 1.14 },
  { a: 76, b: 81, key: [79, 80, 81] },
  { a: 82, b: 85, key: [85] },
  { a: 86, b: 89, key: [89] },
  { a: 90, b: 94, key: [92, 93, 94], tone: TONE.crimson, punch: 1.06 },
  { a: 95, b: 99, key: [97, 98, 99], tone: TONE.lilac, punch: 1.0 },
  { a: 100, b: 103, key: [103] },
  { a: 104, b: 107, key: [107] },
  { a: 108, b: 111, key: [111] },
  { a: 112, b: 115, key: [114, 115] },
  { a: 116, b: 118, key: [118] },
  { a: 119, b: 122, key: [121, 122], tone: TONE.ice, punch: 1.1 },
  { a: 123, b: 125, key: [125], tone: TONE.lime, punch: 1.0 },
  { a: 126, b: 130, key: [128, 129, 130], tone: TONE.lilac, punch: 1.06 },
  { a: 131, b: 136, key: [131], tone: TONE.crimson, punch: 1.14 },
];

// Ventana visible de cada grupo: entra unos fotogramas antes de su primera palabra y sale en el siguiente grupo o en el corte
export const WIN = GROUPS.map((g, k) => {
  const seg = segAt(wf(g.a));
  const s = Math.max(wf(g.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg, cut: e === seg.to };
});
