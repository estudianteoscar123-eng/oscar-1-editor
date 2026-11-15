import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import d1 from "../../public/lucifer/words.json";
import d2 from "../../public/nombre/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Robe } from "../adultera/Dark";

// ZK Dark básico (el estilo de "¿Así era?", el mejor de la cuenta): imagen de tinta fuerte por idea, cita en pantalla, bucle.
const TH = 0.1;
const RED = "#D30F17", W = "#F2F2F2", INK = "#050505", GOLD = "#E8C66A";
const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => interpolate(v, [a, b], [o0, o1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
type Raw = { chunks: { text: string; timestamp: [number, number] }[] };
const words = (d: Raw, fix: Record<string, string> = {}): Word[] => d.chunks.map((c) => { const w = c.text.trim(); return { w: fix[w] ?? w, s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }; });
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const finder = (ws: Word[]) => (w: string, n = 0) => ws.filter((x) => clean(x.w) === w)[n]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o?: number; c?: string }> = ({ x, y, r, o = 1, c = "242,242,242" }) => <circle cx={x} cy={y} r={r} fill={`rgba(${c},${0.18 * o})`} style={{ filter: "blur(40px)" }} />;
const Tag: React.FC<{ t: number; a: number; b: number; txt: string; y?: number }> = ({ t, a, b, txt, y = 1700 }) => <Serif txt={txt} y={y} size={58} ls={8} o={ip(t, a, a + 0.2) * ip(t, b - 0.2, b, 1, 0)} />;
const Scene: React.FC<{ t: number; a: number; b: number; children: React.ReactNode; z?: number }> = ({ t, a, b, children, z = 0.1 }) => {
  if (t < a - 0.01 || t >= b) return null;
  const k = ip(t, a, b);
  const pop = ip(t, a, a + 0.15, 1.1, 1);
  return <g transform={`translate(540 960) scale(${(1 + k * z) * pop}) translate(-540 -960)`}>{children}</g>;
};
const Shell: React.FC<{ f: number; cover: [string, string]; ws: Word[]; keys: Set<string>; audio: string; children: React.ReactNode; flash: number }> = ({ f, cover, ws, keys, audio, children, flash }) => (
  <AbsoluteFill style={{ background: INK }}>
    <Defs />
    <AbsoluteFill style={{ transform: `translate(${Math.sin(f / 13) * 5}px, ${Math.cos(f / 17) * 5}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
    </AbsoluteFill>
    {f >= 3 ? <Ash f={f} /> : null}
    <Paper f={f} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" }} />
    <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    {f < 3 ? (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><Serif txt={cover[0]} y={1440} size={110} ls={4} /><Serif txt={cover[1]} y={1590} size={150} ls={6} color={RED} /></svg>
    ) : <Captions f={f} groups={groupWords(ws)} keys={keys} hl={RED} />}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
const flashAt = (t: number, ts: number[]) => Math.max(0, ...ts.map((x) => (t >= x ? 0.35 * Math.exp(-(t - x) * 7) : 0)));

// ángel con alas
const Angel: React.FC<{ t: number; x?: number; y?: number; s?: number; dark?: number; rot?: number }> = ({ t, x = 540, y = 960, s = 1, dark = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`scale(${sd} 1) rotate(${-8 + Math.sin(t * 2) * 4})`}>
        <Ink>
          {[0, 1, 2].map((k) => <path key={k} d={`M40 ${-120 + k * 70} Q${260 + k * 30} ${-340 + k * 90} ${430 - k * 40} ${-200 + k * 120} Q${250} ${-60 + k * 60} 40 ${-40 + k * 70} Z`} fill={dark ? `rgba(20,0,0,${0.6 + 0.4 * dark})` : "#EDEDED"} stroke={W} strokeWidth={5} opacity={0.95 - k * 0.15} />)}
        </Ink>
      </g>
    ))}
    <Ink>
      <path d="M-90 -40 Q-110 260 -150 420 L150 420 Q110 260 90 -40 Q0 -80 -90 -40 Z" fill={dark ? "#120404" : "#F4F4F4"} stroke={W} strokeWidth={6} />
      <circle cx={0} cy={-130} r={78} fill={dark ? "#120404" : "#FFF3D6"} stroke={W} strokeWidth={6} />
    </Ink>
    {[[-40, 60, "#E0182A"], [40, 120, "#F4F4FF"], [-30, 200, "#1FBF6A"], [35, 270, GOLD]].map(([gx, gy, c], i) => <circle key={i} cx={gx as number} cy={gy as number} r={16} fill={c as string} opacity={1 - dark} />)}
    <ellipse cx={0} cy={-250} rx={90} ry={18} fill="none" stroke={GOLD} strokeWidth={9} opacity={1 - dark} />
  </g>
);
const Gem: React.FC<{ x: number; y: number; c: string; o: number }> = ({ x, y, c, o }) => (
  <g transform={`translate(${x} ${y}) scale(${0.5 + 0.5 * o}) rotate(${(1 - o) * 30})`} opacity={o}>
    <circle r={150} fill={c} opacity={0.18} style={{ filter: "blur(20px)" }} />
    <Ink><path d="M-90 -40 L-50 -90 L50 -90 L90 -40 L0 100 Z" fill={c} stroke={W} strokeWidth={6} /><path d="M-90 -40 L90 -40 M-50 -90 L-20 -40 L0 100 L20 -40 L50 -90" stroke={W} strokeWidth={4} fill="none" opacity={0.7} /></Ink>
  </g>
);

// ===================== Lucifer antes de caer =====================
const W1 = words(d1 as unknown as Raw);
const a1 = finder(W1);
export const LUCIFER_TOTAL = S(24.35);
const K1 = new Set(["diablo", "lucifer", "hermoso", "perfección", "sabiduría", "piedras", "rubí", "diamante", "esmeralda", "oro", "querubín", "trono", "odio", "orgullo", "peligroso", "dios"]);
export const Lucifer: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 0.2 : f / FPS;
  const flash = f < 3 ? 0 : flashAt(t, [a1("lucifer"), a1("rubí"), a1("orgullo")]);
  return (
    <Shell f={f} cover={["¿ASÍ ERA", "LUCIFER?"]} ws={W1} keys={K1} audio="lucifer/mezcla.wav" flash={flash}>
      <Scene t={t} a={0} b={a1("la")}>
        <Glow x={540} y={880} r={520} o={2.6} c="255,236,190" />
        <Angel t={t} y={980} s={1.05} dark={ip(t, a1("diablo") - 0.05, a1("diablo") + 0.1) * ip(t, a1("lucifer") - 0.1, a1("lucifer"), 1, 0)} />
      </Scene>
      <Scene t={t} a={a1("la")} b={a1("cubierto")}>
        <Glow x={540} y={900} r={460} o={1.6} c="232,198,106" />
        <Ink>
          <circle cx={540} cy={900} r={260} fill="#0B0807" stroke={GOLD} strokeWidth={14} />
          <circle cx={540} cy={900} r={200} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray="14 10" />
        </Ink>
        <path d="M540 760 L580 860 L690 870 L605 940 L635 1050 L540 990 L445 1050 L475 940 L390 870 L500 860 Z" fill={GOLD} transform={`rotate(${t * 20} 540 900)`} opacity={ip(t, a1("sello") - 0.05, a1("sello") + 0.2)} />
        <Tag t={t} a={a1("sello")} b={a1("cubierto")} txt="EZEQUIEL 28:12" />
      </Scene>
      <Scene t={t} a={a1("cubierto")} b={a1("era", 2)} z={0.14}>
        <Glow x={540} y={900} r={480} o={1.2} />
        <Gem x={540} y={560} c="#E0182A" o={ip(t, a1("rubí") - 0.05, a1("rubí") + 0.2)} />
        <Gem x={300} y={900} c="#EAF2FF" o={ip(t, a1("diamante") - 0.05, a1("diamante") + 0.2)} />
        <Gem x={780} y={900} c="#1FBF6A" o={ip(t, a1("esmeralda") - 0.05, a1("esmeralda") + 0.2)} />
        <Gem x={540} y={1240} c={GOLD} o={ip(t, a1("oro") - 0.05, a1("oro") + 0.2)} />
        <Tag t={t} a={a1("piedras")} b={a1("era", 1)} txt="EZEQUIEL 28:13" />
      </Scene>
      <Scene t={t} a={a1("era", 2)} b={a1("y", 1)}>
        <Glow x={540} y={760} r={520} o={2.6} c="255,236,190" />
        <Ink>
          <path d="M380 1350 L380 860 Q540 700 700 860 L700 1350 Z" fill="#0B0807" stroke={GOLD} strokeWidth={12} />
          <rect x={330} y={1350} width={420} height={60} fill="#0B0807" stroke={GOLD} strokeWidth={10} />
        </Ink>
        <Angel t={t} x={540} y={700} s={0.55} />
        <Tag t={t} a={a1("querubín")} b={a1("y", 1)} txt="EZEQUIEL 28:14" />
      </Scene>
      <Scene t={t} a={a1("y", 1)} b={a1("porque")} z={0.05}>
        <Glow x={540} y={1300} r={520} o={ip(t, a1("orgullo") - 0.1, a1("orgullo") + 0.3) * 2.5} c="211,15,23" />
        <path d="M540 200 Q560 600 540 1000" stroke="#FF6A1A" strokeWidth={ip(t, a1("cayó"), a1("orgullo") + 0.3, 0, 90)} opacity={0.5} style={{ filter: "blur(14px)" }} />
        <Angel t={t} x={540 + ip(t, a1("cayó"), a1("porque"), 0, 60)} y={ip(t, a1("cayó"), a1("porque"), 520, 1250)} s={0.6} rot={ip(t, a1("cayó"), a1("porque"), 0, 160)} dark={ip(t, a1("orgullo") - 0.1, a1("orgullo") + 0.3)} />
        <Tag t={t} a={a1("orgullo")} b={a1("porque")} txt="EZEQUIEL 28:17" />
      </Scene>
      <Scene t={t} a={a1("porque")} b={99} z={0.06}>
        <Glow x={540} y={900} r={480} o={1.6} c="255,236,190" />
        <Ink><ellipse cx={540} cy={900} rx={300} ry={420} fill="#0B0807" stroke={GOLD} strokeWidth={14} /></Ink>
        <g opacity={ip(t, a1("feo"), a1("feo") + 0.3)}><Angel t={t} x={540} y={980} s={0.62} dark={ip(t, a1("necesitas") - 0.2, a1("necesitas") + 0.3)} /></g>
        <Brush d="M300 560 L780 1240" p={ip(t, a1("necesitas") - 0.05, a1("necesitas") + 0.25)} w={70} len={840} />
      </Scene>
    </Shell>
  );
};

// ===================== El nombre secreto de Jesús =====================
const W2 = words(d2 as unknown as Raw, { "Los": "los", "Ángeles.": "ángeles." });
const a2 = finder(W2);
export const NOMBRE_TOTAL = S(21.6);
const K2 = new Set(["jesús", "nombre", "nadie", "conoce", "cristo", "emmanuel", "apocalipsis", "caballo", "blanco", "fuego", "coronas", "escrito", "conocía", "ángeles", "tiempo", "escuchar"]);
const Crown: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><path d="M-40 20 L-40 -20 L-20 0 L0 -30 L20 0 L40 -20 L40 20 Z" fill={GOLD} stroke={W} strokeWidth={3} /></g>
);
const Rider: React.FC<{ t: number; eyes: number; crowns: number }> = ({ t, eyes, crowns }) => (
  <g transform={`translate(540 1000) translate(0 ${Math.sin(t * 6) * 6})`}>
    <Ink>
      <path d="M-330 120 Q-300 -40 -140 -60 L160 -70 Q230 -170 300 -230 Q330 -200 310 -150 L250 -60 Q300 30 240 140 L220 330 L190 330 L190 160 L-120 170 L-150 340 L-180 340 L-180 170 Q-300 200 -330 120 Z" fill="#F2F2F2" stroke={W} strokeWidth={6} />
      <path d="M260 -230 Q200 -200 170 -120 M240 -200 Q180 -160 160 -90" stroke="#BDBDBD" strokeWidth={8} fill="none" />
      <path d="M-60 -60 Q-80 -260 0 -300 Q80 -260 60 -60 Z" fill="#F4F4F4" stroke={W} strokeWidth={6} />
      <path d="M-70 -40 Q-20 60 60 -40" fill="#B5121B" stroke={W} strokeWidth={4} />
      <circle cx={0} cy={-340} r={48} fill="#FFE9B0" stroke={W} strokeWidth={5} />
    </Ink>
    {[-16, 16].map((ex) => <ellipse key={ex} cx={ex} cy={-344} rx={10} ry={6} fill="#FF7A1A" opacity={eyes} />)}
    {[-60, -20, 20, 60].map((cx, i) => <Crown key={i} x={cx} y={-410 - Math.abs(cx) * 0.3} s={0.45} o={crowns} />)}
  </g>
);
export const Nombre: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 20.2 : f / FPS;
  const flash = f < 3 ? 0 : flashAt(t, [a2("apocalipsis"), a2("escrito")]);
  const names: [string, string, number][] = [["JESÚS", "jesús", 1], ["CRISTO", "cristo", 0], ["EMMANUEL", "emmanuel", 0]];
  return (
    <Shell f={f} cover={["¿SU", "NOMBRE?"]} ws={W2} keys={K2} audio="nombre/mezcla.wav" flash={flash}>
      <Scene t={t} a={0} b={a2("no")}>
        <Glow x={540} y={900} r={520} o={2.2} c="255,236,190" />
        <Ink><rect x={240} y={700} width={600} height={360} fill="#0B0807" stroke={GOLD} strokeWidth={12} /></Ink>
        {Array.from({ length: 7 }, (_, i) => <text key={i} x={310 + i * 75} y={920} fontFamily="Georgia, serif" fontSize={90} fill={GOLD} opacity={0.4 + 0.4 * Math.sin(t * 4 + i)} style={{ filter: "blur(6px)" }}>{"אΩ✶ᚱΣ⟡ℵ"[i]}</text>)}
      </Scene>
      <Scene t={t} a={a2("no")} b={a2("en", 1)} z={0.06}>
        <Glow x={540} y={900} r={420} />
        {names.map(([n, w, k], i) => (
          <g key={n} opacity={ip(t, a2(w, k) - 0.1, a2(w, k) + 0.1)}>
            <Serif txt={n} y={700 + i * 220} size={120} ls={6} />
            <path d={`M240 ${670 + i * 220} L840 ${670 + i * 220}`} stroke={RED} strokeWidth={14} strokeDasharray={600} strokeDashoffset={600 * (1 - ip(t, a2(w, k) + 0.25, a2(w, k) + 0.45))} />
          </g>
        ))}
      </Scene>
      <Scene t={t} a={a2("en", 1)} b={a2("y", 1)} z={0.12}>
        <Glow x={540} y={760} r={540} o={2.6} c="255,236,190" />
        <Rider t={t} eyes={ip(t, a2("ojos") - 0.05, a2("ojos") + 0.2)} crowns={ip(t, a2("coronas") - 0.05, a2("coronas") + 0.2)} />
        <Tag t={t} a={a2("apocalipsis")} b={a2("y", 1)} txt="APOCALIPSIS 19:11-12" />
      </Scene>
      <Scene t={t} a={a2("y", 1)} b={a2("un", 3)} z={0.08}>
        <Glow x={540} y={820} r={480} o={2} c="255,236,190" />
        <Ink><path d="M360 1400 Q340 900 540 620 Q740 900 720 1400 Z" fill="#F4F4F4" stroke={W} strokeWidth={6} /></Ink>
        {Array.from({ length: 5 }, (_, i) => <text key={i} x={410 + i * 55} y={1060} fontFamily="Georgia, serif" fontSize={70} fill={RED} opacity={ip(t, a2("escrito") - 0.1, a2("escrito") + 0.3) * (0.6 + 0.4 * Math.sin(t * 5 + i))} style={{ filter: "blur(5px)" }}>{"ℵΩ✶Σ⟡"[i]}</text>)}
        <g opacity={ip(t, a2("ángeles") - 0.1, a2("ángeles") + 0.2)}>{[160, 920].map((x) => <Robe key={x} x={x} y={1500} s={0.55} hood />)}</g>
      </Scene>
      <Scene t={t} a={a2("un", 3)} b={99} z={0.05}>
        <Glow x={540} y={1000} r={500} o={ip(t, a2("un", 3), a2("escuchar")) * 3} c="255,236,190" />
        {[0, 1, 2, 3].map((i) => { const r = ((t * 220 + i * 140) % 560) + 40; return <circle key={i} cx={540} cy={1000} r={r} fill="none" stroke={GOLD} strokeWidth={6} opacity={(1 - r / 600) * ip(t, a2("escuchar") - 0.4, a2("escuchar"))} />; })}
        <Ink><rect x={240} y={820} width={600} height={360} fill="#0B0807" stroke={GOLD} strokeWidth={12} /></Ink>
        {Array.from({ length: 7 }, (_, i) => <text key={i} x={310 + i * 75} y={1040} fontFamily="Georgia, serif" fontSize={90} fill={GOLD} opacity={0.5 + 0.4 * Math.sin(t * 4 + i)} style={{ filter: "blur(6px)" }}>{"אΩ✶ᚱΣ⟡ℵ"[i]}</text>)}
      </Scene>
    </Shell>
  );
};
