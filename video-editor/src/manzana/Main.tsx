import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/manzana/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Paper } from "../judas/Dark";
import { Serif } from "../sangre/Main";
import { Ground, Robe } from "../adultera/Dark";
import { Shot } from "../navidad/Main";

// ZK Dark · "Adán y Eva nunca comieron una manzana" (Gn 3:6, 3:4, 3:9; Vulgata "malum"). Bucle: vuelve la manzana.
const TH = 0.1;
const END = 26.35;
export const MANZANA_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["nunca", "manzana", "génesis", "fruto", "árbol", "latín", "malum", "mal", "fruta", "creerle", "dios", "buscarlos", "dónde"]);
const RED = "#D30F17";
const W = 1080, H = 1920;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => clean(w.w) === word)[nth]?.s ?? 0;
const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#ink)">{children}</g>;
const Glow: React.FC<{ x: number; y: number; r: number; o: number; c?: string }> = ({ x, y, r, o, c = "242,242,242" }) => <circle cx={x} cy={y} r={r} fill={`rgba(${c},${0.16 * o})`} style={{ filter: "blur(40px)" }} />;

// manzana mordida
const Apple: React.FC<{ x: number; y: number; s: number; o?: number; red?: number }> = ({ x, y, s, o = 1, red = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <Ink>
      <path d="M0 -150 C-60 -200 -230 -190 -240 -20 C-250 140 -120 260 -40 240 Q0 225 40 240 C120 260 230 150 235 0 Q190 -10 185 -50 Q215 -80 205 -120 C160 -190 60 -200 0 -150 Z" fill={`rgba(150,8,14,${red})`} stroke="#F2F2F2" strokeWidth={8} />
      <path d="M-170 -60 Q-180 60 -110 160" stroke="#F2F2F2" strokeWidth={6} fill="none" opacity={0.5} />
      <path d="M0 -150 Q10 -220 40 -260" stroke="#F2F2F2" strokeWidth={10} fill="none" />
      <path d="M30 -230 Q110 -290 160 -230 Q100 -190 30 -230 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
    </Ink>
  </g>
);
const Tree: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink>
      <path d="M-40 0 Q-30 -250 -60 -420 L60 -420 Q30 -250 40 0 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
      <path d="M-380 -440 Q-400 -700 -150 -760 Q0 -900 160 -760 Q400 -700 380 -460 Q300 -330 0 -380 Q-300 -330 -380 -440 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
      <path d="M-300 -460 Q-200 -560 0 -520 Q200 -560 300 -470" stroke="#F2F2F2" strokeWidth={4} fill="none" opacity={0.4} />
    </Ink>
  </g>
);

