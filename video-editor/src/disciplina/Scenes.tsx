import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bubble, Clock, Defs, Figure, POSES, Target } from "./shapes";
import { BACK, DISPLAY, INOUT, Pal, alpha, ip, mix, wf } from "./theme";
import { SCENE_PAL, SceneId } from "./timeline";

type P = { f: number; dur: number; from: number };

// Objeto con perspectiva 3D real
export const Tilt: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; ry?: number; rz?: number; blur?: number; o?: number; s?: number; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  rx = 0,
  ry = 0,
  rz = 0,
  blur = 0,
  o = 1,
  s = 1,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      transform: `perspective(1500px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      opacity: o,
    }}
  >
    <svg width={w} height={h} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`} style={{ overflow: "visible" }}>
      {children}
    </svg>
  </div>
);

export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

// Escenario común: fondo del color de la escena, cono de luz cenital, suelo iluminado y empuje de cámara
export const Shell: React.FC<{ id: string; pal: Pal; f: number; dur: number; children: React.ReactNode }> = ({ id, pal, f, dur, children }) => {
  const push = interpolate(f, [0, dur], [1, 1.07]);
  const out = ip(f, [dur - 5, dur], [0, 1], INOUT);
  const flick = 0.92 + Math.sin(f / 13) * 0.05;
  return (
    <AbsoluteFill style={{ background: mix(pal.m, "#000000", 0.9), overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: push + out * 0.05, filter: out > 0.01 ? `blur(${out * 7}px)` : undefined }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 45% at 50% 0%, ${alpha(pal.m, 0.6)}, rgba(0,0,0,0) 72%)` }} />
        <Layer style={{ filter: "blur(28px)", opacity: flick }}>
          <defs>
            <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={pal.l} stopOpacity={0.5} />
              <stop offset="0.75" stopColor={pal.l} stopOpacity={0.06} />
              <stop offset="1" stopColor={pal.l} stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points="440,-40 640,-40 980,1760 100,1760" fill={`url(#${id}-cone)`} />
        </Layer>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 48% 5% at 50% 86%, ${alpha(pal.l, 0.28)}, rgba(0,0,0,0) 100%)` }} />
        <Layer>
          <Defs id={id} pal={pal} />
        </Layer>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// pop() para elementos SVG
export function popSvg(f: number, a: number, d = 9): React.CSSProperties {
  return {
    opacity: ip(f, [a, a + d * 0.6], [0, 1]),
    scale: `${ip(f, [a, a + d], [0.8, 1], BACK)}`,
    transformBox: "fill-box",
    transformOrigin: "50% 50%",
    filter: `blur(${ip(f, [a, a + d], [10, 0])}px)`,
  };
}

const at = (i: number, from: number) => wf(i) - from;
const float = (f: number, seed: number, amp = 10) => Math.sin(f / 26 + seed * 1.7) * amp;

// 1 · "Constancia": tres barras que bajan — el 100 %, el 60 % y el 10 %
const Caida: React.FC<P> = ({ f, dur, from }) => {
  const id = "dc";
  const pal = SCENE_PAL.caida;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const bars: [number, number, number][] = [
    [300, 760, at(10, from)],
    [540, 450, at(17, from)],
    [780, 110, at(25, from)],
  ];
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <line x1={170} y1={1700} x2={910} y2={1700} stroke={pal.l} strokeWidth={4} opacity={0.5} />
        {bars.map(([x, h, a], k) => {
          const g = ip(f, [a - 2, a + 14], [0, 1], BACK);
          return (
            <g key={k} filter={`url(#${id}-glow)`}>
              <rect x={x - 80} y={1700 - h * g} width={160} height={h * g} rx={22} fill={`url(#${id}-obj)`} opacity={0.6 + k * 0.15} />
              <text x={x} y={1700 - h * g - 26} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={84} fill={ink} opacity={ip(f, [a + 4, a + 12], [0, 1])}>
                {["100%", "60%", "10%"][k]}
              </text>
            </g>
          );
        })}
      </Layer>
    </Shell>
  );
};

