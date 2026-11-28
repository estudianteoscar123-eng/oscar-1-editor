import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import dj from "../../public/zk15/juan.json";
import dd from "../../public/zk15/david.json";
import { FPS } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, Pill, cl, io } from "./RefNoe";
import { Cap, Defs, Dust, L, camPath, finder, toW, type R } from "./ZK9";
import { Toon, type TLook } from "./Toon";

// ZK · comedia con respeto: el cuadro 0 ya es acción (portada sin texto), caras expresivas, narrador irónico, un mundo, cámara calma.
const P = DARK;
const RED = "#D30F17";
type Wd = { w: string; s: number; e: number };
const KING: TLook = { robe: "#4A1E46", robeSh: "#24102A", trim: "#C9A04A", mantle: "#7A0A14", skin: "#B07850", skinSh: "#7A4E34", hair: "#1A1210", hairStyle: "short", beard: "short", crown: true };
const GIRL: TLook = { robe: "#9A2A3A", robeSh: "#5A1420", trim: "#C9A04A", skin: "#C08A62", skinSh: "#8A5A3E", hair: "#140C08", hairStyle: "long", jewel: true };
const MOM: TLook = { robe: "#24162E", robeSh: "#120A18", trim: "#C9A04A", skin: "#B07850", skinSh: "#7A4E34", hair: "#0E0806", hairStyle: "veil", veil: "#4A0C20", jewel: true };
const G1: TLook = { robe: "#3E4450", robeSh: "#1E2128", trim: "#8A7A54", skin: "#9A6A48", skinSh: "#6A4630", hair: "#1A1210", hairStyle: "short", beard: "short" };
const G2: TLook = { robe: "#4A3A2A", robeSh: "#241C14", trim: "#8A7A54", skin: "#B07850", skinSh: "#7A4E34", hair: "#2A1A10", hairStyle: "bald", beard: "long" };
const OLD: TLook = { robe: "#D8D0C0", robeSh: "#9A9284", skin: "#B07850", skinSh: "#7A4E34", hair: "#E8E4DC", hairStyle: "white", beard: "white" };
const SERV: TLook = { robe: "#5A4A3A", robeSh: "#2C241C", skin: "#9A6A48", skinSh: "#6A4630", hair: "#1A1210", hairStyle: "curly" };
const SERV2: TLook = { robe: "#3A4A3A", robeSh: "#1C241C", skin: "#B07850", skinSh: "#7A4E34", hair: "#1A1210", hairStyle: "bald", beard: "short" };
const ABI: TLook = { robe: "#7A2A4A", robeSh: "#3A1424", trim: "#C9A04A", skin: "#C08A62", skinSh: "#8A5A3E", hair: "#140C08", hairStyle: "long", jewel: true };
const SOL: TLook = { robe: "#2E2A54", robeSh: "#171528", trim: "#C9A04A", mantle: "#7A0A14", skin: "#B07850", skinSh: "#7A4E34", hair: "#1A1210", hairStyle: "short", beard: "short", crown: true };
const ADO: TLook = { robe: "#3E5A44", robeSh: "#1E2C22", trim: "#C9A04A", skin: "#B07850", skinSh: "#7A4E34", hair: "#1A1210", hairStyle: "curly", beard: "short" };
const GUARD: TLook = { robe: "#4A3A30", robeSh: "#241C18", trim: "#8A8690", skin: "#9A6A48", skinSh: "#6A4630", hair: "#1A1210", hairStyle: "short", beard: "short" };

