import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";

// SL · plantilla "una sola persona": escena a pantalla completa desde el fotograma 0, voz encima, golpes dramáticos y subtítulos de cine.
export type TL = { end: number; shots: { T: number; T1: number; beat?: number; card?: number }[]; words: [string, number, number][]; beats: [number, number][]; card: { t: number; lines: string[] } };
const FPS = 30;
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const FONTS: [string, string, string, string?][] = [
  ["MCinzel", "cinzel-latin-900-normal", "900"], ["MBebas", "bebas-neue-latin-400-normal", "400"], ["MPlayI", "playfair-display-latin-900-italic", "900", "italic"],
  ["MPop", "poppins-latin-800-normal", "800"], ["MKaushan", "kaushan-script-latin-400-normal", "400"], ["MMarker", "permanent-marker-latin-400-normal", "400"], ["MInstr", "instrument-serif-latin-400-italic", "400", "italic"],
];
FONTS.forEach(([fam, file, w, st]) => loadFont({ family: fam, url: staticFile(`fonts/${file}.woff2`), weight: w, style: st ?? "normal" }));
const STOP = new Set(["el", "la", "los", "las", "de", "del", "que", "y", "a", "en", "un", "una", "no", "se", "te", "lo", "le", "es", "por", "para", "con", "al", "tu", "mi", "su", "sus", "más", "pero", "esta", "este", "ese", "ni", "tú", "él", "ella", "yo", "sin", "hasta", "cuando", "quién", "era", "fue", "va", "hace", "tras"]);
const clean = (x: string) => x.replace(/[.,;:«»"…!?¿¡]+/g, "");
type G = { w: [string, number, number][]; s: number; e: number };
const groupsOf = (words: [string, number, number][]): G[] => {
  const out: G[] = [];
  let cur: G | null = null;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const long = clean(w[0]).length >= 9;
    const brk = !cur || cur.w.length >= 2 || long || clean(cur.w[cur.w.length - 1][0]).length >= 9 || w[1] - prev[2] > 0.25 || /[.,;:»…?!]$/.test(prev[0]);
    if (brk) { cur = { w: [], s: w[1], e: w[2] }; out.push(cur); }
    cur!.w.push(w); cur!.e = w[2];
  });
  out.forEach((g, i) => { const nx = out[i + 1]; g.e = Math.min(nx ? nx.s : g.e + 0.6, Math.max(g.e + 0.25, g.s + 0.5)); });
  return out;
};
// 4 estilos base que rotan + estilo de palabra clave (más grande, color del video, brillo)
const PRE = [
  { f: "MCinzel", up: true, ls: 6, size: 96, st: "normal" },
  { f: "MBebas", up: true, ls: 5, size: 156, st: "normal" },
  { f: "MPlayI", up: false, ls: 0, size: 112, st: "italic" },
  { f: "MPop", up: true, ls: 2, size: 88, st: "normal" },
];
const KEYF = [{ f: "MKaushan", up: false, ls: 1, size: 150, st: "normal" }, { f: "MPlayI", up: false, ls: 0, size: 150, st: "italic" }, { f: "MMarker", up: true, ls: 2, size: 128, st: "normal" }];

const Subs: React.FC<{ t: number; groups: G[]; keys: Set<string>; accent: string }> = ({ t, groups, keys, accent }) => {
  const gi = groups.findIndex((g) => t >= g.s - 0.03 && t < g.e);
  if (gi < 0) return null;
  const g = groups[gi];
  const P = PRE[(gi * 3 + (gi >> 2)) % 4];
  const out = ip(g.e - t, [0, 0.08], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1060, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: 26, rowGap: 0, opacity: out }}>
      {g.w.map((w, i) => {
        const raw = clean(w[0]);
        const k = keys.has(raw.toLowerCase());
        const st = k ? KEYF[gi % KEYF.length] : P;
        const on = t >= w[1] - 0.03;
        const a = t - (w[1] - 0.03);
        const pop = on ? ip(a, [0, 0.07, 0.16], [k ? 1.35 : 1.18, 0.97, 1]) : 1;
        const txt = st.up ? raw.toUpperCase() : raw;
        const len = Math.max(3, txt.length);
        const size = Math.min(st.size, (k ? 980 : 900) / (len * (st.f === "MBebas" ? 0.42 : st.f === "MCinzel" ? 0.78 : 0.6)));
        return (
          <span key={i} style={{ fontFamily: st.f, fontStyle: st.st, fontWeight: 900, fontSize: size, letterSpacing: st.ls, lineHeight: 1.0, color: k ? accent : "#FFFFFF", opacity: on ? ip(a, [0, 0.05], [0, 1]) : 0, transform: `scale(${pop}) rotate(${k ? -3 : 0}deg)`, display: "inline-block", filter: on && a < 0.1 ? `blur(${ip(a, [0, 0.1], [5, 0])}px)` : undefined, WebkitTextStroke: "2px rgba(0,0,0,0.55)", paintOrder: "stroke fill", textShadow: k ? `0 0 26px ${accent}, 0 0 54px ${accent}88, 0 6px 16px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)` : "0 5px 16px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.95), 0 0 2px #000" }}>
            {txt}
          </span>
        );
      })}
    </div>
  );
};

