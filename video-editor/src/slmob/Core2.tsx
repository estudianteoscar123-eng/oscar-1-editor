import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";

// SL v3 · escenas con doblaje latino + voz; portada dentro del video (fotogramas 0–2), subtítulos con las tipografías de referencia
// (Inter 900 blanco con sombra 3D suave, Anton para golpes, pincel en el color del video para emociones) y palabra clave del CTA en grande.
export type TL3 = { end: number; shots: { T: number; T1: number }[]; words: [string, number, number, string][] };
const FPS = 30;
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
([["VInter", "inter-latin-900-normal", "900"], ["VInter8", "inter-latin-800-normal", "800"], ["VAnton", "anton-latin-400-normal", "400"], ["VMarker", "permanent-marker-latin-400-normal", "400"], ["VDm", "dm-sans-latin-700-normal", "700"]] as const).forEach(([fam, file, w]) => loadFont({ family: fam, url: staticFile(`fonts/${file}.woff2`), weight: w }));
const clean = (x: string) => x.replace(/[.,;:«»"…!?¿¡]+/g, "");
type G = { w: [string, number, number, string][]; s: number; e: number; d: boolean };
const groupsOf = (words: [string, number, number, string][]): G[] => {
  const out: G[] = [];
  let cur: G | null = null;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const brk = !cur || cur.w.length >= 2 || clean(w[0]).length >= 9 || clean(cur.w[cur.w.length - 1][0]).length >= 9 || w[1] - prev[2] > 0.25 || /[.,;:»…?!]$/.test(prev[0]) || prev[3] !== w[3];
    if (brk) { cur = { w: [], s: w[1], e: w[2], d: w[3] === "D" }; out.push(cur); }
    cur!.w.push(w); cur!.e = w[2];
  });
  out.forEach((g, i) => { const nx = out[i + 1]; g.e = Math.min(nx ? nx.s : g.e + 0.6, Math.max(g.e + 0.25, g.s + 0.5)); });
  return out;
};
const SH3D = "0 2px 0 rgba(0,0,0,0.35), 0 10px 22px rgba(0,0,0,0.55), 0 22px 40px rgba(0,0,0,0.45)";
const IMPACT = new Set(["mil", "nunca", "jamás", "perdedor", "inútil", "genio", "parar", "fuerte", "miedo", "nadie", "golpeaban", "humillaron", "suelo", "box"]);

const Subs: React.FC<{ t: number; groups: G[]; keys: Set<string>; accent: string }> = ({ t, groups, keys, accent }) => {
  const gi = groups.findIndex((g) => t >= g.s - 0.03 && t < g.e);
  if (gi < 0) return null;
  const g = groups[gi];
  const out = ip(g.e - t, [0, 0.08], [0, 1]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1080, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: 24, opacity: out }}>
      {g.w.map((w, i) => {
        const raw = clean(w[0]);
        const lw = raw.toLowerCase();
        const k = keys.has(lw);
        const imp = !k && IMPACT.has(lw);
        const on = t >= w[1] - 0.03;
        const a = t - (w[1] - 0.03);
        const pop = on ? ip(a, [0, 0.07, 0.16], [k ? 1.32 : 1.15, 0.97, 1]) : 1;
        const fam = k ? "VMarker" : imp ? "VAnton" : g.d ? "VDm" : "VInter";
        const txt = k ? raw : raw.toUpperCase();
        const base = k ? 140 : imp ? 150 : g.d ? 84 : 98;
        const size = Math.min(base, 940 / (Math.max(3, txt.length) * (fam === "VAnton" ? 0.46 : fam === "VMarker" ? 0.62 : 0.66)));
        return (
          <span key={i} style={{ fontFamily: fam, fontWeight: 900, fontSize: size, letterSpacing: fam === "VInter" ? -2 : 1, lineHeight: 1.0, color: k ? accent : g.d ? "#F4F4F4" : "#FFFFFF", fontStyle: g.d && !k ? "italic" : "normal", opacity: on ? ip(a, [0, 0.05], [0, 1]) : 0, transform: `scale(${pop}) rotate(${k ? -3 : 0}deg)`, display: "inline-block", textShadow: k ? `0 0 24px ${accent}, 0 0 50px ${accent}99, ${SH3D}` : SH3D }}>
            {g.d && i === 0 ? "«" : ""}{txt}{g.d && i === g.w.length - 1 && /[.?!»]$/.test(w[0]) ? "»" : ""}
          </span>
        );
      })}
    </div>
  );
};

