import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/judas/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, BagG, Brush, CoinG, Defs, Draw, Paper, TagG } from "./Dark";

// ZK Dark · Judas completo. Identidad fija (negro, línea blanca, pincel rojo) y un tipo de plano distinto cada 2–3 s.
const GAP_AT = 32.2, GAP = 0.5; // silencio antes del giro
const sh = (x: number) => (x >= GAP_AT ? x + GAP : x);
const END = 56.2;
export const JUDASDARK_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: sh(c.timestamp[0]), e: sh(c.timestamp[1] ?? c.timestamp[0] + 0.3) }));
const KEYS = new Set(["judas", "30", "plata", "fortuna", "tiro", "14", "420", "puño", "denario", "4", "meses", "éxodo", "buey", "esclavo", "dios", "templo", "sangre", "mucho", "poco", "asusta", "precio"]);
const RED = "#D30F17";
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const W = 1080, H = 1920;
const useT = (t0: number) => { const f = useCurrentFrame(); return { f, t: t0 + f / FPS }; };
const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <svg width={W} height={H} style={{ position: "absolute", inset: 0, ...style }}>{children}</svg>;
const Serif: React.FC<{ txt: string; y: number; size: number; o?: number; color?: string; ls?: number }> = ({ txt, y, size, o = 1, color = "#F2F2F2", ls = 4 }) => (
  <text x={540} y={y} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={size} fill={color} letterSpacing={ls} opacity={o} filter="url(#ink)">{txt}</text>
);
// fondo rojo pintado a brochazos (para las siluetas)
const RedPaint: React.FC<{ p: number }> = ({ p }) => (
  <Svg>{Array.from({ length: 13 }, (_, i) => { const y = 120 + i * 140 + (random(`rp${i}`) - 0.5) * 60; const dy = (random(`rq${i}`) - 0.5) * 120; return <Brush key={i} d={i % 2 ? `M1300 ${y + dy} L-220 ${y - dy}` : `M-220 ${y - dy} L1300 ${y + dy}`} p={ip(p, [i * 0.04, 0.4 + i * 0.04], [0, 1])} w={240 + random(`rw${i}`) * 80} len={1560} />; })}</Svg>
);
// silueta encapuchada (Judas)
const Hooded: React.FC<{ x: number; y: number; s: number; color?: string; tilt?: number }> = ({ x, y, s, color = "#050505", tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`}>
    <path d="M-60 -420 Q0 -470 60 -420 Q100 -340 90 -250 Q180 -200 210 0 L230 400 L-230 400 L-210 0 Q-180 -200 -90 -250 Q-100 -340 -60 -420 Z" fill={color} />
  </g>
);

// ---------- escenas ----------
// 1 · tipografía + grabado: la bolsa, las monedas y el "30" pintado
const C1: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const bag = eo(ip(t, [0, 1.6], [0, 1]));
  const n30 = eo(ip(t, [2.45, 3.0], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 3.9], [1, 1.07])})` }}>
      <Svg>
        <Brush d="M-40 1060 Q540 960 1120 1020" p={eo(ip(t, [1.05, 1.5], [0, 1]))} w={150} len={1300} />
        <BagG p={bag} tilt={ip(t, [1.6, 2.4], [0, 18])} />
        {[0.6, 0.9, 1.2, 1.5, 1.8, 2.1].map((at, i) => { const k = ip(t, [at + 1, at + 1.6], [0, 1]); return k > 0 ? <CoinG key={i} cx={720 + k * (60 + i * 40)} cy={1100 + k * k * (520 - (i % 3) * 30)} r={58} p={ip(t, [at + 1, at + 1.5], [0, 1])} /> : null; })}
        {n30 > 0 ? <g filter="url(#brushH)"><text x={540} y={860} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={430} fill={RED} style={{ clipPath: `inset(0 ${(1 - n30) * 100}% 0 0)` }}>30</text></g> : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 2 · silueta: Judas negro contra el rojo pintado
const C2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <RedPaint p={ip(t, [3.9, 4.6], [0, 1])} />
      <Svg><Hooded x={540} y={1300} s={1.5 * ip(t, [3.9, 5.7], [1, 1.06])} /></Svg>
    </AbsoluteFill>
  );
};
// 3 · macro: la moneda gigante con su inscripción y la pluma que la dibuja
const C3: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const p = ip(t, [5.7, 7.4], [0, 1]);
  const a = -Math.PI / 2 + p * Math.PI * 2;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [5.7, 9.9], [1.15, 1.3])})`, transformOrigin: "540px 900px" }}>
      <Svg>
        <CoinG cx={540} cy={900} r={420} p={p} />
        {p < 1 ? <g transform={`translate(${540 + Math.cos(a) * 420} ${900 + Math.sin(a) * 420}) rotate(${(a * 180) / Math.PI + 140})`}><path d="M0 0 L-22 -130 L22 -130 Z" fill="#F2F2F2" /><line x1={0} y1={-130} x2={0} y2={-420} stroke="#F2F2F2" strokeWidth={10} /></g> : null}
        <Serif txt="SICLO DE TIRO" y={1480} size={78} o={ip(t, [6.5, 6.9], [0, 1])} />
        {t >= 8.0 ? <><Brush d="M330 1600 L750 1600" p={eo(ip(t, [8.0, 8.3], [0, 1]))} w={70} len={440} /><Serif txt="14 GRAMOS" y={1625} size={70} /></> : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 4 · dato: balanza de tinta, monedas que se apilan, 420 g
const C4: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const n = Math.min(30, Math.floor(ip(t, [9.9, 11.6], [0, 30])));
  const tilt = (n / 30) * 10;
  const a = (tilt * Math.PI) / 180;
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          <Draw d="M540 1500 L540 760" p={ip(t, [9.9, 10.4], [0, 1])} w={8} len={760} />
          <Draw d="M440 1500 L640 1500" p={ip(t, [9.9, 10.3], [0, 1])} w={8} len={220} />
          <line x1={540 - Math.cos(a) * 330} y1={760 - Math.sin(a) * 330} x2={540 + Math.cos(a) * 330} y2={760 + Math.sin(a) * 330} stroke="#F2F2F2" strokeWidth={8} opacity={ip(t, [10.2, 10.5], [0, 1])} />
          {[-1, 1].map((sd) => { const px = 540 + sd * Math.cos(a) * 330, py = 760 + sd * Math.sin(a) * 330; return <g key={sd} opacity={ip(t, [10.3, 10.6], [0, 1])}><line x1={px} y1={py} x2={px - 110} y2={py + 220} stroke="#F2F2F2" strokeWidth={4} /><line x1={px} y1={py} x2={px + 110} y2={py + 220} stroke="#F2F2F2" strokeWidth={4} /><path d={`M${px - 140} ${py + 220} Q${px} ${py + 290} ${px + 140} ${py + 220} Z`} fill="url(#h1)" stroke="#F2F2F2" strokeWidth={5} /></g>; })}
        </g>
        {Array.from({ length: n }, (_, i) => { const px = 540 + Math.cos(a) * 330, py = 760 + Math.sin(a) * 330; return <CoinG key={i} cx={px - 90 + (i % 6) * 36} cy={py + 205 - Math.floor(i / 6) * 22} r={24} p={1} />; })}
        {t >= 11.3 ? <><Serif txt="420 g" y={560} size={210} o={ip(t, [11.3, 11.5], [0, 1])} /><Brush d="M300 610 L780 610" p={eo(ip(t, [11.4, 11.7], [0, 1]))} w={40} len={500} /></> : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 5 · macro: el puño que se cierra (los dedos giran sobre los nudillos)
const C5: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const c = eo(ip(t, [13.3, 14.1], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [13.1, 14.5], [1.05, 1.2])})`, transformOrigin: "540px 1000px" }}>
      <Svg>
        {Array.from({ length: 7 }, (_, i) => <CoinG key={i} cx={380 + i * 54} cy={1000 - (i % 2) * 14} r={40} p={1} />)}
        <g filter="url(#ink)" transform="translate(540 1040)">
          <path d="M-280 0 Q-300 330 -40 380 Q240 380 290 120 L280 0 Z" fill="#050505" />
          <path d="M-280 0 Q-300 330 -40 380 Q240 380 290 120 L280 0 Z" fill="url(#h2)" opacity={0.55} />
          <path d="M-280 0 Q-300 330 -40 380 Q240 380 290 120 L280 0" fill="none" stroke="#F2F2F2" strokeWidth={8} />
          {[-210, -70, 70, 210].map((x, i) => (
            <g key={i} transform={`rotate(${ip(c, [0, 1], [-8 + i * 4, 165])} ${x} 0)`}>
              <rect x={x - 62} y={-250 + i * 12 * (1 - c)} width={124} height={250 - i * 12 * (1 - c)} rx={60} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
              <path d={`M${x - 40} -170 Q${x} -150 ${x + 40} -170 M${x - 40} -90 Q${x} -70 ${x + 40} -90`} stroke="#F2F2F2" strokeWidth={3} fill="none" />
            </g>
          ))}
          <g transform={`rotate(${ip(c, [0, 1], [-50, 25])} -280 140)`}><rect x={-420} y={90} width={220} height={110} rx={55} fill="#050505" stroke="#F2F2F2" strokeWidth={7} /></g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
