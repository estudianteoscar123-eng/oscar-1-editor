import layout from "../../public/tres-tomas/layout.json";
import { PAL, Pal } from "../ee46f/theme";

// Línea de tiempo de salida: tramos de cámara (solo habla, sin silencios) + gráficos en las pausas.
export const FPS = 30;
export const TOTAL = layout.total;
export const W = layout.words;
export const wf = (i: number) => W[i].f;
export const ITEMS = layout.items;

export type SceneId = "ancla" | "brujula" | "reloj" | "bifurcacion";
export type Beat = { scene: SceneId; from: number; to: number; pal: Pal };

const PALS: Record<SceneId, Pal> = { ancla: PAL.steel, brujula: PAL.green, reloj: PAL.wine, bifurcacion: PAL.indigo };
export const BEATS: Beat[] = ITEMS.filter((x) => x.type === "beat").map((x) => ({
  scene: x.scene as SceneId,
  from: x.out,
  to: x.out + (x.dur ?? 0),
  pal: PALS[x.scene as SceneId],
}));
export const CAMS = ITEMS.filter((x) => x.type === "cam").map((x) => ({ src: x.src, from: x.out, n: x.n }));
export const inBeat = (f: number) => BEATS.some((b) => f >= b.from && f < b.to);

// Grupos de subtítulos: contexto + palabra clave (índices de palabra)
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
  const s = wf(g.a) - 4;
  const nx = GROUPS[k + 1];
  const e = nx ? wf(nx.a) - 4 : W[g.b].fe + 8;
  return { s, e };
});
