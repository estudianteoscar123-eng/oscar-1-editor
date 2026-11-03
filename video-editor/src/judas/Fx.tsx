import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- transiciones (CSS, sin shaders) ----------
type P = Record<string, never>;
const mk = (C: React.FC<TransitionPresentationComponentProps<P>>): TransitionPresentation<P> => ({ component: C, props: {} as P });

// atraviesa la escena: la que sale crece y se desenfoca, la que entra llega desde lejos
const ZoomThrough: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => (
  <AbsoluteFill style={presentationDirection === "exiting"
    ? { transform: `scale(${1 + p * p * 2.2})`, opacity: 1 - p * p, filter: `blur(${p * 22}px) brightness(${1 + p * 0.8})` }
    : { transform: `scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 16}px)` }}>{children}</AbsoluteFill>
);
// barrido rápido con desenfoque de movimiento
const Whip: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = p * p * (3 - 2 * p);
  return (
    <AbsoluteFill style={presentationDirection === "exiting"
      ? { transform: `translateX(${-e * 1080}px) skewX(${e * 10}deg)`, filter: `blur(${Math.sin(p * Math.PI) * 24}px)` }
      : { transform: `translateX(${(1 - e) * 1080}px) skewX(${(1 - e) * 10}deg)`, filter: `blur(${Math.sin(p * Math.PI) * 24}px)` }}>{children}</AbsoluteFill>
  );
};
// iris circular con aro dorado (una moneda que se abre)
const Iris: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ transform: `scale(${1 - p * 0.08})`, filter: `brightness(${1 - p * 0.5})` }}>{children}</AbsoluteFill>;
  const r = Math.pow(p, 1.6) * 1250;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 55%)` }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - r, top: 1056 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `${10 + 20 * (1 - p)}px solid rgba(240,210,140,${1 - p})`, boxShadow: `0 0 60px rgba(255,220,150,${0.8 * (1 - p)})` }} />
    </AbsoluteFill>
  );
};
// destello de luz
const Flash: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => (
  <AbsoluteFill style={{ opacity: presentationDirection === "exiting" ? 1 - ip(p, [0.5, 0.6], [0, 1]) : ip(p, [0.4, 0.5], [0, 1]) }}>
    {children}
    <AbsoluteFill style={{ background: "#FFF6E4", opacity: presentationDirection === "exiting" ? ip(p, [0, 0.5], [0, 1]) : ip(p, [0.5, 1], [1, 0]), mixBlendMode: "screen" }} />
  </AbsoluteFill>
);
// fundido a negro (momentos graves)
const Dip: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => (
  <AbsoluteFill style={{ opacity: presentationDirection === "exiting" ? ip(p, [0, 0.5], [1, 0]) : ip(p, [0.5, 1], [0, 1]), transform: `scale(${presentationDirection === "exiting" ? 1 + p * 0.06 : 1.06 - p * 0.06})` }}>{children}</AbsoluteFill>
);
export const T = { zoom: mk(ZoomThrough), whip: mk(Whip), iris: mk(Iris), flash: mk(Flash), dip: mk(Dip) };

// ---------- bokeh en primer plano (profundidad) ----------
export const Bokeh: React.FC<{ n?: number; color?: string; seed?: string }> = ({ n = 10, color = "255,230,180", seed = "bk" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: n }, (_, i) => {
        const r = 40 + random(`${seed}r${i}`) * 110;
        const x = (random(`${seed}x${i}`) * 1300 - 110 + f * (0.6 + random(`${seed}v${i}`) * 1.4)) % 1300 - 110;
        const y = random(`${seed}y${i}`) * 1920 + Math.sin(f / 40 + i) * 30;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},0.32), rgba(${color},0) 70%)`, filter: "blur(6px)", opacity: 0.5 + 0.5 * Math.sin(f / 30 + i * 2) }} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- impacto: onda expansiva + chispas ----------
