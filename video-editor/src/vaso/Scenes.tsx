import React from "react";
import { Easing, interpolate } from "remotion";
import { Layer, Shell, Tilt, popSvg } from "../ee46f/Scenes";
import { Bubble, Clock, Figure, POSES, Phone, Pose } from "../ee46f/shapes";
import { BACK, DISPLAY, INOUT, Pal, SANS, alpha, ip, mix } from "../ee46f/theme";
import { Glass, Splash } from "./Glass";
import { Card, Coin, CuppedHands, Heart, Label, Moon, Person, Star, Trophy } from "./icons";
import { SceneId, TOTAL, wf } from "./timeline";

export type P = { f: number; dur: number; from: number; pal: Pal };
const at = (i: number, from: number) => wf(i) - from;
const float = (f: number, seed: number, amp = 10) => Math.sin(f / 26 + seed * 1.7) * amp;
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  l: [a.l[0] + (b.l[0] - a.l[0]) * t, a.l[1] + (b.l[1] - a.l[1]) * t],
  r: [a.r[0] + (b.r[0] - a.r[0]) * t, a.r[1] + (b.r[1] - a.r[1]) * t],
  spread: (a.spread ?? 6) + ((b.spread ?? 6) - (a.spread ?? 6)) * t,
});
const G: React.FC<{ x: number; y: number; s: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s, rot = 0, children, style }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g style={style}>{children}</g>
  </g>
);

// Chorro de agua que cae desde arriba
const Pour: React.FC<{ id: string; x: number; y0: number; y1: number; f: number; hue: string; w?: number; o?: number }> = ({ id, x, y0, y1, f, hue, w = 18, o = 1 }) => {
  if (o <= 0.01 || y1 <= y0) return null;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={`${id}-pour`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mix(hue, "#ffffff", 0.6)} stopOpacity={0.9} />
          <stop offset="0.5" stopColor={hue} stopOpacity={0.75} />
          <stop offset="1" stopColor={mix(hue, "#ffffff", 0.6)} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} rx={w / 2} fill={`url(#${id}-pour)`} />
      {Array.from({ length: 6 }, (_, k) => {
        const yy = y0 + ((f * 34 + k * 140) % Math.max(1, y1 - y0));
        return <rect key={k} x={x - 3} y={yy} width={6} height={40} rx={3} fill="#ffffff" opacity={0.55} />;
      })}
    </g>
  );
};

// Campo de trofeos y monedas: mismo estado al principio y al final para que el loop no se note
const FieldObjects: React.FC<{ gf: number; pal: Pal; id: string }> = ({ gf, pal, id }) => {
  const u = (gf / TOTAL) * Math.PI * 2;
  const fill = `url(#${id}-obj)`;
  const dark = mix(pal.m, "#000000", 0.5);
  const items: [number, number, number, number, "t" | "c" | "s", number][] = [
    [190, 1290, 0.95, 0, "t", 1],
    [880, 1230, 1.15, 0, "c", 2],
    [320, 1690, 1.3, 7, "c", 3],
    [810, 1660, 0.9, 2, "s", 4],
    [140, 420, 0.7, 9, "s", 5],
    [960, 520, 0.8, 10, "t", 6],
    [560, 1520, 1.05, 3, "t", 7],
  ];
  return (
    <Layer>
      {items.map(([x, y, s, b, t, k]) => (
        <g key={k} transform={`translate(${x + Math.sin(u * 2 + k) * 14} ${y + Math.cos(u * 3 + k * 2) * 18}) rotate(${Math.sin(u * 2 + k * 1.3) * 10}) scale(${s})`} style={{ filter: b ? `blur(${b}px)` : undefined }}>
          <g filter={`url(#${id}-glow)`} opacity={b ? 0.6 : 0.95}>
            {t === "t" ? <Trophy fill={fill} dark={dark} /> : t === "c" ? <Coin fill={fill} dark={dark} /> : <Star fill={fill} dark={dark} />}
          </g>
        </g>
      ))}
    </Layer>
  );
};

