import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/pieza/data.json";
import { Camera } from "./Camera";
import { Captions } from "./Captions";
import { Spot } from "./Spot";
import { B, clamp } from "./theme";
import { interpolate } from "remotion";

// Acentos por escena: no todo es azul
const ACC = ["#5AC8FA", "#FFB547", "#E8457C", "#5CE1B0", "#B388FF", "#FF8A5C"];

// Una frase por escena: pares = cámara, impares = ilustración de color con su icono
const SCENES = data.phrases.map((p, k) => ({
  from: p.start,
  to: p.end,
  spot:
    k % 2 === 1
      ? {
          main: p.icon,
          mainSize: 560,
          items: [
            { name: "sparkles", x: 220, y: 780, size: 170, rot: -10 },
            { name: "glowing-star", x: 860, y: 780, size: 170, rot: 10 },
            { name: "red-heart", x: 250, y: 1320, size: 140, depth: 2 },
          ],
        }
      : undefined,
  accent: ACC[k % ACC.length],
}));

export const MiVideoV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const flash = SCENES.slice(1).reduce(
    (m, s) => Math.max(m, interpolate(frame, [s.from * fps - 2, s.from * fps + 5, s.from * fps + 8], [0, 0.7, 0], clamp)),
    0,
  );

  return (
    <AbsoluteFill style={{ background: B.bg0 }}>
      {SCENES.map((s, k) => (
        <Sequence key={k} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)} premountFor={fps}>
          {s.spot ? <Spot accent={s.accent} {...s.spot} /> : <Camera startSec={s.from} />}
        </Sequence>
      ))}
      <Captions top={scene.spot ? 280 : 1150} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #FFF4E0 0%, ${scene.accent} 50%, transparent 75%)`, opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
      <Audio src={staticFile("pieza/voz.wav")} />
    </AbsoluteFill>
  );
};
