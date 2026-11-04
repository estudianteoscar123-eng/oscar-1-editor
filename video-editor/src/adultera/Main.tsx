import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/adultera/words.json";
import { Bubble, Captions, Chip, FPS, Figure, Fog, GodRays, Grain, Moon, S, Stars, Torch, Vignette, Word, groupWords } from "../kit/Kit";

// ZK · "El único que podía tirar la primera piedra" (Juan 8:3–11). Réplica de la fórmula del ladrón y de Pedro:
// paradoja con "el único", diálogo real, giro de gracia y frase final al espectador. Estilo "Pedro v2". Portada en 0–2.
const TH = 0.1;
const END = 35.2;
export const ADULTERA_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["único", "piedra", "tiró", "adulterio", "todos", "apedrearla", "jesús", "suelo", "pecado", "piedras", "condeno", "señalan", "condenarte", "hacerlo"]);
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ]/g, "");
const at = (w: string, nth = 0) => WORDS.filter((x) => clean(x.w) === w)[nth]?.s ?? 0;
const useT = (t0: number) => { const f = useCurrentFrame(); return { f, t: t0 + f / FPS, ft: (a: number) => f - S(a - t0) }; };

// ---------- escenario: noche con antorchas ----------
const Night: React.FC<{ f: number; warm?: number }> = ({ f, warm = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(#060A18, rgb(${20 + 40 * warm},${22 + 18 * warm},${40 - 10 * warm}) 55%, rgb(${48 + 50 * warm},${34 + 20 * warm},${30}) 100%)` }} />
    <Stars f={f} n={70} h={900} />
    <Moon x={820} y={360} r={70} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d="M-20 1180 L120 1080 L120 980 L300 980 L300 1060 L420 1060 L420 920 L560 920 L560 1040 L760 1040 L760 960 L900 960 L900 1080 L1100 1080 L1100 1200 L-20 1200 Z" fill="#0A0E1A" />
      <path d="M-20 1320 Q540 1270 1100 1320 L1100 1920 L-20 1920 Z" fill="#14100E" />
    </svg>
    <Fog f={f} y={1150} o={0.18} />
  </AbsoluteFill>
);
const Stone: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r * 0.8, width: r * 2, height: r * 1.6, borderRadius: "46% 54% 42% 58%", background: "radial-gradient(circle at 35% 30%, #B8B0A4, #6E675E 60%, #3A3630)", boxShadow: "0 6px 14px rgba(0,0,0,0.6)", transform: `rotate(${rot}deg)` }} />
);
// Jesús: túnica clara y aura cálida
const Jesus: React.FC<{ f: number; x: number; y: number; h: number; kneel?: number; arm?: number; glow?: number }> = ({ f, x, y, h, kneel = 0, arm = 0, glow = 0.5 }) => (
  <Figure f={f} x={x} y={y} h={h} rim="#FFE3B0" rimSide={1} cloth="#E9E2D2" hood={false} kneel={kneel} arm={arm} glow={glow} />
);
// la multitud con piedras en alto
const Crowd: React.FC<{ f: number; raised: number; leave?: number; y?: number; n?: number }> = ({ f, raised, leave = 0, y = 1500, n = 8 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const x = 540 + side * (170 + Math.floor(i / 2) * 120);
      const gone = ip(leave * n - i, [0, 1], [0, 1]);
      const dx = side * gone * 400;
      if (gone >= 1) return null;
      return (
        <div key={i} style={{ opacity: 1 - gone }}>
          <Figure f={f + i * 9} x={x + dx} y={y + (i % 3) * 22} h={430 - (i % 3) * 30} rim="#FF9A4A" rimSide={side > 0 ? -1 : 1} cloth="#2A2420" hood={i % 3 !== 1} arm={raised * 150} armSide={side > 0 ? -1 : 1} flip={side > 0} />
          {raised > 0.5 && leave * n - i < 0 ? <Stone x={x + dx - side * 95} y={y - 430 + (i % 3) * 22 + 40} r={22} /> : null}
        </div>
      );
    })}
  </>
);

