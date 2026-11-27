import React from "react";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "./sl15data.json";

// SL · prueba de 15 s: solo música + subtítulos estilo A (editorial), entrando en los golpes del tema.
const F = (family: string, file: string, weight = "400", style = "normal") => loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });
F("Sans", "instrument-sans-latin-500-normal.woff2", "500");
F("SansB", "instrument-sans-latin-600-normal.woff2", "600");
F("Gloock", "gloock-latin-400-normal.woff2");
F("Ital", "playfair-display-latin-400-italic.woff2", "400", "italic");
F("Script", "alex-brush-latin-400-normal.woff2");
F("Brush", "mr-dafoe-latin-400-normal.woff2");
const STYLE: Record<string, [string, string]> = { Sans: ["normal", "500"], SansB: ["normal", "600"], Gloock: ["normal", "400"], Ital: ["italic", "400"], Script: ["normal", "400"], Brush: ["normal", "400"] };

type Seg = { t: string; f: string; s: number; c: string; ls: number; at: number };
type Line = { segs: Seg[]; x: number; y: number; anchor: string; rot: number; sw: number };
type Frame = { from: number; lines: Line[] };
const FR = data as Frame[];
const FPS = 30;
export const SL15_TOTAL = 15 * FPS;

export const SL15: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  let i = 0;
  while (i < FR.length - 1 && t >= FR[i + 1].from) i++;
  const fr = FR[i];
  const zoom = 1.08 + t * 0.004;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* fondo: el mismo edit, muy desenfocado y oscuro (sin marca ni cara reconocible) */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("sl15/clip.mp4")} muted style={{ position: "absolute", width: 1900, height: 3378, left: -410, top: -726, transform: `scale(${zoom})`, transformOrigin: "50% 37%", filter: "blur(34px) brightness(0.45) saturate(0.75)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)" }} />
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="sh" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.55" /></filter>
        </defs>
        {fr.lines.map((l, k) => (
          <text key={k} x={l.x} y={l.y} textAnchor={l.anchor as "start" | "middle" | "end"} filter="url(#sh)" transform={l.rot ? `rotate(${l.rot} ${l.x} ${l.y})` : undefined}>
            {l.segs.map((s, j) => {
              const a = interpolate(t, [s.at - 0.02, s.at + 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const [st, w] = STYLE[s.f];
              return (
                <tspan key={j} fontFamily={s.f} fontStyle={st} fontWeight={w} fontSize={s.s} fill={s.c} fillOpacity={a} letterSpacing={s.ls} stroke={l.sw ? s.c : undefined} strokeWidth={l.sw || undefined} strokeOpacity={a}>{s.t}</tspan>
              );
            })}
          </text>
        ))}
      </svg>
      <Audio src={staticFile("sl15/clip.mp4")} volume={(fr2) => 0.8 * interpolate(fr2 / FPS, [0, 0.05, 14.4, 15], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
