import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import da from "../../public/ad/antes.json";
import dd from "../../public/ad/despues.json";
import { Captions, FPS, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { YChar, YDefs } from "./YChar";
import { rnd } from "./Kit";

// Antes / Después — misma idea (Noé), 5 s.
type R = { chunks: { text: string; timestamp: [number, number] }[] };
const toW = (d: R) => d.chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + 0.1, e: c.timestamp[1] + 0.1 }));
const WA = toW(da as unknown as R), WD = toW(dd as unknown as R);
export const AD_TOTAL = 150;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (v: number, a: number, b: number) => { const p = cl((v - a) / (b - a)); return p * p * (3 - 2 * p); };
const W = "#F2F2F2", RED = "#D30F17";

// ---------- ANTES: como lo hacíamos (ZK, dato contado, plano estático) ----------
export const Antes: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g filter="url(#ink)" transform={`translate(540 1150) scale(${1 + t * 0.01})`}>
          <path d="M-380 0 L 380 0 L 300 160 L -300 160 Z" fill="#050505" stroke={W} strokeWidth={7} />
          <rect x={-180} y={-160} width={360} height={160} fill="#050505" stroke={W} strokeWidth={7} />
          <path d="M-220 -160 L 0 -280 L 220 -160 Z" fill="#050505" stroke={W} strokeWidth={7} />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-540 + i * 100} ${300 + (i % 2) * 20} q 50 -30 100 0`} stroke={W} strokeWidth={5} fill="none" />)}
        </g>
      </svg>
      <Captions f={f} groups={groupWords(WA)} keys={new Set(["arca", "diluvio"])} hl={RED} y={300} />
      <Audio src={staticFile("ad/antes.wav")} />
    </AbsoluteFill>
  );
};

// ---------- DESPUÉS: método aplicado (imagen literal grande, pregunta en cuadro 0, mito roto, cámara viva) ----------
const Ark: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A5A34" /><stop offset="100%" stopColor="#4A2C16" /></linearGradient>
      <linearGradient id="cab" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B07A48" /><stop offset="100%" stopColor="#7A4E2A" /></linearGradient>
    </defs>
    <path d="M-430 -20 Q -420 120 -330 170 L 330 170 Q 420 120 440 -20 Z" fill="url(#hull)" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-428 ${-4 + i * 28} Q 0 ${10 + i * 28} 440 ${-4 + i * 28}`} stroke="#3A2210" strokeWidth={4} fill="none" opacity={0.6} />)}
    <path d="M-430 -20 Q -420 120 -330 170" stroke="#FFB86C" strokeWidth={8} fill="none" />
    <rect x={-250} y={-190} width={500} height={170} fill="url(#cab)" />
    {[-180, -60, 60, 180].map((x) => <rect key={x} x={x - 26} y={-150} width={52} height={44} rx={6} fill="#2A1A10" />)}
    <path d="M-300 -190 L 0 -300 L 300 -190 Z" fill="#6A3E20" /><path d="M-300 -190 L 0 -300" stroke="#FFB86C" strokeWidth={8} />
  </g>
);
export const Despues: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const arco = WD.find((w) => w.w.toLowerCase().startsWith("arco"))?.s ?? 3.6;
  const crack = io(t, arco - 0.2, arco + 0.5);
  const z = 1.0 + io(t, 0, 4.8) * 0.55;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <YDefs l="#FFB86C" r="#9FD4F4" />
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2A3A78" /><stop offset="55%" stopColor="#E88A5A" /><stop offset="100%" stopColor="#F6C88A" /></linearGradient>
          <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6A5A6E" /><stop offset="100%" stopColor="#2E2434" /></linearGradient>
        </defs>
        <g transform={`translate(540 1000) scale(${z}) translate(-540 ${-1000 + io(t, 0, 4.8) * -60})`}>
          <rect width={1080} height={1920} fill="url(#sky)" />
          {/* arcoíris que se rompe */}
          <g opacity={1 - crack * 0.85} transform={`translate(0 ${crack * 40})`}>
            {["#E84A4A", "#F49A3A", "#F6D84A", "#5AC85A", "#4A8AE8", "#7A5AE0"].map((c, i) => <path key={i} d={`M-60 1100 A 600 600 0 0 1 1140 1100`} transform={`translate(0 ${i * 26}) scale(${1 - i * 0.03}) translate(${i * 17} ${i * 10})`} stroke={c} strokeWidth={26} fill="none" opacity={0.75} />)}
            {crack > 0 ? <path d={`M540 500 L 520 620 L 560 700 L 530 820`} stroke="#1A0A0A" strokeWidth={10 * crack} fill="none" /> : null}
          </g>
          {/* monte Ararat */}
          <path d="M-80 1500 L 380 860 Q 540 760 700 860 L 1160 1500 Z" fill="url(#mt)" />
          <path d="M380 860 Q 540 760 700 860 L 640 900 Q 540 840 440 900 Z" fill="#EDEDF4" opacity={0.9} />
          <g transform="translate(540 1010) scale(0.78)"><Ark /></g>
          <YChar id="noe" t={t} x={600} y={940} s={0.28} hair="beard" hairC="#E8E8E8" robe="#C9B28A" robe2="#8A7454" sash="#6A2A2A" face={{ mouth: "flat", eyeX: 0.4 }} armR={[60, 30]} holdR={<g transform="translate(0 -10)"><path d="M-30 -50 Q -40 0 0 10 Q 40 0 30 -50 Z" fill="#7A2A3A" /></g>} />
          <path d="M0 1500 L 1080 1500 L 1080 1920 L 0 1920 Z" fill="#241A28" />
          {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={rnd(i) * 1080} cy={1520 + rnd(i + 3) * 360} rx={90} ry={14} fill="#3A2E46" opacity={0.6} />)}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)" }} />
      {/* subtítulo de la referencia: pequeño, arriba, clave en recuadro */}
      <Captions f={f} groups={groupWords(WD)} keys={new Set(["noé", "arco", "iris"])} hl="#3A7BFF" y={250} />
      <Audio src={staticFile("ad/despues.wav")} />
    </AbsoluteFill>
  );
};
