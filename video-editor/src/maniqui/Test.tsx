import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box3, Group, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// El GLB se carga antes de montar el canvas 3D, así el modelo ya existe en el primer dibujo
const loadModel = (src: string): Promise<Object3D> =>
  new Promise((resolve, reject) => {
    new GLTFLoader().load(
      staticFile(src),
      (gltf) => {
        const root = new Group();
        root.add(gltf.scene);
        const size = new Vector3();
        new Box3().setFromObject(root).getSize(size);
        root.scale.setScalar(2 / size.y);
        const c = new Vector3();
        new Box3().setFromObject(root).getCenter(c);
        root.position.sub(c);
        resolve(root);
      },
      undefined,
      reject,
    );
  });

const Model: React.FC<{ obj: Object3D }> = ({ obj }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <primitive object={obj} rotation={[0, (f / durationInFrames) * Math.PI * 2, 0]} />;
};

export const ManiquiTest: React.FC<{ src: string }> = ({ src }) => {
  const [obj, setObj] = useState<Object3D | null>(null);
  useEffect(() => {
    const h = delayRender(`cargando ${src}`);
    loadModel(src)
      .then((o) => {
        setObj(o);
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [src]);
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {obj && (
        <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 5], fov: 35 }} style={{ position: "absolute", inset: 0 }}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[2, 3, 3]} intensity={2.2} />
          <Model obj={obj} />
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};
