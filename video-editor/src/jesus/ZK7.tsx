import React from "react";
import { useCurrentFrame } from "remotion";
import dg from "../../public/gigante/words.json";
import { FPS } from "../kit/Kit";
import { Glow, Ink, Raw, Scene, Shell, Sparks, finder, ip, words, RED, W, GOLD } from "./ZK5";

// ZK Dark (estilo original del canal) · Short de prueba: "Tenía 24 dedos" (2 Samuel 21:20)
const WG = words(dg as unknown as Raw, {});
const A = finder(WG);
export const ZKGIG_TOTAL = Math.round((WG[WG.length - 1].e + 0.35) * FPS);

const Giant: React.FC<{ t: number; x: number; y: number; s: number; arm: number }> = ({ t, x, y, s, arm }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink>
      <path d="M-170 0 L -130 -520 Q 0 -580 130 -520 L 170 0 Z" fill="#0B0807" stroke={W} strokeWidth={7} />
      <path d="M-130 -470 L 130 -470" stroke={W} strokeWidth={4} opacity={0.5} />
      <circle cx={0} cy={-660} r={130} fill="#0B0807" stroke={W} strokeWidth={7} />
      <path d="M-120 -620 Q 0 -540 120 -620 L 90 -520 Q 0 -480 -90 -520 Z" fill="#1A120C" stroke={W} strokeWidth={5} />
      <path d={`M130 -500 L ${230 + arm * 40} ${-640 - arm * 160}`} stroke="#0B0807" strokeWidth={70} strokeLinecap="round" />
      <path d={`M130 -500 L ${230 + arm * 40} ${-640 - arm * 160}`} stroke={W} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />
    </Ink>
    {[-48, 48].map((ex) => <ellipse key={ex} cx={ex} cy={-680} rx={22} ry={12 * (Math.sin(t * 1.4) > 0.97 ? 0.2 : 1)} fill={RED} />)}
    <g transform={`translate(${250 + arm * 40} ${-670 - arm * 160})`}><Hand t={t} count={0} s={0.55} /></g>
  </g>
);
const Hand: React.FC<{ t: number; count: number; s: number }> = ({ t, count, s }) => (
  <g transform={`scale(${s})`}>
    <Ink>
      <path d="M-120 120 Q -140 -20 -100 -60 L 100 -60 Q 140 -20 120 120 Q 100 220 0 230 Q -100 220 -120 120 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
      {[-62, -38, -14, 10, 34, 58].map((a, i) => { const len = 250 + (i === 2 || i === 3 ? 40 : i === 0 || i === 5 ? -60 : 0); return <g key={i} transform={`rotate(${a + Math.sin(t * 3 + i) * 2})`}><rect x={-24} y={-50 - len} width={48} height={len + 30} rx={24} fill="#0B0807" stroke={W} strokeWidth={7} /></g>; })}
    </Ink>
    {[-62, -38, -14, 10, 34, 58].map((a, i) => { const len = 250 + (i === 2 || i === 3 ? 40 : i === 0 || i === 5 ? -60 : 0); return count > i ? <g key={i} transform={`rotate(${a}) translate(0 ${-110 - len})`}><circle r={44} fill={RED} /><text y={17} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={W} transform={`rotate(${-a})`}>{i + 1}</text></g> : null; })}
  </g>
);
const Soldier: React.FC<{ x: number; y: number; s: number; back: number }> = ({ x, y, s, back }) => (
  <g transform={`translate(${x - back * 40} ${y}) scale(${s})`}><Ink>
    <path d="M-40 0 L -30 -150 Q 0 -165 30 -150 L 40 0 Z" fill="#0B0807" stroke={W} strokeWidth={5} />
    <circle cx={0} cy={-190} r={36} fill="#0B0807" stroke={W} strokeWidth={5} />
    <ellipse cx={38} cy={-90} rx={34} ry={50} fill="#0B0807" stroke={W} strokeWidth={5} />
  </Ink></g>
);

export const ZKGigante: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 0.6 : f / FPS;
  const t6 = A("6"), ty = A("y"), tp = A("pie.") || A("pie");
  const hits = [t6, ty, tp];
  return (
    <Shell f={f} t={t} cover={["24", "DEDOS"]} ws={WG} keys={new Set(["dedos", "24", "mano", "pie"])} audio="gigante/mix.wav" hits={hits} tint="rgba(30,4,0,0.8)">
      <Sparks t={t} />
      {/* 1 · el gigante sobre el ejército */}
      <Scene t={t} a={0} b={t6} tr={3} push={0.12}>
        <Glow x={540} y={760} r={520} o={1.4} c="211,15,23" />
        <Ink><path d="M0 1560 Q 540 1460 1080 1560 L 1080 1920 L 0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
        <Giant t={t} x={540} y={1600} s={1.25} arm={ip(t, 0.2, 1.2)} />
        {[90, 230, 850, 990].map((x, i) => <Soldier key={x} x={x} y={1800} s={0.8} back={ip(t, 0.4, 1.6) * (i < 2 ? 1 : -1)} />)}
      </Scene>
      {/* 2 · seis en cada mano */}
      <Scene t={t} a={t6} b={ty} tr={0} push={0.06}>
        <Glow x={540} y={900} r={560} o={1.2} c="255,236,190" />
        <g transform="translate(540 1240)"><Hand t={t} count={Math.min(6, Math.floor(ip(t, t6, ty - 0.1) * 6) + 1)} s={1.25} /></g>
      </Scene>
      {/* 3 · y seis en cada pie */}
      <Scene t={t} a={ty} b={99} tr={4} push={0.05}>
        <Glow x={540} y={1300} r={600} o={1.3} c="211,15,23" />
        <Ink><path d="M0 1560 L 1080 1560 L 1080 1920 L 0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
        <g transform={`translate(540 ${t < tp ? 1540 - (1 - ip(t, ty, tp)) * 900 : 1540})`}><Ink>
          <rect x={-90} y={-620} width={180} height={520} rx={60} fill="#0B0807" stroke={W} strokeWidth={7} />
          <path d="M-260 -40 Q -270 -140 -150 -150 L 220 -150 Q 300 -140 300 -40 Q 300 20 220 20 L -200 20 Q -270 20 -260 -40 Z" fill="#0B0807" stroke={W} strokeWidth={7} />
          {[-210, -130, -50, 30, 110, 190].map((x) => <ellipse key={x} cx={x + 60} cy={-6} rx={36} ry={30} fill="#0B0807" stroke={W} strokeWidth={6} />)}
        </Ink>
          {t > tp ? [-210, -130, -50, 30, 110, 190].map((x, i) => <circle key={x} cx={x + 60} cy={-6} r={10} fill={RED} opacity={ip(t, tp + i * 0.05, tp + i * 0.05 + 0.1)} />) : null}
        </g>
        {t > tp ? <g opacity={1 - ip(t, tp, tp + 0.8)}>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M540 1560 L ${540 + Math.cos((i / 10) * Math.PI + Math.PI) * (200 + ip(t, tp, tp + 0.5) * 500)} ${1560 + Math.sin((i / 10) * Math.PI + Math.PI) * 140}`} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />)}</g> : null}
      </Scene>
    </Shell>
  );
};
