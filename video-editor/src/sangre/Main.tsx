import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/sangre/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Ash, Brush, Defs, Draw, Paper } from "../judas/Dark";

// ZK Dark · "¿Por qué Jesús sudó sangre?" (Lucas 22:44). Fotograma 0–2 = portada; el rojo solo es sangre.
const TH = 0.1; // portada dentro del video (3 fotogramas)
const END = 26.6;
export const SANGRE_TOTAL = S(END);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const KEYS = new Set(["jesús", "sangre", "médico", "gotas", "tierra", "hematohidrosis", "miedo", "rompen", "noche", "huyó", "oró", "difícil"]);
const RED = "#D30F17";
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const W = 1080, H = 1920;
const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <svg width={W} height={H} style={{ position: "absolute", inset: 0, ...style }}>{children}</svg>;
const Serif: React.FC<{ txt: string; y: number; size: number; o?: number; color?: string; ls?: number }> = ({ txt, y, size, o = 1, color = "#F2F2F2", ls = 4 }) => (
  <text x={540} y={y} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={size} fill={color} letterSpacing={ls} opacity={o} filter="url(#ink)">{txt}</text>
);
const Drop: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <path d={`M${x} ${y - r * 1.6} Q${x + r} ${y - r * 0.2} ${x + r} ${y + r * 0.3} A${r} ${r} 0 1 1 ${x - r} ${y + r * 0.3} Q${x - r} ${y - r * 0.2} ${x} ${y - r * 1.6} Z`} fill={RED} opacity={o} />
);
const useT = (t0: number) => { const f = useCurrentFrame(); return { f, t: t0 + f / FPS }; };
// tiempo real de una palabra (ya incluye la portada)
const at = (word: string, nth = 0) => WORDS.filter((w) => w.w.toLowerCase().replace(/[^a-záéíóúñ]/g, "") === word)[nth]?.s ?? 0;

// rostro de Jesús en grabado: pelo largo, barba, ojos cerrados
const Face: React.FC<{ p: number; s?: number }> = ({ p, s = 1 }) => (
  <g filter="url(#ink)" transform={`translate(540 1040) scale(${s})`}>
    <path d="M-260 -80 Q-250 -440 0 -470 Q250 -440 260 -80 L300 520 L-300 520 Z" fill="url(#h2)" opacity={ip(p, [0.5, 1], [0, 0.5])} />
    <Draw d="M-260 -80 Q-250 -440 0 -470 Q250 -440 260 -80 L300 520" p={p} w={7} len={2200} />
    <Draw d="M-260 -80 L-300 520" p={p} w={7} len={700} />
    <path d="M-170 -60 Q-170 -330 0 -340 Q170 -330 170 -60 Q170 180 0 250 Q-170 180 -170 -60 Z" fill="#050505" />
    <Draw d="M-170 -60 Q-170 -330 0 -340 Q170 -330 170 -60 Q170 180 0 250 Q-170 180 -170 -60" p={ip(p, [0.1, 0.8], [0, 1])} w={6} len={1500} />
    <path d="M-150 60 Q-130 300 0 360 Q130 300 150 60 Q90 150 0 150 Q-90 150 -150 60 Z" fill="url(#h1)" opacity={ip(p, [0.4, 1], [0, 0.9])} />
    <Draw d="M-120 -70 Q-80 -90 -40 -70 M40 -70 Q80 -90 120 -70" p={ip(p, [0.3, 0.8], [0, 1])} w={5} len={300} />
    <Draw d="M-115 -30 Q-80 -15 -45 -30 M45 -30 Q80 -15 115 -30" p={ip(p, [0.4, 0.9], [0, 1])} w={5} len={300} />
    <Draw d="M0 -20 L-10 70 L14 76" p={ip(p, [0.5, 1], [0, 1])} w={4} len={200} />
    <Draw d="M-50 130 Q0 115 50 130" p={ip(p, [0.6, 1], [0, 1])} w={4} len={160} />
  </g>
);
// figura arrodillada, de perfil
const Kneel: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#050505" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <circle cx={30} cy={-330} r={52} />
    <path d="M-10 -280 Q90 -270 110 -170 Q130 -60 170 0 L210 60 L-150 60 Q-170 -20 -120 -60 Q-80 -110 -60 -200 Q-50 -270 -10 -280 Z" />
    <path d="M60 -230 Q140 -260 150 -330 L170 -340 Q170 -240 80 -200 Z" />
  </g>
);