export const SLV3Core: React.FC<{ tl: TL3; dir: string; accent: string; keys: string[]; cover: [string, string]; cta: string; music?: boolean; bw?: string[] }> = ({ tl, dir, accent, keys, cover, cta, music, bw }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const groups = React.useMemo(() => groupsOf(tl.words), [tl]);
  const K = React.useMemo(() => new Set(keys), [keys]);
  const hits = React.useMemo(() => [0, ...tl.words.filter((w) => K.has(clean(w[0]).toLowerCase())).map((w) => w[1])], [tl, K]);
  const last = hits.filter((h) => h <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 9);
  const cutT = tl.shots.map((s) => s.T).filter((c) => c <= t).pop() ?? -9;
  const flash = Math.exp(-(t - cutT) * 18) * 0.18;
  const ctaW = tl.words.find((w) => clean(w[0]).toLowerCase() === "comenta");
  const ctaOn = ctaW ? ip(t, [ctaW[1], ctaW[1] + 0.2], [0, 1]) * (tl.words.some((w) => w[3] === "D" && w[1] > ctaW[1] && t > w[1] - 0.1) ? 0 : 1) : 0;
  const isCover = f < 3;
  const bwT = React.useMemo(() => tl.words.filter((w) => (bw ?? []).includes(clean(w[0]).toLowerCase())).map((w) => w[1]), [tl, bw]);
  const bwLast = bwT.filter((h) => h <= t + 0.02).pop() ?? -9;
  const gray = isCover ? 0 : ip(t - bwLast, [0, 1.6, 1.8], [1, 1, 0]);
  const cam = `translate(${(random(`x${f}`) - 0.5) * 12 * kick}px, ${(random(`y${f}`) - 0.5) * 12 * kick}px) scale(${1 + 0.05 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: cam, filter: gray > 0.01 ? `grayscale(${gray}) contrast(${1 + 0.15 * gray})` : undefined }}>
        {tl.shots.map((s, i) => {
          const from = i === 0 ? 0 : S(s.T);
          const dur = Math.max(1, S(s.T1) - from);
          const z = ip(f - from, [0, dur], [1.03, 1.1]);
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${i % 2 ? 46 : 54}% 42%` }}>
                <OffthreadVideo src={staticFile(`${dir}/s${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 75% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.42) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "screen", pointerEvents: "none" }}>
        <filter id="v3g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={f % 5} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter="url(#v3g)" />
      </svg>
      {isCover ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 1180, textAlign: "center" }}>
          <div style={{ position: "absolute", inset: "-140px -60px", background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)" }} />
          <div style={{ position: "relative", fontFamily: "VInter8", fontWeight: 800, fontSize: 66, color: "#fff", letterSpacing: -1, textShadow: SH3D }}>{cover[0]}</div>
          <div style={{ position: "relative", fontFamily: "VAnton", fontSize: 170, lineHeight: 1.0, color: accent, textShadow: `0 0 30px ${accent}, ${SH3D}` }}>{cover[1]}</div>
        </div>
      ) : (
        <>
          <Subs t={t} groups={groups} keys={K} accent={accent} />
          {ctaOn > 0.01 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: ctaOn, transform: `scale(${ip(ctaOn, [0, 1], [1.2, 1])})` }}>
              <div style={{ fontFamily: "VInter8", fontWeight: 800, fontSize: 52, color: "#fff", letterSpacing: 4, textShadow: SH3D }}>COMENTA</div>
              <div style={{ display: "inline-block", marginTop: 14, padding: "14px 40px", borderRadius: 26, background: accent, fontFamily: "VAnton", fontSize: 110, color: "#0A0A0A", boxShadow: `0 0 40px ${accent}, 0 18px 40px rgba(0,0,0,0.6)` }}>{cta}</div>
            </div>
          ) : null}
        </>
      )}
      <Audio src={staticFile(`${dir}/${music ? "mezcla-musica" : "mezcla"}.wav`)} />
    </AbsoluteFill>
  );
};
