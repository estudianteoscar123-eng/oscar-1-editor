import React from "react";
import { Easing } from "remotion";
import { Layer, Shell, Tilt, popSvg } from "../ee46f/Scenes";
import { Bubble, Clock, Dumbbell, Figure, POSES, Pose, Target } from "../ee46f/shapes";
import { BACK, DISPLAY, INOUT, Pal, SANS, alpha, ip, mix } from "../ee46f/theme";
import { Card, Heart, Person } from "../vaso/icons";
import { Calendar } from "./Calendar";
import { Coin, ContactCard, DocPage, SendBtn, Shade, Shirt, Stairs, Timer } from "./props";
import { SceneId, TOTAL, wf } from "./timeline";

export type P = { f: number; dur: number; from: number; pal: Pal };
const at = (i: number, from: number) => wf(i) - from;
const float = (f: number, seed: number, amp = 10) => Math.sin(f / 26 + seed * 1.7) * amp;
const G: React.FC<{ x: number; y: number; s?: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s = 1, rot = 0, children, style }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g style={style}>{children}</g>
  </g>
);
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  l: [a.l[0] + (b.l[0] - a.l[0]) * t, a.l[1] + (b.l[1] - a.l[1]) * t],
  r: [a.r[0] + (b.r[0] - a.r[0]) * t, a.r[1] + (b.r[1] - a.r[1]) * t],
  spread: (a.spread ?? 6) + ((b.spread ?? 6) - (a.spread ?? 6)) * t,
});
const Pill: React.FC<{ pal: Pal; text: string; w?: number }> = ({ pal, text, w = 190 }) => (
  <g>
    <rect x={-w / 2} y={-28} width={w} height={56} rx={28} fill={alpha(pal.l, 0.18)} stroke={alpha(pal.l, 0.7)} strokeWidth={2} />
    <text y={11} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={800} fontSize={28} fill={mix(pal.l, "#ffffff", 0.3)}>
      {text}
    </text>
  </g>
);

// Hojas sueltas flotando: mismo estado al principio y al final para que el loop no se note
const FloatingPages: React.FC<{ gf: number; pal: Pal }> = ({ gf, pal }) => {
  const u = (gf / TOTAL) * Math.PI * 2;
  const items: [number, number, number, number][] = [
    [150, 560, 0.22, 8],
    [930, 640, 0.26, 9],
    [120, 1560, 0.3, 5],
    [960, 1500, 0.24, 6],
    [870, 1830, 0.2, 10],
  ];
  return (
    <Layer>
      {items.map(([x, y, s, b], k) => (
        <g key={k} transform={`translate(${x + Math.sin(u * 2 + k) * 16} ${y + Math.cos(u * 3 + k) * 20}) rotate(${Math.sin(u * 2 + k * 1.7) * 16}) scale(${s})`} style={{ filter: `blur(${b}px)` }} opacity={0.55}>
          <Calendar id={`fp${k}`} pal={pal} label={"ALGÚN\nDÍA"} stack={1} />
        </g>
      ))}
    </Layer>
  );
};

const Hero: React.FC<{ f: number; gf: number; pal: Pal; id: string }> = ({ gf, pal, id }) => {
  const u = (gf / TOTAL) * Math.PI * 2;
  return (
    <Layer>
      <G x={540} y={1190 + Math.sin(u * 4) * 10} s={1} rot={Math.sin(u * 3) * 2}>
        <Calendar id={id} pal={pal} label={"ALGÚN\nDÍA"} />
      </G>
    </Layer>
  );
};

