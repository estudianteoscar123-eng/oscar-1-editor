import React, { useMemo } from "react";
import * as THREE from "three";
import { V3 } from "./Kit3D";

// multitud instanciada: cientos de personitas (cuerpo + cabeza + casco/turbante) en 3 draw calls
export type Inst = { p: V3; r?: number; s?: number; c: string; h?: string; lie?: number; o?: number };
const dummy = new THREE.Object3D();
const col = new THREE.Color();
export const Crowd: React.FC<{ items: Inst[]; max?: number; hat?: "helmet" | "cone" | "turban" }> = ({ items, max = 800, hat = "helmet" }) => {
  const meshes = useMemo(() => {
    const mk = (g: THREE.BufferGeometry, rough = 0.85, metal = 0) => {
      const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ roughness: rough, metalness: metal }), max);
      m.castShadow = true;
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
      return m;
    };
    const body = mk(new THREE.CylinderGeometry(0.22, 0.36, 0.95, 8).translate(0, 0.55, 0));
    const head = mk(new THREE.SphereGeometry(0.33, 12, 10).translate(0, 1.35, 0), 0.55);
    const hg = hat === "cone" ? new THREE.ConeGeometry(0.22, 0.45, 8).translate(0, 1.78, 0) : hat === "turban" ? new THREE.SphereGeometry(0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5).scale(1.1, 0.8, 1.1).translate(0, 1.5, 0) : new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.45).translate(0, 1.4, 0);
    const top = mk(hg, 0.4, hat === "helmet" ? 0.6 : 0.1);
    return [body, head, top];
  }, [max, hat]);
  const n = Math.min(items.length, max);
  meshes.forEach((m, k) => {
    for (let i = 0; i < n; i++) {
      const it = items[i];
      const s = (it.s ?? 1) * (it.o ?? 1);
      dummy.position.set(it.p[0], it.p[1], it.p[2]);
      dummy.rotation.set(it.lie ?? 0, it.r ?? 0, 0, "YXZ");
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, col.set(k === 0 ? it.c : k === 1 ? "#F6F1E8" : it.h ?? "#8C8F96"));
    }
    m.count = n;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return <>{meshes.map((m, i) => <primitive key={i} object={m} />)}</>;
};
