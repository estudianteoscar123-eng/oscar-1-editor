import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// ZK 3D · kit reutilizable: cámara continua, personajes de cabeza redonda, cielo, terreno, fuego, agua, lluvia.
export type V3 = [number, number, number];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => o0 + (o1 - o0) * clamp01((v - a) / (b - a));
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- cámara: un solo plano continuo ----------
// cada clave es un encuadre; la cámara viaja a él en `e` s (latigazo) y dentro del encuadre empuja suave hacia el sujeto
export type Key = { t: number; p: V3; l: V3; fov?: number; e?: number; push?: number };
export const camAt = (keys: Key[], t: number) => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].t <= t) i++;
  const pose = (k: Key, tt: number) => {
    const d = Math.max(0, tt - k.t) * (k.push ?? 0.045);
    const p = lerp3(k.p, k.l, Math.min(0.35, d));
    return { p, l: k.l, fov: k.fov ?? 38 };
  };
  const cur = pose(keys[i], t);
  if (i === 0) return cur;
  const k = keys[i];
  const e = k.e ?? 0.42;
  const a = eio(clamp01((t - k.t) / e));
  if (a >= 1) return cur;
  const prev = pose(keys[i - 1], t);
  // arco: el latigazo sube un poco a mitad de camino
  const arc = Math.sin(a * Math.PI) * 0.25;
  const p = lerp3(prev.p, cur.p, a);
  p[1] += arc;
  return { p, l: lerp3(prev.l, cur.l, a), fov: prev.fov + (cur.fov - prev.fov) * a };
};
export const CamRig: React.FC<{ t: number; keys: Key[]; shake?: number }> = ({ t, keys, shake = 1 }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const c = camAt(keys, t);
  const hx = (Math.sin(t * 1.3) * 0.03 + Math.sin(t * 2.9) * 0.012) * shake;
  const hy = (Math.cos(t * 1.1) * 0.025 + Math.sin(t * 3.7) * 0.01) * shake;
  camera.position.set(c.p[0] + hx, c.p[1] + hy, c.p[2]);
  camera.fov = c.fov;
  camera.near = 0.05;
  camera.far = 900;
  camera.updateProjectionMatrix();
  camera.lookAt(c.l[0] + hx * 0.5, c.l[1] + hy * 0.5, c.l[2]);
  return null;
};

// ---------- cielo degradado ----------
export const Sky: React.FC<{ top: string; bot: string }> = ({ top, bot }) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } },
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+0.12,0.0,1.0); gl_FragColor = vec4(mix(bot,top,pow(h,0.8)),1.0); \n#include <colorspace_fragment>\n }",
      }),
    [],
  );
  mat.uniforms.top.value.set(top);
  mat.uniforms.bot.value.set(bot);
  return <mesh material={mat} renderOrder={-10}><sphereGeometry args={[600, 32, 16]} /></mesh>;
};
export const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), clamp01(k)).getHexString();

// textura de brillo radial (fuego, sol, antorchas)
let glowTex: THREE.Texture | null = null;
export const getGlow = () => {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.25, "rgba(255,255,255,0.55)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
};
export const Glow: React.FC<{ pos: V3; s: number; color: string; o?: number }> = ({ pos, s, color, o = 1 }) => (
  <sprite position={pos} scale={[s, s, s]} renderOrder={5}>
    <spriteMaterial map={getGlow()} color={color} transparent opacity={o} blending={THREE.AdditiveBlending} depthWrite={false} />
  </sprite>
);

// ---------- terreno low-poly ----------
export const Terrain: React.FC<{ color: string; size?: number; h?: number; flat?: number }> = ({ color, size = 260, h = 1.6, flat = 9 }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, 90, 90);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      const n = Math.sin(x * 0.09) * Math.cos(z * 0.07) * 1.4 + Math.sin(x * 0.23 + z * 0.17) * 0.5 + (hash(i) - 0.5) * 0.25;
      const fall = r < flat ? 0 : -Math.pow((r - flat) * 0.12, 1.6);
      p.setY(i, n * h * clamp01((r - flat * 0.6) / flat) + fall);
    }
    g.computeVertexNormals();
    return g;
  }, [size, h, flat]);
  return <mesh geometry={geo} receiveShadow><meshStandardMaterial color={color} flatShading roughness={0.95} /></mesh>;
};
export const Peak: React.FC<{ pos: V3; r: number; h: number; color: string }> = ({ pos, r, h, color }) => (
  <mesh position={pos}><coneGeometry args={[r, h, 7, 1]} /><meshStandardMaterial color={color} flatShading roughness={1} /></mesh>
);

