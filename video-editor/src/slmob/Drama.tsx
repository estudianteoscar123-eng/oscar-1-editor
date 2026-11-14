import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import t1 from "../../public/sl-rocky/timeline.json";
import t2 from "../../public/sl-naruto/timeline.json";

// SL "drama" (réplica de las referencias analizadas a 30 fps):
// subtítulos CENTRADOS: palabra pequeña en cursiva + palabra grande condensada con sombra dura;
// la palabra clave pasa de blanco a color en ~10 fotogramas; blanco y negro en seco en las frases que duelen
// y vuelta al color en 6 fotogramas; planos alternos con barras (4:5) y pantalla completa; punch-zoom en cada corte.
type TL = { end: number; shots: { T: number; T1: number }[]; words: [string, number, number, string][] };
const FPS = 30;
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
([["DScript", "yellowtail-latin-400-normal", "400"], ["DBebas", "bebas-neue-latin-400-normal", "400"], ["DAnton", "anton-latin-400-normal", "400"], ["DSerif", "playfair-display-latin-700-italic", "700"]] as const).forEach(([fam, file, w]) =>
  loadFont({ family: fam, url: staticFile(`fonts/${file}.woff2`), weight: w, style: file.includes("italic") ? "italic" : "normal" }),
);
const clean = (x: string) => x.replace(/[.,;:«»"…!?¿¡]+/g, "");
const SMALL = new Set(["a", "al", "el", "la", "los", "las", "de", "del", "y", "que", "en", "un", "una", "no", "se", "su", "lo", "le", "me", "te", "mi", "tu", "es", "por", "con", "sin", "si", "pero", "o", "ni", "yo", "él", "más"]);
type G = { w: [string, number, number, string][]; s: number; e: number };
const groupsOf = (words: [string, number, number, string][]): G[] => {
  const out: G[] = [];
  let cur: G | null = null;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const bigs = cur ? cur.w.filter((x) => !SMALL.has(clean(x[0]).toLowerCase())).length : 0;
    const brk = !cur || bigs >= 1 && !SMALL.has(clean(w[0]).toLowerCase()) || cur.w.length >= 3 || w[1] - prev[2] > 0.3 || /[.,;:?!…]$/.test(prev[0]) || prev[3] !== w[3];
    if (brk) { cur = { w: [], s: w[1], e: w[2] }; out.push(cur); }
    cur!.w.push(w); cur!.e = w[2];
  });
  out.forEach((g, i) => { const nx = out[i + 1]; g.e = Math.min(nx ? nx.s : g.e + 0.6, Math.max(g.e + 0.2, g.s + 0.45)); });
  return out;
};
const HARD = "0 6px 0 rgba(0,0,0,0.85), 0 14px 26px rgba(0,0,0,0.6)";

const Subs: React.FC<{ t: number; groups: G[]; keys: Set<string>; sad: Set<string>; accent: string }> = ({ t, groups, keys, sad, accent }) => {
  const g = groups.find((x) => t >= x.s - 0.03 && t < x.e);
  if (!g) return null;
  const small = g.w.filter((w) => SMALL.has(clean(w[0]).toLowerCase()));
  const big = g.w.filter((w) => !SMALL.has(clean(w[0]).toLowerCase()));
  const lead = big.length ? small.filter((w) => w[1] <= big[0][1]) : [];
  const main = big.length ? g.w.filter((w) => !lead.includes(w)) : g.w;
  const a0 = t - (g.s - 0.03);
  const isKey = main.some((w) => keys.has(clean(w[0]).toLowerCase()));
  const isSad = main.some((w) => sad.has(clean(w[0]).toLowerCase()));
  const mainOn = main.length ? t >= main[0][1] - 0.03 : false;
  const am = main.length ? t - (main[0][1] - 0.03) : 0;
  const txt = main.map((w) => clean(w[0])).join(" ").toUpperCase();
  const col = isKey ? `color-mix(in srgb, #FFFFFF ${Math.round(100 * (1 - ip(am, [0.05, 0.38], [0, 1])))}%, ${accent})` : "#FFFFFF";
  const fam = isSad ? "DSerif" : "DBebas";
  const size = Math.min(isSad ? 150 : 190, 980 / (Math.max(3, txt.length) * (isSad ? 0.55 : 0.43)));
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: ip(g.e - t, [0, 0.07], [0, 1]) }}>
      {lead.length ? (
        <div style={{ fontFamily: "DScript", fontSize: 92, color: "#F4F4F4", lineHeight: 0.8, marginBottom: -18, opacity: ip(a0, [0, 0.12], [0, 1]), transform: `translateY(${ip(a0, [0, 0.15], [10, 0])}px)`, textShadow: "0 4px 14px rgba(0,0,0,0.8)", zIndex: 2 }}>
          {lead.map((w) => clean(w[0])).join(" ").replace(/^./, (c) => c.toUpperCase())}
        </div>
      ) : null}
      {main.length ? (
        <div style={{ fontFamily: fam, fontStyle: isSad ? "italic" : "normal", fontWeight: isSad ? 700 : 400, fontSize: size, lineHeight: 0.95, letterSpacing: isSad ? 0 : 1, color: isSad ? "#F2F2F2" : col, opacity: mainOn ? ip(am, [0, 0.1], [0, 1]) : 0, transform: `scale(${mainOn ? ip(am, [0, 0.08, 0.18], [1.18, 0.98, 1]) : 1})`, textShadow: isKey && !isSad ? `0 0 ${Math.round(28 * ip(am, [0.1, 0.4], [0, 1]))}px ${accent}, ${HARD}` : HARD }}>
          {txt}
        </div>
      ) : null}
    </div>
  );
};

