import { Video } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { C, MONO, cardStyle, monoLabel } from "./theme";

export const TOTAL_RULES = 15;
export const CARD = { left: 80, top: 440, size: 920 };

export const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      background: C.ink,
      color: C.white,
      borderRadius: 999,
      padding: "14px 26px",
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: 24,
      letterSpacing: 2,
      textTransform: "uppercase",
      boxShadow: "0 10px 30px rgba(17,17,17,0.18)",
      ...style,
    }}
  >
    <span style={{ width: 10, height: 10, borderRadius: 99, background: C.blue }} />
    {children}
  </div>
);

// Cámara dentro de tarjeta (estilo.md §4) con jump zoom 100 % ↔ 112 % por frase y empuje lento (§6)
export const Camera: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = startSec + frame / fps;
  const idx = Math.max(0, data.phrases.findIndex((p) => t >= p.start && t < p.end));
  const p = data.phrases[idx];
  const local = (t - p.start) / Math.max(0.1, p.end - p.start);
  const base = idx % 2 === 0 ? 1 : 1.12;
  const push = interpolate(local, [0, 1], [0, 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div
        style={{
          ...cardStyle,
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.size,
          height: CARD.size,
          borderRadius: 36,
          overflow: "hidden",
          border: "none",
          boxShadow: "0 30px 80px rgba(20,40,120,0.18)",
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
            transformOrigin: "50% 32%",
            filter: "brightness(1.12) contrast(1.04)",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: CARD.top - 30, display: "flex", justifyContent: "center" }}>
        <Pill>
          Regla {String(p.rule).padStart(2, "0")} · {TOTAL_RULES}
        </Pill>
      </div>
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          width: CARD.size,
          top: CARD.top + CARD.size + 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: TOTAL_RULES }, (_, k) => (
            <div
              key={k}
              style={{
                width: 40,
                height: 8,
                borderRadius: 8,
                background: k < p.rule ? C.blue : "#D5DCEA",
              }}
            />
          ))}
        </div>
        <div style={monoLabel}>Winter Arc · día 3 de 90</div>
      </div>
    </>
  );
};
