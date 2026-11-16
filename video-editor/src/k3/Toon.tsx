import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Kit 3D "toon" (opción 2): contorno marrón por casco invertido, materiales suaves con brillo propio,
// personajes de cabeza blanca con caras de trazos, carteles con texto, utilería bíblica.
export type V3 = [number, number, number];
export const OUT = "#2B160C";
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ip = (v: number, a: number, b: number, o0 = 0, o1 = 1) => o0 + (o1 - o0) * clamp01((v - a) / (b - a));
export const eo = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

type GP = { pos?: V3; rot?: V3; scl?: V3 | number };
export const Ol: React.FC<GP & { geo: React.ReactElement; color: string; w?: number; rough?: number; glow?: number; shadow?: boolean; metal?: number }> = ({ geo, color, w = 0.025, rough = 0.6, glow = 0.18, shadow = true, metal = 0, pos, rot, scl }) => (
  <group position={pos} rotation={rot} scale={scl}>
    <mesh castShadow={shadow} receiveShadow>{geo}<meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={color} emissiveIntensity={glow} /></mesh>
    {w > 0 ? <mesh scale={1 + w}>{geo}<meshBasicMaterial color={OUT} side={THREE.BackSide} /></mesh> : null}
  </group>
);
export const B = (w: number, h: number, d: number) => <boxGeometry args={[w, h, d]} />;
export const Cy = (r1: number, r2: number, h: number, s = 32) => <cylinderGeometry args={[r1, r2, h, s]} />;
export const Sp = (r: number) => <sphereGeometry args={[r, 40, 28]} />;

// ---------- cámara por planos ----------
export type Shot = { t: number; p: V3; l: V3; fov?: number; roll?: number; push?: number; hook?: number };
export const shotAt = (shots: Shot[], t: number) => { let i = 0; while (i + 1 < shots.length && shots[i + 1].t <= t) i++; return i; };
export const Cam: React.FC<{ shots: Shot[]; t: number }> = ({ shots, t }) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const i = shotAt(shots, t); const s = shots[i]; const dt = t - s.t;
  const k = Math.min(0.5, dt * (s.push ?? 0.06));
  const hook = s.hook ? eo(dt / s.hook) : 1;
  const from = s.hook ? 2.6 : 1;
  const p: V3 = [s.l[0] + (s.p[0] - s.l[0]) * (1 - k) * (from + (1 - from) * hook), s.l[1] + (s.p[1] - s.l[1]) * (1 - k) * (from + (1 - from) * hook), s.l[2] + (s.p[2] - s.l[2]) * (1 - k) * (from + (1 - from) * hook)];
  cam.position.set(p[0] + Math.sin(t * 1.3) * 0.015, p[1] + Math.cos(t * 1.1) * 0.012, p[2]);
  cam.fov = s.fov ?? 40; cam.near = 0.05; cam.far = 80;
  cam.lookAt(...s.l); cam.rotateZ(s.roll ?? 0);
  cam.updateProjectionMatrix();
  return null;
};

