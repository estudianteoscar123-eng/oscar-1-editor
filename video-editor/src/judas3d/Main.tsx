import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import data from "../../public/judas3d/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { B, Backdrop, Cam, Char, Coin, CoinBag, Column, Cy, Ground, Ol, Shot, Sign, Sp, Torch, Tree, eo, ip, shotAt } from "../k3/Toon";

// ZK 3D · "Eres Judas" (prueba de 15 s, estilo toon). Un plano nuevo por idea (~1,2 s), barrido entre escenarios.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
export const JUDAS3D_TOTAL = S(16.25);
const KEYS = new Set(["judas", "tres", "años", "jesús", "vendiste", "30", "monedas", "esclavo", "beso", "arrepentido", "dinero", "nadie", "campo", "sangre"]);
const W = (i: number) => RAW[i].timestamp[0] + TH;
const T = [0, W(2), W(6), W(8), W(12), W(13), W(18), W(23), W(24), W(28), W(31), W(37)];
const SHOTS: Shot[] = [
  { t: T[0], p: [0.7, 1.9, 4.2], l: [0, 1.45, 0], fov: 38, hook: 0.55, roll: -0.05 },
  { t: T[1], p: [2.8, 1.5, 5.4], l: [0, 1.2, 0], fov: 42, roll: 0.04 },
  { t: T[2], p: [0.6, 1.9, 3.4], l: [0.2, 1.5, 0], fov: 38, roll: -0.06 },
  { t: T[3], p: [2.2, 2.0, 3.9], l: [0, 1.25, 0], fov: 44, roll: 0.05 },
  { t: T[4], p: [0.1, 2.3, 1.2], l: [0, 0.95, 0], fov: 40, push: 0.12 },
  { t: T[5], p: [0.6, 1.6, 4.9], l: [0.2, 1.4, 0], fov: 44, roll: -0.04 },
  { t: T[6], p: [-1.4, 1.9, 4.3], l: [-0.1, 1.5, 0], fov: 40, roll: 0.07 },
  { t: T[7], p: [0.5, 1.85, 4.0], l: [0, 1.5, 0], fov: 34, roll: -0.08, push: 0.1 },
  { t: T[8], p: [2.4, 2.0, 4.6], l: [0, 1.1, 0], fov: 46, roll: 0.03 },
  { t: T[9], p: [0.0, 1.8, 4.6], l: [0, 1.4, 0], fov: 42 },
  { t: T[10], p: [-2.6, 2.4, 5.0], l: [0, 1.0, -1], fov: 46, roll: 0.04 },
  { t: T[11], p: [0.0, 2.4, 6.2], l: [0, 2.0, -1], fov: 44, push: 0.08 },
];
const JUDAS = { robe: "#7A2E2A", sash: "#E8B84A", hair: "#2B1A10", beard: "#2B1A10" };
const JESUS = { robe: "#F2ECDD", sash: "#B5121B", hair: "#6B4226", beard: "#6B4226" };
const PRIEST = { robe: "#3A4E8A", sash: "#E8C66A", beard: "#9A9A9A", hat: "#E8C66A" };

type Mood = "day" | "warm" | "night" | "sunset";
const Lights: React.FC<{ m: Mood }> = ({ m }) => {
  const L = {
    day: { hemi: ["#FFF4DC", "#9A7A4A", 0.9], sun: ["#FFE6B0", 2.4], amb: 0.25 },
    warm: { hemi: ["#FFE7C2", "#7A4A24", 0.8], sun: ["#FFC870", 2.2], amb: 0.2 },
    night: { hemi: ["#5A6EA8", "#1A1430", 0.55], sun: ["#9AB4FF", 0.9], amb: 0.12 },
    sunset: { hemi: ["#FFB27A", "#5A1A10", 0.8], sun: ["#FF7A3A", 2.6], amb: 0.2 },
  }[m];
  return (
    <>
      <hemisphereLight args={[L.hemi[0] as string, L.hemi[1] as string, L.hemi[2] as number]} />
      <ambientLight intensity={L.amb} />
      <directionalLight position={[-3.5, 6, 4]} intensity={L.sun[1] as number} color={L.sun[0] as string} castShadow shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0004}>
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
    </>
  );
};

