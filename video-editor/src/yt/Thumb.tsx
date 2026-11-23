import React from "react";
import { AbsoluteFill } from "remotion";
import { Glow, OilLamp } from "./Kit";
import { Padre, Tu } from "./Sets";

// Miniaturas 1280x720 (estilo "¿Y si…?": personaje enorme con contorno de luz, colores saturados, casi sin texto)
const Door: React.FC<{ x: number; y: number; s: number; blood?: boolean; lit?: boolean; t: number }> = ({ x, y, s, blood, lit, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-30} width={260} height={440} fill="#2A1A10" />
    <rect x={0} y={0} width={200} height={400} fill={lit ? "#5E3A1E" : "#2E2030"} />
    {[50, 100, 150].map((v) => <rect key={v} x={v} y={0} width={5} height={400} fill="#000" opacity={0.3} />)}
    {lit ? <rect x={0} y={392} width={200} height={10} fill="#FFD27A" /> : null}
    {blood ? <g fill="#C8101C">
      <path d="M-34 -34 L 234 -34 L 234 -6 Q 200 4 180 -6 Q 150 8 120 -4 Q 80 10 50 -6 Q 20 6 -34 -6 Z" />
      <rect x={-34} y={-10} width={22} height={300} /><rect x={212} y={-10} width={22} height={280} />
      {[10, 60, 110, 170].map((v, i) => <g key={i}><rect x={v} y={-8} width={8} height={30 + i * 16} rx={4} /><circle cx={v + 4} cy={24 + i * 16} r={7} /></g>)}
      <circle cx={-23} cy={292} r={11} /><circle cx={223} cy={272} r={11} />
    </g> : null}
  </g>
);

export const ThumbA: React.FC = () => {
  const t = 1.3;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="ta-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0B1238" /><stop offset="100%" stopColor="#3A1E4E" /></linearGradient>
          <radialGradient id="ta-red" cx="78%" cy="45%" r="55%"><stop offset="0%" stopColor="#FF3A30" stopOpacity="0.55" /><stop offset="100%" stopColor="#FF3A30" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={1280} height={720} fill="url(#ta-sky)" />
        <circle cx={1120} cy={110} r={70} fill="#F2F0FF" /><circle cx={1120} cy={110} r={190} fill="#F2F0FF" opacity={0.12} />
        <rect width={1280} height={720} fill="url(#ta-red)" />
        <rect x={720} y={60} width={560} height={660} fill="#3A2440" />
        <Door x={860} y={210} s={1.05} blood lit t={t} />
        {/* niebla y sombra */}
        <ellipse cx={1000} cy={690} rx={520} ry={90} fill="#0E1A14" opacity={0.85} />
        <g opacity={0.92}><path d="M1180 720 C 1150 520, 1180 380, 1230 300 C 1270 360, 1290 520, 1280 720 Z" fill="#050407" /><circle cx={1238} cy={360} r={6} fill="#FF2A2A" /><circle cx={1258} cy={356} r={6} fill="#FF2A2A" /></g>
        <Glow id="ta-g" x={420} y={430} r={460} o={1} />
      </svg>
      <AbsoluteFill style={{ filter: "drop-shadow(0 0 10px rgba(255,220,160,.95)) drop-shadow(0 0 2px #fff)" }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720">
          <Tu t={t} x={420} y={1180} s={2.05} pose={{ look: [0.9, -0.1], brow: 1, mouth: "o", mouthOpen: 1, eyeOpen: 1.15, armR: [62, 25] }} holdR={<g transform="scale(1.1)"><OilLamp t={t} /></g>} light={1} />
        </svg>
      </AbsoluteFill>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute" }}><Glow id="ta-g2" x={600} y={560} r={220} o={0.7} c="#FFD9A0" /></svg>
    </AbsoluteFill>
  );
};

export const ThumbB: React.FC = () => {
  const t = 2.1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="tb-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0C1A3A" /><stop offset="100%" stopColor="#1A2A5A" /></linearGradient>
          <linearGradient id="tb-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8A3A12" /><stop offset="100%" stopColor="#F28A2A" /></linearGradient>
        </defs>
        <rect width={640} height={720} fill="url(#tb-l)" />
        <rect x={640} width={640} height={720} fill="url(#tb-r)" />
        <path d="M640 0 L 640 720" stroke="#000" strokeWidth={10} />
        <Door x={110} y={230} s={0.95} t={t} />
        <rect x={60} y={430} width={260} height={30} rx={5} fill="#6E4527" />
        <Door x={950} y={230} s={0.95} blood lit t={t} />
        <Glow id="tb-gr" x={1045} y={420} r={420} o={0.9} c="#FFC46A" />
      </svg>
      <AbsoluteFill style={{ filter: "brightness(0.5) saturate(0.7)" }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720"><Padre t={t} x={330} y={1080} s={1.35} facing={-1} pose={{ armL: [25, 85], armR: [25, 85], mouth: "flat", brow: -0.6, browTilt: 0.8, look: [0.5, 0] }} /></svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,.9)) drop-shadow(0 0 2px #fff)" }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720">
          <Tu t={t} x={640} y={1160} s={1.95} pose={{ look: [0, 0], brow: 0.8, browTilt: -0.9, mouth: "worry", armR: [55, 25] }} holdR={<OilLamp t={t} />} light={0.6} />
          <ellipse cx={720} cy={410} rx={10} ry={16} fill="#BFE4FF" />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 40, top: 28, fontFamily: "YMono", fontSize: 108, color: "#FF3B42", WebkitTextStroke: "6px #2A0406", paintOrder: "stroke fill", textShadow: "0 0 30px rgba(255,40,50,.8)" }}>00:11</div>
    </AbsoluteFill>
  );
};