const Torch: React.FC<{ x: number; y: number; t: number; k?: number; s?: number; on?: number }> = ({ x, y, t, k = 0, s = 1, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={on}>
    <circle cx={0} cy={-40} r={230} fill="url(#zglow)" opacity={0.85 + 0.15 * Math.sin(t * 9 + k)} />
    <rect x={-9} y={0} width={18} height={110} fill="#2A1A10" />
    <path d={`M-28 0 Q -32 -56 ${Math.sin(t * 11 + k) * 7} -104 Q 28 -56 28 0 Z`} fill="#FF7A2A" />
    <path d={`M-13 0 Q -15 -32 ${Math.sin(t * 13 + k) * 5} -64 Q 13 -32 13 0 Z`} fill="#FFD06A" />
  </g>
);
const Cup: React.FC<{ spill?: number; t: number }> = ({ spill = 0, t }) => (
  <g transform={`rotate(${spill * 60})`}>
    <path d="M-26 -60 L 26 -60 Q 24 -22 0 -14 Q -24 -22 -26 -60 Z" fill="#C9A04A" /><path d="M-22 -54 L 22 -54 Q 20 -28 0 -22 Q -20 -28 -22 -54 Z" fill="#6A0A16" />
    <rect x={-4} y={-14} width={8} height={26} fill="#C9A04A" /><ellipse cx={0} cy={12} rx={18} ry={5} fill="#C9A04A" />
    {spill > 0.2 ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={30 + k * 14 + Math.sin(t * 8 + k) * 3} cy={-60 + k * k * 6} r={7 - k * 0.6} fill="#8A0A1A" />) : null}
  </g>
);
const NoMark: React.FC<{ x: number; y: number; on: number; txt: string }> = ({ x, y, on, txt }) => (
  <g opacity={on} transform={`translate(${x} ${y})`}>
    <rect x={-120} y={-44} width={240} height={88} rx={44} fill="rgba(8,4,6,0.82)" stroke="#C9A04A" strokeWidth={3} />
    <text x={0} y={16} textAnchor="middle" fontFamily="Kit Poppins" fontWeight={600} fontSize={46} fill="#E8D8A8">{txt}</text>
    <path d="M-110 30 L 110 -30" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - cl((on - 0.4) / 0.6))} />
  </g>
);