// 1 · ¿Y si algún día fue la mentira que te robó?
const Gancho: React.FC<P> = ({ f, dur, from, pal }) => {
  const pulse = ip(f, [at(9, from) - 2, at(9, from) + 6], [0, 1]) * ip(f, [at(9, from) + 6, dur], [1, 0.3]);
  return (
    <Shell id="ag" pal={pal} f={f} dur={dur} push={[1, 1.04]}>
      <FloatingPages gf={from + f} pal={pal} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 45% 25% at 50% 62%, ${alpha(pal.l, 0.22 * pulse)}, rgba(0,0,0,0) 100%)` }} />
      <Hero f={f} gf={from + f} pal={pal} id="agc" />
    </Shell>
  );
};

// 21 · Así que no te pregunto cuándo. Te pregunto: → vuelve al gancho
const Cierre: React.FC<P> = ({ f, dur, from, pal }) => (
  <Shell id="ag" pal={pal} f={f} dur={dur} push={[1.04, 1]} exit={false}>
    <FloatingPages gf={from + f} pal={pal} />
    <Hero f={f} gf={from + f} pal={pal} id="azc" />
  </Shell>
);

// 2 · Tienes una lista de cosas que vas a hacer algún día
const Lista: React.FC<P> = ({ f, dur, from, pal }) => {
  const ink = mix(pal.l, "#ffffff", 0.3);
  const rows: [number, string][] = [
    [at(21, from), "Entrenar"],
    [at(24, from), "Escribir el libro"],
    [at(27, from), "Dejar el trabajo"],
  ];
  return (
    <Shell id="al" pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1200} w={720} h={720} rx={10} ry={-10} s={ip(f, [0, 10], [0.9, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter="url(#al-glow)">
          <Card w={640} h={620} fill={mix(pal.m, "#000000", 0.45)} edge={alpha(pal.l, 0.4)} />
        </g>
        <text x={-270} y={-230} fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={48} fill={ink}>
          MI LISTA
        </text>
        {rows.map(([a, t], k) => (
          <g key={k} transform={`translate(0 ${-110 + k * 120})`} style={popSvg(f, a - 2, 8)}>
            <rect x={-270} y={-24} width={48} height={48} rx={12} fill="none" stroke={ink} strokeWidth={4} />
            <text x={-200} y={14} fontFamily={SANS} fontWeight={600} fontSize={40} fill={ink}>
              {t}
            </text>
            <g transform="translate(180 54)">
              <Pill pal={pal} text="algún día" w={170} />
            </g>
          </g>
        ))}
      </Tilt>
    </Shell>
  );
};

// 3 · Tu salud, tu dinero, esa persona
const Vida: React.FC<P> = ({ f, dur, from, pal }) => {
  const ink = mix(pal.l, "#ffffff", 0.3);
  const tiles: [number, number, number, number][] = [
    [260, 960, at(38, from), -8],
    [540, 1220, at(41, from), 4],
    [820, 1480, at(46, from), -4],
  ];
  return (
    <Shell id="av" pal={pal} f={f} dur={dur}>
      {tiles.map(([x, y, a, r], k) =>
        f < a - 2 ? null : (
          <Tilt key={k} x={x} y={y + float(f, k, 8)} w={340} h={340} rz={r} ry={x < 540 ? 14 : -14} s={ip(f, [a - 2, a + 8], [0.6, 1], BACK)} o={ip(f, [a - 2, a + 3], [0, 1])}>
            <g filter="url(#av-glow)">
              <Card w={300} h={300} fill={mix(pal.m, "#000000", 0.4)} edge={alpha(pal.l, 0.4)} />
              {k === 0 && (
                <g>
                  <Heart fill={ink} s={1.6} />
                  <path d={`M-120 70 L-50 70 L-30 ${70 - 50 * Math.abs(Math.sin(f / 4))} L-10 100 L10 50 L30 70 L120 70`} stroke={ink} strokeWidth={6} fill="none" strokeLinejoin="round" />
                </g>
              )}
              {k === 1 && (
                <g transform="scale(1.6)">
                  <Coin pal={pal} />
                </g>
              )}
              {k === 2 && (
                <g>
                  <g transform="translate(-50 20) scale(1.6)">
                    <Person fill={ink} />
                  </g>
                  <g transform="translate(50 20) scale(1.6)">
                    <Person fill={mix(pal.l, "#ffffff", 0.1)} />
                  </g>
                  <g transform={`translate(0 -90) scale(${0.5 + Math.abs(Math.sin(f / 8)) * 0.08})`}>
                    <Heart fill={ink} />
                  </g>
                </g>
              )}
            </g>
          </Tilt>
        ),
      )}
    </Shell>
  );
};

// 4 · Algún día. Lo dices tantas veces que ya suena a plan, y por eso no te duele
const Plan: React.FC<P> = ({ f, dur, from, pal }) => {
  const a0 = at(47, from);
  const planA = at(57, from);
  const merge = ip(f, [planA - 4, planA + 10], [0, 1], INOUT);
  const spots: [number, number][] = [
    [240, 880],
    [800, 820],
    [330, 1180],
    [760, 1260],
    [200, 1520],
    [860, 1580],
    [540, 1000],
  ];
  return (
    <Shell id="ap" pal={pal} f={f} dur={dur}>
      <Layer>
        {spots.map(([x, y], k) => {
          const a = a0 + k * 12;
          if (f < a) return null;
          const tx = x + (540 - x) * merge;
          const ty = y + (1250 - y) * merge;
          return (
            <G key={k} x={tx} y={ty + float(f, k, 6)} s={(0.9 - (k % 3) * 0.1) * (1 - merge * 0.7)} style={{ ...popSvg(f, a, 8), opacity: (1 - merge) * ip(f, [a, a + 5], [0, 1]) }}>
              <g filter="url(#ap-glow)">
                <Bubble id="ap" w={300} h={110} tail={k % 2 ? "r" : "l"}>
                  <text y={14} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={800} fontSize={40} fill={mix(pal.m, "#000000", 0.4)}>
                    algún día
                  </text>
                </Bubble>
              </g>
            </G>
          );
        })}
        <G x={540} y={1250} style={{ ...popSvg(f, planA, 10) }}>
          <g filter="url(#ap-glow)">
            <rect x={-260} y={-190} width={520} height={380} rx={26} fill={mix(pal.m, "#000000", 0.3)} stroke={alpha(pal.l, 0.6)} strokeWidth={3} />
            {Array.from({ length: 8 }, (_, k) => (
              <line key={k} x1={-260 + k * 65} y1={-190} x2={-260 + k * 65} y2={190} stroke={alpha(pal.l, 0.12)} strokeWidth={2} />
            ))}
            {Array.from({ length: 6 }, (_, k) => (
              <line key={k} x1={-260} y1={-190 + k * 63} x2={260} y2={-190 + k * 63} stroke={alpha(pal.l, 0.12)} strokeWidth={2} />
            ))}
            <text y={40} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={140} fill={mix(pal.l, "#ffffff", 0.3)}>
              PLAN
            </text>
          </g>
        </G>
      </Layer>
    </Shell>
  );
};

// 5 · Pones una fecha: el lunes
const Lunes: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(72, from);
  const tear = ip(f, [a - 4, a + 12], [0, 1], Easing.in(Easing.quad));
  const circ = ip(f, [a + 10, a + 26], [0, 1], INOUT);
  return (
    <Shell id="au" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={540} y={1200}>
          <Calendar id="auc" pal={pal} label={"ALGÚN\nDÍA"} next="LUNES" nextSize={130} tear={tear} />
          <ellipse cx={0} cy={60} rx={240} ry={110} fill="none" stroke={mix(pal.m, "#000000", 0.1)} strokeWidth={10} strokeDasharray={1200} strokeDashoffset={1200 * (1 - circ)} strokeLinecap="round" transform="rotate(-6)" />
        </G>
      </Layer>
    </Shell>
  );
};

// 6 · Te sientes bien por decidirlo, como si ya hubieras empezado
const Bien: React.FC<P> = ({ f, dur, from, pal }) => {
  const ink = mix(pal.l, "#ffffff", 0.3);
  const ok = at(80, from);
  const bar = at(88, from);
  return (
    <Shell id="ab" pal={pal} f={f} dur={dur}>
      <Layer>
        <ellipse cx={540} cy={1730} rx={260} ry={36} fill={pal.l} opacity={0.2} filter="url(#ab-glow)" />
        <Figure id="ab" pal={pal} x={540} y={1720} s={1.12} pose={POSES.hips} />
        <G x={540} y={960 + float(f, 1, 8)} style={popSvg(f, ok, 9)}>
          <g filter="url(#ab-glow)">
            <circle r={70} fill={mix(pal.l, "#ffffff", 0.2)} />
            <path d="M-30 0 L-8 24 L34 -24" stroke={pal.m} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </G>
        <G x={540} y={1800} style={popSvg(f, bar, 8)}>
          <rect x={-300} y={-14} width={600} height={28} rx={14} fill={alpha(pal.l, 0.15)} stroke={alpha(pal.l, 0.5)} strokeWidth={2} />
          <rect x={-300} y={-14} width={18} height={28} rx={14} fill={ink} />
          <text x={320} y={12} fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={36} fill={ink}>
            0%
          </text>
        </G>
      </Layer>
    </Shell>
  );
};

// 7 · Compras la ropa de gimnasio, abres el documento en blanco, guardas el número
const Compras: React.FC<P> = ({ f, dur, from, pal }) => {
  const objs: [number, number, number, number][] = [
    [280, 960, at(93, from), -8],
    [790, 1200, at(97, from), 6],
    [330, 1520, at(103, from), -4],
  ];
  return (
    <Shell id="ac" pal={pal} f={f} dur={dur}>
      {objs.map(([x, y, a, r], k) =>
        f < a - 2 ? null : (
          <Tilt key={k} x={x} y={y + float(f, k, 7)} w={420} h={460} rz={r} ry={x < 540 ? 12 : -12} s={ip(f, [a - 2, a + 8], [0.6, 1], BACK)} o={ip(f, [a - 2, a + 3], [0, 1])}>
            <g filter="url(#ac-glow)">
              {k === 0 && (
                <g transform="scale(1.4)">
                  <Shirt fill="url(#ac-obj)" />
                </g>
              )}
              {k === 1 && <DocPage pal={pal} lines={0} cursor={Math.floor(f / 10) % 2 === 0} />}
              {k === 2 && <ContactCard pal={pal} saved={ip(f, [at(104, from), at(104, from) + 6], [0, 1])} />}
            </g>
          </Tilt>
        ),
      )}
    </Shell>
  );
};

// 8 · Funciona una semana, tal vez dos. Te felicitas por tener un plan
const Semanas: React.FC<P> = ({ f, dur, from, pal }) => {
  const t1 = ip(f, [at(110, from) - 4, at(110, from) + 10], [0, 1], Easing.in(Easing.quad));
  const stamp = at(116, from);
  return (
    <Shell id="as" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={540} y={1200} rot={float(f, 1, 2)}>
          <Calendar id="asc" pal={pal} sub="SEMANA" label="1" next="2" size={300} nextSize={300} tear={t1} />
          <g transform="translate(200 -230) rotate(12)" style={popSvg(f, stamp, 8)}>
            <g filter="url(#as-glow)">
              <rect x={-130} y={-50} width={260} height={100} rx={20} fill="none" stroke={mix(pal.l, "#ffffff", 0.3)} strokeWidth={8} />
              <text y={22} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={60} fill={mix(pal.l, "#ffffff", 0.3)}>
                ✓ PLAN
              </text>
            </g>
          </g>
        </G>
      </Layer>
    </Shell>
  );
};

// Escalera compartida
const ST = { x: 210, y: 1730, s: 0.85, sw: 150, sh: 92 };
const stepPos = (k: number): [number, number] => [ST.x + (k * ST.sw + ST.sw / 2) * ST.s, ST.y - (k + 1) * ST.sh * ST.s];

// 9 · Aunque el plan nunca tenga un primer paso
const Escalera: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(123, from);
  const pulse = f > a ? 0.5 + 0.5 * Math.sin((f - a) / 3) : 0;
  return (
    <Shell id="ae" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={ST.x} y={ST.y} s={ST.s}>
          <g filter="url(#ae-glow)">
            <Stairs pal={pal} first={0} />
          </g>
          <rect x={-6} y={-ST.sh - 6} width={ST.sw + 12} height={ST.sh + 12} fill="none" stroke={mix(pal.l, "#ffffff", 0.4)} strokeWidth={6} opacity={pulse} />
        </G>
        <Figure id="ae" pal={pal} x={110} y={1730} s={0.8} pose={POSES.stand} />
      </Layer>
    </Shell>
  );
};

// 10 · Cada algún día que se acumula cobra intereses
const Intereses: React.FC<P> = ({ f, dur, from, pal }) => {
  const a0 = at(125, from);
  const n = Math.min(9, Math.max(0, Math.floor((f - a0) / 7) + 1));
  const pct = Math.round(ip(f, [at(132, from), dur], [12, 348], Easing.out(Easing.cubic)));
  const ink = mix(pal.l, "#ffffff", 0.3);
  return (
    <Shell id="ai" pal={pal} f={f} dur={dur}>
      <Layer>
        {Array.from({ length: n }, (_, k) => {
          const a = a0 + k * 7;
          return (
            <G key={k} x={500 + Math.sin(k * 2.3) * 30} y={1640 - k * 92} s={0.36} rot={Math.sin(k * 1.7) * 6} style={popSvg(f, a, 6)}>
              <Calendar id={`ai${k}`} pal={pal} label={"ALGÚN\nDÍA"} stack={1} />
            </G>
          );
        })}
        <G x={830} y={900 + float(f, 1, 6)} style={popSvg(f, at(132, from), 8)}>
          <g filter="url(#ai-glow)">
            <rect x={-150} y={-62} width={300} height={124} rx={62} fill={pal.m} stroke={ink} strokeWidth={4} />
            <text y={26} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={76} fill={ink}>
              {`+${pct}%`}
            </text>
          </g>
        </G>
      </Layer>
    </Shell>
  );
};

// 11 · Tus amigos avanzan mientras tú esperas el momento perfecto
const Amigos: React.FC<P> = ({ f, dur, from, pal }) => {
  const sw = Math.sin(f / 5);
  return (
    <Shell id="am" pal={pal} f={f} dur={dur}>
      <Layer>
        <line x1={0} y1={1735} x2={1080} y2={1735} stroke={pal.l} strokeWidth={2} opacity={0.3} />
        {[0, 1, 2].map((k) => {
          const x = 380 + k * 150 + f * (4.2 + k * 0.6);
          return (
            <g key={k} opacity={ip(x, [900, 1080], [1, 0])}>
              <Figure id="am" pal={pal} x={x} y={1730} s={0.82} pose={{ l: [-120 + sw * 30, -200], r: [120 - sw * 30, -200], step: sw * 14 * (k % 2 ? 1 : -1) }} />
            </g>
          );
        })}
        <g opacity={0.65}>
          <Figure id="am" pal={pal} x={170} y={1730} s={0.86} pose={POSES.stand} />
        </g>
        <g transform="translate(170 1080) scale(0.32)" filter="url(#am-glow)">
          <Clock id="am" r={230} t={f * 9} />
        </g>
      </Layer>
    </Shell>
  );
};

// 12 · Tu cuerpo cambia, tu cuenta no crece
const Cuerpo: React.FC<P> = ({ f, dur, from, pal }) => {
  const ink = mix(pal.l, "#ffffff", 0.3);
  const a2 = at(146, from);
  const draw = ip(f, [a2, a2 + 20], [0, 1], INOUT);
  return (
    <Shell id="ak" pal={pal} f={f} dur={dur}>
      <Tilt x={290} y={1200} w={440} h={620} ry={12} rz={-3} s={ip(f, [0, 9], [0.85, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter="url(#ak-glow)">
          <Card w={400} h={580} fill={mix(pal.m, "#000000", 0.45)} edge={alpha(pal.l, 0.4)} />
        </g>
        <g opacity={ip(f, [at(145, from), at(145, from) + 20], [1, 0.45])}>
          <Figure id="ak" pal={pal} x={0} y={250} s={0.72} pose={{ ...POSES.stand, lean: ip(f, [at(145, from), at(145, from) + 20], [0, 6]) }} />
        </g>
      </Tilt>
      {f >= a2 - 2 && (
        <Tilt x={790} y={1200} w={440} h={620} ry={-12} rz={3} s={ip(f, [a2 - 2, a2 + 8], [0.85, 1], BACK)} o={ip(f, [a2 - 2, a2 + 3], [0, 1])}>
          <g filter="url(#ak-glow)">
            <Card w={400} h={580} fill={mix(pal.m, "#000000", 0.45)} edge={alpha(pal.l, 0.4)} />
          </g>
          <text y={-200} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={70} fill={ink}>
            $0
          </text>
          {[-120, -40, 40, 120].map((y) => (
            <line key={y} x1={-160} y1={y} x2={160} y2={y} stroke={alpha(pal.l, 0.12)} strokeWidth={2} />
          ))}
          <path d="M-160 140 L-80 138 L0 142 L80 139 L160 140" stroke={ink} strokeWidth={8} fill="none" strokeDasharray={360} strokeDashoffset={360 * (1 - draw)} strokeLinecap="round" />
        </Tilt>
      )}
    </Shell>
  );
};

// 13 · Cada noche aparece la misma culpa, la que no se va con una buena excusa
const Culpa: React.FC<P> = ({ f, dur, from, pal }) => {
  const grow = ip(f, [0, at(156, from) + 6], [0.5, 1.15], INOUT);
  const eyes = ip(f, [at(156, from) - 2, at(156, from) + 6], [0, 1]);
  const ex = at(164, from);
  const exO = ip(f, [ex - 2, ex + 4], [0, 1]) * ip(f, [ex + 14, ex + 26], [1, 0]);
  return (
    <Shell id="aq" pal={pal} f={f} dur={dur}>
      <Layer>
        <g transform={`translate(860 ${700 + float(f, 2, 6)})`} filter="url(#aq-glow)">
          <path d="M34 -78 A82 82 0 1 0 34 78 A64 64 0 1 1 34 -78 Z" fill={mix(pal.l, "#ffffff", 0.3)} />
        </g>
        <G x={560} y={1350} s={grow * 1.6}>
          <Shade pal={pal} eyes={eyes} />
        </G>
        <Figure id="aq" pal={pal} x={540} y={1730} s={1.05} pose={{ ...POSES.stand, lean: 4 }} />
        <G x={800} y={1180 - (f > ex + 14 ? (f - ex - 14) * 3 : 0)} s={0.95} style={{ opacity: exO, filter: `blur(${ip(f, [ex + 14, ex + 26], [0, 12])}px)` }}>
          <Bubble id="aq" w={380} h={110}>
            <text y={13} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} fill={mix(pal.m, "#000000", 0.4)}>
              mañana empiezo
            </text>
          </Bubble>
        </G>
      </Layer>
    </Shell>
  );
};

// 14 · Sabes exactamente lo que quieres y lo que estás evitando
const Evitas: React.FC<P> = ({ f, dur, from, pal }) => {
  const want = at(180, from);
  const avoid = at(187, from);
  const ink = mix(pal.l, "#ffffff", 0.25);
  const d1 = ip(f, [want - 4, want + 12], [0, 1], INOUT);
  const d2 = ip(f, [avoid - 6, avoid + 10], [0, 1], INOUT);
  return (
    <Shell id="aw" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={250} y={1000 + float(f, 1, 8)} style={popSvg(f, want - 4, 10)}>
          <g filter="url(#aw-glow)">
            <Target color={ink} s={1.5} />
          </g>
        </G>
        <G x={830} y={1130} style={popSvg(f, avoid - 6, 10)}>
          <g filter="url(#aw-glow)">
            <rect x={-120} y={-220} width={240} height={440} rx={14} fill={mix(pal.m, "#000000", 0.6)} stroke={ink} strokeWidth={5} />
            <circle cx={70} cy={10} r={12} fill={ink} />
          </g>
        </G>
        <path d="M480 1180 C420 1100 340 1080 290 1120" stroke={ink} strokeWidth={5} fill="none" strokeDasharray="14 12" opacity={d1} />
        <path d="M600 1180 C660 1120 700 1140 720 1160" stroke={ink} strokeWidth={5} fill="none" strokeDasharray="14 12" opacity={d2} />
        <Figure id="aw" pal={pal} x={540} y={1730} s={1.05} pose={POSES.stand} />
      </Layer>
    </Shell>
  );
};

// 15 · Hasta que miras atrás… el día que llamabas algún día ya se fue, y no volvió
const SeFue: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(201, from);
  const tear = ip(f, [a - 2, a + 26], [0, 1], Easing.in(Easing.quad));
  const wind = ip(f, [a - 4, a + 30], [0, 1]) * ip(f, [a + 30, dur], [1, 0.3]);
  return (
    <Shell id="af" pal={pal} f={f} dur={dur} push={[1.06, 1]}>
      <Layer>
        {Array.from({ length: 7 }, (_, k) => {
          const x = ((f * 26 + k * 180) % 1400) - 200;
          return <line key={k} x1={x} y1={700 + k * 140} x2={x + 220} y2={660 + k * 140} stroke={pal.l} strokeWidth={3} opacity={0.35 * wind} strokeLinecap="round" />;
        })}
        <G x={540} y={1380}>
          <Calendar id="afc" pal={pal} label={"ALGÚN\nDÍA"} next="" nextSub=" " tear={tear} fly={[1250, -220]} />
        </G>
      </Layer>
    </Shell>
  );
};

// 16 · Lo que cambia todo no es planear mejor. Ya planeaste bastante
const Planes: React.FC<P> = ({ f, dur, from, pal }) => {
  const crush = ip(f, [at(216, from), at(217, from) + 14], [0, 1], Easing.in(Easing.quad));
  return (
    <Shell id="aj" pal={pal} f={f} dur={dur}>
      {[0, 1, 2, 3, 4].map((k) => {
        const a = k * 4;
        const x = 540 + (k - 2) * 110;
        return (
          <Tilt key={k} x={x + (k - 2) * crush * 160} y={1180 + Math.abs(k - 2) * 30 + crush * crush * 900} w={340} h={440} rz={(k - 2) * 8 + crush * (k - 2) * 50} rx={8} s={ip(f, [a, a + 8], [0.7, 1], BACK) * (1 - crush * 0.4)} o={ip(f, [a, a + 4], [0, 1]) * (1 - crush)}>
            <g filter="url(#aj-glow)">
              <DocPage pal={pal} lines={5.6} cursor={false} />
            </g>
          </Tilt>
        );
      })}
    </Shell>
  );
};

// 17 · Es empezar la primera versión de algo, hoy, aunque sea torpe
const Hoy: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(225, from);
  const tear = ip(f, [a - 6, a + 12], [0, 1], Easing.in(Easing.quad));
  const glow = ip(f, [a + 4, a + 16], [0, 1]);
  const wobble = f > at(228, from) ? Math.sin((f - at(228, from)) / 2.5) * 3 * ip(f, [at(228, from), at(228, from) + 30], [1, 0]) : 0;
  return (
    <Shell id="ah" pal={pal} f={f} dur={dur}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 45% 28% at 50% 62%, ${alpha(pal.l, 0.35 * glow)}, rgba(0,0,0,0) 100%)` }} />
      <Layer>
        <G x={540} y={1200} rot={wobble}>
          <Calendar id="ahc" pal={PALL} label={"ALGÚN\nDÍA"} next="HOY" nextPal={pal} nextSize={210} nextGlow={glow} tear={tear} fly={[-900, -1200]} />
        </G>
      </Layer>
    </Shell>
  );
};
const PALL: Pal = { m: "#55534F", l: "#ECEAE3" };

