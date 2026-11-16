import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Prueba de estilo "toon" (referencia: caricatura 3D con contorno negro, luz cálida, cara de trazos grises).
// Contorno por casco invertido (copia negra un poco más grande, caras traseras).
const OUT = "#2A1A12";
const Outlined: React.FC<{ children: React.ReactElement<{ children?: React.ReactNode }>; w?: number; pos?: [number, number, number]; rot?: [number, number, number]; scale?: [number, number, number] }> = ({ children, w = 0.035, pos, rot, scale }) => {
  const geo = React.Children.toArray(children.props.children).find((c) => React.isValidElement(c) && typeof c.type === "string" && (c.type as string).endsWith("Geometry"));
  return (
    <group position={pos} rotation={rot} scale={scale}>
      {children}
      <mesh scale={[1 + w, 1 + w, 1 + w]}>{geo}<meshBasicMaterial color={OUT} side={THREE.BackSide} /></mesh>
    </group>
  );
};
const M: React.FC<{ c: string; r?: number }> = ({ c, r = 0.75 }) => <meshStandardMaterial color={c} roughness={r} />;

const Cam: React.FC<{ t: number }> = ({ t }) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(0.35 + t * 0.02, 1.15, 4.9 - t * 0.04);
  cam.fov = 42;
  cam.updateProjectionMatrix();
  cam.lookAt(0.1, 1.85, 0);
  return null;
};
const Plates: React.FC<{ x: number; z: number; n: number; stripe: string }> = ({ x, z, n, stripe }) => (
  <group position={[x, 0.95, z]}>
    {Array.from({ length: n }, (_, i) => (
      <group key={i} position={[Math.sin(i * 1.7) * 0.012, i * 0.045, 0]}>
        <Outlined w={0.02}><mesh><cylinderGeometry args={[0.32, 0.27, 0.035, 28]} /><M c="#F4EEDF" /></mesh></Outlined>
        {i % 3 === 0 ? <mesh position={[0, 0.019, 0]}><torusGeometry args={[0.29, 0.012, 6, 28]} /><meshStandardMaterial color={stripe} /></mesh> : null}
      </group>
    ))}
  </group>
);
const Face: React.FC<{ t: number }> = ({ t }) => {
  const g = "#6A6A6A";
  return (
    <group position={[0, 0, 0.47]}>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0.16 * sd, 0.06, 0.02]} rotation={[0, sd * 0.3, 0]}><torusGeometry args={[0.075, 0.016, 6, 16, Math.PI]} /><meshBasicMaterial color={g} /></mesh>)}
      {[-1, 1].map((sd) => <mesh key={`b${sd}`} position={[0.16 * sd, 0.2, 0.0]} rotation={[0, sd * 0.3, sd * -0.08]}><boxGeometry args={[0.16, 0.025, 0.01]} /><meshBasicMaterial color={g} /></mesh>)}
      <mesh position={[0, -0.12, 0.03]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.1, 0.014, 6, 18, Math.PI * (0.85 + 0.05 * Math.sin(t * 3))]} /><meshBasicMaterial color={g} /></mesh>
    </group>
  );
};
const Guy: React.FC<{ t: number }> = ({ t }) => (
  <group position={[0.45, 1.05, 0.15]} rotation={[0, -0.25, 0]}>
    <group position={[0, 0.62 + Math.sin(t * 2.4) * 0.01, 0]}>
      <Outlined w={0.025}><mesh><sphereGeometry args={[0.5, 40, 30]} /><M c="#F7F5F0" r={0.55} /></mesh></Outlined>
      <Face t={t} />
      <Outlined w={0.03} pos={[0, 0.14, -0.02]}><mesh><sphereGeometry args={[0.53, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.36]} /><M c="#3A2418" r={0.6} /></mesh></Outlined>
      {[-1, 1].map((sd) => <Outlined key={sd} w={0.05} pos={[0.33 * sd, 0.33, 0.05]} rot={[0.2, 0, sd * -0.5]}><mesh><coneGeometry args={[0.1, 0.18, 12]} /><M c="#F7F5F0" /></mesh></Outlined>)}
    </group>
    <Outlined w={0.03}><mesh><sphereGeometry args={[0.36, 30, 20]} /><M c="#F7F5F0" r={0.6} /></mesh></Outlined>
    <Outlined w={0.04} pos={[-0.32, 0.05, 0.25]} rot={[0, 0, Math.sin(t * 6) * 0.15]}><mesh><cylinderGeometry args={[0.21, 0.21, 0.03, 26]} /><M c="#F4EEDF" /></mesh></Outlined>
  </group>
);