// ======================== JUAN ========================
const HallBg: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-900} y={-200} width={3600} height={1500} fill="#140C12" />
    {[-260, 160, 640, 1120, 1600].map((x, i) => (
      <g key={i}><rect x={x - 55} y={240} width={110} height={1060} fill="#22161C" /><rect x={x + 30} y={240} width={25} height={1060} fill="#2E2026" /><rect x={x - 80} y={210} width={160} height={44} fill="#2A1C22" /></g>
    ))}
    <path d="M-900 240 L 2700 240" stroke="#3A2A30" strokeWidth={10} />
    {[-50, 400, 880, 1360].map((x, k) => <Torch key={k} x={x} y={700} t={t} k={k} s={0.8} />)}
    {/* cortinas rojas */}
    {[-150, 1500].map((x, i) => <path key={i} d={`M${x} 250 Q ${x + 90} 600 ${x + 40} 1300 L ${x + 200} 1300 Q ${x + 160} 600 ${x + 240} 250 Z`} fill="#4A0C16" opacity={0.9} />)}
    <rect x={-900} y={1300} width={3600} height={1300} fill="url(#rground)" />
    {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${640 + (i - 9) * 40} 1300 L ${640 + (i - 9) * 300} 2700`} stroke="#0A0607" strokeWidth={2} opacity={0.5} />)}
  </g>
);
const Table: React.FC<{ x: number; y: number; w: number; t: number }> = ({ x, y, w, t }) => (
  <g>
    <rect x={x} y={y} width={w} height={34} fill="#3A2218" /><rect x={x} y={y} width={w} height={8} fill="#FF6A3A" opacity={0.5} />
    <rect x={x + 10} y={y + 34} width={w - 20} height={70} fill="#1E120C" />
    {Array.from({ length: Math.floor(w / 110) }, (_, k) => <g key={k} transform={`translate(${x + 60 + k * 110} ${y + 4}) scale(0.55)`}><Cup t={t} /></g>)}
    {Array.from({ length: Math.floor(w / 220) }, (_, k) => <ellipse key={k} cx={x + 110 + k * 220} cy={y - 6} rx={50} ry={16} fill="#C9A04A" opacity={0.8} />)}
  </g>
);
const Platter: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={10} cy={16} rx={270} ry={42} fill="rgba(0,0,0,0.55)" />
    <ellipse cx={0} cy={0} rx={250} ry={58} fill="#C8C4CC" /><ellipse cx={0} cy={-6} rx={208} ry={44} fill="#9A96A0" />
    <path d="M-176 -10 Q -166 -176 0 -186 Q 166 -176 176 -10 Z" fill="#ECE6DA" />
    <path d="M-176 -10 Q -166 -176 0 -186 Q -64 -124 -42 -10 Z" fill="#CFC7B6" />
    <path d={`M-150 -12 Q -120 -56 -70 -18 Q -20 ${-70 - Math.sin(t * 2) * 4} 40 -16 Q 100 -60 150 -12 Z`} fill={RED} />
    <circle cx={0} cy={-190} r={14} fill="#C8C4CC" />
    <path d="M176 -10 Q 166 -176 0 -186" stroke="#FF3A30" strokeWidth={5} fill="none" />
  </g>
);
const WJ = toW(dj as unknown as R, { "Sí,": "Sí," });
const FJ = finder(WJ);
export const ZKJUAN2_TOTAL = Math.round((WJ[WJ.length - 1].e + 0.45) * FPS);
export const ZKJuan2: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKJUAN2_TOTAL / FPS;
  const tMit = FJ("mitad", 0, 1.0), tSi = FJ("si", 0, 3.1), tJov = FJ("joven", 0, 4.6), tMam = FJ("mama", 1, 7.97), tOro = FJ("oro", 0, 8.7), tTie = FJ("tierras", 0, 9.3);
  const tPid = FJ("pidio", 1, 10.3), tCab = FJ("cabeza", 0, 10.6), tBan = FJ("bandeja", 0, 12.6), tTri = FJ("triste", 0, 14.1), tJur = FJ("jurado", 0, 15.8), tPor = FJ("por", 2, 17.2), tFie = FJ("fiesta", 0, 19.3);
  const cam = camPath(t, [
    [0, 560, 1000, 1.2], [tMit, 600, 860, 1.45], [tSi - 0.05, 600, 860, 1.45], [tSi, 1380, 830, 2.0], [tJov - 0.05, 1380, 830, 2.0], [tJov + 0.2, 760, 980, 1.25],
    [tMam + 0.2, 1120, 900, 1.9], [tPid - 0.05, 1140, 880, 1.95], [tCab, 650, 720, 2.4], [tBan - 0.1, 650, 730, 2.4], [tBan + 0.05, 650, 1270, 2.6],
    [tTri - 0.1, 650, 1260, 2.5], [tTri + 0.15, 650, 760, 2.2], [tJur - 0.2, 650, 780, 2.1], [tJur + 0.3, 700, 1000, 1.05], [tPor + 0.3, 600, 1000, 1.15], [T - 0.05, 560, 1000, 1.2],
  ]);
  // estados
  const loopEnd = io(t, tPor, tPor + 0.4); // al final vuelve el baile (bucle)
  const dance = Math.max(1 - io(t, tJov - 0.2, tJov + 0.1), loopEnd);
  const run = io(t, tJov, tMam);
  const girlX = 380 + run * 640 * (1 - loopEnd);
  const kingE = t < tSi ? "laugh" : t < tCab ? "happy" : t < tTri ? "shock" : t < tPor ? "sad" : "laugh";
  const kingPose = t < tMit ? "clap" : t < tSi ? "up" : t < tCab ? "cup" : t < tTri ? "face" : t < tPor ? "face" : "clap";
  const spill = io(t, tCab, tCab + 0.3);
  const momE = t < tMam ? "neutral" : t < tPid ? "smug" : "evil";
  const momPose = t < tMam ? "down" : t < tPid ? "point" : "hips";
  const guestE = t >= tSi && t < tJov ? "shock" : t >= tJur ? "shock" : "laugh";
  const lookKing = t >= tJur && t < tPor ? -1 : 0;
  return (
    <AbsoluteFill style={{ background: "#0A0608", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.85}><HallBg t={t} /></L>
        <L cam={cam} dep={1}>
          {/* invitados al fondo y mesa */}
          {[180, 330, 1290, 1450].map((x, i) => <Toon key={i} x={x} y={1290} s={0.42} l={i % 2 ? G2 : G1} e={guestE} pose={guestE === "laugh" ? "clap" : "face"} t={t + i} lx={lookKing || (i < 2 ? 1 : -1)} />)}
          <Table x={60} y={1290} w={420} t={t} /><Table x={1200} y={1290} w={420} t={t} />
          {/* trono y rey */}
          <path d="M520 1300 L 520 780 Q 650 690 780 780 L 780 1300 Z" fill="#C9A04A" /><path d="M548 1300 L 548 812 Q 650 740 752 812 L 752 1300 Z" fill="#3A0A12" />
          <Toon x={650} y={1330} s={0.58} l={KING} e={kingE as never} pose={kingPose as never} t={t} talk={0} shake={t >= tJur && t < tPor ? 3 : 0}
            hold={kingPose === "cup" || kingPose === "clap" ? undefined : undefined} />
          {kingPose === "cup" || (t < tCab + 0.6 && t >= tSi) ? <g transform={`translate(${650 + 0.58 * (92 + 180)} ${1330 + 0.58 * (-760 + 90)}) scale(0.8)`}><Cup spill={spill} t={t} /></g> : null}
          {/* madre */}
          <Toon x={1140} y={1340} s={0.6} l={MOM} e={momE as never} pose={momPose as never} t={t} flip lx={-1} />
          {/* bailarina */}
          <Toon x={girlX} y={1380} s={0.62} l={GIRL} e={run > 0.05 && run < 0.95 && !loopEnd ? "happy" : "laugh"} pose={dance > 0.5 ? "dance" : "down"} spin={dance > 0.5 ? 1 : 0} t={t} lx={run > 0.05 ? 1 : 0} />
          {/* bandeja en primer plano de la mesa del rey */}
          <rect x={420} y={1395} width={460} height={30} fill="#3A2218" /><rect x={420} y={1395} width={460} height={8} fill="#FF6A3A" opacity={0.5} />
          <g opacity={io(t, tCab + 0.6, tBan)}><Platter x={650} y={1392} s={0.5} t={t} /></g>
          <Pill x={600} y={560} txt="½ REINO" p={P} on={io(t, tMit, tMit + 0.25) * (1 - io(t, tSi - 0.15, tSi))} />
          <NoMark x={1040} y={620} txt="ORO" on={io(t, tOro, tOro + 0.35) * (1 - io(t, tPid - 0.2, tPid))} />
          <NoMark x={1220} y={740} txt="TIERRAS" on={io(t, tTie, tTie + 0.35) * (1 - io(t, tPid - 0.2, tPid))} />
          <Pill x={650} y={1140} txt="MARCOS 6:25" p={P} on={io(t, tBan + 0.1, tBan + 0.35) * (1 - io(t, tTri - 0.2, tTri))} />
          <Pill x={700} y={520} txt="«POR LOS INVITADOS»" p={P} on={io(t, tJur + 0.2, tJur + 0.5) * (1 - io(t, tPor - 0.1, tPor + 0.1))} />
        </L>
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      {f > 1 ? <Cap f={f} W={WJ as Wd[]} keys={new Set(["mitad", "baile", "mama", "oro", "tierras", "cabeza", "bandeja", "triste", "fiesta"])} /> : null}
      <Audio src={staticFile("zk15/juan.wav")} />
      <Audio src={staticFile("zk/songs/short1.mp3")} trimBefore={45 * FPS} volume={(fr) => 0.22 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};

// ======================== DAVID ========================
const Painting: React.FC = () => (
  <g>
    <rect x={-170} y={-130} width={340} height={260} fill="#2A1A10" /><rect x={-150} y={-110} width={300} height={220} fill="#6A8AA8" />
    <rect x={-150} y={40} width={300} height={70} fill="#8A7A4A" />
    {/* Goliat enorme y David pequeñito */}
    <g transform="translate(60 40) scale(0.2)"><Toon x={0} y={0} s={1} l={{ robe: "#6A5030", robeSh: "#3A2A18", trim: "#C9A04A", skin: "#9A6A48", skinSh: "#6A4630", hair: "#1A1210", hairStyle: "short", beard: "long" }} e="shock" pose="face" t={0} /></g>
    <g transform="translate(-90 40) scale(0.07)"><Toon x={0} y={0} s={1} l={{ robe: "#C8B890", robeSh: "#8A7A54", skin: "#B07850", skinSh: "#7A4E34", hair: "#5A2A10", hairStyle: "curly" }} e="smug" pose="up" t={0} /></g>
    <path d="M-150 -110 L 150 -110 L 150 110 L -150 110 Z" fill="none" stroke="#C9A04A" strokeWidth={10} />
  </g>
);
const Bedroom: React.FC<{ t: number; candle: number }> = ({ t, candle }) => (
  <g>
    <rect x={-900} y={-200} width={3800} height={1500} fill="#120C12" />
    <rect x={720} y={420} width={260} height={340} fill="#0A1222" /><path d="M720 420 L 980 420 L 980 760 L 720 760 Z M 850 420 L 850 760 M 720 590 L 980 590" fill="none" stroke="#2A2026" strokeWidth={14} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={730 + rnd(i) * 240} cy={430 + ((rnd(i + 3) * 320 + t * 40) % 320)} r={3 + rnd(i + 8) * 3} fill="#E8EEF8" opacity={0.7} />)}
    <g transform="translate(330 600)"><Painting /></g>
    <rect x={-900} y={1300} width={3800} height={1300} fill="url(#rground)" />
    <Torch x={80} y={1160} t={t} s={0.6} on={candle} /><Torch x={1080} y={1160} t={t} k={2} s={0.6} on={candle} />
  </g>
);
const ThroneRoom: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={1500} y={-200} width={1400} height={1500} fill="#160C14" />
    <rect x={1500} y={-200} width={30} height={1500} fill="#0A0608" />
    {[1700, 2300].map((x, k) => <Torch key={k} x={x} y={760} t={t} k={k + 4} s={0.8} />)}
    <path d="M1880 1300 L 1880 760 Q 2010 660 2140 760 L 2140 1300 Z" fill="#C9A04A" /><path d="M1908 1300 L 1908 792 Q 2010 712 2112 792 L 2112 1300 Z" fill="#2A0A1A" />
  </g>
);
const BedDavid: React.FC<{ t: number; n: number; e: never | string; dead: number; girl: number; throwK: number }> = ({ t, n, e, dead, girl, throwK }) => {
  const cols = ["#7A0A14", "#3A2A54", "#6A5A30", "#2A4A3A", "#5A3A2A", "#8A6A3A", "#3A4A6A", "#6A2A4A", "#4A5A2A", "#7A4A2A"];
  const sh = Math.sin(t * 46) * 4 * (1 - dead);
  return (
    <g>
      <rect x={160} y={1180} width={760} height={90} fill="#3A2418" /><rect x={160} y={1180} width={760} height={12} fill="#FF6A3A" opacity={0.4} />
      <rect x={160} y={1270} width={34} height={90} fill="#2A1A10" /><rect x={886} y={1270} width={34} height={90} fill="#2A1A10" />
      <rect x={120} y={940} width={70} height={420} rx={10} fill="#2A1A10" />
      <ellipse cx={260} cy={1150} rx={110} ry={42} fill="#E8E2D6" />
      {/* David acostado (solo cabeza fuera), girado */}
      <g transform={`translate(${250 + sh} 1126) rotate(-90) scale(0.42) translate(0 900)`}><Toon x={0} y={0} s={1} l={OLD} e={e as never} pose="down" t={t} op={1} /></g>
      {/* la joven a su lado */}
      <g opacity={girl}><g transform="translate(325 1118) rotate(-90) scale(0.38) translate(0 900)"><Toon x={0} y={0} s={1} l={ABI} e="neutral" pose="down" t={t} lx={-1} /></g></g>
      {/* mantas apiladas */}
      {Array.from({ length: n }, (_, k) => {
        const lift = k === n - 1 ? (1 - throwK) : 0;
        return <path key={k} d={`M360 ${1176 - k * 30 - lift * 140} Q 640 ${1116 - k * 34 - lift * 160} 910 ${1176 - k * 30 - lift * 140} L 910 ${1200 - k * 30 - lift * 140} L 360 ${1200 - k * 30 - lift * 140} Z`} fill={cols[k % cols.length]} stroke="#140C0A" strokeWidth={3} transform={`rotate(${lift * -6} 650 ${1180 - k * 30})`} />;
      })}
    </g>
  );
};
const WD = toW(dd as unknown as R, { "Goliath,": "Goliat,", busquemosle: "busquémosle" });
const FD = finder(WD);
export const ZKDAVID2_TOTAL = Math.round((WD[WD.length - 1].e + 0.45) * FPS);
export const ZKDavid2: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKDAVID2_TOTAL / FPS;
  const tGol = FD("goliat", 0, 1.5), tTer = FD("termino", 0, 2.1), tDie = FD("diez", 0, 4.3), tSir = FD("sirvientes", 0, 6.2), tBus = FD("busquemosle", 0, 9.6), tBib = FD("biblia", 0, 11.5);
  const tMur = FD("murio", 0, 12.4), tHij = FD("hijo", 0, 13.0), tSal = FD("salomon", 0, 14.6), tPid = FD("pides", 0, 16.3), tMat = FD("matar", 0, 18.1);
  const cam = camPath(t, [
    [0, 560, 1080, 1.35], [tGol - 0.2, 560, 1080, 1.35], [tGol, 330, 620, 2.3], [tTer - 0.05, 330, 620, 2.3], [tTer + 0.2, 560, 1060, 1.3], [tDie + 0.4, 520, 980, 1.45],
    [tSir, 900, 920, 1.7], [tBus - 0.05, 900, 920, 1.75], [tBus + 0.3, 700, 1000, 1.35], [tBib + 0.4, 420, 1080, 1.8], [tMur + 0.3, 460, 1080, 1.6],
    [tHij - 0.05, 460, 1080, 1.6], [tHij + 0.3, 1650, 980, 1.5], [tSal + 0.2, 1960, 900, 1.6], [tPid + 0.3, 1960, 860, 2.0], [tMat + 0.1, 1800, 960, 1.45], [T - 0.35, 1800, 960, 1.45], [T - 0.05, 560, 1080, 1.35],
  ]);
  const nB = Math.max(3, Math.min(10, Math.round(3 + 7 * io(t, 0, tDie + 0.6))));
  const throwK = ((t * 2.2) % 1);
  const dead = io(t, tMur, tMur + 0.5) * (1 - io(t, T - 0.35, T - 0.05));
  const girl = io(t, tBus + 0.4, tBus + 0.8) * (1 - io(t, T - 0.35, T - 0.05));
  const davidE = t < tBus ? "cold" : t < tMur ? "shock" : "cold";
  const servE = t < tSir ? "neutral" : t < tBus ? "think" : t < tBib ? "happy" : "neutral";
  const servPose = t < tSir ? "hold" : t < tBus ? "chin" : t < tBib ? "up" : "down";
  const adoE = t < tPid ? "happy" : "shock";
  const solE = t < tSal ? "neutral" : "smug";
  const guardIn = io(t, tMat - 0.3, tMat + 0.2);
  return (
    <AbsoluteFill style={{ background: "#0A0608", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.9}><Bedroom t={t} candle={1 - dead * 0.85} /><ThroneRoom t={t} /></L>
        <L cam={cam} dep={1}>
          <BedDavid t={t} n={nB} e={davidE} dead={dead} girl={girl} throwK={nB < 10 ? throwK : 1} />
          {dead > 0.5 ? <g transform="translate(250 1080)"><path d="M-36 0 L -40 -36 L -18 -16 L 0 -46 L 18 -16 L 40 -36 L 36 0 Z" fill="#C9A04A" /></g> : null}
          <Toon x={t < tSir - 0.3 ? 880 : 1000} y={1360} s={0.55} l={SERV} e={servE as never} pose={servPose as never} t={t} flip lx={-1} />
          <Toon x={1180} y={1360} s={0.55} l={SERV2} e={(t >= tBus && t < tBib ? "shock" : servE) as never} pose={(t >= tBus && t < tBib ? "face" : servPose) as never} t={t + 1} flip lx={-1} />
          {/* sala del trono */}
          <Toon x={2010} y={1330} s={0.6} l={SOL} e={solE as never} pose={t >= tPid ? "point" : "down"} t={t} flip lx={-1} />
          <Toon x={1700} y={1380} s={0.58} l={ADO} e={adoE as never} pose={t < tPid ? "flowers" : "face"} t={t} lx={1} shake={t >= tPid ? 3 : 0}
            hold={t < tPid ? <g>{[0, 1, 2, 3, 4].map((k) => <g key={k}><path d={`M0 0 L ${-30 + k * 15} -90`} stroke="#3A6A2A" strokeWidth={6} /><circle cx={-30 + k * 15} cy={-96} r={16} fill={k % 2 ? "#D84A6A" : "#F0D060"} /></g>)}</g> : undefined} />
          <Toon x={1480 + (1 - guardIn) * -200} y={1380} s={0.6} l={GUARD} e="angry" pose="hold" t={t} op={guardIn} lx={1}
            hold={<g><rect x={-6} y={-400} width={12} height={460} fill="#4A3020" /><path d="M-18 -400 L 0 -470 L 18 -400 Z" fill="#B8B4BC" /></g>} />
          <Pill x={560} y={820} txt={`${nB} MANTAS`} p={P} on={io(t, tTer + 0.3, tTer + 0.6) * (1 - io(t, tSir - 0.2, tSir))} />
          <Pill x={600} y={880} txt="1 REYES 1:2" p={P} on={io(t, tBib - 0.1, tBib + 0.2) * (1 - io(t, tMur - 0.1, tMur + 0.1))} />
          <Pill x={1850} y={760} txt="1 REYES 2:22" p={P} on={io(t, tPid, tPid + 0.3) * (1 - io(t, tMat - 0.1, tMat + 0.1))} />
        </L>
        <rect width={1080} height={1920} fill={RED} opacity={io(t, tMat, tMat + 0.15) * (1 - io(t, tMat + 0.3, tMat + 0.8)) * 0.12} />
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      {f > 1 ? <Cap f={f} W={WD as Wd[]} keys={new Set(["goliat", "frio", "diez", "mantas", "muchacha", "biblia", "murio", "casarse", "reino", "matar"])} /> : null}
      <Audio src={staticFile("zk15/david.wav")} />
      <Audio src={staticFile("zk/songs/short2.mp3")} trimBefore={80 * FPS} volume={(fr) => 0.22 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};
