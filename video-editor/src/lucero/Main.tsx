import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import data from "../../public/lucero/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { B, Backdrop, Cam, Cy, Ol, Shot, Sp, eo, ip, shotAt, textTex } from "../k3/Toon";
import { Person2D } from "../k3/Person2D";

// ZK 2.5D · "La misma palabra" (Lucifer / lucero). Personajes 2D vectoriales sobre escenarios 3D; una escena por idea.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
export const LUCERO_TOTAL = S(27.4);
const KEYS = new Set(["lucifer", "nombre", "latín", "luz", "biblia", "jesús", "isaías", "rey", "dios", "pedro", "cristo", "corazón", "robarse", "regalarla", "estrella", "mañana", "lucero"]);
const W = (i: number) => RAW[i].timestamp[0] + TH;
const T = [0, W(5), W(12), W(17), W(28), W(38), W(44), W(52), W(59), W(64), W(69), W(81)];
const SHOTS: Shot[] = [
  { t: T[0], p: [0, 2.2, 7.5], l: [0, 2.4, 0], fov: 40, hook: 0.6 },
  { t: T[1], p: [0.6, 2.4, 2.6], l: [0, 1.0, 0], fov: 42, push: 0.08, roll: -0.04 },
  { t: T[2], p: [0, 2.0, 7.0], l: [0, 2.0, 0], fov: 42 },
  { t: T[3], p: [-1.4, 2.3, 4.4], l: [0, 1.5, 0], fov: 42, roll: 0.04 },
  { t: T[4], p: [-2.2, 2.6, 8.5], l: [0, 2.6, 0], fov: 46, roll: -0.03 },
  { t: T[5], p: [0, 2.0, 7.2], l: [0, 3.0, 0], fov: 46, push: 0.06 },
  { t: T[6], p: [0.5, 2.5, 2.4], l: [0, 1.1, 0], fov: 40, push: 0.1, roll: 0.04 },
  { t: T[7], p: [0, 1.8, 9], l: [0, 2.2, 0], fov: 44 },
  { t: T[8], p: [1.6, 2.4, 7.8], l: [0, 2.8, 0], fov: 46, roll: 0.05 },
  { t: T[9], p: [-1.2, 2.0, 8], l: [0, 2.0, 0], fov: 44 },
  { t: T[10], p: [0, 1.6, 10], l: [0, 2.6, 0], fov: 44, push: 0.05 },
  { t: T[11], p: [0, 2.6, 6], l: [0, 3.4, -6], fov: 40, push: 0.2 },
];
type Mood = "heaven" | "candle" | "palace" | "dawn" | "night" | "dark";
const Lights: React.FC<{ m: Mood }> = ({ m }) => {
  const c = { heaven: ["#DDE2FF", "#3A2A6A", 0.9, "#FFF2D6", 1.8], candle: ["#FFD9A0", "#3A2410", 0.55, "#FFC47A", 1.0], palace: ["#FFE8C0", "#6A4A2A", 0.9, "#FFE0A8", 2.4], dawn: ["#FFD0B0", "#4A2A3A", 0.8, "#FFB070", 2.4], night: ["#7088D8", "#10142A", 0.6, "#A8B8FF", 0.9], dark: ["#8A3A3A", "#140808", 0.5, "#FF6A4A", 1.2] }[m] as [string, string, number, string, number];
  return (<>
    <hemisphereLight args={[c[0], c[1], c[2]]} />
    <directionalLight position={[-3.5, 6, 5]} intensity={c[4]} color={c[3]} castShadow shadow-mapSize={[1024, 1024]} shadow-radius={4} shadow-bias={-0.0004}><orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 0.1, 30]} /></directionalLight>
  </>);
};
const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 140 }) => {
  const pos = useMemo(() => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = (random(`sx${i}`) - 0.5) * 50; a[i * 3 + 1] = 2 + random(`sy${i}`) * 20; a[i * 3 + 2] = -10 - random(`sz${i}`) * 4; } return a; }, [n]);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={0.09 + 0.02 * Math.sin(t * 3)} color="#FFF6D8" sizeAttenuation /></points>;
};
const Cloud: React.FC<{ p: [number, number, number]; s?: number; c?: string; t: number }> = ({ p, s = 1, c = "#F2EEFF", t }) => (
  <group position={[p[0] + Math.sin(t * 0.3 + p[0]) * 0.2, p[1], p[2]]} scale={s}>{[[0, 0, 0, 0.9], [0.9, -0.1, 0.1, 0.7], [-0.9, -0.15, 0, 0.65], [0.4, 0.45, -0.1, 0.6]].map(([x, y, z, r], i) => <Ol key={i} geo={Sp(r)} color={c} pos={[x, y, z]} rough={0.9} glow={0.35} w={0.02} />)}</group>
);
const WordBlock: React.FC<{ txt: string; p: [number, number, number]; w: number; h: number; bg?: string; fg?: string; rot?: [number, number, number]; glow?: number }> = ({ txt, p, w, h, bg = "#E9DEC2", fg = "#3A1A0A", rot, glow = 0.2 }) => {
  const tex = useMemo(() => textTex(txt, bg, fg, 1400, Math.round(1400 * h / w), "900 260px Georgia, 'Times New Roman', serif", "#00000040"), [txt, bg, fg, w, h]);
  return <group position={p} rotation={rot}><Ol geo={B(w + 0.1, h + 0.1, 0.18)} color={bg} glow={glow} w={0.015} /><mesh position={[0, 0, 0.095]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={glow} roughness={0.7} /></mesh></group>;
};
const Candle: React.FC<{ p: [number, number, number]; t: number }> = ({ p, t }) => (
  <group position={p}>
    <Ol geo={Cy(0.08, 0.09, 0.4, 20)} color="#F2E6C8" pos={[0, 0.2, 0]} />
    <mesh position={[0, 0.5 + Math.sin(t * 20) * 0.01, 0]} scale={[1, 1 + Math.sin(t * 17) * 0.1, 1]}><coneGeometry args={[0.05, 0.18, 12]} /><meshStandardMaterial color="#FFB040" emissive="#FF9A20" emissiveIntensity={3} /></mesh>
    <pointLight position={[0, 0.6, 0.1]} intensity={6} distance={5} color="#FFB060" />
  </group>
);
const Ziggurat: React.FC = () => (
  <group position={[0, 0, -5]}>
    {[0, 1, 2, 3].map((k) => <Ol key={k} geo={B(9 - k * 2, 1.1, 4 - k * 0.7)} color={k % 2 ? "#C9A46A" : "#B88E54"} pos={[0, 0.55 + k * 1.1, 0]} w={0.01} rough={0.85} />)}
    <Ol geo={B(1.6, 1.2, 1.2)} color="#2B5DA8" pos={[0, 5.0, 0]} w={0.02} />
  </group>
);
const Palm: React.FC<{ p: [number, number, number]; t: number; s?: number }> = ({ p, t, s = 1 }) => (
  <group position={p} scale={s}>
    <Ol geo={Cy(0.1, 0.16, 3, 10)} color="#7A5530" pos={[0, 1.5, 0]} rot={[0, 0, 0.06]} />
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[0.1, 3, 0]} rotation={[0, (i / 7) * Math.PI * 2, 0.9 + Math.sin(t * 1.5 + i) * 0.05]}><Ol geo={<coneGeometry args={[0.18, 1.6, 6]} />} color="#3E8A3A" pos={[0, 0.8, 0]} w={0.04} /></group>)}
  </group>
);
const Hills: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => (<>
  <Ol geo={Sp(7)} color={c1} pos={[-6, -5, -6]} w={0.004} rough={0.95} glow={0.2} />
  <Ol geo={Sp(8)} color={c2} pos={[6, -5.8, -8]} w={0.004} rough={0.95} glow={0.2} />
  <Ol geo={Sp(9)} color={c1} pos={[0, -7.6, -3]} w={0.004} rough={0.95} glow={0.15} />
</>);
const Sun: React.FC<{ p: [number, number, number]; r: number; c: string }> = ({ p, r, c }) => (<group position={p}><mesh><sphereGeometry args={[r, 32, 20]} /><meshBasicMaterial color={c} /></mesh><mesh scale={1.6}><sphereGeometry args={[r, 24, 16]} /><meshBasicMaterial color={c} transparent opacity={0.18} /></mesh><mesh scale={2.4}><sphereGeometry args={[r, 24, 16]} /><meshBasicMaterial color={c} transparent opacity={0.07} /></mesh></group>);

