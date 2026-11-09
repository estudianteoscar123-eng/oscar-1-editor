import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import data from "../../public/gedeon/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { CamRig, Embers, Fire, Glow, Jar, Key, Person, Rock, Sky, V3, eo, hash, ip, mix } from "../k3/Kit3D";
import { Crowd, Inst } from "../k3/Crowd";

// ZK 3D · Gedeón y los 300 (Jueces 7). Un solo plano continuo: colina → río → valle de Madián de noche.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const END = Math.round((WORDS[WORDS.length - 1].e + 0.55) * 10) / 10;
export const GEDEON_TOTAL = S(END);
const KEYS = new Set(["32000", "ejército", "imposible", "casa", "miedo", "22000", "10000", "demasiados", "río", "agua", "arrodillaron", "300", "lamieron", "langostas", "camellos", "trompeta", "cántaro", "antorcha", "espada", "medianoche", "rompen", "antorchas", "gedeón", "oscuridad", "huyen", "solos", "nadie"]);
const RED = "#D30F17";
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

const G: V3 = [0, 0, 4];
const SOL: V3 = [8, 0, 4];
const CAMP: V3 = [0, 0, -95];
const RING = 40;
const T_LEAVE = at("fueron");
const T_RIVER = at("entonces");
const T_300 = at("esos");
const T_NIGHT = at("media") - 0.3;
const T_BREAK = at("rompen");
const T_DAWN = at("verás");
const night = (t: number) => ip(t, T_NIGHT - 0.4, T_NIGHT + 0.3) * (1 - ip(t, T_DAWN - 0.2, T_DAWN + 0.6));
const dusk = (t: number) => ip(t, at("frente") - 0.2, at("armas"));

const k = (t: number, p: V3, l: V3, fov = 38, e?: number, push?: number): Key => ({ t, p, l, fov, e, push });
const HOOK: [V3, V3] = [[0, 2.3, 10.5], [0, 1.5, 3]];
const CAM: Key[] = [
  k(0, ...HOOK, 38, undefined, 0.06),
  k(at("32000") - 0.05, [0, 10, 15], [0, 0, -10], 48),
  k(at("ejército") - 0.1, [8, 16, -36], [0, 0, -95], 52, 0.6),
  k(at("mandó"), [0, 3.4, 11], [0, 1, -6], 44, 0.55),
  k(at("primero"), [0.9, 1.8, 7.2], [0, 1.6, 4], 30),
  k(at("fueron"), [11, 7, 7], [0, 0.5, -12], 46),
  k(at("quedaban"), [0, 5.5, 11], [0, 0.5, -8], 44),
  k(at("dios"), [2.4, 1.3, 8.8], [0, 2.4, 4], 40),
  k(at("todavía"), [0.9, 1.75, 7.0], [0, 1.6, 4], 30),
  k(at("entonces"), [35, 6.5, 15], [44, 0, 0], 46, 0.6),
  k(at("arrodillaron"), [40.2, 1.6, 9.5], [43, 0.4, 4], 36),
  k(at("solo"), [44.2, 1.3, 3.6], [41.8, 1.2, 1.6], 32),
  k(at("lamieron") - 0.1, [43.9, 1.5, 3.1], [41.8, 1.35, 1.6], 30),
  k(at("esos"), [0, 4.2, 13], [0, 1, 0], 42, 0.55),
  k(at("frente"), [0, 24, -34], [0, 0, -98], 52, 0.6),
  k(at("langostas"), [-22, 6, -62], [0, 1, -92], 46),
  k(at("camellos"), [14.5, 1.7, -60.5], [17, 1.4, -66], 36),
  k(at("armas"), [9.2, 2.0, 8.6], [8, 1.3, 4.2], 38, 0.55),
  k(at("trompeta"), [7.45, 1.1, 6.0], [7.6, 1.2, 4.6], 28),
  k(at("cántaro"), [8.6, 1.05, 6.0], [8.4, 1.15, 4.6], 28),
  k(at("antorcha"), [8.5, 1.8, 5.4], [8.4, 1.15, 4.6], 26),
  k(at("ni"), [6.2, 0.9, 6.6], [7.0, 0.1, 5.2], 32),
  k(at("media") - 0.1, [-12, 9, -34], [0, 0, -88], 48, 0.6),
  k(at("rodean"), [0, 34, -38], [0, 0, -95], 54),
  k(T_BREAK - 0.1, [2.6, 1.9, -54.4], [0, 1.4, -50], 38, 0.4),
  k(at("levantan"), [0, 30, -36], [0, 0, -95], 54, 0.5),
  k(at("gritan"), [1.6, 1.6, -53.6], [0, 1.75, -50], 32),
  k(at("señor"), [-2.0, 1.0, -53.8], [0, 2.1, -50], 40),
  k(at("oscuridad"), [5, 2.2, -75], [0, 1.2, -83], 40, 0.5),
  k(at("pelear"), [-4.5, 1.7, -77], [0, 1.3, -83], 36),
  k(at("huyen"), [0, 16, -52], [0, 0, -100], 50),
  k(T_DAWN, [0, 3, 13], [0, 6, -10], 46, 0.6),
  k(at("con", 3), [0, 11, 17], [0, 0, -10], 48),
  k(at("salvamos") - 0.3, [4.5, 3.6, 11.5], [0, 1.2, -5], 44),
  k(at("con", 4), [0, 2.2, 10.5], [0, 1.4, 1], 38),
  k(END - 0.45, ...HOOK, 38, 0.4),
];