const Scene: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const lt = t - SHOTS[i].t;
  switch (i) {
    case 0: return (<>
      <Lights m="warm" /><Backdrop top="#3A2414" bot="#8A5A2C" /><Ground c="#7A5530" />
      <Ol geo={B(10, 6, 0.2)} color="#B98A55" pos={[0, 3, -2]} rough={0.95} w={0} />
      <Torch t={t} pos={[-1.3, 0, -1.2]} /><Torch t={t} pos={[1.5, 0, -1.4]} />
      <Char t={t} {...JUDAS} face="sly" pose={{ armR: [0.2, 1.1] }} holdR={<CoinBag scl={1.1} pos={[0, -0.05, 0.1]} />} pos={[0, 0, 0]} rot={[0, -0.15, 0]} />
    </>);
    case 1: return (<>
      <Lights m="day" /><Backdrop top="#7FB8E8" bot="#F6E2B0" /><Ground c="#D9B47A" />
      <Ol geo={B(2.2, 0.02, 30)} color="#C99A5E" pos={[0, 0.01, 0]} w={0} />
      <Tree t={t} pos={[-3, 0, -3]} /><Tree t={t} pos={[3.2, 0, -4]} scl={1.2} /><Tree t={t} pos={[-5, 0, -7]} />
      <Sign txt="3 AÑOS" pos={[2.1, 1.9, -0.6]} rot={[0, -0.35, 0]} />
      <Char t={t} {...JESUS} face="smile" pose={{ walk: 1 }} pos={[-0.55, 0, ip(lt, 0, 2, 0.6, -0.2)]} seed={1} />
      <Char t={t} {...JUDAS} face="calm" pose={{ walk: 1 }} pos={[0.6, 0, ip(lt, 0, 2, 0.9, 0.1)]} seed={2.5} />
    </>);
    case 2: return (<>
      <Lights m="day" /><Backdrop top="#7FB8E8" bot="#F6E2B0" /><Ground c="#D9B47A" />
      <Tree t={t} pos={[-2.5, 0, -3]} />
      <Char t={t} {...JESUS} face="smile" pos={[0, 0, 0]} talk={lt > 0.2 && lt < 0.6} />
      <Char t={t} {...JUDAS} face="sly" pos={[1.6, 0, -1.6]} rot={[0, -0.6, 0]} />
    </>);
    case 3: return (<>
      <Lights m="warm" /><Backdrop top="#2A1A10" bot="#6A4220" /><Ground c="#5A3D22" />
      <Ol geo={B(10, 6, 0.2)} color="#A57A48" pos={[0, 3, -2.5]} rough={0.95} w={0} />
      <Ol geo={B(2.4, 0.12, 1.1)} color="#8A5A2C" pos={[0, 0.95, 0]} />
      {[-1, 1].map((sd) => <Ol key={sd} geo={B(0.1, 0.9, 0.1)} color="#6B4426" pos={[sd * 1.05, 0.45, 0]} />)}
      <Torch t={t} pos={[-2, 0, -1.5]} />
      <Char t={t} {...PRIEST} face="sly" pose={{ armR: [-0.3, 1.2 + Math.sin(lt * 3) * 0.05] }} holdR={<CoinBag pos={[0, -0.05, 0.1]} />} pos={[0.55, 0, -0.75]} rot={[0, -0.5, 0]} />
      <Char t={t} {...JUDAS} face="happy" pose={{ armR: [0.3, 1.0 + ip(lt, 0, 0.5) * 0.3] }} pos={[-0.75, 0, 0.6]} rot={[0, 0.9, 0]} />
    </>);
    case 4: return (<>
      <Lights m="warm" /><Backdrop top="#2A1A10" bot="#6A4220" /><Ground c="#5A3D22" />
      <Ol geo={B(3, 0.12, 2)} color="#8A5A2C" pos={[0, 0.89, 0]} rough={0.8} />
      {Array.from({ length: 30 }, (_, k) => { const tk = lt - k * 0.03; const y = tk < 0 ? 4 : Math.max(0.97 + (k % 5) * 0.026, 3 - eo(tk / 0.35) * 2.03); return <Coin key={k} pos={[Math.sin(k * 2.3) * 0.32 + (k % 3) * 0.08, y, Math.cos(k * 1.7) * 0.25]} rot={[y > 1.1 ? k : 0, 0, y > 1.1 ? k * 0.7 : 0]} />; })}
      <Sign txt={`${Math.min(30, Math.max(0, Math.floor(lt / 0.03)))}`} w={0.8} h={0.5} bg="#F2C14A" fg="#7A1408" post={false} pos={[0.9, 1.55, -0.6]} rot={[0, -0.3, 0]} />
    </>);
    case 5: return (<>
      <Lights m="day" /><Backdrop top="#E8A85A" bot="#F6E2B0" /><Ground c="#C9A06A" />
      <Ol geo={B(10, 4, 0.2)} color="#D8B888" pos={[0, 2, -3]} rough={0.95} w={0} />
      <Char t={t} robe="#9A8A72" face="sad" pose={{ armL: [0.1, 0.6], armR: [-0.1, 0.6] }} pos={[-0.7, 0, 0]} rot={[0, 0.3, 0]} />
      <Ol geo={<torusGeometry args={[0.12, 0.035, 8, 16]} />} color="#8A8A8A" metal={0.6} pos={[-0.62, 1.0, 0.42]} />
      <Sign txt={"30 MONEDAS\n= 1 ESCLAVO"} w={1.6} h={0.9} bg="#9A6A3A" pos={[0.75, 1.9, -0.4]} rot={[0, -0.2, 0]} />
    </>);
    case 6: return (<>
      <Lights m="night" /><Backdrop top="#0E1430" bot="#2A2A4A" /><Ground c="#2A3020" />
      <mesh position={[3, 7, -11]}><sphereGeometry args={[0.9, 24, 16]} /><meshBasicMaterial color="#F4EBC8" /></mesh>
      <Tree t={t} c="#3A5A2A" pos={[-2.6, 0, -2.5]} /><Tree t={t} c="#3A5A2A" pos={[2.8, 0, -3]} />
      <Torch t={t} pos={[-1.6, 0, -1.4]} /><Torch t={t} pos={[1.8, 0, -1.6]} />
      {[-2.2, -1.4, 1.5, 2.3].map((x, k) => <Char key={k} t={t} robe="#4A4A52" hat="#8A8A92" face="angry" pos={[x, 0, -2.4]} scl={0.85} seed={k} />)}
      <Char t={t} {...JESUS} face="sad" pos={[0.42, 0, 0]} rot={[0, -0.6, 0]} />
      <Char t={t} {...JUDAS} face="calm" pose={{ armL: [0.4, 1.1], armR: [0.4, 1.1], lean: 0.12 }} pos={[ip(lt, 0, 0.5, -0.9, -0.62), 0, 0.15]} rot={[0, 0.9, 0]} />
    </>);
    case 7: return (<>
      <Lights m="night" /><Backdrop top="#0E1430" bot="#2A2A4A" /><Ground c="#2A3020" />
      <Torch t={t} pos={[-1.2, 0, -1.2]} />
      <Char t={t} {...JUDAS} face="worried" sweat={1} pos={[0, 0, 0]} />
    </>);
    case 8: return (<>
      <Lights m="warm" /><Backdrop top="#F2D9A0" bot="#E8C68A" /><Ground c="#E6D3A8" />
      {[-2.4, -0.8, 0.8, 2.4].map((x) => <Column key={x} pos={[x, 0, -2.6]} />)}
      <Ol geo={B(8, 0.3, 1)} color="#E8D6B0" pos={[0, 0.15, -2.2]} w={0.01} />
      <Char t={t} {...JUDAS} face="sad" pose={{ armR: [0.3, ip(lt, 0, 0.3, 1.4, 0.2)] }} pos={[-0.6, 0, 0.4]} rot={[0, 0.5, 0]} />
      {Array.from({ length: 14 }, (_, k) => { const p = eo(ip(lt, 0.15, 0.7)); return <Coin key={k} pos={[-0.2 + p * (0.4 + Math.sin(k) * 0.9), 1.1 - p * 1.08 + Math.sin(p * Math.PI) * 0.4, 0.5 + p * Math.cos(k * 1.3) * 0.7]} rot={[k, 0, k * 0.5]} />; })}
      <Char t={t} {...PRIEST} face="angry" pos={[1.3, 0, -0.9]} rot={[0, -0.7, 0]} />
    </>);
    case 9: return (<>
      <Lights m="warm" /><Backdrop top="#F2D9A0" bot="#E8C68A" /><Ground c="#E6D3A8" />
      {[-1.6, 1.6].map((x) => <Column key={x} pos={[x, 0, -2.4]} />)}
      {[-0.55, 0.55].map((x, k) => <Char key={k} t={t} {...PRIEST} face="calm" pos={[x, 0, -0.6]} rot={[0, ip(lt, 0, 0.4, 0.2, Math.PI), 0]} seed={k} />)}
      {Array.from({ length: 10 }, (_, k) => <Coin key={k} pos={[Math.sin(k * 2) * 1.2, 0.02, 0.6 + Math.cos(k) * 0.4]} rot={[0, k, 0]} />)}
    </>);
    case 10: return (<>
      <Lights m="day" /><Backdrop top="#E8A85A" bot="#F6E2B0" /><Ground c="#B98A55" />
      {Array.from({ length: 9 }, (_, k) => <Ol key={k} geo={B(0.08, 0.7, 0.08)} color="#7A4E28" pos={[-2 + k * 0.5, 0.35, -1.6]} w={0.04} />)}
      <Ol geo={B(4.2, 0.06, 0.06)} color="#7A4E28" pos={[0, 0.55, -1.6]} w={0.04} />
      <Char t={t} {...PRIEST} face="sly" pose={{ armR: [0.6, 1.2] }} holdR={<CoinBag scl={0.8} />} pos={[-0.8, 0, 0.2]} rot={[0, 0.5, 0]} />
      <Char t={t} robe="#6A7A3A" beard="#4A3A2A" hair="#4A3A2A" face="happy" pose={{ armL: [0.5, ip(lt, 0.3, 0.8, 0.2, 1.2)] }} pos={[0.8, 0, 0.1]} rot={[0, -0.6, 0]} />
    </>);
    default: return (<>
      <Lights m="sunset" /><Backdrop top="#5A1A2A" bot="#FF8A4A" /><Ground c="#8A2A1A" />
      <mesh position={[0, 3.2, -11]}><sphereGeometry args={[1.6, 32, 20]} /><meshBasicMaterial color="#FFB070" /></mesh>
      {Array.from({ length: 13 }, (_, k) => <Ol key={k} geo={B(0.09, 0.8, 0.09)} color="#4A2414" pos={[-3 + k * 0.5, 0.4, -2.2]} w={0.04} />)}
      <Ol geo={B(6.2, 0.07, 0.07)} color="#4A2414" pos={[0, 0.62, -2.2]} w={0.04} />
      {Array.from({ length: 8 }, (_, k) => <Ol key={k} geo={Cy(0.25, 0.4, 0.12, 12)} color="#5A1810" pos={[Math.sin(k * 2.2) * 2.4, 0.06, -0.5 + Math.cos(k * 1.4) * 1.2]} w={0.03} />)}
      <Sign txt={"CAMPO DE\nSANGRE"} w={2.4} h={1.1} bg="#7A1A12" fg="#FFE2C8" board="#3A140C" pos={[0, 2.0 + (1 - eo(ip(lt, 0, 0.5))) * 3, -0.8]} scl={1 + 0.1 * (1 - eo(ip(lt, 0.4, 0.7)))} />
    </>);
  }
};

