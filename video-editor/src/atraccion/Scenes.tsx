import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bubble, Clock, Defs, Figure, POSES, Pose, Pt, Target } from "./shapes";
import { BACK, DISPLAY, INOUT, Pal, alpha, ip, mix, wf } from "./theme";
import { SCENE_PAL, SceneId } from "./timeline";

type P = { f: number; dur: number; from: number };

// Objeto con perspectiva 3D real (tarjetas, tableros inclinados)
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
export const Shell: React.FC<{ id: string; pal: Pal; f: number; dur: number; children: React.ReactNode; push?: [number, number]; exit?: boolean }> = ({
  id,
  pal,
  f,
  dur,
  children,
  push: range = [1, 1.07],
  exit = true,
}) => {
  const push = interpolate(f, [0, dur], range);
  const out = exit ? ip(f, [dur - 5, dur], [0, 1], INOUT) : 0;
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

// pop() para elementos SVG (transform-box para escalar desde su centro)
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
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  l: [a.l[0] + (b.l[0] - a.l[0]) * t, a.l[1] + (b.l[1] - a.l[1]) * t] as Pt,
  r: [a.r[0] + (b.r[0] - a.r[0]) * t, a.r[1] + (b.r[1] - a.r[1]) * t] as Pt,
  spread: (a.spread ?? 6) + ((b.spread ?? 6) - (a.spread ?? 6)) * t,
});

