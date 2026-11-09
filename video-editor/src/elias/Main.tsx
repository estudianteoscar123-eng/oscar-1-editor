import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import data from "../../public/elias/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { CamRig, Cloud, Embers, Fire, Glow, Jar, Key, Person, Rain, Rock, Sky, Terrain, V3, eo, hash, ip, mix } from "../k3/Kit3D";

// ZK 3D · Elías en el Carmelo (1 Reyes 18). Un solo plano continuo; la cámara viaja entre los dos altares.
const TH = 0.1;
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + TH, e: (c.timestamp[1] ?? c.timestamp[0] + 0.3) + TH }));
const END = Math.round((WORDS[WORDS.length - 1].e + 0.55) * 10) / 10;
export const ELIAS_TOTAL = S(END);
const KEYS = new Set(["sequía", "doce", "agua", "fuego", "450", "baal", "cielo", "nada", "dormido", "cuchillos", "chispa", "piedras", "zanja", "tres", "verás", "tormenta", "rayo", "lluvia", "trampa", "ora", "llover"]);
const RED = "#D30F17";
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => WORDS.filter((x) => clean(x.w) === w)[n]?.s ?? 0;

// escena
const ALT: V3 = [0, 0, 0];
const BAAL: V3 = [-14, 0, -6];
const IDOL: V3 = [-15.5, 0, -11];
const ELI: V3 = [2.4, 0, 1.2];
const T_FIRE = at("cae");
const T_RAIN = at("ese", 1) + 0.5;
const POURS = [0.15, at("vez"), at("dos"), at("tres", 1)];
const BUILD0 = at("arma");

const ALTM: [V3, V3] = [[0.4, 2.5, 5.0], [0, 1.0, 0]];
const ELIF: [V3, V3] = [[1.0, 1.75, 3.5], [2.4, 1.6, 1.2]];
const PROF: [V3, V3] = [[-12.0, 2.2, 0.3], [-14, 1.45, -5.4]];
const IDF: [V3, V3] = [[-15.0, 3.2, -7.4], [-15.5, 3.0, -11]];
const k = (t: number, v: [V3, V3], fov = 36, e?: number, push?: number): Key => ({ t, p: v[0], l: v[1], fov, e, push });
const KEYS_CAM: Key[] = [
  k(0, [[0.9, 2.3, 3.6], [-0.2, 1.3, 0.2]], 36, undefined, 0.07),
  k(at("doce") - 0.1, ALTM, 36),
  k(at("altar") - 0.05, ELIF, 30),
  k(at("prenderle"), [[0.5, 8, 15], [0, 0.8, 0]], 40, 0.6),
  k(at("frente"), [[-9, 2.6, 5], [-14, 1.3, -6]], 40, 0.5),
  k(at("450"), [[-9, 9, 9], [-14, 0.6, -9]], 44),
  k(at("reto"), [[-7, 6, 14], [-7, 1, -4]], 44),
  k(at("cielo") - 0.15, [[-6, 2, 9], [-4, 24, -26]], 46, 0.55),
  k(at("verdadero"), ELIF, 30),
  k(at("ellos"), PROF, 36),
  k(at("mañana") - 0.1, [[-14.5, 1.4, 3.5], [-12, 9, -22]], 46),
  k(at("nada"), [[-12.6, 1.8, -3.6], [-14, 1.05, -6]], 34),
  k(at("elías"), [[0.7, 1.9, 4.3], [2.3, 1.45, 1.2]], 34),
  k(at("dormido"), IDF, 34),
  k(at("saltan"), [[-10.5, 3.6, 0.5], [-14, 1, -6]], 42),
  k(at("cuchillos"), PROF, 32),
  k(at("chispa"), [[-12.3, 2.0, -3.1], [-14, 1.1, -6]], 30),
  k(at("turno"), [[0.6, 2.0, 4.8], [2.4, 1.35, 1.2]], 36, 0.5),
  k(at("piedras") - 0.6, [[0.2, 5.8, 3.4], [0, 0.4, 0]], 40),
  k(at("zanja"), [[2.4, 1.6, 3.2], [0.4, 0.2, 0.6]], 38),
  k(at("agua", 1) - 0.1, ALTM, 38),
  k(at("vez"), [[0.9, 2.3, 3.6], [-0.2, 1.3, 0.2]], 36),
  k(at("dos"), [[2.9, 2.5, 3.3], [0, 1.1, 0]], 38),
  k(at("tres", 1), [[0.3, 1.2, 3.8], [0, 1.0, 0]], 38),
  k(at("llena"), [[2.0, 1.0, 2.6], [0.4, 0.2, 0.8]], 34),
  k(at("profetas", 1), PROF, 34),
  k(at("verás"), IDF, 36, 0.5),
  k(at("rayo") - 0.1, [[-13.0, 3.7, -8.2], [-14.4, 3.6, -11.2]], 32),
  k(at("elías", 1), [[-7, 6, 14], [-7, 1, -4]], 44, 0.55),
  k(at("empapó"), [[1.3, 1.5, 2.6], [0, 0.95, 0]], 32),
  k(at("ora"), [[0.9, 1.25, 4.8], [2.4, 1.85, 1.2]], 40),
  k(T_FIRE - 0.05, [[0.5, 4.5, 16], [0, 8, 0]], 46, 0.35),
  k(at("quema"), [[2.2, 2.3, 4.4], [0, 1.3, 0]], 38),
  k(at("piedras", 1) - 0.1, [[1.6, 1.3, 2.9], [0, 0.6, 0]], 34),
  k(at("agua", 2) - 0.1, [[2.0, 1.0, 2.6], [0.4, 0.2, 0.8]], 34),
  k(at("ese", 1), [[-2, 8, 18], [-5, 2, -4]], 44, 0.6),
  k(at("volvió") - 0.2, [[0.5, 1.3, 4.4], [2.4, 1.85, 1.2]], 36),
  k(END - 0.45, [[0.9, 2.3, 3.6], [-0.2, 1.3, 0.2]], 36, 0.4),
];