// 6 · grabado: el campo, el sol y el jornalero
const C6: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const p = ip(t, [14.5, 15.6], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `translateX(${ip(t, [14.5, 17.9], [30, -30])}px)` }}>
      <Svg>
        <g filter="url(#ink)">
          <Draw d="M60 1180 L1020 1180" p={p} w={5} len={960} />
          <circle cx={540} cy={760} r={150} fill="url(#h1)" opacity={p * 0.8} />
          <Draw d="M690 760 A150 150 0 1 1 689.9 759.5" p={p} w={6} len={950} />
          {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <Draw key={i} d={`M${540 + Math.cos(a) * 190} ${760 + Math.sin(a) * 190} L${540 + Math.cos(a) * 260} ${760 + Math.sin(a) * 260}`} p={ip(t, [15.0 + i * 0.03, 15.4 + i * 0.03], [0, 1])} w={4} len={80} />; })}
          {Array.from({ length: 24 }, (_, i) => <Draw key={`w${i}`} d={`M${70 + i * 40} 1180 Q${70 + i * 40 + Math.sin(f / 10 + i) * 8} 1100 ${80 + i * 40} 1040`} p={ip(t, [15.0, 15.8], [0, 1])} w={3} len={160} />)}
        </g>
        <Hooded x={540} y={1180} s={0.55} color="#050505" />
        <g transform="translate(540 1180) scale(0.55)"><path d="M-60 -420 Q0 -470 60 -420 Q100 -340 90 -250 Q180 -200 210 0 L230 400 L-230 400 L-210 0 Q-180 -200 -90 -250 Q-100 -340 -60 -420 Z" fill="none" stroke="#F2F2F2" strokeWidth={9} /></g>
        <Serif txt="1 DENARIO = 1 DÍA" y={1540} size={72} o={ip(t, [16.8, 17.1], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 7 · dato: el siclo se parte en cuatro denarios
const C7: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const sp = eo(ip(t, [19.6, 20.2], [0, 1]));
  return (
    <AbsoluteFill>
      <Svg>
        {sp < 0.02 ? <CoinG cx={540} cy={900} r={260} p={ip(t, [17.9, 18.8], [0, 1])} /> : [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <CoinG key={i} cx={540 + a * 230 * sp} cy={900 + b * 230 * sp} r={260 - 140 * sp} p={1} />)}
        <Serif txt="= 4 DENARIOS" y={1540} size={92} o={ip(t, [20.0, 20.3], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 8 · tipografía: 4 MESES gigante con el calendario tachado
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <Svg>
        <g opacity={0.35} filter="url(#ink)">{Array.from({ length: 35 }, (_, i) => <rect key={i} x={140 + (i % 7) * 116} y={560 + Math.floor(i / 7) * 116} width={100} height={100} fill="none" stroke="#F2F2F2" strokeWidth={3} />)}</g>
        <Brush d="M110 640 L970 1100" p={eo(ip(t, [21.4, 21.8], [0, 1]))} w={90} len={980} />
        <Serif txt="4" y={1020} size={560} o={ip(t, [21.7, 21.85], [0, 1])} ls={0} />
        <Serif txt="MESES" y={1320} size={200} o={ip(t, [22.0, 22.2], [0, 1])} ls={20} />
      </Svg>
    </AbsoluteFill>
  );
};
// 9 · grabado: el rollo de la ley; la sombra del buey asoma (pregunta abierta)
const C9: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const u = eo(ip(t, [23.3, 24.4], [0, 1]));
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          <rect x={160} y={960 - 400 * u} width={760} height={800 * u} fill="url(#h2)" opacity={0.18} />
          <rect x={160} y={960 - 400 * u} width={760} height={800 * u} fill="none" stroke="#F2F2F2" strokeWidth={6} />
          {[-1, 1].map((sd) => <rect key={sd} x={120} y={960 + sd * 400 * u - 26} width={840} height={52} rx={26} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />)}
        </g>
        {u > 0.9 ? <>
          <Serif txt={t >= 25.4 ? "ÉXODO 21:32" : "LEY DE MOISÉS"} y={720} size={76} />
          {["Si el buey acorneare", "a un siervo o a una sierva,", "pagará su dueño"].map((l, i) => <Serif key={i} txt={l} y={850 + i * 80} size={46} ls={1} o={ip(t, [25.8 + i * 0.25, 26.1 + i * 0.25], [0, 1])} />)}
          {t >= 26.8 ? <Brush d="M230 1110 L850 1110" p={eo(ip(t, [26.8, 27.3], [0, 1]))} w={64} len={640} /> : null}
          <Serif txt="treinta siclos de plata" y={1130} size={54} o={ip(t, [26.6, 26.9], [0, 1])} ls={1} />
        </> : null}
        <path d="M-40 1820 Q120 1640 320 1680 Q420 1600 520 1660 L560 1920 L-40 1920 Z" fill="#141414" opacity={ip(t, [25.0, 27.0], [0, 1])} transform={`translate(${ip(t, [25, 27.9], [-200, 0])} 0)`} />
      </Svg>
    </AbsoluteFill>
  );
};
// 10 · silueta: el buey y la cadena contra el rojo
const C10: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const walk = ip(t, [27.9, 29.4], [-600, 0]);
  const leg = walk < -5 ? Math.sin(f / 3) * 14 : 0;
  return (
    <AbsoluteFill>
      <RedPaint p={ip(t, [27.9, 28.5], [0, 1])} />
      <Svg>
        <g transform={`translate(${540 + walk} 1150)`} fill="#050505">
          {[-180, -90, 90, 180].map((x, i) => <rect key={i} x={x - 24} y={60} width={48} height={200} rx={12} transform={`rotate(${i % 2 ? leg : -leg} ${x} 60)`} />)}
          <path d="M-300 20 Q-320 -120 -200 -140 Q-40 -160 120 -200 Q200 -230 250 -170 Q300 -130 330 -60 Q350 0 300 60 Q220 150 60 150 L-200 150 Q-300 140 -300 20 Z" />
          <path d="M260 -150 Q360 -140 420 -60 Q460 10 430 90 Q400 130 360 110 Q330 60 300 40 Z" />
          <path d="M380 -100 Q440 -190 500 -170 Q470 -140 430 -90 M320 -130 Q300 -210 250 -230" stroke="#050505" strokeWidth={20} fill="none" strokeLinecap="round" />
          <path d="M-300 10 Q-360 60 -340 180" stroke="#050505" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
        {t >= 29.1 ? <g opacity={ip(t, [29.1, 29.4], [0, 1])}>{Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={100 + i * 92} cy={1560} rx={44} ry={26} fill="none" stroke="#050505" strokeWidth={14} />)}</g> : null}
        {t >= 30.8 ? <g transform={`translate(0 ${ip(t, [30.8, 31.1], [-200, 0])})`}><rect x={330} y={520} width={420} height={150} fill="#050505" /><text x={540} y={622} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={72} fill="#F2F2F2">30 SICLOS</text></g> : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 11 · silencio en negro (0,5 s)
const C11: React.FC<{ t0: number }> = () => <AbsoluteFill style={{ background: "#000" }} />;
// 12 · plano negativo: fondo blanco y sello negro
const C12: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const hit = t >= sh(33.3);
  return (
    <AbsoluteFill style={{ background: "#F2EFE8" }}>
      <Svg style={{ filter: "invert(1)" }}><TagG p={ip(t, [32.7, 33.4], [0, 1])} sw={Math.sin(f / 9) * 4} /></Svg>
      {hit ? <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", transform: `rotate(-6deg) scale(${ip(t, [sh(33.3), sh(33.3) + 0.1], [1.4, 1])})` }}><span style={{ display: "inline-block", padding: "16px 36px", border: "12px solid #0A0A0A", color: "#0A0A0A", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 80, whiteSpace: "nowrap" }}>PRECIO DE UN ESCLAVO</span></div> : null}
    </AbsoluteFill>
  );
};
// 13 · la cruz roja pintada sobre las 30 monedas (cámara lenta)
const C13: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [sh(34.5), sh(37.5)], [1, 1.06])})` }}>
      <Svg>
        {Array.from({ length: 8 }, (_, i) => <CoinG key={i} cx={i % 2 ? 830 : 250} cy={960 + Math.floor(i / 2) * 210} r={96} p={ip(t, [sh(34.5) + i * 0.06, sh(35.2) + i * 0.06], [0, 1])} />)}
        <Brush d="M540 380 L540 1720" p={eo(ip(t, [sh(35.2), sh(36.2)], [0, 1]))} w={140} len={1400} v />
        <Brush d="M190 760 L890 760" p={eo(ip(t, [sh(36.2), sh(36.9)], [0, 1]))} w={130} len={760} />
      </Svg>
    </AbsoluteFill>
  );
};
// 14 · macro: el ojo de Judas
const C14: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const open = ip(t, [sh(37.5), sh(37.9)], [0.1, 1]) * ip(t, [sh(38.6), sh(38.9)], [1, 0.55]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [sh(37.5), sh(39.1)], [1, 1.15])})`, transformOrigin: "540px 960px" }}>
      <Svg>
        <g filter="url(#ink)">
          <path d={`M120 960 Q540 ${960 - 360 * open} 960 960 Q540 ${960 + 300 * open} 120 960 Z`} fill="url(#h1)" opacity={0.5} />
          <path d={`M120 960 Q540 ${960 - 360 * open} 960 960 Q540 ${960 + 300 * open} 120 960 Z`} fill="none" stroke="#F2F2F2" strokeWidth={9} />
          <circle cx={540} cy={960} r={150 * open} fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
          <circle cx={540} cy={960} r={60 * open} fill="#F2F2F2" />
          <circle cx={590} cy={910} r={20 * open} fill={RED} />
          <Draw d={`M150 ${960 - 120} Q540 ${960 - 500 * open} 930 ${960 - 120}`} p={1} w={4} />
        </g>
        <path d={`M700 ${1080 + ip(t, [sh(38.3), sh(39.1)], [0, 300])} q-10 30 0 40 q10 -10 0 -40`} fill="#F2F2F2" opacity={ip(t, [sh(38.3), sh(38.5)], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 15 · grabado: el templo; las monedas rebotan (lento → rápido)
const C15: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const th = t - sh(39.9);
  const tt0 = th < 0.5 ? th * 0.4 : 0.2 + (th - 0.5) * 1.4; // cámara lenta y luego rápida
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          {[150, 330, 750, 930].map((x, i) => <g key={i}><rect x={x - 50} y={300} width={100} height={950} fill="url(#h2)" opacity={0.45} /><Draw d={`M${x - 50} 1250 L${x - 50} 300 L${x + 50} 300 L${x + 50} 1250`} p={ip(t, [sh(39.1) + i * 0.08, sh(39.6) + i * 0.08], [0, 1])} w={6} len={2100} /></g>)}
          <Draw d="M60 300 L1020 300 M60 260 L1020 260" p={ip(t, [sh(39.1), sh(39.6)], [0, 1])} w={6} len={1000} />
          <Draw d="M40 1250 L1040 1250" p={1} w={6} len={1000} />
        </g>
        {Array.from({ length: 14 }, (_, i) => {
          const k = tt0 * 30 - random(`t${i}`) * 4;
          if (th < 0 || k < 0) return null;
          const vx = (random(`tx${i}`) - 0.5) * 34, vy = -24 - random(`ty${i}`) * 14;
          let x = 540 + vx * k, y = 760 + vy * k + 1.2 * k * k;
          if (y > 1200) y = 1200 - Math.abs(Math.sin((y - 1200) / 70)) * 90 * Math.exp(-k / 25);
          return <CoinG key={i} cx={x} cy={y} r={40} p={1} />;
        })}
        <Serif txt="EL TEMPLO" y={1480} size={80} o={ip(t, [sh(41.1), sh(41.3)], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 16 · silueta: las tumbas; el cielo se pinta de rojo
const C16: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <RedPaint p={ip(t, [sh(45.6), sh(46.4)], [0, 1])} />
      <Svg>
        <g filter="url(#ink)">{Array.from({ length: 9 }, (_, i) => { const k = eo(ip(t, [sh(43.0) + i * 0.1, sh(43.3) + i * 0.1], [0, 1])); return <path key={i} d={`M${110 + (i % 5) * 190 + (i > 4 ? 90 : 0) - 45} ${(i > 4 ? 1500 : 1360) + (1 - k) * 200} l0 -90 q45 -60 90 0 l0 90 Z`} fill="#050505" stroke="#F2F2F2" strokeWidth={5} opacity={k} />; })}</g>
        <g opacity={ip(t, [sh(45.5), sh(45.8)], [0, 1])}>
          <rect x={250} y={640} width={580} height={150} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
          <rect x={525} y={790} width={30} height={480} fill="#050505" />
          <text x={540} y={738} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill="#F2F2F2">CAMPO DE SANGRE</text>
        </g>
        <Serif txt="EXTRANJEROS" y={1740} size={66} o={ip(t, [sh(43.9), sh(44.2)], [0, 1])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 17 · tipografía: MUCHO tachado → MUY POCO
const C17: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill>
      <Svg>
        <Serif txt="MUCHO" y={860} size={230} o={ip(t, [sh(48.4), sh(48.6)], [0, 1])} ls={10} />
        <Brush d="M120 800 L960 800" p={eo(ip(t, [sh(49.4), sh(49.8)], [0, 1]))} w={80} len={860} />
        <Serif txt="MUY POCO" y={1240} size={170} o={ip(t, [sh(50.0), sh(50.15)], [0, 1])} color={RED} ls={6} />
      </Svg>
    </AbsoluteFill>
  );
};
// 18 · macro: el rostro en sombra, con latido
const C18: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const beat = Math.pow(Math.max(0, Math.sin(f / 7)), 8);
  return (
    <AbsoluteFill style={{ transform: `scale(${1.05 + beat * 0.03})` }}>
      <Svg>
        <g filter="url(#ink)" transform="translate(540 1100)">
          <path d="M-300 600 Q-330 -200 0 -520 Q330 -200 300 600 Z" fill="url(#h2)" opacity={0.35} />
          <path d="M-300 600 Q-330 -200 0 -520 Q330 -200 300 600" fill="none" stroke="#F2F2F2" strokeWidth={9} />
          <path d="M-170 300 Q-190 -150 0 -320 Q190 -150 170 300 Z" fill="#050505" />
          <ellipse cx={-70} cy={-40} rx={34} ry={10 * ip(t, [sh(51.0), sh(51.5)], [1, 0.4])} fill="#F2F2F2" />
          <ellipse cx={70} cy={-40} rx={34} ry={10 * ip(t, [sh(51.0), sh(51.5)], [1, 0.4])} fill="#F2F2F2" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
// 19 · el teléfono grabado: mándaselo → funde a negro (empalma con el inicio)
const C19: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const sent = t >= sh(53.6);
  return (
    <AbsoluteFill style={{ opacity: ip(t, [END - 0.5, END], [1, 0]) }}>
      <Svg>
        <g filter="url(#ink)">
          <rect x={300} y={480} width={480} height={980} rx={60} fill="#050505" stroke="#F2F2F2" strokeWidth={9} />
          <rect x={480} y={510} width={120} height={20} rx={10} fill="#F2F2F2" />
        </g>
        <g transform={`translate(0 ${sent ? 0 : 400})`} opacity={sent ? 1 : 0}>
          <rect x={360} y={700} width={360} height={190} rx={30} fill={RED} />
          <text x={540} y={780} textAnchor="middle" fontFamily="Kit Poppins" fontWeight={600} fontSize={34} fill="#fff">¿Sabías por cuánto</text>
          <text x={540} y={830} textAnchor="middle" fontFamily="Kit Poppins" fontWeight={600} fontSize={34} fill="#fff">vendió Judas a Jesús?</text>
        </g>
        <circle cx={700} cy={1380} r={44} fill={sent ? RED : "#F2F2F2"} />
      </Svg>
    </AbsoluteFill>
  );
};

type Sc = { t0: number; C: React.FC<{ t0: number }> };
const SCENES: Sc[] = [
  { t0: 0, C: C1 }, { t0: 3.9, C: C2 }, { t0: 5.7, C: C3 }, { t0: 9.9, C: C4 }, { t0: 13.1, C: C5 }, { t0: 14.5, C: C6 }, { t0: 17.9, C: C7 }, { t0: 20.7, C: C8 },
  { t0: 23.1, C: C9 }, { t0: 27.9, C: C10 }, { t0: GAP_AT, C: C11 }, { t0: GAP_AT + GAP, C: C12 }, { t0: sh(34.5), C: C13 }, { t0: sh(37.5), C: C14 },
  { t0: sh(39.1), C: C15 }, { t0: sh(41.6), C: C16 }, { t0: sh(47.1), C: C17 }, { t0: sh(50.7), C: C18 }, { t0: sh(52.3), C: C19 },
];

const SFX: [number, string, number][] = [
  [0.0, "judas/pluma.wav", 0.3], [1.05, "judas/pincel.wav", 0.35], [2.45, "judas/pincel.wav", 0.4], [3.1, "judas/monedas.wav", 0.3], [3.9, "judas/pincel.wav", 0.3],
  [5.7, "judas/pluma.wav", 0.3], [9.9, "judas/pluma.wav", 0.22], [14.5, "judas/pluma.wav", 0.22], [21.4, "judas/pincel.wav", 0.35], [21.7, "judas/golpe.wav", 0.45],
  [23.3, "judas/pluma.wav", 0.22], [27.9, "judas/pincel.wav", 0.3], [sh(33.3), "sfx/lib/cinematic-drop.mp3", 0.5], [sh(35.2), "judas/pincel.wav", 0.4],
  [sh(37.6), "judas/latido.wav", 0.4], [sh(39.9), "judas/monedas.wav", 0.4], [sh(45.6), "judas/pincel.wav", 0.35], [sh(48.4), "judas/golpe.wav", 0.4],
  [sh(49.4), "judas/pincel.wav", 0.35], [sh(50.7), "judas/latido.wav", 0.45],
];

export const JudasDark: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.93 + 0.07 * random(`fl${Math.floor(f / 2)}`);
  const inv = t >= sh(33.3) && t < sh(33.3) + 0.07; // destello invertido en el golpe
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      <AbsoluteFill style={{ opacity: flick, filter: inv ? "invert(1)" : "none" }}>
        {SCENES.map((sc, i) => {
          const end = SCENES[i + 1]?.t0 ?? END;
          return <Sequence key={i} from={S(sc.t0)} durationInFrames={S(end) - S(sc.t0)}><sc.C t0={sc.t0} /></Sequence>;
        })}
      </AbsoluteFill>
      {t < GAP_AT || t >= GAP_AT + GAP ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
      <Audio src={staticFile("judas/mezcla_dark.wav")} />
      {SFX.map(([at, n, v], i) => <Sequence key={i} from={S(at)} durationInFrames={60}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
