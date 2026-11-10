import React from "react";
import t1 from "../../public/sl-mob1/timeline.json";
import t2 from "../../public/sl-mob2/timeline.json";
import { SLMobCore, TL } from "./Core";

// SL · Mob Psycho 100: dos videos con la plantilla "una sola persona". Versión sin música y con música.
const T1 = t1 as unknown as TL;
const T2 = t2 as unknown as TL;
export const SLMOB1_TOTAL = Math.round(T1.end * 30);
export const SLMOB2_TOTAL = Math.round(T2.end * 30);
const K1 = ["poderoso", "arrasó", "ciudad", "sentía", "hermano", "nada", "rabia", "tristeza", "explotó", "pedazos", "maestro", "mintiéndole", "especial", "fui", "calma", "no", "llora", "destruye", "sientes", "explotar", "débil", "humano"];
const K2 = ["estafador", "poder", "salvarlo", "engañaba", "exorcismos", "verdad", "grande", "creció", "solo", "necesitaba", "estalló", "desastre", "manos", "poderes", "odió", "mentiras", "fraude", "quieren", "ti"];
export const SLMob1: React.FC<{ music?: boolean }> = ({ music }) => <SLMobCore tl={T1} dir="sl-mob1" accent="#3EC8F2" keys={K1} music={music} />;
export const SLMob2: React.FC<{ music?: boolean }> = ({ music }) => <SLMobCore tl={T2} dir="sl-mob2" accent="#2FD18A" keys={K2} music={music} />;
