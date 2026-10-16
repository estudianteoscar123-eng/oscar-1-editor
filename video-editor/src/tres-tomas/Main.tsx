import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BASE, SANS, alpha, ip, mix, INK } from "../ee46f/theme";
import { SCENES } from "./Scenes";
import { GROUPS, SEGS, Seg, W, WIN, wf } from "./timeline";

const clean = (t: string) => t.replace(/[.,;:!?¿¡]+$/g, "");

// Subtítulos: contexto en gris que se enciende al hablar + palabra clave grande en su tono
const Line: React.FC<{ f: number; idx: number[]; keys: number[]; tone: string; s: number; top: number; big: boolean }> = ({ f, idx, keys, tone, s, top, big }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: big ? 46 : 52, lineHeight: 1.2, color: INK, textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
      {idx
        .filter((i) => !keys.includes(i))
        .map((i) => {
          const at = wf(i);
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: f < s ? 0 : ip(f, [Math.max(s, at - 5), at + 3], [0, 1]) }}>
              {clean(W[i].text)}
            </span>
          );
        })}
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 118, lineHeight: 1.02, letterSpacing: -2.5, textTransform: "uppercase", color: tone, filter: `drop-shadow(0 0 22px ${alpha(tone, 0.45)})` }}>
      {keys.map((i) => (
        <span key={i} style={{ display: "inline-block", marginRight: "0.14em", opacity: ip(f, [wf(i) - 2, wf(i) + 4], [0, 1]) }}>
          {clean(W[i].text)}
        </span>
      ))}
    </div>
  </div>
);

const Captions: React.FC<{ f: number }> = ({ f }) => (
  <>
    {GROUPS.map((g, k) => {
      const w = WIN[k];
      if (f < w.s || f >= w.e) return null;
      const idx = Array.from({ length: g.b - g.a + 1 }, (_, n) => g.a + n);
      // Sobre la cámara: debajo del mentón. Sobre la escena: arriba, fuera de la ilustración.
      const top = w.seg.kind === "A" ? 1390 : 250;
      return <Line key={k} f={f} idx={idx} keys={g.key} tone={g.tone} s={w.s} top={top} big={w.seg.kind === "A"} />;
    })}
  </>
);

const SceneWrap: React.FC<{ s: Seg }> = ({ s }) => {
  const f = useCurrentFrame();
  const C = SCENES[s.scene!];
  return <C f={f} dur={s.to - s.from} from={s.from} pal={s.pal} />;
};

// Destello de luz en cada corte, del color de la escena que entra
const Flash: React.FC<{ f: number }> = ({ f }) => {
  for (let k = 1; k < SEGS.length; k++) {
    const T = SEGS[k].from;
    if (f < T - 3 || f > T + 9) continue;
    const color = SEGS[k].kind === "B" ? SEGS[k].pal.l : "#ffffff";
    const o = f < T ? ip(f, [T - 3, T], [0, 0.45]) : ip(f, [T, T + 9], [0.45, 0]);
    return <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 45%, ${mix(color, "#ffffff", 0.5)}, ${alpha(color, 0.5)} 60%, ${alpha(color, 0.2)} 100%)`, opacity: o, mixBlendMode: "screen" }} />;
  }
  return null;
};

export const TresTomas: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BASE, overflow: "hidden" }}>
      {/* Cámara a pantalla completa; sombra inferior suave para que el texto se lea */}
      <AbsoluteFill>
        <Video src={staticFile("tres-tomas/aroll.mp4")} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,10,18,0) 62%, rgba(7,10,18,0.6) 100%)" }} />

      {SEGS.map((s, k) =>
        s.kind === "B" ? (
          <Sequence key={k} from={s.from} durationInFrames={s.to - s.from}>
            <SceneWrap s={s} />
          </Sequence>
        ) : null,
      )}
      <Captions f={f} />
      <Flash f={f} />

      <Audio src={staticFile("tres-tomas/voz.wav")} />
      <Audio src={staticFile("tres-tomas/musica.wav")} />
    </AbsoluteFill>
  );
};