const Scene3D: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const lt = t - SHOTS[i].t;
  switch (i) {
    case 0: case 11: return (<>
      <Lights m="heaven" /><Backdrop top="#120E3A" bot="#5A3A8A" z={-14} /><Stars t={t} />
      <Cloud p={[-3, 0.6, -2]} t={t} s={1.4} /><Cloud p={[3.4, 0.8, -3]} t={t} s={1.6} /><Cloud p={[0, -0.2, -1]} t={t} s={1.2} />
      {i === 0 ? <WordBlock txt="LUCIFER" p={[0, 2.6 + Math.sin(t * 1.5) * 0.05, 0]} w={3.0} h={0.85} bg="#F2E6C8" fg="#2A1A0A" glow={0.3} /> : <Sun p={[0, 3.4, -6]} r={0.5 + eo(ip(lt, 0, 1)) * 0.6} c="#FFF2C0" />}
    </>);
    case 1: return (<>
      <Lights m="candle" /><Backdrop top="#1A1008" bot="#3A2414" />
      <Ol geo={B(4, 0.15, 2.4)} color="#6B4426" pos={[0, 0.6, 0]} rough={0.85} />
      <WordBlock txt="LUCIFER" p={[0, 0.72, 0.1]} w={1.9} h={0.6} rot={[-Math.PI / 2 + 0.05, 0, 0.05]} bg="#EADCB8" fg="#5A1A0A" glow={0.25} />
      <Candle p={[1.2, 0.68, -0.4]} t={t} />
      {[0, 1, 2].map((k) => <Ol key={k} geo={B(0.9, 0.16, 0.6)} color={["#7A2A1A", "#2A4A7A", "#5A3A1A"][k]} pos={[-1.3, 0.76 + k * 0.17, -0.5]} rot={[0, k * 0.2, 0]} />)}
    </>);
    case 2: return (<>
      <Lights m="heaven" /><Backdrop top="#1E1A4A" bot="#A07AC8" /><Stars t={t} n={60} />
      <WordBlock txt="LUX" p={[-0.75 - eo(ip(lt, 0, 0.5)) * 0.25, 3.7, 0]} w={1.1} h={0.6} bg="#FFF2C0" fg="#7A4A00" glow={0.5} />
      <WordBlock txt="FERO" p={[0.85 + eo(ip(lt, 0, 0.5)) * 0.25, 3.7, 0]} w={1.3} h={0.6} bg="#F2E6C8" fg="#2A1A0A" glow={0.3} />
    </>);
    case 3: return (<>
      <Lights m="candle" /><Backdrop top="#140C06" bot="#4A2E16" />
      <Ol geo={Cy(0.12, 0.2, 1.3, 12)} color="#5A3A1E" pos={[0, 0.65, 0]} /><Ol geo={B(1.6, 0.08, 1.1)} color="#6B4426" pos={[0, 1.34, 0]} rot={[0.35, 0, 0]} />
      <Ol geo={B(0.72, 0.05, 0.95)} color="#F2E6C8" pos={[-0.37, 1.42, 0.02]} rot={[0.35, 0, 0.08]} glow={0.3} /><Ol geo={B(0.72, 0.05, 0.95)} color="#F2E6C8" pos={[0.37, 1.42, 0.02]} rot={[0.35, 0, -0.08]} glow={0.3} />
      <Candle p={[-1.3, 0, -0.4]} t={t} /><Candle p={[1.3, 0, -0.4]} t={t} />
    </>);
    case 4: case 5: case 8: return (<>
      <Lights m={i === 8 ? "dark" : "palace"} /><Backdrop top={i === 8 ? "#1A0606" : "#E8A050"} bot={i === 8 ? "#5A1810" : "#F6DCA0"} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color={i === 8 ? "#4A2A1A" : "#D8B27A"} roughness={0.95} /></mesh>
      <Ziggurat /><Palm p={[-4.5, 0, -2]} t={t} /><Palm p={[4.8, 0, -3]} t={t} s={1.2} />
      {[-2.6, 2.6].map((x) => <group key={x}><Ol geo={B(0.5, 3.6, 0.5)} color="#2B5DA8" pos={[x, 1.8, -1.2]} w={0.02} /><Ol geo={B(0.6, 0.2, 0.6)} color="#E8C66A" pos={[x, 3.7, -1.2]} w={0.02} /></group>)}
      {i === 5 ? <Sun p={[0, 7.5, -8]} r={0.6 + eo(ip(lt, 0.4, 1.6)) * 1.4} c="#FFF6D8" /> : null}
    </>);
    case 6: return (<>
      <Lights m="candle" /><Backdrop top="#1A1008" bot="#3A2414" />
      <Ol geo={B(4, 0.15, 2.4)} color="#6B4426" pos={[0, 0.6, 0]} rough={0.85} />
      <WordBlock txt={"... et LUCIFER\noriatur in\ncordibus vestris"} p={[0, 0.72, 0.1]} w={2.1} h={1.3} rot={[-Math.PI / 2 + 0.05, 0, -0.04]} bg="#EADCB8" fg="#3A1A0A" glow={0.25} />
      <Candle p={[-1.3, 0.68, -0.5]} t={t} />
    </>);
    case 7: case 9: case 10: return (<>
      <Lights m="dawn" /><Backdrop top={i === 10 ? "#2A3A7A" : "#5A6ABA"} bot="#FFB078" /><Stars t={t} n={i === 10 ? 80 : 30} />
      <Sun p={[0, i === 10 ? 3 + eo(ip(lt, 0, 3)) * 1.2 : 1.4, -12]} r={i === 10 ? 0.5 : 1.6} c={i === 10 ? "#FFFBE8" : "#FFD08A"} />
      <Hills c1="#4A6A4A" c2="#3A5A4A" />
    </>);
    default: return null;
  }
};