// 1 · gancho: una manzana roja; la X se pinta en "nunca"
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  const live = frozen === undefined;
  const x1 = live ? eo(ip(t, [at("nunca") - 0.05, at("nunca") + 0.2], [0, 1])) : 0;
  const x2 = live ? eo(ip(t, [at("manzana") - 0.1, at("manzana") + 0.15], [0, 1])) : 0;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 2.3], [1.0, 1.12])}) rotate(${Math.sin(t * 2) * 1}deg)` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={900} r={420} o={1.4} c="211,15,23" />
        <Apple x={540} y={920 + Math.sin(t * 3) * 8} s={1.6} />
        <Brush d="M250 620 L830 1240" p={x1} w={70} len={860} />
        <Brush d="M830 620 L250 1240" p={x2} w={70} len={860} />
        {!live ? <><Serif txt="¿QUÉ FRUTA" y={1500} size={104} ls={4} /><Serif txt="ERA EN REALIDAD?" y={1630} size={92} ls={3} /></> : null}
      </svg>
    </AbsoluteFill>
  );
};
// 2 · Génesis 3 bajo la lupa: 0 resultados
const C2: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("palabra"), 1.25, 45, 52, -2], [at("aparece"), 1.1, 50, 55]]}>
    {(t) => {
      const sx = 330 + ((t - t0) * 420) % 460;
      const sy = 860 + Math.floor(((t - t0) * 420) / 460) % 5 * 90;
      return (
        <>
          <Ink>
            <path d="M540 700 Q380 660 160 700 L160 1340 Q380 1300 540 1340 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            <path d="M540 700 Q700 660 920 700 L920 1340 Q700 1300 540 1340 Z" fill="#050505" stroke="#F2F2F2" strokeWidth={7} />
            {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M200 ${800 + i * 56} L500 ${800 + i * 56} M580 ${800 + i * 56} L880 ${800 + i * 56}`} stroke="#F2F2F2" strokeWidth={4} opacity={0.45} />)}
          </Ink>
          <Serif txt="GÉNESIS 3" y={620} size={70} ls={10} o={ip(t, [t0, t0 + 0.2], [0, 0.95])} />
          <g transform={`translate(${sx} ${sy})`}>
            <Ink><circle r={110} fill="rgba(242,242,242,0.08)" stroke="#F2F2F2" strokeWidth={10} /><path d="M78 78 L190 190" stroke="#F2F2F2" strokeWidth={26} strokeLinecap="round" /></Ink>
          </g>
          <g transform={`translate(540 1540) scale(${ip(t, [at("no") - 0.05, at("no") + 0.12], [1.5, 1])})`} opacity={ip(t, [at("no") - 0.05, at("no") + 0.08], [0, 1])}>
            <text x={0} y={0} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={190} fill={RED}>0</text>
            <text x={0} y={80} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={56} fill="#F2F2F2" letterSpacing={8}>RESULTADOS</text>
          </g>
        </>
      );
    }}
  </Shot>
);
// 3 · solo "el fruto del árbol": un fruto sin forma que brilla (Gn 3:6)
const C3: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("fruto"), 1.4, 50, 40, 2], [at("árbol"), 1.05, 50, 55]]}>
    {(t) => {
      const g = ip(t, [at("fruto") - 0.1, at("fruto") + 0.2], [0.3, 1]);
      return (
        <>
          <Glow x={540} y={760} r={300} o={g * 1.6} />
          <Tree x={540} y={1460} s={1.15} />
          <circle cx={540} cy={790} r={58 + Math.sin(t * 7) * 4} fill={`rgba(242,232,200,${g})`} style={{ filter: `drop-shadow(0 0 ${40 * g}px #fff)` }} />
          <text x={540} y={815} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={70} fill="#050505" opacity={g}>?</text>
          <Ground y={1460} />
          <Serif txt="GÉNESIS 3:6" y={1680} size={60} o={ip(t, [t0 + 0.2, t0 + 0.4], [0, 0.9])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 4 · el juego de palabras: Vulgata (s. IV) → MALUM = mal / manzana
const C4: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("latín"), 1.2, 50, 42, -2], [at("malum"), 1.0, 50, 48], [at("mal"), 1.25, 30, 60, -2], [at("manzana", 3), 1.25, 70, 60, 2]]}>
    {(t) => {
      const m = eo(ip(t, [at("malum") - 0.1, at("malum") + 0.2], [0, 1]));
      const a1 = eo(ip(t, [at("mal") - 0.05, at("mal") + 0.2], [0, 1]));
      const a2 = eo(ip(t, [at("manzana", 3) - 0.05, at("manzana", 3) + 0.2], [0, 1]));
      return (
        <>
          <g opacity={ip(t, [t0, t0 + 0.2], [0, 1]) * ip(t, [at("malum") - 0.2, at("malum")], [1, 0.35])}>
            <Ink><rect x={260} y={420} width={560} height={300} rx={20} fill="#050505" stroke="#F2F2F2" strokeWidth={6} /></Ink>
            <text x={540} y={560} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={72} fill="#F2F2F2" letterSpacing={8}>VULGATA</text>
            <text x={540} y={650} textAnchor="middle" fontFamily="Georgia, serif" fontSize={50} fill="#F2F2F2" opacity={0.75} letterSpacing={6}>AÑO 405</text>
          </g>
          <g transform={`translate(540 960) scale(${0.7 + m * 0.3})`} opacity={m}>
            <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={190} fill="#F2F2F2" letterSpacing={14} filter="url(#ink)">MALUM</text>
          </g>
          <path d="M440 1020 L280 1220" stroke="#F2F2F2" strokeWidth={8} strokeDasharray={260} strokeDashoffset={260 * (1 - a1)} />
          <path d="M640 1020 L800 1220" stroke="#F2F2F2" strokeWidth={8} strokeDasharray={260} strokeDashoffset={260 * (1 - a2)} />
          <g opacity={a1} transform={`translate(260 1380) scale(${0.6 + a1 * 0.4})`}>
            <text x={0} y={0} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={110} fill={RED}>MAL</text>
          </g>
          <g opacity={a2}><Apple x={820} y={1360} s={0.55 + a2 * 0.15} /></g>
        </>
      );
    }}
  </Shot>
);
// 5 · nunca fue la fruta: la manzana se deshace en ceniza
const C5: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.1, 50, 50], [at("fruta"), 1.4, 50, 48, 2]]}>
    {(t) => {
      const d = ip(t, [at("nunca", 1), at("fruta") + 0.3], [0, 1]);
      return (
        <>
          <Glow x={540} y={960} r={380} o={1.2 * (1 - d)} c="211,15,23" />
          <Apple x={540} y={960} s={1.3} o={1 - d * 0.85} red={1 - d} />
          {Array.from({ length: 40 }, (_, i) => {
            const r = random(`ash${i}`);
            const k = ip(d, [r * 0.5, r * 0.5 + 0.5], [0, 1]);
            return <rect key={i} x={360 + random(`ax${i}`) * 360 + k * (random(`dx${i}`) - 0.3) * 300} y={760 + random(`ay${i}`) * 380 - k * 500} width={10} height={10} fill={i % 3 === 0 ? RED : "#F2F2F2"} opacity={k * (1 - k) * 3} transform={`rotate(${k * 200})`} />;
          })}
        </>
      );
    }}
  </Shot>
);
// 6 · a quién dejaron de creerle: la serpiente susurra "no moriréis" (Gn 3:4)
const C6: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={0} cuts={[[t0, 1.0, 50, 50], [at("sino"), 1.3, 62, 45, 2], [at("creerle"), 1.15, 45, 55, -2]]}>
    {(t) => {
      const crack = eo(ip(t, [at("creerle") - 0.05, at("creerle") + 0.25], [0, 1]));
      const sway = Math.sin(t * 3) * 14;
      return (
        <>
          <Glow x={700} y={700} r={300} o={1} />
          <Tree x={720} y={1500} s={1.0} />
          <Ink>
            <path d={`M760 1140 Q640 1060 740 960 Q840 860 700 780 Q600 720 ${560 + sway} 690`} stroke="#F2F2F2" strokeWidth={30} fill="none" strokeLinecap="round" />
            <path d={`M760 1140 Q640 1060 740 960 Q840 860 700 780 Q600 720 ${560 + sway} 690`} stroke="#050505" strokeWidth={18} fill="none" strokeLinecap="round" />
            <ellipse cx={548 + sway} cy={684} rx={34} ry={22} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
          </Ink>
          <path d={`M${515 + sway} 690 l-26 -6 m26 6 l-24 10`} stroke={RED} strokeWidth={5} fill="none" />
          <Robe x={330} y={1500} s={0.95} />
          <Ground y={1500} />
          <Serif txt="«NO MORIRÉIS»" y={460} size={78} ls={4} o={ip(t, [at("problema"), at("problema") + 0.2], [0, 0.95])} />
          <Serif txt="GÉNESIS 3:4" y={540} size={44} ls={8} o={ip(t, [at("problema") + 0.1, at("problema") + 0.3], [0, 0.7])} />
          <Brush d="M330 1000 L360 1120 L300 1220 L350 1340" p={crack} w={22} len={400} v />
        </>
      );
    }}
  </Shot>
);
// 7 · Dios no ha dejado de buscarlos: una luz que barre el huerto, alguien escondido (Gn 3:9)
const C7: React.FC<{ t0: number }> = ({ t0 }) => (
  <Shot t0={t0} kind={1} cuts={[[t0, 1.0, 50, 50], [at("buscarlos"), 1.2, 40, 55, -2], [at("dónde"), 1.5, 40, 62]]}>
    {(t) => {
      const ang = ip(t, [t0, at("dónde")], [-28, 12]);
      return (
        <>
          <g transform={`rotate(${ang} 540 -100)`}>
            <path d="M540 -100 L330 1700 L750 1700 Z" fill="rgba(242,240,225,0.13)" style={{ filter: "blur(12px)" }} />
            <path d="M540 -100 L440 1700 L640 1700 Z" fill="rgba(242,240,225,0.12)" style={{ filter: "blur(6px)" }} />
          </g>
          <Tree x={380} y={1500} s={1.05} />
          <g opacity={ip(t, [at("dios") - 0.1, at("dios") + 0.1], [0, 1])}><Robe x={470} y={1500} s={0.55} hood /></g>
          <Tree x={890} y={1520} s={0.8} />
          <Ground y={1500} />
          <Serif txt="GÉNESIS 3:9" y={1700} size={58} o={ip(t, [at("dios"), at("dios") + 0.2], [0, 0.9])} ls={8} />
        </>
      );
    }}
  </Shot>
);
// 8 · bucle: vuelve la manzana (sin X)
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const t = t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, END], [1.3, 1.0])}) rotate(${Math.sin(t * 2) * 1}deg)` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Glow x={540} y={900} r={420} o={1.4} c="211,15,23" />
        <Apple x={540} y={920 + Math.sin(t * 3) * 8} s={1.6} red={ip(t, [t0, t0 + 0.4], [0.2, 1])} />
      </svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("busca"), C2], [at("solo"), C3], [at("se"), C4], [at("pero"), C5], [at("el", 2), C6], [at("y", 2), C7], [at("mándaselo"), C8],
];
const SFX: [number, string, number][] = [[at("nunca") - 0.08, "sfx/impact.wav", 0.35], [at("malum") - 0.08, "sfx/impact.wav", 0.3], [at("el", 2) - 0.08, "sfx/impact.wav", 0.3]];
const PUNCH = WORDS.filter((w) => KEYS.has(clean(w.w))).map((w) => w.s);

export const Manzana: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.94 + 0.06 * random(`fl${Math.floor(f / 2)}`);
  const last = PUNCH.filter((p) => p <= t).pop() ?? -9;
  const kick = Math.exp(-(t - last) * 10);
  const cam = `translate(${Math.sin(f / 13) * 5 + (random(`kx${f}`) - 0.5) * 16 * kick}px, ${Math.cos(f / 19) * 6 + (random(`ky${f}`) - 0.5) * 16 * kick}px) scale(${1 + 0.05 * kick})`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={2} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ opacity: flick, transform: cam }}>
        {SC.map(([t0, C], i) => {
          const end = SC[i + 1]?.[0] ?? END;
          return <Sequence key={i} from={S(t0)} durationInFrames={Math.max(1, S(end) - S(t0))}><C t0={t0} /></Sequence>;
        })}
      </AbsoluteFill>
      {t >= TH ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      {t >= TH ? <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} /> : null}
      <Audio src={staticFile("manzana/mezcla.wav")} />
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