// 18 · Diez minutos de entrenamiento, una página escrita, un mensaje que te da miedo mandar
const Pasos: React.FC<P> = ({ f, dur, from, pal }) => {
  const t0 = at(229, from);
  const d0 = at(238, from);
  const m0 = at(245, from);
  const send = at(251, from);
  const press = ip(f, [send - 2, send + 2], [0, 1]) * ip(f, [send + 2, send + 8], [1, 0]);
  const sent = ip(f, [send + 4, send + 12], [0, 1]);
  return (
    <Shell id="ax" pal={pal} f={f} dur={dur}>
      <Tilt x={290} y={950} w={380} h={380} rz={-6} ry={12} s={ip(f, [t0 - 2, t0 + 8], [0.6, 1], BACK)} o={ip(f, [t0 - 2, t0 + 3], [0, 1])}>
        <g filter="url(#ax-glow)">
          <Timer pal={pal} secs={Math.max(0, 600 - (f - t0) * 2)} prog={ip(f, [t0, dur], [1, 0.72])} />
        </g>
        <g transform="translate(0 -80) scale(0.25)" opacity={0.8}>
          <Dumbbell id="ax" w={300} />
        </g>
      </Tilt>
      {f >= d0 - 2 && (
        <Tilt x={790} y={1160} w={380} h={480} rz={5} ry={-12} s={ip(f, [d0 - 2, d0 + 8], [0.6, 1], BACK)} o={ip(f, [d0 - 2, d0 + 3], [0, 1])}>
          <g filter="url(#ax-glow)">
            <DocPage pal={pal} lines={ip(f, [d0, d0 + 50], [0, 3.4])} cursor />
          </g>
        </Tilt>
      )}
      {f >= m0 - 2 && (
        <Layer>
          <G x={420} y={1530} style={popSvg(f, m0 - 2, 9)}>
            <g filter="url(#ax-glow)">
              <Bubble id="ax" w={460} h={130} tail="r">
                <text y={14} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={38} fill={mix(pal.m, "#000000", 0.4)}>
                  Te tengo que decir algo
                </text>
              </Bubble>
            </g>
          </G>
          <G x={800} y={1700}>
            <g filter="url(#ax-glow)">
              <SendBtn pal={pal} press={press} />
            </g>
          </G>
          <text x={800} y={1800} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={28} fill={pal.l} opacity={sent}>
            Enviado ✓
          </text>
        </Layer>
      )}
    </Shell>
  );
};

