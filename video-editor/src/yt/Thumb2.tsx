import React from "react";
import { AbsoluteFill } from "remotion";
import { rnd } from "./Kit";

// Miniatura hecha a mano (no es un cuadro del video): personaje enorme brillante, amenaza gigante, luz dramática, 2 palabras.
const Hero: React.FC<{ px?: number }> = ({ px = 0 }) => (
  <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="h-head" cx="34%" cy="28%" r="78%"><stop offset="0%" stopColor="#5A5A66" /><stop offset="35%" stopColor="#23232B" /><stop offset="100%" stopColor="#050507" /></radialGradient>
      <radialGradient id="h-warm" cx="85%" cy="80%" r="70%"><stop offset="0%" stopColor="#FFB04A" stopOpacity="0.85" /><stop offset="100%" stopColor="#FFB04A" stopOpacity="0" /></radialGradient>
      <linearGradient id="h-robe" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor="#FFF6E4" /><stop offset="60%" stopColor="#EDE3CC" /><stop offset="100%" stopColor="#B8A98A" /></linearGradient>
      <radialGradient id="h-mouth" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#5A1418" /><stop offset="100%" stopColor="#1A0406" /></radialGradient>
      <radialGradient id="h-flame" cx="50%" cy="60%" r="50%"><stop offset="0%" stopColor="#FFF6C8" /><stop offset="40%" stopColor="#FFC24A" /><stop offset="100%" stopColor="#FF6A1A" stopOpacity="0" /></radialGradient>
    </defs>
    {/* cuerpo */}
    <path d="M250 720 C 250 600, 330 545, 470 540 C 610 545, 690 600, 700 720 Z" fill="url(#h-robe)" />
    <path d="M400 548 L 470 640 L 540 548" stroke="#C9BBA0" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M280 690 Q 470 668 670 690" stroke="#2F6FB0" strokeWidth={26} fill="none" />
    {/* brazo con lámpara */}
    <path d="M640 600 Q 720 610 760 560" stroke="#EDE3CC" strokeWidth={60} strokeLinecap="round" fill="none" />
    <path d="M760 560 L 800 520" stroke="#111" strokeWidth={30} strokeLinecap="round" />
    <circle cx={806} cy={514} r={28} fill="#111" />
    <g transform="translate(830 500)">
      <path d="M-70 0 Q -62 -44 0 -48 Q 62 -44 82 -20 L 112 -28 Q 100 -4 70 0 Z" fill="#C27A42" />
      <path d="M-58 -26 Q -20 -38 20 -34" stroke="#F0B47A" strokeWidth={6} fill="none" opacity={0.7} />
      <ellipse cx={108} cy={-60} rx={60} ry={80} fill="url(#h-flame)" />
      <path d="M106 -30 C 86 -50, 92 -86, 110 -110 C 126 -86, 128 -52, 106 -30 Z" fill="#FFB43A" />
      <path d="M107 -36 C 98 -50, 100 -70, 110 -82 C 118 -70, 118 -50, 107 -36 Z" fill="#FFF3B0" />
    </g>
    {/* cabeza */}
    <g transform="translate(470 330)">
      {[[-80, -150, -110, -235], [-30, -175, -38, -270], [25, -178, 40, -268], [80, -150, 118, -228], [-130, -100, -195, -150], [130, -95, 190, -140]].map(([a, b, c, d], i) => (
        <path key={i} d={`M${a} ${b} Q ${(a + c) / 2 + 14} ${(b + d) / 2} ${c} ${d}`} stroke="#0A0A0C" strokeWidth={17} fill="none" strokeLinecap="round" />
      ))}
      <circle r={200} fill="url(#h-head)" />
      <circle r={200} fill="url(#h-warm)" />
      <ellipse cx={-80} cy={-112} rx={70} ry={34} fill="#FFFFFF" opacity={0.16} transform="rotate(-28 -80 -112)" />
      <ellipse cx={-96} cy={-124} rx={22} ry={10} fill="#FFFFFF" opacity={0.5} transform="rotate(-28 -96 -124)" />
      {/* cejas levantadas */}
      <path d="M-120 -96 Q -78 -132 -30 -106" stroke="#FFF" strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d="M30 -110 Q 82 -138 126 -98" stroke="#FFF" strokeWidth={15} fill="none" strokeLinecap="round" />
      {/* ojos enormes */}
      <ellipse cx={-70} cy={-22} rx={50} ry={62} fill="#FFF" />
      <ellipse cx={72} cy={-22} rx={50} ry={62} fill="#FFF" />
      <circle cx={-70 + px} cy={-18} r={13} fill="#0A0A0C" /><circle cx={72 + px} cy={-18} r={13} fill="#0A0A0C" />
      <circle cx={-66 + px} cy={-22} r={4} fill="#FFF" /><circle cx={76 + px} cy={-22} r={4} fill="#FFF" />
      {/* boca abierta */}
      <path d="M-62 70 Q 0 30 62 70 Q 70 150 0 160 Q -70 150 -62 70 Z" fill="url(#h-mouth)" />
      <path d="M-54 72 Q 0 44 54 72 L 50 84 Q 0 62 -50 84 Z" fill="#FFF" />
      <ellipse cx={0} cy={138} rx={30} ry={12} fill="#C8424A" />
      {/* gotas de sudor */}
      <path d="M150 -70 Q 132 -40 150 -20 Q 168 -40 150 -70 Z" fill="#BFE6FF" />
      <path d="M-170 -10 Q -184 14 -170 30 Q -156 14 -170 -10 Z" fill="#BFE6FF" />
    </g>
  </svg>
);

