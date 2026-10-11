import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BASE, INOUT, SANS, alpha, ip, mix } from "../ee46f/theme";
import { Captions } from "./Captions";
import { SCENES } from "./Scenes";
import { GROUPS, SEGS, Seg, wf } from "./timeline";

const SceneWrap: React.FC<{ s: Seg }> = ({ s }) => {
  const f = useCurrentFrame();
  const C = SCENES[s.scene];
  return <C f={f} dur={s.to - s.from} from={s.from} pal={s.pal} />;
};

// Destello del color de la escena que entra (no en el empalme del loop)
const Flash: React.FC<{ f: number }> = ({ f }) => {
  for (let k = 1; k < SEGS.length; k++) {
    const T = SEGS[k].from;
    if (f < T - 3 || f > T + 10) continue;
    const color = SEGS[k].pal.l;
    const o = f < T ? ip(f, [T - 3, T], [0, 0.6], INOUT) : ip(f, [T, T + 10], [0.6, 0], INOUT);
    return <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 65% at 50% 45%, ${mix(color, "#ffffff", 0.55)}, ${alpha(color, 0.6)} 55%, ${alpha(color, 0.25)} 100%)`, opacity: o, mixBlendMode: "screen" }} />;
  }
  return null;
};

const Sfx: React.FC<{ at: number; src: string; v: number }> = ({ at, src, v }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={v} />
  </Sequence>
);

export const AlgunDia: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = SEGS.slice(1).map((s) => s.from);
  const keys = GROUPS.map((g) => wf(g.key[0]));
  const hit = wf(201);
  return (
    <AbsoluteFill style={{ background: BASE, overflow: "hidden" }}>
      {SEGS.map((s, k) => (
        <Sequence key={k} from={s.from} durationInFrames={s.to - s.from}>
          <SceneWrap s={s} />
        </Sequence>
      ))}
      <Captions f={f} />
      <div style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: "rgba(244,242,238,0.38)" }}>@sinlimiteslife</div>
      <Flash f={f} />

      <Audio src={staticFile("algundia/voz.wav")} />
      {/* música circular; baja un momento para que "Era el vaso" golpee en casi silencio */}
      <Audio src={staticFile("algundia/musica.wav")} volume={(fr) => 1.25 * (1 - 0.7 * ip(fr, [hit - 40, hit - 10], [0, 1]) * ip(fr, [hit + 30, hit + 70], [1, 0]))} />
      {cuts.map((c, k) => (
        <Sfx key={`w${k}`} at={c - 8} src="whoosh" v={0.12} />
      ))}
      {keys.map((c, k) => (
        <Sfx key={`p${k}`} at={c - 1} src="pop" v={0.06} />
      ))}
      {[19, 72, 110].map((i) => (
        <Sfx key={`f${i}`} at={wf(i) - 2} src="whoosh" v={0.1} />
      ))}
      {[91, 95, 99, 100].map((i) => (
        <Sfx key={`s${i}`} at={wf(i)} src="tick" v={0.2} />
      ))}
      <Sfx at={wf(116)} src="impact" v={0.12} />
      <Sfx at={wf(133)} src="impact" v={0.14} />
      <Sfx at={wf(201) - 2} src="whoosh" v={0.3} />
      <Sfx at={wf(225) - 4} src="shimmer" v={0.3} />
      <Sfx at={wf(251)} src="pop" v={0.25} />
      <Sfx at={wf(265)} src="impact" v={0.14} />
    </AbsoluteFill>
  );
};
