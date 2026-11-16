import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { KingScene } from "./KingTest";

// 2.5D · personaje 2D vectorial calcado de la referencia (medidas relativas al centro de la cabeza) sobre escenario 3D.
// Capas: trono 3D (fondo) → personaje 2D → apoyabrazos 3D (delante) → acabado.
const L = "#24242A"; // trazo gris muy oscuro, como en la referencia
const CX = 525, CY = 770;
export const Toon2D: React.FC<{ t: number }> = ({ t }) => {
  const blink = (t * 0.31) % 1 < 0.035;
  const br = Math.sin(t * 2.1) * 3;
  const P = (x: number, y: number) => `${CX + x} ${CY + y + br}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="hd" cx="40%" cy="38%" r="68%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="62%" stopColor="#F7F7FA" /><stop offset="88%" stopColor="#DCDDE8" /><stop offset="100%" stopColor="#B9BBD0" /></radialGradient>
        <linearGradient id="jk" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor="#0C0C10" /><stop offset="38%" stopColor="#2C2C33" /><stop offset="70%" stopColor="#1A1A20" /><stop offset="100%" stopColor="#09090C" /></linearGradient>
        <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF0A0" /><stop offset="45%" stopColor="#F2C42C" /><stop offset="100%" stopColor="#C99410" /></linearGradient>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#09090B" /><stop offset="60%" stopColor="#2A2A30" /><stop offset="100%" stopColor="#0B0B0E" /></linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1" /></filter>
        <filter id="sh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>
      {/* sombra de contacto sobre el asiento */}
      <ellipse cx={530} cy={1372} rx={190} ry={30} fill="rgba(0,0,0,0.55)" filter="url(#sh)" />
      {/* piernas: muslo hacia delante (escorzo) y caída por el borde del asiento */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M${530 + sd * 48} 1330 C ${530 + sd * 54} 1400, ${530 + sd * 60} 1420, ${530 + sd * 62} 1450 C ${530 + sd * 66} 1600, ${530 + sd * 72} 1720, ${530 + sd * 80} 1830`} stroke="url(#lg)" strokeWidth={24} fill="none" strokeLinecap="round" />
          <path d={`M${530 + sd * 48} 1330 C ${530 + sd * 54} 1400, ${530 + sd * 60} 1420, ${530 + sd * 62} 1450 C ${530 + sd * 66} 1600, ${530 + sd * 72} 1720, ${530 + sd * 80} 1830`} stroke={L} strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.0} />
          <ellipse cx={530 + sd * 92} cy={1850} rx={50} ry={32} fill="#111114" stroke={L} strokeWidth={4} />
          <ellipse cx={530 + sd * 80} cy={1840} rx={20} ry={8} fill="#3A3A42" opacity={0.6} />
        </g>
      ))}
      {/* cuerpo de frijol: chaqueta negra con capucha, cierre y bolsillos */}
      <g transform={`translate(0 ${br * 0.5})`}>
        <path d="M530 930 C 602 930, 645 975, 662 1050 C 684 1140, 694 1235, 676 1298 C 656 1352, 598 1372, 530 1372 C 462 1372, 404 1352, 384 1298 C 366 1235, 376 1140, 398 1050 C 415 975, 458 930, 530 930 Z" fill="url(#jk)" stroke={L} strokeWidth={6} />
        <path d="M470 960 C 440 1060, 430 1200, 452 1330" stroke="#3A3A44" strokeWidth={10} fill="none" opacity={0.7} />
        <path d="M513 955 L506 1360" stroke="#ECECEC" strokeWidth={5} strokeDasharray="9 6" />
        <path d="M547 955 L554 1360" stroke="#ECECEC" strokeWidth={5} strokeDasharray="9 6" />
        <path d="M430 1140 L486 1152 L482 1162 M630 1140 L574 1152 L578 1162" stroke="#ECECEC" strokeWidth={5} strokeLinecap="round" fill="none" />
        <path d="M455 945 Q530 1000 605 945 Q600 920 588 912 Q530 955 472 912 Q460 920 455 945 Z" fill="#202027" stroke={L} strokeWidth={5} />
      </g>
      {/* brazo derecho apoyado en el apoyabrazos */}
      <path d="M640 1010 C 700 1060, 780 1110, 860 1100" stroke="url(#lg)" strokeWidth={19} fill="none" strokeLinecap="round" />
      <circle cx={885} cy={1096} r={40} fill="#121215" stroke={L} strokeWidth={4} />
      <circle cx={874} cy={1084} r={12} fill="#3A3A42" opacity={0.5} />
      {/* cabeza */}
      <g>
        <ellipse cx={CX} cy={CY + br} rx={246} ry={232} fill="url(#hd)" stroke={L} strokeWidth={9} />
        {/* reflejo lavanda del borde (izquierda y arriba) */}
        <path d={`M${P(-226, 60)} C ${P(-250, -60)} ${P(-170, -190)} ${P(-30, -222)}`} stroke="#9C99C8" strokeWidth={9} fill="none" opacity={0.75} />
        {/* línea del pelo: banda oscura con raya al centro */}
        <path d={`M${P(-235, -40)} C ${P(-200, -150)} ${P(-90, -196)} ${P(10, -200)}`} stroke={L} strokeWidth={21} fill="none" strokeLinecap="round" />
        <path d={`M${P(34, -200)} C ${P(120, -196)} ${P(200, -160)} ${P(236, -70)}`} stroke={L} strokeWidth={21} fill="none" strokeLinecap="round" />
        <path d={`M${P(-222, -20)} C ${P(-190, -132)} ${P(-90, -178)} ${P(10, -182)} M${P(34, -182)} C ${P(120, -178)} ${P(196, -144)} ${P(222, -60)}`} stroke="#A8A6CF" strokeWidth={5} fill="none" opacity={0.7} />
        <g filter="url(#soft)">
          {/* cejas: bloques grises suaves */}
          <path d={`M${P(-98, -140)} Q${P(-50, -168)} ${P(2, -146)}`} stroke="#8C8C92" strokeWidth={24} strokeLinecap="round" fill="none" />
          <path d={`M${P(52, -150)} Q${P(104, -172)} ${P(152, -146)}`} stroke="#8C8C92" strokeWidth={24} strokeLinecap="round" fill="none" />
          {/* lentes rectangulares finos */}
          <rect x={CX - 55} y={CY - 58 + br} width={94} height={52} rx={4} fill="rgba(255,255,255,0.15)" stroke="#26262C" strokeWidth={6} />
          <rect x={CX + 62} y={CY - 62 + br} width={92} height={52} rx={4} fill="rgba(255,255,255,0.15)" stroke="#26262C" strokeWidth={6} />
          <path d={`M${P(39, -36)} L${P(62, -38)} M${P(-55, -32)} L${P(-84, -30)} M${P(154, -40)} L${P(262, -56)}`} stroke="#3A3A40" strokeWidth={5} strokeLinecap="round" />
          {/* ojos a media asta: borde superior recto, abajo redondo */}
          {[[-6, -30], [114, -34]].map(([x, y], i) => (
            <path key={i} d={blink ? `M${P(x - 24, y + 2)} L${P(x + 24, y + 2)}` : `M${P(x - 31, y - 4)} L${P(x + 31, y - 4)} A 31 22 0 0 1 ${P(x - 31, y - 4)} Z`} fill="#4A4A50" stroke="#4A4A50" strokeWidth={blink ? 5 : 2} />
          ))}
          {/* sonrisa de dientes */}
          <path d={`M${P(-30, 22)} L${P(124, 18)} Q${P(132, 18)} ${P(130, 30)} L${P(122, 70)} Q${P(119, 78)} ${P(110, 78)} L${P(-16, 80)} Q${P(-25, 80)} ${P(-27, 72)} L${P(-36, 32)} Q${P(-38, 22)} ${P(-30, 22)} Z`} fill="#FFFFFF" stroke="#2E2E34" strokeWidth={7} strokeLinejoin="round" />
          <path d={[0, 1, 2, 3].map((i) => { const x = -2 + i * 31; return `M${P(x, 22)} L${P(x - 1, 78)}`; }).join(" ") + ` M${P(-33, 50)} L${P(127, 47)}`} stroke="#2E2E34" strokeWidth={4.5} />
          {/* arruga del cachete */}
          <path d={`M${P(-200, -42)} L${P(-182, -52)}`} stroke="#55555C" strokeWidth={7} strokeLinecap="round" />
        </g>
        {/* corona inclinada con brillo y emblema */}
        <g transform={`translate(0 ${br}) rotate(3 ${CX} ${CY - 250})`}>
          <path d={`M${CX - 132} ${CY - 215} L${CX - 128} ${CY - 290} L${CX - 100} ${CY - 250} L${CX - 80} ${CY - 330} L${CX - 52} ${CY - 262} L${CX - 18} ${CY - 345} L${CX + 12} ${CY - 262} L${CX + 50} ${CY - 330} L${CX + 76} ${CY - 254} L${CX + 108} ${CY - 312} L${CX + 128} ${CY - 240} L${CX + 136} ${CY - 215} Z`} fill="url(#gd)" stroke={L} strokeWidth={5} strokeLinejoin="round" />
          {[[-128, -296], [-80, -336], [-18, -352], [50, -336], [108, -318]].map(([x, y], i) => <circle key={i} cx={CX + x} cy={CY + y} r={12} fill="url(#gd)" stroke={L} strokeWidth={4} />)}
          <path d={`M${CX - 134} ${CY - 214} L${CX + 136} ${CY - 214} L${CX + 132} ${CY - 252} L${CX - 128} ${CY - 252} Z`} fill="#F4D04A" stroke={L} strokeWidth={4} />
          <path d={`M${CX - 120} ${CY - 246} L${CX + 120} ${CY - 246}`} stroke="#FFF6C8" strokeWidth={5} opacity={0.8} />
          <rect x={CX - 26} y={CY - 250} width={60} height={34} rx={3} fill="#FFFFFF" stroke={L} strokeWidth={3} />
          <path d={`M${CX - 14} ${CY - 233} q 17 -16 36 0 q -17 14 -30 2`} fill="none" stroke="#76B900" strokeWidth={5} />
        </g>
      </g>
      {/* brazo izquierdo a la barbilla (por delante) */}
      <path d="M420 1010 C 392 1070, 410 1092, 458 1056 C 500 1022, 528 990, 548 958" stroke="url(#lg)" strokeWidth={19} fill="none" strokeLinecap="round" />
      <circle cx={556} cy={944} r={43} fill="#121215" stroke={L} strokeWidth={4} />
      <circle cx={544} cy={930} r={13} fill="#3A3A42" opacity={0.5} />
    </svg>
  );
};
export const King25: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.1) brightness(1.03) blur(1.3px)" }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
          <KingScene t={t} char={false} layer="bg" />
        </ThreeCanvas>
      </AbsoluteFill>
      <Toon2D t={t} />
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.1) brightness(1.03)" }}>
        <ThreeCanvas width={1080} height={1920} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
          <KingScene t={t} char={false} layer="fg" />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 66% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,10,0.5) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={Math.floor(random(`g${f}`) * 50)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};
