import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { B, POPPINS, clamp } from "./theme";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clean = (t: string) => t.replace(/[.,]$/, "");

// Misma mecánica que los subtítulos aprobados en v2 (palabra a palabra con desenfoque),
// con la tipografía de refC: línea blanca con brillo + título en MAYÚSCULA cursiva con degradado cian
export const Captions: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = data.phrases.find((ph) => t >= ph.start && t < ph.end);
  if (!p) return null;

  const endF = p.end * fps;
  const exitOpacity = interpolate(frame, [endF - 3, endF], [1, 0], clamp);
  const exitBlur = interpolate(frame, [endF - 3, endF], [0, 10], clamp);
  const k = (i: number, dur: number, from: number, to: number) =>
    interpolate(frame, [data.words[i].s * fps, data.words[i].s * fps + dur], [from, to], { ...clamp, easing: EASE });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: POPPINS,
        color: B.white,
        opacity: exitOpacity,
        filter: `blur(${exitBlur}px)`,
      }}
    >
      <div
        style={{
          fontSize: 54,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: -1,
          textShadow: "0 0 22px rgba(120,190,255,0.55), 0 4px 18px rgba(0,0,0,0.55)",
        }}
      >
        {p.line.map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              opacity: k(i, 2, 0, 1),
              filter: `blur(${k(i, 2, 8, 0)}px)`,
              translate: `0px ${k(i, 3, 10, 0)}px`,
            }}
          >
            {data.words[i].text}
          </span>
        ))}
      </div>
      {p.hl.length > 0 && (
        <div style={{ fontSize: 122, fontWeight: 900, fontStyle: "italic", lineHeight: 1, letterSpacing: -3, marginTop: 4 }}>
          {p.hl.map((i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "0 0.12em",
                textTransform: "uppercase",
                backgroundImage: `linear-gradient(180deg, ${B.cyanTop} 0%, ${B.cyan} 42%, ${B.blue} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: k(i, 4, 0, 1),
                scale: k(i, 5, 1.3, 1),
                filter: `blur(${k(i, 4, 16, 0)}px) drop-shadow(0 0 22px ${B.glow})`,
              }}
            >
              {clean(data.words[i].text ?? "")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
