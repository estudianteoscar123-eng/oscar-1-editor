import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/thorfinn/words.json";

// Réplica de las refs de Drive. R3 = Denji · R4 = "El peor enemigo de un hombre".
// Fase 1: tarjeta sobre negro que se arma línea a línea · Fase 2: título fijo sobre los planos · Fase 3: una palabra a la vez.
const FPS = 30;
const END = 14;
export const SUBTEST2_TOTAL = END * FPS;
const S = (t: number) => Math.round(t * FPS);
const MARK = "S2Kalam", MID = "S2Old", FAT = "S2Fat", FATI = "S2FatI", TRAJ = "S2Traj", BODY = "S2Body";
loadFont({ family: MARK, url: staticFile("fonts/kalam-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: MID, url: staticFile("fonts/old-standard-tt-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: FAT, url: staticFile("fonts/playfair-display-latin-900-normal.woff2"), weight: "900" });
loadFont({ family: FATI, url: staticFile("fonts/playfair-display-latin-900-italic.woff2"), weight: "900", style: "italic" });
loadFont({ family: TRAJ, url: staticFile("fonts/cinzel-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });

type Wd = [string, number, number];
const W = (words as Wd[]).filter((w) => w[1] < END).map((w) => [w[0].replace(/[.,]/g, ""), w[1], w[2]] as Wd);
const CUTS = [4.5, 5.9, 6.7, 8.9, 10.2, 11.6, 12.6, 13.4];
const PHASE2 = 4.6, PHASE3 = 12.0;

// texturas: desgaste fuerte (palabra grande) y leve (línea media)
const Filters: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    {[["s2grunge", 0.55, "-3.4 0 0 0 2.35"], ["s2soft", 1.6, "-2.2 0 0 0 2.05"]].map(([id, fq, m]) => (
      <filter key={id as string} id={id as string} x="-5%" y="-10%" width="110%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency={fq as number} numOctaves={4} seed={11} result="n" />
        <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${m}`} result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
    ))}
  </svg>
);

type Line = { txt: string; at: number; kind: "small" | "mid" | "big"; color?: string; italic?: boolean };
const Small: React.FC<{ l: Line }> = ({ l }) => (
  <div style={{ fontFamily: MARK, fontWeight: 700, fontSize: 64, color: "#F2F2F2", textAlign: "left", paddingLeft: 30, transform: "skewX(-10deg)", letterSpacing: 2, lineHeight: 1.0 }}>{l.txt}</div>
);
const Mid: React.FC<{ l: Line }> = ({ l }) => (
  <div style={{ fontFamily: MID, fontWeight: 700, fontSize: 104, color: "#F4F4F4", textAlign: "right", paddingRight: 20, lineHeight: 0.98, letterSpacing: 1, filter: "url(#s2soft)" }}>{l.txt}</div>
);
const Big: React.FC<{ l: Line }> = ({ l }) => (
  <div style={{ fontFamily: l.italic ? FATI : FAT, fontStyle: l.italic ? "italic" : "normal", fontWeight: 900, fontSize: l.txt.length > 7 ? 168 : 210, color: l.color, textAlign: "center", lineHeight: 0.92, letterSpacing: 3, filter: "url(#s2grunge)" }}>{l.txt}</div>
);
const Card: React.FC<{ t: number; lines: Line[] }> = ({ t, lines }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: 720 }}>
    {lines.map((l, i) => (t >= l.at ? (l.kind === "small" ? <Small key={i} l={l} /> : l.kind === "mid" ? <Mid key={i} l={l} /> : <Big key={i} l={l} />) : <div key={i} style={{ height: 0 }} />))}
  </div>
);

const R3_CARDS: { from: number; to: number; lines: Line[] }[] = [
  { from: 0, to: 2.2, lines: [{ txt: "QUIEN VIVE PARA", at: 0.2, kind: "small" }, { txt: "DESTRUIR A", at: 1.05, kind: "mid" }, { txt: "ALGUIEN", at: 1.65, kind: "big", color: "#D42A3C" }] },
  { from: 2.2, to: PHASE2, lines: [{ txt: "TERMINA", at: 2.2, kind: "small" }, { txt: "DESTRUYÉNDOSE A", at: 2.7, kind: "mid" }, { txt: "SÍ MISMO", at: 3.3, kind: "big", color: "#F5A11C" }] },
];
const R4_CARD: Line[] = [
  { txt: "QUIEN VIVE PARA", at: 0.2, kind: "small" }, { txt: "DESTRUIR A", at: 1.05, kind: "mid" }, { txt: "ALGUIEN", at: 1.65, kind: "big", color: "#C61F2B", italic: true },
  { txt: "TERMINA DESTRUYÉNDOSE A", at: 2.2, kind: "small" }, { txt: "SÍ MISMO", at: 3.3, kind: "mid" },
];

// fase 2 · títulos fijos
const DenjiTitle: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: TRAJ, fontWeight: 700, fontSize: 168, letterSpacing: 2, color: "#E8891E", textShadow: "-7px 9px 0 rgba(28,24,22,0.78), -7px 9px 10px rgba(0,0,0,0.45)" }}>THORFINN</div>
);
const VsTitle: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: MID, fontWeight: 700, lineHeight: 1.02 }}>
    <div style={{ fontSize: 118, color: "#C41E2A", textShadow: "-4px 6px 0 rgba(20,10,10,0.7), 0 6px 16px rgba(0,0,0,0.6)" }}>HOMBRE</div>
    <div style={{ fontSize: 84, color: "#FFFFFF", textShadow: "-4px 6px 0 rgba(20,20,20,0.7)" }}>VS</div>
    <div style={{ fontSize: 118, paddingTop: 4, background: "linear-gradient(#FFFFFF 15%, #9A9A9A 85%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(-4px 6px 0 rgba(20,20,20,0.7))" }}>SÍ MISMO</div>
  </div>
);

// fase 3 · una palabra, mayúsculas, sans negrita blanca
const Body: React.FC<{ t: number }> = ({ t }) => {
  let k = -1;
  W.forEach((w, i) => { if (w[1] >= PHASE3 - 0.4 && t >= w[1] - 0.03) k = i; });
  if (k < 0 || t > W[k][2] + 0.5) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 905, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 54, color: "#fff", letterSpacing: 0.5, textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.7)" }}>{W[k][0].toUpperCase()}</div>;
};

export const SubTest2: React.FC<{ v: "R3" | "R4" }> = ({ v }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Filters />
      {CUTS.map((c, i) => {
        const end = CUTS[i + 1] ?? END;
        return (
          <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
            <OffthreadVideo src={staticFile(`thorfinn/p${String(i + 3).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
          </Sequence>
        );
      })}
      {t < PHASE2 ? <AbsoluteFill style={{ background: "#000" }} /> : null}
      {t < PHASE2 && v === "R3" ? R3_CARDS.filter((c) => t >= c.from && t < c.to).map((c, i) => <Card key={i} t={t} lines={c.lines} />) : null}
      {t < PHASE2 && v === "R4" ? <Card t={t} lines={R4_CARD} /> : null}
      {t >= PHASE2 && t < PHASE3 ? (v === "R3" ? <DenjiTitle /> : <VsTitle />) : null}
      {t >= PHASE3 ? <Body t={t} /> : null}
      <Audio src={staticFile("thorfinn/mezcla.wav")} />
    </AbsoluteFill>
  );
};
