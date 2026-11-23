import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/gigante/words.json";
import { YChar, YDefs } from "./YChar";
import { rnd } from "./Kit";

// Short 9:16 · "Tenía 24 dedos" (2 Samuel 21:20). Personaje réplica, ciclo perfecto: el final empalma con el inicio.
const FPS = 30, VW = 1080, VH = 1920;
const ws = (d as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + 0.12, e: c.timestamp[1] + 0.12 }));
const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => ws.filter((x) => norm(x.w) === w)[n]?.s ?? 0;
const last = (w: string) => { const l = ws.filter((x) => norm(x.w) === w); return l[l.length - 1]?.s ?? 0; };
export const GIG_TOTAL = Math.round((ws[ws.length - 1].e + 0.35) * FPS);
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (v: number, a: number, b: number) => { const p = cl((v - a) / (b - a)); return p * p * (3 - 2 * p); };
const RED = "#D30F17";

// mano de 6 dedos (guante negro con contorno de luz)
const SixHand: React.FC<{ x: number; y: number; s: number; rot?: number; count?: number; t: number }> = ({ x, y, s, rot = 0, count = 0, t }) => {
  const fingers = [-62, -38, -14, 10, 34, 58];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#rim)">
      <path d="M-120 120 Q -140 -10 -100 -60 L 100 -60 Q 140 -10 120 120 Q 104 220 0 230 Q -104 220 -120 120 Z" fill="#0C0D12" /><rect x={-70} y={200} width={140} height={260} rx={50} fill="#0C0D12" />
      {fingers.map((a, i) => {
        const len = 250 + (i === 2 || i === 3 ? 40 : i === 0 || i === 5 ? -60 : 0);
        const wig = Math.sin(t * 3 + i) * 2;
        return <g key={i} transform={`rotate(${a + wig})`}><rect x={-22} y={-50 - len} width={44} height={len + 20} rx={22} fill="#0C0D12" />
          {count > i ? <g transform={`translate(0 ${-60 - len - 46})`}><circle r={34} fill="#FFF" /><text y={13} textAnchor="middle" fontFamily="YCap" fontSize={40} fill="#0C0D12">{i + 1}</text></g> : null}</g>;
      })}
      <path d="M-150 60 Q -230 20 -250 -60" stroke="#0C0D12" strokeWidth={56} strokeLinecap="round" fill="none" opacity={0} />
      <path d="M-120 -40 Q 0 -70 120 -40" stroke="#2A2D3C" strokeWidth={6} fill="none" opacity={0.6} />
    </g>
  );
};
const Foot: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#rim)">
    <rect x={-70} y={-420} width={140} height={360} rx={50} fill="#0C0D12" />
    <path d="M-200 -40 Q -210 -110 -120 -120 L 160 -120 Q 230 -110 230 -40 Q 230 20 160 20 L -150 20 Q -210 20 -200 -40 Z" fill="#0C0D12" />
    {[-170, -110, -50, 10, 70, 130].map((tx, i) => <ellipse key={i} cx={tx + 40} cy={-70 - (i === 0 ? 0 : 6)} rx={30} ry={36} fill="#0C0D12" />)}
    <path d="M-190 -60 Q 0 -100 220 -60" stroke="#7A4A22" strokeWidth={18} fill="none" /><path d="M-40 -120 L -60 -300" stroke="#7A4A22" strokeWidth={16} /><path d="M40 -120 L 60 -300" stroke="#7A4A22" strokeWidth={16} />
  </g>
);
const Sky: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs><linearGradient id={`sk${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B1A3E" /><stop offset="45%" stopColor="#6A2E4A" /><stop offset="70%" stopColor="#E07A3A" /><stop offset="100%" stopColor="#F6B860" /></linearGradient></defs>
    <rect width={VW} height={VH} fill={`url(#sk${id})`} />
    <circle cx={760} cy={1180} r={150} fill="#FFD890" opacity={0.85} /><circle cx={760} cy={1180} r={420} fill="#FFB060" opacity={0.18} />
    <path d="M0 1320 Q 200 1200 420 1260 Q 640 1180 860 1250 Q 980 1220 1080 1260 L 1080 1920 L 0 1920 Z" fill="#6A3A3A" opacity={0.75} />
    <path d="M0 1420 Q 300 1340 560 1400 Q 820 1330 1080 1390 L 1080 1920 L 0 1920 Z" fill="#3E2430" />
    <path d="M0 1560 Q 540 1500 1080 1560 L 1080 1920 L 0 1920 Z" fill="#2A1820" />
  </g>
);
const Dust: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const k = cl((t - t0) / 0.9);
  if (t < t0) return null;
  return <g opacity={1 - k}>{Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI - Math.PI, r = 80 + k * (260 + rnd(i) * 200); return <circle key={i} cx={x + Math.cos(a) * r * 1.6} cy={y + Math.sin(a) * r * 0.35} r={30 + k * 60 * rnd(i + 5)} fill="#C9A27A" opacity={0.55} />; })}</g>;
};
const ZKCap: React.FC<{ txt: string; t: number; a: number; b: number; y: number }> = ({ txt, t, a, b, y }) => {
  if (t < a || t > b) return null;
  const p = cl((t - a) / 0.12);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: "Kit Poppins, YCap", fontWeight: 800, fontSize: 78, color: "#FFF", padding: "6px 26px", border: `7px solid ${RED}`, borderRadius: 14, background: "rgba(10,6,6,.55)", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>{txt}</span>
    </div>
  );
};

