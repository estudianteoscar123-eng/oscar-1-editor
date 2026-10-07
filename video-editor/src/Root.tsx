import { Composition } from "remotion";
import { SinLimitesLifeIntro } from "./compositions/SinLimitesLifeIntro";

export const Main = () => {
  return (
    <Composition
      id="sinlimiteslife-intro"
      component={SinLimitesLifeIntro}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
