import { Video } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { C, MONO, SANS, cardStyle } from "./theme";

const TOTAL_RULES = 15;

// Escena a cámara: el vídeo va dentro de una tarjeta (estilo.md §4) con jump zoom 100 % ↔ 115 % (§6)
export const Camera: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame(); // relativo a la escena
  const { fps } = useVideoConfig();
  const t = startSec + frame / fps;
  const idx = Math.max(0, data.phrases.findIndex((p) => t >= p.start && t < p.end));
  const p = data.phrases[idx];
  const local = (t - p.start) / Math.max(0.1, p.end - p.start);
  const base = idx % 2 === 0 ? 1 : 1.15;
  const push = interpolate(local, [0, 1], [0, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div
        style={{
          ...cardStyle,
          position: "absolute",
          left: 60,
          top: 450,
          width: 960,
          height: 796,
          overflow: "hidden",
        }}
      >
        <Video
          src={staticFile("mi-video/camara.mp4")}
          trimBefore={Math.round(startSec * fps)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: base + push,
            transformOrigin: "52% 38%",
            filter: "brightness(1.15) contrast(1.06) saturate(1.05)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1290,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#1A2040",
            borderRadius: 999,
            padding: "14px 26px",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 1,
            color: C.white,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 99, background: C.red }} />
          WINTER ARC · DÍA 3/90
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>
          REGLA <span style={{ color: C.white }}>{String(p.rule).padStart(2, "0")}</span>/{TOTAL_RULES}
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1380, height: 6, borderRadius: 6, background: "#1A2040" }}>
        <div
          style={{
            width: `${(p.rule / TOTAL_RULES) * 100}%`,
            height: "100%",
            borderRadius: 6,
            background: C.red,
            boxShadow: `0 0 18px ${C.red}`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1440,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 6,
          color: "rgba(255,255,255,0.18)",
        }}
      >
        SINLIMITESLIFE
      </div>
    </>
  );
};
