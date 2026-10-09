import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bottle, Bubble, Cig, Clock, Defs, Dice, Dumbbell, Eye, Figure, Lock, Phone, POSES, Target } from "./shapes";
import { BACK, DISPLAY, INOUT, Pal, alpha, ip, mix, wf } from "./theme";
import { SCENE_PAL, SceneId } from "./timeline";

type P = { f: number; dur: number; from: number };

// Objeto con perspectiva 3D real (tarjetas, móviles, relojes inclinados)
const Tilt: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; ry?: number; rz?: number; blur?: number; o?: number; s?: number; children: React.ReactNode }> = ({
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

const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

// Escenario común: fondo del color de la escena, cono de luz cenital, suelo iluminado y empuje de cámara
const Shell: React.FC<{ id: string; pal: Pal; f: number; dur: number; children: React.ReactNode }> = ({ id, pal, f, dur, children }) => {
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

const at = (i: number, from: number) => wf(i) - from;
const float = (f: number, seed: number, amp = 10) => Math.sin(f / 26 + seed * 1.7) * amp;

// 2 · Deja de ver porno — rojo
const Porno: React.FC<P> = ({ f, dur }) => {
  const id = "sp";
  const pal = SCENE_PAL.porno;
  const C = 2 * Math.PI * 300;
  const ring = ip(f, [3, 13], [0, 1], INOUT);
  const slash = ip(f, [9, 17], [0, 1], INOUT);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={150} y={1660} w={260} h={180} rz={-14} blur={9} o={0.7}>
        <rect x={-110} y={-75} width={220} height={150} rx={26} fill={`url(#${id}-screen)`} />
      </Tilt>
      <Tilt x={540} y={1190} w={700} h={900} ry={-16} rx={6} s={ip(f, [0, 8], [0.84, 1], BACK)} o={ip(f, [0, 4], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Phone id={id} w={330} h={660}>
            <path d="M-46 -70 L70 0 L-46 70 Z" fill={mix(pal.l, "#ffffff", 0.4)} />
            <text y={190} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={70} fill={mix(pal.l, "#ffffff", 0.3)}>
              18+
            </text>
          </Phone>
        </g>
      </Tilt>
      <Layer style={{ filter: `drop-shadow(0 0 26px ${pal.l})` }}>
        <g transform="translate(540 1190)">
          <circle r={300} fill="none" stroke={mix(pal.l, "#ffffff", 0.2)} strokeWidth={34} strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-120)" strokeLinecap="round" />
          <line x1={-212} y1={-212} x2={-212 + 424 * slash} y2={-212 + 424 * slash} stroke={mix(pal.l, "#ffffff", 0.2)} strokeWidth={34} strokeLinecap="round" opacity={slash > 0.01 ? 1 : 0} />
        </g>
      </Layer>
      <Tilt x={950} y={760} w={200} h={150} rz={12} blur={6} o={0.6}>
        <rect x={-85} y={-60} width={170} height={120} rx={22} fill={`url(#${id}-obj)`} />
      </Tilt>
    </Shell>
  );
};

// 3 · No le hables a nadie sobre tus metas — índigo
const Metas: React.FC<P> = ({ f, dur, from }) => {
  const id = "sm";
  const pal = SCENE_PAL.metas;
  const lockShut = ip(f, [at(11, from), at(11, from) + 6], [16, 0], BACK);
  const thought = at(9, from);
  const goal = at(14, from);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={140} y={1180} w={240} h={170} blur={7} o={0.5} rz={-8}>
        <Bubble id={id} w={200} h={120} />
      </Tilt>
      <Tilt x={960} y={1460} w={240} h={170} blur={9} o={0.45} rz={10}>
        <Bubble id={id} w={190} h={110} tail="r" />
      </Tilt>
      <Layer>
        <g style={popSvg(f, 0)}>
          <Figure id={id} pal={pal} x={540} y={1690} s={1.3} pose={POSES.hush} />
        </g>
        {/* pensamiento: la meta, guardada */}
        <g transform={`translate(285 ${830 + float(f, 1, 8)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, thought)}>
            <circle cx={150} cy={190} r={14} fill={`url(#${id}-obj)`} />
            <circle cx={110} cy={150} r={22} fill={`url(#${id}-obj)`} />
            <ellipse rx={150} ry={118} fill={`url(#${id}-obj)`} />
            <g style={popSvg(f, goal, 10)}>
              <Target color={mix(pal.m, "#000000", 0.35)} s={1.15} />
            </g>
          </g>
        </g>
        {/* lo que dices, bajo candado */}
        <g transform={`translate(810 ${1010 + float(f, 2, 6)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, 4)}>
            <Bubble id={id} w={230} h={150}>
              <Lock color={mix(pal.m, "#000000", 0.4)} open={lockShut} s={0.95} />
            </Bubble>
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// pop() para elementos SVG (transform-box para escalar desde su centro)
function popSvg(f: number, a: number, d = 9): React.CSSProperties {
  return {
    opacity: ip(f, [a, a + d * 0.6], [0, 1]),
    scale: `${ip(f, [a, a + d], [0.8, 1], BACK)}`,
    transformBox: "fill-box",
    transformOrigin: "50% 50%",
    filter: `blur(${ip(f, [a, a + d], [10, 0])}px)`,
  };
}

// 4 · Sal de los grupos que te traen malos hábitos — azul acero
const Amigos: React.FC<P> = ({ f, dur, from }) => {
  const id = "sa";
  const pal = SCENE_PAL.amigos;
  const walk = ip(f, [6, dur], [600, 790], INOUT);
  const sw = Math.sin(f / 5);
  const dim = ip(f, [at(30, from), at(30, from) + 20], [0.62, 0.38]);
  const ic = mix(pal.l, "#ffffff", 0.15);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        {/* puerta de luz hacia la salida */}
        <defs>
          <linearGradient id={`${id}-door`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={pal.l} stopOpacity={0.15} />
            <stop offset="1" stopColor={mix(pal.l, "#ffffff", 0.5)} stopOpacity={0.95} />
          </linearGradient>
        </defs>
        <g filter={`url(#${id}-glow)`} opacity={ip(f, [0, 10], [0, 1])}>
          <rect x={860} y={1110} width={250} height={590} rx={14} fill={`url(#${id}-door)`} />
          <polygon points="860,1700 1110,1700 1080,1800 640,1800" fill={pal.l} opacity={0.18} />
        </g>
        {/* el grupo que se queda atrás */}
        <g opacity={dim}>
          <Figure id={id} pal={pal} x={205} y={1650} s={1.02} pose={POSES.phone} />
          <Figure id={id} pal={pal} x={395} y={1630} s={0.98} pose={POSES.cross} />
          <Figure id={id} pal={pal} x={300} y={1720} s={1.1} pose={POSES.phone} flip />
        </g>
        {/* malos hábitos sobre el grupo */}
        <g filter={`url(#${id}-glow)`}>
          <g transform={`translate(160 ${1010 + float(f, 1)})`}>
            <g style={popSvg(f, at(34, from))}>
              <Bottle color={ic} />
            </g>
          </g>
          <g transform={`translate(330 ${930 + float(f, 2)}) rotate(-18)`}>
            <g style={popSvg(f, at(35, from))}>
              <Cig color={ic} f={f} />
            </g>
          </g>
          <g transform={`translate(455 ${1050 + float(f, 3)}) rotate(14)`}>
            <g style={popSvg(f, at(36, from))}>
              <Dice color={ic} />
            </g>
          </g>
        </g>
        {/* tú, saliendo */}
        <Figure
          id={id}
          pal={pal}
          x={walk}
          y={1700}
          s={1.22}
          pose={{ l: [-120 + sw * 30, -200], r: [120 - sw * 30, -200], step: sw * 14 }}
        />
      </Layer>
    </Shell>
  );
};

// 5 · Actúa alineado a quien quieres ser — verde
const Espejo: React.FC<P> = ({ f, dur, from }) => {
  const id = "se";
  const pal = SCENE_PAL.espejo;
  const align = ip(f, [at(40, from) - 2, at(40, from) + 12], [0, 1], INOUT);
  const want = ip(f, [at(45, from), at(45, from) + 10], [0, 1]);
  const mirror = "M600 1700 L600 1180 Q600 990 745 990 Q890 990 890 1180 L890 1700 Z";
  const hy = 1060;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={mirror} />
          </clipPath>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={mix(pal.m, "#000000", 0.35)} />
            <stop offset="1" stopColor={mix(pal.m, "#000000", 0.75)} />
          </linearGradient>
        </defs>
        <g style={popSvg(f, 0, 10)}>
          <path d={mirror} fill={`url(#${id}-glass)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <g style={{ scale: `${1 + want * 0.04}`, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
              <Figure id={id} pal={pal} x={745} y={1690} s={1.12} pose={POSES.hips} />
            </g>
            {[0, 1].map((k) => {
              const x = ((f * 6 + k * 260) % 700) + 380;
              return <polygon key={k} points={`${x},960 ${x + 60},960 ${x - 200},1720 ${x - 260},1720`} fill="#ffffff" opacity={0.07} />;
            })}
          </g>
          <path d={mirror} fill="none" stroke={mix(pal.l, "#ffffff", 0.2)} strokeWidth={10} filter={`url(#${id}-glow)`} opacity={0.75 + want * 0.25} />
        </g>
        <g style={popSvg(f, 3, 10)}>
          <Figure id={id} pal={pal} x={330} y={1700} s={1.1} pose={{ ...POSES.stand, lean: 3 }} o={0.6} />
        </g>
        {/* línea de alineación entre quien eres y quien quieres ser */}
        <g opacity={align > 0.01 ? 1 : 0} filter={`url(#${id}-glow)`}>
          <line x1={330} y1={hy} x2={330 + 415 * align} y2={hy} stroke={mix(pal.l, "#ffffff", 0.3)} strokeWidth={5} strokeDasharray="16 12" />
          <circle cx={330} cy={hy} r={11 * align} fill={mix(pal.l, "#ffffff", 0.3)} />
          <circle cx={745} cy={hy} r={11 * ip(align, [0.85, 1], [0, 1])} fill={mix(pal.l, "#ffffff", 0.3)} />
        </g>
      </Layer>
    </Shell>
  );
};

// 6 · Loco y obsesionado: todos te miran — pizarra
const Foco: React.FC<P> = ({ f, dur, from }) => {
  const id = "sf";
  const pal = SCENE_PAL.foco;
  const rep = (1 - Math.cos(f / 7)) / 2;
  const hy = -690 + rep * 120;
  const eyes: [number, number, number, number][] = [
    [140, 820, 1.0, 0],
    [945, 760, 1.15, 0],
    [95, 1250, 0.9, 4],
    [990, 1210, 1.0, 0],
    [205, 1610, 1.3, 7],
    [905, 1640, 1.2, 5],
  ];
  const eyesAt = at(74, from);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <ellipse cx={540} cy={1700} rx={300} ry={40} fill={pal.l} opacity={0.25} filter={`url(#${id}-glow)`} />
        <g style={popSvg(f, 0, 10)}>
          <Figure id={id} pal={pal} x={540} y={1700} s={1.2} pose={{ l: [-158, hy], r: [158, hy], spread: 18 }}>
            <g transform={`translate(0 ${hy})`}>
              <Dumbbell id={id} w={420} />
            </g>
          </Figure>
        </g>
        {/* susurros */}
        {[
          [215, 1440, at(66, from)],
          [870, 1400, at(71, from)],
        ].map(([x, y, a], k) => (
          <g key={k} transform={`translate(${x} ${y + float(f, k + 3, 7)})`} filter={`url(#${id}-glow)`}>
            <g style={popSvg(f, a)}>
              <Bubble id={id} w={150} h={100} tail={k ? "l" : "r"}>
                <text y={20} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={54} fill={mix(pal.m, "#000000", 0.4)}>
                  ¿?
                </text>
              </Bubble>
            </g>
          </g>
        ))}
        {/* todos te perciben */}
        {eyes.map(([x, y, s, blur], k) => {
          const a = eyesAt + k * 3;
          const open = ip(f, [a, a + 7], [0, 1], BACK) * (f > a + 40 && f < a + 44 ? 0.1 : 1);
          return (
            <g key={k} transform={`translate(${x} ${y + float(f, k, 6)}) scale(${s})`} style={{ filter: `blur(${blur}px)` }} opacity={ip(f, [a, a + 4], [0, 1])}>
              <g filter={`url(#${id}-glow)`}>
                <Eye color={mix(pal.l, "#ffffff", 0.2)} open={open} look={x < 540 ? 1 : -1} />
              </g>
            </g>
          );
        })}
      </Layer>
    </Shell>
  );
};

// 7 · Di no a los planes que no te suman — vino
const Planes: React.FC<P> = ({ f, dur, from }) => {
  const id = "sl";
  const pal = SCENE_PAL.planes;
  const paper = mix(pal.l, "#ffffff", 0.72);
  const cell = mix(pal.l, "#ffffff", 0.45);
  const stamps: [number, number, number][] = [
    [1, 0, at(91, from)],
    [4, 1, at(95, from)],
    [2, 2, at(99, from)],
    [5, 3, at(100, from) + 4],
  ];
  const cx = (c: number) => -270 + c * 90;
  const cy = (r: number) => -120 + r * 98;
  const minus = at(99, from);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={210} y={1640} w={300} h={220} rz={-12 + float(f, 1, 3)} blur={4} o={0.85}>
        <g filter={`url(#${id}-glow)`}>
          <rect x={-120} y={-80} width={240} height={160} rx={16} fill={`url(#${id}-obj)`} />
          <path d="M-120 -76 L0 10 L120 -76" stroke={mix(pal.m, "#000000", 0.3)} strokeWidth={8} fill="none" />
        </g>
      </Tilt>
      <Tilt x={540} y={1200} w={720} h={700} rx={16} ry={-12} rz={-3} s={ip(f, [0, 10], [0.88, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <rect x={-330} y={-310} width={660} height={620} rx={34} fill={paper} />
        </g>
        <rect x={-330} y={-310} width={660} height={130} rx={34} fill={pal.m} />
        <rect x={-330} y={-220} width={660} height={40} fill={pal.m} />
        <text x={-280} y={-226} fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={58} fill={paper}>
          PLANES
        </text>
        {[-160, 160].map((x) => (
          <rect key={x} x={x - 12} y={-340} width={24} height={70} rx={12} fill={mix(pal.m, "#000000", 0.4)} />
        ))}
        {Array.from({ length: 28 }, (_, k) => {
          const c = k % 7;
          const r = Math.floor(k / 7);
          return (
            <g key={k}>
              <rect x={cx(c) - 36} y={cy(r) - 40} width={72} height={80} rx={12} fill={cell} opacity={0.55} />
              {(k * 5) % 3 === 0 && <path d={`M${cx(c) - 14} ${cy(r) - 18} h28 l-14 18 Z M${cx(c)} ${cy(r)} v16 M${cx(c) - 9} ${cy(r) + 18} h18`} stroke={pal.m} strokeWidth={4} fill={pal.m} strokeLinejoin="round" />}
            </g>
          );
        })}
        {stamps.map(([c, r, a], k) => (
          <g key={k} transform={`translate(${cx(c)} ${cy(r)}) rotate(-10)`}>
            <g style={popSvg(f, a, 6)}>
              <path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke={mix(pal.m, "#000000", 0.05)} strokeWidth={15} strokeLinecap="round" />
            </g>
          </g>
        ))}
      </Tilt>
      <Layer>
        <g transform={`translate(870 ${860 + float(f, 2, 8)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, minus)}>
            <circle r={76} fill={`url(#${id}-obj)`} />
            <rect x={-38} y={-9} width={76} height={18} rx={9} fill={mix(pal.m, "#000000", 0.35)} />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 8 · Nada de móvil las 2 primeras horas — plata con acento rojo
const Manana: React.FC<P> = ({ f, dur, from }) => {
  const id = "sn";
  const pal = SCENE_PAL.manana;
  const rise = ip(f, [0, dur], [140, 0], INOUT);
  const a = at(116, from);
  const sweep = ip(f, [a, a + 26], [0, 1], INOUT);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <defs>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor={pal.l} />
            <stop offset="1" stopColor={pal.l} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(pal.m, "#000000", 0.6)} />
            <stop offset="1" stopColor={mix(pal.m, "#000000", 0.9)} />
          </linearGradient>
        </defs>
        <circle cx={540} cy={1170 + rise} r={330} fill={`url(#${id}-sun)`} opacity={0.5} />
        <circle cx={540} cy={1170 + rise} r={190} fill={mix(pal.l, "#ffffff", 0.4)} filter={`url(#${id}-glow)`} />
        <rect x={0} y={1250} width={1080} height={700} fill={`url(#${id}-ground)`} />
        <line x1={0} y1={1250} x2={1080} y2={1250} stroke={pal.l} strokeWidth={3} opacity={0.5} />
      </Layer>
      <Tilt x={500} y={1500} w={520} h={760} rx={56} rz={-14} s={ip(f, [0, 10], [0.9, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Phone id={id} w={300} h={600}>
            <Lock color={mix(pal.m, "#000000", 0.3)} s={1.3} />
          </Phone>
        </g>
      </Tilt>
      <Tilt x={860} y={1600} w={560} h={560} rx={24} ry={-24} rz={6} s={ip(f, [4, 14], [0.85, 1], BACK)} o={ip(f, [4, 9], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Clock id={id} r={230} t={360 + sweep * 120 + f * 0.4} arc={sweep} arcColor={pal.acc} />
        </g>
      </Tilt>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  porno: Porno,
  metas: Metas,
  amigos: Amigos,
  espejo: Espejo,
  foco: Foco,
  planes: Planes,
  manana: Manana,
};