export const Gigante: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS, END = GIG_TOTAL / FPS;
  const tS1 = at("6"), tY1 = ws.find((w) => norm(w.w) === "y" && w.s > tS1)?.s ?? tS1 + 1.4, tE = at("está") || 99, tL = at("los") || 99, tY2 = (last("y") > tY1 + 0.1 ? last("y") : 99);
  const tPie = at("pie");
  const sh = t < tS1 ? 0 : t < tY1 ? 1 : t < tE ? 2 : t < tL ? 3 : t < tY2 ? 4 : 5;
  const lt = t - [0, tS1, tY1, tE, tL, tY2][sh];
  let scene: React.ReactNode = null;
  if (sh === 0) {
    // la mano llena el cuadro y se aleja: revela los 6 dedos (empalma con el final)
    const s = 4.2 - 2.9 * io(t, 0, 0.9);
    scene = <g><Sky id="a" /><SixHand x={540} y={1180 + (1 - io(t, 0, 0.9)) * 300} s={s} t={t} /></g>;
  } else if (sh === 1) {
    const n = Math.min(6, Math.floor(lt / ((tY1 - tS1) / 6.5)) + 1);
    scene = <g><Sky id="b" /><SixHand x={540} y={1240} s={1.3 + lt * 0.03} t={t} count={n} /></g>;
  } else if (sh === 2) {
    const stomp = tPie - 0.05;
    const fy = t < stomp ? 1500 - (1 - io(t, tY1, stomp)) * 900 : 1500;
    scene = <g><Sky id="c" /><Foot x={540} y={fy} s={1.3} /><Dust t={t} t0={stomp} x={540} y={1520} /></g>;
  } else if (sh === 3) {
    scene = (
      <g>
        <rect width={VW} height={VH} fill="#2A1A14" />
        <circle cx={540} cy={900} r={700} fill="#FFB86C" opacity={0.12} />
        <g transform={`translate(540 960) rotate(-4) scale(${1 + lt * 0.04})`}>
          <rect x={-420} y={-520} width={840} height={1040} rx={20} fill="#E8D4A8" />
          <rect x={-470} y={-560} width={940} height={70} rx={35} fill="#B98A5A" /><rect x={-470} y={490} width={940} height={70} rx={35} fill="#B98A5A" />
          {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-340} y={-440 + i * 64} width={680 - (i % 3) * 90} height={14} rx={7} fill="#8A7254" opacity={0.6} />)}
          <rect x={-350} y={-440 + 7 * 64 - 14} width={700} height={44} rx={10} fill={RED} opacity={0.35 * io(t, tE + 0.3, tE + 0.7)} />
        </g>
      </g>
    );
  } else if (sh === 4) {
    const back = io(t, tL + 0.4, tY2);
    scene = (
      <g>
        <Sky id="e" />
        {Array.from({ length: 9 }, (_, i) => <YChar key={i} id={`s${i}`} t={t + i} x={70 + i * 120} y={1880 + (i % 2) * 20 + back * 40} s={0.42} face={{ mouth: "o", brow: 1, eyeS: 1.1, eyeY: -1 }} robe="#7A8AA0" robe2="#4E5A6E" sash="#C9A15A" lean={-back * 8} />)}
        <YChar id="gig" t={t} x={540} y={1760} s={2.55} hair="beard" hairC="#2A1A12" robe="#8A6A3A" robe2="#5A4022" sash="#3A2A1A" face={{ mouth: "grin", brow: -0.6, browTilt: 0.9, eyeY: 1, lid: 0.2 }} armR={[110 + Math.sin(t * 2) * 5, 40]} armL={[60, 50]} />
      </g>
    );
  } else {
    const rise = io(t, tY2 + (END - tY2) * 0.45, END);
    scene = (
      <g>
        <Sky id="f" />
        <rect width={VW} height={VH} fill="#000" opacity={0.35} />
        <g transform={`translate(540 ${1200 + 260}) scale(${3.4 + io(t, tY2, END) * 0.4})`}><YChar id="gig2" t={t} x={0} y={0} s={1} headOnly hair="beard" hairC="#2A1A12" face={{ mouth: "flat", brow: -0.7, browTilt: 1, lid: 0.35, eyeY: 0.6 }} /></g>
        <SixHand x={540} y={1180 + (1 - rise) * 1500} s={1.3 + rise * 2.9} t={t} />
      </g>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={VW} height={VH}><YDefs l="#FFB86C" r="#9FD4F4" />{scene}</svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
      <ZKCap txt="24 DEDOS" t={t} a={ws[1]?.s ?? 0.3} b={tS1 - 0.05} y={360} />
      <ZKCap txt="2 SAMUEL 21:20" t={t} a={tE + 0.2} b={tL - 0.05} y={300} />
      <Audio src={staticFile("gigante/mix.wav")} />
    </AbsoluteFill>
  );
};
