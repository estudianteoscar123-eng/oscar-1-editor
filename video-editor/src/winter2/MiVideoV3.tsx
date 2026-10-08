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
      {Array.from({ length: 22 }, (_, k) => {
        const x = (k * 311) % 1080;
        const y = ((k * 547 - frame * (2 + (k % 4))) % 2100 + 2100) % 2100 - 100;
        return (
          <div key={`b${k}`} style={{ position: "absolute", left: x, top: y, width: 18 + (k % 5) * 14, height: 18 + (k % 5) * 14, borderRadius: 99,
            background: ACC[k % ACC.length], opacity: 0.22, filter: "blur(6px)", mixBlendMode: "screen" }} />
        );
      })}
      <Captions top={scene.spot ? 280 : 1150} />
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2)} />
        </filter>
        <rect width="1080" height="1920" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #FFF4E0 0%, ${scene.accent} 50%, transparent 75%)`, opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
      <Audio src={staticFile("pieza/voz.wav")} />
    </AbsoluteFill>
  );
};