const Card: React.FC<{ t: number; t0: number; lines: string[]; accent: string }> = ({ t, t0, lines, accent }) => {
  if (t < t0) return null;
  const st = [
    { f: "MPlayI", size: 104, color: "#FFFFFF", st: "italic", up: false, ls: 0 },
    { f: "MPop", size: 64, color: accent, st: "normal", up: true, ls: 4 },
    { f: "MCinzel", size: 112, color: "#FFFFFF", st: "normal", up: true, ls: 6 },
  ];
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 760, textAlign: "center" }}>
      <div style={{ position: "absolute", inset: "-120px -40px", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)" }} />
      {lines.map((l, i) => {
        const a = t - (t0 + 0.15 + i * 0.55);
        if (a < 0) return <div key={i} style={{ height: st[i % 3].size * 1.1 }} />;
        const s = st[i % 3];
        return <div key={i} style={{ position: "relative", fontFamily: s.f, fontStyle: s.st, fontWeight: 900, fontSize: s.size, letterSpacing: s.ls, lineHeight: 1.1, color: s.color, opacity: ip(a, [0, 0.12], [0, 1]), transform: `translateY(${ip(a, [0, 0.2], [30, 0])}px) scale(${ip(a, [0, 0.12, 0.25], [1.2, 0.98, 1])})`, textShadow: s.color === "#FFFFFF" ? "0 6px 20px rgba(0,0,0,0.95)" : `0 0 26px ${s.color}, 0 6px 20px rgba(0,0,0,0.95)` }}>{s.up ? l.toUpperCase() : l}</div>;
      })}
    </div>
  );
};

export const SLMobCore: React.FC<{ tl: TL; dir: string; accent: string; keys: string[]; music?: boolean }> = ({ tl, dir, accent, keys, music }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const groups = React.useMemo(() => groupsOf(tl.words), [tl]);
  const K = React.useMemo(() => new Set(keys), [keys]);
  const hits = React.useMemo(() => [0, ...tl.words.filter((w) => K.has(clean(w[0]).toLowerCase())).map((w) => w[1]), ...tl.beats.map((b) => b[0])], [tl, K]);
  const last = hits.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 9);
  const beatOn = tl.beats.find(([b, d]) => t >= b && t < b + d);
  const flash = tl.beats.reduce((m, [b]) => Math.max(m, t >= b ? Math.exp(-(t - b) * 14) : 0), 0);
  const shake = beatOn && beatOn[1] >= 1.5 ? 1 : 0;
  const cam = `translate(${(random(`x${f}`) - 0.5) * (14 * kick + 18 * shake * Math.exp(-(t - (beatOn?.[0] ?? 0)) * 2))}px, ${(random(`y${f}`) - 0.5) * (14 * kick + 18 * shake * Math.exp(-(t - (beatOn?.[0] ?? 0)) * 2))}px) scale(${1 + 0.06 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: cam }}>
        {tl.shots.map((s, i) => {
          const from = i === 0 ? 0 : S(s.T);
          const dur = Math.max(1, S(s.T1) - from);
          const z = ip(f - from, [0, dur], [1.03, s.beat !== undefined ? 1.16 : 1.1]);
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${i % 2 ? 46 : 54}% 42%` }}>
                <OffthreadVideo src={staticFile(`${dir}/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {/* luz de cine: viñeta suave, grano, destello del color del video en cada golpe */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 75% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.42) 100%)" }} />
      <AbsoluteFill style={{ background: accent, opacity: flash * 0.5, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.25 }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "screen", pointerEvents: "none" }}>
        <filter id="mobg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter="url(#mobg)" />
      </svg>
      {t < tl.card.t ? <Subs t={t} groups={groups} keys={K} accent={accent} /> : <Card t={t} t0={tl.card.t} lines={tl.card.lines} accent={accent} />}
      <Audio src={staticFile(`${dir}/${music ? "mezcla-musica" : "mezcla"}.wav`)} />
    </AbsoluteFill>
  );
};