// 1 · Gancho
const Campo: React.FC<P> = ({ f, dur, from, pal }) => {
  const pulse = ip(f, [at(8, from) - 2, at(8, from) + 6], [0, 1]) * ip(f, [at(8, from) + 6, at(8, from) + 30], [1, 0.4]);
  return (
    <Shell id="vc" pal={pal} f={f} dur={dur} push={[1, 1.05]}>
      <FieldObjects gf={from + f} pal={pal} id="vc" />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 30% at 50% 45%, ${alpha(pal.l, 0.18 * pulse)}, rgba(0,0,0,0) 100%)` }} />
    </Shell>
  );
};

// 2 · Tu vida es este vaso, y tiene una grieta
const Vaso: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(15, from);
  const outline = ip(f, [2, a], [0, 1], INOUT);
  const crack = ip(f, [at(19, from), at(19, from) + 8], [0, 1], OUT2);
  return (
    <Shell id="vv" pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={540} y={1330} s={1.18}>
          {f < a ? (
            <path d="M-150 -230 L-115 216 Q-115 232 -95 232 L95 232 Q115 232 115 216 L150 -230" fill="none" stroke={mix(pal.l, "#ffffff", 0.4)} strokeWidth={4} strokeDasharray={1500} strokeDashoffset={1500 * (1 - outline)} opacity={0.8} />
          ) : (
            <g style={popSvg(f, a, 8)}>
              <Glass id="vvg" hue={pal.l} f={f} crack={crack} />
            </g>
          )}
        </G>
      </Layer>
    </Shell>
  );
};
const OUT2 = Easing.bezier(0.2, 0.9, 0.3, 1);

// 3 · Cada logro, cada peso, cada aplauso lo echas dentro. Por un segundo se llena.
const Llenar: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vl";
  const fill = `url(#${id}-obj)`;
  const dark = mix(pal.m, "#000000", 0.5);
  const drops: [number, React.ReactNode, number][] = [
    [at(21, from), <Trophy key="t" fill={fill} dark={dark} />, -60],
    [at(23, from), <Coin key="c" fill={fill} dark={dark} />, 40],
    [at(25, from), <Star key="s" fill={fill} dark={dark} />, -10],
  ];
  const level = 0.08 + drops.reduce((s, [a]) => s + ip(f, [a + 12, a + 22], [0, 0.2]), 0) + ip(f, [at(27, from), at(33, from) + 6], [0, 0.22]);
  const pourO = ip(f, [at(26, from), at(26, from) + 4], [0, 1]) * ip(f, [at(33, from), at(33, from) + 8], [1, 0]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <Pour id={id} x={540} y0={-40} y1={1380 - 230 * 1.05 + (1 - level) * 400} f={f} hue={pal.l} o={pourO} />
        {drops.map(([a, icon, dx], k) => {
          const p = ip(f, [a - 2, a + 12], [0, 1], Easing.in(Easing.quad));
          if (f < a - 2 || f > a + 16) return null;
          return (
            <G key={k} x={540 + dx * (1 - p)} y={640 + p * 640} s={0.75 - p * 0.25} rot={(1 - p) * (k % 2 ? 14 : -14)} style={{ opacity: ip(f, [a + 11, a + 16], [1, 0]) }}>
              <g filter={`url(#${id}-glow)`}>{icon}</g>
            </G>
          );
        })}
        <G x={540} y={1380} s={1.05}>
          <Glass id="vlg" hue={pal.l} f={f} level={level} crack={1} glow={1 + ip(f, [at(33, from), at(33, from) + 8], [0, 0.6])} />
          {drops.map(([a], k) => (f > a + 10 && f < a + 34 ? <g key={k} transform={`translate(0 ${-150 + (1 - level) * 200}) scale(0.5)`}><Splash t={ip(f, [a + 10, a + 34], [0, 1])} hue={pal.l} /></g> : null))}
        </G>
      </Layer>
    </Shell>
  );
};

// 4 · Te sientes bien, tomas una foto, lo compartes
const Foto: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vf";
  const shot = at(39, from);
  const flash = ip(f, [shot, shot + 2], [0, 1]) * ip(f, [shot + 2, shot + 12], [1, 0]);
  const share = at(41, from);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1250} w={620} h={1000} ry={-10} rx={4} s={ip(f, [0, 10], [0.88, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Phone id={id} w={420} h={840}>
            <g transform="translate(0 30) scale(0.62)">
              <Glass id="vfg" hue={pal.l} f={f} level={0.9} crack={1} />
            </g>
            {[
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sy], k) => (
              <path key={k} d={`M${sx * 150} ${sy * 230 + 30 - sy * 40} L${sx * 150} ${sy * 230 + 30} L${sx * 150 - sx * 40} ${sy * 230 + 30}`} stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.8} />
            ))}
            <circle cy={330} r={34} fill="none" stroke="#ffffff" strokeWidth={6} />
            <circle cy={330} r={24 * (1 - ip(f, [at(37, from), at(37, from) + 4], [0, 0.3]) + ip(f, [at(37, from) + 4, at(37, from) + 8], [0, 0.3]))} fill="#ffffff" />
            <rect x={-195} y={-405} width={390} height={810} rx={40} fill="#ffffff" opacity={flash * 0.9} />
          </Phone>
        </g>
      </Tilt>
      <Layer>
        {[0, 1, 2, 3, 4].map((k) => {
          const a = share + k * 3;
          const t = ip(f, [a, a + 40], [0, 1], Easing.out(Easing.quad));
          if (f < a) return null;
          return (
            <G key={k} x={640 + Math.sin(k * 2.1) * 160 + Math.sin(f / 8 + k) * 12} y={1500 - t * 760} s={0.7 + (k % 3) * 0.2} style={{ opacity: ip(f, [a, a + 4], [0, 1]) * (1 - t * 0.7) }}>
              <g filter={`url(#${id}-glow)`}>
                <Heart fill={mix(pal.l, "#ffffff", 0.25)} />
              </g>
            </G>
          );
        })}
      </Layer>
    </Shell>
  );
};

