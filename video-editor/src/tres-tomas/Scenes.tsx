import React from "react";
import { Easing } from "remotion";
import { Layer, Shell, popSvg } from "../ee46f/Scenes";
import { Clock, Target } from "../ee46f/shapes";
import { BACK, INOUT, Pal, alpha, ip, mix } from "../ee46f/theme";
import { SceneId } from "./timeline";

export type P = { f: number; dur: number; from: number; pal: Pal };

// 1 · "No estoy estancado": cadena con ancla que se tensa y se suelta
const Ancla: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "ta";
  const ink = mix(pal.l, "#ffffff", 0.3);
  const tense = ip(f, [20, 40], [0, 1], INOUT);
  const links = Array.from({ length: 6 }, (_, k) => k);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        {links.map((k) => {
          const y = 560 + k * 120 - tense * 40;
          const vertical = k % 2 === 0;
          return (
            <g key={k} filter={`url(#${id}-glow)`} opacity={ip(f, [k * 2, k * 2 + 8], [0, 1])}>
              <rect x={540 - (vertical ? 0 : 0)} y={y} width={vertical ? 58 : 110} height={vertical ? 120 : 58} rx={vertical ? 30 : 29} transform={`translate(${vertical ? -29 : -55} 0)`} fill="none" stroke={ink} strokeWidth={11} />
            </g>
          );
        })}
        <g transform={`translate(540 ${1460 + tense * 30})`} filter={`url(#${id}-glow)`} style={popSvg(f, 6, 12)}>
          <circle cy={-180} r={34} fill="none" stroke={ink} strokeWidth={12} />
          <line x1={0} y1={-146} x2={0} y2={150} stroke={ink} strokeWidth={14} strokeLinecap="round" />
          <line x1={-120} y1={-70} x2={120} y2={-70} stroke={ink} strokeWidth={14} strokeLinecap="round" />
          <path d="M-150 90 Q0 230 150 90" fill="none" stroke={ink} strokeWidth={14} strokeLinecap="round" />
        </g>
      </Layer>
    </Shell>
  );
};

// 2 · "No estoy perdido": brújula cuya aguja busca el norte
const Brujula: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "tb";
  const ink = mix(pal.l, "#ffffff", 0.3);
  const settle = ip(f, [0, 30], [0, 1], Easing.out(Easing.cubic));
  const angle = (1 - settle) * 300 + Math.sin(f / 6) * (1 - settle) * 8;
  const ticks = Array.from({ length: 48 }, (_, k) => k);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform="translate(540 1000)" filter={`url(#${id}-glow)`}>
          <circle r={300} fill="none" stroke={ink} strokeWidth={8} opacity={0.8} />
          {ticks.map((k) => (
            <line key={k} x1={0} y1={-296} x2={0} y2={k % 4 ? -276 : -256} stroke={ink} strokeWidth={k % 4 ? 3 : 6} transform={`rotate(${k * 7.5})`} />
          ))}
          <g transform={`rotate(${angle})`}>
            <polygon points="0,-220 40,0 0,30 -40,0" fill={pal.l} />
            <polygon points="0,220 40,0 0,30 -40,0" fill={mix(pal.m, "#000000", 0.2)} />
          </g>
          <circle r={18} fill={ink} />
          <text y={-330} textAnchor="middle" fontFamily="Sans, sans-serif" fontWeight={800} fontSize={60} fill={ink}>
            N
          </text>
        </g>
      </Layer>
    </Shell>
  );
};

// 3 · "No voy demasiado tarde / justo a tiempo": reloj con el arco de tiempo que se cierra
const Reloj: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "tr";
  const sweep = ip(f, [0, 40], [0, 0.92], INOUT);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform="translate(540 1000)" filter={`url(#${id}-glow)`} style={popSvg(f, 0, 10)}>
          <Clock id={id} r={300} t={360 * sweep + f * 0.4} arc={sweep} arcColor={pal.l} />
        </g>
      </Layer>
    </Shell>
  );
};

// 4 · "Encontrando mis propios caminos": bifurcación; el camino de la derecha se ilumina
const Bifurcacion: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "tf";
  const draw = ip(f, [0, 28], [0, 1], INOUT);
  const pick = ip(f, [24, 44], [0, 1], INOUT);
  const L = 1200;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <path d="M540 1800 L540 1250 Q540 1150 400 1020 L260 880" fill="none" stroke={alpha(pal.l, 0.45)} strokeWidth={30} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        <path d="M540 1250 Q540 1150 680 1020 L820 880" fill="none" stroke={pal.l} strokeWidth={36} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - pick)} filter={`url(#${id}-glow)`} />
        <g transform="translate(820 880)" style={popSvg(f, 40, 10)} filter={`url(#${id}-glow)`}>
          <Target color={mix(pal.l, "#ffffff", 0.3)} s={0.9} />
        </g>
      </Layer>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  ancla: Ancla,
  brujula: Brujula,
  reloj: Reloj,
  bifurcacion: Bifurcacion,
};
