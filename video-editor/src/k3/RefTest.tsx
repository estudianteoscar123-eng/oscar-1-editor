import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Opción 2 · recreación del fotograma de referencia (restaurante, segundo 41) con 3D en tiempo real + efectos de cine.
const OUT = "#2B160C";
type GProps = { pos?: [number, number, number]; rot?: [number, number, number]; scl?: [number, number, number] };
// contorno por casco invertido: la misma geometría, un poco más grande, caras traseras en marrón oscuro
const Ol: React.FC<GProps & { geo: React.ReactElement; color: string; w?: number; rough?: number; shadow?: boolean; glow?: number }> = ({ geo, color, w = 0.025, rough = 0.62, pos, rot, scl, shadow = true, glow = 0.18 }) => (
  <group position={pos} rotation={rot} scale={scl}>
    <mesh castShadow={shadow} receiveShadow>{geo}<meshStandardMaterial color={color} roughness={rough} emissive={color} emissiveIntensity={glow} /></mesh>
    <mesh scale={1 + w}>{geo}<meshBasicMaterial color={OUT} side={THREE.BackSide} /></mesh>
  </group>
);
const Box = (w: number, h: number, d: number) => <boxGeometry args={[w, h, d]} />;
const Cyl = (r1: number, r2: number, h: number, s = 36) => <cylinderGeometry args={[r1, r2, h, s]} />;