// ---------- escenas ----------
// 1 · gancho y portada: el rostro, las gotas rojas y "¿SUDÓ SANGRE?"
const C1: React.FC<{ t0: number; frozen?: number }> = ({ t0, frozen }) => {
  const f = useCurrentFrame();
  const t = frozen ?? t0 + f / FPS;
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [0, 1.8], [1.08, 1.0])})` }}>
      <Svg>
        <Face p={eo(ip(t, [0, 0.9], [0.35, 1]))} s={1.15} />
        {[[-70, -150, 0.3], [60, -170, 0.5], [-20, -120, 0.75], [110, -110, 0.95]].map(([dx, dy, a0], i) => { const k = ip(t, [a0, a0 + 1.4], [0, 1]); return k > 0 ? <Drop key={i} x={540 + dx * 1.15} y={1040 + dy * 1.15 + k * 260} r={16 + (i % 2) * 5} /> : null; })}
        <Serif txt="¿SUDÓ" y={500} size={150} o={ip(t, [0.5, 0.75], [0, 1])} />
        <g filter="url(#brushH)"><text x={540} y={1760} textAnchor="middle" fontFamily="Kit Poppins Black" fontWeight={900} fontSize={170} fill={RED} style={{ clipPath: `inset(0 ${(1 - eo(ip(t, [1.2, 1.55], [0, 1]))) * 100}% 0 0)` }}>SANGRE?</text></g>
      </Svg>
    </AbsoluteFill>
  );
};
// 2 · tipografía: ¿METÁFORA? tachado
const C2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return <AbsoluteFill><Svg><Serif txt="¿METÁFORA?" y={1010} size={150} o={ip(t, [at("forma"), at("forma") + 0.2], [0, 1])} /><Brush d="M110 960 L970 990" p={eo(ip(t, [at("hablar"), at("hablar") + 0.35], [0, 1]))} w={90} len={880} /></Svg></AbsoluteFill>;
};
// 3 · grabado: la pluma que escribe; LUCAS · MÉDICO
const C3: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const p = ip(t, [t0, t0 + 2.2], [0, 1]);
  const px = 220 + p * 640, py = 980 + Math.floor(p * 4) * 0;
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          <rect x={150} y={700} width={780} height={620} fill="url(#h2)" opacity={0.15} />
          <Draw d="M150 700 L930 700 L930 1320 L150 1320 Z" p={ip(t, [t0, t0 + 0.5], [0, 1])} w={6} len={2900} />
          {[820, 900, 980, 1060, 1140].map((y, i) => <Draw key={y} d={`M220 ${y} Q400 ${y - 14} 540 ${y} T860 ${y}`} p={ip(p, [i * 0.18, i * 0.18 + 0.2], [0, 1])} w={4} len={700} />)}
          <g transform={`translate(${px} ${820 + Math.min(4, Math.floor(p * 5)) * 80}) rotate(-35)`}><path d="M0 0 L-14 -40 L14 -40 Z" fill="#F2F2F2" /><path d="M0 -40 Q60 -260 20 -420 Q-40 -260 0 -40" fill="none" stroke="#F2F2F2" strokeWidth={5} /></g>
        </g>
        <Serif txt="LUCAS · MÉDICO" y={1480} size={80} o={ip(t, [at("médico"), at("médico") + 0.2], [0, 1])} />
        <Serif txt="Colosenses 4:14" y={1560} size={40} o={ip(t, [at("médico") + 0.2, at("médico") + 0.4], [0, 0.7])} ls={2} />
      </Svg>
    </AbsoluteFill>
  );
};
// 4 · macro: gotas rojas caen sobre la piedra de Getsemaní
const C4: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 3.7], [1.0, 1.1])})` }}>
      <Svg>
        <g filter="url(#ink)">
          <path d="M-20 1500 Q200 1380 420 1440 Q620 1360 820 1430 Q980 1400 1100 1460 L1100 1920 L-20 1920 Z" fill="url(#h1)" opacity={0.5} />
          <Draw d="M-20 1500 Q200 1380 420 1440 Q620 1360 820 1430 Q980 1400 1100 1460" p={1} w={6} />
          <Draw d="M120 1600 Q300 1560 420 1640 M600 1580 Q760 1540 900 1620" p={1} w={3} />
        </g>
        {[0, 1, 2, 3, 4].map((i) => {
          const a0 = at("gotas") + i * 0.45 - 0.3; const k = ip(t, [a0, a0 + 0.55], [0, 1]);
          const x = 300 + i * 120; const y = 400 + k * 1000;
          return k <= 0 ? null : k < 1 ? <Drop key={i} x={x} y={y} r={26} /> : <ellipse key={i} cx={x} cy={1430} rx={ip(t, [a0 + 0.55, a0 + 0.8], [10, 70])} ry={12} fill={RED} />;
        })}
        <Serif txt="LUCAS 22:44" y={460} size={70} o={ip(t, [t0 + 0.2, t0 + 0.4], [0, 0.8])} />
      </Svg>
    </AbsoluteFill>
  );
};
// 5 · tipografía gigante: HEMATO / HIDROSIS
const C5: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const a0 = at("hematohidrosis");
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [a0, a0 + 0.12], [1.25, 1])})` }}>
      <Svg>
        <Serif txt="HOY TIENE NOMBRE" y={700} size={60} o={ip(t, [t0, t0 + 0.2], [0, 0.8])} ls={8} />
        <Serif txt="HEMATO" y={960} size={200} o={ip(t, [a0, a0 + 0.06], [0, 1])} ls={6} />
        <Serif txt="HIDROSIS" y={1170} size={180} o={ip(t, [a0 + 0.25, a0 + 0.31], [0, 1])} color={RED} ls={6} />
      </Svg>
    </AbsoluteFill>
  );
};
// 6 · dato: corte de piel, la glándula del sudor y el vaso que se rompe
const C6: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const br = ip(t, [at("rompen"), at("rompen") + 0.5], [0, 1]);
  const coil = Array.from({ length: 9 }, (_, i) => `${i ? "L" : "M"}${470 + Math.cos(i * 1.3) * 70 + i * 16} ${1320 + Math.sin(i * 1.3) * 50}`).join(" ");
  return (
    <AbsoluteFill>
      <Svg>
        <g filter="url(#ink)">
          {[700, 820, 1000].map((y, i) => <Draw key={y} d={`M80 ${y} Q540 ${y - 30} 1000 ${y}`} p={ip(t, [t0 + i * 0.15, t0 + 0.6 + i * 0.15], [0, 1])} w={5} len={1000} />)}
          <rect x={80} y={700} width={920} height={120} fill="url(#h1)" opacity={0.45} />
          <Draw d={`M560 700 L560 1240 ${coil}`} p={ip(t, [t0 + 0.4, t0 + 1.4], [0, 1])} w={7} len={1700} />
          <Serif txt="GLÁNDULA DEL SUDOR" y={1520} size={44} o={ip(t, [at("glándulas"), at("glándulas") + 0.2], [0, 0.85])} ls={2} />
          {[[300, 1180, 820, 1200], [280, 1260, 840, 1300]].map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <path d={`M${x1} ${y1} Q540 ${y1 - 60} ${x2} ${y2}`} stroke={br > 0 ? RED : "#F2F2F2"} strokeWidth={14} fill="none" strokeDasharray={br > 0 ? `${200 - br * 120} ${br * 60}` : "none"} opacity={ip(t, [at("vasos"), at("vasos") + 0.2], [0, 1])} />
            </g>
          ))}
        </g>
        {br > 0 ? Array.from({ length: 10 }, (_, i) => <circle key={i} cx={560 + (random(`b${i}`) - 0.5) * 60} cy={1220 - br * (100 + i * 50)} r={10 + random(`br${i}`) * 10} fill={RED} opacity={0.9} />) : null}
      </Svg>
    </AbsoluteFill>
  );
};
// 7 · macro: la gota roja sale del poro
const C7: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const g = eo(ip(t, [at("sangre", 2), at("sudor", 2)], [0, 1]));
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.8], [1.0, 1.12])})` }}>
      <Svg>
        <g filter="url(#ink)">
          <rect x={0} y={0} width={1080} height={1920} fill="url(#h2)" opacity={0.18} />
          <ellipse cx={540} cy={1080} rx={120} ry={60} fill="#050505" stroke="#F2F2F2" strokeWidth={6} />
          {Array.from({ length: 14 }, (_, i) => <Draw key={i} d={`M${100 + i * 70} ${1300 + (i % 3) * 30} q60 -40 120 0`} p={1} w={3} />)}
        </g>
        <Drop x={540} y={1060 - g * 160} r={30 + g * 70} />
      </Svg>
    </AbsoluteFill>
  );
};
// 8 · silueta: Jesús arrodillado entre olivos, contra la luna
const C8: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.8], [1.0, 1.06])})` }}>
      <Svg>
        <g filter="url(#ink)">
          <circle cx={540} cy={760} r={330} fill="url(#h1)" opacity={0.4} />
          <Draw d="M870 760 A330 330 0 1 1 869.9 759.5" p={ip(t, [t0, t0 + 0.7], [0, 1])} w={6} len={2100} />
        </g>
        {[[140, 1.0], [930, -1]].map(([x, sd], i) => <path key={i} d={`M${x} 1500 Q${x + 20 * sd} 1200 ${x - 10 * sd} 1000 Q${x - 160 * sd} 950 ${x - 120 * sd} 860 Q${x + 40 * sd} 820 ${x + 140 * sd} 900 Q${x + 200 * sd} 1000 ${x + 40 * sd} 1060 Q${x + 60 * sd} 1300 ${x + 70 * sd} 1500 Z`} fill="#050505" stroke="#F2F2F2" strokeWidth={4} />)}
        <path d="M-20 1500 L1100 1500 L1100 1920 L-20 1920 Z" fill="#050505" />
        <Draw d="M-20 1500 L1100 1500" p={1} w={5} />
        <Kneel x={540} y={1440} s={1.4} />
      </Svg>
    </AbsoluteFill>
  );
};
// 9 · plano negativo: fondo blanco, la figura arrodillada en negro
const C9: React.FC<{ t0: number }> = () => (
  <AbsoluteFill style={{ background: "#F2EFE8" }}>
    <Svg><Kneel x={540} y={1300} s={2.0} color="#0A0A0A" /><path d="M0 1384 L1080 1384" stroke="#0A0A0A" strokeWidth={6} /></Svg>
  </AbsoluteFill>
);
// 10 · cámara lenta: manos juntas y una gota roja que cae
const C10: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const k = ip(t, [t0 + 0.2, t0 + 1.2], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${ip(t, [t0, t0 + 1.3], [1.1, 1.16])})` }}>
      <Svg>
        <g filter="url(#ink)" transform="translate(540 1080)">
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <path d={`M0 -360 Q${sd * 120} -320 ${sd * 150} -100 Q${sd * 170} 120 ${sd * 120} 260 L0 260 Z`} fill="url(#h2)" opacity={0.5} />
              <path d={`M0 -360 Q${sd * 120} -320 ${sd * 150} -100 Q${sd * 170} 120 ${sd * 120} 260 L${sd * 60} 420`} fill="none" stroke="#F2F2F2" strokeWidth={7} />
            </g>
          ))}
          <path d="M0 -360 L0 260" stroke="#F2F2F2" strokeWidth={4} />
          {[-1, 1].map((sd) => [1, 2, 3].map((i) => <path key={`${sd}${i}`} d={`M${sd * 34 * i} ${-330 + i * 26} Q${sd * (34 * i + 14)} ${-150 + i * 10} ${sd * 34 * i} ${-40 + i * 6}`} stroke="#F2F2F2" strokeWidth={3} fill="none" />))}
          {[-1, 1].map((sd) => <path key={`t${sd}`} d={`M${sd * 40} -40 Q${sd * 70} 60 ${sd * 30} 140`} stroke="#F2F2F2" strokeWidth={6} fill="none" />)}
        </g>
        <Drop x={560} y={1360 + k * 380} r={24} />
      </Svg>
    </AbsoluteFill>
  );
};
// 11 · el teléfono grabado → negro (bucle)
const C11: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT(t0);
  const sent = t >= at("noche", 1);
  return (
    <AbsoluteFill style={{ opacity: ip(t, [END - 0.45, END], [1, 0]) }}>
      <Svg>
        <g filter="url(#ink)"><rect x={300} y={480} width={480} height={980} rx={60} fill="#050505" stroke="#F2F2F2" strokeWidth={9} /><rect x={480} y={510} width={120} height={20} rx={10} fill="#F2F2F2" /></g>
        <g transform={`translate(0 ${sent ? 0 : 400})`} opacity={sent ? 1 : 0}>
          <rect x={350} y={700} width={380} height={190} rx={30} fill={RED} />
          <text x={540} y={780} textAnchor="middle" fontFamily="Kit Poppins" fontWeight={600} fontSize={34} fill="#fff">¿Sabías por qué Jesús</text>
          <text x={540} y={830} textAnchor="middle" fontFamily="Kit Poppins" fontWeight={600} fontSize={34} fill="#fff">sudó sangre?</text>
        </g>
        <circle cx={700} cy={1380} r={44} fill={sent ? RED : "#F2F2F2"} />
      </Svg>
    </AbsoluteFill>
  );
};