// 5 · Pero al día siguiente amaneces vacío otra vez, y vuelves a echar más
const Vacio: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vx";
  const level = ip(f, [at(44, from), at(47, from) + 4], [0.9, 0], INOUT) + ip(f, [at(53, from) + 8, at(53, from) + 16], [0, 0.12]);
  const coinP = ip(f, [at(53, from) - 4, at(53, from) + 8], [0, 1], Easing.in(Easing.quad));
  const sun = ip(f, [0, dur], [0, 1]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <circle cx={840} cy={720 - sun * 110} r={70} fill={mix(pal.l, "#ffffff", 0.4)} filter={`url(#${id}-glow)`} opacity={0.75} />
        <line x1={0} y1={1615} x2={1080} y2={1615} stroke={pal.l} strokeWidth={2} opacity={0.35} />
        <G x={540} y={1380} s={1.05}>
          <Glass id="vxg" hue={pal.l} f={f} level={level} crack={1} leak={ip(f, [at(44, from), at(45, from)], [0, 1]) * ip(f, [at(47, from) + 4, at(47, from) + 14], [1, 0])} glow={ip(f, [at(46, from), at(47, from) + 6], [1, 0.55])} />
        </G>
        {f > at(53, from) - 5 && coinP < 1 && (
          <G x={540} y={600 + coinP * 820} s={0.55} rot={coinP * 40}>
            <g filter={`url(#${id}-glow)`}>
              <Coin fill={`url(#${id}-obj)`} dark={mix(pal.m, "#000000", 0.5)} />
            </g>
          </G>
        )}
      </Layer>
    </Shell>
  );
};

// 6 · Más horas, más dinero, más gente, más metas
const Mas: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vm";
  const fill = mix(pal.m, "#000000", 0.35);
  const edge = alpha(pal.l, 0.4);
  const ink = mix(pal.l, "#ffffff", 0.3);
  const c = [at(60, from), at(64, from), at(69, from), at(74, from)];
  const money = Math.round(ip(f, [c[1], c[1] + 40], [1200, 48900], Easing.out(Easing.cubic)) / 100) * 100;
  const fol = ip(f, [c[2], c[2] + 36], [0.3, 12.4], Easing.out(Easing.cubic));
  const lvl = 0.62 + Math.sin(f / 11) * 0.08;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <Pour id={id} x={540} y0={-40} y1={1520 - 230 * 0.85 + (1 - lvl) * 330} f={f} hue={pal.l} w={22} />
        <G x={540} y={1520} s={0.85}>
          <Glass id="vmg" hue={pal.l} f={f} level={lvl} crack={1} branches={0.15} leak={0.7} />
        </G>
      </Layer>
      {[
        [230, 870, -8, c[0]],
        [850, 870, 8, c[1]],
        [215, 1225, 6, c[2]],
        [865, 1225, -6, c[3]],
      ].map(([x, y, r, a], k) =>
        f < a - 1 ? null : (
          <Tilt key={k} x={x} y={y + float(f, k, 6)} w={320} h={240} rz={r} ry={x < 540 ? 14 : -14} s={ip(f, [a - 1, a + 9], [0.6, 1], BACK)} o={ip(f, [a - 1, a + 4], [0, 1])}>
            <g filter={`url(#${id}-glow)`}>
              <Card w={280} h={200} fill={fill} edge={edge}>
                {k === 0 && (
                  <g transform="translate(0 -6) scale(0.32)">
                    <Clock id={id} r={230} t={f * 24} />
                  </g>
                )}
                {k === 1 && (
                  <>
                    <Label y={-30} size={28} fill={alpha(ink, 0.7)}>
                      cuenta
                    </Label>
                    <Label y={40} size={58} fill={ink} display>
                      {`$${money.toLocaleString("es-ES")}`}
                    </Label>
                  </>
                )}
                {k === 2 && (
                  <>
                    <g transform="translate(-70 -10) scale(1.1)">
                      <Person fill={ink} />
                    </g>
                    <g transform="translate(40 30)">
                      <Label y={0} size={56} fill={ink} display>
                        {`${fol.toFixed(1).replace(".", ",")}K`}
                      </Label>
                    </g>
                  </>
                )}
                {k === 3 &&
                  [0, 1, 2].map((r2) => {
                    const done = ip(f, [a + 6 + r2 * 6, a + 10 + r2 * 6], [0, 1]);
                    return (
                      <g key={r2} transform={`translate(-100 ${-52 + r2 * 52})`}>
                        <rect x={-18} y={-18} width={36} height={36} rx={8} fill="none" stroke={ink} strokeWidth={4} />
                        <path d="M-10 0 L-2 9 L13 -10" stroke={ink} strokeWidth={6} fill="none" strokeDasharray={40} strokeDashoffset={40 * (1 - done)} strokeLinecap="round" />
                        <rect x={36} y={-7} width={150} height={14} rx={7} fill={ink} opacity={0.55} />
                      </g>
                    );
                  })}
              </Card>
            </g>
          </Tilt>
        ),
      )}
    </Shell>
  );
};

