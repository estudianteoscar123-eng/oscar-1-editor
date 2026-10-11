import React from "react";
import { DISPLAY, Pal, SANS, alpha, mix } from "../ee46f/theme";

// Escalera vista de frente-lado. missing: el primer escalón no existe (0 = falta, 1 = aparece)
export const Stairs: React.FC<{ pal: Pal; first: number; steps?: number }> = ({ pal, first, steps = 6 }) => {
  const sw = 150;
  const sh = 92;
  const top = mix(pal.l, "#ffffff", 0.2);
  const side = mix(pal.m, "#000000", 0.2);
  return (
    <g>
      {Array.from({ length: steps }, (_, k) => {
        const x = k * sw;
        const y = -(k + 1) * sh;
        const isFirst = k === 0;
        const o = isFirst ? first : 1;
        return (
          <g key={k} opacity={o} transform={isFirst ? `translate(0 ${(1 - first) * 40})` : undefined}>
            <rect x={x} y={y} width={sw} height={(k + 1) * sh} fill={side} />
            <rect x={x} y={y} width={sw} height={16} fill={top} />
            <rect x={x} y={y} width={sw} height={(k + 1) * sh} fill="none" stroke={alpha(pal.l, 0.35)} strokeWidth={2} />
          </g>
        );
      })}
      {first < 0.5 && <rect x={0} y={-sh} width={sw} height={sh} fill="none" stroke={alpha(pal.l, 0.6)} strokeWidth={4} strokeDasharray="14 12" />}
    </g>
  );
};

export const DocPage: React.FC<{ pal: Pal; lines: number; cursor: boolean; w?: number; h?: number }> = ({ pal, lines, cursor, w = 300, h = 400 }) => {
  const ink = mix(pal.m, "#000000", 0.3);
  const full = Math.floor(lines);
  const part = lines - full;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={mix(pal.l, "#ffffff", 0.75)} />
      <path d={`M${w / 2 - 60} ${-h / 2} L${w / 2} ${-h / 2 + 60} L${w / 2 - 60} ${-h / 2 + 60} Z`} fill={mix(pal.l, "#000000", 0.2)} />
      {Array.from({ length: full + 1 }, (_, k) => {
        const len = k < full ? 200 - ((k * 37) % 70) : 200 * part;
        return len > 2 ? <rect key={k} x={-w / 2 + 40} y={-h / 2 + 90 + k * 44} width={len} height={14} rx={7} fill={ink} opacity={0.75} /> : null;
      })}
      {cursor && <rect x={-w / 2 + 40 + (full < 1 && part < 0.01 ? 0 : 200 * part)} y={-h / 2 + 82 + full * 44} width={6} height={30} fill={ink} />}
    </g>
  );
};

export const Timer: React.FC<{ pal: Pal; secs: number; prog: number }> = ({ pal, secs, prog }) => {
  const r = 150;
  const C = 2 * Math.PI * r;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const mm = Math.floor(secs / 60);
  const ss = Math.floor(secs % 60);
  return (
    <g>
      <circle r={r} fill={mix(pal.m, "#000000", 0.45)} stroke={alpha(pal.l, 0.25)} strokeWidth={18} />
      <circle r={r} fill="none" stroke={ink} strokeWidth={18} strokeDasharray={C} strokeDashoffset={C * (1 - prog)} transform="rotate(-90)" strokeLinecap="round" />
      <text y={26} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={84} fill={ink}>
        {`${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}
      </text>
    </g>
  );
};

// Sombra amenazante (la culpa / el miedo): silueta difusa con ojos
export const Shade: React.FC<{ pal: Pal; s?: number; eyes?: number }> = ({ pal, s = 1, eyes = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-160 260 C-170 60 -120 -150 0 -170 C120 -150 170 60 160 260 C120 230 80 270 40 240 C0 270 -40 230 -80 260 C-110 236 -140 270 -160 260 Z" fill={mix(pal.m, "#000000", 0.75)} style={{ filter: "blur(6px)" }} />
    <ellipse cx={-45} cy={-60} rx={20} ry={9 * eyes} fill={mix(pal.l, "#ffffff", 0.3)} />
    <ellipse cx={45} cy={-60} rx={20} ry={9 * eyes} fill={mix(pal.l, "#ffffff", 0.3)} />
  </g>
);

export const Shirt: React.FC<{ fill: string }> = ({ fill }) => (
  <path d="M-60 -90 L-110 -60 L-140 0 L-95 20 L-80 -10 L-80 100 L80 100 L80 -10 L95 20 L140 0 L110 -60 L60 -90 C40 -60 -40 -60 -60 -90 Z" fill={fill} />
);

export const ContactCard: React.FC<{ pal: Pal; saved: number }> = ({ pal, saved }) => {
  const ink = mix(pal.m, "#000000", 0.35);
  return (
    <g>
      <rect x={-170} y={-110} width={340} height={220} rx={26} fill={mix(pal.l, "#ffffff", 0.7)} />
      <circle cx={-90} cy={-10} r={46} fill={mix(pal.l, "#000000", 0.15)} />
      <rect x={-20} y={-40} width={150} height={18} rx={9} fill={ink} />
      <rect x={-20} y={0} width={110} height={14} rx={7} fill={ink} opacity={0.5} />
      <g transform="translate(110 70)" opacity={saved}>
        <circle r={24} fill={pal.m} />
        <path d="M-10 0 L-2 8 L12 -8" stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

export const Coin: React.FC<{ pal: Pal }> = ({ pal }) => (
  <g>
    <circle r={48} fill={mix(pal.l, "#ffffff", 0.2)} />
    <circle r={36} fill="none" stroke={mix(pal.m, "#000000", 0.3)} strokeWidth={4} opacity={0.6} />
    <text y={20} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={56} fill={mix(pal.m, "#000000", 0.3)} opacity={0.7}>
      $
    </text>
  </g>
);

export const SendBtn: React.FC<{ pal: Pal; press: number }> = ({ pal, press }) => (
  <g transform={`scale(${1 - press * 0.12})`}>
    <circle r={56} fill={mix(pal.l, "#ffffff", 0.2)} />
    <path d="M-22 -26 L30 0 L-22 26 L-12 0 Z" fill={pal.m} />
  </g>
);

export const Small: React.FC<{ y: number; fill: string; size?: number; children: React.ReactNode }> = ({ y, fill, size = 30, children }) => (
  <text y={y} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={size} fill={fill} letterSpacing={2}>
    {children}
  </text>
);