const SC: [number, React.FC<{ t0: number }>][] = [
  [TH, C1], [at("y"), C2], [at("lucas"), C3], [at("su"), C4], [at("hoy"), C5], [at("bajo"), C6], [at("y", 1), C7], [at("jesús", 1), C8], [at("y", 2), C9], [at("oró") - 0.25, C10], [at("mándaselo") + 0.45, C11],
];
const SFX: [number, string, number][] = [
  [at("sangre") + 0.2, "sangre/gota.wav", 0.4], [at("gotas") + 0.25, "sangre/gota.wav", 0.35], [at("hematohidrosis"), "judas/golpe.wav", 0.45],
  [at("miedo"), "judas/latido.wav", 0.35], [at("oró") + 0.7, "sangre/gota.wav", 0.4],
];

export const Sangre: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.93 + 0.07 * random(`fl${Math.floor(f / 2)}`);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Defs />
      {/* portada: fotograma limpio del gancho, 3 fotogramas, el último funde */}
      {f < 3 ? <AbsoluteFill style={{ opacity: f === 2 ? 0.5 : 1 }}><C1 t0={0} frozen={1.8} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ opacity: flick }}>
        {SC.map(([t0, C], i) => {
          const end = SC[i + 1]?.[0] ?? END;
          return <Sequence key={i} from={S(t0)} durationInFrames={Math.max(1, S(end) - S(t0))}><C t0={t0} /></Sequence>;
        })}
      </AbsoluteFill>
      {t >= TH ? <Ash f={f} /> : null}
      <Paper f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      {t >= TH ? <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} /> : null}
      <Sequence from={S(TH)}><Audio src={staticFile("sangre/mezcla.wav")} /></Sequence>
      {SFX.map(([a, n, v], i) => <Sequence key={i} from={S(a)} durationInFrames={45}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