// 7 · Y cuando tachas una, ya tienes otra esperando. Y funciona, mientras no dejes de echar
const Tachas: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vt";
  const ink = mix(pal.l, "#ffffff", 0.3);
  const strike = ip(f, [at(81, from), at(81, from) + 8], [0, 1], INOUT);
  const rows = 3 + Math.floor(ip(f, [at(83, from), at(86, from) + 20], [0, 3]));
  const scroll = ip(f, [at(83, from), at(86, from) + 26], [0, 3], INOUT);
  const lvl = 0.86 + Math.sin(f / 10) * 0.03;
  const thick = ip(f, [at(93, from) - 2, at(93, from) + 6], [16, 30]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1010} w={700} h={560} rx={10} ry={-8} s={ip(f, [0, 10], [0.9, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Card w={620} h={470} fill={mix(pal.m, "#000000", 0.4)} edge={alpha(pal.l, 0.4)} />
        </g>
        <clipPath id={`${id}-clip`}>
          <rect x={-300} y={-220} width={600} height={440} rx={24} />
        </clipPath>
        <g clipPath={`url(#${id}-clip)`}>
          {Array.from({ length: rows }, (_, r) => {
            const y = -150 + (r - scroll) * 100;
            const isFirst = r === 0;
            const appear = r < 3 ? 1 : ip(f, [at(83, from) + (r - 3) * 9, at(83, from) + (r - 3) * 9 + 8], [0, 1]);
            return (
              <g key={r} transform={`translate(0 ${y + (1 - appear) * 40})`} opacity={appear}>
                <rect x={-250} y={-22} width={44} height={44} rx={10} fill="none" stroke={ink} strokeWidth={5} />
                {isFirst && <path d="M-240 0 L-230 12 L-212 -12" stroke={ink} strokeWidth={7} fill="none" strokeDasharray={50} strokeDashoffset={50 * (1 - strike)} strokeLinecap="round" />}
                <rect x={-180} y={-9} width={260 + ((r * 37) % 120)} height={18} rx={9} fill={ink} opacity={isFirst ? 0.35 : 0.65} />
                {isFirst && <line x1={-190} y1={0} x2={-190 + strike * (290 + 0)} y2={0} stroke={ink} strokeWidth={6} strokeLinecap="round" />}
              </g>
            );
          })}
        </g>
      </Tilt>
      <Layer>
        <Pour id={id} x={540} y0={-40} y1={1560 - 230 * 0.72} f={f} hue={pal.l} w={thick} o={ip(f, [at(87, from) - 4, at(87, from)], [0, 1])} />
        <G x={540} y={1580} s={0.72}>
          <Glass id="vtg" hue={pal.l} f={f} level={lvl} crack={1} branches={0.15} leak={0.5} glow={1 + ip(f, [at(88, from), at(88, from) + 8], [0, 0.7]) * ip(f, [at(89, from), at(89, from) + 10], [1, 0.3])} />
        </G>
      </Layer>
    </Shell>
  );
};

// Posición del vaso sostenido sobre la cabeza
const ATLAS = { x: 540, y: 1760, s: 1.1 };
const handsY = ATLAS.y - 690 * ATLAS.s;
const GS = 0.5;
const glassY = handsY - 232 * GS + 14;

// 8 · La grieta no se cierra, crece. Cuanto más echas, más se escapa, y más pesa cargarlo todo solo
const Grieta: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vg";
  const pull = ip(f, [at(107, from), at(107, from) + 16], [0, 1], INOUT);
  const branches = ip(f, [at(100, from), at(100, from) + 16], [0, 1], OUT2);
  const leak = ip(f, [at(104, from), at(104, from) + 6], [0, 1]);
  const shake = ip(f, [at(109, from), at(112, from)], [0, 1]) * Math.sin(f * 1.9) * 5;
  const pulseC = 0.75 + Math.sin(f / 3) * 0.25 * ip(f, [at(97, from), at(99, from)], [0, 1]);
  const gx = 540;
  const gy = interpolate(pull, [0, 1], [1260, glassY]) + shake;
  const gs = interpolate(pull, [0, 1], [1.25, GS]);
  const pose = { ...POSES.lift, l: [-158 + shake, -690 + shake] as [number, number], r: [158 - shake, -690 - shake] as [number, number] };
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g opacity={pull}>
          <Figure id={id} pal={pal} x={ATLAS.x} y={ATLAS.y} s={ATLAS.s} pose={pose} />
        </g>
        <G x={gx} y={gy} s={gs}>
          <g opacity={pulseC + 0.25}>
            <Glass id="vgg" hue={pal.l} f={f} level={0.55 - leak * 0.15} crack={1} branches={branches} leak={leak} />
          </g>
        </G>
      </Layer>
    </Shell>
  );
};