// ejército de Israel: rejilla con jitter; los que se van caminan de espaldas y desaparecen
const ARMY: Inst[] = Array.from({ length: 420 }, (_, i) => {
  const cx = (i % 28) - 13.5, cz = Math.floor(i / 28);
  return { p: [cx * 1.05 + (hash(i) - 0.5) * 0.5, 0, -1.5 - cz * 1.4 + (hash(i + 7) - 0.5) * 0.5], r: 0, c: ["#4B6A8C", "#5C7A5A", "#7A6A55", "#6A5A86"][i % 4] };
});
const keep300 = (i: number) => i % 33 === 5;
const keep10k = (i: number) => hash(i + 99) < 0.31 || keep300(i);
const armyAt = (t: number): Inst[] => {
  if (t >= T_RIVER - 0.2 && t < T_300 - 0.2) return [];
  if (t >= at("frente") - 0.2 && t < T_DAWN) return [];
  const ghost = t >= T_DAWN;
  return ARMY.flatMap((a, i): Inst[] => {
    let o = 1, dz = 0, r = 0;
    const leave1 = !keep10k(i) ? ip(t, T_LEAVE + hash(i) * 0.6, T_LEAVE + 1.4 + hash(i) * 0.6) : 0;
    const leave2 = !keep300(i) && keep10k(i) ? ip(t, T_300 + 0.2 + hash(i) * 0.5, T_300 + 1.6 + hash(i) * 0.5) : 0;
    const lv = Math.max(leave1, leave2);
    if (lv > 0) { r = Math.PI; dz = -lv * 9; o = 1 - ip(lv, 0.7, 1); }
    if (t < T_LEAVE && t > at("mandó") + 0.2) r = Math.PI * ip(t, at("mandó") + 0.2 + hash(i) * 0.4, at("mandó") + 0.8 + hash(i) * 0.4);
    if (t >= at("primero") && t < T_LEAVE) r = 0;
    if (ghost) {
      const showAll = t >= at("con", 3) - 0.1 && t < at("con", 4);
      if (!keep300(i) && !showAll) return [];
      if (!keep300(i)) o = 0.85;
      return [{ ...a, o, h: keep300(i) ? "#8C8F96" : "#C9C2B5" }];
    }
    if (o <= 0.02) return [];
    return [{ ...a, p: [a.p[0], Math.abs(Math.sin(t * 5 + i)) * 0.06 * (lv > 0 ? 1 : 0), a.p[2] + dz] as V3, r, o }];
  });
};
// madianitas: tiendas sin fin
const TENTS = Array.from({ length: 300 }, (_, i) => ({ x: ((i % 20) - 9.5) * 4.2 + (hash(i) - 0.5) * 1.6, z: CAMP[2] - (Math.floor(i / 20) - 7) * 4.2 + (hash(i + 3) - 0.5) * 1.6, c: ["#C98A4B", "#8E5A9E", "#3E7C8C", "#B5473A", "#D9B26A"][i % 5], s: 1 + hash(i + 5) * 0.5 })).filter((tt) => Math.hypot(tt.x, tt.z + 80) > 11);
const dummy = new THREE.Object3D();
const Tents: React.FC = () => {
  const mesh = React.useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.ConeGeometry(1.4, 2.0, 4).translate(0, 1.0, 0), new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), TENTS.length);
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(TENTS.length * 3), 3);
    const c = new THREE.Color();
    TENTS.forEach((tt, i) => { dummy.position.set(tt.x, 0, tt.z); dummy.rotation.set(0, hash(i) * 2, 0); dummy.scale.setScalar(tt.s); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); m.setColorAt(i, c.set(tt.c)); });
    m.castShadow = true;
    return m;
  }, []);
  return <primitive object={mesh} />;
};
const Camel: React.FC<{ pos: V3; rot: number; t: number; seed: number }> = ({ pos, rot, t, seed }) => {
  const bob = Math.sin(t * 2 + seed) * 0.03;
  const C = "#C9A26B";
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {[[-0.4, -0.25], [-0.4, 0.25], [0.45, -0.25], [0.45, 0.25]].map(([x, z], i) => <mesh key={i} position={[x, 0.55, z]} castShadow><cylinderGeometry args={[0.07, 0.06, 1.1, 6]} /><meshStandardMaterial color={C} /></mesh>)}
      <mesh position={[0, 1.25 + bob, 0]} scale={[1.3, 0.6, 0.6]} castShadow><sphereGeometry args={[0.6, 12, 10]} /><meshStandardMaterial color={C} roughness={0.9} /></mesh>
      <mesh position={[0, 1.7 + bob, 0]} castShadow><sphereGeometry args={[0.35, 10, 8]} /><meshStandardMaterial color={C} /></mesh>
      <mesh position={[0.85, 1.75 + bob, 0]} rotation={[0, 0, -0.5]} castShadow><cylinderGeometry args={[0.1, 0.13, 0.9, 6]} /><meshStandardMaterial color={C} /></mesh>
      <group position={[1.15, 2.15 + bob, 0]}>
        <mesh scale={[1.5, 0.8, 0.8]} castShadow><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color={C} /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[0.05, 0.06, 0.11 * sd]}><sphereGeometry args={[0.03, 6, 4]} /><meshBasicMaterial color="#17120E" /></mesh>)}
      </group>
    </group>
  );
};
const Shofar: React.FC = () => (
  <group rotation={[0, 0, 0.3]}>
    <mesh><torusGeometry args={[0.22, 0.045, 8, 16, Math.PI * 0.9]} /><meshStandardMaterial color="#D9B36A" roughness={0.5} /></mesh>
    <mesh position={[0.22, 0, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.09, 0.16, 10, 1, true]} /><meshStandardMaterial color="#C99B4E" side={THREE.DoubleSide} /></mesh>
  </group>
);
// jarro con antorcha escondida; al romperse salen pedazos y la llama crece
const TorchJar: React.FC<{ t: number; broken: number; s?: number; seed?: number }> = ({ t, broken, s = 1, seed = 0 }) => (
  <group scale={s}>
    {broken < 0.05 ? <group position={[0, -0.27, 0]}><Jar s={0.8} color="#B86A3E" /></group> : (
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + seed;
        const d = eo(clamp(broken * 1.6));
        return <mesh key={i} position={[Math.cos(a) * (0.15 + d * 0.9), -0.1 - d * d * 0.9 + d * 0.5, Math.sin(a) * (0.15 + d * 0.9)]} rotation={[a, d * 6, i]}><tetrahedronGeometry args={[0.08, 0]} /><meshStandardMaterial color="#B86A3E" /></mesh>;
      })
    )}
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.03, 0.035, 0.5, 6]} /><meshStandardMaterial color="#6B4423" /></mesh>
    {broken > 0 ? <Fire pos={[0, 0.18, 0]} s={0.22 + 0.12 * broken} t={t + seed} o={Math.min(1, broken * 3)} light={0} /> : <Glow pos={[0, 0.2, 0]} s={0.6} color="#FF9A3C" o={0.5} />}
  </group>
);
const clamp = (x: number) => Math.max(0, Math.min(1, x));

