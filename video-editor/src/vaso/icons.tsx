import React from "react";
import { DISPLAY, SANS } from "../ee46f/theme";

// Iconos monocromos: se pintan con el degradado del objeto de cada escena
type C = { fill: string; dark: string };

export const Trophy: React.FC<C> = ({ fill, dark }) => (
  <g>
    <path d="M-70 -110 H70 V-60 C70 0 36 34 0 34 C-36 34 -70 0 -70 -60 Z" fill={fill} />
    <path d="M-70 -92 C-122 -92 -118 -20 -56 -14" fill="none" stroke={fill} strokeWidth={14} strokeLinecap="round" />
    <path d="M70 -92 C122 -92 118 -20 56 -14" fill="none" stroke={fill} strokeWidth={14} strokeLinecap="round" />
    <rect x={-12} y={30} width={24} height={40} fill={fill} />
    <rect x={-56} y={66} width={112} height={26} rx={8} fill={fill} />
    <path d="M-12 -78 L0 -96 L12 -78 Z" fill={dark} opacity={0.5} />
    <path d="M-40 -96 C-40 -40 -20 -10 0 0" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const Coin: React.FC<C> = ({ fill, dark }) => (
  <g>
    <circle r={64} fill={fill} />
    <circle r={50} fill="none" stroke={dark} strokeWidth={5} opacity={0.5} />
    <text y={28} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={78} fill={dark} opacity={0.6}>
      $
    </text>
  </g>
);

export const Star: React.FC<C & { r?: number }> = ({ fill, r = 66 }) => {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rr = k % 2 ? r * 0.44 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} strokeLinejoin="round" stroke={fill} strokeWidth={8} />;
};

export const Heart: React.FC<{ fill: string; s?: number }> = ({ fill, s = 1 }) => (
  <path transform={`scale(${s})`} d="M0 34 C-70 -8 -50 -70 0 -36 C50 -70 70 -8 0 34 Z" fill={fill} />
);

export const Moon: React.FC<{ fill: string }> = ({ fill }) => <path d="M34 -78 A82 82 0 1 0 34 78 A64 64 0 1 1 34 -78 Z" fill={fill} />;

export const Person: React.FC<{ fill: string }> = ({ fill }) => (
  <g>
    <circle cy={-34} r={22} fill={fill} />
    <path d="M-38 30 C-38 -4 -20 -10 0 -10 C20 -10 38 -4 38 30 Z" fill={fill} />
  </g>
);

// Mano ahuecada (derecha). La izquierda es la misma con scale(-1,1)
export const Hand: React.FC<{ fill: string; stroke: string }> = ({ fill, stroke }) => (
  <g>
    <path d="M330 -8 C250 -16 175 36 92 46 C50 50 18 38 8 20 C2 8 10 -4 24 1 C56 12 96 8 128 -8 C162 -24 220 -58 330 -58 Z" fill={fill} stroke={stroke} strokeWidth={3} />
    <path d="M196 -46 C170 -70 150 -86 128 -92" stroke={fill} strokeWidth={30} strokeLinecap="round" fill="none" />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M${70 + k * 34} ${36 - k * 6} C${60 + k * 34} ${18 - k * 6} ${66 + k * 34} ${6 - k * 6} ${80 + k * 34} ${2 - k * 6}`} stroke={stroke} strokeWidth={3} fill="none" opacity={0.5} />
    ))}
  </g>
);

export const Card: React.FC<{ w: number; h: number; fill: string; edge: string; children?: React.ReactNode }> = ({ w, h, fill, edge, children }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill={fill} stroke={edge} strokeWidth={2} />
    {children}
  </g>
);

export const Label: React.FC<{ y: number; size: number; fill: string; children: React.ReactNode; weight?: number; display?: boolean }> = ({ y, size, fill, children, weight = 700, display }) => (
  <text y={y} textAnchor="middle" fontFamily={display ? DISPLAY : SANS} fontStyle={display ? "italic" : "normal"} fontWeight={display ? 900 : weight} fontSize={size} fill={fill}>
    {children}
  </text>
);
