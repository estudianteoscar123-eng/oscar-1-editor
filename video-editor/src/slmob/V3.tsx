import React from "react";
import t1 from "../../public/sl-lee2/timeline.json";
import t2 from "../../public/sl-ippo2/timeline.json";
import { SLV3Core, TL3 } from "./Core2";

// SL v3 · Rock Lee 2 (verde) e Ippo 2 (rojo)
const T1 = t1 as unknown as TL3;
const T2 = t2 as unknown as TL3;
export const SLLEE2_TOTAL = Math.round(T1.end * 30);
export const SLIPPO2_TOTAL = Math.round(T2.end * 30);
const K1 = ["perdedor", "inútil", "romperte", "talento", "entrenar", "genio", "alma", "frase", "falló", "ti", "rindo", "seguir", "puerta", "vida"];
const K2 = ["humillaron", "gusanos", "perdón", "frase", "miedo", "grandioso", "debiluchos", "persona", "fuerte", "permiso", "empiezas"];
export const SLLee2: React.FC<{ music?: boolean }> = ({ music }) => <SLV3Core tl={T1} dir="sl-lee2" accent="#2EE87A" keys={K1} cover={["¿Y SI TU ESFUERZO", "ES INÚTIL?"]} cta="NO ME RINDO" music={music} />;
export const SLIppo2: React.FC<{ music?: boolean }> = ({ music }) => <SLV3Core tl={T2} dir="sl-ippo2" accent="#FF3B3B" keys={K2} cover={["¿QUIERES SER", "OTRA PERSONA?"]} cta="OTRA PERSONA" music={music} />;