export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: "#05040A", overflow: "hidden" }}>
    {/* fondo */}
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="c-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A0C2E" /><stop offset="60%" stopColor="#2A1240" /><stop offset="100%" stopColor="#4A1A2A" /></linearGradient>
        <radialGradient id="c-door" cx="86%" cy="62%" r="55%"><stop offset="0%" stopColor="#FFB84A" stopOpacity="0.95" /><stop offset="35%" stopColor="#FF7A2A" stopOpacity="0.45" /><stop offset="100%" stopColor="#FF7A2A" stopOpacity="0" /></radialGradient>
        <linearGradient id="c-ray" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stopColor="#FFD27A" stopOpacity="0.55" /><stop offset="100%" stopColor="#FFD27A" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width={1280} height={720} fill="url(#c-sky)" />
      {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={rnd(i) * 1280} cy={rnd(i + 9) * 320} r={0.8 + rnd(i + 3) * 1.6} fill="#fff" opacity={0.3 + rnd(i + 5) * 0.6} />)}
      <circle cx={640} cy={120} r={62} fill="#EDEBFF" /><circle cx={640} cy={120} r={170} fill="#B8B0FF" opacity={0.12} />
      {/* silueta de la ciudad */}
      <path d="M0 470 L 60 470 L 60 420 L 150 420 L 150 450 L 230 450 L 230 400 L 330 400 L 330 460 L 900 460 L 900 380 L 1000 380 L 1000 440 L 1280 440 L 1280 720 L 0 720 Z" fill="#12091C" />
      {/* casa con la puerta marcada */}
      <rect x={960} y={250} width={320} height={470} fill="#3E1E2A" />
      <rect x={1040} y={360} width={170} height={300} fill="#FFC86A" />
      <rect x={1040} y={360} width={70} height={300} fill="#5E3218" />
      <g fill="#D0101C"><path d="M1022 340 L 1228 340 L 1228 362 Q 1190 372 1170 360 Q 1130 376 1100 362 Q 1060 374 1022 362 Z" /><rect x={1022} y={356} width={18} height={250} /><rect x={1210} y={356} width={18} height={230} />
        {[1050, 1090, 1150, 1190].map((x, i) => <g key={i}><rect x={x} y={360} width={7} height={26 + i * 12} rx={3} /><circle cx={x + 3.5} cy={386 + i * 12} r={6} /></g>)}</g>
      <rect width={1280} height={720} fill="url(#c-door)" />
      {[[-10, 120], [10, 160], [28, 110]].map(([a, w], i) => <path key={i} d={`M1110 420 L 620 ${300 + a * 8} L 620 ${300 + a * 8 + w} Z`} fill="url(#c-ray)" opacity={0.5} />)}
    </svg>
    {/* la sombra gigante */}
    <AbsoluteFill style={{ filter: "blur(2px)" }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs><radialGradient id="c-eye"><stop offset="0%" stopColor="#FFF" /><stop offset="30%" stopColor="#FF2A2A" /><stop offset="100%" stopColor="#FF2A2A" stopOpacity="0" /></radialGradient></defs>
        <path d="M-40 720 C -30 460, 10 250, 150 140 C 230 80, 330 90, 370 180 C 400 260, 360 360, 330 460 C 310 560, 330 650, 360 720 Z" fill="#020104" opacity={0.96} />
        <path d="M330 330 C 420 300, 520 250, 600 200 L 640 160 M 600 200 L 660 190 M 600 200 L 650 230" stroke="#020104" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.95} />
        <circle cx={205} cy={235} r={36} fill="url(#c-eye)" /><circle cx={275} cy={232} r={36} fill="url(#c-eye)" />
      </svg>
    </AbsoluteFill>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute" }}>
      {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={700 + rnd(i + 40) * 560} cy={250 + rnd(i + 60) * 420} r={1.5 + rnd(i) * 3} fill="#FFC86A" opacity={0.5 + rnd(i + 2) * 0.5} />)}
      <ellipse cx={640} cy={720} rx={760} ry={110} fill="#0E1A14" opacity={0.7} />
    </svg>
    {/* personaje con contorno de luz */}
    <AbsoluteFill style={{ filter: "drop-shadow(0 0 3px #fff) drop-shadow(0 0 3px #fff) drop-shadow(0 0 18px rgba(255,200,120,.9))" }}><Hero px={18} /></AbsoluteFill>
    {/* texto */}
    <div style={{ position: "absolute", left: 700, top: 40, transform: "rotate(-6deg)", fontFamily: "YCap", fontSize: 104, lineHeight: 0.95, color: "#FFE234", WebkitTextStroke: "16px #120604", paintOrder: "stroke fill", textShadow: "0 10px 0 #120604, 0 0 40px rgba(255,200,40,.5)", textAlign: "center" }}>¡NO<br />SALGAS!</div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.45) 100%)" }} />
  </AbsoluteFill>
);

