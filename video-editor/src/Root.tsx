import { Composition } from "remotion";
import { SinLimitesLifeIntro } from "./compositions/SinLimitesLifeIntro";
import { SinLimitesLifeVideoEdit } from "./compositions/SinLimitesLifeVideoEdit";
import { MiVideoEditado } from "./mi-video/MiVideoEditado";
import { MiVideoV3 } from "./mi-video-v3/MiVideoV3";
import { Suerte } from "./suerte/Suerte";
import { Pieza } from "./pieza/Pieza";

export const Main = () => {
  return (
    <>
      <Composition
        id="sinlimiteslife-intro"
        component={SinLimitesLifeIntro}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Pieza"
        component={Pieza}
        durationInFrames={1030}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Suerte"
        component={Suerte}
        durationInFrames={606}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MiVideoV3"
        component={MiVideoV3}
        durationInFrames={976}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MiVideoEditado"
        component={MiVideoEditado}
        durationInFrames={976}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="sinlimiteslife-video"
        component={SinLimitesLifeVideoEdit}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