const Overlay2D: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const lt = t - SHOTS[i].t;
  const JESUS = { robe: "#F4EFE2", robe2: "#D8D0C0", trim: "#B5121B", hair: "long" as const, hairColor: "#6B4226", beard: "#6B4226" };
  const KING = { robe: "#6A2A8A", robe2: "#3A1050", trim: "#E8C66A", hair: "short" as const, hairColor: "#1A1410", beard: "#1A1410", crown: true };
  const pop = (a: number) => eo(ip(lt, a, a + 0.25));
  switch (i) {
    case 2: return <Person2D id="p2" t={t} x={540} y={1700} s={0.95} face="happy" robe="#3A5A8A" trim="#F2C14A" hair="short" walk={1} armR={150} holdR={<g><circle r={70} fill="#FFF2B0" opacity={0.5} /><circle r={36} fill="#FFFDE8" /></g>} glow={0.6} />;
    case 3: return <Person2D id="j3" t={t} x={540} y={1760} s={0.95 * pop(W(27) - SHOTS[3].t - 0.1)} face="smile" {...JESUS} glow={1} halo />;
    case 4: return (<>
      <Person2D id="k4" t={t} x={560} y={1640} s={0.95} face="proud" {...KING} armL={40} armR={40} />
      <Person2D id="a4" t={t} x={170} y={1820} s={0.6} face="happy" robe="#6A7A3A" hair="short" armR={95} talk={lt > 1.1 && lt < 2.0} seed={2} />
      <Person2D id="b4" t={t} x={930} y={1840} s={0.6} face="happy" robe="#8A5A2A" hair="short" armL={95} flip seed={3} />
    </>);
    case 5: return <Person2D id="k5" t={t} x={540} y={1700} s={0.95} face={lt > 1.2 ? "shock" : "proud"} {...KING} armL={150 - ip(lt, 1.2, 1.6) * 100} armR={150 - ip(lt, 1.2, 1.6) * 100} />;
    case 7: return (<>
      <Person2D id="v7" t={t} x={540} y={1720} s={1} face="happy" robe="#4A6A9A" hair="short" hairColor="#3A2A1A" glow={ip(lt, 0.6, 1.4)} armL={35} armR={35} />
      <g transform={`translate(560 ${1720 - 360}) scale(${0.6 + eo(ip(lt, 0.7, 1.2)) * 0.6 + Math.sin(t * 6) * 0.04})`} opacity={ip(lt, 0.6, 0.9)}>
        <circle r={120} fill="#FFE9A8" opacity={0.35} /><path d="M0 40 C -70 -10, -60 -70, -20 -60 C -6 -56, 0 -44, 0 -36 C 0 -44, 6 -56, 20 -60 C 60 -70, 70 -10, 0 40 Z" fill="#FF4A4A" stroke="#24242A" strokeWidth={6} />
      </g>
    </>);
    case 8: return <Person2D id="k8" t={t} x={540} y={1700} s={0.95} face="angry" {...KING} armR={165} holdR={<g opacity={1 - ip(lt, 0.6, 1.4)}><circle r={50} fill="#FFF2B0" opacity={0.4} /><circle r={24} fill="#FFFDE8" /></g>} />;
    case 9: return (<>
      <Person2D id="j9" t={t} x={420} y={1700} s={0.92} face="smile" {...JESUS} armR={90} glow={0.8} halo holdR={<g transform={`translate(${eo(ip(lt, 0.3, 1.2)) * 230} 0)`}><circle r={60} fill="#FFF2B0" opacity={0.45} /><circle r={28} fill="#FFFDE8" /></g>} />
      <Person2D id="c9" t={t} x={870} y={1780} s={0.66} face={lt > 1.0 ? "happy" : "calm"} robe="#8A6A3A" hair="short" flip glow={ip(lt, 1.0, 1.6)} seed={4} />
    </>);
    case 10: return <Person2D id="j10" t={t} x={540} y={1760} s={0.8} face="smile" {...JESUS} armL={60} armR={60} glow={0.7} halo talk={lt > 0.9 && lt < 3.4} />;
    default: return null;
  }
};

