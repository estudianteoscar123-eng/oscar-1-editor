import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrollCeroFiestas, BrollElimina, BrollGratitud, BrollRedes, BrollRutina, BrollSemana } from "./Broll";
import { Camera } from "./Camera";
import { Captions } from "./Captions";
import { C } from "./theme";

// Escenas en segundos del vídeo ya cortado (cortes secos, estilo.md §5)
const SCENES: { from: number; to: number; kind: "cam" | React.FC<{ startSec: number }> }[] = [
  { from: 0, to: 2.46, kind: "cam" },
  { from: 2.46, to: 5.22, kind: BrollElimina },
  { from: 5.22, to: 8.9, kind: "cam" },
  { from: 8.9, to: 10.42, kind: BrollCeroFiestas },
  { from: 10.42, to: 12.3, kind: "cam" },
  { from: 12.3, to: 14.86, kind: BrollRutina },
  { from: 14.86, to: 16.24, kind: "cam" },
  { from: 16.24, to: 18.72, kind: BrollSemana },
  { from: 18.72, to: 23.38, kind: "cam" },
  { from: 23.38, to: 25.94, kind: BrollGratitud },
  { from: 25.94, to: 30.48, kind: "cam" },
  { from: 30.48, to: 32.53, kind: BrollRedes },
];

// Fondo de las referencias: #FBFAFD con dos manchas azules difuminadas (estilo.md §4)
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 976], [0, 60]);
  const blob = (size: number): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${C.blob} 0%, rgba(211,224,254,0.55) 35%, rgba(211,224,254,0) 70%)`,
  });
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ ...blob(1150), right: -560 + drift, top: -520 }} />
      <div style={{ ...blob(1250), left: -640 - drift, bottom: -560 }} />
    </AbsoluteFill>
  );
};

export const MiVideoEditado: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];

  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map((s) => {
        const Kind = s.kind;
        return (
          <Sequence
            key={s.from}
            from={Math.round(s.from * fps)}
            durationInFrames={Math.round((s.to - s.from) * fps)}
            premountFor={fps}
          >
            {Kind === "cam" ? <Camera startSec={s.from} /> : <Kind startSec={s.from} />}
          </Sequence>
        );
      })}
      <Captions top={scene.kind === "cam" ? 130 : 1370} />
      <Audio src={staticFile("mi-video/voz.wav")} />
    </AbsoluteFill>
  );
};
