import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import dsa from "../../public/zk13/salomon.json";
import dsn from "../../public/zk13/sanson.json";
import { FPS, KFONT } from "../kit/Kit";
import { DARK, Film, Pill, Sky, cl, io } from "./RefNoe";
import { Cap, Defs, Person, finder, toW, type Look, type R } from "./ZK9";
import { SamsonBack, Soldier } from "./ZK11";

// ZK · método completo: cuadro 0 = la contradicción, gancho distinto (cifra imposible / final primero),
// revelaciones que escalan cada 2–3 s, un ángulo nuevo en cada revelación (corte limpio + empuje lento),
// efectos mínimos (un solo golpe de sonido), dolor humano de fondo, final abierto que vuelve al inicio.
const P = DARK;
const RED = "#D30F17";
const GOLD = "#C9A04A";
const shotOf = (cuts: number[], t: number) => { let i = 0; while (i < cuts.length - 1 && t >= cuts[i + 1]) i++; return i; };
const Push: React.FC<{ lt: number; z0?: number; z1?: number; dur: number; cx?: number; cy?: number; dx?: number; children: React.ReactNode }> = ({ lt, z0 = 1.0, z1 = 1.08, dur, cx = 540, cy = 1000, dx = 0, children }) => {
  const u = io(lt, 0, Math.max(dur, 0.5)), z = z0 + (z1 - z0) * u;
  return <g transform={`translate(${cx + dx * u} ${cy}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>;
};
const Hit: React.FC<{ at: number; vol?: number }> = ({ at, vol = 0.6 }) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none"><Audio src={staticFile("zk10/sfx/boom.wav")} volume={vol} /></Sequence>
);
const XDefs = () => (
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5A4018" /><stop offset="45%" stopColor="#D8B058" /><stop offset="100%" stopColor="#3A2A10" /></linearGradient>
    <linearGradient id="bronze2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3A2410" /><stop offset="45%" stopColor="#8A5A28" /><stop offset="100%" stopColor="#1A0E06" /></linearGradient>
    <radialGradient id="fireg"><stop offset="0%" stopColor="rgba(255,140,50,0.75)" /><stop offset="100%" stopColor="rgba(255,60,20,0)" /></radialGradient>
    <radialGradient id="lampg"><stop offset="0%" stopColor="rgba(255,190,110,0.6)" /><stop offset="100%" stopColor="rgba(255,120,40,0)" /></radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,240,210,0.55)" /><stop offset="100%" stopColor="rgba(255,240,210,0)" /></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0C0A10" /><stop offset="100%" stopColor="#1C1416" /></linearGradient>
  </defs>
);
const Flame: React.FC<{ x: number; y: number; s?: number; t: number; k?: number }> = ({ x, y, s = 1, t, k = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-40} r={170} fill="url(#fireg)" opacity={0.85 + 0.15 * Math.sin(t * 9 + k)} />
    <path d={`M-34 0 Q -40 -60 ${-6 + Math.sin(t * 11 + k) * 8} -120 Q 30 -60 34 0 Z`} fill="#FF7A2A" />
    <path d={`M-16 0 Q -18 -40 ${Math.sin(t * 13 + k) * 6} -78 Q 16 -40 16 0 Z`} fill="#FFD06A" />
  </g>
);
const Brazier: React.FC<{ x: number; y: number; s?: number; t: number; k?: number }> = ({ x, y, s = 1, t, k = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 L 60 0 L 40 40 L -40 40 Z" fill="url(#bronze2)" /><rect x={-8} y={40} width={16} height={160} fill="#2A1A10" /><path d="M-50 200 L 50 200" stroke="#2A1A10" strokeWidth={14} />
    <Flame x={0} y={4} t={t} k={k} />
  </g>
);
const Crown: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-48 0 L -52 -46 L -26 -20 L 0 -58 L 26 -20 L 52 -46 L 48 0 Z" fill="url(#gold)" stroke="#3A2A10" strokeWidth={3} />
    <circle cx={0} cy={-58} r={7} fill={RED} />
  </g>
);

// ======================== SALOMÓN ========================
const KING: Look = { robe: "#3A1E36", robeSh: "#1C0E1A", mantle: "#6A0A12", mantleSh: "#34060A", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "short" };
const KneelKing: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const b = Math.sin(t * 2) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={200} ry={22} fill="rgba(0,0,0,0.5)" />
      <path d={`M-150 0 L 70 0 Q 80 -70 30 -130 L 110 ${-320 + b} Q 80 ${-370 + b} 20 ${-355 + b} L -100 -170 Q -160 -100 -150 0 Z`} fill={KING.robe} />
      <path d="M-150 0 L -40 0 Q -60 -120 -100 -170 Q -160 -100 -150 0 Z" fill={KING.robeSh} />
      <path d={`M70 0 Q 80 -70 30 -130 L 110 ${-320 + b}`} stroke={P.rim} strokeWidth={5} fill="none" />
      <path d={`M-150 0 L 70 0`} stroke={GOLD} strokeWidth={8} />
      <path d={`M90 ${-310 + b} Q 150 -260 180 -190 L 160 -175 Q 120 -240 70 ${-280 + b} Z`} fill={KING.robe} />
      <ellipse cx={180} cy={-178} rx={20} ry={16} fill={KING.skin} />
      <g transform={`translate(${118} ${-360 + b}) rotate(38)`}>
        <ellipse cx={0} cy={0} rx={40} ry={46} fill={KING.skin} />
        <path d="M-10 10 Q 20 50 44 14 Q 30 0 -10 10 Z" fill={KING.hair} />
        <Crown x={-6} y={-36} s={0.8} />
      </g>
    </g>
  );
};
const Idol: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-120} width={440} height={120} fill="#1A1012" /><rect x={-220} y={-120} width={440} height={12} fill="#2E1E20" />
    <path d="M-150 -120 L 150 -120 L 120 -620 L -120 -620 Z" fill="url(#bronze2)" />
    <circle cx={0} cy={-330} r={70} fill="#1A0A06" /><circle cx={0} cy={-330} r={60} fill="url(#fireg)" opacity={0.9 + 0.1 * Math.sin(t * 8)} />
    <path d={`M-30 -300 Q 0 ${-380 - Math.sin(t * 12) * 10} 30 -300 Z`} fill="#FF8A2A" />
    <path d="M-120 -560 Q -260 -520 -300 -430 L -250 -410 Q -220 -480 -110 -500 Z M 120 -560 Q 260 -520 300 -430 L 250 -410 Q 220 -480 110 -500 Z" fill="url(#bronze2)" />
    <path d="M-90 -620 L 90 -620 L 70 -780 Q 0 -820 -70 -780 Z" fill="url(#bronze2)" />
    <path d="M-70 -770 Q -200 -820 -210 -930 Q -150 -850 -60 -800 Z M 70 -770 Q 200 -820 210 -930 Q 150 -850 60 -800 Z" fill="#2A1A0C" />
    <circle cx={-32} cy={-720} r={10} fill={RED} opacity={0.6 + 0.4 * Math.sin(t * 3)} /><circle cx={32} cy={-720} r={10} fill={RED} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
    <path d="M120 -620 L 150 -120" stroke={P.rim} strokeWidth={6} />
  </g>
);
const Hall: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="url(#wall)" />
    {[-60, 230, 850, 1140].map((x, i) => <g key={i}><rect x={x - 50} y={300} width={100} height={1200} fill="#120C10" /><rect x={x + 30} y={300} width={20} height={1200} fill="#1E1418" /><rect x={x - 70} y={280} width={140} height={40} fill="#1A1216" /></g>)}
    <rect y={1500} width={1080} height={420} fill="#0C0809" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${540 + (i - 4) * 40} 1500 L ${540 + (i - 4) * 300} 1920`} stroke="#1A1214" strokeWidth={3} />)}
  </g>
);
const WSA = toW(dsa as unknown as R, { Salomon: "Salomón", "Tenías": "Tenía" });
const FSA = finder(WSA);
export const ZKSAL_TOTAL = Math.round((WSA[WSA.length - 1].e + 0.35) * FPS);
export const ZKSalomon: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKSAL_TOTAL / FPS;
  const tEra = FSA("era", 0, 2.6), tRec = FSA("recibia", 0, 4.6), tFin = FSA("final", 0, 7.0), tLes = FSA("les", 0, 8.8);
  const tDios = FSA("dios", 0, 10.6), tDos2 = FSA("dos", 1, 12.0), tNo = FSA("escucho", 0, 12.6) - 0.35, tEl = FSA("el", 0, 13.6);
  const tBib = FSA("biblia", 0, 16.0) - 0.35;
  const elIdx = WSA.findIndex((w) => /^él$/i.test(w.w.replace(/[^\wáéíóúñ]/gi, "")));
  const tWrote = elIdx >= 0 ? WSA[elIdx].s : tEl;
  const CUTS = [0, tEra, tRec, tFin, tLes, tDios, tNo, tWrote, tBib];
  const i = shotOf(CUTS, t), lt = t - CUTS[i], dur = (CUTS[i + 1] ?? T) - CUTS[i];
  const n22 = Math.round(22 * io(t, tRec + 0.3, tRec + 1.3));
  let scene: React.ReactNode;
  if (i === 0 || i === 8) { // cuadro 0 y final: el rey de rodillas ante el ídolo
    scene = (
      <Push lt={lt} dur={dur} z0={i === 0 ? 1.12 : 1.0} z1={i === 0 ? 1.2 : 1.12} cy={1200}>
        <rect width={1080} height={1920} fill="#07050A" />
        <rect y={1520} width={1080} height={400} fill="#0E0A0C" />
        <Idol x={640} y={1540} s={1.05} t={t} />
        <Brazier x={170} y={1320} s={0.9} t={t} /><Brazier x={980} y={1320} s={0.9} t={t} k={2} />
        <KneelKing x={300} y={1560} s={0.95} t={t} />
        <Pill x={300} y={1080} txt="700 ESPOSAS" p={P} on={i === 0 ? io(t, 0.25, 0.5) : 0} />
        <Pill x={300} y={1080} txt="1 REYES 11" p={P} on={i === 8 ? io(lt, 0.2, 0.4) : 0} />
      </Push>
    );
  } else if (i === 1) { // el más sabio: en el trono
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.1} cy={1100}>
        <Hall />
        <path d="M380 1500 L 380 1060 Q 540 980 700 1060 L 700 1500 Z" fill="url(#gold)" opacity={0.85} />
        <path d="M410 1500 L 410 1090 Q 540 1030 670 1090 L 670 1500 Z" fill="#2A0A10" />
        {[350, 730].map((x) => <g key={x}><path d={`M${x - 40} 1500 L ${x - 40} 1360 Q ${x} 1300 ${x + 40} 1360 L ${x + 40} 1500 Z`} fill="url(#gold)" /></g>)}
        <Person x={540} y={1500} s={0.78} look={KING} face={1} t={t} />
        <Crown x={540 + 3} y={1500 - 0.78 * 612} s={0.78} />
        <Pill x={540} y={760} txt="1 REYES 3:12" p={P} on={io(lt, 0.3, 0.5)} />
      </Push>
    );
  } else if (i === 2) { // 22 toneladas de oro al año
    scene = (
      <Push lt={lt} dur={dur} z0={1.15} z1={1.0} cy={1250}>
        <rect width={1080} height={1920} fill="#07050A" />
        <circle cx={540} cy={1300} r={600} fill="url(#lampg)" opacity={0.5} />
        {Array.from({ length: 120 }, (_, k) => {
          const row = Math.floor(k / 15), col = k % 15, show = k / 120 < io(t, tRec + 0.2, tRec + 1.4);
          return show ? <g key={k} transform={`translate(${140 + col * 54 + (row % 2) * 27} ${1640 - row * 34})`}><path d="M-24 0 L 24 0 L 18 -26 L -18 -26 Z" fill="url(#gold)" stroke="#3A2A10" strokeWidth={2} /></g> : null;
        })}
        <text x={540} y={1060} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={230} fill="#fff">{n22}</text>
        <text x={540} y={1150} textAnchor="middle" fontFamily={KFONT} fontWeight={700} fontSize={60} fill={GOLD}>TONELADAS DE ORO AL AÑO</text>
        <Pill x={540} y={1260} txt="1 REYES 10:14" p={P} on={io(lt, 0.6, 0.8)} />
      </Push>
    );
  } else if (i === 3) { // al final se arrodilló ante ídolos: plano general, muchos ídolos
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.1} cy={1300}>
        <rect width={1080} height={1920} fill="#05040A" />
        <rect y={1380} width={1080} height={540} fill="#0E0A0C" />
        {[[160, 1400, 0.42], [920, 1400, 0.42], [380, 1430, 0.55], [700, 1430, 0.55]].map(([x, y, s], k) => <Idol key={k} x={x} y={y} s={s} t={t + k} />)}
        <KneelKing x={540} y={1640} s={0.6} t={t} />
        <Flame x={540} y={1460} s={0.6} t={t} />
      </Push>
    );
  } else if (i === 4) { // les construyó altares con sus manos: en el cerro
    const up = io(lt, 0.1, dur);
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.08} cy={1250}>
        <Sky p={P} t={t} moon={false} />
        <path d="M-100 1500 Q 540 1050 1180 1500 L 1180 1920 L -100 1920 Z" fill="#160E12" />
        {[260, 540, 820].map((x, k) => {
          const h = 60 + 200 * cl(up * 3 - k * 0.8);
          return <g key={k}><rect x={x - 70} y={1330 - h} width={140} height={h} fill="#2A2026" /><path d={`M${x + 70} ${1330 - h} L ${x + 70} 1330`} stroke={P.rim} strokeWidth={4} />{h > 200 ? <Flame x={x} y={1330 - h} s={0.6} t={t} k={k} /> : null}</g>;
        })}
        <Person x={420} y={1420} s={0.4} look={KING} face={1} t={t} armUp={0.6 + 0.3 * Math.sin(t * 4)} />
        <Crown x={423} y={1420 - 0.4 * 612} s={0.4} />
        <Pill x={540} y={900} txt="1 REYES 11:7" p={P} on={io(lt, 0.3, 0.5)} />
      </Push>
    );
  } else if (i === 5) { // Dios se le apareció dos veces
    const pulse = (t0: number) => io(t, t0, t0 + 0.25) * (1 - io(t, t0 + 0.6, t0 + 1.0));
    const b = Math.max(pulse(tDios + 0.2), pulse(tDos2 - 0.2));
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.12} cy={1300}>
        <rect width={1080} height={1920} fill="#04040A" />
        <path d="M400 0 L 680 0 L 760 1500 L 320 1500 Z" fill="url(#beam)" opacity={b} />
        <ellipse cx={540} cy={1500} rx={260} ry={40} fill="rgba(255,240,210,0.25)" opacity={b} />
        <rect y={1500} width={1080} height={420} fill="#0C0A0C" />
        <Person x={540} y={1500} s={0.5} look={KING} face={1} t={t} />
        <Crown x={543} y={1500 - 0.5 * 612} s={0.5} />
        <text x={540} y={900} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={260} fill="#fff" opacity={io(t, tDios + 0.2, tDios + 0.4) * (1 - io(t, tDos2 - 0.3, tDos2 - 0.2))}>1</text>
        <text x={540} y={900} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={260} fill={RED} opacity={io(t, tDos2 - 0.2, tDos2)}>2</text>
        <Pill x={540} y={1010} txt="1 REYES 11:9" p={P} on={io(t, tDos2, tDos2 + 0.3)} />
      </Push>
    );
  } else if (i === 6) { // y no escuchó: le da la espalda a la luz
    const walk = io(lt, 0, dur);
    scene = (
      <Push lt={lt} dur={dur} z0={1.1} z1={1.0} cy={1300}>
        <rect width={1080} height={1920} fill="#04040A" />
        <path d="M400 0 L 680 0 L 760 1500 L 320 1500 Z" fill="url(#beam)" opacity={0.25 * (1 - walk)} />
        <rect y={1500} width={1080} height={420} fill="#0C0A0C" />
        <Idol x={160} y={1500} s={0.45} t={t} />
        <Person x={600 - walk * 260} y={1500} s={0.5} look={KING} face={-1} t={t} />
        <Crown x={597 - walk * 260} y={1500 - 0.5 * 612} s={0.5} />
      </Push>
    );
  } else { // él mismo escribió: todo es vanidad
    const unroll = io(lt, 0, 0.8);
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.1} cy={1150}>
        <rect width={1080} height={1920} fill="#07050A" />
        <circle cx={540} cy={1150} r={600} fill="url(#lampg)" opacity={0.45} />
        <rect x={160} y={1150 - 380 * unroll} width={760} height={760 * unroll} fill="#D8C8A4" />
        <rect x={140} y={1130 - 380 * unroll} width={800} height={40} rx={20} fill="#6A4A2A" /><rect x={140} y={1130 + 380 * unroll} width={800} height={40} rx={20} fill="#6A4A2A" />
        <g opacity={io(lt, 0.6, 1.0)}>
          <text x={540} y={1080} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={74} fill="#2A1A10">Vanidad de vanidades…</text>
          <text x={540} y={1210} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={96} fill="#5A0A10">todo es vanidad</text>
        </g>
        <Pill x={540} y={1650} txt="ECLESIASTÉS 1:2" p={P} on={io(lt, 0.8, 1.0)} />
      </Push>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}><Defs p={P} /><XDefs />{scene}</svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WSA} keys={new Set(["setecientas", "700", "vacio", "sabio", "veintidos", "22", "toneladas", "idolos", "dos", "vanidad", "arrepintio"])} />
      <Audio src={staticFile("zk13/salomon.wav")} />
      <Audio src={staticFile("zk/songs/short3.mp3")} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
      <Hit at={tDos2} vol={0.55} />
    </AbsoluteFill>
  );
};

