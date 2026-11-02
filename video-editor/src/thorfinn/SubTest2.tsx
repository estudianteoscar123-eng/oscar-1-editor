import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/thorfinn/words.json";

// Prueba de 6 s: estilo de la ref. Denji (R3) y de la ref. "El peor enemigo" (R4). Tramo 0–6 s de Thorfinn.
const FPS = 30;
export const SUBTEST2_TOTAL = 6 * FPS;
const S = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const BODY = "S2Body", MARK = "S2Mark", OLD = "S2Old", TRAJ = "S2Traj";
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: MARK, url: staticFile("fonts/permanent-marker-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: OLD, url: staticFile("fonts/old-standard-tt-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: TRAJ, url: staticFile("fonts/cinzel-latin-700-normal.woff2"), weight: "700" });

type Wd = [string, number, number];
const W = (words as Wd[]).filter((w) => w[1] < 6).map((w) => [w[0].replace(/[.,]/g, ""), w[1], w[2]] as Wd);
const CUTS = [0, 1.1, 2.2, 4.5];

// textura desgastada: agujeros de ruido en las letras
const Distress: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="s2dist" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={3} seed={7} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.15" result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="in" />
    </filter>
  </svg>
);

// tarjeta del gancho: rotulador pequeño + serif blanca + palabra final roja enorme
const HookCard: React.FC<{ f: number; lines: [string, number][]; red: [string, number] }> = ({ f, lines, red }) => {
  const t = f / FPS;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 760, textAlign: "center" }}>
      {lines.map(([txt, at], i) => (t >= at ? (
        <div key={i} style={i === 0
          ? { fontFamily: MARK, fontSize: 52, color: "#F1F1F1", textAlign: "left", marginLeft: 110, transform: "rotate(-3deg)", letterSpacing: 1 }
          : { fontFamily: OLD, fontWeight: 700, fontSize: 96, color: "#ECECEC", letterSpacing: 2, lineHeight: 1.05, filter: "url(#s2dist)" }}>{txt}</div>
      ) : null))}
      {t >= red[1] ? <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 172, color: "#D1233A", lineHeight: 0.95, letterSpacing: 4, filter: "url(#s2dist)" }}>{red[0]}</div> : null}
    </div>
  );
};

// cuerpo: una palabra, mayúsculas, sans negrita blanca pequeña, centro
const Body: React.FC<{ f: number; from: number; skip?: (t: number) => boolean }> = ({ f, from, skip }) => {
  const t = f / FPS;
  if (t < from || skip?.(t)) return null;
  let k = -1;
  W.forEach((w, i) => { if (w[1] >= from - 0.05 && t >= w[1] - 0.03) k = i; });
  if (k < 0 || t > W[k][2] + 0.5) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 56, color: "#fff", letterSpacing: 0.5, textShadow: "0 2px 6px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)" }}>
      {W[k][0].toUpperCase()}
    </div>
  );
};

export const SubTest2: React.FC<{ v: "R3" | "R4" }> = ({ v }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const card = t < 2.2; // el gancho va sobre negro
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Distress />
      {!card ? CUTS.slice(2).map((c, i) => {
        const end = CUTS[i + 3] ?? 6;
        return (
          <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
            <OffthreadVideo src={staticFile(`thorfinn/p${String(i + 2).padStart(2, "0")}.mp4`)} muted trimBefore={0} style={{ width: 1080, height: 1920 }} />
          </Sequence>
        );
      }) : null}
      {!card ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 100%)" }} /> : null}
      {card ? <HookCard f={f} lines={[["QUIEN VIVE PARA", 0.15], ["DESTRUIR A", 1.05]]} red={["ALGUIEN", 1.55]} /> : null}
      {v === "R3" && t >= 4.6 ? (
        // nombre del personaje en serif tipo Trajan naranja (como "DENJI")
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: TRAJ, fontWeight: 700, fontSize: 150, color: "#E38B1E", letterSpacing: 2, textShadow: "0 6px 0 rgba(40,20,0,0.75), 0 10px 24px rgba(0,0,0,0.8)", opacity: ip(f - S(4.6), [0, 4], [0, 1]) }}>THORFINN</div>
      ) : null}
      {v === "R4" && t >= 3.25 && t < 4.6 ? (
        // apilado tipo "MEN / VS / HIMSELF"
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: OLD, fontWeight: 700, lineHeight: 0.92, filter: "url(#s2dist)" }}>
          <div style={{ fontSize: 150, color: "#C8202F", textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>ÉL</div>
          <div style={{ fontSize: 96, color: "#EDEDED" }}>VS</div>
          <div style={{ fontSize: 150, lineHeight: 1.15, paddingTop: 6, background: "linear-gradient(#FFFFFF, #8E8E8E)", WebkitBackgroundClip: "text", color: "transparent" }}>SÍ MISMO</div>
        </div>
      ) : null}
      <Body f={f} from={2.2} skip={(tt) => (v === "R3" ? tt >= 4.6 : tt >= 3.25 && tt < 4.6)} />
      <Audio src={staticFile("thorfinn/mezcla.wav")} />
    </AbsoluteFill>
  );
};