// 9 · Porque cada caída depende únicamente de ti
const Caida: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vd";
  const ring = ip(f, [at(117, from), at(119, from) + 4], [0, 1], INOUT);
  const C = 2 * Math.PI * 300;
  return (
    <Shell id={id} pal={pal} f={f} dur={dur} push={[1.08, 1]}>
      <Layer>
        <ellipse cx={540} cy={1770} rx={300} ry={44} fill={pal.l} opacity={0.22} filter={`url(#${id}-glow)`} />
        <Figure id={id} pal={pal} x={ATLAS.x} y={ATLAS.y} s={ATLAS.s} pose={POSES.lift} />
        <G x={540} y={glassY} s={GS}>
          <Glass id="vdg" hue={pal.l} f={f} level={0.4} crack={1} branches={1} leak={0.8} />
        </G>
        <ellipse cx={540} cy={1440} rx={300 * (0.6 + ring * 0.4)} ry={300 * (0.6 + ring * 0.4) * 1.35} fill="none" stroke={mix(pal.l, "#ffffff", 0.3)} strokeWidth={4} strokeDasharray={C * 1.2} strokeDashoffset={C * 1.2 * (1 - ring)} opacity={ring} filter={`url(#${id}-glow)`} />
        {[0, 1, 2].map((k) => {
          const y = ((f * 9 + k * 160) % 480) + 700;
          return <path key={k} d={`M${180 + k * 360} ${y} l0 80 m-22 -22 l22 22 l22 -22`} stroke={pal.l} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.4} />;
        })}
      </Layer>
    </Shell>
  );
};

// 10 · Un mal mes lo sientes como el fin del mundo
const Mes: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vs";
  const ink = mix(pal.l, "#ffffff", 0.3);
  const draw = ip(f, [4, at(126, from) + 4], [0, 1], INOUT);
  const crash = at(126, from);
  const pts = "M-280 60 L-200 10 L-130 40 L-60 -50 L10 -10 L80 -110 L120 -60 L170 120 L260 210";
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1180} w={820} h={640} rx={12} ry={-10} rz={-2} s={ip(f, [0, 10], [0.9, 1], BACK)} o={ip(f, [0, 5], [0, 1])}>
        <g filter={`url(#${id}-glow)`}>
          <Card w={740} h={560} fill={mix(pal.m, "#000000", 0.45)} edge={alpha(pal.l, 0.35)} />
        </g>
        {[-150, -50, 50, 150].map((y) => (
          <line key={y} x1={-320} y1={y} x2={320} y2={y} stroke={pal.l} strokeOpacity={0.12} strokeWidth={2} />
        ))}
        <path d={pts} fill="none" stroke={ink} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - draw)} filter={`url(#${id}-glow)`} />
        <g transform="translate(260 210) rotate(62)" opacity={ip(f, [crash + 2, crash + 6], [0, 1])}>
          <path d="M-30 -24 L0 0 L-30 24" stroke={ink} strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
        <Label y={-210} size={32} fill={alpha(ink, 0.7)}>
          este mes
        </Label>
        <g transform="translate(200 -150)" style={popSvg(f, at(127, from), 8)}>
          <rect x={-90} y={-38} width={180} height={76} rx={38} fill={pal.m} stroke={ink} strokeWidth={3} />
          <Label y={20} size={52} fill={ink} display>
            −62%
          </Label>
        </g>
      </Tilt>
    </Shell>
  );
};

