import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/thorfinn/words.json";

// Prueba de 6 s para elegir el estilo de subtítulos de SL (A impacto · B bloque · C cine 3D).
const FPS = 30;
const T0 = 4.5;
export const SUBTEST_TOTAL = 6 * FPS;
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const back = Easing.out(Easing.back(2.2));
const out = Easing.out(Easing.cubic);
const SANS = "StSans", SCRIPT = "StScript", SERIF = "StSerif";
loadFont({ family: SANS, url: staticFile("fonts/poppins-latin-900-normal.woff2"), weight: "900" });
loadFont({ family: SCRIPT, url: staticFile("fonts/kaushan-script-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: SERIF, url: staticFile("fonts/cinzel-latin-900-normal.woff2"), weight: "900" });
const P8 = "StPoppins8", BEBAS = "StBebas";
loadFont({ family: P8, url: staticFile("fonts/poppins-latin-800-normal.woff2"), weight: "800" });
loadFont({ family: BEBAS, url: staticFile("fonts/bebas-neue-latin-400-normal.woff2"), weight: "400" });

type Wd = [string, number, number];
const W = (words as Wd[]).filter((w) => w[1] >= T0 - 0.05 && w[1] < T0 + 6).map((w) => [w[0].replace(/[.,]/g, ""), w[1] - T0, w[2] - T0] as Wd);
const KEYS: Record<string, string> = { thorfinn: "#F2C14E", secuelas: "#E0242F", odio: "#E0242F", pronto: "#4FD1C5", seis: "#F2C14E" };
const key = (w: string) => KEYS[w.toLowerCase()];
const CUTS = [4.5, 5.9, 6.7, 8.9, 10.2];
const PIECES = [3, 4, 5, 6, 7];

const Footage: React.FC = () => (
  <>
    {CUTS.map((c, i) => {
      const end = CUTS[i + 1] ?? T0 + 6;
      const from = S(c - T0);
      return (
        <Sequence key={i} from={from} durationInFrames={S(end - T0) - from}>
          <OffthreadVideo src={staticFile(`thorfinn/p${String(PIECES[i]).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
        </Sequence>
      );
    })}
  </>
);

// índice de la palabra activa
const activeIdx = (t: number) => { let k = -1; W.forEach((w, i) => { if (t >= w[1] - 0.03) k = i; }); return k; };

// ---------- A · impacto ----------
const StyleA: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, k = activeIdx(t);
  if (k < 0) return null;
  const w = W[k], d = f - S(w[1] - 0.03), c = key(w[0]);
  const p = back(ip(d, [0, 7], [0, 1]));
  const big = c ? 1.55 : 1;
  const rot = (random(`r${k}`) - 0.5) * 12 * (1 - ip(d, [0, 8], [0, 1])) + (random(`r2${k}`) - 0.5) * 4;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: SANS, fontWeight: 900, fontSize: 118 * big, color: c ?? "#fff", textTransform: "uppercase", letterSpacing: -2, transform: `translateY(${(1 - p) * 160}px) scale(${0.4 + 0.6 * p}) rotate(${rot}deg)`, filter: `blur(${ip(d, [0, 3], [10, 0])}px)`, WebkitTextStroke: "3px #000", textShadow: `0 10px 0 rgba(0,0,0,0.65), 0 0 ${c ? 40 : 0}px ${c ?? "transparent"}` }}>
        {w[0]}
      </div>
    </div>
  );
};
const shakeA = (f: number) => { const t = f / FPS, k = activeIdx(t); if (k < 0 || !key(W[k][0])) return 0; return ip(f - S(W[k][1]), [0, 8], [1, 0]); };

// ---------- B · bloque tipográfico ----------
const StyleB: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, k = activeIdx(t);
  if (k < 0) return null;
  // la frase actual (hasta el punto) se apila en líneas
  const ends = [W.findIndex((w) => w[0] === "pronto"), W.length - 1];
  const s0 = k <= ends[0] ? 0 : ends[0] + 1, s1 = k <= ends[0] ? ends[0] : ends[1];
  const ws = W.slice(s0, s1 + 1);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 700, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "center", gap: "0 22px" }}>
      {ws.map((w, j) => {
        const i = s0 + j, d = f - S(w[1] - 0.03);
        if (d < 0) return null;
        const c = key(w[0]), p = out(ip(d, [0, 6], [0, 1]));
        const style: React.CSSProperties = c
          ? { fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: c, width: "100%", textAlign: "center", lineHeight: 1 }
          : j % 3 === 1 ? { fontFamily: SCRIPT, fontSize: 92, color: "#F4F1EA" } : { fontFamily: SANS, fontWeight: 900, fontSize: 78, color: "#fff", textTransform: "uppercase" };
        return (
          <span key={i} style={{ ...style, display: "inline-block", opacity: i === k ? 1 : 0.85, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, transform: `translateY(${(1 - p) * 30}px)`, textShadow: "0 6px 24px rgba(0,0,0,0.9)" }}>
            {w[0]}
          </span>
        );
      })}
    </div>
  );
};

// ---------- C · cine 3D ----------
const StyleC: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, k = activeIdx(t);
  if (k < 0) return null;
  return (
    <AbsoluteFill style={{ perspective: 900 }}>
      {[k - 2, k - 1, k].filter((i) => i >= 0).map((i) => {
        const w = W[i], d = f - S(w[1] - 0.03), age = k - i, c = key(w[0]);
        const p = out(ip(d, [0, 9], [0, 1]));
        const z = age === 0 ? ip(d, [0, 9], [-600, 0]) : -260 * age;
        const y = 1060 - age * 150;
        const letters = w[0].split("");
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", transform: `translateZ(${z}px) rotateX(${(1 - p) * 70}deg)`, opacity: age === 0 ? 1 : 0.35 / age, filter: age ? `blur(${age * 3}px)` : "none" }}>
            {letters.map((ch, j) => {
              const lp = ip(d - j * 1.2, [0, 4], [0, 1]);
              return (
                <span key={j} style={{ display: "inline-block", fontFamily: SERIF, fontWeight: 900, fontSize: c ? 150 : 112, color: c ?? "#EDE6DA", opacity: lp, transform: `translateY(${(1 - lp) * -30}px)`, textShadow: c ? `-4px 0 rgba(255,0,60,0.7), 4px 0 rgba(0,220,255,0.7), 0 0 30px ${c}` : "0 0 22px rgba(255,240,220,0.45), 0 8px 26px rgba(0,0,0,0.95)" }}>
                  {ch}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};


// ---------- R1 · referencia 1 (podcast): frase entera en minúsculas, clave en caligráfica cian ----------
const groupsBy = (max: number, chars: number) => {
  const gs: number[][] = []; let cur: number[] = [];
  W.forEach((w, i) => {
    cur.push(i);
    const txt = cur.map((j) => W[j][0]).join(" ");
    const nx = W[i + 1];
    if (!nx || cur.length >= max || txt.length >= chars || (nx && nx[1] - w[2] > 0.35) || (words as Wd[]).find((x) => Math.abs(x[1] - T0 - w[1]) < 0.01)?.[0].match(/[.,]$/)) { gs.push(cur); cur = []; }
  });
  return gs;
};
const G1 = groupsBy(4, 16);
const curGroup = (gs: number[][], t: number) => { let g = -1; gs.forEach((x, i) => { if (t >= W[x[0]][1] - 0.05) g = i; }); return g; };
const StyleR1: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, g = curGroup(G1, t);
  if (g < 0) return null;
  const idx = G1[g], d = f - S(W[idx[0]][1] - 0.05);
  const k = out(ip(d, [0, 3], [0, 1]));
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1150, textAlign: "center", whiteSpace: "nowrap", opacity: k, transform: `scale(${0.92 + 0.08 * k})` }}>
      {idx.map((i) => {
        const w = W[i][0], c = key(w);
        return c ? (
          <span key={i} style={{ fontFamily: SCRIPT, fontSize: 92, color: "#2FE0D2", margin: "0 10px", textShadow: "0 3px 10px rgba(0,0,0,0.55)" }}>{w.toLowerCase()}</span>
        ) : (
          <span key={i} style={{ fontFamily: P8, fontWeight: 800, fontSize: 70, color: "#fff", letterSpacing: -2, margin: "0 9px", textShadow: "0 3px 10px rgba(0,0,0,0.55)" }}>{w.toLowerCase()}</span>
        );
      })}
    </div>
  );
};

// ---------- R2 · referencia 2 (deporte): 1–2 palabras que se suman, mayúsculas condensadas, clave en rojo/azul ----------
const G2 = groupsBy(2, 14);
const R2C: Record<string, string> = { thorfinn: "#2F8CFF", secuelas: "#E0242F", odio: "#E0242F", pronto: "#2F8CFF", seis: "#E0242F" };
const StyleR2: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, g = curGroup(G2, t);
  if (g < 0) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", whiteSpace: "nowrap" }}>
      {G2[g].filter((i) => t >= W[i][1] - 0.05).map((i) => {
        const w = W[i][0], c = R2C[w.toLowerCase()];
        return <span key={i} style={{ fontFamily: BEBAS, fontSize: 132, color: c ?? "#fff", letterSpacing: 1, margin: "0 14px", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{w.toUpperCase()}</span>;
      })}
    </div>
  );
};

export const SubTest: React.FC<{ v: "A" | "B" | "C" | "R1" | "R2" }> = ({ v }) => {
  const f = useCurrentFrame();
  const sh = v === "A" ? shakeA(f) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${(random(`x${f}`) - 0.5) * 24 * sh}px, ${(random(`y${f}`) - 0.5) * 24 * sh}px) scale(${1 + 0.04 * sh})` }}>
        <Footage />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)" }} />
      {v === "A" ? <StyleA f={f} /> : v === "B" ? <StyleB f={f} /> : v === "C" ? <StyleC f={f} /> : v === "R1" ? <StyleR1 f={f} /> : <StyleR2 f={f} />}
      <Audio src={staticFile("thorfinn/mezcla.wav")} trimBefore={S(T0)} />
    </AbsoluteFill>
  );
};