// Miniatura D: elección entre dos puertas (comparación + brecha de curiosidad + peligro visible)
export const ThumbD: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="d-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06121E" /><stop offset="100%" stopColor="#0E2A3A" /></linearGradient>
        <linearGradient id="d-r" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFB040" /><stop offset="100%" stopColor="#B8461A" /></linearGradient>
        <radialGradient id="d-rg" cx="84%" cy="55%" r="45%"><stop offset="0%" stopColor="#FFF0B0" stopOpacity="0.95" /><stop offset="100%" stopColor="#FFB040" stopOpacity="0" /></radialGradient>
        <radialGradient id="d-lg" cx="14%" cy="60%" r="40%"><stop offset="0%" stopColor="#B0101C" stopOpacity="0.55" /><stop offset="100%" stopColor="#B0101C" stopOpacity="0" /></radialGradient>
        <radialGradient id="d-eye"><stop offset="0%" stopColor="#FFF" /><stop offset="30%" stopColor="#FF1A1A" /><stop offset="100%" stopColor="#FF1A1A" stopOpacity="0" /></radialGradient>
        <linearGradient id="d-ray" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stopColor="#FFF2B8" stopOpacity="0.7" /><stop offset="100%" stopColor="#FFF2B8" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width={640} height={720} fill="url(#d-l)" />
      <rect x={640} width={640} height={720} fill="url(#d-r)" />
      {/* puerta izquierda: entreabierta, oscuridad, ojos y mano */}
      <rect x={50} y={200} width={290} height={520} fill="#020306" />
      <rect x={60} y={210} width={270} height={510} fill="#2A1C14" />
      {[120, 180, 240].map((v) => <rect key={v} x={v} y={210} width={6} height={510} fill="#000" opacity={0.35} />)}
      <path d="M300 210 L 340 210 L 340 720 L 300 720 Z" fill="#000" />
      <circle cx={318} cy={330} r={22} fill="url(#d-eye)" /><circle cx={320} cy={372} r={22} fill="url(#d-eye)" />
      <g strokeLinecap="round" fill="none">
        {[["#9A2A5A", 7], ["#030208", 0]].map(([c, o], k) => <g key={k} stroke={c as string} transform={`translate(${o} ${o})`}>
          <path d="M330 540 C 360 536, 385 520, 400 500" strokeWidth={k ? 30 : 38} />
          {[[400, 500, 470, 430], [400, 500, 485, 478], [400, 500, 478, 528], [400, 500, 452, 565], [392, 510, 405, 580]].map(([a, b, c2, d], i) => <path key={i} d={`M${a} ${b} Q ${(a + c2) / 2 + 4} ${(b + d) / 2 - 22} ${c2} ${d}`} strokeWidth={k ? 11 : 17} />)}
        </g>)}
      </g>
      <rect width={640} height={720} fill="url(#d-lg)" />
      {/* puerta derecha: sangre y luz */}
      <rect x={930} y={200} width={290} height={520} fill="#3A1A08" />
      <rect x={940} y={210} width={270} height={510} fill="#FFE4A0" />
      <rect x={940} y={210} width={150} height={510} fill="#6E3A18" />
      <g fill="#C8101C"><path d="M918 186 L 1232 186 L 1232 214 Q 1190 226 1160 212 Q 1120 230 1080 212 Q 1030 228 918 212 Z" /><rect x={918} y={206} width={22} height={330} /><rect x={1210} y={206} width={22} height={300} />
        {[960, 1010, 1070, 1130, 1180].map((x, i) => <g key={i}><rect x={x} y={210} width={8} height={30 + (i % 3) * 22} rx={4} /><circle cx={x + 4} cy={240 + (i % 3) * 22} r={7} /></g>)}</g>
      <rect x={640} width={640} height={720} fill="url(#d-rg)" />
      {[[0, 140], [-30, 90], [40, 110]].map(([a, w], i) => <path key={i} d={`M1100 420 L 640 ${330 + a * 4} L 640 ${330 + a * 4 + w} Z`} fill="url(#d-ray)" opacity={0.45} />)}
      <path d="M640 0 L 640 720" stroke="#000" strokeWidth={8} />
      <ellipse cx={330} cy={720} rx={520} ry={80} fill="#0A1A14" opacity={0.9} />
      {/* flecha roja hacia la mano */}
      <g transform="translate(140 110) rotate(22)"><path d="M0 0 Q 120 -30 190 60" stroke="#FF2A2A" strokeWidth={16} fill="none" strokeLinecap="round" /><path d="M170 30 L 205 85 L 140 72 Z" fill="#FF2A2A" /></g>
    </svg>
    <AbsoluteFill style={{ transform: "translate(250px, 90px) scale(0.84)", transformOrigin: "470px 330px", filter: "drop-shadow(0 0 3px #fff) drop-shadow(0 0 3px #fff) drop-shadow(0 0 16px rgba(255,255,255,.7))" }}><Hero px={-24} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 6, textAlign: "center", fontFamily: "YCap", fontSize: 120, color: "#FFE234", WebkitTextStroke: "18px #120604", paintOrder: "stroke fill", textShadow: "0 10px 0 #120604", transform: "rotate(-3deg)" }}>¿CUÁL?</div>
  </AbsoluteFill>
);
