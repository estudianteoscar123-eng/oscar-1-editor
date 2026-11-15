import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import d1 from "../../public/serpiente/words.json";
import d2 from "../../public/gehena/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Defs, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Robe } from "../adultera/Dark";

// ZK Dark v3 · ritmo dopamínico: la cámara se reencuadra cada 0,6 s (escala, posición y giro distintos) con golpe de zoom,
// sacudida y destellos en las palabras clave; partículas y fuego siempre en movimiento.
const TH = 0.1;
const RED = "#D30F17", W = "#F2F2F2", INK = "#050505", GOLD = "#E8C66A";
const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => interpolate(v, [a, b], [o0, o1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
type Raw = { chunks: { text: string; timestamp: [number, number] }[] };
const words = (d: Raw, fix: Record<string, string>): Word[] => d.chunks.map((c, i) => { const w = c.text.trim(); return { w: fix[`${i}`] ?? fix[w] ?? w, s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }; });
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const finder = (ws: Word[]) => (w: string, n = 0) => ws.filter((x) => clean(x.w) === w)[n]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o?: number; c?: string }> = ({ x, y, r, o = 1, c = "242,242,242" }) => <circle cx={x} cy={y} r={r} fill={`rgba(${c},${0.18 * o})`} style={{ filter: "blur(40px)" }} />;
const Tag: React.FC<{ t: number; a: number; b: number; txt: string; y?: number }> = ({ t, a, b, txt, y = 1700 }) => <Serif txt={txt} y={y} size={58} ls={8} o={ip(t, a, a + 0.15) * ip(t, b - 0.15, b, 1, 0)} />;
const Scene: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => (t < a - 0.01 || t >= b ? null : <>{children}</>);
const Flames: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number; o?: number }> = ({ t, x, y, w, h, n = 9, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const fx = x - w / 2 + (i + 0.5) * (w / n);
      const fh = h * (0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i * 1.7)));
      return <g key={i}><path d={`M${fx - w / n / 1.6} ${y} Q${fx - w / n / 3} ${y - fh * 0.6} ${fx + Math.sin(t * 9 + i) * 14} ${y - fh} Q${fx + w / n / 3} ${y - fh * 0.5} ${fx + w / n / 1.6} ${y} Z`} fill="#FF5A14" opacity={0.9} /><path d={`M${fx - w / n / 3.5} ${y} Q${fx} ${y - fh * 0.5} ${fx + Math.sin(t * 11 + i) * 8} ${y - fh * 0.62} Q${fx + w / n / 5} ${y - fh * 0.3} ${fx + w / n / 3.5} ${y} Z`} fill="#FFD27A" /></g>;
    })}
    <ellipse cx={x} cy={y - h * 0.4} rx={w * 0.7} ry={h * 0.8} fill="rgba(255,90,20,0.18)" style={{ filter: "blur(30px)" }} />
  </g>
);
const Sparks: React.FC<{ t: number; n?: number; c?: string; up?: boolean }> = ({ t, n = 26, c = "#FF8A3A", up = true }) => (
  <g>{Array.from({ length: n }, (_, i) => { const sp = 0.25 + random(`s${i}`) * 0.5; const p = (t * sp + random(`p${i}`)) % 1; const x = 80 + random(`x${i}`) * 920 + Math.sin(t * 2 + i) * 30; const y = up ? 1900 - p * 1900 : p * 1900; return <circle key={i} cx={x} cy={y} r={2 + random(`r${i}`) * 4} fill={c} opacity={Math.sin(p * Math.PI)} />; })}</g>
);
// cámara: reencuadre cada 0,6 s + golpe de zoom al cambiar + sacudida en las palabras clave
const useCam = (t: number, hits: number[]) => {
  const k = Math.floor(t / 0.6);
  const tc = t - k * 0.6;
  const sc = [1.0, 1.22, 1.1, 1.32, 1.05, 1.18][k % 6];
  const ox = [0, -70, 60, 30, -40, 80][k % 6];
  const oy = [0, -60, 40, -110, 70, -30][k % 6];
  const rot = [0, -1.5, 1.2, 0, 2, -1][k % 6];
  const punch = ip(tc, 0, 0.12, 1.07, 1);
  const last = hits.filter((h) => h <= t).pop() ?? -9;
  const sh = Math.exp(-(t - last) * 9);
  const jx = (random(`jx${Math.floor(t * 30)}`) - 0.5) * 26 * sh, jy = (random(`jy${Math.floor(t * 30)}`) - 0.5) * 26 * sh;
  return { tf: `translate(${540 + ox + jx} ${960 + oy + jy}) rotate(${rot}) scale(${sc * punch * (1 + 0.06 * sh)}) translate(-540 -960)`, flash: sh * 0.28 };
};
const Shell: React.FC<{ f: number; t: number; cover: [string, string]; ws: Word[]; keys: Set<string>; audio: string; hits: number[]; tint: string; children: React.ReactNode }> = ({ f, t, cover, ws, keys, audio, hits, tint, children }) => {
  const cam = useCam(t, hits);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Defs />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><g transform={f < 3 ? undefined : cam.tf}>{children}</g></svg>
      {f >= 3 ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 45%, ${tint} 100%)` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: f < 3 ? 0 : cam.flash }} />
      {f < 3 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><Serif txt={cover[0]} y={1460} size={100} ls={4} /><Serif txt={cover[1]} y={1610} size={160} ls={6} color={RED} /></svg>
      ) : <Captions f={f} groups={groupWords(ws)} keys={keys} hl={RED} />}
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

// serpiente: erguida con patas (antes) o arrastrándose (después)
const Serpent: React.FC<{ t: number; x: number; y: number; s?: number; legs: number; up: number }> = ({ t, x, y, s = 1, legs, up }) => {
  const sw = Math.sin(t * 3) * 10;
  const neckY = -360 * up;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ink>
        <path d={`M-260 40 Q-140 ${-20 - 40 * up} -40 ${-30 * up} Q60 ${-60 * up} 80 ${neckY * 0.5} Q100 ${neckY * 0.85} ${40 + sw} ${neckY}`} fill="none" stroke="#1A3A22" strokeWidth={70} strokeLinecap="round" />
        <path d={`M-260 40 Q-140 ${-20 - 40 * up} -40 ${-30 * up} Q60 ${-60 * up} 80 ${neckY * 0.5} Q100 ${neckY * 0.85} ${40 + sw} ${neckY}`} fill="none" stroke={W} strokeWidth={6} strokeDasharray="30 22" opacity={0.6} />
        <ellipse cx={60 + sw} cy={neckY - 30} rx={78} ry={52} fill="#1A3A22" stroke={W} strokeWidth={6} />
      </Ink>
      {[[-20, 0], [36, 0]].map(([ex], i) => <ellipse key={i} cx={60 + sw + ex} cy={neckY - 44} rx={12} ry={7} fill="#E8FF4A" />)}
      <path d={`M${120 + sw} ${neckY - 20} l40 ${8 + Math.sin(t * 14) * 6} l-14 4 l14 6`} stroke={RED} strokeWidth={5} fill="none" />
      <g opacity={legs}>
        {[[-150, 0], [-60, -20], [20, -50], [70, -140]].map(([lx, ly], i) => (
          <path key={i} d={`M${lx} ${ly * up} l${-20 + Math.sin(t * 6 + i) * 10} 110 l-30 10`} stroke={W} strokeWidth={14} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};
const Tree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><Ink>
    <path d="M-40 0 Q-30 -260 -10 -420 L10 -420 Q30 -260 40 0 Z" fill="#0B0807" stroke={W} strokeWidth={6} />
    {[[-160, -480, 170], [130, -500, 160], [0, -620, 190]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#0B0807" stroke={W} strokeWidth={6} />)}
    {[[-120, -470], [90, -520], [20, -600], [-40, -520]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22} fill={RED} />)}
  </Ink></g>
);

const W1 = words(d1 as unknown as Raw, { "2": "del", "Ledén": "Edén", "lee": "Lee", "génesis": "Génesis" });
const a1 = finder(W1);
export const SERPIENTE_TOTAL = S(22.15);
const K1 = new Set(["serpiente", "edén", "arrastraba", "génesis", "castiga", "pecho", "polvo", "castigo", "antes", "astuto", "hablaba", "eva", "asustó", "realmente", "maldición"]);
export const Serpiente: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 1.2 : f / FPS;
  const hits = [a1("serpiente"), a1("arrastraba"), a1("castiga"), a1("polvo"), a1("castigo"), a1("astuto"), a1("hablaba"), a1("maldición")];
  const legs = ip(t, a1("andarás") - 0.05, a1("andarás") + 0.3, 1, 0);
  return (
    <Shell f={f} t={t} cover={["¿TENÍA", "PATAS?"]} ws={W1} keys={K1} audio="serpiente/mezcla.wav" hits={hits} tint="rgba(0,20,6,0.75)">
      <Glow x={540} y={900} r={620} o={1.2} c="120,200,120" />
      <Sparks t={t} c="#B8FF7A" n={18} />
      <Scene t={t} a={0} b={a1("lee")}>
        <Tree x={300} y={1450} s={0.9} />
        <Serpent t={t} x={600} y={1350} s={1.05} legs={1} up={1} />
      </Scene>
      <Scene t={t} a={a1("lee")} b={a1("dios")}>
        <Glow x={540} y={900} r={460} o={2} c="255,236,190" />
        <Ink>
          <path d="M540 1260 L170 1180 L170 700 L540 780 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
          <path d="M540 1260 L910 1180 L910 700 L540 780 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
        </Ink>
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M600 ${840 + i * 52} L860 ${800 + i * 52}`} stroke={i === 3 ? RED : W} strokeWidth={i === 3 ? 12 : 5} opacity={i === 3 ? ip(t, a1("atención") - 0.2, a1("atención") + 0.1) : 0.45} />)}
        <Tag t={t} a={a1("lee")} b={a1("dios")} txt="GÉNESIS 3:14" y={1450} />
      </Scene>
      <Scene t={t} a={a1("dios")} b={a1("si")}>
        <path d="M540 0 L380 1100 L700 1100 Z" fill="rgba(255,244,214,0.16)" />
        <Glow x={540} y={500} r={460} o={2.4} c="255,236,190" />
        <Serpent t={t} x={560} y={1350} s={1.05} legs={legs} up={ip(t, a1("andarás"), a1("polvo"), 1, 0)} />
        <g opacity={ip(t, a1("polvo") - 0.1, a1("polvo") + 0.2)}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={260 + random(`d${i}`) * 620} cy={1380 - ((t * 120 + random(`q${i}`) * 200) % 220)} r={6 + random(`w${i}`) * 10} fill="#8A7A60" opacity={0.6} />)}</g>
      </Scene>
      <Scene t={t} a={a1("si")} b={a1("era")}>
        <path d="M540 300 L540 1500" stroke={RED} strokeWidth={6} />
        <Serpent t={t} x={300} y={1150} s={0.55} legs={1} up={1} />
        <Serpent t={t} x={790} y={1150} s={0.55} legs={0} up={0} />
        <Serif txt="ANTES" y={1330} size={60} ls={6} o={ip(t, a1("antes") - 0.1, a1("antes") + 0.1)} />
      </Scene>
      <Scene t={t} a={a1("era")} b={a1("entonces")}>
        <Tree x={260} y={1450} s={0.8} />
        <Serpent t={t} x={600} y={1300} s={0.85} legs={1} up={1} />
        <g opacity={ip(t, a1("eva") - 0.1, a1("eva") + 0.2)}><Robe x={880} y={1480} s={0.8} /></g>
        <g opacity={ip(t, a1("hablaba") - 0.05, a1("hablaba") + 0.15)}><Ink><path d="M700 820 Q700 720 820 720 Q940 720 940 800 Q940 880 820 880 L760 880 L720 930 L735 875 Q700 860 700 820 Z" fill={W} /></Ink><circle cx={780} cy={800} r={10} fill={INK} /><circle cx={820} cy={800} r={10} fill={INK} /><circle cx={860} cy={800} r={10} fill={INK} /></g>
        <Tag t={t} a={a1("era")} b={a1("entonces")} txt="GÉNESIS 3:1" />
      </Scene>
      <Scene t={t} a={a1("entonces")} b={99}>
        <Glow x={540} y={900} r={520} o={1.6} c="211,15,23" />
        <g filter="brightness(0)"><Serpent t={t} x={560} y={1400} s={1.2} legs={1} up={1} /></g>
      </Scene>
    </Shell>
  );
};