const Stones: React.FC<{ t: number; burn: number; gone: number }> = ({ t, burn, gone }) => (
  <group>
    {Array.from({ length: 12 }, (_, i) => {
      const ring = i < 8 ? 0 : 1;
      const a = ring ? ((i - 8) / 4) * Math.PI * 2 + 0.4 : (i / 8) * Math.PI * 2;
      const r = ring ? 0.42 : 0.78;
      const y = ring ? 0.62 : 0.22;
      const tIn = t < 6.5 ? -1 : BUILD0 + i * 0.09;
      const drop = tIn < 0 ? 1 : eo(ip(t, tIn, tIn + 0.22));
      if (drop <= 0) return null;
      const col = mix("#A39484", "#FF5A1F", burn * (0.6 + 0.4 * hash(i)));
      return <Rock key={i} pos={[Math.cos(a) * r, y + (1 - drop) * 3, Math.sin(a) * r]} s={0.62 * (1 - gone)} color={col} seed={i * 7} rot={a} />;
    })}
  </group>
);
const Altar: React.FC<{ t: number }> = ({ t }) => {
  const built = t < 6.5 || t >= BUILD0;
  if (!built) return null;
  const burn = ip(t, at("piedras", 1) - 0.2, at("piedras", 1) + 0.3);
  const gone = ip(t, at("piedras", 1) + 0.4, at("piedras", 1) + 1.0);
  const wood = 1 - ip(t, at("leña") - 0.1, at("leña") + 0.5);
  const meat = 1 - ip(t, at("ofrenda") - 0.1, at("ofrenda") + 0.5);
  const trench = t < 6.5 ? 1 : eo(ip(t, at("cava"), at("cava") + 0.8));
  // agua: el gancho ya la muestra a medias; luego sube en 3 tandas y el fuego se la bebe
  const lv = t < 6.5 ? 0.35 + ip(t, 0.2, 6.2) * 0.25 : POURS.slice(1).reduce((s, p) => s + ip(t, p + 0.15, p + 0.9) / 3, 0) * (1 - ip(t, at("agua", 2) - 0.3, at("agua", 2) + 0.6));
  const wet = t < 6.5 ? 1 : Math.min(1, lv * 3) * (1 - ip(t, T_FIRE, T_FIRE + 0.6));
  return (
    <group position={ALT}>
      <Stones t={t} burn={burn} gone={gone} />
      {wood > 0.02 ? (
        <group position={[0, 0.98, 0]} scale={wood}>
          {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, (i % 2) * 0.13, (i - 1.5) * 0.16]} rotation={[0, (i % 2) * 1.57, Math.PI / 2]} castShadow><cylinderGeometry args={[0.07, 0.07, 1.25, 7]} /><meshStandardMaterial color={mix("#8A5A33", "#4A3020", wet * 0.6)} roughness={0.9} /></mesh>)}
        </group>
      ) : null}
      {meat > 0.02 ? <mesh position={[0, 1.27, 0]} scale={[meat, meat, meat]} castShadow><boxGeometry args={[0.6, 0.22, 0.38]} /><meshStandardMaterial color="#B5463A" roughness={0.7} /></mesh> : null}
      {wet > 0.05 ? Array.from({ length: 10 }, (_, i) => { const k = (t * 1.3 + hash(i)) % 1; return <mesh key={i} position={[(hash(i + 1) - 0.5) * 1.4, 1.1 - k * 1.0, (hash(i + 2) - 0.5) * 1.2]}><sphereGeometry args={[0.03, 6, 4]} /><meshStandardMaterial color="#9BD0FF" transparent opacity={0.8 * wet} /></mesh>; }) : null}
      {trench > 0.02 ? (
        <group scale={[trench, 1, trench]}>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.25, 1.65, 40]} /><meshStandardMaterial color="#6B4A2E" roughness={1} /></mesh>
          {lv > 0.01 ? <mesh position={[0, 0.02 + lv * 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.27, 1.63, 40]} /><meshStandardMaterial color="#3E9BE0" roughness={0.15} metalness={0.2} transparent opacity={0.55 + 0.4 * lv} /></mesh> : null}
        </group>
      ) : null}
    </group>
  );
};
const Pourer: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const a = (i / 4) * Math.PI * 2 + 0.6;
  const pos: V3 = [Math.cos(a) * 1.95, 0, Math.sin(a) * 1.95];
  const active = t < 6.5 || (t >= at("agua", 1) - 0.2 && t < at("llena") + 0.6);
  if (!active) return null;
  const pr = POURS.map((p) => ip(t, p, p + 0.25) * (1 - ip(t, p + 0.75, p + 0.95))).reduce((m, x) => Math.max(m, x), t < 6.5 ? 1 : 0);
  const tilt = pr * 1.9;
  return (
    <group>
      <Person pos={pos} rot={Math.atan2(-Math.cos(a), -Math.sin(a))} s={0.9} robe={["#5F7FA6", "#6C8F6A", "#9A7B55", "#7A6A9A"][i]} hair="#3A2A1E" t={t} seed={i + 20} expr={pr > 0.5 ? "calm" : "tired"}
        armL={[0.1, 1.25 + pr * 0.35]} armR={[0.1, 1.25 + pr * 0.35]} />
      <group position={[Math.cos(a) * 1.42, 1.32 + pr * 0.12, Math.sin(a) * 1.42]} rotation={[0, Math.atan2(-Math.cos(a), -Math.sin(a)), 0]}><group rotation={[tilt, 0, 0]} position={[0, 0, 0]}><group position={[0, -0.25, 0]}><Jar s={0.95} /></group></group></group>
      {pr > 0.6 ? (
        <mesh position={[Math.cos(a) * 1.2, 1.45, Math.sin(a) * 1.2]}>
          <cylinderGeometry args={[0.05, 0.09, 0.75, 8]} />
          <meshStandardMaterial color="#8FD0FF" transparent opacity={0.75} roughness={0.1} />
        </mesh>
      ) : null}
    </group>
  );
};
const Idol: React.FC<{ t: number }> = ({ t }) => {
  const flash = Math.max(ip(t, at("rayo") - 0.05, at("rayo") + 0.08) * (1 - ip(t, at("rayo") + 0.3, at("rayo") + 0.9)), ip(t, at("tormenta"), at("tormenta") + 0.1) * (1 - ip(t, at("tormenta") + 0.2, at("tormenta") + 0.7)) * 0.6);
  const zz = t >= at("dormido") - 0.1 && t < at("gritan", 1);
  return (
    <group position={IDOL} rotation={[0, 0.25, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.4, 0.6, 1.4]} /><meshStandardMaterial color="#8C7B66" flatShading /></mesh>
      <mesh position={[0, 1.6, 0]} castShadow><cylinderGeometry args={[0.45, 0.6, 2, 8]} /><meshStandardMaterial color="#9E8A62" metalness={0.35} roughness={0.5} flatShading /></mesh>
      <mesh position={[0, 3.0, 0]} castShadow><sphereGeometry args={[0.45, 12, 10]} /><meshStandardMaterial color="#9E8A62" metalness={0.35} roughness={0.5} flatShading /></mesh>
      <mesh position={[0, 3.55, 0]}><coneGeometry args={[0.3, 0.8, 8]} /><meshStandardMaterial color="#C9A548" metalness={0.5} roughness={0.35} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.38 * sd, 3.35, 0]} rotation={[0, 0, -sd * 0.7]}><coneGeometry args={[0.07, 0.5, 6]} /><meshStandardMaterial color="#C9A548" metalness={0.5} /></mesh>)}
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.15 * sd, 3.05, 0.4]}><sphereGeometry args={[0.06, 8, 6]} /><meshBasicMaterial color={zz ? "#2a2018" : "#1a120c"} /></mesh>)}
      <group position={[0.55, 2.5, 0]} rotation={[0, 0, -0.6]}>
        <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.1, 0.12, 1.1, 6]} /><meshStandardMaterial color="#9E8A62" metalness={0.35} /></mesh>
        <group position={[0.05, 1.25, 0]} rotation={[0, 0, 0.6]}>
          <mesh position={[0, 0.0, 0]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.12, 0.6, 0.08]} /><meshStandardMaterial color="#F2C94C" emissive="#FFD34D" emissiveIntensity={0.3 + flash * 6} /></mesh>
          <mesh position={[0.15, -0.45, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.12, 0.6, 0.08]} /><meshStandardMaterial color="#F2C94C" emissive="#FFD34D" emissiveIntensity={0.3 + flash * 6} /></mesh>
          {flash > 0.02 ? <Glow pos={[0.05, -0.2, 0.2]} s={3.5 * flash + 0.5} color="#FFE27A" o={flash} /> : null}
        </group>
      </group>
      {flash > 0.02 ? <pointLight position={[0.6, 4, 1.5]} color="#BFD8FF" intensity={80 * flash} distance={12} /> : null}
    </group>
  );
};
const Prophets: React.FC<{ t: number }> = ({ t }) => {
  const shout = t >= at("gritan") - 0.1 && t < at("nada");
  const frantic = t >= at("gritan", 1) - 0.1 && t < at("chispa") + 0.4;
  const knives = t >= at("cortan") - 0.1 && t < at("chispa") + 0.4;
  const laugh = (t >= at("frente") && t < at("ellos")) || (t >= at("profetas", 1) - 0.1 && t < at("verás"));
  const shock = t >= T_FIRE;
  const down = ip(t, T_FIRE + 1.2, T_FIRE + 1.8);
  return (
    <group>
      {Array.from({ length: 26 }, (_, i) => {
        const ring = i < 10;
        const a = ring ? (i / 10) * Math.PI * 2 + (frantic ? t * 0.9 : 0) : Math.PI * (1.1 + hash(i) * 0.8);
        const r = ring ? 2.4 : 3.6 + hash(i + 5) * 4.5;
        const pos: V3 = [BAAL[0] + Math.cos(a) * r, 0, BAAL[2] + Math.sin(a) * r];
        const face = Math.atan2(BAAL[0] - pos[0], BAAL[2] - pos[2]);
        const look = laugh ? Math.atan2(ELI[0] - pos[0], ELI[2] - pos[2]) : shock ? Math.atan2(ALT[0] - pos[0], ALT[2] - pos[2]) : face;
        const expr = shock ? "shock" : laugh ? "laugh" : shout || frantic ? "shout" : t > at("nada") && t < at("profetas", 1) ? "tired" : "smug";
        const up = shout || frantic;
        return (
          <Person key={i} pos={pos} rot={look} s={0.95} robe={i % 3 ? "#9E2B25" : "#7A1E2C"} trim="#E0B040" hat="#C9A548" t={t + i * 0.37} seed={i}
            expr={expr} jump={frantic ? 1 : 0} lie={shock ? -down * 1.35 : 0}
            armL={up ? [2.4 + Math.sin(t * 9 + i) * 0.3, 0.3] : laugh ? [0.3, 0.9] : [0.15, 0.1]}
            armR={up ? [2.4 + Math.cos(t * 9 + i) * 0.3, 0.3] : laugh ? [0.3, 0.9] : [0.15, 0.1]}
            hold={knives && i % 2 === 0 ? <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.05, 0.4, 0.02]} /><meshStandardMaterial color="#D8DEE6" metalness={0.9} roughness={0.2} /></mesh> : undefined} />
        );
      })}
      {/* el resto de los 450: siluetas al fondo */}
      {Array.from({ length: 80 }, (_, i) => {
        const a = Math.PI * (1.05 + hash(i + 50) * 0.9);
        const r = 9 + hash(i + 80) * 9;
        const y = shock ? 0 : Math.abs(Math.sin(t * 6 + i)) * (t > at("gritan", 1) && t < at("chispa") ? 0.25 : 0);
        return (
          <group key={i} position={[BAAL[0] + Math.cos(a) * r, y, BAAL[2] + Math.sin(a) * r]} scale={0.9}>
            <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.22, 0.36, 0.95, 8]} /><meshStandardMaterial color={i % 2 ? "#9E2B25" : "#7A1E2C"} /></mesh>
            <mesh position={[0, 1.35, 0]}><sphereGeometry args={[0.33, 12, 10]} /><meshStandardMaterial color="#F6F1E8" /></mesh>
            <mesh position={[0, 1.78, 0]}><coneGeometry args={[0.22, 0.45, 8]} /><meshStandardMaterial color="#C9A548" /></mesh>
          </group>
        );
      })}
    </group>
  );
};
const Elijah: React.FC<{ t: number }> = ({ t }) => {
  const mock = t >= at("elías") && t < at("gritan", 1);
  const build = t >= BUILD0 - 0.4 && t < at("agua", 1);
  const pray = t >= at("ora") - 0.1 && t < T_FIRE + 0.2;
  const rain = t >= T_RAIN;
  const smug = (t >= at("verdadero") && t < at("ellos")) || t < 6.5;
  const expr = pray ? "pray" : rain ? "happy" : mock ? "laugh" : smug ? "smug" : t >= T_FIRE ? "calm" : "calm";
  const armL: [number, number] = pray ? [2.7, 0.2] : rain ? [1.9, 0.4] : mock ? [0.6, 1.9] : build ? [0.3, 1.2] : smug ? [0.25, 0.9] : [0.15, 0.1];
  const armR: [number, number] = pray ? [2.7, 0.2] : rain ? [1.9, 0.4] : build ? [0.3, 1.2] : smug ? [0.25, 0.9] : [0.2, 0.1];
  return (
    <Person pos={ELI} rot={-0.6} s={1.08} robe="#8A5A2E" trim="#5E3B1C" beard="#E8E2D6" hair="#D9D2C6" t={t} seed={3} expr={expr} armL={armL} armR={armR} talk={mock}
      hold={!pray && !rain ? <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.035, 0.035, 2.0, 6]} /><meshStandardMaterial color="#6B4423" /></mesh> : undefined} />
  );
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const storm = ip(t, T_RAIN - 1.2, T_RAIN + 0.6);
  const fireT = ip(t, T_FIRE, T_FIRE + 0.15) * (1 - ip(t, at("agua", 2) + 0.3, at("ese", 1) + 0.2));
  const column = ip(t, T_FIRE - 0.05, T_FIRE + 0.12) * (1 - ip(t, T_FIRE + 0.5, T_FIRE + 1.3));
  const noon = ip(t, at("mañana"), at("mediodía") + 0.4);
  const sunA = -0.35 + noon * 1.2 + ip(t, 26, 47) * 0.4;
  const sun: V3 = [Math.sin(sunA) * 60, 20 + Math.cos(sunA) * 55 - (1 - noon) * 20, -70];
  const top = mix(mix("#5FA3E0", "#4A86D4", noon), "#3A4658", storm);
  const bot = mix(mix("#FFD39A", "#FBE3B0", noon), "#8C97A6", storm);
  const ground = mix("#D9A766", "#7E6A4E", storm * 0.8);
  return (
    <>
      <Sky top={top} bot={bot} />
      <fog attach="fog" args={[mix("#F5D2A0", "#7D8899", storm), 28, 150]} />
      <hemisphereLight args={[mix("#FFF1D6", "#AFC0D8", storm), mix("#B07A45", "#40403F", storm), 1.25 - storm * 0.5]} />
      <directionalLight position={sun} intensity={(3.2 - storm * 2.4) * (1 - column * 0.5)} color={mix("#FFE2B0", "#C9D6E8", storm)} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={26} shadow-camera-bottom={-26} shadow-bias={-0.0004} />
      {storm < 0.9 ? <Glow pos={[sun[0] * 1.6, sun[1] * 1.6, sun[2] * 1.6]} s={70} color="#FFF4D0" o={0.9 * (1 - storm)} /> : null}
      <Terrain color={ground} />
      {/* grietas de la sequía */}
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(hash(i) - 0.5) * 26 - 4, 0.03, (hash(i + 9) - 0.5) * 20]} rotation={[-Math.PI / 2, 0, hash(i + 4) * 6]}><planeGeometry args={[1.4 + hash(i + 2) * 1.6, 0.05]} /><meshBasicMaterial color="#8A6136" transparent opacity={0.7 * (1 - storm)} /></mesh>)}
      {[[-60, -120, 46, 26], [10, -150, 60, 34], [-140, -70, 44, 22], [110, -100, 56, 28], [70, -170, 40, 30], [-100, -160, 50, 30]].map((m, i) => <mesh key={i} position={[m[0], -14, m[1]]} scale={[m[2], m[3], m[2] * 0.8]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={mix(i % 2 ? "#9C8E6A" : "#8C8A62", "#4F5866", storm)} flatShading roughness={1} /></mesh>)}
      {Array.from({ length: 34 }, (_, i) => { const x = (hash(i + 300) - 0.5) * 70 - 4, z = -8 - hash(i + 310) * 40 + (i % 3) * 14; if (Math.hypot(x, z) < 6 || Math.hypot(x + 14, z + 6) < 10) return null; const sc = 0.6 + hash(i + 320) * 1.0; return (
        <group key={i} position={[x, 0, z]} scale={sc}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.08, 0.12, 1, 6]} /><meshStandardMaterial color="#6B4A2E" /></mesh>
          <mesh position={[0, 1.3, 0]} scale={[1.2, 0.8, 1.2]} castShadow><icosahedronGeometry args={[0.8, 0]} /><meshStandardMaterial color={mix(i % 2 ? "#7E9A4A" : "#6C8A3E", "#4E5E3E", storm)} flatShading /></mesh>
        </group>); })}
      <mesh position={[120, -9, 40]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[220, 400]} /><meshStandardMaterial color={mix("#3BA3D9", "#40607A", storm)} roughness={0.2} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <Rock key={i} pos={[(hash(i + 30) - 0.5) * 34 - 5, 0.15, (hash(i + 40) - 0.5) * 26 - 2]} s={0.5 + hash(i) * 1.1} color="#B8996F" seed={i + 60} />)}
      <Altar t={t} />
      {/* altar de Baal: leña seca y un toro sin fuego */}
      <group position={BAAL}>
        {Array.from({ length: 10 }, (_, i) => <Rock key={i} pos={[Math.cos(i * 0.63) * 0.75, 0.25 + (i % 2) * 0.3, Math.sin(i * 0.63) * 0.75]} s={0.66} color="#A9937A" seed={i + 200} />)}
        {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.98 + (i % 2) * 0.12, (i - 1) * 0.18]} rotation={[0, (i % 2) * 1.57, Math.PI / 2]} castShadow><cylinderGeometry args={[0.07, 0.07, 1.25, 7]} /><meshStandardMaterial color="#9A6A3E" /></mesh>)}
        <mesh position={[0, 1.24, 0]} castShadow><boxGeometry args={[0.6, 0.22, 0.38]} /><meshStandardMaterial color="#B5463A" /></mesh>
        {t >= at("nada") - 0.1 && t < at("nada") + 0.9 ? <Embers pos={[0, 1.2, 0]} t={t} n={8} o={0.6} color="#C9B49A" spread={0.6} speed={0.4} /> : null}
      </group>
      <Idol t={t} />
      <Prophets t={t} />
      <Elijah t={t} />
      {[0, 1, 2, 3].map((i) => <Pourer key={i} t={t} i={i} />)}
      {/* fuego del cielo */}
      {column > 0.01 ? (
        <group>
          <mesh position={[0, 30, 0]}><cylinderGeometry args={[1.5 * column, 1.1 * column, 60, 20, 1, true]} /><meshBasicMaterial color="#FFF2C2" transparent opacity={0.85 * column} /></mesh>
          <Glow pos={[0, 2, 0]} s={22 * column} color="#FFD27A" o={column} />
          <pointLight position={[0, 6, 2]} color="#FFE7B0" intensity={220 * column} distance={40} />
        </group>
      ) : null}
      <Fire pos={[0, 1.0, 0]} s={1.35} t={t} o={fireT} light={1.4} />
      <Embers pos={[0, 1.0, 0]} t={t} n={60} o={fireT} spread={1.6} />
      {t >= at("agua", 2) - 0.3 && t < at("ese", 1) + 0.8 ? <Embers pos={[0, 0.05, 0]} t={t} n={40} o={ip(t, at("agua", 2) - 0.3, at("agua", 2)) * (1 - ip(t, at("ese", 1), at("ese", 1) + 0.8))} spread={3.2} color="#F2F2F2" speed={0.5} /> : null}
      {/* nubes de tormenta y lluvia */}
      {Array.from({ length: 9 }, (_, i) => <Cloud key={i} pos={[(i - 4) * 9 + Math.sin(t * 0.3 + i) * 2, 18 + hash(i) * 5 + (1 - storm) * 14, -10 - hash(i + 3) * 25]} s={2.6 + hash(i + 1) * 1.6} color="#56606F" o={storm * 0.95} seed={i} />)}
      <Rain center={[0, 0, 1]} t={t} o={ip(t, T_RAIN, T_RAIN + 0.5)} />
    </>
  );
};

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const box = (txt: string, a: number, b: number, size = 104, y = 1420) => {
    if (t < a || t > b) return null;
    const k = eo(ip(t, a, a + 0.18));
    return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: -2, transform: `scale(${1.3 - 0.3 * k})`, opacity: k * ip(t, b - 0.15, b, 1, 0), textShadow: "0 6px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.5)" }}>{txt}</div>;
  };
  return (
    <>
      {box("4 CÁNTAROS", at("vez") + 0.05, at("dos") - 0.05)}
      {box("8 CÁNTAROS", at("dos") + 0.05, at("tres", 1) - 0.05)}
      {box("12 CÁNTAROS", at("tres", 1) + 0.05, at("llena") + 0.5, 118)}
      {box("Z z z", at("dormido") + 0.05, at("gritan", 1) - 0.05, 96, 640)}
      {box("1 REYES 18:38", at("quema") + 0.1, at("agua", 2) + 0.3, 70)}
    </>
  );
};

