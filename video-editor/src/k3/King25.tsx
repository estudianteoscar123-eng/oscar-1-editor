import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { KingScene } from "./KingTest";

// 2.5D · personaje 2D vectorial (trazos limpios) sobre escenario 3D. Prueba contra el fotograma del trono.
const K = "#121216";
export const Toon2D: React.FC<{ t: number }> = ({ t }) => {
  const blink = (t * 0.31) % 1 < 0.035;
  const br = Math.sin(t * 2.1) * 4;
  const lid = blink ? 1 : 0.5;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="hd" cx="42%" cy="36%" r="70%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="70%" stopColor="#F4F5F8" /><stop offset="100%" stopColor="#C9CEDD" /></radialGradient>
        <linearGradient id="jk" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#101014" /><stop offset="45%" stopColor="#2A2A30" /><stop offset="100%" stopColor="#0E0E12" /></linearGradient>
        <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE27A" /><stop offset="55%" stopColor="#E9B820" /><stop offset="100%" stopColor="#B88A10" /></linearGradient>
        <filter id="sh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      {/* sombra en el asiento */}
      <ellipse cx={545} cy={1360} rx={200} ry={34} fill="rgba(0,0,0,0.45)" filter="url(#sh)" />
      {/* piernas colgando */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M${540 + sd * 52} 1330 C ${540 + sd * 58} 1450, ${540 + sd * 70} 1620, ${540 + sd * 78} 1830`} stroke={K} strokeWidth={22} fill="none" strokeLinecap="round" />
          <ellipse cx={540 + sd * 86} cy={1846} rx={44} ry={30} fill={K} />
        </g>
      ))}
      {/* cuerpo de frijol con chaqueta */}
      <g transform={`translate(0 ${br * 0.5})`}>
        <path d="M540 935 C 610 935, 650 980, 668 1060 C 690 1150, 700 1240, 680 1300 C 660 1355, 600 1372, 540 1372 C 480 1372, 420 1355, 400 1300 C 380 1240, 390 1150, 412 1060 C 430 980, 470 935, 540 935 Z" fill="url(#jk)" stroke={K} strokeWidth={6} />
        <path d="M526 960 L522 1355 M554 960 L558 1355" stroke="#E6E6E6" strokeWidth={5} strokeDasharray="10 5" />
        <path d="M440 1150 L492 1162 M640 1150 L588 1162" stroke="#E6E6E6" strokeWidth={6} strokeLinecap="round" />
        <path d="M478 948 Q540 985 602 948 L590 925 Q540 950 490 925 Z" fill="#1E1E24" stroke={K} strokeWidth={5} />
      </g>
      {/* brazo derecho apoyado */}
      <path d="M650 1010 C 720 1060, 800 1110, 880 1095" stroke={K} strokeWidth={18} fill="none" strokeLinecap="round" />
      <circle cx={905} cy={1092} r={40} fill={K} />
      {/* cabeza */}
      <g transform={`translate(0 ${br})`}>
        <ellipse cx={540} cy={760} rx={232} ry={238} fill="url(#hd)" stroke={K} strokeWidth={7} />
        {/* pelo peinado hacia atrás: banda gris con raya */}
        <path d="M330 690 C 360 560, 470 525, 540 525 C 615 525, 720 560, 752 690 C 720 610, 640 575, 540 575 C 440 575, 360 610, 330 690 Z" fill="#9EA0A8" stroke={K} strokeWidth={5} />
        <path d="M545 528 L548 578" stroke={K} strokeWidth={5} />
        {/* lentes */}
        {[0, 1].map((k) => {
          const x0 = k ? 600 : 488, y0 = 703, w = 96, h = 54;
          return (
            <g key={k}>
              <clipPath id={`l${k}`}><rect x={x0} y={y0} width={w} height={h} rx={6} /></clipPath>
              <g clipPath={`url(#l${k})`}><rect x={x0} y={y0} width={w} height={h * lid} fill="#A2A3A9" /><line x1={x0} x2={x0 + w} y1={y0 + h * lid} y2={y0 + h * lid} stroke={K} strokeWidth={5} /><ellipse cx={x0 + w / 2 + 6} cy={y0 + h * lid + 8} rx={11} ry={7} fill={K} opacity={blink ? 0 : 1} /></g>
              <rect x={x0} y={y0} width={w} height={h} rx={6} fill="none" stroke={K} strokeWidth={6} />
            </g>
          );
        })}
        <path d="M584 724 L600 724 M488 722 L455 718 M696 722 L735 716" stroke={K} strokeWidth={5} strokeLinecap="round" />
        {/* sonrisa de dientes */}
        <rect x={512} y={790} width={152} height={52} rx={12} fill="#FFFFFF" stroke={K} strokeWidth={7} />
        <path d={[1, 2, 3, 4].map((i) => `M${512 + i * 30.4} 792 L${512 + i * 30.4} 840`).join(" ") + " M514 816 L662 816"} stroke={K} strokeWidth={4.5} />
        <path d="M360 730 Q352 752 360 772" stroke="#B8BCC8" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* corona inclinada */}
        <g transform="rotate(4 545 520)">
          <path d="M410 545 L418 470 L448 515 L470 440 L500 505 L540 420 L578 505 L610 440 L632 515 L660 470 L668 545 Z" fill="url(#gd)" stroke={K} strokeWidth={5} strokeLinejoin="round" />
          {[[418, 466], [470, 436], [540, 414], [610, 436], [660, 466]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="url(#gd)" stroke={K} strokeWidth={4} />)}
          <path d="M412 545 L666 545 L662 512 L416 512 Z" fill="#F2D25A" stroke={K} strokeWidth={4} />
          <rect x={512} y={516} width={56} height={26} rx={4} fill="#FFFFFF" stroke={K} strokeWidth={3} />
          <ellipse cx={540} cy={529} rx={16} ry={8} fill="none" stroke="#76B900" strokeWidth={4} />
        </g>
      </g>
      {/* brazo izquierdo a la barbilla (por delante del cuerpo) */}
      <path d="M432 1010 C 400 1070, 420 1090, 470 1050 C 510 1015, 540 975, 560 950" stroke={K} strokeWidth={18} fill="none" strokeLinecap="round" />
      <circle cx={566} cy={938} r={42} fill={K} />
    </svg>
  );
};
export const King25: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.1) brightness(1.03) blur(1.2px)" }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
          <KingScene t={t} char={false} />
        </ThreeCanvas>
      </AbsoluteFill>
      <Toon2D t={t} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 66% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,10,0.5) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={Math.floor(random(`g${f}`) * 50)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};
