import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { C, SANS } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clean = (t: string) => t.replace(/[.]$/, "");

// estilo.md §2: palabra a palabra, línea 48 px + palabra destacada ≈120 px
export const Captions: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = data.phrases.find((ph) => t >= ph.start && t < ph.end);
  if (!p) return null;

  const endF = p.end * fps;
  const exitOpacity = interpolate(frame, [endF - 3, endF], [1, 0], clamp);
  const exitBlur = interpolate(frame, [endF - 3, endF], [0, 10], clamp);

  const wordStyle = (i: number, dur: number, blurFrom: number) => {
    const at = data.words[i].s * fps;
    return {
      display: "inline-block",
      marginRight: "0.26em",
      opacity: interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE }),
      filter: `blur(${interpolate(frame, [at, at + dur], [blurFrom, 0], { ...clamp, easing: EASE })}px)`,
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        color: C.ink,
        opacity: exitOpacity,
        filter: `blur(${exitBlur}px)`,
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.6 }}>
        {p.line.map((i) => (
          <span key={i} style={wordStyle(i, 2, 8)}>
            {data.words[i].text}
          </span>
        ))}
      </div>
      {p.hl.length > 0 && (
        <div
          style={{
            fontSize: 118,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -3.5,
            color: C.blue,
            marginTop: 6,
          }}
        >
          {p.hl.map((i) => {
            const at = data.words[i].s * fps;
            return (
              <span
                key={i}
                style={{
                  ...wordStyle(i, 4, 14),
                  scale: interpolate(frame, [at, at + 4], [1.08, 1], { ...clamp, easing: EASE }),
                }}
              >
                {clean(data.words[i].text ?? "")}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
