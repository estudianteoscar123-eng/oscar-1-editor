import React, { useMemo } from "react";
import { AbsoluteFill, continueRender, delayRender, random, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Opción 2 · personaje del trono (referencia NVIDIA, s 1,9): cabeza blanca con cara dibujada, corona, cuerpo de frijol, palitos.
const OUT = "#121214";
const texCache: Record<string, THREE.Texture> = {};
const useTex = (file: string) => {
  const [tex, setTex] = React.useState<THREE.Texture | null>(texCache[file] ?? null);
  React.useEffect(() => {
    if (texCache[file]) return;
    const h = delayRender(file);
    new THREE.TextureLoader().load(staticFile(file), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache[file] = t; setTex(t); setTimeout(() => continueRender(h), 400); }, undefined, () => continueRender(h));
  }, [file]);
  return tex;
};
const Ol: React.FC<{ geo: React.ReactElement; color: string; w?: number; rough?: number; glow?: number; pos?: [number, number, number]; rot?: [number, number, number]; scl?: [number, number, number] | number; metal?: number; emissive?: string; ei?: number }> = ({ geo, color, w = 0.03, rough = 0.55, glow = 0.12, pos, rot, scl, metal = 0, emissive, ei }) => (
  <group position={pos} rotation={rot} scale={scl}>
    <mesh castShadow receiveShadow>{geo}<meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? color} emissiveIntensity={ei ?? glow} /></mesh>
    {w > 0 ? <mesh scale={1 + w}>{geo}<meshBasicMaterial color={OUT} side={THREE.BackSide} /></mesh> : null}
  </group>
);
const Bx = (w: number, h: number, d: number) => <boxGeometry args={[w, h, d]} />;
// cuerpo de frijol (perfil torneado)
const beanGeo = () => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) { const a = i / 24; const y = a * 1.0; const r = Math.sqrt(Math.max(0, 1 - Math.pow((a - 0.42) / 0.58, 2))) * (0.4 - a * 0.12) + 0.02; pts.push(new THREE.Vector2(Math.max(0.001, r), y)); }
  pts[0].x = 0.001;
  return new THREE.LatheGeometry(pts, 48);
};
const Fan: React.FC<{ pos: [number, number, number]; t: number; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={s}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.04, 40]} /><meshStandardMaterial color="#23302A" roughness={0.6} /></mesh>
    <mesh position={[0, 0, 0.022]}><ringGeometry args={[0.34, 0.37, 48]} /><meshBasicMaterial color={OUT} /></mesh>
    <mesh position={[0, 0, 0.024]}><ringGeometry args={[0.13, 0.21, 40]} /><meshStandardMaterial color="#2E4A16" emissive="#2E4A16" emissiveIntensity={0.4} /></mesh>
    <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.13, 40]} /><meshStandardMaterial color="#86D81A" emissive="#6CC000" emissiveIntensity={0.55} /></mesh>
  </group>
);
const Tier: React.FC<{ y: number; z: number; w: number; t: number }> = ({ y, z, w, t }) => (
  <group position={[0, y, z]}>
    <Ol geo={Bx(w, 0.9, 0.5)} color="#2B3134" rough={0.6} w={0.008} />
    <Ol geo={Bx(w + 0.02, 0.07, 0.52)} color="#F2F2F0" pos={[0, 0.47, 0]} w={0.01} glow={0.5} />
    <mesh position={[0, 0.33, 0.26]}><boxGeometry args={[w * 0.92, 0.06, 0.01]} /><meshStandardMaterial color="#C8F000" emissive="#B8E600" emissiveIntensity={0.9} /></mesh>
    {[-1, 0, 1].map((k) => <Fan key={k} t={t} pos={[k * (w / 3.2), -0.07, 0.26]} />)}
  </group>
);
const Face: React.FC = () => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 1024; const g = c.getContext("2d")!;
    const K = "#141418", G = "#96969C";
    g.lineJoin = "round"; g.lineCap = "round";
    const rr = (x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
    for (const cx of [372, 652]) {
      const x0 = cx - 110, y0 = 330, w = 220, h = 140;
      g.fillStyle = G; g.fillRect(x0 + 8, y0 + 8, w - 16, 60);
      g.strokeStyle = K; g.lineWidth = 10; g.beginPath(); g.moveTo(x0 + 8, y0 + 68); g.lineTo(x0 + w - 8, y0 + 68); g.stroke();
      g.fillStyle = K; g.beginPath(); g.ellipse(cx, y0 + 82, 26, 19, 0, 0, Math.PI * 2); g.fill();
      g.lineWidth = 12; rr(x0, y0, w, h, 14); g.stroke();
    }
    g.lineWidth = 12; g.beginPath(); g.moveTo(482, 395); g.lineTo(542, 395); g.moveTo(140, 392); g.lineTo(262, 400); g.moveTo(762, 400); g.lineTo(884, 392); g.stroke();
    g.fillStyle = "#FFFFFF"; rr(330, 580, 364, 160, 40); g.fill(); g.lineWidth = 16; g.stroke();
    g.lineWidth = 10; g.beginPath(); for (let i = 1; i < 5; i++) { const x = 330 + i * 364 / 5; g.moveTo(x, 586); g.lineTo(x, 734); } g.moveTo(338, 660); g.lineTo(686, 660); g.stroke();
    g.strokeStyle = G; g.lineWidth = 10; g.beginPath(); g.arc(230, 580, 60, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }, []);
  // casquete frontal de la esfera: la textura se envuelve sobre la cara
  return <mesh><sphereGeometry args={[0.553, 64, 64, Math.PI / 2 - 0.85, 1.7, Math.PI / 2 - 0.85, 1.7]} /><meshStandardMaterial map={tex} transparent roughness={0.5} depthWrite={false} polygonOffset polygonOffsetFactor={-2} /></mesh>;
};
const Crown: React.FC = () => {
  const em = useTex("toon/emblem.png");
  const gold = "#E9B820";
  return (
    <group position={[0, 0.5, 0.05]} rotation={[-0.25, 0, 0.06]} scale={0.92}>
      <Ol geo={<cylinderGeometry args={[0.34, 0.31, 0.16, 40, 1, true]} />} color={gold} metal={0.35} rough={0.35} glow={0.25} w={0.04} />
      {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2; const h = i % 2 ? 0.2 : 0.28; return <group key={i} position={[Math.sin(a) * 0.33, 0.08 + h / 2, Math.cos(a) * 0.33]}><Ol geo={<coneGeometry args={[0.07, h, 12]} />} color={gold} metal={0.35} rough={0.35} glow={0.25} w={0.06} /><Ol geo={<sphereGeometry args={[0.035, 12, 10]} />} color={gold} pos={[0, h / 2 + 0.02, 0]} metal={0.35} w={0.1} /></group>; })}
      {em ? <mesh position={[0, 0, 0.345]}><planeGeometry args={[0.24, 0.12]} /><meshStandardMaterial map={em} /></mesh> : null}
    </group>
  );
};
const Limb: React.FC<{ a: THREE.Vector3; b: THREE.Vector3; r?: number }> = ({ a, b, r = 0.024 }) => {
  const mid = a.clone().add(b).multiplyScalar(0.5); const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return <group position={mid.toArray()} quaternion={q}><Ol geo={<capsuleGeometry args={[r, len, 6, 12]} />} color="#141416" w={0.12} glow={0} /></group>;
};
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const Ceo: React.FC<{ t: number }> = ({ t }) => {
  const bean = useMemo(beanGeo, []);
  const br = Math.sin(t * 2) * 0.008;
  return (
    <group position={[0, 1.02, 0.35]}>
      {/* piernas colgando del asiento */}
      {[-1, 1].map((sd) => <group key={sd}><Limb a={V(0.13 * sd, 0.08, 0.15)} b={V(0.15 * sd, 0.0, 0.62)} r={0.026} /><Limb a={V(0.15 * sd, 0.0, 0.62)} b={V(0.17 * sd, -0.86, 0.66)} r={0.026} />
      <Ol geo={<sphereGeometry args={[0.09, 20, 14]} />} color="#141416" pos={[0.17 * sd, -0.9, 0.72]} scl={[1, 0.7, 1.5]} w={0.1} glow={0} /></group>)}
      {/* cuerpo: chaqueta negra */}
      <group position={[0, -0.02 + br, 0]}>
        <mesh castShadow geometry={bean} scale={[0.86, 1, 0.86]}><meshStandardMaterial color="#2A2A2F" roughness={0.88} emissive="#2A2A2F" emissiveIntensity={0.2} /></mesh>
        <mesh geometry={bean} scale={[0.882, 1.02, 0.882]}><meshBasicMaterial color={OUT} side={THREE.BackSide} /></mesh>
        {[-0.03, 0.03].map((x) => <mesh key={x} position={[x, 0.5, 0.425]} rotation={[-0.12, 0, 0]}><boxGeometry args={[0.012, 0.62, 0.01]} /><meshBasicMaterial color="#E8E8E8" /></mesh>)}
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2, 0.42, 0.38]} rotation={[0, sd * 0.45, sd * 0.25]}><boxGeometry args={[0.13, 0.012, 0.01]} /><meshBasicMaterial color="#E8E8E8" /></mesh>)}
        <Ol geo={<torusGeometry args={[0.13, 0.05, 12, 24]} />} color="#26262A" pos={[0, 0.94, 0]} rot={[Math.PI / 2, 0, 0]} w={0.06} />
      </group>
      {/* brazos: izquierdo a la barbilla, derecho apoyado */}
      <Limb a={V(-0.3, 0.72, 0.1)} b={V(-0.32, 0.55, 0.42)} /><Limb a={V(-0.32, 0.55, 0.42)} b={V(-0.1, 0.98, 0.48)} />
      <Ol geo={<sphereGeometry args={[0.1, 20, 16]} />} color="#141416" pos={[-0.08, 1.02, 0.5]} w={0.08} glow={0} />
      <Limb a={V(0.3, 0.72, 0.1)} b={V(0.62, 0.42, 0.25)} /><Limb a={V(0.62, 0.42, 0.25)} b={V(0.82, 0.5, 0.3)} />
      <Ol geo={<sphereGeometry args={[0.1, 20, 16]} />} color="#141416" pos={[0.86, 0.52, 0.3]} w={0.08} glow={0} />
      {/* cabeza */}
      <group position={[0, 1.55 + br, 0.02]} rotation={[0.05, -0.06, 0.04]}>
        <Ol geo={<sphereGeometry args={[0.55, 64, 48]} />} color="#FBFBFB" rough={0.6} glow={0.22} w={0.022} scl={[1.04, 1.04, 1]} />
        <Face />
        <Ol geo={<sphereGeometry args={[0.565, 48, 20, 0, Math.PI * 2, 0, 0.62]} />} color="#C9CACF" rough={0.6} pos={[0, 0.02, -0.03]} w={0.02} />
        <mesh position={[0, 0.5, 0.2]} rotation={[0.45, 0, 0]}><boxGeometry args={[0.012, 0.012, 0.42]} /><meshBasicMaterial color={OUT} /></mesh>
        <Crown />
      </group>
    </group>
  );
};
const Scene: React.FC<{ t: number }> = ({ t }) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(0.05, 2.05, 5.7); cam.fov = 38; cam.near = 0.05; cam.far = 60;
  cam.lookAt(0.05, 1.82, 0); cam.updateProjectionMatrix();
  return (
    <>
      <color attach="background" args={["#262C45"]} />
      <hemisphereLight args={["#DDE6FF", "#2A3A1A", 0.7]} />
      <directionalLight position={[-2.5, 4, 5]} intensity={2.2} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={8} shadow-bias={-0.0004} />
      <directionalLight position={[3, 3, -2]} intensity={1.2} color="#B8C8FF" />
      {/* pared azul y marco amarillo */}
      <mesh position={[0, 3, -1.6]}><planeGeometry args={[12, 8]} /><meshStandardMaterial color="#2E3658" roughness={0.9} /></mesh>
      <Ol geo={Bx(0.2, 2.4, 0.2)} color="#D9A62A" pos={[2.05, 1.8, -1.4]} w={0.03} />
      <Ol geo={Bx(1.1, 0.2, 0.2)} color="#D9A62A" pos={[2.55, 3.0, -1.4]} w={0.03} />
      {/* trono escalonado */}
      <Tier y={3.25} z={-1.25} w={2.6} t={t} /><Tier y={2.3} z={-1.0} w={2.9} t={t} /><Tier y={1.35} z={-0.75} w={3.1} t={t} />
      <Ol geo={Bx(2.0, 0.55, 1.3)} color="#2B3134" pos={[0, 0.72, 0]} w={0.01} />
      <mesh position={[0, 0.85, 0.66]}><boxGeometry args={[1.85, 0.08, 0.01]} /><meshStandardMaterial color="#C8F000" emissive="#B8E600" emissiveIntensity={0.9} /></mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 1.25, 0.95, 0.15]}><Ol geo={Bx(0.55, 1.0, 1.6)} color="#2B3134" w={0.01} /><Ol geo={Bx(0.57, 0.08, 1.62)} color="#F2F2F0" pos={[0, 0.52, 0]} w={0.01} glow={0.5} /><mesh position={[0, 0.25, 0.81]}><boxGeometry args={[0.5, 0.07, 0.01]} /><meshStandardMaterial color="#C8F000" emissive="#B8E600" emissiveIntensity={0.9} /></mesh><Fan t={t} pos={[0, -0.12, 0.81]} s={0.8} /></group>)}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#2E7A2A" roughness={0.9} /></mesh>
      <Ol geo={Bx(2.2, 0.45, 1.5)} color="#2B3134" pos={[0, 0.23, 0.1]} w={0.01} />
      <Ceo t={t} />
    </>
  );
};
export const KingTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.05) saturate(1.1) brightness(1.05)" }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
          <Scene t={f / 30} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 66% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,10,0.55) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={Math.floor(random(`g${f}`) * 50)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};
