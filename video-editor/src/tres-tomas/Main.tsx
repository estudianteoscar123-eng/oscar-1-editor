import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BASE, SANS, alpha, ip, mix, INK } from "../ee46f/theme";
import { SCENES } from "./Scenes";
import { BEATS, CAMS, GROUPS, WIN, W, inBeat, Beat } from "./timeline";

const clean = (t: string) => t.replace(/[.,;:!?¿¡]+$/g, "");

// Subtítulos: contexto gris que se enciende al hablar + palabra clave grande en su tono
const Caption: React.FC<{ f: number; idx: number[]; keys: number[]; tone: string; s: number }> = ({ f, idx, keys, tone, s }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top: 1390, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: INK, textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
      {idx
        .filter((i) => !keys.includes(i))
        .map((i) => (
          <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: f < s ? 0 : ip(f, [Math.max(s, W[i].f - 4), W[i].f + 3], [0, 1]) }}>
            {clean(W[i].text)}
          </span>
        ))}
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 118, lineHeight: 1.02, letterSpacing: -2.5, textTransform: "uppercase", color: tone, filter: `drop-shadow(0 0 22px ${alpha(tone, 0.45)})` }}>
      {keys.map((i) => (
        <span key={i} style={{ display: "inline-block", marginRight: "0.14em", opacity: ip(f, [W[i].f - 2, W[i].f + 4], [0, 1]) }}>
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
      if (f < w.s || f >= w.e || inBeat(f)) return null;
      const idx = Array.from({ length: g.b - g.a + 1 }, (_, n) => g.a + n);
      return <Caption key={k} f={f} idx={idx} keys={g.key} tone={g.tone} s={w.s} />;
    })}
  </>
);

const BeatWrap: React.FC<{ b: Beat }> = ({ b }) => {
  const f = useCurrentFrame();
  const C = SCENES[b.scene];
  return <C f={f} dur={b.to - b.from} from={b.from} pal={b.pal} />;
};

// Destello de luz en cada paso de cámara a gráfico
const Flash: React.FC<{ f: number }> = ({ f }) => {
  for (const b of BEATS) {
    for (const T of [b.from, b.to]) {
      if (f < T - 3 || f > T + 9) continue;
      const color = b.pal.l;
      const o = f < T ? ip(f, [T - 3, T], [0, 0.4]) : ip(f, [T, T + 9], [0.4, 0]);
      return <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 45%, ${mix(color, "#ffffff", 0.5)}, ${alpha(color, 0.5)} 60%, ${alpha(color, 0.2)} 100%)`, opacity: o, mixBlendMode: "screen" }} />;
    }
  }
  return null;
};

export const TresTomas: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BASE, overflow: "hidden" }}>
      {/* Cámara: solo los tramos de habla, pegados unos con otros (cortes en los silencios) */}
      {CAMS.map((c, k) => (
        <Sequence key={`c${k}`} from={c.from} durationInFrames={c.n}>
          <AbsoluteFill>
            <Video src={staticFile("tres-tomas/sincortes.mp4")} trimBefore={c.src} muted style={{ width: 1080, height: 1920 }} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,10,18,0) 62%, rgba(7,10,18,0.6) 100%)" }} />

      {BEATS.map((b, k) => (
        <Sequence key={`b${k}`} from={b.from} durationInFrames={b.to - b.from}>
          <BeatWrap b={b} />
        </Sequence>
      ))}
      <Captions f={f} />
      <Flash f={f} />

      {/* Voz: cada tramo en su posición de salida; música continua debajo */}
      {CAMS.map((c, k) => (
        <Sequence key={`v${k}`} from={c.from} durationInFrames={c.n}>
          <Audio src={staticFile("tres-tomas/voz.wav")} trimBefore={c.src} />
        </Sequence>
      ))}
      <Audio src={staticFile("tres-tomas/musica.wav")} />
    </AbsoluteFill>
  );
};