const CITES: [number, number, string][] = [[T[4], T[6], "ISAÍAS 14:12"], [T[6], T[8], "2 PEDRO 1:19"], [T[10], T[11], "APOCALIPSIS 22:16"]];
export const Lucero: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 0.9 : f / FPS;
  const i = shotAt(SHOTS, t);
  const since = t - SHOTS[i].t;
  const whip = i > 0 && f >= 3 ? 1 - ip(since, 0, 0.1) : 0;
  const cite = CITES.find(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: `contrast(1.06) saturate(1.15) brightness(1.04)${whip > 0.05 ? ` blur(${whip * 6}px)` : ""}`, transform: `translateX(${whip * (i % 2 ? 70 : -70)}px) scale(${1 + whip * 0.06})` }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
          <Cam shots={SHOTS} t={t} />
          <Scene3D t={t} i={i} />
        </ThreeCanvas>
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateX(${whip * (i % 2 ? 90 : -90)}px)`, filter: whip > 0.05 ? `blur(${whip * 5}px)` : undefined }}>
        <Overlay2D t={t} i={i} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 64% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,4,20,0.6) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={Math.floor(random(`g${f}`) * 50)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
      {cite && f >= 3 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 46, letterSpacing: 6, color: "#FFF3D6", textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>{cite[2]}</div> : null}
      {f < 3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1280, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 6px 20px rgba(0,0,0,0.9)" }}>
          <div style={{ fontSize: 110, color: "#FFF3D6" }}>LUCIFER</div><div style={{ fontSize: 150, color: "#D30F17" }}>¿JESÚS?</div>
        </div>
      ) : <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl="#D30F17" />}
      <Audio src={staticFile("lucero/mezcla.wav")} />
    </AbsoluteFill>
  );
};
