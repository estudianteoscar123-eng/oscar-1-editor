import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import dm from "../../public/zk12/moises.json";
import dj from "../../public/zk12/jonas.json";
import { FPS } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, HZ, Pill, Sky, cl, io } from "./RefNoe";
import { Cap, Defs, Dust, L, Person, Tent, camPath, finder, toW, type Look, type R } from "./ZK9";

// Serie "¿Te acuerdas cómo terminó…?" — mismo mecanismo y estilo que Noé (58 mil vistas):
// un mundo, cámara calma continua, etiquetas píldora, subtítulo pequeño arriba con recuadro rojo,
// efectos mínimos, música audible desde el cuadro 0, final que vuelve al inicio.
const P = DARK;
const RED = "#D30F17";
const MOI: Look = { robe: "#5A4A3C", robeSh: "#2C241C", mantle: "#4A0C10", mantleSh: "#260608", skin: "#7A5440", skinSh: "#43291E", hair: "#CFC8C0", beard: "long" };
const JON: Look = { robe: "#4A4E56", robeSh: "#23262C", mantle: "#2E2A24", mantleSh: "#171510", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "short" };
const Staff: React.FC<{ x: number; y: number; s: number; op?: number }> = ({ x, y, s, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${Math.abs(s)})`} opacity={op}>
    <path d="M150 0 L 175 -720 Q 180 -760 150 -770" stroke="#3A2414" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M175 -720 Q 180 -760 150 -770" stroke={P.rim} strokeWidth={4} fill="none" />
  </g>
);

// ======================== MOISÉS ========================
const WM = toW(dm as unknown as R, { "Nevo": "Nebo" });
const FM = finder(WM);
export const ZKMOI_TOTAL = Math.round((WM[WM.length - 1].e + 0.35) * FPS);
const PEAK: [number, number] = [1300, 700];
const Nebo: React.FC = () => (
  <g>
    <path d={`M760 1380 L 1060 960 L 1180 900 L ${PEAK[0]} ${PEAK[1]} L 1420 820 L 1560 880 L 1960 1380 Z`} fill="#160E12" />
    <path d={`M${PEAK[0]} ${PEAK[1]} L 1420 820 L 1560 880 L 1960 1380 L 1420 1380 Z`} fill="#0C0709" />
    <path d={`M${PEAK[0]} ${PEAK[1]} L 1420 820 L 1560 880 L 1960 1380`} stroke={P.rim} strokeWidth={4} fill="none" opacity={0.7} />
    <path d="M900 1340 L 1150 1230 L 1000 1120 L 1220 1000 L 1120 900 L 1290 720" stroke="#3A2A2A" strokeWidth={4} strokeDasharray="10 12" fill="none" />
    <ellipse cx={PEAK[0]} cy={PEAK[1] + 6} rx={70} ry={10} fill="#1E1418" />
  </g>
);
const PromisedLand: React.FC<{ land: number; border: number; t: number }> = ({ land, border, t }) => (
  <g>
    <ellipse cx={100} cy={HZ} rx={900} ry={170} fill="rgba(232,170,80,0.5)" opacity={0.25 + land * 0.75} style={{ filter: "blur(30px)" }} />
    <path d={`M-700 ${HZ} Q -200 ${HZ - 40} 300 ${HZ - 10} Q 600 ${HZ - 30} 820 ${HZ} Z`} fill="#2A2418" opacity={0.9} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-500 + rnd(i + 300) * 1200} cy={HZ - 8 - rnd(i + 301) * 20} r={1.5 + rnd(i) * 2} fill="#FFD890" opacity={(0.3 + 0.5 * land) * (0.7 + 0.3 * Math.sin(t * 3 + i))} />)}
    <path d={`M760 ${HZ + 30} Q 600 ${HZ + 8} 420 ${HZ + 20} Q 200 ${HZ + 34} -100 ${HZ + 16} Q -400 ${HZ + 6} -700 ${HZ + 14}`} stroke="#6A86A0" strokeWidth={5} fill="none" opacity={0.6} />
    <path d={`M760 ${HZ + 30} Q 600 ${HZ + 8} 420 ${HZ + 20} Q 200 ${HZ + 34} -100 ${HZ + 16} Q -400 ${HZ + 6} -700 ${HZ + 14}`} stroke={RED} strokeWidth={6} fill="none" strokeDasharray="18 14" opacity={border} strokeDashoffset={-t * 20} />
  </g>
);
const Desert: React.FC<{ t: number; trail: number }> = ({ t, trail }) => (
  <g>
    <rect x={-800} y={HZ - 2} width={3600} height={1500} fill="url(#rground)" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-700 + i * 420} ${1200 + i * 60} q 200 -40 400 0`} stroke="#3A262A" strokeWidth={4} fill="none" opacity={0.6} />)}
    {/* el camino de 40 años: una fila de personas que serpentea hasta el monte */}
    {Array.from({ length: 70 }, (_, k) => {
      const u = k / 69, x = -400 + u * 1250 + Math.sin(u * 9) * 120, y = 1900 - u * 560, s = 0.06 + (1 - u) * 0.16;
      return u <= trail ? <Person key={k} x={x} y={y} s={s} look={k % 3 ? JON : MOI} t={t + k} /> : null;
    })}
    {Array.from({ length: 14 }, (_, k) => <g key={k} transform={`translate(${-300 + k * 90 + rnd(k) * 40} ${1380 + rnd(k + 2) * 80}) scale(0.18)`}><Tent glow={0.6} inside={0} t={t + k} /></g>)}
  </g>
);
export const ZKMoises: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKMOI_TOTAL / FPS;
  const tNoFue = FM("no", 0, 1.6), tCua = FM("40", 0, FM("cuarenta", 0, 3.6)), tSub = FM("subio", 0, 6.0), tMos = FM("mostro", 0, 7.6), tPero = FM("pero", 0, 8.8);
  const tMur = FM("murio", 0, 10.8), tEnt = FM("enterro", 0, 12.6), tLug = FM("lugar", 0, 13.6), tNad = FM("nadie", 0, 14.4);
  const cam = camPath(t, [
    [0, 1250, 640, 2.2], [tNoFue + 0.4, 1150, 700, 1.9], [tCua + 0.3, 500, 1300, 0.95], [tSub - 0.1, 600, 1250, 0.95],
    [tSub + 1.0, 1220, 860, 1.35], [tMos + 0.3, 880, 880, 1.25], [tPero + 0.3, 560, 1000, 1.2], [tMur + 0.2, 1290, 660, 2.3],
    [tEnt + 0.2, 1250, 760, 1.8], [tLug + 0.5, 300, 1620, 1.4], [T - 0.9, 320, 1600, 1.5], [T - 0.05, 1250, 640, 2.2],
  ]);
  // Moisés: en la cima (gancho) → al frente de la fila en el desierto → sube → muere en la cima
  const atPeak = 1 - io(t, tCua - 0.1, tCua + 0.4) + io(t, tSub + 0.2, tSub + 0.6);
  const climb = io(t, tSub, tSub + 1.2);
  const mx = climb > 0 ? 900 + (PEAK[0] - 900) * climb : 840, my = climb > 0 ? 1340 + (PEAK[1] - 1340) * climb : 1350;
  const dead = io(t, tMur + 0.2, tMur + 0.9) * (1 - io(t, T - 0.7, T - 0.2));
  const land = io(t, tMos, tMos + 1.0) * (1 - io(t, tMur, tMur + 0.6));
  const border = io(t, tPero + 0.4, tPero + 0.8) * (1 - io(t, tMur, tMur + 0.6));
  const sweep = io(t, tLug, T - 0.8);
  return (
    <AbsoluteFill style={{ background: P.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.6}><Sky p={P} t={t} moon={false} /></L>
        <L cam={cam} dep={0.8}><PromisedLand land={land} border={border} t={t} /></L>
        <L cam={cam} dep={1}>
          <Desert t={t} trail={io(t, tCua, tCua + 1.6)} />
          <Nebo />
          {/* Moisés en la cima */}
          <g opacity={cl(atPeak) * (1 - dead)}>
            <Person x={PEAK[0]} y={PEAK[1]} s={0.3} look={MOI} face={-1} t={t} />
            <Staff x={PEAK[0]} y={PEAK[1]} s={-0.3} />
          </g>
          {/* yace en la cima */}
          <g opacity={dead} transform={`translate(${PEAK[0] - 10} ${PEAK[1] - 4})`}>
            <path d="M-95 0 Q -90 -26 -40 -26 L 70 -22 Q 96 -20 96 0 Z" fill={MOI.robe} /><path d="M96 0 Q 96 -20 70 -22" stroke={P.rim} strokeWidth={2} fill="none" />
            <circle cx={-100} cy={-16} r={14} fill={MOI.skin} /><path d="M-112 -10 Q -106 4 -90 2" stroke={MOI.hair} strokeWidth={6} fill="none" />
          </g>
          {/* subiendo / guiando la fila */}
          <g opacity={(1 - cl(atPeak)) * (1 - dead)}>
            <Person x={mx} y={my} s={0.3 + (1 - climb) * 0.1} look={MOI} face={climb > 0 ? 1 : -1} t={t} />
          </g>
          {/* la tumba que nadie encontró: luz que barre el valle vacío */}
          <g opacity={io(t, tLug - 0.2, tLug + 0.3) * (1 - io(t, T - 0.7, T - 0.2))}>
            <ellipse cx={120 + sweep * 420} cy={1640 + Math.sin(sweep * 6) * 40} rx={140} ry={42} fill="rgba(255,230,200,0.12)" />
            <ellipse cx={120 + sweep * 420} cy={1640 + Math.sin(sweep * 6) * 40} rx={70} ry={20} fill="rgba(255,230,200,0.1)" />
          </g>
          <Pill x={600} y={1110} txt="40 AÑOS" p={P} on={io(t, tCua + 0.2, tCua + 0.5) * (1 - io(t, tSub - 0.2, tSub))} lx={560} ly={1180} />
          <Pill x={520} y={940} txt="TIERRA PROMETIDA" p={P} on={io(t, tMos + 0.3, tMos + 0.6) * (1 - io(t, tMur - 0.2, tMur))} />
          <Pill x={1290} y={590} txt="120 AÑOS" p={P} on={io(t, tMur + 0.4, tMur + 0.7) * (1 - io(t, tEnt + 0.2, tEnt + 0.5))} lx={1290} ly={650} />
          <Pill x={320} y={1500} txt="DEUTERONOMIO 34:6" p={P} on={io(t, tNad, tNad + 0.3) * (1 - io(t, T - 0.8, T - 0.4))} />
        </L>
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WM} keys={new Set(["moises", "40", "cuarenta", "nebo", "entrar", "murio", "jamas"])} />
      <Audio src={staticFile("zk12/moises.wav")} />
      <Audio src={staticFile("zk/songs/short1.mp3")} trimBefore={45 * FPS} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};

