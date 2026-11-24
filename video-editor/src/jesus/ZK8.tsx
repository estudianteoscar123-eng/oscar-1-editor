import React from "react";
import { useCurrentFrame } from "remotion";
import dg from "../../public/zk8/gig.json";
import da from "../../public/zk8/ang.json";
import { FPS } from "../kit/Kit";
import { Robe } from "../adultera/Dark";
import { Glow, Ink, Raw, Scene, Shell, Tag, ip, words, RED, W, GOLD } from "./ZK5";

// ZK Dark (estilo original, más negro): 2 Shorts < 30 s en bucle.
const BK = "#050505";
const stp = (ws: ReturnType<typeof words>) => (w: string, n = 0) => {
  const L = ws.filter((x) => x.w.toLowerCase().replace(/[^a-záéíóúñ0-9.]/g, "").replace(/\.$/, "") === w);
  return (n < 0 ? L[L.length + n] : L[n])?.s ?? 0;
};
const Floor: React.FC<{ y?: number }> = ({ y = 1560 }) => <Ink><path d={`M0 ${y} Q 540 ${y - 70} 1080 ${y} L 1080 1920 L 0 1920 Z`} fill={BK} stroke={W} strokeWidth={6} /></Ink>;
const Scroll: React.FC<{ t: number; hl: number }> = ({ t, hl }) => (
  <g transform={`translate(540 980) rotate(-3)`}><Ink>
    <rect x={-360} y={-470} width={720} height={940} fill={BK} stroke={W} strokeWidth={8} />
    <rect x={-400} y={-510} width={800} height={60} rx={30} fill={BK} stroke={W} strokeWidth={7} /><rect x={-400} y={450} width={800} height={60} rx={30} fill={BK} stroke={W} strokeWidth={7} />
  </Ink>
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-290} y={-400 + i * 70} width={580 - (i % 3) * 80} height={10} fill={i === 6 ? RED : W} opacity={i === 6 ? hl : 0.4} />)}
  </g>
);

