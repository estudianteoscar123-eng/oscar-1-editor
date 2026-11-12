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
import { Ladron, LADRON_TOTAL } from "./ladron/Main";
import { David, DAVID_TOTAL } from "./david/Main";
import { Jonas, JONAS_TOTAL } from "./jonas/Main";
import { Giants, GIANTS_TOTAL } from "./giants/Main";
import { RockLee, ROCKLEE_TOTAL } from "./rocklee/Main";
import { Pedro2, PEDRO2_TOTAL } from "./pedro2/Main";
import { Thorfinn, THORFINN_TOTAL } from "./thorfinn/Main";
import { SubTest, SUBTEST_TOTAL } from "./thorfinn/SubTest";
import { SubTest2, SUBTEST2_TOTAL } from "./thorfinn/SubTest2";
import { Prov, PROV_TOTAL } from "./prov/Main";
import { Judas, JUDAS_TOTAL } from "./judas/Main";
import { Judas3, JUDAS3_TOTAL } from "./judas/V3";
import { ZkDark, DARK_TOTAL } from "./judas/Dark";
import { ZkRed, RED_TOTAL } from "./judas/Red";
import { JudasDark, JUDASDARK_TOTAL } from "./judas/DarkFull";
import { Sangre, SANGRE_TOTAL } from "./sangre/Main";
import { Adultera, ADULTERA_TOTAL } from "./adultera/Main";
import { AdulteraDark, ADULTERA_DARK_TOTAL } from "./adultera/Dark";
import { Navidad, NAVIDAD_TOTAL } from "./navidad/Main";
import { SLIppo, SLIPPO_TOTAL } from "./slippo/Main";
import { Genealogia, GENEALOGIA_TOTAL } from "./genealogia/Main";
import { Lazaro, LAZARO_TOTAL } from "./lazaro/Main";
import { SLProy, SLPROY_TOTAL } from "./slproy/Main";
import { SLFuerte, SLFUERTE_TOTAL } from "./slfuerte/Main";
import { Angeles, ANGELES_TOTAL } from "./angeles/Main";
import { Muerte, MUERTE_TOTAL } from "./muerte/Main";
import { Reyes, REYES_TOTAL } from "./reyes/Main";
import { Manzana, MANZANA_TOTAL } from "./manzana/Main";
import { Elias, ELIAS_TOTAL } from "./elias/Main";
import { Gedeon, GEDEON_TOTAL } from "./gedeon/Main";
import { Dv2Demo, DV2_TOTAL } from "./dv2/Demo";
import { Naaman, NAAMAN_TOTAL } from "./naaman/Main";
import { Jerico, JERICO_TOTAL } from "./jerico/Main";
import { SLMob1, SLMob2, SLMOB1_TOTAL, SLMOB2_TOTAL } from "./slmob/Main";
import { Pared, PARED_TOTAL } from "./pared/Main";
import { Gigantes, GIGANTES_TOTAL } from "./gigantes/Main";
import { Jesus, JESUS_TOTAL, Querubin, QUERUBIN_TOTAL } from "./jesus/Main";
import { SLLee2, SLIppo2, SLLEE2_TOTAL, SLIPPO2_TOTAL } from "./slmob/V3";
import { SLSpi1, SLSpi2, SLSPI1_TOTAL, SLSPI2_TOTAL } from "./slmob/Spi";
import { SLLee, SLLEE_TOTAL } from "./sllee/Main";
import { SLGohan, SLGOHAN_TOTAL } from "./slgohan/Main";
import { SLSpider, SLSPIDER_TOTAL } from "./slspider/Main";
import { SLVegeta, SLVEGETA_TOTAL } from "./slvegeta/Main";
import { SLGoku, SLGOKU_TOTAL } from "./slgoku/Main";
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
      <Composition id="David" component={David} durationInFrames={DAVID_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Jonas" component={Jonas} durationInFrames={JONAS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Giants" component={Giants} durationInFrames={GIANTS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="RockLee" component={RockLee} durationInFrames={ROCKLEE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Pedro2" component={Pedro2} durationInFrames={PEDRO2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Thorfinn" component={Thorfinn} durationInFrames={THORFINN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestA" component={SubTest} defaultProps={{ v: "A" as const }} durationInFrames={SUBTEST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestB" component={SubTest} defaultProps={{ v: "B" as const }} durationInFrames={SUBTEST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestC" component={SubTest} defaultProps={{ v: "C" as const }} durationInFrames={SUBTEST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestR1" component={SubTest} defaultProps={{ v: "R1" as const }} durationInFrames={SUBTEST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestR2" component={SubTest} defaultProps={{ v: "R2" as const }} durationInFrames={SUBTEST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestR3" component={SubTest2} defaultProps={{ v: "R3" as const }} durationInFrames={SUBTEST2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SubTestR4" component={SubTest2} defaultProps={{ v: "R4" as const }} durationInFrames={SUBTEST2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Prov" component={Prov} durationInFrames={PROV_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Judas" component={Judas} durationInFrames={JUDAS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Judas3" component={Judas3} durationInFrames={JUDAS3_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZkDarkA" component={ZkDark} defaultProps={{ v: "A" as const }} durationInFrames={DARK_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZkDarkB" component={ZkDark} defaultProps={{ v: "B" as const }} durationInFrames={DARK_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZkRed" component={ZkRed} durationInFrames={RED_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="JudasDark" component={JudasDark} durationInFrames={JUDASDARK_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Sangre" component={Sangre} durationInFrames={SANGRE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Adultera" component={Adultera} durationInFrames={ADULTERA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="AdulteraDark" component={AdulteraDark} durationInFrames={ADULTERA_DARK_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Navidad" component={Navidad} durationInFrames={NAVIDAD_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLIppo" component={SLIppo} durationInFrames={SLIPPO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Genealogia" component={Genealogia} durationInFrames={GENEALOGIA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Lazaro" component={Lazaro} durationInFrames={LAZARO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLProy" component={SLProy} durationInFrames={SLPROY_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLFuerte" component={SLFuerte} durationInFrames={SLFUERTE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Angeles" component={Angeles} durationInFrames={ANGELES_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Muerte" component={Muerte} durationInFrames={MUERTE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Reyes" component={Reyes} durationInFrames={REYES_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Manzana" component={Manzana} durationInFrames={MANZANA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Elias" component={Elias} durationInFrames={ELIAS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Gedeon" component={Gedeon} durationInFrames={GEDEON_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Dv2Demo" component={Dv2Demo} durationInFrames={DV2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Naaman" component={Naaman} durationInFrames={NAAMAN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Jerico" component={Jerico} durationInFrames={JERICO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Pared" component={Pared} durationInFrames={PARED_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Gigantes" component={Gigantes} durationInFrames={GIGANTES_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Jesus" component={Jesus} durationInFrames={JESUS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Querubin" component={Querubin} durationInFrames={QUERUBIN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLLee2" component={SLLee2} durationInFrames={SLLEE2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLIppo2" component={SLIppo2} durationInFrames={SLIPPO2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLSpi1" component={SLSpi1} durationInFrames={SLSPI1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLSpi2" component={SLSpi2} durationInFrames={SLSPI2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLMob1" component={SLMob1} durationInFrames={SLMOB1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLMob1M" component={SLMob1} durationInFrames={SLMOB1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: true }} />
      <Composition id="SLMob2" component={SLMob2} durationInFrames={SLMOB2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLMob2M" component={SLMob2} durationInFrames={SLMOB2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: true }} />
      <Composition id="SLSinTalento" component={SLLee} durationInFrames={SLLEE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLGohan" component={SLGohan} durationInFrames={SLGOHAN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLSpider" component={SLSpider} durationInFrames={SLSPIDER_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLOrgullo" component={SLVegeta} durationInFrames={SLVEGETA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLGoku" component={SLGoku} durationInFrames={SLGOKU_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Ladron" component={Ladron} durationInFrames={LADRON_TOTAL} fps={30} width={1080} height={1920} />
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