// 11 · Una crítica te quita el sueño
const Critica: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vk";
  const ink = mix(pal.m, "#000000", 0.45);
  const zz = ip(f, [at(135, from), at(135, from) + 10], [1, 0]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <G x={830} y={760 + float(f, 1, 8)} s={1.1}>
          <g filter={`url(#${id}-glow)`}>
            <Moon fill={mix(pal.l, "#ffffff", 0.3)} />
          </g>
        </G>
        {["z", "z", "Z"].map((z, k) => (
          <text key={k} x={700 + k * 44} y={900 - k * 40 - f * 0.6} fontFamily={DISPLAY} fontStyle="italic" fontWeight={900} fontSize={44 + k * 12} fill={pal.l} opacity={zz * 0.8}>
            {z}
          </text>
        ))}
        <G x={540} y={1360 + float(f, 2, 6)} s={1.25}>
          <g style={popSvg(f, at(131, from) - 2)} filter={`url(#${id}-glow)`}>
            <Bubble id={id} w={520} h={190}>
              <text x={-210} y={-12} fontFamily={SANS} fontWeight={700} fontSize={34} fill={ink}>
                @alguien
              </text>
              <text x={-210} y={42} fontFamily={SANS} fontWeight={600} fontSize={40} fill={ink}>
                Nunca vas a lograrlo.
              </text>
            </Bubble>
          </g>
        </G>
      </Layer>
      <Tilt x={250} y={1700} w={320} h={320} rx={20} ry={18} blur={4} o={0.75}>
        <Clock id={id} r={130} t={187} />
      </Tilt>
    </Shell>
  );
};

// 12 · Un silencio de alguien te hunde
const Silencio: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vn";
  const ink = mix(pal.m, "#000000", 0.4);
  const typing = f > at(137, from) && f < at(139, from) + 4;
  const sink = ip(f, [at(140, from), dur], [0, 1], Easing.in(Easing.quad));
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Tilt x={540} y={1240 + sink * 260} w={600} h={960} ry={10} rx={6} s={ip(f, [0, 9], [0.88, 1], BACK)} o={ip(f, [0, 5], [0, 1]) * (1 - sink * 0.5)}>
        <g filter={`url(#${id}-glow)`}>
          <Phone id={id} w={400} h={800}>
            <rect x={-170} y={-370} width={340} height={740} rx={30} fill={mix(pal.m, "#000000", 0.55)} />
            <g transform="translate(40 -200)">
              <rect x={-110} y={-40} width={240} height={80} rx={30} fill={mix(pal.l, "#ffffff", 0.2)} />
              <text x={-88} y={13} fontFamily={SANS} fontWeight={600} fontSize={34} fill={ink}>
                ¿Hablamos?
              </text>
              <text x={60} y={74} fontFamily={SANS} fontWeight={500} fontSize={22} fill={pal.l} opacity={ip(f, [at(136, from), at(136, from) + 6], [0, 0.9])}>
                Visto
              </text>
            </g>
            <g transform="translate(-110 -60)" opacity={typing ? 1 : 0}>
              <rect x={-50} y={-30} width={110} height={60} rx={30} fill={mix(pal.m, "#000000", 0.2)} />
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={-20 + k * 22} cy={0} r={8} fill={pal.l} opacity={0.4 + 0.6 * Math.max(0, Math.sin(f / 3 - k))} />
              ))}
            </g>
          </Phone>
        </g>
      </Tilt>
    </Shell>
  );
};