const DramaCore: React.FC<{ tl: TL; dir: string; accent: string; keys: string[]; sad: string[]; bw: string[]; cover: [string, string]; music?: boolean }> = ({ tl, dir, accent, keys, sad, bw, cover, music }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const groups = React.useMemo(() => groupsOf(tl.words), [tl]);
  const K = React.useMemo(() => new Set(keys), [keys]);
  const SAD = React.useMemo(() => new Set(sad), [sad]);
  const bwT = React.useMemo(() => tl.words.filter((w) => bw.includes(clean(w[0]).toLowerCase())).map((w) => w[1]), [tl, bw]);
  const bwLast = bwT.filter((h) => h <= t + 0.02).pop() ?? -9;
  const isCover = f < 3;
  const gray = isCover ? 0 : ip(t - bwLast, [0, 1.8, 2.0], [1, 1, 0]);
  const si = tl.shots.findIndex((s, i) => t >= s.T && (i === tl.shots.length - 1 || t < tl.shots[i + 1].T));
  const cutT = si >= 0 ? tl.shots[si].T : 0;
  const punch = Math.exp(-(t - cutT) * 10);
  const lb = si % 4 === 2; // uno de cada cuatro planos con barras (4:5), como en las referencias
  const shake = `translate(${(random(`x${f}`) - 0.5) * 8 * punch}px, ${(random(`y${f}`) - 0.5) * 8 * punch}px)`;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: shake, filter: gray > 0.01 ? `grayscale(${gray}) contrast(${1 + 0.2 * gray})` : undefined }}>
        {tl.shots.map((s, i) => {
          const from = i === 0 ? 0 : S(s.T);
          const dur = Math.max(1, S(s.T1) - from);
          const z = ip(f - from, [0, 4, dur], [1.12, 1.04, 1.1]);
          const L = i % 4 === 2;
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <AbsoluteFill style={{ transform: `scale(${L ? z * 0.84 : z})`, transformOrigin: "50% 45%" }}>
                <OffthreadVideo src={staticFile(`${dir}/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {lb && !isCover ? <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 290, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 290, background: "#000" }} /></> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: isCover ? 0 : punch * 0.12 }} />
      {isCover ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: "DScript", fontSize: 110, color: "#fff", marginBottom: -24, textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}>{cover[0]}</div>
          <div style={{ fontFamily: "DBebas", fontSize: 200, lineHeight: 0.95, color: accent, padding: "0 30px", textShadow: `0 0 30px ${accent}, ${HARD}` }}>{cover[1]}</div>
        </AbsoluteFill>
      ) : (
        <Subs t={t} groups={groups} keys={K} sad={SAD} accent={accent} />
      )}
      <Audio src={staticFile(`${dir}/${music ? "mezcla-musica" : "mezcla"}.wav`)} />
    </AbsoluteFill>
  );
};

const T1 = t1 as unknown as TL;
const T2 = t2 as unknown as TL;
export const SLROCKY_TOTAL = S(T1.end);
export const SLNARUTO_TOTAL = S(T2.end);
export const SLRocky: React.FC<{ music?: boolean }> = ({ music }) => (
  <DramaCore tl={T1} dir="sl-rocky" accent="#FF3030" music={music} cover={["¿Y si tu familia", "NO CREE EN TI?"]}
    keys={["rocky", "hijo", "chiste", "entrenó", "frase", "derrotado", "vida", "avanzando", "ti", "importa", "favor", "fe"]}
    sad={["avergonzó", "dolió", "duda", "broma"]} bw={["hijo", "dolió", "derrotado", "duda"]} />
);
export const SLNaruto: React.FC<{ music?: boolean }> = ({ music }) => (
  <DramaCore tl={T2} dir="sl-naruto" accent="#FF8A1E" music={music} cover={["¿Y si nadie", "TE VIERA?"]}
    keys={["pueblo", "odiaba", "niño", "ruido", "verdad", "monstruo", "hombre", "persona", "naruto", "uzumaki", "fuerza", "crea", "aldea"]}
    sad={["padres", "amigos", "invisible", "imaginaba"]} bw={["padres", "verdad", "monstruo", "invisible"]} />
);
