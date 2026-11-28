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
import { Lucifer, LUCIFER_TOTAL, Nombre, NOMBRE_TOTAL } from "./jesus/ZK3";
import { Serpiente, SERPIENTE_TOTAL, Gehena, GEHENA_TOTAL } from "./jesus/ZK5";
import { ToonTest } from "./k3/ToonTest";
import { RefTest } from "./k3/RefTest";
import { Judas3D, JUDAS3D_TOTAL } from "./judas3d/Main";
import { KingTest } from "./k3/KingTest";
import { King25 } from "./k3/King25";
import { Lucero, LUCERO_TOTAL } from "./lucero/Main";
import { Abismo, ABISMO_TOTAL, Legion, LEGION_TOTAL } from "./jesus/ZK6";
import { SLLee2, SLIppo2, SLLEE2_TOTAL, SLIPPO2_TOTAL } from "./slmob/V3";
import { SLSpi1, SLSpi2, SLSPI1_TOTAL, SLSPI2_TOTAL } from "./slmob/Spi";
import { Pascua } from "./yt/Pascua";
import { ZKLargo, ZKL_TOTAL } from "./yt/ZKLargo";
import { ReelYsi, REEL1_TOTAL } from "./yt/ReelYsi";
import { RigTest } from "./yt/Rig2";
import { RigTest2 } from "./yt/RigTest2";
import { Antes, Despues, AD_TOTAL } from "./yt/AntesDespues";
import { Est1ZK, Est2Ref, Est3Ysi, EST3_TOTAL } from "./yt/Estilos3";
import { RefNoe100, RefNoeDark, REFNOE_TOTAL } from "./yt/RefNoe";
import { ZKNoe, ZKNOE_TOTAL, ZKCana, ZKCANA_TOTAL } from "./yt/ZK9";
import { ZKGoliat, ZKGOL_TOTAL } from "./yt/ZK10";
import { ZKSanson, ZKSAN_TOTAL, ZKGedeon, ZKGED_TOTAL } from "./yt/ZK11";
import { ZKMoises, ZKMOI_TOTAL, ZKJonas, ZKJON_TOTAL } from "./yt/ZK12";
import { ZKSalomon, ZKSAL_TOTAL, ZKSansonFin, ZKSNS_TOTAL } from "./yt/ZK13";
import { ZKJuan, ZKJUAN_TOTAL, ZKDavid, ZKDAVID_TOTAL } from "./yt/ZK14";
import { SubsA, SubsB, SUBS_TOTAL } from "./sl/SubsTest";
import { SL15, SL15_TOTAL } from "./sl/SL15";
import { SLV1, SLV1_TOTAL, SLV2, SLV2_TOTAL, SLStoic, SLST_TOTAL } from "./sl/SLVideo";
import { YReel, YREEL_TOTAL } from "./yt/YReel";
import { Gigante, GIG_TOTAL } from "./yt/Gigante";
import { ZKGigante, ZKGIG_TOTAL } from "./jesus/ZK7";
import { ZKGigante2, ZKGIG2_TOTAL, ZKAngel, ZKANG_TOTAL } from "./jesus/ZK8";
import { ThumbA, ThumbB } from "./yt/Thumb";
import { ThumbC, ThumbD } from "./yt/Thumb2";
import { DemoPersonaje, DemoEscena, DemoCamara } from "./yt/Demo";
import { SLCine1, SLCine2, SLCINE1_TOTAL, SLCINE2_TOTAL } from "./slmob/Cine";
import { SLRocky, SLNaruto, SLROCKY_TOTAL, SLNARUTO_TOTAL } from "./slmob/Drama";
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
      <Composition id="Lucifer" component={Lucifer} durationInFrames={LUCIFER_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Nombre" component={Nombre} durationInFrames={NOMBRE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Serpiente" component={Serpiente} durationInFrames={SERPIENTE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Gehena" component={Gehena} durationInFrames={GEHENA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ToonTest" component={ToonTest} durationInFrames={60} fps={30} width={1080} height={1920} />
      <Composition id="RefTest" component={RefTest} durationInFrames={60} fps={30} width={1080} height={1920} />
      <Composition id="Judas3D" component={Judas3D} durationInFrames={JUDAS3D_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="KingTest" component={KingTest} durationInFrames={30} fps={30} width={1080} height={1920} />
      <Composition id="King25" component={King25} durationInFrames={60} fps={30} width={1080} height={1920} />
      <Composition id="Lucero" component={Lucero} durationInFrames={LUCERO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Abismo" component={Abismo} durationInFrames={ABISMO_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Legion" component={Legion} durationInFrames={LEGION_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLLee2" component={SLLee2} durationInFrames={SLLEE2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLIppo2" component={SLIppo2} durationInFrames={SLIPPO2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLSpi1" component={SLSpi1} durationInFrames={SLSPI1_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLSpi2" component={SLSpi2} durationInFrames={SLSPI2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="SLRocky" component={SLRocky} durationInFrames={SLROCKY_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
      <Composition id="ZKGigante2" component={ZKGigante2} durationInFrames={ZKGIG2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKAngel" component={ZKAngel} durationInFrames={ZKANG_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKGigante" component={ZKGigante} durationInFrames={ZKGIG_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Gigante" component={Gigante} durationInFrames={GIG_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="YReelYT" component={YReel} durationInFrames={YREEL_TOTAL} fps={30} width={1920} height={1080} defaultProps={{ vertical: false }} />
      <Composition id="YReelShort" component={YReel} durationInFrames={YREEL_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ vertical: true }} />
      <Composition id="Est1ZK" component={Est1ZK} durationInFrames={EST3_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLStoic" component={SLStoic} durationInFrames={SLST_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLV1" component={SLV1} durationInFrames={SLV1_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLV2" component={SLV2} durationInFrames={SLV2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SL15" component={SL15} durationInFrames={SL15_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLSubsA" component={SubsA} durationInFrames={SUBS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLSubsB" component={SubsB} durationInFrames={SUBS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKJuan" component={ZKJuan} durationInFrames={ZKJUAN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKDavid" component={ZKDavid} durationInFrames={ZKDAVID_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKSalomon" component={ZKSalomon} durationInFrames={ZKSAL_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKSansonFin" component={ZKSansonFin} durationInFrames={ZKSNS_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKMoises" component={ZKMoises} durationInFrames={ZKMOI_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKJonas" component={ZKJonas} durationInFrames={ZKJON_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKSanson" component={ZKSanson} durationInFrames={ZKSAN_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKGedeon" component={ZKGedeon} durationInFrames={ZKGED_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKGoliat" component={ZKGoliat} durationInFrames={ZKGOL_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKNoe" component={ZKNoe} durationInFrames={ZKNOE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKCana" component={ZKCana} durationInFrames={ZKCANA_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="RefNoe100" component={RefNoe100} durationInFrames={REFNOE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="RefNoeDark" component={RefNoeDark} durationInFrames={REFNOE_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Est2Ref" component={Est2Ref} durationInFrames={EST3_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Est3Ysi" component={Est3Ysi} durationInFrames={EST3_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Antes" component={Antes} durationInFrames={AD_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="Despues" component={Despues} durationInFrames={AD_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="RigTest2" component={RigTest2} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="RigTest" component={RigTest} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ReelYsi" component={ReelYsi} durationInFrames={REEL1_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="ZKLargo" component={ZKLargo} durationInFrames={ZKL_TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="ThumbD" component={ThumbD} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbC" component={ThumbC} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="Pascua" component={Pascua} durationInFrames={9252} fps={30} width={1920} height={1080} defaultProps={{ vertical: false, from: 0 }} />
      <Composition id="PascuaS1" component={Pascua} durationInFrames={1779} fps={30} width={1080} height={1920} defaultProps={{ vertical: true, from: 0 }} />
      <Composition id="PascuaS2" component={Pascua} durationInFrames={1263} fps={30} width={1080} height={1920} defaultProps={{ vertical: true, from: 59.3 }} />
      <Composition id="PascuaS3" component={Pascua} durationInFrames={1959} fps={30} width={1080} height={1920} defaultProps={{ vertical: true, from: 197.8 }} />
      <Composition id="YTPersonaje" component={DemoPersonaje} durationInFrames={300} fps={60} width={1920} height={1080} />
      <Composition id="YTEscena" component={DemoEscena} durationInFrames={300} fps={60} width={1920} height={1080} />
      <Composition id="YTCamara" component={DemoCamara} durationInFrames={300} fps={60} width={1920} height={1080} />
      <Composition id="SLCine1" component={SLCine1} durationInFrames={SLCINE1_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLCine2" component={SLCine2} durationInFrames={SLCINE2_TOTAL} fps={30} width={1080} height={1920} />
      <Composition id="SLNaruto" component={SLNaruto} durationInFrames={SLNARUTO_TOTAL} fps={30} width={1080} height={1920} defaultProps={{ music: false }} />
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