// ---------------- el gigante ----------------
const Hand: React.FC<{ t: number; count: number; s: number }> = ({ t, count, s }) => {
  const F = [-62, -38, -14, 10, 34, 58], L = (i: number) => 250 + (i === 2 || i === 3 ? 40 : i === 0 || i === 5 ? -60 : 0);
  return (
    <g transform={`scale(${s})`}>
      <Ink>
        <path d="M-120 120 Q -140 -20 -100 -60 L 100 -60 Q 140 -20 120 120 Q 100 220 0 230 Q -100 220 -120 120 Z" fill={BK} stroke={W} strokeWidth={8} />
        {F.map((a, i) => <g key={i} transform={`rotate(${a + Math.sin(t * 3 + i) * 2})`}><rect x={-24} y={-50 - L(i)} width={48} height={L(i) + 30} rx={24} fill={BK} stroke={W} strokeWidth={7} /></g>)}
      </Ink>
      {F.map((a, i) => count > i ? <g key={i} transform={`rotate(${a}) translate(0 ${-110 - L(i)})`}><circle r={44} fill={RED} /><text y={17} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={W} transform={`rotate(${-a})`}>{i + 1}</text></g> : null)}
    </g>
  );
};
const Giant: React.FC<{ t: number; x: number; y: number; s: number; arm?: number; helm?: boolean; fall?: number; mouth?: number }> = ({ t, x, y, s, arm = 0, helm, fall = 0, mouth = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${fall * 78}) scale(${s})`}>
    <Ink>
      <path d="M-170 0 L -130 -520 Q 0 -580 130 -520 L 170 0 Z" fill={BK} stroke={W} strokeWidth={7} />
      <path d="M-170 0 L -130 -520 L -60 -540 L -90 0 Z" fill="url(#h1)" opacity={0.5} />
      <circle cx={0} cy={-660} r={130} fill={BK} stroke={W} strokeWidth={7} />
      {helm ? <path d="M-140 -700 Q 0 -860 140 -700 L 140 -660 L -140 -660 Z" fill={BK} stroke={GOLD} strokeWidth={7} /> : null}
      <path d={`M130 -500 L ${230 + arm * 40} ${-640 - arm * 160}`} stroke={BK} strokeWidth={70} strokeLinecap="round" />
    </Ink>
    {[-48, 48].map((ex) => <ellipse key={ex} cx={ex} cy={-680} rx={22} ry={12 * (Math.sin(t * 1.4) > 0.97 ? 0.2 : 1)} fill={RED} />)}
    {mouth > 0 ? <ellipse cx={0} cy={-600} rx={40} ry={10 + mouth * 30} fill={RED} /> : null}
    {arm > 0 ? <g transform={`translate(${250 + arm * 40} ${-670 - arm * 160})`}><Hand t={t} count={0} s={0.5} /></g> : null}
  </g>
);
const WG = words(dg as unknown as Raw, { "Gath,": "Gat,", "Goliath.": "Goliat.", "Jonathan,": "Jonatán,", "extraño,": "extraño…" });
const G = stp(WG);
export const ZKGIG2_TOTAL = Math.round((WG[WG.length - 1].e + 0.3) * FPS);
export const ZKGigante2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 0.9 : f / FPS;
  const s1 = G("6"), y1 = WG.find((w) => w.s > s1 && /^y$/i.test(w.w))?.s ?? s1 + 1.5, pie = G("pie"), no = G("no"), ven = G("venía"), des = G("desafió"), has = G("hasta"), ult = G("y", -1);
  const hits = [s1, y1, pie, no, ven, des, has, ult];
  const keys = new Set(["dedos", "24", "veinticuatro", "mano", "pie", "samuel", "goliat", "israel", "jonatán", "mató", "extraño"]);
  return (
    <Shell f={f} t={t} cover={["24", "DEDOS"]} ws={WG} keys={keys} audio="zk8/gig.wav" hits={hits} tint="rgba(20,0,0,0.85)">
      <Scene t={t} a={0} b={s1} tr={3} push={0.12}>
        <Glow x={540} y={820} r={420} o={0.8} c="211,15,23" />
        <Floor />
        <Giant t={t} x={540} y={1600} s={1.25} arm={ip(t, 0.15, 1.1)} />
        {[90, 230, 850, 990].map((x, i) => <Robe key={x} x={x - ip(t, 0.4, 1.6) * (i < 2 ? 40 : -40)} y={1840} s={0.5} hood={i % 2 === 0} />)}
      </Scene>
      <Scene t={t} a={s1} b={y1} tr={0} push={0.06}>
        <Glow x={540} y={900} r={460} o={0.6} />
        <g transform="translate(540 1240)"><Hand t={t} count={Math.min(6, Math.floor(ip(t, s1, y1 - 0.1) * 6) + 1)} s={1.25} /></g>
      </Scene>
      <Scene t={t} a={y1} b={no} tr={4} push={0.05}>
        <Floor y={1580} />
        <g transform={`translate(540 ${t < pie ? 1560 - (1 - ip(t, y1, pie)) * 900 : 1560})`}><Ink>
          <rect x={-90} y={-620} width={180} height={520} rx={60} fill={BK} stroke={W} strokeWidth={7} />
          <path d="M-260 -40 Q -270 -140 -150 -150 L 220 -150 Q 300 -140 300 -40 Q 300 20 220 20 L -200 20 Q -270 20 -260 -40 Z" fill={BK} stroke={W} strokeWidth={7} />
          {[-210, -130, -50, 30, 110, 190].map((x) => <ellipse key={x} cx={x + 60} cy={-6} rx={36} ry={30} fill={BK} stroke={W} strokeWidth={6} />)}
        </Ink>{t > pie ? [-210, -130, -50, 30, 110, 190].map((x, i) => <circle key={x} cx={x + 60} cy={-6} r={11} fill={RED} opacity={ip(t, pie + i * 0.05, pie + i * 0.05 + 0.1)} />) : null}</g>
        {t > pie ? <g opacity={1 - ip(t, pie, pie + 0.7)}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M540 1580 L ${540 + Math.cos((i / 12) * Math.PI + Math.PI) * (220 + ip(t, pie, pie + 0.5) * 520)} ${1580 + Math.sin((i / 12) * Math.PI + Math.PI) * 150}`} stroke={W} strokeWidth={6} strokeLinecap="round" />)}</g> : null}
      </Scene>
      <Scene t={t} a={no} b={ven} tr={1} push={0.06}>
        <Scroll t={t} hl={ip(t, no + 0.8, no + 1.3)} />
        <Tag t={t} a={no + 0.9} b={ven} txt="2 SAMUEL 21:20" y={1640} />
      </Scene>
      <Scene t={t} a={ven} b={des} tr={2} push={0.08}>
        <Ink><path d="M120 1500 L 120 900 L 960 900 L 960 1500 Z" fill={BK} stroke={W} strokeWidth={6} /><path d="M420 1500 L 420 1150 Q 540 1040 660 1150 L 660 1500 Z" fill="#000" stroke={W} strokeWidth={6} /></Ink>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={120 + i * 180} y={860} width={120} height={60} fill={BK} stroke={W} strokeWidth={5} filter="url(#ink)" />)}
        <Floor />
        <Giant t={t} x={300} y={1700} s={0.62} />
        <Giant t={t} x={780} y={1700} s={0.78} helm />
        <Tag t={t} a={ven + 0.6} b={des} txt="GAT" y={760} />
      </Scene>
      <Scene t={t} a={des} b={has} tr={0} push={0.1}>
        <Glow x={540} y={700} r={420} o={0.7} c="211,15,23" />
        <Floor />
        <Giant t={t} x={540} y={1640} s={1.35} mouth={Math.abs(Math.sin(t * 9))} />
        {Array.from({ length: 7 }, (_, i) => <Robe key={i} x={80 + i * 150} y={1860} s={0.42 - ip(t, des, has) * 0.08} hood={i % 2 === 1} />)}
      </Scene>
      <Scene t={t} a={has} b={ult} tr={3} push={0.06}>
        <Floor />
        <Giant t={t} x={680} y={1600} s={1.0} fall={ip(t, has + 1.4, has + 2.3)} />
        <g transform={`translate(${280 + ip(t, has, has + 1.2) * 120} 1600)`}><Robe x={0} y={0} s={0.8} /><path d="M40 -230 L 260 -420" stroke={GOLD} strokeWidth={14} strokeLinecap="round" opacity={ip(t, has + 0.9, has + 1.2)} /></g>
        <Tag t={t} a={has + 0.5} b={ult} txt="JONATÁN" y={520} />
      </Scene>
      <Scene t={t} a={ult} b={99} tr={4} push={0.04}>
        <Glow x={540} y={760} r={420} o={0.5} c="211,15,23" />
        <Giant t={t} x={540} y={2000 - ip(t, ult, ult + 1.2) * 300} s={1.9} />
        <g transform={`translate(540 ${1900 - ip(t, ult + 1.0, ult + 2.0) * 760})`}><Hand t={t} count={0} s={0.6 + ip(t, ult + 1.0, ult + 2.0) * 0.8} /></g>
      </Scene>
    </Shell>
  );
};

