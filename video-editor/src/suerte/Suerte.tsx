import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Headline, Stage } from "./kit";
import { PixelGlitch, SceneEspera, SceneFeed, SceneIceberg, SceneNadie, SceneSeguir, SceneSuerte } from "./Scenes";

// Pieza 100 % motion · Estilo C · un solo plano secuencia (sin cortes), acento azul eléctrico
export const Suerte: React.FC = () => {
  const f = useCurrentFrame();
  // deriva lenta de cámara 3D para que nunca haya un fotograma quieto
  const tiltX = Math.sin(f / 55) * 3;
  const tiltY = Math.cos(f / 70) * 4;
  const zoom = interpolate(f, [0, 606], [1, 1.06]);
  return (
    <AbsoluteFill>
      <Stage />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <AbsoluteFill style={{ rotate: `x ${tiltX}deg`, scale: zoom }}>
          <AbsoluteFill style={{ rotate: `y ${tiltY}deg` }}>
            <SceneSuerte />
            <SceneIceberg />
            <SceneEspera />
            <SceneNadie />
            <SceneFeed />
            <SceneSeguir />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      <Headline top={250} />
      <PixelGlitch at={350} />
      <Audio src={staticFile("suerte/voz.wav")} />
    </AbsoluteFill>
  );
};