// ---------- texturas de texto ----------
const texCache = new Map<string, THREE.Texture>();
export const textTex = (txt: string, bg: string, fg: string, w = 1024, h = 400, font = "900 200px 'Arial Black', Arial", shadow = "#00000055") => {
  const key = [txt, bg, fg, w, h, font].join("|");
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (bg.startsWith("#8") || bg.startsWith("#9") || bg.startsWith("#A") || bg.startsWith("#7")) { for (let i = 0; i < 9; i++) { g.fillStyle = "rgba(60,30,10,0.18)"; g.fillRect(0, (i / 9) * h, w, 3); } }
  g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
  const lines = txt.split("\n");
  let size = parseInt(font.match(/(\d+)px/)![1], 10);
  const fit = () => Math.max(...lines.map((l) => g.measureText(l).width));
  while (fit() > w * 0.9 && size > 20) { size -= 6; g.font = font.replace(/\d+px/, `${size}px`); }
  lines.forEach((l, i) => { const y = h / 2 + (i - (lines.length - 1) / 2) * size * 1.05; g.fillStyle = shadow; g.fillText(l, w / 2 + size * 0.05, y + size * 0.06); g.fillStyle = fg; g.fillText(l, w / 2, y); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(key, t); return t;
};
export const Sign: React.FC<GP & { txt: string; w?: number; h?: number; bg?: string; fg?: string; post?: boolean; board?: string }> = ({ txt, w = 1.6, h = 0.62, bg = "#9A6A3A", fg = "#FFF3D6", post = true, board = "#7A4E28", pos, rot, scl }) => {
  const tex = useMemo(() => textTex(txt, bg, fg, 1024, Math.round(1024 * h / w)), [txt, bg, fg, w, h]);
  return (
    <group position={pos} rotation={rot} scale={scl}>
      <Ol geo={B(w + 0.08, h + 0.08, 0.08)} color={board} pos={[0, 0, -0.01]} rough={0.8} w={0.02} />
      <mesh position={[0, 0, 0.035]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.7} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.15} /></mesh>
      {post ? <Ol geo={B(0.1, 1.6, 0.1)} color={board} pos={[0, -h / 2 - 0.8, -0.05]} w={0.04} /> : null}
    </group>
  );
};

// ---------- personaje ----------
export type Face = "calm" | "smile" | "happy" | "sly" | "sad" | "shock" | "angry" | "worried";
export type Pose = { armL?: [number, number]; armR?: [number, number]; walk?: number; kneel?: number; lean?: number };
export type CharP = GP & { t: number; face?: Face; robe: string; sash?: string; hair?: string; beard?: string; hat?: string; hood?: string; pose?: Pose; seed?: number; sweat?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; talk?: boolean; halo?: boolean };
const WHITE = "#F8F6F1", GRAY = "#5E5A56";
const FaceM: React.FC<{ face: Face; t: number; seed: number; talk?: boolean; sweat?: number }> = ({ face, t, seed, talk, sweat = 0 }) => {
  const blink = (t * 0.33 + seed * 0.37) % 1 < 0.04;
  const arcEyes = face === "happy" || face === "smile";
  const brow: Record<Face, number> = { calm: 0, smile: 0.1, happy: 0.12, sly: -0.25, sad: 0.42, shock: 0.25, angry: -0.5, worried: 0.32 };
  const by = face === "shock" ? 0.27 : 0.22;
  const mouthOpen = talk ? 0.5 + 0.5 * Math.sin(t * 20 + seed) : face === "shock" ? 1 : 0;
  return (
    <group position={[0, 0, 0.5]}>
      {[-1, 1].map((sd) => (
        <group key={sd}>
          {arcEyes || blink ? (
            <mesh position={[0.18 * sd, 0.04, 0.01]} rotation={[0, sd * 0.32, blink && !arcEyes ? Math.PI : 0]}><torusGeometry args={[0.08, 0.018, 8, 20, Math.PI]} /><meshBasicMaterial color={GRAY} /></mesh>
          ) : (
            <mesh position={[0.18 * sd, 0.04, 0.0]} rotation={[0, sd * 0.32, 0]} scale={[1, face === "sly" ? 0.45 : face === "shock" ? 1.35 : 1, 0.4]}><sphereGeometry args={[0.055, 16, 12]} /><meshBasicMaterial color="#1E1612" /></mesh>
          )}
          <mesh position={[0.18 * sd, by + (face === "sly" && sd > 0 ? 0.04 : 0), -0.01]} rotation={[0, sd * 0.32, Math.PI / 2 + sd * brow[face]]}><capsuleGeometry args={[0.017, 0.15, 4, 8]} /><meshBasicMaterial color={GRAY} /></mesh>
        </group>
      ))}
      {mouthOpen > 0.1 ? (
        <mesh position={[0.02, -0.17, 0.0]} scale={[1, 0.4 + mouthOpen * 0.8, 0.35]}><sphereGeometry args={[0.07, 16, 10]} /><meshBasicMaterial color="#3B1712" /></mesh>
      ) : face === "sad" || face === "worried" || face === "angry" ? (
        <mesh position={[0.02, -0.2, 0.0]}><torusGeometry args={[0.1, 0.016, 8, 20, Math.PI * 0.75]} /><meshBasicMaterial color={GRAY} /></mesh>
      ) : (
        <mesh position={[0.02 + (face === "sly" ? 0.04 : 0), -0.17, 0.0]} rotation={[0, 0, Math.PI + (face === "sly" ? 0.35 : 0)]}><torusGeometry args={[face === "calm" ? 0.07 : 0.11, 0.016, 8, 20, Math.PI * (face === "calm" ? 0.6 : 0.82)]} /><meshBasicMaterial color={GRAY} /></mesh>
      )}
      {sweat > 0 ? <mesh position={[0.36, 0.2 - ((t * 0.6) % 1) * 0.25, -0.05]} scale={[0.6, 1, 0.6]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#8FD3FF" emissive="#8FD3FF" emissiveIntensity={0.4} transparent opacity={sweat} /></mesh> : null}
    </group>
  );
};
const Arm: React.FC<{ sd: number; a: [number, number]; color: string; hold?: React.ReactNode }> = ({ sd, a, color, hold }) => (
  <group position={[0.36 * sd, 0.38, 0]} rotation={[-a[1], 0, sd * (0.25 + a[0])]}>
    <Ol geo={<capsuleGeometry args={[0.07, 0.42, 6, 12]} />} color={color} pos={[0, -0.25, 0]} w={0.06} />
    <Ol geo={Sp(0.085)} color={WHITE} pos={[0, -0.53, 0]} w={0.06} />
    {hold ? <group position={[0, -0.6, 0.05]}>{hold}</group> : null}
  </group>
);
export const Char: React.FC<CharP> = (p) => {
  const { t, seed = 0, pose = {}, face = "calm" } = p;
  const walk = pose.walk ?? 0;
  const bob = walk ? Math.abs(Math.sin(t * 8 + seed)) * 0.06 : Math.sin(t * 2.2 + seed) * 0.01;
  const kneel = pose.kneel ?? 0;
  return (
    <group position={p.pos} rotation={p.rot} scale={p.scl}>
      <group position={[0, bob - kneel * 0.35, 0]} rotation={[pose.lean ?? 0, 0, 0]}>
        {[-1, 1].map((sd) => <Ol key={sd} geo={<capsuleGeometry args={[0.045, 0.32, 4, 8]} />} color="#2A2420" pos={[0.13 * sd, 0.2, 0]} rot={[walk ? Math.sin(t * 8 + seed + (sd > 0 ? Math.PI : 0)) * 0.5 : kneel * (sd > 0 ? 1.4 : 0.2), 0, 0]} w={0.08} />)}
        <Ol geo={Cy(0.3, 0.46, 0.85, 28)} color={p.robe} pos={[0, 0.72, 0]} rough={0.75} />
        {p.sash ? <Ol geo={Cy(0.335, 0.345, 0.08, 28)} color={p.sash} pos={[0, 0.82, 0]} w={0.02} /> : null}
        <Arm sd={-1} a={pose.armL ?? [0.05, 0.05 + (walk ? Math.sin(t * 8 + seed) * 0.4 : 0)]} color={p.robe} hold={p.holdL} />
        <Arm sd={1} a={pose.armR ?? [0.05, 0.05 - (walk ? Math.sin(t * 8 + seed) * 0.4 : 0)]} color={p.robe} hold={p.holdR} />
        <group position={[0, 1.62, 0]}>
          <Ol geo={Sp(0.55)} color={WHITE} rough={0.42} w={0.02} />
          <FaceM face={face} t={t} seed={seed} talk={p.talk} sweat={p.sweat} />
          {p.hair ? <Ol geo={<sphereGeometry args={[0.575, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} color={p.hair} pos={[0, 0.02, -0.01]} w={0.03} rough={0.7} /> : null}
          {p.hood ? <Ol geo={<sphereGeometry args={[0.62, 40, 24, Math.PI * 1.15, Math.PI * 1.7, 0, Math.PI * 0.62]} />} color={p.hood} pos={[0, 0.0, -0.04]} w={0.03} rough={0.8} /> : null}
          {p.beard ? <Ol geo={Sp(0.3)} color={p.beard} pos={[0, -0.46, 0.22]} scl={[1.05, 0.55, 0.6]} w={0.04} rough={0.85} /> : null}
          {p.hat ? <Ol geo={Cy(0.3, 0.42, 0.55, 24)} color={p.hat} pos={[0, 0.62, 0]} w={0.03} /> : null}
          {p.halo ? <mesh position={[0, 0.78, -0.1]} rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[0.36, 0.03, 10, 40]} /><meshStandardMaterial color="#FFD86A" emissive="#FFC43A" emissiveIntensity={1.4} /></mesh> : null}
        </group>
      </group>
    </group>
  );
};

// ---------- utilería ----------
export const Coin: React.FC<GP> = ({ pos, rot }) => <Ol geo={Cy(0.09, 0.09, 0.025, 20)} color="#F2C14A" metal={0.4} rough={0.35} glow={0.35} pos={pos} rot={rot} w={0.05} />;
export const CoinBag: React.FC<GP> = ({ pos, rot, scl }) => (
  <group position={pos} rotation={rot} scale={scl}>
    <Ol geo={<sphereGeometry args={[0.22, 24, 16]} />} color="#9A6A3A" scl={[1, 1.1, 1]} rough={0.9} />
    <Ol geo={Cy(0.07, 0.11, 0.12, 16)} color="#7A4E28" pos={[0, 0.26, 0]} />
    <Coin pos={[0.03, 0.34, 0.02]} rot={[1.2, 0, 0.3]} />
  </group>
);
export const Tree: React.FC<GP & { t: number; c?: string }> = ({ t, c = "#6E9A3C", pos, scl }) => (
  <group position={pos} scale={scl} rotation={[0, 0, Math.sin(t * 1.2) * 0.02]}>
    <Ol geo={Cy(0.12, 0.2, 1.6, 12)} color="#6B4426" pos={[0, 0.8, 0]} />
    {[[0, 2.0, 0, 0.75], [-0.5, 1.7, 0.1, 0.55], [0.5, 1.75, -0.1, 0.55], [0.1, 2.5, 0, 0.5]].map(([x, y, z, r], i) => <Ol key={i} geo={Sp(r)} color={c} pos={[x, y, z]} rough={0.85} />)}
  </group>
);
export const Torch: React.FC<GP & { t: number }> = ({ t, pos }) => (
  <group position={pos}>
    <Ol geo={Cy(0.04, 0.05, 1.2, 10)} color="#6B4426" pos={[0, 0.6, 0]} />
    <mesh position={[0, 1.32 + Math.sin(t * 20) * 0.02, 0]} scale={[1, 1 + Math.sin(t * 17) * 0.12, 1]}><coneGeometry args={[0.12, 0.38, 12]} /><meshStandardMaterial color="#FF9A2E" emissive="#FF7A10" emissiveIntensity={2.5} /></mesh>
    <pointLight position={[0, 1.4, 0.2]} intensity={5} distance={6} color="#FF9A40" />
  </group>
);
export const Column: React.FC<GP & { h?: number; c?: string }> = ({ h = 4, c = "#EFE2C4", pos }) => (
  <group position={pos}>
    <Ol geo={B(0.7, 0.2, 0.7)} color={c} pos={[0, 0.1, 0]} w={0.02} />
    <Ol geo={Cy(0.26, 0.3, h, 20)} color={c} pos={[0, h / 2 + 0.2, 0]} w={0.02} />
    <Ol geo={B(0.7, 0.2, 0.7)} color={c} pos={[0, h + 0.3, 0]} w={0.02} />
  </group>
);
export const Ground: React.FC<{ c: string; size?: number }> = ({ c, size = 60 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[size, size]} /><meshStandardMaterial color={c} roughness={0.95} emissive={c} emissiveIntensity={0.12} /></mesh>
);
export const Backdrop: React.FC<{ top: string; bot: string; z?: number }> = ({ top, bot, z = -12 }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 4; c.height = 256; const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [top, bot]);
  return <mesh position={[0, 8, z]}><planeGeometry args={[80, 30]} /><meshBasicMaterial map={tex} /></mesh>;
};