// ---------------- el ángel ----------------
const Tent: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <path d={`M${x - 60 * s} ${y} L ${x} ${y - 90 * s} L ${x + 60 * s} ${y} Z`} fill={BK} stroke={W} strokeWidth={4} filter="url(#ink)" />;
const Body: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#ink)"><path d="M-110 0 Q -110 -40 -60 -40 L 70 -40 Q 110 -40 110 0 Z" fill={BK} stroke={W} strokeWidth={5} /><circle cx={-130} cy={-18} r={30} fill={BK} stroke={W} strokeWidth={5} /></g>
);
const Angel: React.FC<{ t: number; x: number; y: number; s: number; wing: number; sword: number }> = ({ t, x, y, s, wing, sword }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-420} r={380} o={1.4} />
    <Ink>
      {[-1, 1].map((sd) => <path key={sd} d={`M0 -520 Q ${sd * (260 + wing * 160)} ${-760 - wing * 120} ${sd * (420 + wing * 220)} ${-420 + wing * 40} Q ${sd * 240} -440 ${sd * 60} -360 Z`} fill={BK} stroke={W} strokeWidth={6} />)}
      <path d="M-90 0 Q -110 -300 -50 -460 Q 0 -490 50 -460 Q 110 -300 90 0 Z" fill={BK} stroke={W} strokeWidth={7} />
      <circle cx={0} cy={-540} r={70} fill={BK} stroke={W} strokeWidth={7} />
    </Ink>
    <ellipse cx={-24} cy={-545} rx={14} ry={6} fill={W} /><ellipse cx={24} cy={-545} rx={14} ry={6} fill={W} />
    <g transform={`translate(80 -380) rotate(${-60 + sword * 120})`}><rect x={-8} y={-360} width={16} height={340} fill={W} /><rect x={-40} y={-30} width={80} height={14} fill={GOLD} /><rect x={-16} y={-360} width={32} height={340} fill={W} opacity={0.25} style={{ filter: "blur(8px)" }} /></g>
  </g>
);
const King: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Robe x={0} y={0} s={1} /><path d="M-60 -400 L -60 -460 L -30 -430 L 0 -470 L 30 -430 L 60 -460 L 60 -400 Z" fill={GOLD} transform={`translate(0 ${Math.sin(t * 8) * 4})`} /></g>
);
const WA = words(da as unknown as Raw, {});
const N = stp(WA);
export const ZKANG_TOTAL = Math.round((WA[WA.length - 1].e + 0.3) * FPS);
export const ZKAngel: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 8.2 : f / FPS;
  const se = N("se"), un = N("un"), al = N("al"), el = N("el"), yal = WA.find((w) => w.s > N("tierra") && /^y$/i.test(w.w))?.s ?? N("allí") - 0.2, est = N("está"), lo = N("y", -1);
  const hits = [se, un, al, el, yal, est, lo];
  const keys = new Set(["185.000", "mil", "soldados", "ángel", "noche", "cuerpos", "senaquerib", "hijos", "reyes", "aterrador", "despertaron"]);
  return (
    <Shell f={f} t={t} cover={["UNA", "NOCHE"]} ws={WA} keys={keys} audio="zk8/ang.wav" hits={hits} tint="rgba(10,0,20,0.85)">
      <Scene t={t} a={0} b={se} tr={3} push={0.1}>
        <Floor y={1500} />
        {Array.from({ length: 40 }, (_, i) => <Tent key={i} x={60 + (i % 10) * 108 + (Math.floor(i / 10) % 2) * 50} y={1300 + Math.floor(i / 10) * 150} s={0.6 + Math.floor(i / 10) * 0.15} />)}
        <text x={540} y={780} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={190} fill={RED} filter="url(#ink)">{Math.round(ip(t, 0.1, Math.max(0.2, se - 0.2)) * 185000).toLocaleString("es")}</text>
      </Scene>
      <Scene t={t} a={se} b={un} tr={0} push={0.06}>
        <circle cx={800} cy={420} r={90} fill={BK} stroke={W} strokeWidth={6} filter="url(#ink)" />
        <Floor y={1300} />
        {Array.from({ length: 9 }, (_, i) => <Body key={i} x={180 + (i % 3) * 330} y={1450 + Math.floor(i / 3) * 170} s={0.9} />)}
      </Scene>
      <Scene t={t} a={un} b={al} tr={2} push={0.08}>
        <Floor y={1500} />
        {Array.from({ length: 30 }, (_, i) => <Tent key={i} x={60 + (i % 10) * 108} y={1520 + Math.floor(i / 10) * 140} s={0.7} />)}
        <Angel t={t} x={540 + Math.sin(t * 0.8) * 60} y={1350} s={1.15} wing={ip(t, un, un + 1.0)} sword={ip(t, un + 0.8, al - 0.1)} />
      </Scene>
      <Scene t={t} a={al} b={el} tr={4} push={0.06}>
        <Glow x={540} y={1100} r={520} o={0.7} c="211,15,23" />
        <Floor y={1400} />
        {Array.from({ length: 15 }, (_, i) => <Body key={i} x={110 + (i % 5) * 215} y={1500 + Math.floor(i / 5) * 150} s={0.7} />)}
        <Tag t={t} a={al + 0.3} b={el} txt="AL AMANECER" y={760} />
      </Scene>
      <Scene t={t} a={el} b={yal} tr={1} push={0.07}>
        <Floor />
        <King x={420 + ip(t, el, yal) * 260} y={1640} s={0.9} t={t} />
        <Tag t={t} a={el + 0.3} b={yal} txt="SENAQUERIB" y={620} />
      </Scene>
      <Scene t={t} a={yal} b={est} tr={3} push={0.09}>
        <Glow x={540} y={1000} r={440} o={0.8} c="211,15,23" />
        <Floor />
        <King x={540} y={1640} s={0.95} t={t} />
        {[-1, 1].map((sd) => <g key={sd}><Robe x={540 + sd * 300} y={1700} s={0.75} hood /><path d={`M${540 + sd * 260} 1440 L ${540 + sd * (150 - ip(t, yal + 0.6, yal + 1.0) * 60)} ${1360}`} stroke={RED} strokeWidth={14} strokeLinecap="round" /></g>)}
      </Scene>
      <Scene t={t} a={est} b={lo} tr={1} push={0.06}>
        <Scroll t={t} hl={ip(t, est + 0.6, est + 1.1)} />
        <Tag t={t} a={est + 0.7} b={lo} txt="2 REYES 19:35" y={1640} />
      </Scene>
      <Scene t={t} a={lo} b={99} tr={0} push={0.05}>
        <Angel t={t} x={540} y={1600 + ip(t, lo, lo + 3) * 200} s={1.9 + ip(t, lo, lo + 3) * 0.6} wing={1} sword={0.3} />
      </Scene>
    </Shell>
  );
};