// Tachón que se estampa (opciones descartadas)
const Cross: React.FC<{ color: string; s?: number }> = ({ color, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-40 -40 L40 40 M40 -40 L-40 40" stroke={color} strokeWidth={18} strokeLinecap="round" />
  </g>
);

// 2 · Cumplir los sueños, los objetivos — índigo: tú señalas la meta que aparece en tu pensamiento
const Meta: React.FC<P> = ({ f, dur, from }) => {
  const id = "am";
  const pal = SCENE_PAL.meta;
  const dream = at(8, from);
  const goal = at(12, from);
  const hit = ip(f, [goal, goal + 8], [0, 1], BACK);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={150} y={1260} w={240} h={170} blur={7} o={0.5} rz={-8}>
        <Bubble id={id} w={200} h={120} />
      </Tilt>
      <Tilt x={960} y={1560} w={220} h={160} blur={9} o={0.45} rz={10}>
        <Bubble id={id} w={180} h={110} tail="r" />
      </Tilt>
      <Layer>
        <g style={popSvg(f, 0)}>
          <Figure id={id} pal={pal} x={380} y={1720} s={1.25} pose={POSES.point} />
        </g>
        {/* el sueño, dentro del pensamiento */}
        <g transform={`translate(720 ${930 + float(f, 1, 8)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, Math.max(2, dream - 6))}>
            <circle cx={-150} cy={210} r={16} fill={`url(#${id}-obj)`} />
            <circle cx={-112} cy={160} r={24} fill={`url(#${id}-obj)`} />
            <ellipse rx={190} ry={150} fill={`url(#${id}-obj)`} />
            <g style={popSvg(f, dream, 10)}>
              <g transform={`scale(${1 + hit * 0.12})`}>
                <Target color={mix(pal.m, "#000000", 0.35)} s={1.4} />
              </g>
            </g>
          </g>
        </g>
        {/* objetivo alcanzado: el anillo se expande una vez */}
        <circle cx={720} cy={930} r={150 + hit * 120} fill="none" stroke={mix(pal.l, "#ffffff", 0.3)} strokeWidth={6} opacity={f >= goal ? 1 - hit * 0.9 : 0} />
      </Layer>
    </Shell>
  );
};

// 3 · Dormir temprano, levantarse temprano, bañarse — plata con acento rojo: tres tarjetas, una por hábito
const Rutina: React.FC<P> = ({ f, dur, from }) => {
  const id = "ar";
  const pal = SCENE_PAL.rutina;
  const ink = mix(pal.l, "#ffffff", 0.3);
  const a1 = at(15, from);
  const a2 = at(17, from);
  const a3 = at(19, from);
  const sweep = ip(f, [a2, a2 + 20], [0, 1], INOUT);
  const card = (x: number, y: number, rz: number, a: number, child: React.ReactNode) => (
    <Tilt x={x} y={y} w={300} h={360} ry={x < 540 ? 18 : x > 540 ? -18 : 0} rx={8} rz={rz} s={ip(f, [a, a + 9], [0.8, 1], BACK)} o={ip(f, [a, a + 5], [0, 1])}>
      <g filter={`url(#${id}-glow)`}>
        <rect x={-130} y={-160} width={260} height={320} rx={36} fill={`url(#${id}-dark)`} stroke={`url(#${id}-obj)`} strokeWidth={6} />
      </g>
      {child}
    </Tilt>
  );
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <defs>
          <mask id={`${id}-moon`}>
            <circle r={78} fill="#fff" />
            <circle cx={36} cy={-26} r={70} fill="#000" />
          </mask>
        </defs>
      </Layer>
      {card(
        220,
        1180,
        -6,
        a1,
        <g transform={`translate(0 ${float(f, 1, 6)})`} filter={`url(#${id}-glow)`}>
          <circle r={78} fill={ink} mask={`url(#${id}-moon)`} />
          <circle cx={70} cy={-70} r={7} fill={ink} opacity={0.8} />
          <circle cx={88} cy={20} r={5} fill={ink} opacity={0.6} />
        </g>,
      )}
      {card(
        540,
        1360,
        0,
        a2,
        <g filter={`url(#${id}-glow)`}>
          <Clock id={id} r={100} t={300 + sweep * 60 + f * 0.6} arc={sweep} arcColor={pal.acc} />
        </g>,
      )}
      {card(
        860,
        1540,
        6,
        a3,
        <g filter={`url(#${id}-glow)`}>
          <path d="M-70 -70 Q-70 -110 -30 -110 L60 -110" stroke={ink} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M-110 -40 Q-70 -86 -30 -40 Z" fill={ink} />
          {Array.from({ length: 9 }, (_, k) => {
            const x = -98 + (k % 5) * 17 + (k > 4 ? 8 : 0);
            const y = ((f * 9 + k * 37) % 150) - 20;
            return <line key={k} x1={x} y1={y} x2={x - 4} y2={y + 22} stroke={ink} strokeWidth={6} strokeLinecap="round" opacity={f > a3 ? 0.85 : 0} />;
          })}
        </g>,
      )}
    </Shell>
  );
};

// 4 · Volverlo realidad — verde: el plano de una casa que se dibuja y se vuelve sólida
const Realidad: React.FC<P> = ({ f, dur, from }) => {
  const id = "al";
  const pal = SCENE_PAL.realidad;
  const draw = ip(f, [0, at(31, from)], [0, 1], INOUT);
  const solid = ip(f, [at(31, from), at(31, from) + 10], [0, 1], INOUT);
  const house = "M-280 0 L-280 -320 L0 -540 L280 -320 L280 0 Z";
  const L = 2100;
  const ink = mix(pal.l, "#ffffff", 0.25);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        {/* rejilla de plano */}
        <g opacity={0.12 * (1 - solid * 0.6)}>
          {Array.from({ length: 12 }, (_, k) => (
            <line key={`v${k}`} x1={90 + k * 82} y1={800} x2={90 + k * 82} y2={1760} stroke={pal.l} strokeWidth={2} />
          ))}
          {Array.from({ length: 12 }, (_, k) => (
            <line key={`h${k}`} x1={60} y1={800 + k * 82} x2={1020} y2={800 + k * 82} stroke={pal.l} strokeWidth={2} />
          ))}
        </g>
        <g transform="translate(540 1700)">
          <path d={house} fill={`url(#${id}-obj)`} opacity={solid} filter={`url(#${id}-glow)`} />
          <path d={house} fill="none" stroke={ink} strokeWidth={10} strokeDasharray={solid > 0.01 ? undefined : `${L}`} strokeDashoffset={L * (1 - draw)} strokeLinejoin="round" />
          <g opacity={ip(draw, [0.5, 1], [0, 1])}>
            <rect x={-60} y={-200} width={120} height={200} rx={10} fill={solid > 0.01 ? mix(pal.m, "#000000", 0.5) : "none"} stroke={ink} strokeWidth={8} strokeDasharray={solid > 0.01 ? undefined : "18 12"} />
            {[-180, 180].map((x) => (
              <rect key={x} x={x - 55} y={-260} width={110} height={100} rx={10} fill={solid > 0.01 ? mix(pal.l, "#ffffff", 0.6 * solid) : "none"} stroke={ink} strokeWidth={8} strokeDasharray={solid > 0.01 ? undefined : "18 12"} />
            ))}
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 5 · No hay otra opción, no hay otro camino — acero: un solo camino iluminado, los otros se tachan
const Camino: React.FC<P> = ({ f, dur, from }) => {
  const id = "ac";
  const pal = SCENE_PAL.camino;
  const x1 = at(44, from);
  const x2 = at(48, from);
  const lit = ip(f, [x2, x2 + 14], [0.55, 1]);
  const ink = mix(pal.l, "#ffffff", 0.25);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <defs>
          <linearGradient id={`${id}-road`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={pal.l} stopOpacity={0.9} />
            <stop offset="1" stopColor={mix(pal.l, "#ffffff", 0.5)} stopOpacity={0.35} />
          </linearGradient>
        </defs>
        {/* caminos laterales, apagados */}
        <path d="M480 1420 Q330 1260 170 1100" stroke={alpha(pal.l, 0.35)} strokeWidth={46} strokeLinecap="round" fill="none" />
        <path d="M600 1420 Q750 1260 910 1100" stroke={alpha(pal.l, 0.35)} strokeWidth={46} strokeLinecap="round" fill="none" />
        {/* el único camino */}
        <g filter={`url(#${id}-glow)`} opacity={lit}>
          <polygon points="420,1820 660,1820 560,960 520,960" fill={`url(#${id}-road)`} />
        </g>
        <g transform={`translate(540 ${900 + float(f, 2, 6)})`} filter={`url(#${id}-glow)`}>
          <g style={popSvg(f, x2)}>
            <Target color={ink} s={0.9} />
          </g>
        </g>
        <g transform="translate(180 1100) rotate(-8)">
          <g style={popSvg(f, x1, 6)}>
            <Cross color={mix(pal.l, "#ffffff", 0.4)} s={1.3} />
          </g>
        </g>
        <g transform="translate(900 1100) rotate(8)">
          <g style={popSvg(f, x2 - 6, 6)}>
            <Cross color={mix(pal.l, "#ffffff", 0.4)} s={1.3} />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 6 · Cuando estás progresando — verde azulado: barras que suben y una flecha que las sigue
const Progreso: React.FC<P> = ({ f, dur, from }) => {
  const id = "ap";
  const pal = SCENE_PAL.progreso;
  const hs = [190, 300, 430, 600];
  const arrow = ip(f, [6, at(61, from) + 8], [0, 1], INOUT);
  const L = 900;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <line x1={170} y1={1700} x2={910} y2={1700} stroke={pal.l} strokeWidth={4} opacity={0.5} />
        {hs.map((h, k) => {
          const g = ip(f, [k * 4, k * 4 + 14], [0, 1], BACK);
          return (
            <g key={k} filter={`url(#${id}-glow)`}>
              <rect x={230 + k * 170} y={1700 - h * g} width={110} height={h * g} rx={18} fill={`url(#${id}-obj)`} opacity={0.55 + k * 0.15} />
            </g>
          );
        })}
        <g filter={`url(#${id}-glow)`}>
          <path d="M200 1560 L380 1450 L540 1330 L730 1170 L900 1000" stroke={mix(pal.l, "#ffffff", 0.35)} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - arrow)} />
          <g transform="translate(900 1000) rotate(-40)" opacity={arrow > 0.95 ? 1 : 0}>
            <path d="M0 0 L-44 -26 L-44 26 Z" fill={mix(pal.l, "#ffffff", 0.35)} transform="rotate(180) translate(-30 0)" />
          </g>
        </g>
      </Layer>
    </Shell>
  );
};

// 7 · La vida es sube, baja, sube — pizarra: la línea de la vida, tramo a tramo con cada palabra
const Vida: React.FC<P> = ({ f, dur, from }) => {
  const id = "av";
  const pal = SCENE_PAL.vida;
  const pts: Pt[] = [
    [150, 1560],
    [400, 1080],
    [650, 1480],
    [940, 900],
  ];
  const seg = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const lens = [seg(pts[0], pts[1]), seg(pts[1], pts[2]), seg(pts[2], pts[3])];
  const total = lens[0] + lens[1] + lens[2];
  const t = [at(79, from), at(80, from), at(81, from)];
  const p = ip(f, [t[0] - 4, t[0] + 6], [0, 1], INOUT) * lens[0] + ip(f, [t[1] - 2, t[1] + 6], [0, 1], INOUT) * lens[1] + ip(f, [t[2] - 2, t[2] + 8], [0, 1], INOUT) * lens[2];
  // posición de la punta
  let rest = p;
  let tip: Pt = pts[0];
  for (let k = 0; k < 3; k++) {
    const u = Math.min(1, Math.max(0, rest / lens[k]));
    tip = [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u];
    if (rest <= lens[k]) break;
    rest -= lens[k];
  }
  const d = `M${pts.map((q) => q.join(" ")).join(" L")}`;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g opacity={0.14}>
          {Array.from({ length: 7 }, (_, k) => (
            <line key={k} x1={110} y1={860 + k * 120} x2={980} y2={860 + k * 120} stroke={pal.l} strokeWidth={2} />
          ))}
        </g>
        <path d={d} stroke={alpha(pal.l, 0.18)} strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <g filter={`url(#${id}-glow)`}>
          <path d={d} stroke={mix(pal.l, "#ffffff", 0.3)} strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={total} strokeDashoffset={total - p} />
          <circle cx={tip[0]} cy={tip[1]} r={26} fill={mix(pal.l, "#ffffff", 0.55)} opacity={p > 2 ? 1 : 0} />
        </g>
      </Layer>
    </Shell>
  );
};

