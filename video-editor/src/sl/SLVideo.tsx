import React from "react";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, getInputProps, interpolate, staticFile, useCurrentFrame } from "remotion";
import edl from "../../public/slv/edl.json";
import w1 from "../../public/slv/cam1.json";
import w2 from "../../public/slv/cam2.json";

// SL · podcast a cámara + anime como B-roll. Abre a 9:16 y se encoge a ventana cuadrada; al final vuelve a 9:16 (bucle).
// Subtítulos = copia de la referencia (sans blanca + palabra clave en serif itálica), 2 colores: blanco + rojo.
loadFont({ family: "SLSans", url: staticFile("fonts/inter-latin-600-normal.woff2"), weight: "600" });
loadFont({ family: "SLSerif", url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: "TSans", url: staticFile("fonts/instrument-sans-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "TBig", url: staticFile("fonts/gloock-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "TItal", url: staticFile("fonts/playfair-display-latin-400-italic.woff2"), weight: "400", style: "italic" });

// Títulos editoriales (gancho y frases clave). seg: [texto, fuente, tamaño, color]
type TSeg = [string, string, number, string];
type TLine = { segs: TSeg[]; x: number; y: number; anchor?: "start" | "middle" | "end" };
type Title = { s: number; e: number; lines: TLine[] };
const FONT: Record<string, [string, string, string]> = { S: ["TSans", "normal", "500"], B: ["TBig", "normal", "400"], I: ["TItal", "italic", "400"], R: ["SLSerif", "italic", "400"] };
const W_ = "#FFFFFF";
const Titles: React.FC<{ t: number; T: Title[] }> = ({ t, T }) => {
  const ti = T.find((x) => t >= x.s && t < x.e);
  if (!ti) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <filter id="tsh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.7" /></filter>
        <filter id="tgl" x="-20%" y="-60%" width="140%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FF5A5A" floodOpacity="0.45" result="a" /><feDropShadow in="a" dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.7" /></filter>
      </defs>
      {ti.lines.map((l, k) => {
        const a = interpolate(t, [ti.s + k * 0.12, ti.s + k * 0.12 + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const red = l.segs.some((sg) => sg[3] === RED);
        return (
          <text key={k} x={l.x} y={l.y + (1 - a) * 8} textAnchor={l.anchor ?? "start"} opacity={a} filter={red ? "url(#tgl)" : "url(#tsh)"}>
            {l.segs.map(([txt, f, size, c], j) => { const [fam, st, w] = FONT[f]; return <tspan key={j} fontFamily={fam} fontStyle={st} fontWeight={w} fontSize={size} fill={c} letterSpacing={f === "B" ? -3 : 0}>{txt}</tspan>; })}
          </text>
        );
      })}
    </svg>
  );
};

const FPS = 30;
const RED = "#D0101E";
type Wd = { w: string; s: number; e: number };
type Clip = [number, number, string, number];
const clean = (s: string) => s.replace(/[.,;:¿?¡!…]/g, "");
const norm = (s: string) => clean(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Group = { s: number; e: number; lead: string; key: string };
const groupsOf = (W: Wd[], keys: Set<string>): Group[] => {
  const out: Group[] = [];
  let cur: Wd[] = [];
  const flush = (key?: Wd) => {
    if (!cur.length && !key) return;
    const all = key ? [...cur, key] : cur;
    out.push({ s: all[0].s, e: all[all.length - 1].e, lead: cur.map((w) => clean(w.w)).join(" "), key: key ? clean(key.w) : "" });
    cur = [];
  };
  W.forEach((w, i) => {
    const prev = W[i - 1];
    if (cur.length && prev && (w.s - prev.e > 0.35 || /[.,?!]$/.test(prev.w) || cur.length >= 3)) flush();
    if (keys.has(norm(w.w))) flush(w);
    else cur.push(w);
  });
  flush();
  return out;
};

const shadow = "0 3px 10px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)";
const Captions: React.FC<{ t: number; G: Group[] }> = ({ t, G }) => {
  const g = G.find((x, i) => t >= x.s - 0.05 && t < (G[i + 1]?.s ?? x.e + 0.8) - 0.05);
  if (!g) return null;
  const a = interpolate(t, [g.s - 0.05, g.s + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1255, textAlign: "center", opacity: a }}>
      <div style={{ fontFamily: "SLSans", fontWeight: 600, fontSize: 46, lineHeight: 1.0, color: "#fff", textShadow: shadow, letterSpacing: -0.3 }}>{g.lead}</div>
    </div>
  );
};

const Win: React.FC<{ f: number; total: number; children: React.ReactNode }> = ({ f, total, children }) => {
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const p = Math.min(interpolate(f, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }), interpolate(f, [total - 11, total - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }));
  const w = 1080 + (1000 - 1080) * p, h = 1920 + (1000 - 1920) * p, r = 34 * p;
  return (
    <div style={{ position: "absolute", left: (1080 - w) / 2, top: (1920 - h) / 2, width: w, height: h, borderRadius: r, overflow: "hidden", background: "#000" }}>
      {children}
    </div>
  );
};

const Fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

const SLVideo: React.FC<{ v: "v1" | "v2"; cam: string; W: Wd[]; keys: string[]; T: Title[]; song: string; songFrom: number; songVol: number; total: number }> = ({ v, cam, W, keys, T, song, songFrom, songVol, total }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const G = React.useMemo(() => groupsOf(W, new Set<string>()), [W]);
  void keys;
  const clips = (edl as unknown as Record<string, Clip[]>)[v];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Win f={f} total={total}>
        <OffthreadVideo src={staticFile(`slv/${cam}.mp4`)} muted style={{ ...Fill, objectPosition: "50% 36%", transform: `scale(${1.02 + t * 0.0012})`, filter: "brightness(0.74) contrast(1.16) saturate(0.82) sepia(0.12)" }} />
        {clips.map(([t0, t1, c, inp], i) => (
          <Sequence key={i} from={Math.round(t0 * FPS)} durationInFrames={Math.max(1, Math.round((t1 - t0) * FPS))} layout="none">
            <OffthreadVideo src={staticFile(`slv/anime/${c}.mp4`)} muted trimBefore={Math.round(inp * FPS)} style={{ ...Fill, objectPosition: "50% 45%", filter: "contrast(1.06) saturate(0.95)" }} />
          </Sequence>
        ))}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }} />
      </Win>
      {getInputProps().nocap ? null : T.some((x) => t >= x.s && t < x.e) ? <Titles t={t} T={T} /> : <Captions t={t} G={G} />}
      <Audio src={staticFile(`slv/${cam}.mp4`)} />
      <Audio src={staticFile(`slv/${song}.wav`)} trimBefore={Math.round(songFrom * FPS)} volume={(fr) => songVol * interpolate(fr, [0, 3, total - 20, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

const K1 = ["tu", "mal", "tarde", "distraido", "otros", "dia", "gana", "cuenta", "ajenos", "tuyas", "dormir", "casa", "viajo", "negocio", "anos", "momento", "rival", "ayer", "nadie", "ti"];
const K2 = ["mejorar", "amigos", "advierte", "viernes", "cambiaste", "solo", "pena", "vale", "soledad", "castigo", "prueba", "entrenas", "estudias", "trabajando", "resultado", "equipo", "pasado", "despues", "convertiste"];
const T1: Title[] = [
  { s: 0, e: 3.25, lines: [{ segs: [["Sientes que todos", "S", 54, W_]], x: 235, y: 1110 }, { segs: [["avanzan", "B", 170, W_]], x: 540, y: 1245, anchor: "middle" }, { segs: [["menos tú.", "R", 110, RED]], x: 860, y: 1335, anchor: "end" }] },
  { s: 6.05, e: 8.35, lines: [{ segs: [["No vas tarde.", "S", 56, W_]], x: 250, y: 1175 }, { segs: [["Vas ", "R", 100, W_], ["distraído.", "B", 145, RED]], x: 540, y: 1320, anchor: "middle" }] },
  { s: 35.95, e: 38.6, lines: [{ segs: [["Tu único rival", "S", 54, W_]], x: 235, y: 1150 }, { segs: [["es el que fuiste", "I", 70, W_]], x: 845, y: 1225, anchor: "end" }, { segs: [["ayer.", "B", 190, RED]], x: 540, y: 1375, anchor: "middle" }] },
];
const T2: Title[] = [
  { s: 0, e: 3.25, lines: [{ segs: [["Cuando empieces a mejorar,", "S", 50, W_]], x: 225, y: 1110 }, { segs: [["vas a perder", "R", 96, W_]], x: 225, y: 1200 }, { segs: [["amigos.", "B", 180, RED]], x: 860, y: 1345, anchor: "end" }] },
  { s: 18.5, e: 20.5, lines: [{ segs: [["No es un castigo.", "S", 56, W_]], x: 250, y: 1175 }, { segs: [["Es una ", "R", 96, W_], ["prueba.", "B", 150, RED]], x: 540, y: 1320, anchor: "middle" }] },
  { s: 27.6, e: 30.55, lines: [{ segs: [["Los que se van", "S", 54, W_]], x: 235, y: 1150 }, { segs: [["no eran tu equipo.", "I", 66, W_]], x: 845, y: 1222, anchor: "end" }, { segs: [["Eran tu ", "R", 90, W_], ["pasado.", "B", 150, RED]], x: 540, y: 1365, anchor: "middle" }] },
];
export const SLV1_TOTAL = Math.round(41.68 * FPS);
export const SLV2_TOTAL = Math.round(34.55 * FPS);
export const SLV1: React.FC = () => <SLVideo v="v1" cam="cam1" W={w1 as Wd[]} keys={K1} T={T1} song="songA" songFrom={60} songVol={0.16} total={SLV1_TOTAL} />;
export const SLV2: React.FC = () => <SLVideo v="v2" cam="cam2" W={w2 as Wd[]} keys={K2} T={T2} song="songB" songFrom={0} songVol={0.11} total={SLV2_TOTAL} />;

// ===== Edit estoico: sin voz, frases "X mató Y" en el golpe, Vinland Saga, portada = cuadro 0 =====
const STOIC: { at: number; a: string; b: string; clip: [string, number] }[] = [
  { at: 2.04, a: "comodidad", b: "disciplina", clip: ["a12", 0.2] },
  { at: 2.81, a: "excusa", b: "progreso", clip: ["a_vinland", 20.8] },
  { at: 3.6, a: "queja", b: "tiempo", clip: ["a12", 6.5] },
  { at: 4.39, a: "ego", b: "aprendizaje", clip: ["a_vinland", 11.7] },
  { at: 5.22, a: "ira", b: "razón", clip: ["a_vinland", 24.7] },
  { at: 5.99, a: "miedo", b: "acción", clip: ["a12", 9.1] },
  { at: 6.73, a: "prisa", b: "paciencia", clip: ["a_vinland", 22.1] },
  { at: 7.48, a: "placer", b: "propósito", clip: ["a12", 14.3] },
  { at: 8.27, a: "opinión", b: "libertad", clip: ["a12", 10.4] },
  { at: 9.01, a: "venganza", b: "paz", clip: ["a_vinland", 7.8] },
  { at: 9.78, a: "pasado", b: "presente", clip: ["a12", 18.2] },
];
const ST_END = 10.57;
export const SLST_TOTAL = Math.round(12.86 * FPS);
const ST_TITLES: Title[] = [
  { s: 0, e: 2.04, lines: [{ segs: [["Esto te está", "S", 56, W_]], x: 250, y: 1150 }, { segs: [["matando", "B", 190, RED]], x: 540, y: 1300, anchor: "middle" }, { segs: [["en silencio.", "R", 96, W_]], x: 850, y: 1380, anchor: "end" }] },
  { s: ST_END, e: 99, lines: [{ segs: [["Domínate", "B", 200, W_]], x: 540, y: 1270, anchor: "middle" }, { segs: [["o te dominarán.", "R", 104, RED]], x: 540, y: 1375, anchor: "middle" }] },
];
export const SLStoic: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, total = SLST_TOTAL;
  const i = STOIC.findIndex((p, k) => t >= p.at && t < (STOIC[k + 1]?.at ?? ST_END));
  const titleT = f === 0 ? 99 : t; // cuadro 0 = portada con el título completo
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Win f={f} total={total}>
        <OffthreadVideo src={staticFile("slv/anime/a12.mp4")} muted trimBefore={Math.round(22.1 * FPS)} style={{ ...Fill, filter: "contrast(1.06)" }} />
        {STOIC.map((p, k) => (
          <Sequence key={k} from={Math.round(p.at * FPS)} durationInFrames={Math.round(((STOIC[k + 1]?.at ?? ST_END) - p.at) * FPS)} layout="none">
            <OffthreadVideo src={staticFile(`slv/anime/${p.clip[0]}.mp4`)} muted trimBefore={Math.round(p.clip[1] * FPS)} style={{ ...Fill, filter: "contrast(1.06) saturate(0.92)" }} />
          </Sequence>
        ))}
        <Sequence from={Math.round(ST_END * FPS)} layout="none">
          <OffthreadVideo src={staticFile("slv/anime/a12.mp4")} muted trimBefore={Math.round(23.4 * FPS)} style={{ ...Fill, filter: "contrast(1.06)" }} />
        </Sequence>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 100%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 22% at 50% 62%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)" }} />
      </Win>
      {i >= 0 ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 1105, textAlign: "center", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: "SLSans", fontWeight: 600, fontSize: 70, color: "#fff", textShadow: shadow }}>{STOIC[i].a} </span>
          <span style={{ fontFamily: "SLSerif", fontStyle: "italic", fontSize: 112, color: RED, textShadow: `0 0 14px rgba(255,60,60,0.5), ${shadow}` }}>mató</span>
          <span style={{ fontFamily: "SLSans", fontWeight: 600, fontSize: 70, color: "#fff", textShadow: shadow }}> {STOIC[i].b}</span>
        </div>
      ) : (
        <Titles t={titleT === 99 ? 1 : t} T={ST_TITLES} />
      )}
      <Audio src={staticFile("slv/stoic.wav")} volume={(fr) => 0.9 * interpolate(fr, [0, 2, total - 12, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
