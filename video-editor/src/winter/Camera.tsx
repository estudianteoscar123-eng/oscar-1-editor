import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { clamp } from "./theme";

// Cámara a pantalla completa: fondo = mismo plano desenfocado; delante, el plano nítido fundido por arriba y abajo
export const Camera: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = startSec + frame / fps;
  const idx = Math.max(0, data.phrases.findIndex((p) => t >= p.start && t < p.end));
  const p = data.phrases[idx];
  const local = (t - p.start) / Math.max(0.1, p.end - p.start);
  const base = idx % 2 === 0 ? 1 : 1.1;
  const trim = Math.round(startSec * fps);
  // entrada: desenfoque 16→0 y escala 1.1→1 en 6 fotogramas (refC)
  const inBlur = interpolate(frame, [0, 6], [16, 0], clamp);
  const inScale = interpolate(frame, [0, 6], [1.1, 1], clamp);

  return (
    <AbsoluteFill style={{ filter: `blur(${inBlur}px)`, scale: inScale }}>
      <Video
        src={staticFile("mi-video/camara.mp4")}
        trimBefore={trim}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%", scale: 1.25, filter: "blur(40px) brightness(0.22) saturate(1.2)" }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 250,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 80%, transparent 100%)",
        }}
      >
        <Video
          src={staticFile("mi-video/camara.mp4")}
          trimBefore={trim}
          muted
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            scale: base + interpolate(local, [0, 1], [0, 0.035], clamp),
            transformOrigin: "50% 32%",
            filter: "brightness(1.12) contrast(1.08) saturate(1.06)",
          }}
        />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 42%, rgba(0,0,0,0) 55%, rgba(2,6,15,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};
