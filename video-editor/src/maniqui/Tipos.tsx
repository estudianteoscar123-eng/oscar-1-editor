import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box3, Group, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DISPLAY, INK, SANS, ip } from "../ee46f/theme";

// "Tipos de pelea": dos modelos 3D (sin animación: sin esqueleto), movimiento de cámara, títulos y marcas ✓ ✗
const FPS = 30;
const RED = "#E8383E";
const load = (src: string): Promise<Object3D> =>
  new Promise((resolve, reject) => {
    new GLTFLoader().load(
      staticFile(src),
      (gltf) => {
        const root = new Group();
        root.add(gltf.scene);
        const size = new Vector3();
        new Box3().setFromObject(root).getSize(size);
        root.scale.setScalar(1.55 / size.y);
        const c = new Vector3();
        new Box3().setFromObject(root).getCenter(c);
        root.position.sub(c);
        resolve(root);
      },
      undefined,
      reject,
    );
  });

// Escenas: modelo, giro inicial, cámara, y textos
type Scene = { from: number; to: number; model: "A" | "B"; spin: number; camZ: number; title: string; kw: string; lines: [string, boolean][] };
const SCENES: Scene[] = [
  { from: 0, to: 6, model: "A", spin: 0.2, camZ: 5.4, title: "TIPOS DE", kw: "PELEA", lines: [] },
  { from: 6, to: 12, model: "A", spin: 0.6, camZ: 5.0, title: "BOXEO", kw: "PUÑOS", lines: [["Manos arriba, codos pegados", true], ["Pivote de pies, no saltes", true], ["Golpear sin cruzar los pies", false]] },
  { from: 12, to: 18, model: "B", spin: -0.4, camZ: 5.0, title: "MUAY THAI", kw: "CODOS", lines: [["Rodillas y codos", true], ["Clinch para controlar", true], ["Sin guardia baja", false]] },
  { from: 18, to: 24, model: "A", spin: 1.5, camZ: 4.7, title: "JUDO", kw: "AGARRE", lines: [["Caídas controladas", true], ["Desequilibrar al rival", true], ["Golpear sin técnica", false]] },
  { from: 24, to: 30, model: "B", spin: 0.8, camZ: 5.2, title: "¿CUÁL", kw: "PRACTICAS?", lines: [["Elige tu estilo", true], ["Entrena con constancia", true]] },
];
const sceneAt = (f: number) => SCENES.find((s) => f >= s.from * FPS && f < s.to * FPS) ?? SCENES[SCENES.length - 1];

const World: React.FC<{ a: Object3D; b: Object3D }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const s = sceneAt(f);
  const local = f - s.from * FPS;
  const dur = (s.to - s.from) * FPS;
  const spin = s.spin + (local / dur) * Math.PI * 0.5;
  const cam = s.camZ - ip(local, [0, dur], [0, 0.4]);
  const obj = s.model === "A" ? a : b;
  return (
    <>
      <perspectiveCamera position={[0, 0.2, cam]} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[2, 3, 3]} intensity={2.2} />
      <directionalLight position={[-2, 1, 2]} intensity={0.9} />
      <primitive object={obj} position={[0, 0.45, 0]} rotation={[0, spin, 0]} />
    </>
  );
};

const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const s = sceneAt(f);
  const local = f - s.from * FPS;
  const titleO = ip(local, [0, 8], [0, 1]);
  const titleY = ip(local, [0, 10], [30, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* etiqueta roja superior */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: INK, opacity: titleO }}>
        TIPOS DE PELEA
      </div>
      {/* títulos grandes */}
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center", opacity: titleO, translate: `0px ${titleY}px` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: INK, letterSpacing: -1 }}>{s.title}</div>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 900, fontSize: 150, lineHeight: 1, color: RED, letterSpacing: -3, textShadow: "0 8px 30px rgba(232,56,62,0.45)" }}>{s.kw}</div>
      </div>
      {/* líneas con ✓ y ✗ */}
      <div style={{ position: "absolute", top: 1560, left: 90, right: 90, fontFamily: SANS, fontWeight: 600, fontSize: 46, color: INK }}>
        {s.lines.map(([t, ok], i) => {
          const o = ip(local, [12 + i * 8, 20 + i * 8], [0, 1]);
          return (
            <div key={i} style={{ opacity: o, marginBottom: 14, display: "flex", gap: 18 }}>
              <span style={{ color: ok ? "#FFFFFF" : RED, fontWeight: 900, width: 44 }}>{ok ? "✓" : "✗"}</span>
              <span>{t}</span>
            </div>
          );
        })}
      </div>
      {/* barra de progreso de la escena */}
      <div style={{ position: "absolute", bottom: 60, left: 90, right: 90, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3 }}>
        <div style={{ width: `${(local / ((s.to - s.from) * FPS)) * 100}%`, height: "100%", background: RED, borderRadius: 3 }} />
      </div>
    </AbsoluteFill>
  );
};

export const TiposPelea: React.FC = () => {
  const [models, setModels] = useState<{ a: Object3D; b: Object3D } | null>(null);
  useEffect(() => {
    const h = delayRender("cargando modelos");
    Promise.all([load("maniqui/basket.glb"), load("maniqui/running.glb")])
      .then(([a, b]) => {
        setModels({ a, b });
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, []);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 55% at 50% 40%, #1a1b21 0%, #050506 75%)" }}>
      {models && (
        <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0.2, 5], fov: 35 }} style={{ position: "absolute", inset: 0 }}>
          <World a={models.a} b={models.b} />
        </ThreeCanvas>
      )}
      <Overlay />
    </AbsoluteFill>
  );
};