// ---------- personaje: cabeza redonda, ojos de punto, palitos ----------
export type Expr = "calm" | "smug" | "angry" | "shout" | "laugh" | "shock" | "pray" | "happy" | "tired";
export type Arm = [number, number]; // [abrir hacia el lado, levantar hacia delante] en radianes
export type PersonP = {
  pos: V3; rot?: number; s?: number; robe: string; trim?: string; t: number; seed?: number;
  expr?: Expr; armL?: Arm; armR?: Arm; beard?: string; hair?: string; hat?: string; hood?: boolean;
  jump?: number; lean?: number; talk?: boolean; hold?: React.ReactNode; holdL?: React.ReactNode; lie?: number; mouthOpen?: number;
};
const SKIN = "#F6F1E8", INK = "#17120E";
const Face: React.FC<{ expr: Expr; t: number; seed: number; talk?: boolean; mouthOpen?: number }> = ({ expr, t, seed, talk, mouthOpen }) => {
  const blink = (t * 0.37 + seed * 0.61) % 1 < 0.035;
  const closed = blink || expr === "pray" || expr === "laugh" || expr === "happy";
  const big = expr === "shock" ? 1.6 : 1;
  const bro: Record<Expr, [number, number]> = { calm: [0, 0.17], smug: [0.25, 0.19], angry: [-0.45, 0.15], shout: [-0.35, 0.16], laugh: [0.15, 0.2], shock: [0.2, 0.24], pray: [0.1, 0.17], happy: [0.15, 0.2], tired: [0.35, 0.15] };
  const [ba, by] = bro[expr];
  const talking = talk ? 0.5 + 0.5 * Math.sin(t * 22 + seed) : 0;
  const open = mouthOpen ?? (expr === "shout" ? 0.8 + 0.2 * Math.sin(t * 18 + seed) : expr === "laugh" ? 0.55 + 0.35 * Math.abs(Math.sin(t * 14 + seed)) : expr === "shock" ? 0.7 : talking * 0.6);
  return (
    <group>
      {[-1, 1].map((sd) => (
        <group key={sd}>
          {closed ? (
            <mesh position={[0.13 * sd, 0.04, 0.352]} rotation={[0, sd * 0.35, expr === "laugh" || expr === "happy" ? sd * 0.0 : 0]}>
              <torusGeometry args={[0.042, 0.011, 4, 10, Math.PI]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          ) : (
            <mesh position={[0.13 * sd, 0.04, 0.345]} scale={[big, big * (expr === "tired" ? 0.55 : 1), 0.45]}>
              <sphereGeometry args={[0.042, 12, 8]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          )}
          <mesh position={[0.13 * sd, by + (expr === "smug" && sd < 0 ? 0.04 : 0), 0.335]} rotation={[0, sd * 0.35, ba * sd * (expr === "smug" && sd > 0 ? -0.4 : 1)]}>
            <boxGeometry args={[0.12, 0.024, 0.02]} />
            <meshBasicMaterial color={INK} />
          </mesh>
        </group>
      ))}
      {open > 0.08 ? (
        <mesh position={[0, -0.13, 0.345]} scale={[1, 0.35 + open, 0.3]}>
          <sphereGeometry args={[0.07, 14, 8]} />
          <meshBasicMaterial color="#3B1712" />
        </mesh>
      ) : expr === "smug" || expr === "happy" ? (
        <mesh position={[0.02, -0.11, 0.35]} rotation={[0, 0, Math.PI + (expr === "smug" ? 0.25 : 0)]}>
          <torusGeometry args={[0.07, 0.013, 4, 12, Math.PI]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      ) : (
        <mesh position={[0, -0.13, 0.35]} rotation={[0, 0, expr === "angry" ? 0.08 : 0]}>
          <boxGeometry args={[expr === "tired" ? 0.08 : 0.11, 0.018, 0.02]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      )}
    </group>
  );
};
const ArmM: React.FC<{ sd: number; a: Arm; color: string; hold?: React.ReactNode }> = ({ sd, a, color, hold }) => (
  <group position={[0.27 * sd, 1.08, 0]} rotation={[-a[1], 0, a[0] * sd]}>
    <mesh position={[0.02 * sd, -0.27, 0]} castShadow><cylinderGeometry args={[0.06, 0.05, 0.56, 8]} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>
    <mesh position={[0.02 * sd, -0.58, 0]} castShadow><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color={SKIN} roughness={0.6} /></mesh>
    {hold ? <group position={[0.02 * sd, -0.62, 0.05]}>{hold}</group> : null}
  </group>
);
export const Person: React.FC<PersonP> = (p) => {
  const { t, s = 1, seed = 0, expr = "calm" } = p;
  const breathe = 1 + 0.012 * Math.sin(t * 2.4 + seed);
  const jumpY = (p.jump ?? 0) * Math.abs(Math.sin(t * 7 + seed)) * 0.45;
  const sway = Math.sin(t * 1.7 + seed) * 0.025 + (p.lean ?? 0);
  const armL = p.armL ?? [0.12, 0.05], armR = p.armR ?? [0.12, 0.05];
  return (
    <group position={[p.pos[0], p.pos[1] + jumpY, p.pos[2]]} rotation={[p.lie ?? 0, p.rot ?? 0, 0]} scale={s}>
      <group rotation={[sway, 0, 0]}>
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[0.1 * sd, 0.13, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.28, 6]} /><meshStandardMaterial color={INK} /></mesh>
        ))}
        <group scale={[1, breathe, 1]}>
          <mesh position={[0, 0.66, 0]} castShadow><cylinderGeometry args={[0.24, 0.4, 0.98, 14]} /><meshStandardMaterial color={p.robe} roughness={0.85} /></mesh>
          {p.trim ? <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.335, 0.335, 0.07, 14]} /><meshStandardMaterial color={p.trim} roughness={0.6} /></mesh> : null}
          {p.hood ? <mesh position={[0, 1.42, -0.06]} castShadow><sphereGeometry args={[0.47, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color={p.robe} roughness={0.9} side={THREE.DoubleSide} /></mesh> : null}
        </group>
        <ArmM sd={-1} a={armL} color={p.robe} hold={p.holdL} />
        <ArmM sd={1} a={armR} color={p.robe} hold={p.hold} />
        <group position={[0, 1.5, 0]}>
          <mesh castShadow><sphereGeometry args={[0.38, 24, 18]} /><meshStandardMaterial color={SKIN} roughness={0.55} /></mesh>
          <Face expr={expr} t={t} seed={seed} talk={p.talk} mouthOpen={p.mouthOpen} />
          {p.beard ? <mesh position={[0, -0.2, 0.12]} scale={[1, 1.15, 0.75]}><sphereGeometry args={[0.27, 14, 10, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} /><meshStandardMaterial color={p.beard} roughness={0.95} /></mesh> : null}
          {p.hair ? <mesh position={[0, 0.06, -0.03]} scale={[1.04, 1, 1.04]}><sphereGeometry args={[0.38, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.42]} /><meshStandardMaterial color={p.hair} roughness={0.9} /></mesh> : null}
          {p.hat ? <mesh position={[0, 0.48, 0]}><coneGeometry args={[0.26, 0.55, 12]} /><meshStandardMaterial color={p.hat} roughness={0.6} metalness={0.2} /></mesh> : null}
        </group>
      </group>
    </group>
  );
};

// ---------- utilería ----------
export const Jar: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#B85C33" }) => {
  const geo = useMemo(() => {
    const pts = [[0, 0], [0.12, 0], [0.2, 0.08], [0.24, 0.22], [0.2, 0.36], [0.1, 0.44], [0.08, 0.52], [0.11, 0.55]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 16);
  }, []);
  return (
    <group scale={s}>
      <mesh geometry={geo} castShadow><meshStandardMaterial color={color} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.25, 0]}><torusGeometry args={[0.235, 0.012, 4, 20]} /><meshStandardMaterial color="#7A3418" /></mesh>
    </group>
  );
};
// llamas: conos emisivos que tiemblan + brillo aditivo + luz
export const Fire: React.FC<{ pos: V3; s: number; t: number; o?: number; light?: number }> = ({ pos, s, t, o = 1, light = 1 }) => {
  if (o <= 0.01) return null;
  return (
    <group position={pos} scale={s * (0.85 + 0.15 * o)}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + i;
        const r = i === 0 ? 0 : 0.28 + hash(i) * 0.18;
        const h = (i === 0 ? 1.5 : 0.7 + hash(i + 9) * 0.6) * (0.8 + 0.3 * Math.sin(t * (9 + i) + i * 2)) * o;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
            <mesh position={[0, h / 2, 0]} scale={[1, h, 1]}><coneGeometry args={[0.22, 1, 7]} /><meshBasicMaterial color={i % 3 === 0 ? "#FFE48A" : "#FF8A1E"} transparent opacity={0.92 * o} /></mesh>
          </group>
        );
      })}
      <Glow pos={[0, 0.8, 0]} s={4.2} color="#FF9A3C" o={0.75 * o} />
      <Glow pos={[0, 0.5, 0]} s={2.2} color="#FFF0B0" o={0.8 * o} />
      <pointLight position={[0, 1.2, 0]} color="#FF8C32" intensity={40 * o * light} distance={14} decay={2} />
    </group>
  );
};
// brasas / chispas que suben
export const Embers: React.FC<{ pos: V3; t: number; n?: number; o?: number; spread?: number; color?: string; speed?: number }> = ({ pos, t, n = 40, o = 1, spread = 1, color = "#FFB347", speed = 1 }) => (
  <group position={pos}>
    {Array.from({ length: n }, (_, i) => {
      const life = (t * 0.6 * speed + hash(i)) % 1;
      const x = (hash(i + 3) - 0.5) * spread + Math.sin(t * 2 + i) * 0.15 * life;
      const z = (hash(i + 7) - 0.5) * spread;
      return <mesh key={i} position={[x, life * 3.2, z]}><sphereGeometry args={[0.035 * (1 - life), 5, 4]} /><meshBasicMaterial color={color} transparent opacity={o * (1 - life)} /></mesh>;
    })}
  </group>
);
// lluvia: segmentos que caen alrededor de un punto
export const Rain: React.FC<{ center: V3; t: number; o: number; n?: number; r?: number }> = ({ center, t, o, n = 1600, r = 14 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  if (o <= 0.01) return null;
  const arr = new Float32Array(n * 6);
  for (let i = 0; i < n; i++) {
    const x = center[0] + (hash(i) - 0.5) * r * 2, z = center[2] + (hash(i + 1e3) - 0.5) * r * 2;
    const y = center[1] + 14 - (((t * 18 + hash(i + 2e3) * 20) % 20));
    arr.set([x, y, z, x - 0.05, y - 0.55, z], i * 6);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return <lineSegments geometry={geo}><lineBasicMaterial color="#CFE3FF" transparent opacity={0.55 * o} /></lineSegments>;
};
// nubes: racimos de esferas
export const Cloud: React.FC<{ pos: V3; s: number; color: string; o?: number; seed?: number }> = ({ pos, s, color, o = 1, seed = 0 }) => (
  <group position={pos} scale={s}>
    {Array.from({ length: 7 }, (_, i) => (
      <mesh key={i} position={[(i - 3) * 0.9 + hash(i + seed) * 0.4, Math.sin(i * 1.3 + seed) * 0.35, hash(i + seed + 4) * 0.8]}>
        <sphereGeometry args={[0.8 + hash(i + seed + 2) * 0.6, 12, 10]} />
        <meshStandardMaterial color={color} roughness={1} transparent opacity={o} flatShading />
      </mesh>
    ))}
  </group>
);
export const Rock: React.FC<{ pos: V3; s: number; color: string; seed?: number; rot?: number }> = ({ pos, s, color, seed = 0, rot = 0 }) => (
  <mesh position={pos} rotation={[hash(seed) * 0.5, rot + hash(seed + 1) * 3, hash(seed + 2) * 0.4]} scale={[s * (0.9 + hash(seed + 3) * 0.4), s * 0.7, s]} castShadow receiveShadow>
    <dodecahedronGeometry args={[0.5, 0]} />
    <meshStandardMaterial color={color} flatShading roughness={0.95} />
  </mesh>
);
