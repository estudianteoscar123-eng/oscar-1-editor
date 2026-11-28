import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import dj from "../../public/zk14/juan.json";
import dd from "../../public/zk14/david.json";
import { FPS, KFONT } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, HZ, Pill, Sky, io } from "./RefNoe";
import { Cap, Defs, Dust, L, Person, camPath, finder, toW, type Look, type R } from "./ZK9";

// Plantilla ganadora (Noé): pregunta → mito roto a los 2 s → escándalo que escala → final sin respuesta.
// Un solo mundo, cámara calma, cuadro 0 = portada con título grande.
const P = DARK;
const RED = "#D30F17";
type Wd = { w: string; s: number; e: number };
const KING: Look = { robe: "#3A1E36", robeSh: "#1C0E1A", mantle: "#6A0A12", mantleSh: "#34060A", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "short" };
const QUEEN: Look = { robe: "#2A1A2E", robeSh: "#140C16", mantle: "#4A0C20", mantleSh: "#26060F", skin: "#7A5440", skinSh: "#43291E", hair: "#0E0806", beard: "none" };
const GIRL: Look = { robe: "#8A2A3A", robeSh: "#4A1420", mantle: "#C8A24A", mantleSh: "#7A6024", skin: "#8A6048", skinSh: "#4E3224", hair: "#0E0806", beard: "none" };
const JUAN: Look = { robe: "#5A4630", robeSh: "#2C2216", mantle: "#3A2A1A", mantleSh: "#1C140C", skin: "#6E4A36", skinSh: "#3A2418", hair: "#1A1210", beard: "long" };
const SOL: Look = { robe: "#2E2A44", robeSh: "#171522", mantle: "#6A0A12", mantleSh: "#34060A", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "short" };
const ADO: Look = { robe: "#3E4450", robeSh: "#1E2128", mantle: "#2A2018", mantleSh: "#140F0B", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "short" };

const Crown: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-48 0 L -52 -46 L -26 -20 L 0 -58 L 26 -20 L 52 -46 L 48 0 Z" fill="#C9A04A" stroke="#3A2A10" strokeWidth={3} />
    <circle cx={0} cy={-58} r={7} fill={RED} />
  </g>
);
const Torch: React.FC<{ x: number; y: number; t: number; k?: number; s?: number }> = ({ x, y, t, k = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-30} r={190} fill="url(#zglow)" opacity={0.8 + 0.2 * Math.sin(t * 9 + k)} />
    <rect x={-8} y={0} width={16} height={90} fill="#2A1A10" />
    <path d={`M-26 0 Q -30 -50 ${Math.sin(t * 11 + k) * 6} -95 Q 26 -50 26 0 Z`} fill="#FF7A2A" />
    <path d={`M-12 0 Q -14 -30 ${Math.sin(t * 13 + k) * 5} -60 Q 12 -30 12 0 Z`} fill="#FFD06A" />
  </g>
);

// Título grande del cuadro 0 (portada) mientras suena la primera frase
const Hook: React.FC<{ t: number; until: number; lead: string; key_: string }> = ({ t, until, lead, key_ }) => {
  if (t >= until) return null;
  const o = t > until - 0.15 ? (until - t) / 0.15 : 1;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, textAlign: "center", opacity: o, fontFamily: KFONT, fontWeight: 600, color: "#fff", textShadow: "0 6px 22px rgba(0,0,0,0.85)" }}>
      <div style={{ fontSize: 66, lineHeight: 1.1 }}>{lead}</div>
      <div style={{ display: "inline-block", marginTop: 14, fontSize: 112, lineHeight: 1.05, background: RED, padding: "4px 26px 10px", borderRadius: 10 }}>{key_}</div>
    </div>
  );
};