export const Elias: React.FC = () => {
  const f = useCurrentFrame();
  const cover = f < 3;
  const t = cover ? 1.6 : f / FPS;
  const flash = Math.max(ip(t, T_FIRE - 0.02, T_FIRE + 0.04) * (1 - ip(t, T_FIRE + 0.1, T_FIRE + 0.6)), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={1080} height={1920} shadows style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig t={t} keys={KEYS_CAM} shake={cover ? 0 : 1} />
        <World t={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.85 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      {cover ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 132, lineHeight: 1.0, color: "#fff", textShadow: "0 8px 0 rgba(0,0,0,0.55), 0 0 40px rgba(0,0,0,0.6)" }}>
          ¿AGUA…<br /><span style={{ color: "#FF6A1F" }}>PARA UN FUEGO?</span>
        </div>
      ) : (
        <>
          <Overlay t={t} />
          <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} hl={RED} />
        </>
      )}
      <Audio src={staticFile("elias/mezcla.wav")} />
      {[[T_FIRE - 0.35, "sfx/whoosh.wav", 0.35], [T_FIRE - 0.03, "sfx/impact.wav", 0.45], [at("rayo") - 0.04, "sfx/crack.wav", 0.25]].map(([a, n, v], i) => (
        <Sequence key={i} from={S(a as number)} durationInFrames={45}><Audio src={staticFile(n as string)} volume={v as number} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