// 19 · Solo necesitas el primer paso antes de que tu mente te convenza de mañana
const Subir: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(265, from);
  const first = ip(f, [a - 4, a + 8], [0, 1], BACK);
  const climb = ip(f, [a + 6, dur - 4], [0, 2.2], INOUT);
  const k = Math.floor(climb);
  const frac = climb - k;
  const [x0, y0] = stepPos(Math.min(k, 5));
  const [x1, y1] = stepPos(Math.min(k + 1, 5));
  const onStairs = f > a + 6;
  const fx = onStairs ? x0 + (x1 - x0) * frac : 110;
  const fy = onStairs ? y0 + (y1 - y0) * frac - Math.sin(frac * Math.PI) * 30 : 1730;
  const sw = onStairs ? Math.sin(f / 4) : 0;
  const m = at(277, from);
  const man = ip(f, [m - 8, m + 4], [0, 1], INOUT);
  return (
    <Shell id="ay" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={ST.x} y={ST.y} s={ST.s}>
          <g filter="url(#ay-glow)">
            <Stairs pal={pal} first={first} />
          </g>
        </G>
        <Figure id="ay" pal={pal} x={fx} y={fy} s={0.8} pose={{ l: [-120 + sw * 26, -200], r: [120 - sw * 26, -200], step: sw * 14 }} />
        <G x={1300 - man * 420} y={900} s={0.4} rot={10} style={{ opacity: man * ip(f, [m + 4, dur], [1, 0.25]), filter: `blur(${ip(f, [m + 4, dur], [0, 8])}px)` }}>
          <Calendar id="ayc" pal={pal} label="MAÑANA" size={100} stack={2} />
        </G>
      </Layer>
    </Shell>
  );
};