// 13 · No puedes sostenerlo más… Era el vaso
const Rompe: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vr";
  const slip = at(149, from);
  const hit = at(161, from);
  const p = ip(f, [slip, hit], [0, 1], Easing.in(Easing.cubic));
  const shake = ip(f, [0, slip], [0.5, 1.2]) * (f < slip ? Math.sin(f * 2.1) * 7 : 0);
  const armsDown = ip(f, [slip + 2, slip + 16], [0, 1], INOUT);
  const pose = lerpPose({ ...POSES.lift, l: [-158 + shake, -690 + shake], r: [158 - shake, -690 - shake] }, POSES.stand, armsDown);
  const floorY = 1650 - 232 * 0.62;
  const gy = interpolate(p, [0, 1], [glassY, floorY]);
  const gs = interpolate(p, [0, 1], [GS, 0.62]);
  const shatter = ip(f, [hit, hit + 50], [0, 1], Easing.out(Easing.cubic));
  const impact = ip(f, [hit, hit + 2], [0, 1]) * ip(f, [hit + 2, hit + 14], [1, 0]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <Layer>
        <g opacity={ip(f, [hit - 30, hit], [1, 0.25])}>
          <Figure id={id} pal={pal} x={ATLAS.x} y={ATLAS.y} s={ATLAS.s} pose={pose} />
        </g>
        <G x={540 + p * 30} y={gy} s={gs} rot={p * 32 * (1 - shatter)}>
          <Glass id="vrg" hue={pal.l} f={f} level={0.3 * (1 - shatter)} crack={1} branches={1} leak={f < hit ? 0.6 : 0} shatter={shatter} />
          {f >= hit && f < hit + 36 && (
            <g transform="translate(0 40)">
              <Splash t={ip(f, [hit, hit + 36], [0, 1])} hue={pal.l} />
            </g>
          )}
        </G>
      </Layer>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 30% at 50% 82%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)`, opacity: impact * 0.7, mixBlendMode: "screen" }} />
    </Shell>
  );
};

// Fragmentos del vaso roto en el suelo
const FLOOR = { x: 540, y: 1470, s: 0.95 };

// 14 · Un vaso roto no se arregla echándole más agua. Se arregla volviendo a las manos que lo hicieron
const Manos: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vh";
  const pourA = at(166, from);
  const pourO = ip(f, [pourA - 4, pourA + 2], [0, 1]) * ip(f, [at(170, from), at(170, from) + 8], [1, 0]);
  const puddle = ip(f, [pourA + 6, at(170, from) + 10], [0, 1]);
  const handsA = at(175, from);
  const rise = ip(f, [handsA - 8, handsA + 14], [0, 1], Easing.out(Easing.cubic));
  const beam = 1 + ip(f, [at(172, from), at(175, from)], [0, 0.6]);
  const hy = 2150 - rise * 470;
  const skin = mix(pal.l, "#ffffff", 0.15);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 35% 60% at 50% 0%, ${alpha(pal.l, 0.25 * (beam - 1) * 1.6)}, rgba(0,0,0,0) 100%)` }} />
      <Layer>
        <ellipse cx={540} cy={1660} rx={60 + puddle * 330} ry={10 + puddle * 34} fill={pal.l} opacity={0.3 * puddle} />
        <Pour id={id} x={540} y0={-40} y1={FLOOR.y - 60} f={f} hue={pal.l} w={20} o={pourO} />
        {pourO > 0.05 && (
          <g transform={`translate(540 ${FLOOR.y + 30}) scale(0.55)`}>
            <Splash t={(f % 18) / 18} hue={pal.l} />
          </g>
        )}
        <G x={FLOOR.x} y={FLOOR.y + Math.sin(f / 20) * 4} s={FLOOR.s}>
          <Glass id="vhg" hue={pal.l} f={f} shatter={0.42} />
        </G>
        <g transform={`translate(540 ${hy})`} filter={`url(#${id}-glow)`} opacity={rise}>
          <CuppedHands fill={skin} stroke={alpha(pal.m, 0.6)} />
        </g>
      </Layer>
    </Shell>
  );
};

// 15 · Eso hace Dios. No te llena más rápido: te rehace, para que lo que entra ya no se pierda
const Rehace: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vq";
  const godA = at(181, from);
  const beam = ip(f, [godA - 4, godA + 6], [0, 1]) * ip(f, [godA + 6, godA + 40], [1, 0.45]);
  const re = at(188, from);
  const shatter = ip(f, [re - 6, re + 22], [0.42, 0], INOUT);
  const seams = ip(f, [re + 10, re + 22], [0, 1]) * ip(f, [re + 40, dur], [1, 0.55]);
  const fillA = at(190, from);
  const level = ip(f, [fillA, at(197, from) + 6], [0, 0.85], INOUT);
  const pourO = ip(f, [fillA - 4, fillA], [0, 1]) * ip(f, [at(197, from) + 2, at(197, from) + 10], [1, 0]);
  const spin = f * 4;
  const skin = mix(pal.l, "#ffffff", 0.15);
  const gy = interpolate(shatter, [0, 0.42], [1420, FLOOR.y]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 30% 70% at 50% 0%, ${alpha(pal.l, 0.4 * beam)}, rgba(0,0,0,0) 100%)` }} />
      <Layer>
        {/* torno */}
        <g transform="translate(540 1700)">
          <ellipse rx={360} ry={64} fill={mix(pal.m, "#000000", 0.4)} stroke={alpha(pal.l, 0.5)} strokeWidth={3} />
          {Array.from({ length: 16 }, (_, k) => {
            const a = ((k * 22.5 + spin) * Math.PI) / 180;
            return <line key={k} x1={Math.cos(a) * 300} y1={Math.sin(a) * 52} x2={Math.cos(a) * 340} y2={Math.sin(a) * 60} stroke={pal.l} strokeWidth={3} opacity={0.25 + 0.4 * Math.max(0, Math.sin(a))} />;
          })}
        </g>
        <Pour id={id} x={540} y0={-40} y1={gy - 230 * 0.95 + (1 - level) * 380} f={f} hue={pal.l} o={pourO} />
        <G x={540} y={gy} s={0.95}>
          <Glass id="vqg" hue={pal.l} f={f} shatter={shatter} seams={seams} level={level} glow={1 + beam * 0.4} />
        </G>
        <g transform="translate(540 1610)" filter={`url(#${id}-glow)`} opacity={0.9}>
          <CuppedHands fill={skin} stroke={alpha(pal.m, 0.6)} />
        </g>
      </Layer>
    </Shell>
  );
};

