import React from "react";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import edl from "../../public/slv/edl.json";
import w1 from "../../public/slv/cam1.json";
import w2 from "../../public/slv/cam2.json";

// SL · podcast a cámara + anime como B-roll. Abre a 9:16 y se encoge a ventana cuadrada; al final vuelve a 9:16 (bucle).
// Subtítulos = copia de la referencia (sans blanca + palabra clave en serif itálica), 2 colores: blanco + rojo.
loadFont({ family: "SLSans", url: staticFile("fonts/inter-latin-600-normal.woff2"), weight: "600" });
loadFont({ family: "SLSerif", url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });

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
    if (cur.length && prev && (w.s - prev.e > 0.35 || /[.,?!]$/.test(prev.w) || cur.length >= 4)) flush();
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
    <div style={{ position: "absolute", left: 90, right: 90, top: 1240, textAlign: "center", opacity: a }}>
      {g.lead ? <div style={{ fontFamily: "SLSans", fontWeight: 600, fontSize: 58, lineHeight: 1.0, color: "#fff", textShadow: shadow, letterSpacing: -0.5 }}>{g.lead}</div> : null}
      {g.key ? <div style={{ fontFamily: "SLSerif", fontStyle: "italic", fontSize: 128, lineHeight: 0.95, color: RED, textShadow: `0 0 16px rgba(255,60,60,0.45), ${shadow}`, marginTop: g.lead ? -6 : 0 }}>{g.key}</div> : null}
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

const SLVideo: React.FC<{ v: "v1" | "v2"; cam: string; W: Wd[]; keys: string[]; song: string; songFrom: number; songVol: number; total: number }> = ({ v, cam, W, keys, song, songFrom, songVol, total }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const G = React.useMemo(() => groupsOf(W, new Set(keys)), [W, keys]);
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
      <Captions t={t} G={G} />
      <Audio src={staticFile(`slv/${cam}.mp4`)} />
      <Audio src={staticFile(`slv/${song}.wav`)} trimBefore={Math.round(songFrom * FPS)} volume={(fr) => songVol * interpolate(fr, [0, 3, total - 20, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

const K1 = ["tu", "mal", "tarde", "distraido", "otros", "dia", "gana", "cuenta", "ajenos", "tuyas", "dormir", "casa", "viajo", "negocio", "anos", "momento", "rival", "ayer", "nadie", "ti"];
const K2 = ["mejorar", "amigos", "advierte", "viernes", "cambiaste", "solo", "pena", "vale", "soledad", "castigo", "prueba", "entrenas", "estudias", "trabajando", "resultado", "equipo", "pasado", "despues", "convertiste"];
export const SLV1_TOTAL = Math.round(41.68 * FPS);
export const SLV2_TOTAL = Math.round(34.55 * FPS);
export const SLV1: React.FC = () => <SLVideo v="v1" cam="cam1" W={w1 as Wd[]} keys={K1} song="songA" songFrom={60} songVol={0.16} total={SLV1_TOTAL} />;
export const SLV2: React.FC = () => <SLVideo v="v2" cam="cam2" W={w2 as Wd[]} keys={K2} song="songB" songFrom={0} songVol={0.11} total={SLV2_TOTAL} />;
