import { Composition } from "remotion";
import { Disciplina } from "./disciplina/Main";
import { Sopa } from "./sopa/Main";
import { Sopa2 } from "./sopa2/Main";
import { AnimeMix } from "./animemix/Main";
import { Frankl } from "./frankl/Main";
import { ManiquiTest } from "./maniqui/Test";
import { TiposPelea } from "./maniqui/Tipos";
import { Pelea, TOTAL as PELEA_TOTAL } from "./pelea/Main";
import { Ep1, EP1_TOTAL } from "./zk/Ep1";
import { Vesna, VESNA_TOTAL } from "./vesna/Main";
import { Pedro, PEDRO_TOTAL } from "./pedro/Main";
import { SL, SL_TOTAL } from "./sl/Main";
import { FranklRef } from "./frankl/Ref";
import { Atraccion } from "./atraccion/Main";
import { TresTomas } from "./tres-tomas/Main";
import { AlgunDia } from "./algundia/Main";
import { Vaso } from "./vaso/Main";
import { SinLimitesLifeIntro } from "./compositions/SinLimitesLifeIntro";
import { SinLimitesLifeVideoEdit } from "./compositions/SinLimitesLifeVideoEdit";
import { MiVideoEditado } from "./mi-video/MiVideoEditado";
import { MiVideoV3 } from "./mi-video-v3/MiVideoV3";
import { Suerte } from "./suerte/Suerte";
import { Pieza } from "./pieza/Pieza";
import { D8C } from "./d8c/Main";
import { EE46 } from "./ee46/Main";
import { EE46F } from "./ee46f/Main";
import { MiVideoV3 as Winter } from "./winter/MiVideoV3";
import { MiVideoV3 as Winter2 } from "./winter2/MiVideoV3";

export const Main = () => {
  return (
    <>
      <Composition id="SLVegeta" component={SL} defaultProps={{ video: "vegeta" as const }} durationInFrames={SL_TOTAL.vegeta} fps={30} width={1080} height={1920} />
      <Composition id="SLLee" component={SL} defaultProps={{ video: "lee" as const }} durationInFrames={SL_TOTAL.lee} fps={30} width={1080} height={1920} />
      <Composition
        id="Pedro"
        component={Pedro}
        durationInFrames={PEDRO_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Vesna"
        component={Vesna}
        durationInFrames={VESNA_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ZKEp1"
        component={Ep1}
        durationInFrames={EP1_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Pelea"
        component={Pelea}
        durationInFrames={PELEA_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiposPelea"
        component={TiposPelea}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ManiquiTest"
        component={ManiquiTest}
        defaultProps={{ src: "maniqui/basket.glb" }}
        durationInFrames={60}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FranklRef"
        component={FranklRef}
        durationInFrames={1218}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Frankl"
        component={Frankl}
        durationInFrames={1257}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Progreso"
        component={AnimeMix}
        defaultProps={{ video: "progreso" as const }}
        durationInFrames={2208}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Momento"
        component={AnimeMix}
        defaultProps={{ video: "momento" as const }}
        durationInFrames={2306}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Sopa2"
        component={Sopa2}
        durationInFrames={2805}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Sopa2Sin"
        component={Sopa2}
        defaultProps={{ subtitulos: false }}
        durationInFrames={2805}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Sopa"
        component={Sopa}
        durationInFrames={2241}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Disciplina"
        component={Disciplina}
        durationInFrames={1347}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Atraccion"
        component={Atraccion}
        durationInFrames={1540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TresTomas"
        component={TresTomas}
        durationInFrames={604}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AlgunDia"
        component={AlgunDia}
        durationInFrames={2622}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Vaso"
        component={Vaso}
        durationInFrames={1956}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="sinlimiteslife-intro"
        component={SinLimitesLifeIntro}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EE46F"
        component={EE46F}
        durationInFrames={984}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EE46"
        component={EE46}
        durationInFrames={984}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="D8C"
        component={D8C}
        durationInFrames={958}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Winter2"
        component={Winter2}
        durationInFrames={1023}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Winter"
        component={Winter}
        durationInFrames={976}
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
