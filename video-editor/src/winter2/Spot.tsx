import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { B, clamp } from "./theme";

export type Item = { name: string; x: number; y: number; size: number; depth?: number; delay?: number; rot?: number };
export type SpotProps = {
  accent: string;
  main: string;
  mainSize?: number;
  overlay?: string; // p. ej. "prohibited" encima de la ilustración principal
  items?: Item[];
  rain?: boolean;
};

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const POP = Easing.bezier(0.34, 1.56, 0.64, 1); // con rebote ligero
const MAIN_Y = 1010;

const BLOBS = [
  "M60,-70C78,-52,92,-26,90,-1C88,24,70,48,49,64C28,80,4,88,-23,84C-50,80,-80,64,-90,39C-100,14,-90,-20,-72,-45C-54,-70,-27,-86,0,-86C27,-86,42,-88,60,-70Z",
  "M45,-58C60,-44,74,-30,79,-12C84,6,80,27,67,42C54,57,32,66,9,72C-14,78,-38,81,-55,69C-72,57,-82,30,-80,6C-78,-18,-64,-40,-47,-55C-30,-70,-15,-78,2,-80C19,-82,30,-72,45,-58Z",
];

const Blob: React.FC<{ accent: string; x: number; y: number; s: number; d: number; v: number; blur: number; o: number }> = ({ accent, x, y, s, d, v, blur, o }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="-100 -100 200 200"
      width={s}
      height={s}
      style={{
        position: "absolute",
        left: x - s / 2,
        top: y - s / 2 + Math.sin(frame / 28 + x) * 14,
        rotate: `${frame * 0.25 * (x > 540 ? -1 : 1)}deg`,
        filter: `blur(${blur}px)`,
        opacity: o,
      }}
    >
      <defs>
        <linearGradient id={`g${x}${y}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d={BLOBS[v % BLOBS.length]} fill={`url(#g${x}${y})`} />
    </svg>
  );
};

export const Spot: React.FC<SpotProps> = ({ accent, main, mainSize = 560, overlay, items = [], rain }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  // entrada desde el destello: desenfoque 22→0, escala 1.14→1 en 8 fotogramas (refC)
  const inBlur = interpolate(frame, [0, 8], [22, 0], { ...clamp, easing: EASE });
  const inScale = interpolate(frame, [0, 8], [1.14, 1], { ...clamp, easing: EASE });
  const bob = Math.sin(frame / 18) * 12;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `radial-gradient(ellipse 90% 70% at 50% 18%, ${B.bg1} 0%, #051333 45%, ${B.bg0} 100%)` }}>
      <AbsoluteFill style={{ scale: inScale * push, filter: `blur(${inBlur}px)` }}>
        {/* cono de luz cenital */}
        <div
          style={{
            position: "absolute",
            left: 540 - 520,
            top: -40,
            width: 1040,
            height: 1500,
            clipPath: "polygon(43% 0, 57% 0, 100% 100%, 0 100%)",
            background: `linear-gradient(180deg, ${accent}99 0%, ${accent}2e 55%, ${accent}00 100%)`,
            filter: "blur(28px)",
            opacity: 0.85 + Math.sin(frame / 9) * 0.05,
          }}
        />
        <div style={{ position: "absolute", left: 390, top: -90, width: 300, height: 180, borderRadius: "50%", background: "rgba(170,230,255,0.9)", filter: "blur(40px)" }} />
        {/* suelo iluminado y línea de horizonte */}
        <div style={{ position: "absolute", left: 140, top: MAIN_Y + mainSize / 2 - 40, width: 800, height: 120, borderRadius: "50%", background: "rgba(60,160,255,0.35)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: MAIN_Y + mainSize / 2 + 10, height: 2, background: "linear-gradient(90deg, rgba(90,170,255,0), rgba(90,170,255,0.35), rgba(90,170,255,0))" }} />

        {rain &&
          Array.from({ length: 26 }, (_, i) => {
            const x = (i * 97) % 1180 - 50;
            const y = ((i * 211 + frame * 38) % 2200) - 200;
            return (
              <div
                key={i}
                style={{ position: "absolute", left: x, top: y, width: 3, height: 120, background: "linear-gradient(180deg, rgba(120,190,255,0), rgba(120,190,255,0.45))", rotate: "18deg" }}
              />
            );
          })}

        <Blob accent={accent} x={60} y={1500} s={420} d={1} v={0} blur={0} o={0.9} />
        <Blob accent={accent} x={1020} y={360} s={300} d={2} v={1} blur={6} o={0.75} />
        <Blob accent={accent} x={980} y={1640} s={360} d={1} v={1} blur={2} o={0.85} />
        <Blob accent={accent} x={110} y={520} s={200} d={3} v={0} blur={10} o={0.5} />

        {/* partículas dentro del foco */}
        {Array.from({ length: 18 }, (_, i) => {
          const x = 300 + ((i * 53) % 480) + Math.sin(frame / 20 + i) * 20;
          const y = 200 + ((i * 131 - frame * (0.6 + (i % 3) * 0.3)) % 1100 + 1100) % 1100;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, borderRadius: 9, background: "rgba(170,225,255,0.7)", filter: "blur(1px)" }} />;
        })}

        {items.map((it, i) => {
          const at = 3 + (it.delay ?? i * 3);
          const depth = it.depth ?? 1;
          return (
            <Img
              key={it.name + i}
              src={staticFile(`illus-color/${it.name}.svg`)}
              style={{
                position: "absolute",
                width: it.size,
                left: it.x - it.size / 2 + Math.sin(frame / 30 + i) * 10 * depth,
                top: it.y - it.size / 2 + Math.cos(frame / 24 + i * 2) * 14 * depth,
                rotate: `${(it.rot ?? 0) + Math.sin(frame / 26 + i) * 5}deg`,
                opacity: interpolate(frame, [at, at + 6], [0, depth > 1.5 ? 0.6 : 1], clamp),
                scale: interpolate(frame, [at, at + 9], [0.4, 1], { ...clamp, easing: POP }),
                filter: `blur(${depth > 1.5 ? 3 : 0}px) drop-shadow(0 0 22px ${accent}aa)`,
              }}
            />
          );
        })}

        <Img
          src={staticFile(`illus-color/${main}.svg`)}
          style={{
            position: "absolute",
            width: mainSize,
            left: 540 - mainSize / 2,
            top: MAIN_Y - mainSize / 2 + bob,
            scale: interpolate(frame, [0, 10], [0.86, 1], { ...clamp, easing: POP }),
            filter: `drop-shadow(0 0 40px ${accent}aa) drop-shadow(0 20px 30px rgba(0,0,0,0.5))`,
          }}
        />
        {overlay && (
          <div
            style={{
              position: "absolute",
              width: mainSize * 1.12,
              height: mainSize * 1.12,
              left: 540 - (mainSize * 1.12) / 2,
              top: MAIN_Y - (mainSize * 1.12) / 2 + bob,
              borderRadius: "50%",
              border: `${Math.round(mainSize * 0.075)}px solid ${accent}`,
              boxShadow: `0 0 40px ${accent}aa, inset 0 0 40px ${accent}66`,
              opacity: interpolate(frame, [8, 12], [0, 1], clamp),
              scale: interpolate(frame, [8, 16], [1.6, 1], { ...clamp, easing: POP }),
              rotate: `${interpolate(frame, [8, 16], [-25, 0], { ...clamp, easing: EASE })}deg`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100%",
                height: Math.round(mainSize * 0.075),
                translate: "-50% -50%",
                rotate: "-45deg",
                background: accent,
                boxShadow: `0 0 30px ${accent}aa`,
                borderRadius: 8,
              }}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