// ======================== JUAN EL BAUTISTA ========================
const Palace: React.FC<{ t: number; party: number }> = ({ t, party }) => (
  <g>
    <rect x={-800} y={300} width={3600} height={HZ + 120 - 300} fill="#120C10" />
    {[ -300, 250, 700, 1300, 1750, 2200].map((x, i) => (
      <g key={i}><rect x={x - 45} y={420} width={90} height={HZ + 120 - 420} fill="#1E1418" /><rect x={x + 25} y={420} width={20} height={HZ + 120 - 420} fill="#2A1E22" /><rect x={x - 65} y={400} width={130} height={36} fill="#24181C" /></g>
    ))}
    {[-30, 475, 1000, 1525, 1975].map((x, k) => <Torch key={k} x={x} y={720} t={t} k={k} s={0.9} />)}
    <rect x={-800} y={HZ + 120} width={3600} height={1300} fill="url(#rground)" />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${1000 + (i - 8) * 30} ${HZ + 120} L ${1000 + (i - 8) * 260} 2600`} stroke="#0A0607" strokeWidth={2} opacity={0.5} />)}
    {/* invitados al fondo */}
    {Array.from({ length: 14 }, (_, i) => <Person key={i} x={560 + i * 70} y={HZ + 130} s={0.18} look={i % 2 ? KING : QUEEN} face={i % 2 ? 1 : -1} t={t + i} cup={i % 3 === 0} op={0.55 * party} />)}
  </g>
);
const Prison: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={40} y={760} width={520} height={HZ + 380 - 760} fill="#07050A" />
    <rect x={260} y={820} width={90} height={110} fill="#1A2030" opacity={0.8} />
    <path d="M260 820 L 350 820 L 470 1500 L 140 1500 Z" fill="rgba(160,180,220,0.08)" />
    <Person x={310} y={HZ + 360} s={0.5} look={JUAN} face={1} t={t} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={60 + i * 60} y={760} width={14} height={HZ + 380 - 760} fill="#2A2A30" />)}
    <rect x={40} y={760} width={520} height={18} fill="#2A2A30" />
  </g>
);
const Platter: React.FC<{ x: number; y: number; s: number; reveal: number }> = ({ x, y, s, reveal }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={10} cy={14} rx={260} ry={40} fill="rgba(0,0,0,0.5)" />
    <ellipse cx={0} cy={0} rx={240} ry={56} fill="#B8B4BC" /><ellipse cx={0} cy={-6} rx={200} ry={42} fill="#8A8690" />
    <path d="M-170 -10 Q -160 -170 0 -180 Q 160 -170 170 -10 Z" fill="#E8E2D6" />
    <path d="M-170 -10 Q -160 -170 0 -180 Q -60 -120 -40 -10 Z" fill="#C8C0B0" />
    <path d={`M-120 -10 Q -90 ${-40 - reveal * 20} -40 -14 Q 10 ${-60 - reveal * 30} 70 -12 Q 120 ${-30 - reveal * 10} 150 -10 Z`} fill={RED} opacity={0.35 + reveal * 0.65} />
    <path d="M170 -10 Q 160 -170 0 -180" stroke={P.rim} strokeWidth={5} fill="none" />
  </g>
);
const WJ = toW(dj as unknown as R, { bautista: "Bautista" });
const FJ = finder(WJ);
export const ZKJUAN_TOTAL = Math.round((WJ[WJ.length - 1].e + 0.4) * FPS);
export const ZKJuan: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKJUAN_TOTAL / FPS;
  const tY = FJ("y", 0, 2.4), tPre = FJ("preso", 0, 4.6), tCum = FJ("cumple", 0, 6.6), tBai = FJ("bailo", 0, 8.2), tGus = FJ("gusto", 0, 9.4), tJur = FJ("juro", 0, 10.4);
  const tMad = FJ("madre", 0, 11.8), tCab = FJ("cabeza", 0, 13.0), tBan = FJ("bandeja", 0, 14.2), tRey = FJ("rey", 2, 15.0), tDio = FJ("dio", 0, 15.8);
  const cam = camPath(t, [
    [0, 1000, 1225, 2.4], [tY + 0.1, 1000, 1215, 2.2], [tPre, 320, 1290, 1.6], [tCum - 0.1, 330, 1290, 1.55], [tCum + 0.6, 980, 1120, 0.95],
    [tBai + 0.2, 800, 1130, 1.55], [tGus + 0.2, 990, 1080, 1.7], [tJur + 0.6, 990, 1080, 1.8], [tMad + 0.2, 1150, 1110, 1.6],
    [tCab + 0.1, 320, 1290, 1.9], [tBan - 0.1, 330, 1290, 1.85], [tBan + 0.3, 1000, 1220, 2.2], [tDio, 990, 1100, 1.5], [T - 0.05, 1000, 1225, 2.4],
  ]);
  const dance = io(t, tBai - 0.2, tBai + 0.2) * (1 - io(t, tJur + 0.8, tJur + 1.2));
  const sway = Math.sin(t * 6) * 14 * dance;
  const whisper = io(t, tMad - 0.2, tMad + 0.3);
  const reveal = io(t, tBan, tBan + 0.6);
  const lastHit = io(t, tDio, tDio + 0.15) * (1 - io(t, tDio + 0.3, tDio + 0.9));
  return (
    <AbsoluteFill style={{ background: P.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.6}><Sky p={P} t={t} /></L>
        <L cam={cam} dep={1}>
          <Palace t={t} party={io(t, tCum, tCum + 0.5)} />
          <Prison t={t} />
          {/* trono */}
          <path d="M920 1200 L 920 960 Q 1000 900 1080 960 L 1080 1200 Z" fill="#C9A04A" opacity={0.85} /><path d="M940 1200 L 940 985 Q 1000 940 1060 985 L 1060 1200 Z" fill="#2A0A10" />
          <Person x={1000} y={HZ + 125} s={0.42} look={KING} face={-1} t={t} cup={t < tJur} armUp={io(t, tJur - 0.2, tJur + 0.2) * 0.9 * (1 - io(t, tMad, tMad + 0.3))} />
          <Crown x={1000 - 3} y={HZ + 125 - 0.42 * 612} s={0.4} />
          <Person x={800 + sway} y={HZ + 150} s={0.36} look={GIRL} face={1} t={t * (1 + dance * 2)} tilt={sway * 0.4} armUp={dance * (0.6 + 0.4 * Math.sin(t * 6))} />
          <Person x={1200 - whisper * 330} y={HZ + 150} s={0.4} look={QUEEN} face={-1} t={t} op={io(t, tCum, tCum + 0.4)} />
          {/* mesa y bandeja */}
          <rect x={760} y={HZ + 175} width={480} height={26} fill="#2A1A14" /><rect x={760} y={HZ + 175} width={480} height={6} fill={P.rim} opacity={0.6} />
          <Platter x={1000} y={HZ + 168} s={0.42} reveal={reveal} />
          <Pill x={300} y={760} txt="PRESO" p={P} on={io(t, tPre, tPre + 0.3) * (1 - io(t, tCum - 0.1, tCum + 0.1))} />
          <Pill x={800} y={780} txt="MARCOS 6:22" p={P} on={io(t, tBai + 0.2, tBai + 0.5) * (1 - io(t, tGus, tGus + 0.2))} />
          <Pill x={1000} y={1050} txt="MATEO 14:11" p={P} on={io(t, tBan + 0.3, tBan + 0.6) * (1 - io(t, T - 0.6, T - 0.3))} />
        </L>
        <rect width={1080} height={1920} fill={RED} opacity={lastHit * 0.1} />
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      {t < tY - 0.05 ? <Hook t={t} until={tY - 0.05} lead="¿Te acuerdas cómo terminó" key_="Juan el Bautista?" /> : <Cap f={f} W={WJ as Wd[]} keys={new Set(["rio", "preso", "verdad", "bailo", "juro", "cabeza", "bandeja", "dio"])} />}
      <Audio src={staticFile("zk14/juan.wav")} />
      <Audio src={staticFile("zk/songs/short2.mp3")} trimBefore={80 * FPS} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};

// ======================== DAVID ========================
const Bedroom: React.FC<{ t: number; candle: number }> = ({ t, candle }) => (
  <g>
    <rect x={-800} y={300} width={3600} height={HZ + 120 - 300} fill="#100A0E" />
    <rect x={820} y={560} width={240} height={300} fill="#0A1020" /><path d="M820 560 L 1060 560 L 1060 860 L 820 860 Z" fill="none" stroke="#2A2026" strokeWidth={14} />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={830 + rnd(i) * 220} cy={570 + rnd(i + 3) * 280} r={1.5} fill="#fff" opacity={0.6} />)}
    <rect x={-800} y={HZ + 120} width={3600} height={1300} fill="url(#rground)" />
    <g opacity={candle}><Torch x={420} y={1080} t={t} s={0.55} /><Torch x={1420} y={1080} t={t} k={2} s={0.55} /></g>
  </g>
);
const Bed: React.FC<{ t: number; blankets: number; shiver: number; girl: number; dead: number }> = ({ t, blankets, shiver, girl, dead }) => {
  const sh = Math.sin(t * 40) * 3 * shiver * (1 - dead);
  return (
    <g>
      <rect x={560} y={1150} width={900} height={70} fill="#3A2418" /><rect x={560} y={1150} width={900} height={10} fill={P.rim} opacity={0.5} />
      <rect x={560} y={1220} width={30} height={90} fill="#2A1A10" /><rect x={1430} y={1220} width={30} height={90} fill="#2A1A10" />
      <rect x={1400} y={980} width={60} height={240} fill="#2A1A10" />
      {/* David: cabeza blanca, barba */}
      <g transform={`translate(${sh} 0)`}>
        <ellipse cx={640} cy={1118} rx={95} ry={36} fill="#D8D0C0" />
        <circle cx={665} cy={1072} r={52} fill="#7A5440" /><path d="M632 1085 Q 612 1150 690 1140 Q 718 1118 706 1088 Z" fill="#E8E8E8" /><path d="M618 1050 Q 650 1012 712 1044" stroke="#E8E8E8" strokeWidth={14} fill="none" /><circle cx={685} cy={1064} r={4} fill="#0A0606" />
        {Array.from({ length: 1 + Math.round(blankets * 4) }, (_, k) => <path key={k} d={`M700 ${1150 - k * 14} Q 1000 ${1080 - k * 16} 1380 ${1150 - k * 14} L 1380 ${1160 - k * 14} L 700 ${1160 - k * 14} Z`} fill={["#4A0C10", "#3A2A44", "#5A4A30", "#2A3A2A", "#4A3A30"][k]} />)}
      </g>
      {/* la joven (Abisag) acostada al lado */}
      <g opacity={girl}>
        <ellipse cx={760} cy={1104} rx={62} ry={26} fill="#E8E2D6" />
        <circle cx={770} cy={1080} r={32} fill="#8A6048" /><path d="M745 1066 Q 770 1040 800 1064 Q 820 1110 800 1140 Q 770 1120 745 1066 Z" fill="#0E0806" />
      </g>
    </g>
  );
};
const WD = toW(dd as unknown as R, { "Goliath?": "Goliat?", costaron: "acostaron", bautista: "Bautista" });
const FD = finder(WD);
export const ZKDAVID_TOTAL = Math.round((WD[WD.length - 1].e + 0.4) * FPS);
export const ZKDavid: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKDAVID_TOTAL / FPS;
  const tY = FD("y", 0, 2.4), tGol = FD("goliat", 0, 3.6), tVie = FD("viejo", 0, 4.4), tMan = FD("mantas", 0, 6.0), tBus = FD("buscaron", 0, 7.0), tHer = FD("hermosa", 0, 8.4);
  const tAco = FD("acostaron", 0, 9.4), tMur = FD("murio", 0, 11.4), tHij = FD("hijo", 0, 12.8), tHerm = FD("hermano", 0, 14.0), tPed = FD("pedirla", 0, 15.0);
  const cam = camPath(t, [
    [0, 760, 1130, 1.75], [tY + 0.1, 780, 1140, 1.6], [tGol + 0.3, 1000, 1150, 1.15], [tVie + 0.2, 760, 1130, 1.9], [tMan + 0.5, 960, 1160, 1.5],
    [tBus + 0.3, 1100, 1140, 1.15], [tHer + 0.3, 1300, 1080, 1.6], [tAco + 0.3, 780, 1130, 1.9], [tMur + 0.2, 960, 1150, 1.25],
    [tHij + 0.2, 340, 1080, 1.5], [tHerm + 0.3, 420, 1090, 1.45], [tPed + 0.2, 800, 1140, 1.8], [T - 0.05, 760, 1130, 1.75],
  ]);
  const blankets = io(t, tMan - 0.2, tMan + 0.6), girl = io(t, tAco - 0.2, tAco + 0.4), dead = io(t, tMur, tMur + 0.6);
  const walkIn = io(t, tBus + 0.4, tAco - 0.2);
  const sons = io(t, tHij - 0.2, tHij + 0.3), kill = io(t, tHerm + 0.1, tHerm + 0.6);
  return (
    <AbsoluteFill style={{ background: P.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.6}><Sky p={P} t={t} /></L>
        <L cam={cam} dep={1}>
          <Bedroom t={t} candle={1 - dead * 0.85} />
          <Bed t={t} blankets={blankets} shiver={io(t, tVie, tVie + 0.4)} girl={girl} dead={dead} />
          <Crown x={1430} y={975} s={0.5} />
          {/* aliento frío */}
          {Array.from({ length: 4 }, (_, k) => <circle key={k} cx={600 - ((t * 40 + k * 25) % 100)} cy={1070 - k * 6} r={8 + k * 3} fill="#C8D4E8" opacity={0.25 * io(t, tVie, tVie + 0.3) * (1 - dead)} />)}
          {/* la joven entra */}
          <Person x={1500 - walkIn * 250} y={HZ + 130} s={0.42} look={GIRL} face={-1} t={t} op={io(t, tBus + 0.3, tBus + 0.6) * (1 - girl)} />
          {/* los hijos: Salomón y Adonías */}
          <g opacity={sons}>
            <Person x={220} y={HZ + 130} s={0.42} look={SOL} face={1} t={t} armUp={kill * 0.8} />
            <Crown x={220 + 3} y={HZ + 130 - 0.42 * 612} s={0.4} />
            <g transform={`rotate(${kill * 80} 470 ${HZ + 130})`} opacity={1 - kill * 0.3}><Person x={470} y={HZ + 130} s={0.42} look={ADO} face={-1} t={t} /></g>
          </g>
          <Pill x={680} y={930} txt="1 REYES 1:1" p={P} on={io(t, tVie + 0.3, tVie + 0.6) * (1 - io(t, tBus - 0.1, tBus + 0.1))} />
          <Pill x={1330} y={860} txt="ABISAG" p={P} on={io(t, tHer, tHer + 0.3) * (1 - io(t, tAco, tAco + 0.2))} />
          <Pill x={300} y={760} txt="SALOMÓN" p={P} on={sons * (1 - io(t, tHerm - 0.1, tHerm + 0.1))} />
          <Pill x={560} y={880} txt="1 REYES 2:25" p={P} on={io(t, tHerm + 0.3, tHerm + 0.6) * (1 - io(t, tPed + 0.2, tPed + 0.5))} />
        </L>
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      {t < tY - 0.05 ? <Hook t={t} until={tY - 0.05} lead="¿Te acuerdas cómo terminó" key_="el rey David?" /> : <Cap f={f} W={WD as Wd[]} keys={new Set(["goliat", "viejo", "calor", "mantas", "hermosa", "acostaron", "murio", "hijo", "hermano", "pedirla"])} />}
      <Audio src={staticFile("zk14/david.wav")} />
      <Audio src={staticFile("zk/songs/short3.mp3")} volume={(fr) => 0.24 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};
