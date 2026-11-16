import React from "react";
import { random, useCurrentFrame } from "remotion";
import d1 from "../../public/abismo/words.json";
import d2 from "../../public/legion/words.json";
import { FPS, S } from "../kit/Kit";
import { Serif } from "../sangre/Main";
import { Robe } from "../adultera/Dark";
import { Flames, Glow, Ink, Jesus, Raw, Scene, Shell, Sparks, Tag, finder, ip, words } from "./ZK5";

// ZK Dark (estilo que mejor funciona: Gehena 4.091, Lucifer 3.692). Una escena por idea, personajes y objetos actuando, transición distinta por corte.
const RED = "#D30F17", W = "#F2F2F2", INK = "#050505", GOLD = "#E8C66A";
const eo = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

const Pit: React.FC<{ t: number; open: number; glow?: number }> = ({ t, open, glow = 1 }) => (
  <g>
    <Ink><path d="M0 1250 Q540 1080 1080 1250 L1080 1920 L0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
    <ellipse cx={540} cy={1330} rx={330 * open} ry={95 * open} fill="#000" stroke={W} strokeWidth={6} filter="url(#ink)" />
    <ellipse cx={540} cy={1320} rx={300 * open} ry={70 * open} fill={RED} opacity={0.35 * glow * open} style={{ filter: "blur(18px)" }} />
    {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={470 + i * 24 + Math.sin(t + i) * 30} cy={1300 - ((t * 140 + i * 90) % 700)} r={50 + i * 8} fill="rgba(80,70,70,0.22)" opacity={open} style={{ filter: "blur(12px)" }} />)}
    {[[540, 1330, 250, 1200], [540, 1330, 860, 1230], [540, 1330, 380, 1500], [540, 1330, 720, 1520]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2 + 20} ${(y1 + y2) / 2} L${x2} ${y2}`} stroke={RED} strokeWidth={6} opacity={open} strokeDasharray={600} strokeDashoffset={600 * (1 - open)} />)}
  </g>
);
// criatura del abismo, se completa por partes
const Creature: React.FC<{ t: number; x: number; y: number; s?: number; crown?: number; face?: number; hair?: number; teeth?: number; tail?: number; dark?: boolean }> = ({ t, x, y, s = 1, crown = 0, face = 0, hair = 0, teeth = 0, tail = 0, dark }) => {
  const wing = Math.sin(t * 22) * 18;
  return (
    <g transform={`translate(${x} ${y + Math.sin(t * 5) * 8}) scale(${s})`}>
      {/* alas */}
      <g opacity={0.8}>{[-1, 1].map((sd) => <path key={sd} d={`M0 -40 Q${sd * 220} ${-200 + wing} ${sd * 300} ${-60 + wing} Q${sd * 160} -20 0 -10 Z`} fill="rgba(200,190,220,0.25)" stroke={W} strokeWidth={4} />)}</g>
      {/* cola de escorpión */}
      <g opacity={tail}><path d={`M-150 20 Q-300 0 -320 -140 Q-330 -260 ${-240 + Math.sin(t * 4) * 20} -300`} stroke={dark ? "#000" : "#2A1A10"} strokeWidth={34} fill="none" strokeLinecap="round" filter="url(#ink)" /><path d={`M${-250 + Math.sin(t * 4) * 20} -320 l40 -10 l-20 40 Z`} fill={RED} /></g>
      {/* cuerpo de caballo con armadura */}
      <Ink>
        <path d="M-180 60 Q-200 -60 -60 -70 L120 -80 Q200 -150 260 -210 Q300 -180 280 -130 L230 -40 Q260 60 200 110 L-140 120 Q-200 110 -180 60 Z" fill={dark ? "#000" : "#1A1210"} stroke={W} strokeWidth={6} />
        {[-120, -40, 40, 120].map((lx, i) => <path key={i} d={`M${lx} 110 l${Math.sin(t * 10 + i) * 10} 110`} stroke={W} strokeWidth={14} strokeLinecap="round" />)}
        {[-110, -30, 50].map((px) => <path key={px} d={`M${px} -60 l60 0 l-10 50 l-40 0 Z`} fill="#3A3A42" stroke={W} strokeWidth={4} />)}
      </Ink>
      {/* cabeza */}
      <g transform="translate(250 -200)">
        <g opacity={hair}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-30 + i * 10} -40 Q${-120 - i * 10 + Math.sin(t * 3 + i) * 15} ${40 + i * 18} ${-80 - i * 6} ${150 + i * 20}`} stroke="#5A3A1A" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g>
        <Ink><ellipse cx={0} cy={0} rx={70} ry={80} fill={face > 0.5 ? "#E8DCC8" : dark ? "#000" : "#1A1210"} stroke={W} strokeWidth={6} /></Ink>
        <g opacity={face}><circle cx={-24} cy={-10} r={9} fill={RED} /><circle cx={24} cy={-10} r={9} fill={RED} /><path d="M-30 -32 L-8 -22 M30 -32 L8 -22" stroke={INK} strokeWidth={6} /></g>
        <g opacity={teeth}><path d="M-34 30 L34 30 L28 52 L20 32 L12 54 L4 32 L-4 54 L-12 32 L-20 52 L-28 32 Z" fill={W} stroke={INK} strokeWidth={4} /></g>
        <g opacity={crown} transform={`translate(0 ${-80 - (1 - crown) * 60})`}><path d="M-60 0 L-56 -50 L-30 -20 L0 -64 L30 -20 L56 -50 L60 0 Z" fill={GOLD} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-70} r={8} fill="#FFE27A" /></g>
      </g>
    </g>
  );
};
const Grass: React.FC<{ t: number }> = ({ t }) => <g>{Array.from({ length: 60 }, (_, i) => { const x = (i / 60) * 1080 + (i % 3) * 6; return <path key={i} d={`M${x} 1700 Q${x + Math.sin(t * 2 + i) * 14} 1620 ${x + 8 + Math.sin(t * 2 + i) * 22} ${1560 - (i % 5) * 20}`} stroke="#4A7A3A" strokeWidth={8} fill="none" />; })}</g>;
const Hourglass: React.FC<{ t: number; p: number }> = ({ t, p }) => (
  <g transform="translate(540 940)">
    <Ink><path d="M-160 -260 L160 -260 L20 0 L160 260 L-160 260 L-20 0 Z" fill="none" stroke={W} strokeWidth={10} /><rect x={-200} y={-290} width={400} height={30} fill="#5A3A1A" stroke={W} strokeWidth={6} /><rect x={-200} y={260} width={400} height={30} fill="#5A3A1A" stroke={W} strokeWidth={6} /></Ink>
    <path d={`M${-140 * (1 - p)} ${-240 + p * 220} L${140 * (1 - p)} ${-240 + p * 220} L20 -10 L-20 -10 Z`} fill={RED} opacity={0.85} />
    <path d={`M-20 250 L20 250 L${150 * p} 250 L${50 * p} ${250 - p * 180} L${-50 * p} ${250 - p * 180} L${-150 * p} 250 Z`} fill={RED} opacity={0.85} />
    <path d={`M0 0 L0 250`} stroke={RED} strokeWidth={4} strokeDasharray="8 10" strokeDashoffset={-t * 80} />
  </g>
);
const Pig: React.FC<{ x: number; y: number; t: number; s?: number; dark?: number }> = ({ x, y, t, s = 1, dark = 0 }) => (
  <g transform={`translate(${x} ${y + Math.abs(Math.sin(t * 10 + x)) * -8}) scale(${s})`}>
    <Ink><ellipse cx={0} cy={0} rx={70} ry={42} fill={dark ? "#3A1414" : "#E8A0A8"} stroke={W} strokeWidth={4} /><circle cx={62} cy={-12} r={26} fill={dark ? "#3A1414" : "#E8A0A8"} stroke={W} strokeWidth={4} />{[-40, -10, 20, 45].map((lx) => <path key={lx} d={`M${lx} 36 l0 26`} stroke={W} strokeWidth={8} />)}</Ink>
    <circle cx={70} cy={-18} r={5} fill={dark ? RED : INK} />
  </g>
);
const Eyes: React.FC<{ t: number; n?: number; o?: number; shake?: number; pull?: number }> = ({ t, n = 26, o = 1, shake = 0, pull = 0 }) => (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => { const bx = 80 + random(`ex${i}`) * 920, by = 300 + random(`ey${i}`) * 1000; const x = bx + (540 - bx) * pull + Math.sin(t * 30 + i) * shake * 8, y = by + (1330 - by) * pull; const bl = (t * 0.7 + random(`eb${i}`)) % 1 < 0.06; return <g key={i}><ellipse cx={x - 16} cy={y} rx={10} ry={bl ? 1 : 6} fill={RED} /><ellipse cx={x + 16} cy={y} rx={10} ry={bl ? 1 : 6} fill={RED} /></g>; })}</g>
);
const Kneel: React.FC<{ t: number; x: number; y: number; k: number; plead?: number }> = ({ t, x, y, k, plead = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Ink>
      <path d={`M-90 ${-k * 120} Q-110 ${-300 - k * 40} -40 ${-380 + k * 120} L40 ${-380 + k * 120} Q110 ${-300 - k * 40} 90 ${-k * 120} Z`} fill="#2A2420" stroke={W} strokeWidth={6} />
      <circle cx={0} cy={-440 + k * 130} r={62} fill="#2A2420" stroke={W} strokeWidth={6} />
      {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 60} ${-320 + k * 120} Q${sd * 20 + Math.sin(t * 26) * 6 * plead} ${-240 + k * 100} ${sd * 6} ${-300 + k * 100}`} stroke={W} strokeWidth={14} fill="none" strokeLinecap="round" />)}
      {[[-60, 0], [60, 0]].map(([cx], i) => <path key={i} d={`M${cx} ${-k * 120} L${cx * (1 + k * 0.4)} 0`} stroke="#8A8A8A" strokeWidth={10} opacity={0.6} />)}
    </Ink>
    {[-1, 1].map((sd) => <circle key={sd} cx={sd * 22} cy={-446 + k * 130} r={7} fill={RED} />)}
  </g>
);

// ===================== Abismo =====================
const W1 = words(d1 as unknown as Raw, {});
const A = finder(W1);
export const ABISMO_TOTAL = S(25.6);
const K1 = new Set(["apocalipsis", "pozo", "criaturas", "nadie", "caballos", "guerra", "coronas", "oro", "hombre", "mujer", "león", "escorpión", "hierba", "sello", "dios", "cinco", "meses", "muerte", "nombre", "rey"]);
export const Abismo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? A("escorpión") + 0.4 : f / FPS;
  const hits = [A("pozo"), A("criaturas"), A("coronas"), A("león"), A("escorpión"), A("sello"), A("muerte", 1), A("rey")];
  return (
    <Shell f={f} t={t} cover={["¿EXISTEN?", ""]} ws={W1} keys={K1} audio="abismo/mezcla.wav" hits={hits} tint="rgba(30,0,0,0.8)">
      <Sparks t={t} c="#FF5A3A" n={18} />
      <Scene t={t} a={0} b={A("y")} tr={3} push={0.15}>
        <Glow x={540} y={1300} r={500} o={ip(t, A("abre"), A("pozo") + 0.4) * 2.4} c="211,15,23" />
        <Pit t={t} open={eo(ip(t, A("abre"), A("pozo") + 0.5))} />
        <Tag t={t} a={A("pozo")} b={A("y")} txt="APOCALIPSIS 9:1" />
      </Scene>
      <Scene t={t} a={A("y")} b={A("parecen")} tr={4}>
        <Pit t={t} open={1} />
        {Array.from({ length: 14 }, (_, i) => { const p = ip(t, A("y") + i * 0.12, A("y") + i * 0.12 + 1.6); return <g key={i} transform={`translate(${380 + (i % 5) * 80 + Math.sin(i * 2) * 120 * p} ${1300 - p * 1100}) scale(${0.12 + p * 0.1})`} opacity={p > 0 ? 1 : 0}><Creature t={t + i} x={0} y={0} dark /></g>; })}
        {[160, 920].map((x, i) => <g key={x} transform={`translate(${(i ? 1 : -1) * ip(t, A("criaturas"), A("ver"), 0, 80)} 0)`}><Robe x={x} y={1700} s={0.6} hood={i === 0} /></g>)}
      </Scene>
      <Scene t={t} a={A("parecen")} b={A("con")} tr={1}>
        <Glow x={540} y={900} r={480} o={1.6} c="211,15,23" />
        <Creature t={t} x={ip(t, A("parecen"), A("con"), 380, 520)} y={1100} s={1.15} />
        <Tag t={t} a={A("parecen")} b={A("escorpión") + 0.7} txt="APOCALIPSIS 9:7-10" />
      </Scene>
      <Scene t={t} a={A("con")} b={A("no")} tr={0} push={0.12}>
        <Glow x={540} y={800} r={480} o={1.8} c="211,15,23" />
        <g transform={`translate(540 960) scale(${ip(t, A("con"), A("cara"), 1.9, 1.5)}) translate(-${640 - ip(t, A("cola") - 0.2, A("cola") + 0.4, 0, 200)} -760)`}>
          <Creature t={t} x={400} y={980} s={1.05} crown={eo(ip(t, A("coronas") - 0.1, A("coronas") + 0.3))} face={ip(t, A("cara") - 0.1, A("cara") + 0.2)} hair={ip(t, A("cabello") - 0.1, A("cabello") + 0.3)} teeth={ip(t, A("dientes") - 0.1, A("dientes") + 0.2)} tail={ip(t, A("cola") - 0.1, A("cola") + 0.3)} />
        </g>
      </Scene>
      <Scene t={t} a={A("no")} b={A("solo")} tr={2}>
        <Glow x={540} y={1300} r={500} o={1.2} c="120,200,120" />
        <Grass t={t} />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${ip(t, A("no"), A("solo"), -200, 1300) - i * 260} ${700 + i * 120}) scale(0.32)`}><Creature t={t + i} x={0} y={0} dark /></g>)}
      </Scene>
      <Scene t={t} a={A("solo")} b={A("y", 2)} tr={3}>
        <Glow x={540} y={1100} r={500} o={1.2} />
        {[150, 330, 540, 750, 930].map((x, i) => { const sealed = i === 1 || i === 3; const hitP = ip(t, A("tienen"), A("dios") + 0.3); return <g key={x}><g transform={`translate(0 ${!sealed ? hitP * 30 : 0})`}><Robe x={x} y={1650} s={0.55} hood={i % 2 === 0} /></g>{sealed ? <g opacity={ip(t, A("sello") - 0.1, A("sello") + 0.2)}><circle cx={x} cy={1650 - 205} r={30} fill={GOLD} opacity={0.4} style={{ filter: "blur(6px)" }} /><path d={`M${x - 12} ${1445} L${x + 12} ${1445} M${x} ${1433} L${x} ${1457}`} stroke="#FFE9A8" strokeWidth={8} /></g> : <g transform={`translate(${x} ${900 + hitP * 450}) scale(0.18)`} opacity={hitP > 0 ? 1 : 0}><Creature t={t + i} x={0} y={0} dark /></g>}</g>; })}
        <Tag t={t} a={A("sello")} b={A("y", 2)} txt="APOCALIPSIS 9:4" />
      </Scene>
      <Scene t={t} a={A("y", 2)} b={A("y", 3)} tr={0}>
        <Glow x={540} y={900} r={460} o={1.4} c="211,15,23" />
        <Ink><rect x={300} y={560} width={480} height={560} rx={20} fill="#E8DCC8" stroke={W} strokeWidth={6} /><rect x={300} y={560} width={480} height={110} rx={20} fill={RED} /></Ink>
        <Serif txt={`${Math.min(5, 1 + Math.floor(ip(t, A("cinco"), A("muerte"), 0, 5)))}`} y={980} size={300} color={INK} />
        <Serif txt="MESES" y={1080} size={60} color={INK} ls={10} />
        {[150, 930].map((x) => <Kneel key={x} t={t} x={x} y={1720} k={ip(t, A("hombres") - 0.2, A("hombres") + 0.3)} plead={1} />)}
        <Tag t={t} a={A("cinco")} b={A("y", 3)} txt="APOCALIPSIS 9:5-6" />
      </Scene>
      <Scene t={t} a={A("y", 3)} b={A("ese")} tr={1}>
        <Glow x={540} y={1100} r={500} o={1} />
        <g transform={`translate(${ip(t, A("y", 3), A("ese"), 0, 260)} 0)`}><Ink><path d="M640 1700 Q600 1200 700 1000 Q760 930 820 1000 Q900 1200 880 1700 Z" fill="#0A0A0A" stroke={W} strokeWidth={6} /><circle cx={760} cy={960} r={70} fill="#0A0A0A" stroke={W} strokeWidth={6} /></Ink><circle cx={738} cy={950} r={9} fill={W} /><circle cx={778} cy={950} r={9} fill={W} /><path d="M880 1100 L1000 760" stroke="#BDBDBD" strokeWidth={10} /><path d="M1000 760 Q920 720 860 780" stroke="#BDBDBD" strokeWidth={10} fill="none" /></g>
        <g transform={`translate(${ip(t, A("y", 3), A("ese"), 0, 120)} 0)`}><Kneel t={t} x={300} y={1720} k={0.4} /><path d={`M360 1380 L${560 + Math.sin(t * 6) * 20} 1260`} stroke={W} strokeWidth={14} strokeLinecap="round" filter="url(#ink)" /></g>
      </Scene>
      <Scene t={t} a={A("ese")} b={A("y", 4)} tr={4}>
        <Pit t={t} open={1} glow={1.6} />
        <Serif txt="?" y={900} size={360} color={RED} o={0.6 + 0.4 * Math.sin(t * 6)} />
      </Scene>
      <Scene t={t} a={A("y", 4)} b={99} tr={0} push={0.25}>
        <Glow x={540} y={900} r={520} o={2.2} c="211,15,23" />
        <Ink><path d="M360 1500 L360 820 Q540 700 720 820 L720 1500 Z" fill="#0A0606" stroke={W} strokeWidth={8} /></Ink>
        <Ink><path d="M440 1500 Q420 1150 470 1000 Q540 950 610 1000 Q660 1150 640 1500 Z" fill="#000" stroke={W} strokeWidth={5} /><circle cx={540} cy={930} r={70} fill="#000" stroke={W} strokeWidth={5} /></Ink>
        <circle cx={518} cy={925} r={10} fill={RED} /><circle cx={562} cy={925} r={10} fill={RED} />
        <g opacity={ip(t, A("rey") - 0.1, A("rey") + 0.2)}><path d="M480 860 L486 800 L512 838 L540 784 L568 838 L594 800 L600 860 Z" fill={GOLD} stroke={INK} strokeWidth={5} /></g>
        <Flames t={t} x={540} y={1920} w={1100} h={300} n={14} />
        <Tag t={t} a={A("rey")} b={99} txt="APOCALIPSIS 9:11" />
      </Scene>
    </Shell>
  );
};