// ======================== JONÁS ========================
const WJ = toW(dj as unknown as R, { "Jonas": "Jonás", "Jonas?": "Jonás?", "Jonas.": "Jonás.", "Ninive": "Nínive", "Ninive,": "Nínive," });
const FJ = finder(WJ);
export const ZKJON_TOTAL = Math.round((WJ[WJ.length - 1].e + 0.35) * FPS);
const Sea: React.FC<{ t: number; dive: number }> = ({ t, dive }) => (
  <g>
    <path d={`M-1200 ${HZ} L 700 ${HZ} Q 420 1300 260 1460 Q 0 1640 -1200 1700 Z`} fill="#081220" />
    <path d={`M700 ${HZ} Q 420 1300 260 1460 Q 0 1640 -1200 1700`} stroke="#5A7A90" strokeWidth={4} fill="none" opacity={0.5} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${-1100 + (i % 6) * 230 + Math.sin(t + i) * 20} ${HZ + 40 + Math.floor(i / 6) * 120} q 50 -14 100 0`} stroke="#22364A" strokeWidth={3} fill="none" opacity={0.7} />)}
    {/* el gran pez se hunde */}
    <g transform={`translate(-330 ${1330 + dive * 200}) rotate(${-14 + dive * 14}) scale(0.85)`} opacity={1 - dive * 0.85}>
      <path d="M-260 40 Q -100 -120 160 -60 Q 260 -40 300 -120 L 380 -200 Q 360 -80 400 20 L 320 -30 Q 220 90 -20 110 Q -200 110 -260 40 Z" fill="#24364A" />
      <path d="M-260 40 Q -100 -120 160 -60 Q 0 -20 -260 40 Z" fill="#344A60" />
      <circle cx={-170} cy={10} r={9} fill="#05080C" />
      <path d="M300 -120 L 380 -200 Q 360 -80 400 20" stroke={P.rim} strokeWidth={4} fill="none" />
    </g>
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-200 + rnd(i) * 300} cy={1230 - ((t * 60 + rnd(i + 3) * 200) % 200)} r={4 + rnd(i + 1) * 6} fill="#9FB8D0" opacity={0.35 * (1 - dive)} />)}
  </g>
);
const Nineveh: React.FC<{ t: number; repent: number }> = ({ t, repent }) => (
  <g>
    <rect x={820} y={860} width={1500} height={HZ - 860} fill="#120C10" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={820 + i * 170} y={800 - (i % 3) * 40} width={70} height={HZ - 800 + (i % 3) * 40} fill="#160E12" />)}
    <path d={`M820 860 L 2320 860`} stroke={P.rim} strokeWidth={3} opacity={0.6} />
    {Array.from({ length: 90 }, (_, i) => <rect key={i} x={840 + rnd(i) * 1460} y={880 + rnd(i + 1) * 180} width={6} height={8} fill="#FFB060" opacity={(0.4 + 0.5 * Math.sin(t * 2 + i)) * (1 - repent * 0.75)} />)}
    {/* toda la ciudad de rodillas */}
    {Array.from({ length: 120 }, (_, i) => {
      const x = 840 + (i % 30) * 48 + rnd(i) * 10, y = HZ + 20 + Math.floor(i / 30) * 26;
      return <g key={i} opacity={repent}><circle cx={x} cy={y - 18} r={6} fill="#0A0608" /><path d={`M${x - 9} ${y} Q ${x} ${y - 24} ${x + 9} ${y} Z`} fill="#0A0608" /></g>;
    })}
  </g>
);
const Booth: React.FC<{ leaves: number }> = ({ leaves }) => (
  <g>
    <path d="M-120 0 L -110 -230 M 120 0 L 110 -230 M -130 -230 L 130 -230" stroke="#2A1A10" strokeWidth={10} strokeLinecap="round" />
    <path d="M-150 -230 Q 0 -280 150 -230" stroke="#2A1A10" strokeWidth={8} fill="none" />
    {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={-140 + i * 19} cy={-250 - (i % 3) * 10} rx={26 * leaves} ry={12 * leaves} fill="#1E2A16" />)}
  </g>
);
export const ZKJonas: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKJON_TOTAL / FPS;
  const tNoFue = FJ("no", 0, 1.6), tPre = FJ("predico", 0, 3.4), tArr = FJ("arrepint", 0, 5.2), tPero = FJ("pero", 0, 6.4), tPid = FJ("pidio", 0, 7.6);
  const tSen = FJ("sento", 0, 9.4), tArd = FJ("ardiera", 0, 11.0), tPreg = FJ("pregunta", 0, 12.8), tLib = FJ("libro", 0, 13.4), tNun = FJ("nunca", 0, 15.0);
  const cam = camPath(t, [
    [0, 120, 1380, 1.7], [tNoFue + 0.3, 80, 1400, 1.55], [tPre + 0.2, 1100, 1000, 1.05], [tArr + 0.4, 1250, 1000, 1.25],
    [tPero + 0.2, 520, 1250, 2.0], [tPid + 0.4, 520, 1220, 2.3], [tSen + 0.2, 760, 1120, 1.15], [tArd + 0.4, 850, 1060, 1.25],
    [tPreg + 0.2, 560, 900, 1.5], [tNun - 0.2, 520, 1180, 1.9], [T - 0.7, 500, 1200, 2.1], [T - 0.05, 120, 1380, 1.7],
  ]);
  const dive = io(t, 0.3, tPre);
  const onBeach = 1 - io(t, tPre - 0.2, tPre + 0.3) + io(t, T - 0.7, T - 0.2);
  const repent = io(t, tArr, tArr + 0.8);
  const angry = io(t, tPero, tPero + 0.5);
  return (
    <AbsoluteFill style={{ background: P.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.6}><Sky p={P} t={t} moon={false} /></L>
        <L cam={cam} dep={0.85}><Nineveh t={t} repent={repent} /></L>
        <L cam={cam} dep={1}>
          <rect x={-1400} y={HZ - 2} width={4300} height={1500} fill="url(#rground)" />
          <Sea t={t} dive={dive} />
          {/* el cerro al este de la ciudad */}
          <path d="M240 1500 Q 520 1180 820 1500 Z" fill="#1A1014" /><path d="M520 1265 Q 700 1330 820 1500" stroke={P.rim} strokeWidth={3} fill="none" opacity={0.6} />
          <g transform="translate(540 1300) scale(0.55)"><Booth leaves={io(t, tSen, tSen + 0.6)} /></g>
          {/* Jonás: en la playa (gancho y final) → en el cerro */}
          <g opacity={cl(onBeach)}><Person x={250} y={1560} s={0.38} look={JON} face={1} t={t} /></g>
          <g opacity={1 - cl(onBeach)}><Person x={540} y={1300} s={0.24} look={JON} face={1} t={t} tilt={-angry * 3} /></g>
          <circle cx={540} cy={1230} r={120} fill="url(#zglow)" opacity={angry * 0.5 * (1 - io(t, tSen, tSen + 0.4))} />
          <Pill x={1250} y={800} txt="NÍNIVE" p={P} on={io(t, tPre + 0.2, tPre + 0.5) * (1 - io(t, tArr - 0.1, tArr + 0.1))} />
          <Pill x={1250} y={800} txt="+120.000 PERSONAS" p={P} on={io(t, tArr + 0.2, tArr + 0.5) * (1 - io(t, tPero - 0.2, tPero))} />
          <Pill x={540} y={1110} txt="JONÁS 4:3" p={P} on={io(t, tPid + 0.2, tPid + 0.5) * (1 - io(t, tSen - 0.2, tSen))} lx={540} ly={1160} />
          <Pill x={540} y={1420} txt="JONÁS 4:11" p={P} on={io(t, tLib, tLib + 0.3) * (1 - io(t, T - 0.8, T - 0.4))} />
        </L>
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WJ} keys={new Set(["jonas", "pez", "ninive", "arrepintio", "morirse", "ardiera", "pregunta", "nunca"])} />
      <Audio src={staticFile("zk12/jonas.wav")} />
      <Audio src={staticFile("zk/songs/short2.mp3")} trimBefore={80 * FPS} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};