const Scene: React.FC<{ t: number }> = ({ t }) => {
  const signTex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 400;
    const g = c.getContext("2d")!;
    g.fillStyle = "#F2C230"; g.fillRect(0, 0, 1024, 400);
    g.fillStyle = "#D7261E"; g.font = "900 230px Arial Black, Arial"; g.textAlign = "center"; g.textBaseline = "middle";
    g.save(); g.translate(512, 210); g.scale(1, 0.95); g.fillText("POSADA", 0, 0); g.restore();
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx;
  }, []);
  return (
    <>
      <Cam t={t} />
      <ambientLight intensity={0.55} color="#FFE7C2" />
      <hemisphereLight args={["#FFF1D6", "#7A5A3A", 0.6]} />
      <directionalLight position={[-3, 5, 4]} intensity={2.2} color="#FFE2A8" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0004} />
      <pointLight position={[0.6, 2.3, 1.2]} intensity={6} distance={6} color="#FFD27A" />
      {/* pared y piso */}
      <mesh position={[0, 2, -0.9]} receiveShadow><planeGeometry args={[8, 6]} /><M c="#EAD9A6" r={0.95} /></mesh>
      <mesh position={[0, 3.9, -0.89]}><planeGeometry args={[8, 0.12]} /><M c="#D8A24A" /></mesh>
      {/* cartel */}
      <Outlined w={0.02} pos={[0.55, 2.95, -0.7]}><mesh><boxGeometry args={[2.2, 0.85, 0.1]} /><meshStandardMaterial color="#F2C230" roughness={0.6} /></mesh></Outlined>
      <mesh position={[0.55, 2.95, -0.64]}><planeGeometry args={[2.1, 0.78]} /><meshStandardMaterial map={signTex} roughness={0.6} /></mesh>
      {/* estante con platos */}
      <Outlined w={0.02} pos={[0.6, 2.1, -0.55]}><mesh castShadow receiveShadow><boxGeometry args={[2.6, 0.08, 0.5]} /><M c="#B8642A" /></mesh></Outlined>
      {Array.from({ length: 6 }, (_, i) => <Outlined key={i} w={0.03} pos={[-0.4 + i * 0.36, 2.3, -0.55]} rot={[0.15, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.17, 0.17, 0.05, 24]} /><M c="#F4EEDF" /></mesh></Outlined>)}
      {/* azulejo blanco detrás */}
      <Outlined w={0.01} pos={[-0.2, 1.45, -0.6]}><mesh receiveShadow><boxGeometry args={[1.1, 0.75, 0.05]} /><M c="#F6F3EC" /></mesh></Outlined>
      {/* barra roja y mostrador */}
      <Outlined w={0.01} pos={[0, 1.0, -0.3]}><mesh receiveShadow><boxGeometry args={[5, 0.35, 0.4]} /><M c="#E0331F" r={0.5} /></mesh></Outlined>
      <Outlined w={0.01} pos={[0, 0.7, 0.7]}><mesh receiveShadow castShadow><boxGeometry args={[5, 0.2, 1.4]} /><M c="#EFE7D6" /></mesh></Outlined>
      <Outlined w={0.05} pos={[-0.25, 1.22, -0.1]}><mesh castShadow><boxGeometry args={[0.28, 0.12, 0.18]} /><M c="#E8D140" /></mesh></Outlined>
      <mesh position={[-0.25, 1.3, -0.1]}><boxGeometry args={[0.28, 0.04, 0.18]} /><M c="#2BA84A" /></mesh>
      {/* pilas de platos */}
      <Plates x={-1.0} z={0.2} n={22} stripe="#E4844A" />
      <Plates x={-1.15} z={-0.15} n={30} stripe="#6FA9D8" />
      <Plates x={1.45} z={0.1} n={26} stripe="#4BB06A" />
      <Guy t={t} />
    </>
  );
};

export const ToonTest: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.06) saturate(1.12) brightness(1.04)" }}>
        <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true }} camera={{ fov: 42 }}>
          <Scene t={t} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,20,0,0.45) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={Math.floor(random(`g${f}`) * 100)} /></filter>
        <rect width={1080} height={1920} filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};