// 2 · "Agotado": la figura se encorva y la batería se vacía
const Agotado: React.FC<P> = ({ f, dur, from }) => {
  const id = "da";
  const pal = SCENE_PAL.agotado;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const drain = ip(f, [at(38, from), at(42, from) + 6], [0, 0.9]);
  const droop = ip(f, [at(39, from), at(42, from)], [0, 9]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g style={popSvg(f, 0)}>
          <Figure id={id} pal={pal} x={540} y={1720} s={1.3} pose={{ ...POSES.stand, lean: droop }} />
        </g>
        <g transform={`translate(540 ${880 + float(f, 1, 6)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, at(37, from))}>
            <rect x={-220} y={-110} width={400} height={220} rx={36} fill="none" stroke={ink} strokeWidth={12} />
            <rect x={190} y={-40} width={22} height={80} rx={8} fill={ink} />
            <rect x={-200 + 10} y={-100 + 10} width={360 * (1 - drain)} height={200} rx={26} fill={ink} />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 3 · "Engañar a tu mente": un espejo que muestra otra cara; la falsa se ilumina al decir "engañar"
const Mente: React.FC<P> = ({ f, dur, from }) => {
  const id = "dm";
  const pal = SCENE_PAL.mente;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const lie = ip(f, [at(47, from), at(47, from) + 10], [0, 1], BACK);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform={`translate(540 ${980 + float(f, 2, 8)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, 0)}>
            <ellipse cx={-170} cy={0} rx={110} ry={150} fill="none" stroke={ink} strokeWidth={10} opacity={0.7} />
            <ellipse cx={170} cy={0} rx={110} ry={150} fill={`url(#${id}-obj)`} opacity={lie} />
            <path d="M-260 -120 Q-170 -190 -80 -120" stroke={ink} strokeWidth={10} fill="none" strokeLinecap="round" />
            <path d="M80 -120 Q170 -190 260 -120" stroke={ink} strokeWidth={10} fill="none" strokeLinecap="round" opacity={lie} />
          </g>
        </g>
        <g transform={`translate(540 1520) rotate(${float(f, 3, 2)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, at(51, from))}>
            <Bubble id={id} w={420} h={150} tail="l">
              <text y={20} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={70} fill={mix(pal.m, "#000000", 0.35)}>
                TU MENTE
              </text>
            </Bubble>
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 4 · "Es fácil, es sencillo": un check que se dibuja de un trazo
const Facil: React.FC<P> = ({ f, dur, from }) => {
  const id = "df";
  const pal = SCENE_PAL.facil;
  const draw = ip(f, [at(70, from), at(74, from) + 6], [0, 1], INOUT);
  const L = 700;
  const ink = mix(pal.l, "#ffffff", 0.3);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <circle cx={540} cy={520} r={220} fill="none" stroke={ink} strokeWidth={6} opacity={0.35} />
        <g filter={`url(#${id}-glow)`}>
          <path d="M430 530 L520 620 L660 430" fill="none" stroke={ink} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        </g>
        <g transform="translate(540 1600)" filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, at(68, from))}>
            <Figure id={id} pal={pal} x={0} y={0} s={1.1} pose={POSES.lift} />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 5 · "Claro, hay que descansar": luna creciente y estrellas
const Descanso: React.FC<P> = ({ f, dur, from }) => {
  const id = "dd";
  const pal = SCENE_PAL.descanso;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const a = at(93, from);
  const rise = ip(f, [a - 4, a + 12], [0, 1], BACK);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <defs>
          <mask id={`${id}-moon`}>
            <rect x={0} y={0} width={1080} height={1920} fill="#fff" />
            <circle cx={640} cy={880} r={220} fill="#000" />
          </mask>
        </defs>
        <g transform={`translate(0 ${(1 - rise) * 60})`} filter={`url(#${id}-glow)`}>
          <circle cx={540} cy={1000} r={280} fill={ink} mask={`url(#${id}-moon)`} opacity={rise} />
        </g>
        {[[200, 700], [860, 640], [860, 1300], [220, 1280]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y + float(f, k, 6)} r={8} fill={ink} opacity={ip(f, [a + k * 2, a + k * 2 + 8], [0, 0.8])} filter={`url(#${id}-glow)`} />
        ))}
      </Layer>
    </Shell>
  );
};

// 6 · "Decisiones de hoy": un reloj que marca la hora de actuar, con el arco en el acento
const Hoy: React.FC<P> = ({ f, dur, from }) => {
  const id = "dh";
  const pal = SCENE_PAL.hoy;
  const sweep = ip(f, [at(108, from), at(111, from) + 10], [0, 0.4], INOUT);
  const ink = mix(pal.l, "#ffffff", 0.2);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform="translate(540 1000)" filter={`url(#${id}-glow)`} style={popSvg(f, 0, 10)}>
          <Clock id={id} r={300} t={360 * sweep + f * 0.4} arc={sweep} arcColor={pal.acc} />
        </g>
        <g transform={`translate(540 ${1560 + float(f, 4, 6)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, at(108, from))}>
            <Bubble id={id} w={360} h={130} tail="l">
              <text y={22} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={70} fill={ink}>
                HOY
              </text>
            </Bubble>
          </g>
        </g>
        <g transform="translate(860 1420)" filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, at(111, from))}>
            <Target color={mix(pal.acc ?? pal.l, "#ffffff", 0.1)} s={0.5} />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  caida: Caida,
  agotado: Agotado,
  mente: Mente,
  facil: Facil,
  descanso: Descanso,
  hoy: Hoy,
};
