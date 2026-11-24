import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/est3/voz.json";
import { Captions, FPS, groupWords } from "../kit/Kit";
import { Defs } from "../judas/Dark";
import { YChar, YDefs } from "./YChar";
import { rnd } from "./Kit";

// Mismo guion en 3 estilos. Subtítulo SIEMPRE con recuadro rojo (ZK).
type R = { chunks: { text: string; timestamp: [number, number] }[] };
const WS = (d as unknown as R).chunks.map((c) => ({ w: c.text.trim().replace("Noe", "Noé"), s: c.timestamp[0] + 0.05, e: c.timestamp[1] + 0.05 }));
export const EST3_TOTAL = Math.round((WS[WS.length - 1].e + 0.6) * FPS);
const RED = "#D30F17", W = "#F2F2F2";
const KEYS = new Set(["noé", "arcoíris", "arco", "iris"]);
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (v: number, a: number, b: number) => { const p = cl((v - a) / (b - a)); return p * p * (3 - 2 * p); };
const tArco = () => WS.find((w) => w.w.toLowerCase().startsWith("arco"))?.s ?? 3.4;
const tY = () => WS.find((w) => /^y$/i.test(w.w))?.s ?? 2.0;
const Cap: React.FC<{ f: number }> = ({ f }) => <Captions f={f} groups={groupWords(WS)} keys={KEYS} hl={RED} y={250} />;
const Rainbow: React.FC<{ crack: number; ink?: boolean }> = ({ crack, ink }) => (
  <g opacity={1 - crack * 0.85} transform={`translate(0 ${crack * 40})`}>
    {(ink ? [W, W, W, W] : ["#E84A4A", "#F49A3A", "#F6D84A", "#5AC85A", "#4A8AE8", "#7A5AE0"]).map((c, i) => (
      <path key={i} d="M-60 1100 A 600 600 0 0 1 1140 1100" transform={`translate(${i * 17} ${i * 36}) scale(${1 - i * 0.03})`} stroke={c} strokeWidth={ink ? 6 : 26} fill="none" opacity={ink ? 0.8 : 0.75} filter={ink ? "url(#ink)" : undefined} />
    ))}
    {crack > 0 ? <path d="M540 500 L 515 620 L 562 700 L 528 830 L 550 900" stroke={RED} strokeWidth={12 * crack} fill="none" strokeLinecap="round" /> : null}
  </g>
);

