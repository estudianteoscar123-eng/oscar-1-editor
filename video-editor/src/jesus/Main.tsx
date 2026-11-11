import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import d1 from "../../public/jesus/words.json";
import d2 from "../../public/querubin/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Robe } from "../adultera/Dark";

// ZK Dark básico (lo que mejor rindió): una imagen fuerte de tinta por idea, texto grande, pocos efectos.
const TH = 0.1;
const RED = "#D30F17", W = "#F2F2F2", INK = "#050505";
const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => interpolate(v, [a, b], [o0, o1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
type Raw = { chunks: { text: string; timestamp: [number, number] }[] };
const words = (d: Raw): Word[] => d.chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const finder = (ws: Word[]) => (w: string, n = 0) => ws.filter((x) => clean(x.w) === w)[n]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o?: number; c?: string }> = ({ x, y, r, o = 1, c = "242,242,242" }) => <circle cx={x} cy={y} r={r} fill={`rgba(${c},${0.18 * o})`} style={{ filter: "blur(40px)" }} />;
const Tag: React.FC<{ t: number; a: number; b: number; txt: string; y?: number }> = ({ t, a, b, txt, y = 1700 }) => <Serif txt={txt} y={y} size={58} ls={8} o={ip(t, a, a + 0.2) * ip(t, b - 0.2, b, 1, 0)} />;
const Scene: React.FC<{ t: number; a: number; b: number; children: React.ReactNode; z?: number }> = ({ t, a, b, children, z = 0.08 }) => {
  if (t < a - 0.01 || t >= b) return null;
  const k = ip(t, a, b);
  const pop = ip(t, a, a + 0.15, 1.08, 1);
  return <g transform={`translate(540 960) scale(${(1 + k * z) * pop}) translate(-540 -960)`}>{children}</g>;
};
const Shell: React.FC<{ f: number; cover: React.ReactNode; ws: Word[]; keys: Set<string>; audio: string; children: React.ReactNode; flash: number }> = ({ f, cover, ws, keys, audio, children, flash }) => (
  <AbsoluteFill style={{ background: INK }}>
    <Defs />
    <AbsoluteFill style={{ transform: `translate(${Math.sin(f / 13) * 5}px, ${Math.cos(f / 17) * 5}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
    </AbsoluteFill>
    {f >= 3 ? <Ash f={f} /> : null}
    <Paper f={f} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" }} />
    <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    {f < 3 ? cover : <Captions f={f} groups={groupWords(ws)} keys={keys} hl={RED} />}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
const coverTxt = (a: string, b: string) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><Serif txt={a} y={1420} size={110} ls={4} /><Serif txt={b} y={1560} size={140} ls={6} color={RED} /></svg>
);

// ===================== 1 · ¿Cómo se veía realmente Jesús? =====================
const W1 = words(d1 as unknown as Raw);
const a1 = finder(W1);
export const JESUS_TOTAL = S(29.65);
const K1 = new Set(["jesús", "real", "biblia", "belleza", "atractivo", "normal", "judas", "besarlo", "cuadro", "lana", "fuego", "sol", "uno", "dos"]);
const Painting: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 540, y = 900, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink>
      <rect x={-300} y={-420} width={600} height={800} fill="#0B0807" stroke="#E8C66A" strokeWidth={14} />
      <circle cx={0} cy={-150} r={180} fill="none" stroke="#E8C66A" strokeWidth={6} opacity={0.7} />
      <path d="M-130 -60 Q-140 -280 0 -290 Q140 -280 130 -60 Q150 120 110 250 L-110 250 Q-150 120 -130 -60 Z" fill="#C9A26B" opacity={0.5} />
      <ellipse cx={0} cy={-130} rx={90} ry={120} fill="#E8D2B0" stroke={W} strokeWidth={5} />
      <path d="M-40 -150 L-15 -150 M15 -150 L40 -150" stroke="#3A6FB0" strokeWidth={10} />
      <path d="M-60 -60 Q0 30 60 -60 Q40 0 0 10 Q-40 0 -60 -60 Z" fill="#B88A50" />
      <path d="M-220 380 Q-200 120 0 120 Q200 120 220 380 Z" fill="#B5473A" stroke={W} strokeWidth={5} />
    </Ink>
  </g>
);
const Glorified: React.FC<{ t: number; x?: number; y?: number; s?: number; on?: [number, number, number] }> = ({ t, x = 540, y = 900, s = 1, on = [1, 1, 1] }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-120} r={420} o={2.2 * on[2]} c="255,236,190" />
    <circle cx={0} cy={-120} r={230 + Math.sin(t * 3) * 6} fill="#FFF4D6" opacity={0.25 * on[2]} />
    <Ink>
      <path d="M-170 -160 Q-190 -380 0 -390 Q190 -380 170 -160 Q200 60 150 200 L-150 200 Q-200 60 -170 -160 Z" fill={on[0] ? "#F4F4F4" : INK} stroke={W} strokeWidth={6} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-150 + i * 37} -330 Q${-160 + i * 37} -100 ${-140 + i * 37} 180`} stroke="#BDBDBD" strokeWidth={3} fill="none" opacity={0.7 * on[0]} />)}
      <ellipse cx={0} cy={-110} rx={110} ry={140} fill={on[2] ? "#FFE9B0" : INK} stroke={W} strokeWidth={6} />
      <path d="M-180 420 Q-160 180 0 170 Q160 180 180 420 Z" fill={INK} stroke={W} strokeWidth={6} />
      <path d="M-120 260 L120 260" stroke="#E8C66A" strokeWidth={16} />
    </Ink>
    {[-45, 45].map((ex) => (
      <g key={ex} transform={`translate(${ex} -140)`} opacity={on[1]}>
        <ellipse rx={30} ry={20} fill="#FF7A1A" />
        <path d={`M-18 0 Q0 ${-30 - Math.sin(t * 14 + ex) * 8} 18 0 Z`} fill="#FFD27A" />
        <circle r={60} fill="rgba(255,120,30,0.25)" style={{ filter: "blur(10px)" }} />
      </g>
    ))}
  </g>
);
export const Jesus: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? a1("sol") + 0.3 : f / FPS;
  const flash = f >= 3 ? 0.35 * Math.max(Math.exp(-Math.max(0, t - a1("cabello")) * 6) * (t >= a1("cabello") ? 1 : 0), Math.exp(-Math.max(0, t - a1("real")) * 7) * (t >= a1("real") ? 1 : 0)) : 0;
  const cover = <>{coverTxt("¿ASÍ", "ERA?")}</>;
  return (
    <Shell f={f} cover={cover} ws={W1} keys={K1} audio="jesus/mezcla.wav" flash={flash}>
      <Scene t={t} a={0} b={a1("la", 0) > 3 ? a1("la", 0) : a1("biblia") - 0.15}>
        <Glow x={540} y={900} r={460} o={1.4} c="232,198,106" />
        <Painting />
        <Brush d="M220 520 L860 1320" p={ip(t, a1("real") - 0.05, a1("real") + 0.25)} w={80} len={1030} />
        <Brush d="M860 520 L220 1320" p={ip(t, a1("real") + 0.1, a1("real") + 0.4)} w={80} len={1030} />
      </Scene>
      <Scene t={t} a={a1("biblia") - 0.15} b={a1("era")}>
        <Glow x={540} y={900} r={420} />
        <Ink>
          <rect x={200} y={560} width={680} height={760} fill="#0B0807" stroke={W} strokeWidth={8} />
          <ellipse cx={540} cy={560} rx={360} ry={50} fill={INK} stroke={W} strokeWidth={8} />
          <ellipse cx={540} cy={1320} rx={360} ry={50} fill={INK} stroke={W} strokeWidth={8} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M260 ${660 + i * 66} L${820 - (i % 3) * 80} ${660 + i * 66}`} stroke={W} strokeWidth={5} opacity={0.5} />)}
        </Ink>
        <path d="M300 924 L780 924" stroke={RED} strokeWidth={14} strokeDasharray={500} strokeDashoffset={500 * (1 - ip(t, a1("belleza") - 0.1, a1("belleza") + 0.3))} />
        <path d="M300 990 L700 990" stroke={RED} strokeWidth={14} strokeDasharray={420} strokeDashoffset={420 * (1 - ip(t, a1("atractivo") - 0.1, a1("atractivo") + 0.3))} />
        <Tag t={t} a={a1("isaías")} b={a1("era")} txt="ISAÍAS 53:2" />
      </Scene>
      <Scene t={t} a={a1("era")} b={a1("hay")}>
        <Glow x={540} y={1000} r={500} o={0.8} />
        {Array.from({ length: 7 }, (_, i) => <Robe key={i} x={150 + i * 130} y={1400} s={0.62} hood={i % 2 === 1} />)}
        {t > a1("judas") - 0.1 ? <g opacity={ip(t, a1("judas") - 0.1, a1("judas") + 0.2)}><circle cx={540} cy={1060} r={110} fill="none" stroke={RED} strokeWidth={10} strokeDasharray={700} strokeDashoffset={700 * (1 - ip(t, a1("besarlo") - 0.1, a1("besarlo") + 0.4))} /><path d="M540 760 L540 940" stroke={RED} strokeWidth={10} /><path d="M510 900 L540 950 L570 900" stroke={RED} strokeWidth={10} fill="none" /></g> : null}
        <Tag t={t} a={a1("judas")} b={a1("hay")} txt="MARCOS 14:44" />
      </Scene>
      <Scene t={t} a={a1("hay")} b={a1("cabello")}>
        <Glow x={540} y={980} r={500} o={ip(t, a1("hay"), a1("describe", 1) + 0.3) * 2.5} c="255,236,190" />
        <Ink>
          <path d="M540 1300 L180 1220 L180 760 L540 840 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
          <path d="M540 1300 L900 1220 L900 760 L540 840 Z" fill="#0B0807" stroke={W} strokeWidth={8} />
        </Ink>
        <path d="M540 840 L540 300" stroke="#FFF4D6" strokeWidth={ip(t, a1("describe", 1), a1("cuadro"), 0, 260)} opacity={0.35} style={{ filter: "blur(18px)" }} />
        <Tag t={t} a={a1("describe", 1)} b={a1("cabello")} txt="APOCALIPSIS 1" y={1500} />
      </Scene>
      <Scene t={t} a={a1("cabello")} b={a1("tú")} z={0.14}>
        <Glorified t={t} on={[ip(t, a1("cabello") - 0.05, a1("cabello") + 0.2), ip(t, a1("ojos") - 0.05, a1("ojos") + 0.2), ip(t, a1("rostro") - 0.05, a1("rostro") + 0.3)]} />
        <Tag t={t} a={a1("cabello")} b={a1("tú")} txt="APOCALIPSIS 1:14-16" />
      </Scene>
      <Scene t={t} a={a1("tú")} b={99} z={0.04}>
        <Painting x={290} y={880} s={0.62} />
        <Glorified t={t} x={800} y={900} s={0.6} />
        <path d="M540 380 L540 1460" stroke={RED} strokeWidth={6} opacity={0.8} />
        <g transform="translate(-250 0)"><Serif txt="1" y={1460} size={170} o={ip(t, a1("uno") - 0.05, a1("uno") + 0.2)} /></g>
        <g transform="translate(250 0)"><Serif txt="2" y={1460} size={170} color={RED} o={ip(t, a1("dos") - 0.05, a1("dos") + 0.2)} /></g>
              </Scene>
    </Shell>
  );
};

// ===================== 2 · El ser más aterrador de la Biblia =====================
const W2 = words(d2 as unknown as Raw);
const a2 = finder(W2);
export const QUERUBIN_TOTAL = S(29.5);
const K2 = new Set(["ángeles", "estampitas", "ezequiel", "querubines", "cuatro", "hombre", "león", "buey", "águila", "alas", "relámpagos", "aterrador", "ruedas", "ojos", "edén", "eden", "miedo", "paz"]);
const Face: React.FC<{ k: number; o: number }> = ({ k, o }) => (
  <g opacity={o} transform={`scale(${0.6 + 0.4 * o})`}>
    <Ink>
      <circle r={110} fill={INK} stroke={W} strokeWidth={7} />
      {k === 0 ? <><path d="M-40 -20 L-15 -20 M15 -20 L40 -20 M-25 40 Q0 55 25 40" stroke={W} strokeWidth={7} fill="none" /></> : null}
      {k === 1 ? <>{Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 110} ${Math.sin(a) * 110} L${Math.cos(a) * 160} ${Math.sin(a) * 160}`} stroke="#E8C66A" strokeWidth={14} />; })}<path d="M-40 -20 L-15 -10 M15 -10 L40 -20 M-20 40 L0 55 L20 40" stroke={W} strokeWidth={7} fill="none" /></> : null}
      {k === 2 ? <><path d="M-100 -60 Q-170 -120 -150 -170 M100 -60 Q170 -120 150 -170" stroke={W} strokeWidth={14} fill="none" /><ellipse cx={0} cy={50} rx={55} ry={35} fill="none" stroke={W} strokeWidth={6} /><circle cx={-35} cy={-20} r={8} fill={W} /><circle cx={35} cy={-20} r={8} fill={W} /></> : null}
      {k === 3 ? <><path d="M-10 -10 L90 20 L-10 50 Z" fill="#E8C66A" stroke={W} strokeWidth={5} /><circle cx={-30} cy={-30} r={12} fill={W} /></> : null}
    </Ink>
  </g>
);
const Wheels: React.FC<{ t: number; eyes: number; s?: number }> = ({ t, eyes, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[0, 1].map((w) => (
      <g key={w} transform={`rotate(${w ? 90 : 0})`}>
        <ellipse rx={360} ry={150} fill="none" stroke={W} strokeWidth={14} transform={`rotate(${t * (w ? -40 : 40)})`} />
        {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + t * (w ? -0.7 : 0.7); return <g key={i} transform={`translate(${Math.cos(a) * 360} ${Math.sin(a) * 150})`} opacity={eyes}><ellipse rx={26} ry={14 * eyes} fill={W} /><circle r={9} fill={RED} /></g>; })}
      </g>
    ))}
  </g>
);
export const Querubin: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? a2("ojos") + 0.6 : f / FPS;
  const lightning = t >= a2("relámpagos") - 0.05 && t < a2("pero") ? (Math.sin(t * 40) > 0.6 ? 0.45 : 0) : 0;
  const flash = f >= 3 ? Math.max(lightning, 0.3 * Math.exp(-Math.max(0, t - a2("ruedas")) * 6) * (t >= a2("ruedas") ? 1 : 0)) : 0;
  const faces = ["hombre", "león", "buey", "águila"];
  const pos: [number, number][] = [[540, 640], [300, 920], [780, 920], [540, 1180]];
  return (
    <Shell f={f} cover={coverTxt("¿ESTO ES UN", "ÁNGEL?")} ws={W2} keys={K2} audio="querubin/mezcla.wav" flash={flash}>
      <Scene t={t} a={0} b={a2("ezequiel")}>
        <Glow x={540} y={900} r={420} o={1.3} c="255,236,190" />
        <Ink>
          <circle cx={540} cy={860} r={170} fill="#F2E6D8" stroke={W} strokeWidth={6} />
          <path d="M470 840 Q480 820 490 840 M590 840 Q600 820 610 840 M500 920 Q540 950 580 920" stroke={INK} strokeWidth={8} fill="none" />
          {[-1, 1].map((sd) => <path key={sd} d={`M${540 + sd * 150} 960 Q${540 + sd * 330} 820 ${540 + sd * 300} 1080 Q${540 + sd * 220} 1060 ${540 + sd * 160} 1060 Z`} fill="#F2F2F2" stroke={W} strokeWidth={5} />)}
          <ellipse cx={540} cy={660} rx={120} ry={26} fill="none" stroke="#E8C66A" strokeWidth={10} />
        </Ink>
        <Brush d="M300 560 L780 1240" p={ip(t, a2("estampitas") - 0.1, a2("estampitas") + 0.25)} w={80} len={840} />
      </Scene>
      <Scene t={t} a={a2("ezequiel")} b={a2("cada")}>
        <Glow x={540} y={620} r={460} o={2.5} c="255,236,190" />
        <path d="M540 0 L300 900 L780 900 Z" fill="rgba(255,244,214,0.12)" />
        <g transform="translate(540 1500) scale(1.3)"><Robe x={0} y={0} s={0.9} hood /></g>
        <Tag t={t} a={a2("ezequiel")} b={a2("cada")} txt="EZEQUIEL 1" />
      </Scene>
      <Scene t={t} a={a2("cada")} b={a2("pero")} z={0.12}>
        <Glow x={540} y={920} r={460} o={1.5} />
        {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${540 + [-1, 1, -1, 1][i] * 120 * ip(t, a2("alas"), a2("alas") + 0.3)} ${910}) rotate(${[-30, 30, -150, 150][i]})`} opacity={ip(t, a2("alas") - 0.05, a2("alas") + 0.25)}><path d="M0 0 Q160 -60 360 -20 Q200 30 0 40 Z" fill="#E8E8E8" stroke={W} strokeWidth={5} /></g>)}
        {faces.map((w, i) => <g key={w} transform={`translate(${pos[i][0]} ${pos[i][1]})`}><Face k={i} o={Math.max(ip(t, a2(w) - 0.05, a2(w) + 0.15), 0.35 * ip(t, a2("cuatro"), a2("cuatro") + 0.2))} /></g>)}
        {lightning > 0 ? <path d="M720 300 L620 620 L700 640 L560 1000" stroke="#DCE8FF" strokeWidth={12} fill="none" /> : null}
      </Scene>
      <Scene t={t} a={a2("pero")} b={a2("y", 1) > a2("pero") ? a2("y", 1) : a2("fueron") - 0.1} z={0.14}>
        <Glow x={540} y={940} r={480} o={1.6} c="211,15,23" />
        <g transform="translate(540 940)"><Wheels t={t} eyes={ip(t, a2("ojos") - 0.1, a2("ojos") + 0.2)} s={ip(t, a2("ruedas") - 0.1, a2("ruedas") + 0.4, 0.4, 1)} /></g>
        <Tag t={t} a={a2("ojos")} b={a2("fueron")} txt="EZEQUIEL 10:12" />
      </Scene>
      <Scene t={t} a={a2("fueron") - 0.1} b={a2("te")}>
        <Glow x={540} y={1000} r={440} o={1.8} c="255,120,30" />
        <Ink><path d="M260 1500 L260 700 Q540 480 820 700 L820 1500" fill="none" stroke={W} strokeWidth={14} /></Ink>
        <g transform={`translate(540 980) rotate(${Math.sin(t * 2) * 12})`}><path d="M0 -360 L22 260 L-22 260 Z" fill="#FF8A1E" /><path d="M0 -300 L10 220 L-10 220 Z" fill="#FFD27A" /><rect x={-70} y={260} width={140} height={22} fill="#E8C66A" /></g>
        {[-1, 1].map((sd) => <g key={sd} transform={`translate(${540 + sd * 330} 1300) scale(0.45)`}><Wheels t={t} eyes={1} /></g>)}
        <Tag t={t} a={a2("fueron")} b={a2("te")} txt="GÉNESIS 3:24" />
      </Scene>
      <Scene t={t} a={a2("te")} b={99} z={0.05}>
        <g transform="translate(540 900) scale(0.6)"><Wheels t={t} eyes={1} /></g>
        <Serif txt="¿MIEDO" y={1460} size={130} o={ip(t, a2("miedo") - 0.05, a2("miedo") + 0.2)} color={RED} />
        <Serif txt="O PAZ?" y={1600} size={130} o={ip(t, a2("paz") - 0.05, a2("paz") + 0.2)} />
      </Scene>
    </Shell>
  );
};
// SFX simples en los golpes
export const SfxJ: React.FC = () => null;
export { Sequence };
