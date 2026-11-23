import React from "react";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Character, Flame, Glow, H, Jar, Letterbox, OilLamp, Palm, W, ip, kf, rnd } from "./Kit";

loadFont({ family: "YCap", url: staticFile("fonts/poppins-latin-900-normal.woff2"), weight: "900" });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };

// =============== 1. PERSONAJE: casa en Egipto, noche de la Pascua ===============
export const DemoPersonaje: React.FC = () => {
  const t = useT();
  const x = kf(t, [[0, 260], [1.7, 760]], (v) => v);
  const walking = t < 1.7;
  const knock = 3.05;
  const doorShake = t > knock && t < knock + 0.5 ? Math.sin((t - knock) * 70) * 4 * (1 - (t - knock) / 0.5) : 0;
  const turned = t > knock + 0.18;
  const picked = t > 2.55;
  const lampLift = kf(t, [[2.25, 0], [2.6, 1], [4.2, 1], [4.7, 1.35]]);
  const armR: [number, number] = picked
    ? [kf(t, [[2.55, 62], [2.9, 40], [4.2, 40], [4.7, 105]]), kf(t, [[2.55, 30], [2.9, 70], [4.2, 70], [4.7, -10]])]
    : [kf(t, [[1.7, 8], [2.25, 62]]), kf(t, [[1.7, 10], [2.25, 30]])];
  const lampOnTable = !picked;
  const shock = t > knock + 0.15 && t < knock + 1.2;
  const pose = {
    walk: walking ? t * 1.25 : undefined,
    look: (turned ? [0.9, -0.1] : t > 1.7 ? [0.6, 0.6] : [0.8, 0]) as [number, number],
    brow: shock ? 1 : t > 4.2 ? 0.5 : t > 1.9 ? 0.2 : 0,
    browTilt: t > 4.2 ? -1 : 0,
    mouth: (shock ? "o" : t > 4.2 ? "worry" : t > 1.9 ? "smile" : "flat") as "o" | "worry" | "smile" | "flat",
    mouthOpen: shock ? 1 : 0,
    squash: t > knock + 0.15 && t < knock + 0.45 ? Math.sin(((t - knock - 0.15) / 0.3) * Math.PI) * -0.9 : 0,
    lean: t > 2.1 && t < 2.7 ? 6 : 0,
    armR,
    armL: (shock ? [35, 60] : undefined) as [number, number] | undefined,
  };
  const lampX = 990, lampY = 742;
  // posición de la lámpara para la luz
  const handX = turned ? x - 95 : x + 95;
  const lx = lampOnTable ? lampX + 52 : handX, ly = lampOnTable ? lampY - 20 : 640 - lampLift * 120;
  const fl = 1 + Math.sin(t * 19) * 0.05 + Math.sin(t * 31) * 0.04;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6B4A35" /><stop offset="100%" stopColor="#8E6445" /></linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3E2C" /><stop offset="100%" stopColor="#3A281D" /></linearGradient>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0E1838" /><stop offset="100%" stopColor="#2A3C72" /></linearGradient>
          <radialGradient id="dark" cx="50%" cy="55%" r="75%"><stop offset="40%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.75" /></radialGradient>
          <linearGradient id="door" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4A2E1C" /><stop offset="100%" stopColor="#6A4429" /></linearGradient>
        </defs>
        {/* pared */}
        <rect width={W} height={860} fill="url(#wall)" />
        {Array.from({ length: 14 }).map((_, r) => Array.from({ length: 12 }).map((__, c) => (
          <rect key={`${r}-${c}`} x={c * 170 + (r % 2) * 85 - 40} y={r * 62} width={164} height={56} rx={6} fill="#000" opacity={0.05 + rnd(r * 13 + c) * 0.05} />
        )))}
        {/* ventana arqueada */}
        <g transform="translate(1330 230)">
          <path d="M0 260 L0 90 A 110 110 0 0 1 220 90 L 220 260 Z" fill="url(#sky1)" />
          <circle cx={150} cy={90} r={34} fill="#F3EFD8" />
          <circle cx={150} cy={90} r={70} fill="#F3EFD8" opacity={0.12} />
          {[[40, 60], [80, 150], [180, 200], [60, 210], [120, 40]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.2} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
          <path d="M-10 270 L0 90 A 110 110 0 0 1 220 90 L 230 270" stroke="#3E2817" strokeWidth={18} fill="none" />
          <path d="M-30 270 L 250 270" stroke="#4A301E" strokeWidth={22} strokeLinecap="round" />
          <path d={`M-6 70 Q 30 ${160 + Math.sin(t * 1.5) * 6} 10 280 L -14 280 Z`} fill="#8C3B2E" opacity={0.9} />
        </g>
        {/* estante con vasijas */}
        <rect x={560} y={330} width={330} height={16} rx={4} fill="#4A301E" />
        <g transform="translate(610 330)"><Jar s={0.7} /></g>
        <g transform="translate(700 330)"><Jar s={0.55} c="#8C5530" /></g>
        <g transform="translate(800 330)"><Jar s={0.8} c="#B67A45" /></g>
        {/* puerta con sangre en el dintel */}
        <g transform={`translate(${190 + doorShake} 300)`}>
          <rect x={-30} y={-40} width={300} height={600} fill="#3A2416" />
          <rect x={0} y={0} width={240} height={560} fill="url(#door)" />
          {[60, 120, 180].map((v) => <rect key={v} x={v} y={0} width={4} height={560} fill="#000" opacity={0.25} />)}
          <rect x={20} y={120} width={200} height={14} fill="#2E1C10" /><rect x={20} y={400} width={200} height={14} fill="#2E1C10" />
          <circle cx={205} cy={300} r={9} fill="#C9A15A" />
          <path d="M-20 -30 Q 60 -18 120 -32 Q 190 -18 260 -30 L 258 -8 Q 180 4 120 -10 Q 60 6 -18 -10 Z" fill="#8E1414" />
          <path d="M-24 -10 Q -18 120 -22 240" stroke="#8E1414" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M264 -10 Q 258 110 262 220" stroke="#8E1414" strokeWidth={14} fill="none" strokeLinecap="round" />
          {[30, 90, 170, 230].map((v, i) => <path key={i} d={`M${v} -10 L ${v + 2} ${10 + i * 7}`} stroke="#8E1414" strokeWidth={6} strokeLinecap="round" />)}
        </g>
        {/* piso + tapete */}
        <rect y={860} width={W} height={220} fill="url(#floor)" />
        <path d="M520 900 L 1420 900 L 1560 1010 L 380 1010 Z" fill="#7A2E22" />
        <path d="M560 920 L 1400 920 M 520 985 L 1440 985" stroke="#D8A04C" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${560 + i * 72} 935 l 18 22 l -18 22 l -18 -22 z`} fill="#D8A04C" opacity={0.8} />)}
        {/* mesa baja */}
        <ellipse cx={1010} cy={880} rx={170} ry={16} fill="#000" opacity={0.3} />
        <rect x={860} y={748} width={300} height={26} rx={6} fill="#6E4527" />
        <rect x={860} y={770} width={300} height={10} fill="#4A2D18" />
        <rect x={880} y={778} width={22} height={100} fill="#4A2D18" /><rect x={1118} y={778} width={22} height={100} fill="#4A2D18" />
        <g transform="translate(1080 748)"><Jar s={0.5} c="#C08A55" /></g>
        <ellipse cx={930} cy={748} rx={34} ry={6} fill="#D9C9A5" />
        {lampOnTable ? <g transform={`translate(${lampX} ${lampY + 6})`}><OilLamp t={t} /></g> : null}
        {/* personaje */}
        <Character id="p1" x={x} y={884} s={1.2} t={t} facing={turned ? -1 : 1} pose={pose} light={0.9} lightX={1}
          holdR={!lampOnTable ? <g transform="translate(-6 4)"><OilLamp t={t} /></g> : null} />
        {/* luz */}
        <Glow id="lamp" x={lx} y={ly} r={520 * fl} o={0.9} />
        <rect width={W} height={H} fill="url(#dark)" />
        <Glow id="lamp2" x={lx} y={ly} r={160 * fl} o={0.6} c="#FFD9A0" />
      </svg>
      {t > knock && t < knock + 1.0 ? (
        <div style={{ position: "absolute", left: 360, top: 330, fontFamily: "YCap", fontSize: 70, color: "#FFF", WebkitTextStroke: "10px #2A160A", paintOrder: "stroke fill", transform: `rotate(-8deg) scale(${ip(t, [knock, knock + 0.12], [0.3, 1])})` }}>TOC TOC</div>
      ) : null}
      <Caption t={t} x={W / 2} y={170} words={[["¿QUIÉN", 3.75], ["ESTÁ", 4.05], ["AHÍ?", 4.3]]} />
      <Letterbox />
    </AbsoluteFill>
  );
};

// =============== 2. ESCENA: Egipto de noche, la niebla avanza ===============
const House: React.FC<{ x: number; y: number; w: number; h: number; c: string; t: number; blood?: boolean; dark?: number; seed: number }> = ({ x, y, w, h, c, t, blood, dark = 0, seed }) => {
  const lit = 1 - dark;
  const fl = 0.85 + Math.sin(t * 9 + seed) * 0.1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-h} width={w} height={h} fill={c} />
      <rect x={-6} y={-h - 10} width={w + 12} height={12} fill="#000" opacity={0.25} />
      <rect x={w * 0.62} y={-h} width={w * 0.38} height={h} fill="#000" opacity={0.18} />
      <rect x={w * 0.15} y={-h * 0.72} width={w * 0.18} height={h * 0.2} rx={3} fill="#FFC067" opacity={lit * fl} />
      {w > 160 ? <rect x={w * 0.6} y={-h * 0.72} width={w * 0.16} height={h * 0.2} rx={3} fill="#FFC067" opacity={lit * fl * 0.9} /> : null}
      <rect x={w * 0.4} y={-h * 0.42} width={w * 0.2} height={h * 0.42} fill="#22160F" />
      {blood ? <g><rect x={w * 0.36} y={-h * 0.46} width={w * 0.28} height={7} fill="#B0161B" /><rect x={w * 0.36} y={-h * 0.46} width={6} height={h * 0.3} fill="#B0161B" /><rect x={w * 0.64 - 6} y={-h * 0.46} width={6} height={h * 0.3} fill="#B0161B" /></g> : null}
      {lit > 0.05 ? <rect x={w * 0.15 - 20} y={-h * 0.72 - 20} width={w * 0.18 + 40} height={h * 0.2 + 40} rx={20} fill="#FFB24F" opacity={0.12 * lit * fl} /> : null}
    </g>
  );
};
export const DemoEscena: React.FC = () => {
  const t = useT();
  const fogX = kf(t, [[0, -900], [5, 1500]], (v) => v);
  const cam = kf(t, [[0, 1], [5, 1.06]], (v) => v);
  const houses = Array.from({ length: 11 }).map((_, i) => ({ x: 40 + i * 170 + rnd(i) * 30, w: 140 + rnd(i + 9) * 90, h: 150 + rnd(i + 3) * 120, blood: [1, 4, 7, 9].includes(i), seed: i }));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "55% 60%" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#070B20" /><stop offset="55%" stopColor="#1A2350" /><stop offset="82%" stopColor="#4A3A66" /><stop offset="100%" stopColor="#7A4A52" /></linearGradient>
            <radialGradient id="moonG"><stop offset="0%" stopColor="#E9EEFF" stopOpacity="0.5" /><stop offset="100%" stopColor="#E9EEFF" stopOpacity="0" /></radialGradient>
            <linearGradient id="river" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1C2A55" /><stop offset="100%" stopColor="#0A1028" /></linearGradient>
            <linearGradient id="fog" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0B140F" stopOpacity="0" /><stop offset="25%" stopColor="#0E1A13" stopOpacity="0.85" /><stop offset="80%" stopColor="#0E1A13" stopOpacity="0.85" /><stop offset="100%" stopColor="#0E1A13" stopOpacity="0" /></linearGradient>
            <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4A3A66" stopOpacity="0" /><stop offset="100%" stopColor="#6A4A66" stopOpacity="0.55" /></linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#sky)" />
          {Array.from({ length: 140 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 500) * 560} r={0.8 + rnd(i + 99) * 1.8} fill="#fff" opacity={0.25 + 0.6 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i))} />)}
          <circle cx={1480} cy={230} r={260} fill="url(#moonG)" />
          <circle cx={1480} cy={230} r={74} fill="#EEF0F8" />
          <circle cx={1455} cy={210} r={14} fill="#D5D8E6" /><circle cx={1505} cy={258} r={10} fill="#D5D8E6" /><circle cx={1500} cy={200} r={6} fill="#D5D8E6" />
          {/* pirámides lejanas */}
          <g opacity={0.9}>
            <path d="M260 640 L 520 360 L 780 640 Z" fill="#3B3560" /><path d="M520 360 L 780 640 L 600 640 Z" fill="#2C2850" />
            <path d="M700 640 L 880 440 L 1060 640 Z" fill="#403A66" /><path d="M880 440 L 1060 640 L 940 640 Z" fill="#302B55" />
            <path d="M1180 640 L 1300 520 L 1420 640 Z" fill="#453E6A" />
          </g>
          <rect y={560} width={W} height={120} fill="url(#haze)" />
          {/* palmeras atrás */}
          {[[120, 700, 0.8], [1660, 700, 0.9], [1800, 720, 0.7]].map(([a, b, s], i) => <g key={i} transform={`translate(${a} ${b})`}><Palm t={t} s={s} seed={i} c="#1D2E2A" trunk="#2A2230" /></g>)}
          {/* ciudad */}
          <rect y={690} width={W} height={120} fill="#2A2030" />
          {houses.map((hs, i) => {
            const dark = !hs.blood ? ip(fogX, [hs.x - 100, hs.x + 200], [0, 1]) : 0;
            return <House key={i} x={hs.x} y={800} w={hs.w} h={hs.h} c={i % 2 ? "#5A4258" : "#4E3A50"} t={t} blood={hs.blood} dark={dark} seed={hs.seed} />;
          })}
          {/* antorchas */}
          {[520, 1210].map((tx, i) => (
            <g key={i} transform={`translate(${tx} 760)`}>
              <rect x={-4} y={0} width={8} height={50} fill="#3A2416" />
              <g transform="translate(0 2)"><Flame t={t} s={0.9} seed={i * 3} /></g>
              <circle cx={0} cy={-14} r={60} fill="#FFA040" opacity={0.18 + Math.sin(t * 13 + i) * 0.03} />
            </g>
          ))}
          {/* figura en azotea */}
          <g transform="translate(905 640)"><circle cx={0} cy={-58} r={13} fill="#120E18" /><path d="M-14 -44 L 14 -44 L 18 0 L -18 0 Z" fill="#120E18" /></g>
          {/* río Nilo */}
          <rect y={810} width={W} height={270} fill="url(#river)" />
          {Array.from({ length: 16 }).map((_, i) => {
            const yy = 830 + i * 14, w = 120 - i * 4 + Math.sin(t * 3 + i) * 20;
            return <rect key={i} x={1480 - w / 2 + Math.sin(t * 2 + i * 1.7) * 14} y={yy} width={w} height={3} rx={2} fill="#DDE4FF" opacity={0.55 - i * 0.03} />;
          })}
          {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={rnd(i + 70) * W} y={850 + rnd(i + 30) * 200} width={30 + rnd(i) * 40} height={2} fill="#9FB0E8" opacity={0.15 + 0.15 * Math.sin(t * 2 + i)} />)}
          {/* juncos en primer plano */}
          {Array.from({ length: 34 }).map((_, i) => {
            const bx = i * 58 + rnd(i) * 30, hh = 70 + rnd(i + 4) * 90, sw = Math.sin(t * 1.6 + i * 0.6) * 8;
            return <path key={i} d={`M${bx} 1080 Q ${bx + sw * 0.5} ${1080 - hh * 0.5} ${bx + sw} ${1080 - hh}`} stroke="#0A120E" strokeWidth={7} fill="none" strokeLinecap="round" />;
          })}
          {/* niebla de la muerte */}
          <g transform={`translate(${fogX} 0)`}>
            <rect x={-600} y={620} width={1500} height={300} fill="url(#fog)" />
            {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-500 + i * 160} cy={720 + Math.sin(t * 2 + i) * 20} rx={180} ry={70} fill="#0E1A13" opacity={0.55} />)}
            {Array.from({ length: 7 }).map((_, i) => <path key={`w${i}`} d={`M${-400 + i * 190} ${700 + i % 3 * 30} q 80 ${-60 + Math.sin(t * 2 + i) * 20} 160 0 t 160 0`} stroke="#6E8A7A" strokeOpacity={0.22} strokeWidth={10} fill="none" strokeLinecap="round" />)}
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <div style={{ position: "absolute", left: 120, top: 110, fontFamily: "YCap", fontSize: 34, color: "#F3E6C8", letterSpacing: 4, opacity: ip(t, [0.4, 1], [0, 0.9]) }}>EGIPTO · MEDIANOCHE</div>
      <Letterbox />
    </AbsoluteFill>
  );
};

// =============== 3. CÁMARA: mercado de Jerusalén, paneo con paralaje + push-in ===============
const Stall: React.FC<{ x: number; c: string; label: string; goods: string; t: number }> = ({ x, c, label, goods, t }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={10} y={520} width={14} height={340} fill="#5A3A22" /><rect x={336} y={520} width={14} height={340} fill="#5A3A22" />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${i * 60} 500 L ${i * 60 + 60} 500 L ${i * 60 + 60} 580 Q ${i * 60 + 30} ${600 + Math.sin(t * 2 + i) * 4} ${i * 60} 580 Z`} fill={i % 2 ? "#F1E4C8" : c} />)}
    <rect x={-6} y={488} width={372} height={16} rx={6} fill="#4A2E1A" />
    <rect x={0} y={740} width={360} height={120} fill="#7A5433" /><rect x={0} y={740} width={360} height={14} fill="#946A43" />
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={30 + i * 38} cy={728 - (i % 2) * 8} r={18} fill={goods} />)}
    {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={50 + i * 48} cy={700} r={16} fill={goods} opacity={0.9} />)}
    <g transform="translate(180 800) rotate(-3)"><rect x={-90} y={-24} width={180} height={48} rx={6} fill="#F3E9D2" /><text x={0} y={10} textAnchor="middle" fontFamily="YCap" fontSize={24} fill="#3A2412">{label}</text></g>
  </g>
);
const Extra: React.FC<{ x: number; t: number; s?: number; seed: number; c?: string }> = ({ x, t, s = 1, seed, c = "#8E8A84" }) => {
  const b = Math.sin(t * 6 + seed) * 4;
  return (
    <g transform={`translate(${x} ${880 + b}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={50} ry={8} fill="#000" opacity={0.15} />
      <path d="M-40 -230 Q 0 -246 40 -230 L 54 -10 Q 0 0 -54 -10 Z" fill={c} />
      <circle cx={0} cy={-275} r={42} fill={c} />
    </g>
  );
};
export const DemoCamara: React.FC = () => {
  const t = useT();
  const camX = kf(t, [[0, 0], [2.9, 1240]]);
  const zoom = kf(t, [[2.7, 1], [4.3, 1.75]]);
  const shakeX = Math.sin(t * 7.3) * 2 + Math.sin(t * 13.1) * 1;
  const shakeY = Math.cos(t * 6.1) * 1.5;
  const turn = t > 3.6;
  const charWX = 2200;
  const layer = (p: number) => ({ transform: `translateX(${-camX * p + shakeX * p}px) translateY(${shakeY * p}px)` });
  const focus = ip(t, [2.8, 4.0], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#9CC4E4", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${charWX - 1240}px 600px` }}>
        {/* cielo */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#7FB2E0 0%,#BFD9EC 55%,#EADFC8 100%)" }} />
        <div style={{ position: "absolute", left: 1500, top: 40, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,210,.9) 0%, rgba(255,246,210,0) 60%)" }} />
        {/* lejos: muralla y templo */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 4000, height: H, ...layer(0.18), filter: `blur(${2 + focus * 3}px)` }}>
          <svg width={4000} height={H}>
            <path d="M0 620 Q 900 470 1700 560 Q 2500 440 4000 600 L 4000 1080 L 0 1080 Z" fill="#C9B99A" />
            <g transform="translate(1250 430)">
              <rect x={0} y={0} width={420} height={140} fill="#E7DCC4" /><rect x={130} y={-120} width={160} height={120} fill="#EFE6D0" />
              <rect x={170} y={-170} width={80} height={50} fill="#F4D98A" />
              {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={20 + i * 44} y={30} width={18} height={110} fill="#CDBF9F" />)}
            </g>
            <path d="M0 640 L 4000 640 L 4000 700 L 0 700 Z" fill="#BCA984" />
            {Array.from({ length: 80 }).map((_, i) => <rect key={i} x={i * 50} y={620} width={30} height={22} fill="#BCA984" />)}
          </svg>
        </div>
        {/* medio-lejos: casas */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 4000, height: H, ...layer(0.45), filter: `blur(${1 + focus * 2.5}px)` }}>
          <svg width={4000} height={H}>
            {Array.from({ length: 20 }).map((_, i) => {
              const x = i * 200 + rnd(i) * 40, h = 200 + rnd(i + 5) * 180, c = ["#D9B98E", "#CFA97A", "#E3C9A0"][i % 3];
              return (
                <g key={i}><rect x={x} y={760 - h} width={190} height={h} fill={c} /><rect x={x + 120} y={760 - h} width={70} height={h} fill="#000" opacity={0.1} />
                  <path d={`M${x + 40} 760 L ${x + 40} ${720} A 30 30 0 0 1 ${x + 100} 720 L ${x + 100} 760 Z`} fill="#6E5236" />
                  <rect x={x + 30} y={760 - h + 40} width={36} height={44} rx={4} fill="#6E5236" /></g>
              );
            })}
          </svg>
        </div>
        {/* medio: puestos, extras y personaje */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 4000, height: H, ...layer(1) }}>
          <svg width={4000} height={H}>
            <rect y={860} width={4000} height={220} fill="#C8A57A" />
            {Array.from({ length: 60 }).map((_, i) => <rect key={i} x={i * 70} y={880 + (i % 3) * 50} width={60} height={30} rx={6} fill="#B8946A" opacity={0.6} />)}
            <Stall x={300} c="#C2463A" label="HIGOS · 2 DENARIOS" goods="#6B3A5A" t={t} />
            <Stall x={900} c="#3A6EA5" label="PESCADO DEL MAR" goods="#9FB4C4" t={t} />
            <Stall x={1500} c="#5E8A4A" label="GRANADAS" goods="#B8323A" t={t} />
            <Stall x={2400} c="#C9932E" label="VASIJAS" goods="#B0683A" t={t} />
            <Stall x={3000} c="#8A3A6E" label="TELAS DE TIRO" goods="#6A3A8E" t={t} />
            {[[500, 0.9, 1], [1180, 1, 2, "#7E7A74"], [1760, 0.95, 3], [2650, 1, 4, "#7E7A74"], [3200, 0.9, 5]].map(([x, s, sd, c], i) => <Extra key={i} x={(x as number) + Math.sin(t * 0.8 + i) * 30} t={t} s={s as number} seed={sd as number} c={(c as string) ?? "#8E8A84"} />)}
            <Character id="p3" x={charWX} y={884} s={1.15} t={t} facing={turn ? -1 : 1}
              pose={{ look: turn ? [0.05, 0.1] : [0.8, 0.2], brow: turn ? 1 : 0.1, mouth: turn ? "o" : "smile", mouthOpen: turn ? 0.8 : 0, squash: t > 3.6 && t < 3.85 ? -0.7 : 0, armR: turn ? [30, 80] : [20, 40], armL: turn ? [25, 70] : undefined }}
              robe="#3E6EA8" robe2="#244A78" sash="#E8D9B0" />
          </svg>
        </div>
        {/* primer plano: telas y canastas desenfocadas */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 5000, height: H, ...layer(1.7), filter: "blur(7px)" }}>
          <svg width={5000} height={H}>
            {[[200, "#8E2E24"], [1500, "#2E4E7E"], [2700, "#7E5E1E"], [3800, "#5E2E5E"]].map(([x, c], i) => (
              <g key={i}>
                <path d={`M${x} 0 L ${(x as number) + 300} 0 Q ${(x as number) + 260} ${300 + Math.sin(t * 1.5 + i) * 20} ${(x as number) + 150} 420 Q ${(x as number) + 40} 300 ${x} 0 Z`} fill={c as string} />
                <ellipse cx={(x as number) + 600} cy={1040} rx={260} ry={150} fill="#5A3A20" />
                <ellipse cx={(x as number) + 600} cy={960} rx={240} ry={40} fill="#7A5230" />
              </g>
            ))}
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)" }} />
      <Caption t={t} x={W / 2} y={190} words={[["¿Y", 3.75], ["TÚ", 3.95], ["QUIÉN", 4.15], ["ERES?", 4.4]]} />
      <Letterbox />
    </AbsoluteFill>
  );
};
