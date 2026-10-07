import { Composition } from "remotion";
import { SinLimitesLifeIntro } from "./compositions/SinLimitesLifeIntro";
import { SinLimitesLifeVideoEdit } from "./compositions/SinLimitesLifeVideoEdit";
import { MiVideoEditado } from "./mi-video/MiVideoEditado";

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