// ---------- 1 · ZK Dark (nuestro original) ----------
export const Est1ZK: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, crack = io(t, tArco() - 0.2, tArco() + 0.5);
  const z = 1 + io(t, 0, 5) * 0.35;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(540 1000) scale(${z}) translate(-540 -1000)`}>
          <circle cx={540} cy={900} r={480} fill="rgba(211,15,23,0.12)" style={{ filter: "blur(40px)" }} />
          <Rainbow crack={crack} ink />
          <g filter="url(#ink)">
            <path d="M-80 1500 L 380 860 Q 540 770 700 860 L 1160 1500 Z" fill="#050505" stroke={W} strokeWidth={7} />
            <g transform="translate(540 1010) scale(0.78)">
              <path d="M-430 -20 Q -420 120 -330 170 L 330 170 Q 420 120 440 -20 Z" fill="#050505" stroke={W} strokeWidth={9} />
              <rect x={-250} y={-190} width={500} height={170} fill="#050505" stroke={W} strokeWidth={9} />
              <path d="M-300 -190 L 0 -300 L 300 -190 Z" fill="#050505" stroke={W} strokeWidth={9} />
              <path d="M-428 30 Q 0 46 440 30 M -420 80 Q 0 96 430 80" stroke={W} strokeWidth={4} opacity={0.5} fill="none" />
            </g>
            <g transform="translate(600 930)"><path d="M-40 0 L -30 -150 Q 0 -165 30 -150 L 40 0 Z" fill="#050505" stroke={W} strokeWidth={6} /><circle cx={0} cy={-190} r={36} fill="#050505" stroke={W} strokeWidth={6} /></g>
          </g>
          <path d="M635 840 Q 660 820 668 790" stroke={RED} strokeWidth={10} fill="none" opacity={io(t, tY(), tY() + 0.4)} />
        </g>
      </svg>
      <Cap f={f} />
      <Audio src={staticFile("est3/voz.wav")} />
    </AbsoluteFill>
  );
};

// ---------- 2 · Referencia TikTok (ilustración saturada, cámara que viaja) ----------
const Noah2: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M-70 0 Q -80 -150 -50 -230 L 50 -230 Q 80 -150 70 0 Z" fill="#C9A26E" />
    <path d="M-50 -230 L 50 -230 L 40 -120 L -40 -120 Z" fill="#8A3A2A" opacity={0.85} />
    <circle cx={0} cy={-290} r={62} fill="#D8A27A" />
    <path d="M-58 -300 Q -60 -200 0 -180 Q 60 -200 58 -300 Q 30 -250 0 -250 Q -30 -250 -58 -300 Z" fill="#F0F0F0" />
    <path d="M-62 -310 Q 0 -380 62 -310 Q 40 -340 0 -340 Q -40 -340 -62 -310 Z" fill="#E8E8E8" />
    <circle cx={-20} cy={-300} r={7} fill="#2A1A10" /><circle cx={20} cy={-300} r={7} fill="#2A1A10" />
    <path d="M70 -170 Q 110 -200 130 -240" stroke="#C9A26E" strokeWidth={28} strokeLinecap="round" fill="none" />
    <g transform={`translate(132 -250) rotate(${Math.sin(t * 2) * 5})`}><path d="M-22 -40 L 22 -40 L 14 0 L -14 0 Z" fill="#B0303A" /><rect x={-3} y={0} width={6} height={22} fill="#D8C090" /></g>
  </g>
);
export const Est2Ref: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, crack = io(t, tArco() - 0.2, tArco() + 0.5);
  // cámara: del arcoíris (arriba) baja al arca y termina en la copa de Noé
  const k = io(t, 0.3, EST3_TOTAL / FPS);
  const z = 1 + k * 1.7, cx = 540 + k * 70, cy = 900 + k * 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E2C66" /><stop offset="50%" stopColor="#C8604A" /><stop offset="100%" stopColor="#F6B870" /></linearGradient>
          <linearGradient id="m2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7A6A86" /><stop offset="100%" stopColor="#2A2034" /></linearGradient>
          <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9A6A3E" /><stop offset="100%" stopColor="#3E2412" /></linearGradient>
          <radialGradient id="sun2"><stop offset="0%" stopColor="#FFE6A8" /><stop offset="100%" stopColor="#FFE6A8" stopOpacity="0" /></radialGradient>
        </defs>
        <g transform={`translate(540 960) scale(${z}) translate(${-cx} ${-cy})`}>
          <rect width={1080} height={1920} fill="url(#s2)" />
          <circle cx={820} cy={1180} r={380} fill="url(#sun2)" opacity={0.7} />
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={rnd(i) * 1080} cy={300 + rnd(i + 4) * 500} rx={160} ry={40} fill="#F4C8B0" opacity={0.25} />)}
          <Rainbow crack={crack} />
          <path d="M-80 1500 L 380 860 Q 540 770 700 860 L 1160 1500 Z" fill="url(#m2)" />
          <path d="M380 860 Q 540 770 700 860 L 640 905 Q 540 845 440 905 Z" fill="#F4F2FA" />
          <path d="M380 860 L 160 1180 L 260 1150 L 420 900 Z" fill="#FFFFFF" opacity={0.08} />
          <g transform="translate(540 1010) scale(0.78)">
            <path d="M-430 -20 Q -420 120 -330 170 L 330 170 Q 420 120 440 -20 Z" fill="url(#h2)" />
            {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-428 ${-4 + i * 28} Q 0 ${10 + i * 28} 440 ${-4 + i * 28}`} stroke="#2A160A" strokeWidth={4} fill="none" opacity={0.6} />)}
            <path d="M-430 -20 Q -420 120 -330 170" stroke="#FFC890" strokeWidth={8} fill="none" />
            <rect x={-250} y={-190} width={500} height={170} fill="#A8743E" /><rect x={120} y={-190} width={130} height={170} fill="#7A4E24" />
            {[-180, -60, 60, 180].map((x) => <rect key={x} x={x - 26} y={-150} width={52} height={44} rx={6} fill="#2A1A10" />)}
            <path d="M-300 -190 L 0 -300 L 300 -190 Z" fill="#6A3E20" /><path d="M-300 -190 L 0 -300" stroke="#FFC890" strokeWidth={8} />
          </g>
          <g transform="translate(610 935) scale(0.5)"><Noah2 t={t} /></g>
          <rect y={1500} width={1080} height={420} fill="#2A1E30" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)" }} />
      <Cap f={f} />
      <Audio src={staticFile("est3/voz.wav")} />
    </AbsoluteFill>
  );
};

// ---------- 3 · Estilo ¿Y si…? (personaje réplica) ----------
export const Est3Ysi: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, crack = io(t, tArco() - 0.2, tArco() + 0.5);
  const z = 1 + io(t, 0, 5) * 0.25;
  const worry = t > tArco();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <YDefs l="#FFB86C" r="#9FD4F4" />
        <defs><linearGradient id="s3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A4A8A" /><stop offset="60%" stopColor="#E89A6A" /><stop offset="100%" stopColor="#F8D09A" /></linearGradient></defs>
        <g transform={`translate(540 1100) scale(${z}) translate(-540 -1100)`}>
          <rect width={1080} height={1920} fill="url(#s3)" />
          <g style={{ filter: "blur(3px)" }}>
            <Rainbow crack={crack} />
            <path d="M-80 1300 L 380 760 Q 540 680 700 760 L 1160 1300 Z" fill="#5E4E6E" />
            <g transform="translate(540 880) scale(0.6)"><path d="M-430 -20 Q -420 120 -330 170 L 330 170 Q 420 120 440 -20 Z" fill="#7A4E2A" /><rect x={-250} y={-190} width={500} height={170} fill="#9A6A3E" /><path d="M-300 -190 L 0 -300 L 300 -190 Z" fill="#5A3418" /></g>
          </g>
          <rect y={1300} width={1080} height={620} fill="#3A2A2E" />
          <YChar id="noe3" t={t} x={540} y={1900} s={1.55} hair="beard" hairC="#EDEDED" robe="#D8C8A8" robe2="#9A8A6A" sash="#7A2A2A"
            face={{ mouth: worry ? "worry" : "smile", brow: worry ? 0.6 : 0, browTilt: worry ? -0.6 : 0, eyeX: worry ? -0.6 : 0.2, sweat: worry }}
            armR={[70, 50]} holdR={<g transform="translate(0 -40)"><path d="M-34 -70 L 34 -70 L 22 0 L -22 0 Z" fill="#B0303A" /><rect x={-5} y={0} width={10} height={36} fill="#D8C090" /></g>} />
        </g>
      </svg>
      <Cap f={f} />
      <Audio src={staticFile("est3/voz.wav")} />
    </AbsoluteFill>
  );
};