// ======================== SANSÓN ========================
const DELILAH = "#4A0C14";
const Mill: React.FC<{ t: number; blind?: boolean }> = ({ t }) => (
  <g>
    <rect width={1080} height={1920} fill="url(#wall)" />
    {Array.from({ length: 40 }, (_, k) => <rect key={k} x={(k % 8) * 140 - 20 + (Math.floor(k / 8) % 2) * 70} y={200 + Math.floor(k / 8) * 160} width={130} height={150} fill="none" stroke="#1E1618" strokeWidth={4} />)}
    <rect x={720} y={260} width={120} height={160} fill="#2A2430" />
    <path d="M720 260 L 840 260 L 560 1600 L 240 1600 Z" fill="url(#beam)" opacity={0.35} />
    <rect y={1600} width={1080} height={320} fill="#0E0A0C" />
    <ellipse cx={540} cy={1560} rx={330} ry={70} fill="#2A2428" /><ellipse cx={540} cy={1500} rx={300} ry={60} fill="#3A3438" /><path d="M240 1500 L 240 1560 M 840 1500 L 840 1560" stroke="#1A1416" strokeWidth={4} />
    <ellipse cx={540} cy={1500} rx={300} ry={60} fill="none" stroke={P.rim} strokeWidth={3} opacity={0.6} />
    <rect x={524} y={1250} width={32} height={260} fill="#2A1A10" />
    <path d={`M540 ${1290} L ${-100} ${1330 + Math.sin(t) * 4}`} stroke="#3A2414" strokeWidth={28} strokeLinecap="round" />
  </g>
);
const BlindSamson: React.FC<{ t: number; s?: number; x?: number; y?: number }> = ({ t, s = 0.62, x = 300, y = 1900 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 3) * 6}) scale(${s})`}>
    <SamsonBack t={t} />
    <path d="M-118 -1500 Q 0 -1470 118 -1500 L 116 -1460 Q 0 -1430 -116 -1460 Z" fill="#B8A890" />
    <path d="M-20 -1480 L -50 -1390 M 20 -1480 L 50 -1395" stroke="#B8A890" strokeWidth={16} strokeLinecap="round" />
    <path d="M-60 -1470 Q -40 -1460 -30 -1440" stroke={RED} strokeWidth={10} opacity={0.7} />
    {[-80, 80].map((cx) => <path key={cx} d={`M${cx} -10 q 40 40 0 80 q -40 40 0 80`} stroke="#5A5660" strokeWidth={12} fill="none" />)}
  </g>
);
const DelilahRoom: React.FC<{ t: number; samson: number; her: number; lamp: number }> = ({ t, samson, her, lamp }) => (
  <g>
    <rect width={1080} height={1920} fill="#07050A" />
    <circle cx={760} cy={1150} r={700} fill="url(#lampg)" opacity={lamp * (0.95 + 0.05 * Math.sin(t * 7))} />
    <rect y={1440} width={1080} height={480} fill="#0E0A0C" />
    <g transform="translate(760 1250)" opacity={lamp}><ellipse cx={0} cy={0} rx={50} ry={18} fill="#6A4A2A" /><Flame x={10} y={-10} s={0.35} t={t} /></g>
    {/* ella, sentada (silueta con pelo largo) */}
    <g opacity={her} transform="translate(520 1440)">
      <path d="M-120 0 Q -130 -120 -60 -170 L -40 -360 Q -20 -420 30 -410 Q 70 -400 70 -350 L 60 -170 Q 150 -120 160 0 Z" fill="#3A1418" />
      <path d="M30 -410 Q -40 -420 -50 -330 Q -70 -220 -40 -140 L -10 -150 Q -30 -250 10 -330 Z" fill="#050304" />
      <path d="M70 -350 L 60 -170 Q 150 -120 160 0" stroke="#FFB070" strokeWidth={5} fill="none" opacity={0.9} />
      <circle cx={30} cy={-370} r={38} fill="#6E4A36" />
      <path d="M-120 0 Q -130 -120 -60 -170" stroke={DELILAH} strokeWidth={30} fill="none" opacity={0.5} />
    </g>
    {/* él, dormido con la cabeza en sus piernas */}
    <g opacity={samson} transform="translate(560 1420)">
      <path d="M-40 -60 Q -300 -90 -560 -40 L -560 20 Q -300 10 -40 10 Z" fill="#6E4A36" />
      <path d="M-40 -60 Q -300 -90 -560 -40" stroke="#FFB070" strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M-560 -10 Q -300 -20 -40 -10 L -40 10 Q -300 10 -560 20 Z" fill="#3A2418" />
      <circle cx={-10} cy={-50} r={50} fill="#7A5440" /><path d="M-60 -50 A 50 50 0 0 1 30 -80" stroke="#FFB070" strokeWidth={4} fill="none" />
      {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M${-20 + k * 6} -90 Q ${40 + k * 10} -40 ${60 + k * 14} 20`} stroke="#0C0605" strokeWidth={14} fill="none" strokeLinecap="round" />)}
    </g>
  </g>
);
const WSN = toW(dsn as unknown as R, { Sanson: "Sansón" });
const FSN = finder(WSN);
export const ZKSNS_TOTAL = Math.round((WSN[WSN.length - 1].e + 0.35) * FPS);
export const ZKSansonFin: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKSNS_TOTAL / FPS;
  const tMuj = FSN("mujer", 0, 3.0), tCada = FSN("cada", 0, 4.6), tTres = FSN("tres", 0, 7.0), tCuar = FSN("cuarta", 0, 9.0) - 0.4;
  const tDurm = FSN("durmio", 0, 10.6) - 0.3, tSac = FSN("sacaron", 0, 13.0) - 0.3, tPus = FSN("pusieron", 0, 14.4) - 0.3;
  const tElla = FSN("ella", 0, 17.0) - 0.4, tDesp = FSN("desperto", 0, 12.0);
  const CUTS = [0, tMuj, tCada, tTres, tCuar, tDurm, tSac, tPus, tElla];
  const i = shotOf(CUTS, t), lt = t - CUTS[i], dur = (CUTS[i + 1] ?? T) - CUTS[i];
  let scene: React.ReactNode;
  if (i === 0 || i === 7) { // cuadro 0 y "como a un animal": ciego, encadenado, girando el molino
    scene = (
      <Push lt={lt} dur={dur} z0={i === 0 ? 1.1 : 1.0} z1={i === 0 ? 1.18 : 1.1} cy={1500}>
        <Mill t={t} />
        <BlindSamson t={t} />
        <Pill x={760} y={1120} txt="JUECES 16:21" p={P} on={i === 7 ? io(lt, 0.3, 0.5) : 0} />
      </Push>
    );
  } else if (i === 1) { // la mujer que amaba lo vendió
    scene = <Push lt={lt} dur={dur} z0={1.0} z1={1.1} cy={1350}><DelilahRoom t={t} samson={1} her={1} lamp={1} /></Push>;
  } else if (i === 2) { // cada jefe filisteo: 1.100 monedas
    const n = Math.round(1100 * io(t, tCada + 0.5, tCada + 1.6));
    scene = (
      <Push lt={lt} dur={dur} z0={1.05} z1={1.0} cy={1400}>
        <rect width={1080} height={1920} fill="#07050A" />
        <circle cx={540} cy={1400} r={560} fill="url(#lampg)" opacity={0.4} />
        <rect y={1560} width={1080} height={360} fill="#0E0A0C" />
        {[140, 340, 540, 740, 940].map((x, k) => (
          <g key={k}>
            <Soldier x={x} y={1560} s={0.95} t={t + k} face={k < 2 ? 1 : -1} />
            <g transform={`translate(${x} ${1440})`}><path d="M-28 0 Q -36 -40 0 -46 Q 36 -40 28 0 Z" fill="#8A8690" /><path d="M-12 -46 L 12 -46" stroke="#3A3640" strokeWidth={6} /></g>
          </g>
        ))}
        <text x={540} y={1000} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={210} fill="#fff">{n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
        <text x={540} y={1090} textAnchor="middle" fontFamily={KFONT} fontWeight={700} fontSize={54} fill="#C8C4D0">MONEDAS DE PLATA · CADA UNO</text>
        <Pill x={540} y={1200} txt="JUECES 16:5" p={P} on={io(lt, 0.8, 1.0)} />
      </Push>
    );
  } else if (i === 3) { // tres veces le preguntó
    const marks = [0, 1, 2].map((k) => io(t, tTres + 0.2 + k * 0.45, tTres + 0.35 + k * 0.45));
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.06} cy={1300}>
        <DelilahRoom t={t} samson={1} her={1} lamp={1} />
        <rect width={1080} height={1920} fill="rgba(0,0,0,0.45)" />
        {marks.map((m, k) => <path key={k} d={`M${300 + k * 240} 820 L ${280 + k * 240} ${820 + 300 * m}`} stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={m > 0 ? 1 : 0} />)}
        {["CUERDAS", "MIMBRES", "TELAR"].map((s, k) => <text key={k} x={290 + k * 240} y={1190} textAnchor="middle" fontFamily={KFONT} fontWeight={700} fontSize={40} fill="#C8C4D0" opacity={marks[k]}>{s}</text>)}
      </Push>
    );
  } else if (i === 4) { // a la cuarta, se lo dijo
    scene = (
      <Push lt={lt} dur={dur} z0={1.2} z1={1.32} cy={1300}>
        <DelilahRoom t={t} samson={1} her={1} lamp={1} />
        <rect width={1080} height={1920} fill="rgba(0,0,0,0.45)" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${300 + k * 240} 820 L ${280 + k * 240} 1120`} stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.5} />)}
        <path d="M220 900 L 860 1060" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeDasharray={480} strokeDashoffset={480 * (1 - io(lt, 0.1, 0.4))} />
        <Pill x={540} y={1260} txt="JUECES 16:17" p={P} on={io(lt, 0.4, 0.6)} />
      </Push>
    );
  } else if (i === 5) { // se durmió en sus piernas, despertó sin fuerza: caen las 7 trenzas
    const cut = io(t, tDesp - 0.6, tDesp + 0.4);
    scene = (
      <Push lt={lt} dur={dur} z0={1.25} z1={1.45} cy={1360} dx={-60}>
        <DelilahRoom t={t} samson={1} her={1} lamp={1} />
        {Array.from({ length: 7 }, (_, k) => {
          const d = cl(cut * 7 - k);
          return <path key={k} d={`M${560 - 20 + k * 6} ${1330 + d * 140} Q ${600 + k * 10} ${1380 + d * 140} ${620 + k * 14} ${1440 + d * 120}`} stroke="#0C0605" strokeWidth={14} fill="none" strokeLinecap="round" opacity={d} />;
        })}
        <Pill x={560} y={1160} txt="7 TRENZAS" p={P} on={io(lt, 0.3, 0.5) * (1 - io(t, tDesp + 0.2, tDesp + 0.4))} />
      </Push>
    );
  } else if (i === 6) { // le sacaron los ojos: primer plano, sin mostrar violencia
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.08} cy={1100}>
        <rect width={1080} height={1920} fill="#050306" />
        <circle cx={540} cy={1000} r={520} fill="url(#rglowg)" opacity={0.55} />
        <g transform="translate(540 1900) scale(1.25)"><SamsonBack t={t} /></g>
        <path d="M400 820 Q 540 860 680 820 L 676 880 Q 540 920 404 880 Z" fill="#B8A890" />
        <path d="M440 840 Q 470 870 500 860 M 580 860 Q 610 870 640 840" stroke={RED} strokeWidth={14} opacity={io(lt, 0.2, 0.8)} />
      </Push>
    );
  } else { // ¿y ella? el cuarto vacío, la lámpara se apaga
    scene = (
      <Push lt={lt} dur={dur} z0={1.0} z1={1.12} cy={1300}>
        <DelilahRoom t={t} samson={0} her={1 - io(lt, 0.2, 1.0)} lamp={1 - io(lt, 1.0, Math.max(1.2, dur - 0.2))} />
        <Pill x={540} y={1650} txt="NUNCA MÁS SE LA NOMBRA" p={P} on={io(lt, 0.6, 0.9)} />
      </Push>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}><Defs p={P} /><XDefs /><defs><radialGradient id="rglowg"><stop offset="0%" stopColor="rgba(211,15,23,0.6)" /><stop offset="100%" stopColor="rgba(211,15,23,0)" /></radialGradient></defs>{scene}</svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WSN} keys={new Set(["fuerte", "ciego", "encadenado", "vendio", "1100", "mil", "tres", "cuarta", "fuerza", "ojos", "animal", "ella"])} />
      <Audio src={staticFile("zk13/sanson.wav")} />
      <Audio src={staticFile("zk/songs/short1.mp3")} trimBefore={45 * FPS} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
      <Hit at={tSac + 0.3} vol={0.55} />
    </AbsoluteFill>
  );
};