// 8 · Empírico, a base de golpes — rojo: el saco que recibe los golpes y vuelve
const Golpes: React.FC<P> = ({ f, dur, from }) => {
  const id = "ag";
  const pal = SCENE_PAL.golpes;
  const hits = [at(85, from), at(89, from)];
  const swing = hits.reduce((s, h, k) => (f >= h ? s + (k ? 16 : 9) * Math.exp(-(f - h) / 14) * Math.sin((f - h) / 4.2) : s), 0);
  const burst = (h: number) => ip(f, [h, h + 8], [0, 1]);
  const ink = mix(pal.l, "#ffffff", 0.3);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform={`translate(540 640) rotate(${swing})`}>
          <line x1={0} y1={0} x2={0} y2={300} stroke={mix(pal.m, "#000000", 0.3)} strokeWidth={10} />
          <g style={popSvg(f, 0, 10)}>
            <g filter={`url(#${id}-glow)`}>
              <rect x={-130} y={300} width={260} height={620} rx={110} fill={`url(#${id}-obj)`} />
              <rect x={-130} y={420} width={260} height={30} fill={mix(pal.m, "#000000", 0.35)} />
              <rect x={-130} y={790} width={260} height={30} fill={mix(pal.m, "#000000", 0.35)} />
            </g>
          </g>
        </g>
        {hits.map((h, k) => {
          const b = burst(h);
          return (
            <g key={k} transform={`translate(${k ? 380 : 700} ${k ? 1180 : 1080})`} opacity={f >= h ? 1 - b : 0} filter={`url(#${id}-glow)`}>
              {Array.from({ length: 8 }, (_, j) => {
                const a = (j / 8) * Math.PI * 2;
                const r1 = 40 + b * 60;
                const r2 = 90 + b * 110;
                return <line key={j} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={ink} strokeWidth={k ? 14 : 10} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
      </Layer>
    </Shell>
  );
};

// 9 · Siempre hay que levantarse, no importa la adversidad — verde: te levantas del suelo y la tormenta no te tumba
const Levantarse: React.FC<P> = ({ f, dur, from }) => {
  const id = "at";
  const pal = SCENE_PAL.levantarse;
  const up = at(103, from);
  const rise = ip(f, [up - 6, up + 12], [0, 1], INOUT);
  const storm = at(107, from);
  const adv = at(111, from);
  const firm = ip(f, [adv, adv + 10], [0, 1], INOUT);
  const flash = f >= adv && f < adv + 5 ? ip(f, [adv, adv + 5], [0.5, 0]) : 0;
  const pose = lerpPose(lerpPose(POSES.cross, POSES.stand, rise), POSES.hips, firm);
  const cloud = mix(pal.m, "#000000", 0.45);
  const rain = mix(pal.l, "#ffffff", 0.2);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        {/* tormenta */}
        <g transform={`translate(760 ${860 + float(f, 2, 6)})`} style={{ opacity: ip(f, [storm - 4, storm + 6], [0, 1]) }}>
          <g filter={`url(#${id}-glow)`}>
            <ellipse cx={-120} cy={20} rx={130} ry={90} fill={cloud} />
            <ellipse cx={30} cy={-30} rx={160} ry={120} fill={cloud} />
            <ellipse cx={170} cy={30} rx={120} ry={85} fill={cloud} />
          </g>
          {Array.from({ length: 16 }, (_, k) => {
            const x = -220 + k * 28;
            const y = 90 + ((f * (14 + firm * 6) + k * 53) % 520);
            return <line key={k} x1={x} y1={y} x2={x - 26} y2={y + 54} stroke={rain} strokeWidth={5} strokeLinecap="round" opacity={0.55 + firm * 0.3} />;
          })}
          <path d="M40 60 L-10 180 L40 180 L-20 320" stroke={mix(pal.l, "#ffffff", 0.6)} strokeWidth={12} fill="none" strokeLinejoin="round" opacity={flash > 0 ? 1 : 0} />
        </g>
        {/* tú: del suelo a de pie, firme */}
        <ellipse cx={380} cy={1705} rx={190} ry={26} fill={pal.l} opacity={0.22} filter={`url(#${id}-glow)`} />
        <g transform={`translate(380 1700) rotate(${-82 * (1 - rise)})`}>
          <Figure id={id} pal={pal} x={0} y={0} s={1.25} pose={pose} />
        </g>
      </Layer>
      <AbsoluteFill style={{ background: "#ffffff", opacity: flash, mixBlendMode: "screen" }} />
    </Shell>
  );
};

// 10 · En el último minuto se puede remontar — índigo: el marcador da la vuelta
const Marcador: React.FC<P> = ({ f, dur, from }) => {
  const id = "ak";
  const pal = SCENE_PAL.marcador;
  const flip = at(118, from);
  const turned = f >= flip;
  const minute = at(115, from);
  const sec = f < minute ? Math.min(59, 50 + Math.floor(f / 3)) : 0;
  const clock = f < minute ? `89:${String(sec).padStart(2, "0")}` : "90:00";
  const paper = mix(pal.l, "#ffffff", 0.75);
  const pulse = ip(f, [flip, flip + 10], [1.25, 1], BACK);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1230} w={780} h={560} rx={14} ry={-10} s={ip(f, [0, 10], [0.86, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <rect x={-360} y={-250} width={720} height={500} rx={40} fill={`url(#${id}-dark)`} stroke={`url(#${id}-obj)`} strokeWidth={8} />
        </g>
        <rect x={-150} y={-220} width={300} height={100} rx={22} fill={pal.m} />
        <text y={-148} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={68} fill={paper}>
          {clock}
        </text>
        <text x={-170} y={130} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={230} fill={turned ? mix(pal.l, "#ffffff", 0.35) : paper} style={{ scale: turned ? `${pulse}` : "1", transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          {turned ? "3" : "1"}
        </text>
        <rect x={-30} y={20} width={60} height={20} rx={10} fill={paper} opacity={0.7} />
        <text x={170} y={130} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={230} fill={paper} opacity={turned ? 0.55 : 1}>
          2
        </text>
      </Tilt>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  meta: Meta,
  rutina: Rutina,
  realidad: Realidad,
  camino: Camino,
  progreso: Progreso,
  vida: Vida,
  golpes: Golpes,
  levantarse: Levantarse,
  marcador: Marcador,
};
