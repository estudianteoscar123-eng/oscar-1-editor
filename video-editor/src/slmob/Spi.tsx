import React from "react";
import t1 from "../../public/sl-spi1/timeline.json";
import t2 from "../../public/sl-spi2/timeline.json";
import { SLV3Core, TL3 } from "./Core2";

// SL · Spider-Man: Un Nuevo Día — estilo drama (diálogos latinos + narración, blanco y negro en las frases que duelen)
const T1 = t1 as unknown as TL3;
const T2 = t2 as unknown as TL3;
export const SLSPI1_TOTAL = Math.round(T1.end * 30);
export const SLSPI2_TOTAL = Math.round(T2.end * 30);
const K1 = ["nadie", "olvidaran", "desaparecer", "amo", "conozco", "desconocido", "promesa", "peligro", "corazón", "verdad", "vecino"];
const K2 = ["frase", "amo", "dímelo", "café", "palabras", "feliz", "paz", "carta", "verdad", "proteger", "callas"];
export const SLSpi1: React.FC<{ music?: boolean }> = ({ music }) => <SLV3Core tl={T1} dir="sl-spi1" accent="#FF3B3B" keys={K1} cover={["¿Y SI NADIE", "TE RECORDARA?"]} cta="VECINO" music={music} bw={["nadie", "olvidaran", "conozco", "desconocido", "corazón"]} />;
export const SLSpi2: React.FC<{ music?: boolean }> = ({ music }) => <SLV3Core tl={T2} dir="sl-spi2" accent="#3FA9FF" keys={K2} cover={["¿QUÉ IBA", "A DECIRLE?"]} cta="CAFÉ" music={music} bw={["nunca", "café", "carta", "callas"]} />;