// 20 · El miedo baja: ya no tiene un futuro donde esconderse
const Miedo: React.FC<P> = ({ f, dur, from, pal }) => {
  const baja = ip(f, [at(286, from), at(287, from) + 16], [1.25, 0.55], INOUT);
  const gone = ip(f, [at(296, from), at(299, from) + 8], [1, 0]);
  const [fx, fy] = stepPos(3);
  return (
    <Shell id="an" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={ST.x} y={ST.y} s={ST.s}>
          <g filter="url(#an-glow)">
            <Stairs pal={pal} first={1} />
          </g>
        </G>
        <ellipse cx={fx} cy={fy - 520} rx={220} ry={220} fill={alpha(pal.l, 0.12 + 0.1 * (1 - gone))} filter="url(#an-glow)" />
        <Figure id="an" pal={pal} x={fx} y={fy} s={0.8} pose={lerpPose(POSES.stand, POSES.hips, ip(f, [at(287, from), at(287, from) + 12], [0, 1]))} />
        <G x={190} y={1460} s={baja} style={{ opacity: gone, filter: `blur(${(1 - gone) * 14}px)` }}>
          <Shade pal={pal} eyes={1} />
        </G>
        {[0, 1].map((k) => (
          <G key={k} x={760 + k * 170} y={820 + k * 120 + float(f, k, 8)} s={0.28} rot={k ? 8 : -6} style={{ opacity: gone * 0.85, filter: `blur(${(1 - gone) * 10 + k * 2}px)` }}>
            <Calendar id={`an${k}`} pal={pal} label="MAÑANA" size={100} stack={1} />
          </G>
        ))}
      </Layer>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  gancho: Gancho,
  lista: Lista,
  vida: Vida,
  plan: Plan,
  lunes: Lunes,
  bien: Bien,
  compras: Compras,
  semanas: Semanas,
  escalera: Escalera,
  intereses: Intereses,
  amigos: Amigos,
  cuerpo: Cuerpo,
  culpa: Culpa,
  evitas: Evitas,
  sefue: SeFue,
  planes: Planes,
  hoy: Hoy,
  pasos: Pasos,
  subir: Subir,
  miedo: Miedo,
  cierre: Cierre,
};