const CITES: [number, number, string][] = [[T[3], T[5], "MATEO 26:15"], [T[5], T[6], "ÉXODO 21:32"], [T[6], T[7], "MATEO 26:49"], [T[8], T[11], "MATEO 27:3-8"]];
export const Judas3D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 3 ? 0.9 : f / FPS;
  const i = shotAt(SHOTS, t);
  const sinceCut = t - SHOTS[i].t;
  const whip = i > 0 && f >= 3 ? 1 - ip(sinceCut, 0, 0.1) : 0;
  const cite = CITES.find(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: `contrast(1.08) saturate(1.15) brightness(1.04) sepia(0.06) blur(${whip * 6}px)`, transform: `translateX(${whip * (i % 2 ? 60 : -60)}px) scale(${1 + whip * 0.06})` }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
          <Cam shots={SHOTS} t={t} />
          <Scene t={t} i={i} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 64% at 50% 45%, rgba(255,220,150,0.08) 0%, rgba(0,0,0,0) 55%, rgba(30,12,0,0.6) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={Math.floor(random(`g${f}`) * 50)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
      {cite && f >= 3 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 190, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 46, letterSpacing: 6, color: "#FFF3D6", textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>{cite[2]}</div> : null}
      {f < 3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, lineHeight: 1.05, textShadow: "0 6px 20px rgba(0,0,0,0.9)" }}>
          <div style={{ fontSize: 120, color: "#FFF3D6" }}>¿30</div><div style={{ fontSize: 150, color: "#D30F17" }}>MONEDAS?</div>
        </div>
      ) : <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl="#D30F17" />}
      <Audio src={staticFile("judas3d/mezcla.wav")} />
    </AbsoluteFill>
  );
};