export const Burst: React.FC<{ d: number; x?: number; y?: number; color?: string }> = ({ d, x = 540, y = 1000, color = "255,215,140" }) => {
  if (d < 0 || d > 22) return null;
  const k = d / 22;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: x - 700 * k, top: y - 700 * k, width: 1400 * k, height: 1400 * k, borderRadius: "50%", border: `${24 * (1 - k)}px solid rgba(${color},${0.8 * (1 - k)})` }} />
      <div style={{ position: "absolute", left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},${0.7 * (1 - k) * (1 - k)}), rgba(${color},0) 65%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 26 }, (_, i) => {
          const a = (i / 26) * Math.PI * 2 + random(`ba${i}`) * 0.3;
          const v = 18 + random(`bv${i}`) * 26;
          const r0 = 60 + v * d, r1 = r0 + 40 + 60 * (1 - k);
          return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={`rgba(${color},${1 - k})`} strokeWidth={6 * (1 - k) + 1} strokeLinecap="round" />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- moneda 3D: siclo de Tiro con su inscripción real ----------
const faceTexture = (): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(400, 360, 60, 512, 512, 520);
  grd.addColorStop(0, "#F4F6FA"); grd.addColorStop(0.55, "#B9BFC9"); grd.addColorStop(1, "#6A707A");
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
  g.strokeStyle = "#5A606A"; g.lineWidth = 14; g.beginPath(); g.arc(512, 512, 470, 0, Math.PI * 2); g.stroke();
  g.setLineDash([10, 18]); g.lineWidth = 8; g.beginPath(); g.arc(512, 512, 420, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  // águila (reverso del siclo) estilizada
  g.fillStyle = "#7E848F";
  g.beginPath(); g.moveTo(512, 300); g.quadraticCurveTo(600, 360, 590, 470); g.lineTo(700, 430); g.quadraticCurveTo(640, 560, 560, 590); g.lineTo(580, 720); g.lineTo(512, 680); g.lineTo(444, 720); g.lineTo(464, 590); g.quadraticCurveTo(384, 560, 324, 430); g.lineTo(434, 470); g.quadraticCurveTo(424, 360, 512, 300); g.fill();
  // ΤΥΡΟΥ ΙΕΡΑΣ ΚΑΙ ΑΣΥΛΟΥ alrededor
  const txt = "ΤΥΡΟΥ ΙΕΡΑΣ ΚΑΙ ΑΣΥΛΟΥ ";
  g.font = "bold 58px serif"; g.fillStyle = "#4E545E"; g.textAlign = "center"; g.textBaseline = "middle";
  [...txt].forEach((ch, i) => { const a = -Math.PI / 2 + (i / txt.length) * Math.PI * 2; g.save(); g.translate(512 + Math.cos(a) * 360, 512 + Math.sin(a) * 360); g.rotate(a + Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};
export const Coin3D: React.FC<{ size?: number; top?: number; spin?: number; tilt?: number }> = ({ size = 900, top = 560, spin = 0, tilt = 0.25 }) => {
  const tex = useMemo(() => faceTexture(), []);
  const mats = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: "#9EA4AE", metalness: 0.9, roughness: 0.32 }),
    new THREE.MeshStandardMaterial({ map: tex, metalness: 0.75, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: tex, metalness: 0.75, roughness: 0.3 }),
  ], [tex]);
  return (
    <ThreeCanvas width={size} height={size} style={{ position: "absolute", left: (1080 - size) / 2, top }} camera={{ position: [0, 0, 7], fov: 32 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 6]} intensity={3.2} />
      <pointLight position={[-4, -3, 4]} intensity={40} color="#8FB4FF" />
      <pointLight position={[4, 2, 2]} intensity={30} color="#FFD8A0" />
      <group rotation={[tilt, spin, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={mats}>
          <cylinderGeometry args={[2, 2, 0.24, 120]} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