// ===================== Legión =====================
const W2 = words(d2 as unknown as Raw, { "18": "", "19": "atormentarnos", "40": "", "41": "al", "42": "abismo." }).filter((w) => w.w !== "");
const B2 = finder(W2);
export const LEGION_TOTAL = S(22.35);
const K2 = new Set(["legión", "demonios", "jesús", "rodillas", "atacaron", "suplicaron", "atormentarnos", "tiempo", "final", "fecha", "abismo", "cerdos", "mil", "creerlo"]);
export const Legion: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? B2("rodillas") + 0.5 : f / FPS;
  const B = B2;
  const hits = [B("legión"), B("rodillas"), B("suplicaron"), B("fecha"), B("abismo"), B("cerdos"), B("creerlo")];
  return (
    <Shell f={f} t={t} cover={["¿SUPLICARON?", ""]} ws={W2} keys={K2} audio="legion/mezcla.wav" hits={hits} tint="rgba(20,0,10,0.8)">
      <Sparks t={t} c="#FF3A3A" n={14} />
      <Scene t={t} a={0} b={B("cayó")} tr={3} push={0.15}>
        <Glow x={980} y={900} r={460} o={ip(t, B("vio"), B("jesús") + 0.3) * 2.6} c="255,236,190" />
        <Ink>{[[160, 1500, 140], [880, 1460, 120], [520, 1560, 100]].map(([x, y, w], i) => <path key={i} d={`M${x - w} ${y} L${x - w} ${y - 200} Q${x} ${y - 300} ${x + w} ${y - 200} L${x + w} ${y} Z`} fill="#141010" stroke={W} strokeWidth={5} />)}</Ink>
        <Eyes t={t} o={ip(t, 0, 0.4)} />
        <Kneel t={t} x={540} y={1720} k={0} />
        <g opacity={ip(t, B("jesús") - 0.2, B("jesús") + 0.2)}><Jesus t={t} x={960} y={1700} s={0.75} /></g>
      </Scene>
      <Scene t={t} a={B("cayó")} b={B("no")} tr={0}>
        <Glow x={800} y={900} r={460} o={2} c="255,236,190" />
        <Jesus t={t} x={860} y={1720} s={0.85} />
        <Kneel t={t} x={360} y={1720} k={eo(ip(t, B("cayó"), B("rodillas") + 0.2))} />
        <Eyes t={t} n={18} o={1 - ip(t, B("cayó"), B("rodillas") + 0.3) * 0.6} shake={1} />
      </Scene>
      <Scene t={t} a={B("no")} b={B("le")} tr={2}>
        <Glow x={540} y={900} r={460} o={1.2} c="211,15,23" />
        <Ink><path d={`M260 1500 Q${300 + ip(t, B("no"), B("atacaron")) * 60} 1100 ${420 + ip(t, B("no"), B("atacaron")) * 80} 900 L460 860 L440 820 L500 840 L490 790 L540 830`} stroke={W} strokeWidth={22} fill="none" strokeLinecap="round" /></Ink>
        <path d="M300 640 L780 1160 M780 640 L300 1160" stroke={RED} strokeWidth={50} strokeLinecap="round" strokeDasharray={720} strokeDashoffset={720 * (1 - ip(t, B("atacaron") - 0.1, B("atacaron") + 0.25))} />
      </Scene>
      <Scene t={t} a={B("le")} b={B("has")} tr={3}>
        <Glow x={540} y={900} r={460} o={1.6} c="255,236,190" />
        <Kneel t={t} x={540} y={1760} k={1} plead={1} />
        <Eyes t={t} n={22} shake={2} o={0.8} />
      </Scene>
      <Scene t={t} a={B("has")} b={B("sabían")} tr={4}>
        <Glow x={540} y={900} r={460} o={1.4} c="211,15,23" />
        <Eyes t={t} n={30} shake={3} />
        <Ink><path d="M200 620 Q200 460 540 460 Q880 460 880 620 Q880 780 560 780 L460 880 L480 780 Q200 780 200 620 Z" fill="#1A0A0A" stroke={W} strokeWidth={6} /></Ink>
        <Serif txt="¿ANTES DE" y={600} size={66} color={W} ls={4} o={ip(t, B("has"), B("has") + 0.2)} />
        <Serif txt="TIEMPO?" y={690} size={80} color={RED} ls={6} o={ip(t, B("tiempo") - 0.1, B("tiempo") + 0.2)} />
        <Tag t={t} a={B("has")} b={B("sabían")} txt="MATEO 8:29" />
      </Scene>
      <Scene t={t} a={B("sabían")} b={B("y", 1)} tr={0}>
        <Glow x={540} y={900} r={460} o={1.4} c="211,15,23" />
        <Hourglass t={t} p={ip(t, B("sabían"), B("y", 1) + 0.6)} />
      </Scene>
      <Scene t={t} a={B("y", 1)} b={B("prefirieron")} tr={1}>
        <Glow x={540} y={1300} r={520} o={2.4} c="211,15,23" />
        <Pit t={t} open={eo(ip(t, B("y", 1), B("rogaban") + 0.4))} />
        <Eyes t={t} n={26} shake={2} pull={ip(t, B("abismo") - 0.4, B("abismo") + 0.3) * 0.35} />
        <Tag t={t} a={B("abismo") - 0.2} b={B("prefirieron")} txt="LUCAS 8:31" y={1780} />
      </Scene>
      <Scene t={t} a={B("prefirieron")} b={B("si")} tr={2}>
        <Glow x={540} y={1000} r={500} o={1} c="211,15,23" />
        <Ink><path d="M0 1350 Q400 1250 760 1300 L760 1920 L0 1920 Z" fill="#1A1A10" stroke={W} strokeWidth={6} /></Ink>
        <path d="M760 1300 L1080 1300 L1080 1920 L760 1920 Z" fill="#0A1A2A" />
        {Array.from({ length: 12 }, (_, i) => { const run = ip(t, B("cerdos"), B("si"), 0, 1); return <Pig key={i} t={t} x={120 + (i % 6) * 110 + run * 420} y={1310 + Math.floor(i / 6) * 110 + (run > 0.6 ? (run - 0.6) * 900 : 0)} s={0.8} dark={ip(t, B("meterse"), B("meterse") + 0.4)} />; })}
        <Serif txt="2000" y={760} size={200} color={RED} o={ip(t, B("dos") - 0.1, B("mil") + 0.2)} />
        <Tag t={t} a={B("cerdos")} b={B("si")} txt="MARCOS 5:13" y={1840} />
      </Scene>
      <Scene t={t} a={B("si")} b={B("por")} tr={3} push={0.15}>
        <Glow x={540} y={800} r={540} o={2.6} c="255,236,190" />
        <Jesus t={t} x={540} y={1700} s={1.1} eyes={1} />
        <Eyes t={t} n={20} shake={3} o={0.7} />
      </Scene>
      <Scene t={t} a={B("por")} b={99} tr={0} push={0.2}>
        <Glow x={540} y={900} r={480} o={1.2} />
        {[220, 420, 660, 860].map((x, i) => <g key={x} transform={`rotate(${ip(t, B("cuesta"), B("creerlo"), 0, i % 2 ? 8 : -8)} ${x} 1700)`}><Robe x={x} y={1720} s={0.6} hood={i % 2 === 1} /></g>)}
        <Serif txt="?" y={980} size={380} color={RED} o={ip(t, B("creerlo") - 0.3, B("creerlo"))} />
      </Scene>
    </Shell>
  );
};
