import React from "react";
import { DISPLAY, Pal, SANS, alpha, mix } from "../ee46f/theme";

// El protagonista: un taco de calendario. La hoja de arriba dice "ALGÚN DÍA"; al arrancarla aparece la siguiente.
const PW = 520;
const PH = 600;

const Page: React.FC<{ pal: Pal; label: string; sub?: string; size?: number; glow?: number; ink?: string }> = ({ pal, label, sub, size = 118, glow = 0, ink }) => {
  const paper = mix(pal.l, "#ffffff", 0.78);
  const head = pal.m;
  const lines = label.split("\n");
  const color = ink ?? mix(pal.m, "#000000", 0.25);
  return (
    <g>
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} rx={34} fill={paper} />
      <path d={`M${-PW / 2} ${-PH / 2 + 34} Q${-PW / 2} ${-PH / 2} ${-PW / 2 + 34} ${-PH / 2} L${PW / 2 - 34} ${-PH / 2} Q${PW / 2} ${-PH / 2} ${PW / 2} ${-PH / 2 + 34} L${PW / 2} ${-PH / 2 + 120} L${-PW / 2} ${-PH / 2 + 120} Z`} fill={head} />
      {sub && (
        <text y={-PH / 2 + 80} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} letterSpacing={8} fill={paper}>
          {sub}
        </text>
      )}
      {lines.map((l, k) => (
        <text
          key={k}
          y={40 + (k - (lines.length - 1) / 2) * size * 0.98 + size * 0.34}
          textAnchor="middle"
          fontFamily={DISPLAY}
          fontStyle="italic"
          fontWeight={900}
          fontSize={size}
          letterSpacing={-3}
          fill={color}
          style={glow ? { filter: `drop-shadow(0 0 ${18 * glow}px ${alpha(pal.l, 0.9)})` } : undefined}
        >
          {l}
        </text>
      ))}
      <line x1={-PW / 2 + 40} y1={PH / 2 - 56} x2={PW / 2 - 40} y2={PH / 2 - 56} stroke={color} strokeOpacity={0.15} strokeWidth={3} />
    </g>
  );
};

export const Calendar: React.FC<{
  id: string;
  pal: Pal;
  label: string;
  sub?: string;
  next?: string;
  nextSub?: string;
  nextPal?: Pal;
  tear?: number; // 0–1 la hoja de arriba se arranca y sale volando
  fly?: [number, number]; // hacia dónde vuela
  size?: number;
  nextSize?: number;
  nextGlow?: number;
  stack?: number; // hojas visibles debajo
}> = ({ id, pal, label, sub = "DÍA", next, nextSub, nextPal, tear = 0, fly = [700, -900], size, nextSize, nextGlow = 0, stack = 6 }) => {
  const t = tear;
  return (
    <g>
      <defs>
        <filter id={`${id}-cg`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" result="b" />
          <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-cg)`}>
        {/* grosor del taco */}
        {Array.from({ length: stack }, (_, k) => (
          <rect key={k} x={-PW / 2 + 4} y={-PH / 2 + 10 + (stack - k) * 7} width={PW - 8} height={PH} rx={34} fill={mix(pal.l, "#000000", 0.25 + k * 0.03)} />
        ))}
        {next !== undefined && <Page pal={nextPal ?? pal} label={next} sub={nextSub ?? sub} size={nextSize ?? size} glow={nextGlow} />}
        {(next === undefined || t < 0.999) && (
          <g
            transform={`translate(${fly[0] * t * t} ${fly[1] * t * t + Math.sin(t * Math.PI) * -60}) rotate(${t * 38} ${-PW / 2} ${-PH / 2})`}
            opacity={1 - Math.max(0, t - 0.7) / 0.3}
          >
            <g transform={`skewY(${-t * 8})`}>
              <Page pal={pal} label={label} sub={sub} size={size} />
            </g>
          </g>
        )}
        {/* anillas */}
        {[-150, -50, 50, 150].map((x) => (
          <rect key={x} x={x - 9} y={-PH / 2 - 26} width={18} height={56} rx={9} fill={mix(pal.m, "#000000", 0.5)} stroke={alpha(pal.l, 0.5)} strokeWidth={2} />
        ))}
      </g>
    </g>
  );
};