// 16 · Te quita el peso de sostenerlo todo… paz para descansar sin sentirte culpable
const Paz: React.FC<P> = ({ f, dur, from, pal }) => {
  const id = "vz";
  const free = ip(f, [at(199, from), at(201, from) + 10], [0, 1], INOUT);
  const pose = lerpPose(POSES.lift, POSES.stand, free);
  const orbY = 1720 - 690 * 1.1 - 120 - free * 260;
  const pazA = at(215, from);
  const bloom = ip(f, [pazA - 2, pazA + 24], [0, 1], Easing.out(Easing.cubic));
  const coins = ip(f, [at(211, from) - 2, at(211, from) + 6], [0, 1]) * ip(f, [at(213, from), at(214, from) + 8], [1, 0]);
  return (
    <Shell id={id} pal={pal} f={f} dur={dur}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 35% 70%, ${alpha(pal.l, 0.3 * bloom)}, rgba(0,0,0,0) ${30 + bloom * 30}%)` }} />
      <Layer>
        <circle cx={330} cy={orbY} r={130} fill={mix(pal.m, "#000000", 0.6)} stroke={alpha(pal.l, 0.4)} strokeWidth={4} opacity={1 - free} style={{ filter: `blur(${free * 18}px)` }} />
        <Figure id={id} pal={pal} x={330} y={1720} s={1.1} pose={{ ...pose, lean: -free * 3 }} />
        <G x={790} y={1500} s={0.72}>
          <Glass id="vzg" hue={pal.l} f={f} level={0.85} seams={0.45} glow={1.2 + bloom * 0.5} />
        </G>
        {[0, 1, 2].map((k) => (
          <G key={k} x={700 + k * 120} y={880 + k * 50 + float(f, k, 8)} s={0.55} style={{ opacity: coins * 0.8, filter: `blur(${k * 2}px)` }}>
            <Coin fill={`url(#${id}-obj)`} dark={mix(pal.m, "#000000", 0.5)} />
          </G>
        ))}
      </Layer>
    </Shell>
  );
};

// 17 · Así que antes de buscar tu próximo logro, pregúntate esto → vuelve al gancho
const Cierre: React.FC<P> = ({ f, dur, from, pal }) => {
  const a = at(228, from);
  const tro = ip(f, [a - 2, a + 10], [0, 1], BACK) * ip(f, [dur - 26, dur - 8], [1, 0]);
  return (
    <Shell id="vc" pal={pal} f={f} dur={dur} push={[1.05, 1]} exit={false}>
      <FieldObjects gf={from + f} pal={pal} id="vc" />
      <Layer>
        <G x={540} y={1330} s={0.6 + tro * 0.6} style={{ opacity: tro }}>
          <g filter="url(#vc-glow)">
            <Trophy fill="url(#vc-obj)" dark={mix(pal.m, "#000000", 0.5)} />
          </g>
        </G>
      </Layer>
    </Shell>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  campo: Campo,
  vaso: Vaso,
  llenar: Llenar,
  foto: Foto,
  vacio: Vacio,
  mas: Mas,
  tachas: Tachas,
  grieta: Grieta,
  caida: Caida,
  mes: Mes,
  critica: Critica,
  silencio: Silencio,
  rompe: Rompe,
  manos: Manos,
  rehace: Rehace,
  paz: Paz,
  cierre: Cierre,
};