const Plate: React.FC<{ y: number; x: number; stripe?: string }> = ({ y, x, stripe }) => (
  <group position={[x, y, 0]} rotation={[Math.sin(y * 13) * 0.03, 0, Math.cos(y * 11) * 0.03]}>
    <Ol geo={Cyl(0.36, 0.3, 0.045)} color="#F6F0E2" w={0.03} rough={0.35} glow={0.55} />
    {stripe ? <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.362, 0.36, 0.014, 36, 1, true]} /><meshStandardMaterial color={stripe} roughness={0.4} side={THREE.DoubleSide} /></mesh> : null}
  </group>
);
const Stack: React.FC<{ p: [number, number, number]; n: number; stripes: string[] }> = ({ p, n, stripes }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => <Plate key={i} y={i * 0.052} x={Math.sin(i * 2.1) * 0.012} stripe={i % 2 === 0 ? stripes[(i / 2) % stripes.length | 0] : undefined} />)}
  </group>
);
const signTexture = () => {
  const c = document.createElement("canvas"); c.width = 1400; c.height = 560;
  const g = c.getContext("2d")!;
  g.fillStyle = "#F4C52A"; g.fillRect(0, 0, 1400, 560);
  const grd = g.createLinearGradient(0, 0, 0, 560); grd.addColorStop(0, "rgba(255,255,255,0.18)"); grd.addColorStop(1, "rgba(120,60,0,0.18)"); g.fillStyle = grd; g.fillRect(0, 0, 1400, 560);
  g.font = "900 300px 'Arial Black', Arial"; g.textAlign = "center"; g.textBaseline = "middle";
  g.save(); g.translate(700, 300); g.transform(1, 0, -0.12, 1, 0, 0);
  g.fillStyle = "#7A1408"; g.fillText("POSADA", 10, 14);
  g.fillStyle = "#E1261A"; g.fillText("POSADA", 0, 0); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const tileTexture = () => {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#F7F4EC"; g.fillRect(0, 0, 512, 512);
  for (let i = 1; i < 5; i++) { g.fillStyle = "#9C9184"; g.fillRect(i * 102 - 3, 0, 6, 512); g.fillStyle = "#FFFFFF"; g.fillRect(i * 102 + 3, 0, 4, 512); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

const Face: React.FC = () => {
  const g = "#6E6A66";
  return (
    <group position={[0, 0, 0.5]}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.19 * sd, 0.05, 0.02]} rotation={[0, sd * 0.32, 0]}><torusGeometry args={[0.095, 0.02, 8, 24, Math.PI]} /><meshBasicMaterial color={g} /></mesh>)}
      {[-1, 1].map((sd) => <mesh key={`b${sd}`} position={[0.19 * sd, 0.24, -0.01]} rotation={[0, sd * 0.32, Math.PI / 2 + sd * -0.12]}><capsuleGeometry args={[0.018, 0.17, 4, 8]} /><meshBasicMaterial color={g} /></mesh>)}
      <group position={[0.02, -0.17, 0.02]} rotation={[0, 0, Math.PI]}><mesh><torusGeometry args={[0.13, 0.017, 8, 24, Math.PI * 0.8]} /><meshBasicMaterial color={g} /></mesh></group>
    </group>
  );
};
const Guy: React.FC<{ t: number }> = ({ t }) => (
  <group position={[0.55, 1.12, 0.3]} rotation={[0, -0.32, 0]}>
    <Ol geo={<sphereGeometry args={[0.4, 48, 32]} />} color="#F8F6F1" pos={[0, 0, 0]} rough={0.5} />
    <group position={[0, 0.74 + Math.sin(t * 2.2) * 0.008, 0]}>
      <Ol geo={<sphereGeometry args={[0.55, 64, 48]} />} color="#F8F6F1" scl={[1, 0.97, 1]} rough={0.48} w={0.02} />
      <Face />
      {/* pelo: casquete oscuro con borde irregular y dos mechones claros */}
      <Ol geo={<sphereGeometry args={[0.575, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} color="#2E1A10" pos={[0, 0.02, -0.01]} rough={0.7} w={0.03} />
      {[-1, 1].map((sd) => <Ol key={sd} geo={<coneGeometry args={[0.12, 0.26, 16]} />} color="#F3EFE6" pos={[0.4 * sd, 0.36, 0.02]} rot={[0.1, 0, sd * -0.75]} w={0.06} />)}
    </group>
    {/* mano con plato pequeño */}
    <Ol geo={<sphereGeometry args={[0.09, 24, 16]} />} color="#F8F6F1" pos={[-0.42, 0.62, 0.32]} />
    <Ol geo={Cyl(0.2, 0.2, 0.03)} color="#F6F0E2" pos={[-0.32, 0.7, 0.38]} rot={[1.35, 0, 0.3]} w={0.05} />
  </group>
);

const Scene: React.FC<{ t: number }> = ({ t }) => {
  const sign = useMemo(signTexture, []);
  const tile = useMemo(tileTexture, []);
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(-0.25 + t * 0.01, 0.95, 4.7 - t * 0.03);
  cam.fov = 50; cam.near = 0.05; cam.far = 50;
  cam.lookAt(0.62, 2.18, -0.6);
  cam.rotateZ(-0.13);
  cam.updateProjectionMatrix();
  return (
    <>
      <color attach="background" args={["#E8D49A"]} />
      <hemisphereLight args={["#FFF0CF", "#8A5A2C", 0.75]} />
      <directionalLight position={[-3.2, 5.5, 2.2]} intensity={2.6} color="#FFD98F" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={8} shadow-bias={-0.0003}>
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 20]} />
      </directionalLight>
      <pointLight position={[0.9, 2.9, 0.9]} intensity={7} distance={7} color="#FFC870" />
      <pointLight position={[-1.5, 1.4, 2.2]} intensity={2.5} distance={6} color="#FFE7C0" />
      {/* pared, franja alta */}
      <mesh position={[0, 2.4, -1.25]} receiveShadow><planeGeometry args={[10, 7]} /><meshStandardMaterial color="#EAD69C" roughness={0.95} /></mesh>
      <Ol geo={Box(10, 0.16, 0.06)} color="#D99A3A" pos={[0, 4.55, -1.2]} />
      {/* cartel */}
      <Ol geo={<boxGeometry args={[2.9, 1.2, 0.14]} />} color="#F4C52A" pos={[1.15, 3.45, -1.1]} rough={0.45} w={0.015} />
      <mesh position={[1.15, 3.45, -1.025]}><planeGeometry args={[2.78, 1.1]} /><meshStandardMaterial map={sign} roughness={0.45} /></mesh>
      {/* estante y platos de pie */}
      <Ol geo={Box(3.6, 0.1, 0.6)} color="#D2701F" pos={[0.95, 2.48, -0.92]} rough={0.55} w={0.012} />
      <Ol geo={Box(3.6, 0.06, 0.6)} color="#5A2210" pos={[0.95, 2.41, -0.92]} rough={0.8} w={0.012} shadow={false} />
      {Array.from({ length: 8 }, (_, i) => <Ol key={i} geo={Cyl(0.2, 0.2, 0.05, 32)} color="#F6F0E2" pos={[-0.25 + i * 0.36, 2.72, -0.95]} rot={[Math.PI / 2 - 0.15, 0, 0]} w={0.03} rough={0.35} />)}
      {/* azulejo con ranuras */}
      <Ol geo={Box(1.2, 0.95, 0.06)} color="#F7F4EC" pos={[-0.05, 1.82, -1.05]} rough={0.3} w={0.012} />
      <mesh position={[-0.05, 1.82, -1.015]}><planeGeometry args={[1.18, 0.93]} /><meshStandardMaterial map={tile} roughness={0.3} /></mesh>
      {/* barra roja + esponja */}
      <Ol geo={Box(6, 0.5, 0.4)} color="#E2321C" pos={[0, 1.18, -0.7]} rough={0.4} w={0.01} />
      <Ol geo={Box(0.34, 0.14, 0.22)} color="#EFD13B" pos={[-0.2, 1.5, -0.6]} w={0.05} />
      <Ol geo={Box(0.34, 0.05, 0.22)} color="#2FA84C" pos={[-0.2, 1.6, -0.6]} w={0.05} />
      {/* fregadero en primer plano */}
      <Ol geo={Box(6, 0.18, 1.6)} color="#F2EBDD" pos={[0, 0.8, 0.95]} rough={0.35} w={0.008} />
      
      {/* pilas de platos */}
      <Stack p={[-1.0, 0.97, 0.75]} n={34} stripes={["#E58A4E", "#6FA9D8"]} />
      <Stack p={[-0.75, 0.97, 0.05]} n={40} stripes={["#7AB2DE", "#E58A4E"]} />
      <Stack p={[1.55, 0.97, 0.55]} n={48} stripes={["#5DB873", "#7AB2DE"]} />
      <Guy t={t} />
    </>
  );
};

export const RefTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.1) saturate(1.15) brightness(1.06) sepia(0.08)" }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
          <Scene t={f / 30} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 52% 44%, rgba(255,220,150,0.10) 0%, rgba(0,0,0,0) 55%, rgba(35,15,0,0.62) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={f % 7} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};