const World: React.FC<{ t: number }> = ({ t }) => {
  const n = night(t), dk = dusk(t);
  const dawn = ip(t, T_DAWN - 0.2, T_DAWN + 0.8);
  const broken = ip(t, T_BREAK, T_BREAK + 0.5);
  const lit = t >= T_BREAK ? 1 : 0;
  const top = mix(mix(mix("#4E9BE6", "#5A5FA8", dk), "#0B1430", n), "#7DA7E0", dawn * 0);
  const bot = mix(mix(mix("#FFE2A8", "#F59A6A", dk), "#22305A", n), dawn > 0 ? "#FFD7A0" : "#22305A", dawn * 0);
  const ground = mix(mix("#B7C26A", "#A08A55", dk * 0.5), "#25304A", n * 0.85);
  const fight = t >= at("oscuridad") - 0.2 && t < T_DAWN;
  const flee = ip(t, at("huyen") - 0.2, at("huyen") + 0.8);
  const shout = t >= at("gritan") - 0.1 && t < at("oscuridad");
  return (
    <>
      <Sky top={top} bot={bot} />
      <fog attach="fog" args={[mix(mix("#F2E2B8", "#E39A72", dk), "#141C36", n), 40, 200]} />
      <hemisphereLight args={[mix(mix("#FFF4DC", "#FFC8A0", dk), "#3A4A80", n), mix("#7A6A40", "#101420", n), 1.3 - n * 0.5]} />
      <directionalLight position={[40, 60 - dk * 40, 30]} intensity={3.0 * (1 - n * 0.85) * (1 - dk * 0.3)} color={mix("#FFE8C0", "#9FB2FF", n)} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      {n > 0.05 ? <>
        <Glow pos={[-60, 70, -200]} s={40} color="#DDE6FF" o={n} />
        <mesh position={[-60, 70, -201]}><circleGeometry args={[6, 24]} /><meshBasicMaterial color="#F4F1E0" transparent opacity={n} fog={false} /></mesh>
        {Array.from({ length: 140 }, (_, i) => <mesh key={i} position={[(hash(i) - 0.5) * 600, 40 + hash(i + 1) * 200, -260 - hash(i + 2) * 80]}><sphereGeometry args={[0.5 + hash(i + 3) * 0.6, 4, 3]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={n * (0.6 + 0.4 * Math.sin(t * 3 + i))} fog={false} /></mesh>)}
      </> : null}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[700, 700]} /><meshStandardMaterial color={ground} roughness={1} /></mesh>
      {[[-90, -230, 70, 34], [40, -260, 90, 46], [180, -120, 70, 30], [-200, -60, 70, 28], [110, 60, 60, 26], [-120, 80, 60, 24]].map((m, i) => <mesh key={i} position={[m[0], -12, m[1]]} scale={[m[2], m[3], m[2] * 0.8]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={mix(mix("#8FA05A", "#9A7E5A", i % 2), "#1E2840", n)} flatShading roughness={1} /></mesh>)}
      {Array.from({ length: 40 }, (_, i) => { const x = (hash(i + 400) - 0.5) * 120, z = 30 - hash(i + 410) * 160; if (Math.abs(x) < 16 && z > -24 && z < 12) return null; if (Math.abs(x - 44) < 6) return null; if (Math.hypot(x - CAMP[0], z - CAMP[2]) < 50) return null; const sc = 0.7 + hash(i + 420) * 1.2; return (
        <group key={i} position={[x, 0, z]} scale={sc}>
          <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.1, 0.14, 1.2, 6]} /><meshStandardMaterial color="#6B4A2E" /></mesh>
          <mesh position={[0, 1.6, 0]} scale={[1.2, 0.9, 1.2]} castShadow><icosahedronGeometry args={[0.9, 0]} /><meshStandardMaterial color={mix(i % 2 ? "#6E9A48" : "#5E8A3E", "#1A2A2A", n)} flatShading /></mesh>
        </group>); })}
      {/* río de Harod */}
      <mesh position={[46, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[7, 260]} /><meshStandardMaterial color={mix("#3FA3DE", "#1B2A4A", n)} roughness={0.1} metalness={0.3} /></mesh>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[44 + hash(i) * 4, 0.05, -40 + ((hash(i + 1) * 80 + t * 1.5) % 80)]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.06]} /><meshBasicMaterial color="#DFF3FF" transparent opacity={0.6 * (1 - n)} /></mesh>)}
      {Array.from({ length: 18 }, (_, i) => <Rock key={i} pos={[42.4 + hash(i) * 0.6, 0.1, -30 + i * 3.5]} s={0.4 + hash(i + 3) * 0.5} color="#A08E78" seed={i + 70} />)}
      <Crowd items={armyAt(t)} />
      {/* soldados en el río: casi todos de rodillas con la cara en el agua */}
      {t >= T_RIVER - 0.3 && t < T_300 ? <Crowd max={60} items={Array.from({ length: 46 }, (_, i) => ({ p: [42.7, -0.25, -18 + i * 0.85] as V3, skip: Math.abs(-18 + i * 0.85 - 1.6) < 2.6 || Math.abs(-18 + i * 0.85 + 4.4) < 1.6, r: Math.PI / 2, lie: 1.05 + Math.sin(t * 3 + i) * 0.05, c: ["#4B6A8C", "#5C7A5A", "#7A6A55"][i % 3] })).filter((x) => !x.skip)} /> : null}
      {t >= T_RIVER - 0.3 && t < T_300 ? [0, 1].map((i) => (
        <Person key={i} pos={[41.8, -0.18, 1.6 - i * 6]} rot={0.95} s={0.92} robe="#4B6A8C" hair="#8C8F96" t={t} seed={30 + i} expr={i === 0 && t > at("lamieron") - 0.2 ? "smug" : "calm"}
          armR={[-0.55, 1.95 + Math.sin(t * 6) * 0.06]} armL={[0.2, 0.5]} lean={0.1} />
      )) : null}
      {t >= T_RIVER - 0.3 && t < T_300 ? <Person pos={[37.5, 0, 6]} rot={1.6} robe="#3F7E6E" trim="#C9A548" hair="#5A3A22" beard="#5A3A22" t={t} seed={4} expr="calm" /> : null}
      {/* Madián */}
      <Tents />
      {Array.from({ length: 26 }, (_, i) => <Camel key={i} pos={[(i < 6 ? 17 + i * 1.6 : (hash(i) - 0.5) * 80), 0, i < 6 ? -66 - (i % 2) * 1.8 : CAMP[2] + (hash(i + 2) - 0.5) * 56]} rot={hash(i + 5) * 6} t={t} seed={i} />)}
      {n > 0.05 ? <Fire pos={[0, 0, -80]} s={0.6} t={t} o={n * (1 - flee * 0.6)} light={1.2} /> : null}
      {n > 0.05 ? Array.from({ length: 10 }, (_, i) => <Fire key={i} pos={[((i % 5) - 2) * 14, 0, CAMP[2] - 10 + Math.floor(i / 5) * 18]} s={0.5} t={t + i} o={n * 0.8 * (1 - flee * 0.5)} light={i % 4 === 0 ? 0.6 : 0} />) : null}
      {/* los 300 rodean el campamento */}
      {n > 0.05 ? (() => {
        const ring: Inst[] = Array.from({ length: 70 }, (_, i) => { const a = (i / 70) * Math.PI * 2; return { p: [CAMP[0] + Math.cos(a) * RING, 0, CAMP[2] + Math.sin(a) * RING] as V3, r: Math.atan2(-Math.cos(a), -Math.sin(a)), c: "#4B6A8C" }; });
        return (
          <>
            <Crowd max={80} items={ring} />
            {ring.map((it, i) => <Glow key={i} pos={[it.p[0], 2.3, it.p[2]]} s={lit ? 3.2 : 0.7} color="#FF9A3C" o={lit ? 0.95 : 0.35} />)}
            {lit ? <pointLight position={[CAMP[0], 6, CAMP[2] + RING]} color="#FF9040" intensity={500} distance={60} /> : null}
          </>
        );
      })() : null}
      {/* Gedeón y dos de sus hombres en primer plano durante el ataque */}
      {n > 0.05 ? [-1.3, 0, 1.3].map((x, i) => (
        <Person key={i} pos={[x, 0, -50 + Math.abs(x) * 0.2]} rot={Math.PI + x * 0.12} s={i === 1 ? 1.05 : 0.95} robe={i === 1 ? "#3F7E6E" : "#4B6A8C"} trim={i === 1 ? "#C9A548" : undefined} hair={i === 1 ? "#5A3A22" : "#8C8F96"} beard={i === 1 ? "#5A3A22" : undefined} t={t} seed={40 + i}
          expr={shout ? "shout" : t >= T_BREAK ? "angry" : "calm"}
          armL={t >= at("levantan") ? [2.5, 0.4] : [0.3, 1.2]} armR={shout ? [0.6, 1.7] : [0.3, 1.2]}
          holdL={<TorchJar t={t} broken={broken} seed={i} s={0.9} />} hold={<group position={[0, 0.05, 0.1]} rotation={[shout ? -1.2 : 0, 0, 0]}><Shofar /></group>} />
      )) : null}
      {/* pelea entre ellos mismos y huida */}
      {fight ? Array.from({ length: 12 }, (_, i) => {
        const pair = Math.floor(i / 2), sd = i % 2 ? 1 : -1;
        const base: V3 = [(pair % 3 - 1) * 3.2, 0, -82 - Math.floor(pair / 3) * 3];
        const run = flee * (6 + hash(i) * 4);
        const swing = Math.sin(t * 9 + i) * 0.8;
        return (
          <Person key={i} pos={[base[0] + sd * 0.65 + (hash(i) - 0.5) * run, 0, base[2] - run]} rot={flee > 0.3 ? Math.PI : sd > 0 ? -Math.PI / 2 : Math.PI / 2} s={0.95} robe={["#8E5A9E", "#3E7C8C", "#B5473A"][i % 3]} hat={undefined} hair="#E6D2A8" t={t} seed={60 + i}
            expr={flee > 0.3 ? "shock" : "angry"} armR={[0.4, 1.5 + swing]} jump={flee > 0.2 ? 0.6 : 0}
            hold={<mesh position={[0, -0.35, 0]}><boxGeometry args={[0.05, 0.7, 0.02]} /><meshStandardMaterial color="#D8DEE6" metalness={0.9} roughness={0.2} /></mesh>} />
        );
      }) : null}
      {/* el soldado que enseña las armas */}
      {t >= at("armas") - 0.5 && t < T_NIGHT ? (
        <>
          <Person pos={SOL} rot={0} robe="#4B6A8C" hair="#8C8F96" t={t} seed={7} expr={t > at("ni") ? "smug" : "calm"} armL={[0.2, 1.3]} armR={[0.2, 1.3]}
            holdL={<group rotation={[1.2, 0, 0]}><Shofar /></group>} hold={<group rotation={[1.25, 0, 0]}><TorchJar t={t} broken={0} s={0.9} /></group>} />
          <group position={[7.0, 0.06, 5.2]} rotation={[0, 0.4, Math.PI / 2]}>
            <mesh><boxGeometry args={[0.06, 1.0, 0.02]} /><meshStandardMaterial color="#D8DEE6" metalness={0.9} roughness={0.25} /></mesh>
            <mesh position={[0, -0.5, 0]}><boxGeometry args={[0.25, 0.05, 0.05]} /><meshStandardMaterial color="#8A6A3A" /></mesh>
          </group>
        </>
      ) : null}
      {/* Gedeón en la colina */}
      {(t < T_RIVER || (t >= T_300 - 0.3 && t < at("frente") + 0.2) || t >= T_DAWN - 0.2) ? (
        <Person pos={G} rot={0} s={1.08} robe="#3F7E6E" trim="#C9A548" hair="#5A3A22" beard="#5A3A22" t={t} seed={4}
          expr={t >= at("todavía") - 0.1 && t < T_RIVER ? "shock" : t >= at("primero") && t < T_LEAVE + 0.8 ? "shout" : t >= T_DAWN ? "calm" : "calm"}
          talk={t >= at("primero") && t < T_LEAVE}
          armL={t >= at("primero") && t < T_LEAVE ? [1.1, 0.6] : [0.15, 0.1]} armR={t >= at("primero") && t < T_LEAVE ? [1.1, 0.6] : [0.15, 0.1]} />
      ) : null}
      {t >= at("dios") - 0.1 && t < T_RIVER ? <><mesh position={[0, 20, 3.6]}><cylinderGeometry args={[1.0, 1.6, 40, 16, 1, true]} /><meshBasicMaterial color="#FFF3C8" transparent opacity={0.13 * ip(t, at("dios") - 0.1, at("dios") + 0.4)} side={THREE.DoubleSide} depthWrite={false} /></mesh><Glow pos={[0, 2.5, 4]} s={6} color="#FFF0C0" o={0.5} /></> : null}
      {t >= T_DAWN ? <Glow pos={[0, 30, -60]} s={60} color="#FFE7B0" o={0.7 * dawn} /> : null}
      {n > 0.05 && t >= T_BREAK ? <Embers pos={[0, 2, -50]} t={t} n={40} o={1} spread={4} /> : null}
    </>
  );
};

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const box = (txt: React.ReactNode, a: number, b: number, size = 104, y = 1420) => {
    if (t < a || t > b) return null;
    const kk = eo(ip(t, a, a + 0.18));
    return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: -2, transform: `scale(${1.3 - 0.3 * kk})`, opacity: kk * ip(t, b - 0.15, b, 1, 0), textShadow: "0 6px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.5)" }}>{txt}</div>;
  };
  return (
    <>
      {box(<>32.000 <span style={{ color: "#FF6A1F" }}>→</span> 10.000</>, at("quedaban"), at("dios") + 0.3, 92)}
      {box(<>10.000 <span style={{ color: "#FF6A1F" }}>→</span> 300</>, at("esos") + 0.1, at("frente") - 0.1, 96)}
      {box("JUECES 7:2", at("explicó"), at("con", 3) - 0.1, 70)}
    </>
  );
};

const COVER_T = at("solo") + 0.6;
export const Gedeon: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? COVER_T : f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={1080} height={1920} shadows style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig t={t} keys={CAM} shake={cover ? 0 : 1} />
        <World t={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 140, lineHeight: 1.0, color: "#fff", textShadow: "0 8px 0 rgba(0,0,0,0.55), 0 0 40px rgba(0,0,0,0.6)" }}>
          ¿POR CÓMO<br /><span style={{ color: "#4FB3FF" }}>BEBÍA?</span>
        </div>
      ) : (
        <>
          <Overlay t={t} />
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("gedeon/mezcla.wav")} />
      {[[T_BREAK - 0.03, "sfx/shatter.wav", 0.4], [at("huyen") - 0.3, "sfx/whoosh.wav", 0.25], [at("demasiados") - 0.05, "sfx/impact.wav", 0.3]].map(([a, nn, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={45}><Audio src={staticFile(nn as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