// ---------- escenas ----------
// 1 · el único que podía tirar la piedra no la tiró — la multitud levanta las piedras, Jesús en medio, con las manos vacías
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f0 = useCurrentFrame();
  const f = frozen !== undefined ? S(frozen) : f0;
  const t = t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 4.6], [1.0, 1.12])})`, transformOrigin: "540px 1200px" }}>
      <Night f={f} />
      {[160, 920].map((x) => <Torch key={x} f={f} x={x} y={1260} s={1} />)}
      <Crowd f={f} raised={ip(t, [0.3, 1.4], [0, 1])} />
      <Jesus f={f} x={540} y={1560} h={560} glow={0.6} />
      <Chip x={540} y={560} t={S(t - 3.1)} text="EL ÚNICO" accent="#FFE3B0" />
    </AbsoluteFill>
  );
};
// 2 · la pusieron en medio de todos
const C2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 3.6], [1.15, 1.0])})`, transformOrigin: "540px 1300px" }}>
      <Night f={f} />
      {[200, 880].map((x) => <Torch key={x} f={f} x={x} y={1230} s={0.9} />)}
      <Crowd f={f} raised={0.2} y={1480} n={10} />
      <Figure f={f} x={540} y={1620} h={340} rim="#FFC890" rimSide={1} cloth="#8A2A2A" hood kneel={1} head={20} />
      <Chip x={540} y={600} t={S(t - at("adulterio"))} text="ADULTERIO" accent="#FF6A5A" />
    </AbsoluteFill>
  );
};
// 3 · la ley mandaba apedrearla — un fariseo señala y pregunta
const C3: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t, ft } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `translateX(${ip(t, [t0, t0 + 4], [40, -40])}px) scale(1.08)` }}>
      <Night f={f} />
      <Torch f={f} x={860} y={1200} s={1.1} />
      <Figure f={f} x={300} y={1600} h={600} rim="#FF9A4A" rimSide={1} cloth="#3A2A3A" hood arm={90} />
      <Jesus f={f} x={780} y={1560} h={520} />
      <Chip x={540} y={560} t={S(t - at("ley"))} text="LEY DE MOISÉS" small="Levítico 20:10" />
      <Bubble x={380} y={900} t={ft(at("tú"))} text="«¿Tú qué dices?»" out={S(1.6)} />
    </AbsoluteFill>
  );
};
// 4 · se agachó y escribió en el suelo (portada)
const C4: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f0 = useCurrentFrame();
  const f = frozen !== undefined ? S(frozen) : f0;
  const t = t0 + f / FPS;
  const w = ip(t, [at("escribió"), at("escribió") + 1.4], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 2.8], [1.35, 1.5])})`, transformOrigin: "600px 1640px" }}>
      <Night f={f} warm={0.3} />
      <Crowd f={f} raised={1} y={1380} n={8} />
      <div style={{ position: "absolute", inset: 0, transform: "rotate(0deg)" }}>
        <Figure f={f} x={500} y={1660} h={540} rim="#FFE3B0" rimSide={1} cloth="#E9E2D2" hood={false} kneel={1} lean={14} arm={-35} head={22} glow={0.7} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 1660, width: 520, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(232,210,168,0.35), rgba(232,210,168,0) 70%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${560 + i * 70} ${1700 + (i % 2) * 14} q22 -30 44 0 t44 0`} stroke="#F6E2B8" strokeWidth={9} strokeLinecap="round" fill="none" strokeDasharray={180} strokeDashoffset={180 * (1 - ip(w, [i / 4, (i + 1) / 4], [0, 1]))} style={{ filter: "drop-shadow(0 0 8px rgba(255,220,160,0.8))" }} />)}
      </svg>
      <Chip x={540} y={840} t={frozen !== undefined ? 30 : S(t - at("suelo"))} text="¿QUÉ ESCRIBIÓ?" accent="#FFE3B0" />
    </AbsoluteFill>
  );
};
// 5 · el que esté sin pecado, que tire la primera piedra
const C5: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t, ft } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 3], [1.0, 1.08])})` }}>
      <Night f={f} warm={0.3} />
      <Crowd f={f} raised={1} y={1460} n={10} />
      <Jesus f={f} x={540} y={1600} h={600} arm={40} glow={0.8} />
      <Bubble x={540} y={860} t={ft(at("el", 2))} text="«El que esté sin pecado…»" out={S(1.4)} />
      <Bubble x={540} y={860} t={ft(at("que", 3))} text="«…que tire la primera piedra»" tail="right" out={S(1.8)} />
    </AbsoluteFill>
  );
};
// 6 · uno a uno, soltaron las piedras y se fueron
const C6: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const leave = ip(t, [at("uno"), at("fueron") + 0.4], [0, 1]);
  return (
    <AbsoluteFill>
      <Night f={f} warm={0.3} />
      <Crowd f={f} raised={1} leave={leave} y={1460} n={10} />
      {Array.from({ length: 10 }, (_, i) => { const d = leave * 10 - i; if (d < 0) return null; const k = ip(d, [0, 0.4], [0, 1]); const side = i % 2 ? 1 : -1; return <Stone key={i} x={540 + side * (170 + Math.floor(i / 2) * 120) - side * 95} y={ip(k, [0, 1], [1040, 1500 + (i % 3) * 20])} r={22} rot={i * 40} />; })}
      <Jesus f={f} x={540} y={1600} h={600} glow={0.8} />
    </AbsoluteFill>
  );
};
// 7 · solo quedó él, el único sin pecado
const C7: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 2.5], [1.2, 1.0])})`, transformOrigin: "540px 1400px" }}>
      <Night f={f} warm={0.4} />
      {Array.from({ length: 10 }, (_, i) => <Stone key={i} x={140 + i * 85} y={1520 + (i % 3) * 30} r={20} rot={i * 33} />)}
      <Jesus f={f} x={620} y={1580} h={560} glow={1} />
      <Figure f={f} x={400} y={1600} h={300} rim="#FFC890" rimSide={1} cloth="#8A2A2A" hood kneel={1} head={20} />
      <Chip x={540} y={560} t={S(t - at("único", 2))} text="EL ÚNICO SIN PECADO" accent="#FFE3B0" />
    </AbsoluteFill>
  );
};
// 8 · ni yo te condeno; vete, y no peques más — la luz crece
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t, ft } = useT(t0);
  const light = ip(t, [at("condeno"), at("condeno") + 2], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 4.5], [1.0, 1.1])})`, transformOrigin: "540px 1400px" }}>
      <Night f={f} warm={0.4 + 0.5 * light} />
      <GodRays f={f} x={600} y={-100} color="#FFE6B8" o={0.12 + 0.3 * light} n={9} />
      <Jesus f={f} x={620} y={1580} h={600} arm={ip(t, [at("dijo", 1), at("dijo", 1) + 0.6], [0, 70])} glow={1} />
      <Figure f={f} x={400} y={1600} h={ip(light, [0, 1], [300, 360])} rim="#FFE0B0" rimSide={1} cloth="#8A2A2A" hood kneel={ip(light, [0, 1], [1, 0.4])} head={ip(light, [0, 1], [20, -6])} />
      <Bubble x={620} y={900} t={ft(at("ni"))} text="«Ni yo te condeno»" tail="right" out={S(1.2)} />
      <Bubble x={620} y={900} t={ft(at("vete"))} text="«Vete, y no peques más»" tail="right" out={S(2.1)} />
    </AbsoluteFill>
  );
};
// 9 · si sientes que todos te señalan… el único que tenía derecho a condenarte eligió no hacerlo
const C9: React.FC<{ t0: number }> = ({ t0 }) => {
  const { f, t } = useT(t0);
  const point = ip(t, [at("señalan") - 0.3, at("señalan") + 0.2], [0, 1]);
  const drop = ip(t, [at("eligió"), at("hacerlo") + 0.6], [0, 1]);
  return (
    <AbsoluteFill>
      <Night f={f} warm={0.6} />
      <GodRays f={f} x={540} y={-100} color="#FFE6B8" o={0.15 + 0.3 * drop} n={11} />
      {Array.from({ length: 8 }, (_, i) => {
        const side = i % 2 ? 1 : -1; const x = 540 + side * (230 + Math.floor(i / 2) * 110);
        return <div key={i} style={{ opacity: point * (1 - drop) }}><Figure f={f + i * 7} x={x} y={1560 + (i % 3) * 20} h={420 - (i % 3) * 30} rim="#FF9A4A" rimSide={side > 0 ? -1 : 1} cloth="#2A2420" hood={i % 3 !== 1} arm={ip(drop, [0, 0.5], [90, 0])} armSide={side > 0 ? -1 : 1} flip={side > 0} /></div>;
      })}
      <Jesus f={f} x={540} y={1620} h={ip(drop, [0, 1], [420, 600])} glow={1} />
    </AbsoluteFill>
  );
};

const SCENES: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("la", 1), C2], [at("la", 3), C3], [at("él"), C4], [at("el", 2), C5], [at("uno"), C6], [at("solo"), C7], [at("y", 4), C8], [at("así"), C9],
];
const SFX: [number, string, number][] = [
  [at("soltaron") + 0.1, "sfx/drop.wav", 0.35], [at("piedras") + 0.3, "sfx/drop.wav", 0.3], [at("condeno"), "sfx/shimmer.wav", 0.3],
];

export const Adultera: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* portada: Jesús agachado escribiendo, la multitud con piedras y «¿QUÉ ESCRIBIÓ?» */}
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C4 t0={at("él")} frozen={2.0} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ filter: "brightness(1.18) contrast(1.12) saturate(1.12)" }}>
        {SCENES.map(([t0, C], i) => {
          const end = SCENES[i + 1]?.[0] ?? END;
          return <Sequence key={i} from={S(t0)} durationInFrames={Math.max(1, S(end) - S(t0))}><C t0={t0} /></Sequence>;
        })}
      </AbsoluteFill>
      <Grain f={f} />
      <Vignette s={0.7} />
      {t >= TH ? <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} /> : null}
      <Sequence from={S(TH)}><Audio src={staticFile("adultera/mezcla.wav")} /></Sequence>
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