// ===================== Gehena =====================
const W2 = words(d2 as unknown as Raw, { "gejena,": "Gehena,", "gejena": "Gehena", "41": "dios" });
const a2 = finder(W2);
export const GEHENA_TOTAL = S(22.4);
const K2 = new Set(["jesús", "infierno", "imaginario", "palabra", "gehena", "existía", "valle", "jerusalén", "reyes", "judá", "hijos", "fuego", "maldito", "mente", "advertirte"]);
const City: React.FC<{ y: number }> = ({ y }) => (
  <Ink><path d={`M60 ${y} L60 ${y - 160} L120 ${y - 160} L120 ${y - 200} L180 ${y - 200} L180 ${y - 160} L320 ${y - 160} L320 ${y - 260} L400 ${y - 300} L480 ${y - 260} L480 ${y - 160} L700 ${y - 160} L700 ${y - 220} L760 ${y - 220} L760 ${y - 160} L1020 ${y - 160} L1020 ${y} Z`} fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
);
const Idol: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g opacity={o} transform="translate(540 1050)">
    <Ink>
      <path d="M-170 380 L-150 -80 Q-150 -220 0 -230 Q150 -220 150 -80 L170 380 Z" fill="#120404" stroke={W} strokeWidth={7} />
      <path d="M-110 -200 Q-230 -330 -200 -420 Q-150 -300 -60 -230 Z M110 -200 Q230 -330 200 -420 Q150 -300 60 -230 Z" fill="#120404" stroke={W} strokeWidth={7} />
      <path d="M-180 60 L-320 -40 M180 60 L320 -40" stroke={W} strokeWidth={22} strokeLinecap="round" />
    </Ink>
    <ellipse cx={-50} cy={-130} rx={22} ry={12} fill="#FF5A14" opacity={0.7 + 0.3 * Math.sin(t * 8)} />
    <ellipse cx={50} cy={-130} rx={22} ry={12} fill="#FF5A14" opacity={0.7 + 0.3 * Math.sin(t * 8)} />
  </g>
);
export const Gehena: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 12.6 : f / FPS;
  const hits = [a2("infierno"), a2("gehena"), a2("existía"), a2("valle"), a2("quemaron"), a2("fuego"), a2("maldito"), a2("advertirte")];
  return (
    <Shell f={f} t={t} cover={["EL INFIERNO", "EXISTE"]} ws={W2} keys={K2} audio="gehena/mezcla.wav" hits={hits} tint="rgba(30,4,0,0.8)">
      <Sparks t={t} />
      <Scene t={t} a={0} b={a2("usó")}>
        <Glow x={540} y={1300} r={560} o={ip(t, a2("infierno") - 0.1, a2("infierno") + 0.3) * 2.4} c="255,90,20" />
        <Ink><path d="M0 1500 Q540 1300 1080 1500 L1080 1920 L0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
        <Robe x={540} y={1420} s={1.1} />
        {[160, 290, 790, 920].map((x, i) => <Robe key={x} x={x} y={1640} s={0.55} hood={i % 2 === 0} />)}
        <Flames t={t} x={540} y={1920} w={1080} h={ip(t, a2("infierno") - 0.1, a2("infierno") + 0.4, 0, 260)} n={12} />
      </Scene>
      <Scene t={t} a={a2("usó")} b={a2("era")}>
        <Glow x={540} y={900} r={480} o={2} c="255,90,20" />
        <Serif txt="גֵּיא הִנֹּם" y={960} size={150} color={GOLD} o={ip(t, a2("gehena") - 0.1, a2("gehena") + 0.2)} />
        <Flames t={t} x={540} y={1250} w={700} h={ip(t, a2("existía") - 0.1, a2("existía") + 0.3, 40, 300)} />
        <Tag t={t} a={a2("gehena")} b={a2("era")} txt="MATEO 10:28" y={1500} />
      </Scene>
      <Scene t={t} a={a2("era")} b={a2("donde")}>
        <City y={760} />
        <Ink><path d="M0 820 Q300 1500 540 1560 Q780 1500 1080 820 L1080 1920 L0 1920 Z" fill="#0B0807" stroke={W} strokeWidth={6} /></Ink>
        <Flames t={t} x={540} y={1560} w={420} h={180} n={7} />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={420 + i * 50 + Math.sin(t + i) * 30} cy={1400 - ((t * 90 + i * 70) % 500)} r={60 + i * 8} fill="rgba(120,120,120,0.15)" style={{ filter: "blur(12px)" }} />)}
      </Scene>
      <Scene t={t} a={a2("donde")} b={a2("un", 3)}>
        <Glow x={540} y={1200} r={600} o={2.6} c="255,60,10" />
        <Idol t={t} o={ip(t, a2("donde"), a2("donde") + 0.3)} />
        <Flames t={t} x={540} y={1500} w={760} h={ip(t, a2("quemaron") - 0.1, a2("fuego") + 0.2, 80, 420)} n={10} />
        <Tag t={t} a={a2("reyes")} b={a2("un", 3)} txt="2 REYES 16:3" />
      </Scene>
      <Scene t={t} a={a2("un", 3)} b={a2("y", 1)}>
        <Ink><path d="M0 820 Q300 1500 540 1560 Q780 1500 1080 820 L1080 1920 L0 1920 Z" fill="#070202" stroke={W} strokeWidth={6} /></Ink>
        {[[540, 1560, 380, 1100], [540, 1560, 760, 1000], [540, 1560, 300, 1450]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2} L${x2} ${y2}`} stroke={RED} strokeWidth={8} strokeDasharray={900} strokeDashoffset={900 * (1 - ip(t, a2("maldito") - 0.1 + i * 0.15, a2("maldito") + 0.4 + i * 0.15))} />)}
        <Flames t={t} x={540} y={1560} w={360} h={160} n={6} o={0.8} />
        <Tag t={t} a={a2("maldito")} b={a2("y", 1)} txt="JEREMÍAS 7:31" />
      </Scene>
      <Scene t={t} a={a2("y", 1)} b={99}>
        <Flames t={t} x={540} y={1920} w={1200} h={520} n={14} />
        <g transform={`translate(540 960) scale(${ip(t, a2("y", 1), a2("advertirte") + 0.4, 1, 1.6)}) translate(-540 -960)`}>
          <Ink>
            <path d="M380 1500 Q360 1100 430 980 Q540 900 650 980 Q720 1100 700 1500 Z" fill="#0B0807" stroke={W} strokeWidth={7} />
            <ellipse cx={540} cy={830} rx={110} ry={140} fill="#0B0807" stroke={W} strokeWidth={7} />
          </Ink>
          <ellipse cx={500} cy={820} rx={16} ry={9} fill={W} opacity={ip(t, a2("advertirte") - 0.4, a2("advertirte"))} />
          <ellipse cx={580} cy={820} rx={16} ry={9} fill={W} opacity={ip(t, a2("advertirte") - 0.4, a2("advertirte"))} />
        </g>
      </Scene>
    </Shell>
  );
};
