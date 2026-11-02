import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import words from "../../public/prov/words.json";
import cuts from "../../public/prov/cuts.json";
import { Card, Filters, Line } from "../thorfinn/SubTest2";

// SL · Proverbios 27:17 — estilo R3 (tarjeta sobre negro · título fijo · palabra a palabra), cíclico.
const FPS = 30;
const END = 32.4;
export const PROV_TOTAL = Math.round(END * FPS);
const S = (t: number) => Math.round(t * FPS);
const TRAJ = "PvTraj", BODY = "PvBody";
loadFont({ family: TRAJ, url: staticFile("fonts/cinzel-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: BODY, url: staticFile("fonts/poppins-latin-700-normal.woff2"), weight: "700" });

type Wd = [string, number, number];
const W = (words as Wd[]).map((w) => [w[0].replace(/[.,]/g, ""), w[1], w[2]] as Wd);
const C = cuts as number[];
const VIDEO_FROM = C[0], VIDEO_TO = 25.9;
const TITLE = [14.35, 20.35];

const HOOK: { from: number; to: number; lines: Line[] }[] = [
  { from: 0, to: 2.15, lines: [{ txt: "HAY AMIGOS", at: 0.2, kind: "small" }, { txt: "QUE TE", at: 0.7, kind: "mid" }, { txt: "APLAUDEN", at: 1.0, kind: "big", color: "#D42A3C" }] },
  { from: 2.15, to: VIDEO_FROM, lines: [{ txt: "Y HAY AMIGOS", at: 2.2, kind: "small" }, { txt: "QUE TE", at: 2.7, kind: "mid" }, { txt: "AFILAN", at: 3.0, kind: "big", color: "#F5A11C" }] },
];
const VERSE: Line[] = [
  { txt: "PROVERBIOS 27:17", at: 26.0, kind: "small" },
  { txt: "COMO EL HIERRO", at: 27.4, kind: "mid" },
  { txt: "AFILA EL HIERRO,", at: 28.3, kind: "mid" },
  { txt: "ASÍ UN AMIGO AFILA A OTRO", at: 29.3, kind: "small" },
  { txt: "AMIGO", at: 30.1, kind: "big", color: "#F5A11C" },
];

const Title: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: TRAJ, fontWeight: 700, fontSize: 132, letterSpacing: 1, color: "#E8891E", textShadow: "-7px 9px 0 rgba(28,24,22,0.78), -7px 9px 10px rgba(0,0,0,0.45)", opacity: interpolate(f - S(TITLE[0]), [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>THORFINN</div>
);

const Body: React.FC<{ t: number }> = ({ t }) => {
  let k = -1;
  W.forEach((w, i) => { if (t >= w[1] - 0.03) k = i; });
  if (k < 0 || t > W[k][2] + 0.5) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 905, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 54, color: "#fff", letterSpacing: 0.5, textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.7)" }}>{W[k][0].toUpperCase()}</div>;
};

export const Prov: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const onBlack = t < VIDEO_FROM || t >= VIDEO_TO;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Filters />
      {C.map((c, i) => {
        const end = C[i + 1] ?? VIDEO_TO;
        return (
          <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
            <OffthreadVideo src={staticFile(`prov/q${String(i).padStart(2, "0")}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
          </Sequence>
        );
      })}
      {!onBlack ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)" }} /> : null}
      {onBlack ? <AbsoluteFill style={{ background: "#000" }} /> : null}
      {t < VIDEO_FROM ? HOOK.filter((c) => t >= c.from && t < c.to).map((c, i) => <Card key={i} t={t} lines={c.lines} />) : null}
      {t >= TITLE[0] && t < TITLE[1] ? <Title f={f} /> : null}
      {!onBlack && !(t >= TITLE[0] && t < TITLE[1]) ? <Body t={t} /> : null}
      {t >= VIDEO_TO ? <Card t={t} lines={VERSE} /> : null}
      <Audio src={staticFile("prov/mezcla.wav")} />
    </AbsoluteFill>
  );
};
