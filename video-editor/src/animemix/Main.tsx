import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ip } from "../ee46f/theme";
import plan from "../../public/animemix/plan.json";

// Tu toma con voz de base; encima, fragmentos de anime de 1–1,5 s alineados con lo que se dice
const FPS = 30;
type Frag = { src: string; start: number; from: number; dur: number };
const WH = plan.wh as unknown as Record<string, [number, number]>;

const AnimeFrag: React.FC<{ f: Frag; i: number; first: boolean; last: boolean; dur: number }> = ({ f, i, first, last, dur }) => {
  const t = useCurrentFrame();
  const [w, h] = WH[f.src];
  // encuadre "cover" a 9:16, centrado
  const s = Math.max(1080 / w, 1920 / h);
  const W = w * s;
  const H = h * s;
  const zoom = i % 2 ? ip(t, [0, dur], [1.0, 1.08]) : ip(t, [0, dur], [1.1, 1.0]);
  const shake = i % 4 === 0 && t < 5 ? Math.sin(t * 2.6 + i) * 14 * (1 - t / 5) : 0;
  const flashIn = first ? ip(t, [0, 7], [0.55, 0]) : ip(t, [0, 3], [0.18, 0]);
  const flashOut = last ? ip(t, [dur - 4, dur], [0, 0.45]) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <Video
          src={staticFile(`animemix/${f.src}.mp4`)}
          trimBefore={Math.round(f.start * FPS)}
          muted
          style={{ position: "absolute", left: (1080 - W) / 2, top: (1920 - H) / 2, width: W, height: H, filter: "contrast(1.08) saturate(1.1)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#ffffff", opacity: Math.max(flashIn, flashOut), mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// Destello corto cuando vuelve tu cámara
const BackToCam: React.FC = () => {
  const t = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#ffffff", opacity: ip(t, [0, 7], [0.4, 0]), mixBlendMode: "screen" }} />;
};

export const AnimeMix: React.FC<{ video: "progreso" | "momento" }> = ({ video }) => {
  const frags = (plan as unknown as Record<string, { frags: Frag[] }>)[video].frags;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video src={staticFile(`animemix/${video}.mp4`)} style={{ width: 1080, height: 1920 }} />
      {frags.map((f, i) => {
        const from = Math.round(f.from * FPS);
        const to = Math.round((f.from + f.dur) * FPS);
        const prev = frags[i - 1];
        const next = frags[i + 1];
        const first = !prev || Math.abs(prev.from + prev.dur - f.from) > 0.02;
        const last = !next || Math.abs(f.from + f.dur - next.from) > 0.02;
        return (
          <React.Fragment key={i}>
            <Sequence from={from} durationInFrames={to - from}>
              <AnimeFrag f={f} i={i} first={first} last={last} dur={to - from} />
            </Sequence>
            {last && (
              <Sequence from={to} durationInFrames={8}>
                <BackToCam />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
