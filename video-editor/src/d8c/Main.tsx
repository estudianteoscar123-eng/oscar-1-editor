import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { Captions } from "./Captions";
import data from "../../public/d8c/data.json";
import { B } from "./theme";

const ACC = ["#5AC8FA", "#FFB547", "#E8457C", "#5CE1B0", "#B388FF", "#FF8A5C"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const D8C: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const pi = Math.max(0, data.phrases.findIndex((p) => t >= p.start && t < p.end));
  const p = data.phrases[pi];
  const local = p ? (t - p.start) / Math.max(0.1, p.end - p.start) : 0;
  const accent = ACC[pi % ACC.length];
  const punch = pi % 2 === 0 ? 1.0 : 1.08;
  const push = interpolate(f, [0, durationInFrames], [1, 1.05]);
  const flash = data.phrases.reduce((m, q, k) => {
    const f0 = q.start * fps;
    return Math.max(m, interpolate(f, [f0 - 2, f0, f0 + 6], [0, 0.35, 0], clamp));
  }, 0);

  return (
    <AbsoluteFill style={{ background: "#05070D", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: push * punch * (1 + 0.02 * local), transformOrigin: "50% 40%" }}>
        <Video src={staticFile("d8c/camara.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%", filter: "brightness(1.04) contrast(1.06) saturate(1.08)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 65% at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, ${accent}33, transparent 60%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #FFF4E0, ${accent} 55%, transparent 75%)`, opacity: flash, mixBlendMode: "screen" }} />
      <Captions top={1180} />
      <Audio src={staticFile("d8c/voz.wav")} />
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 2)} /></filter>
        <rect width="1080" height="1920" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};
