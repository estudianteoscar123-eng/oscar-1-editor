import { PAL, Pal, TONE, wf } from "./theme";

export type SceneId = "caida" | "agotado" | "mente" | "facil" | "descanso" | "hoy";
export type Seg = { kind: "A" | "B" | "OUT"; from: number; to: number; scene?: SceneId };

// Cortes justo antes de la palabra que abre cada bloque (índices de palabra de data.json)
const CUTS: [number, Seg["kind"], SceneId?][] = [
  [0, "A"],
  [5, "B", "caida"],
  [21, "A"],
  [31, "B", "agotado"],
  [43, "B", "mente"],
  [57, "A"],
  [68, "B", "facil"],
  [75, "A"],
  [90, "B", "descanso"],
  [96, "A"],
  [106, "B", "hoy"],
  [112, "A"],
];
// La cámara termina con el último fotograma de la toma; el cierre empieza ahí
export const OUT_FROM = 1302;
export const TOTAL = 1347;
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

// Un color por escena; nunca dos iguales seguidas
export const SCENE_PAL: Record<SceneId, Pal> = {
  caida: PAL.green,
  agotado: PAL.wine,
  mente: PAL.indigo,
  facil: PAL.steel,
  descanso: PAL.slate,
  hoy: PAL.silver,
};

// Grupos de subtítulos: contexto pequeño + palabra clave grande
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
  { a: 0, b: 4, key: [4], tone: TONE.ice, punch: 1.1 },
  { a: 5, b: 11, key: [10, 11] },
  { a: 12, b: 20, key: [17, 18] },
  { a: 21, b: 26, key: [25, 26], tone: TONE.crimson, punch: 1.0 },
  { a: 27, b: 30, key: [30], tone: TONE.lime, punch: 1.12 },
  { a: 31, b: 38, key: [37, 38] },
  { a: 39, b: 42, key: [42] },
  { a: 43, b: 47, key: [47] },
  { a: 48, b: 51, key: [51] },
  { a: 52, b: 56, key: [56] },
  { a: 57, b: 61, key: [59], tone: TONE.lilac, punch: 1.06 },
  { a: 62, b: 67, key: [66, 67], tone: TONE.ice, punch: 1.0 },
  { a: 68, b: 73, key: [71], align: "left" },
  { a: 74, b: 74, key: [74], align: "left" },
  { a: 75, b: 80, key: [79], tone: TONE.lime, punch: 1.1 },
  { a: 81, b: 86, key: [85, 86], tone: TONE.crimson, punch: 1.0 },
  { a: 87, b: 89, key: [89], tone: TONE.lilac, punch: 1.06 },
  { a: 90, b: 95, key: [93] },
  { a: 96, b: 101, key: [98], tone: TONE.ice, punch: 1.0 },
  { a: 102, b: 105, key: [102], tone: TONE.lime, punch: 1.12 },
  { a: 106, b: 108, key: [108] },
  { a: 109, b: 111, key: [111] },
  { a: 112, b: 115, key: [114, 115], tone: TONE.lilac, punch: 1.06 },
  { a: 116, b: 116, key: [116], tone: TONE.crimson, punch: 1.14 },
];

// Ventana visible de cada grupo: entra unos fotogramas antes de su primera palabra y sale en el siguiente grupo o en el corte
export const WIN = GROUPS.map((g, k) => {
  const seg = segAt(wf(g.a));
  const s = Math.max(wf(g.a) - 5, seg.from);
  const nx = GROUPS[k + 1];
  const e = nx && wf(nx.a) - 2 < seg.to ? Math.max(wf(nx.a) - 5, s + 1) : seg.to;
  return { s, e, seg, cut: e === seg.to };
});

// Capítulos de la lista (no se usan en la tarjeta, pero el componente los pide)
export const CHAPTERS = [0, 5, 21, 31, 57, 68, 75, 90, 106];
