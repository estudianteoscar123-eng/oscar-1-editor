import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import ds from "../../public/zk11/sanson.json";
import dgd from "../../public/zk11/gedeon.json";
import { FPS, KFONT, groupWords } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, cl, io } from "./RefNoe";
import { Defs, Pill, Sfx, Speed, Valley, kick, nrm, shake } from "./ZK10";

// Shorts ZK · sistema "dopamina": un plano nuevo cada ~1,5 s, ángulos distintos, golpes de cámara,
// sonido en cada acción, cifras como etiquetas, música en su parte fuerte desde el cuadro 0, final que vuelve al inicio.
const RED = "#D30F17";
const P = DARK;
type R = { chunks: { text: string; timestamp: [number, number] }[] };
type Wd = { w: string; s: number; e: number };
const words = (d: unknown, fix: Record<string, string> = {}): Wd[] =>
  (d as R).chunks.map((c) => { const w = c.text.trim(); const k = w.replace(/[^\wáéíóúñÁÉÍÓÚÑ]/g, ""); return { w: fix[k] ? w.replace(k, fix[k]) : w, s: Math.max(0, c.timestamp[0] - 0.04), e: c.timestamp[1] }; });
const finder = (W: Wd[]) => (k: string | string[], nth = 0, d = -1) => {
  for (const kk of Array.isArray(k) ? k : [k]) { const v = W.filter((w) => nrm(w.w).startsWith(nrm(kk)))[nth]?.s; if (v !== undefined) return v; }
  return d;
};
const shotOf = (cuts: number[], t: number) => { let i = 0; while (i < cuts.length - 1 && t >= cuts[i + 1]) i++; return i; };

const Cap: React.FC<{ f: number; W: Wd[]; keys: Set<string> }> = ({ f, W, keys }) => {
  const t = f / FPS, groups = groupWords(W);
  const gi = groups.findIndex((g, i) => t >= (i === 0 ? 0 : g[0].s - 0.06) && t < (groups[i + 1]?.[0].s ?? 999) - 0.06);
  if (gi < 0) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 70, right: 70, textAlign: "center", fontFamily: KFONT, fontWeight: 700, fontSize: 64, lineHeight: 1.3, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>
      {groups[gi].map((w, i) => {
        const on = t >= w.s - 0.06 || (gi === 0 && i === 0), k = on && keys.has(nrm(w.w));
        const pop = k ? 1 + kick(t, w.s - 0.06, 0.25, 12) : 1;
        return (
          <React.Fragment key={i}>
            {i ? " " : ""}
            <span style={{ display: "inline-block", transform: `scale(${pop})`, opacity: on ? 1 : 0.4, padding: k ? "0 12px" : undefined, background: k ? RED : undefined, borderRadius: 6 }}>{w.w}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Marco común: corte con "barrido", golpe de zoom al entrar, grano, subtítulo, voz y música
const Frame: React.FC<{ f: number; cuts: number[]; T: number; W: Wd[]; keys: Set<string>; voice: string; song: string; songFrom: number; children: (i: number, lt: number, dur: number) => React.ReactNode }> = ({ f, cuts, T, W, keys, voice, song, songFrom, children }) => {
  const t = f / FPS, i = shotOf(cuts, t), lt = t - cuts[i], dur = (cuts[i + 1] ?? T) - cuts[i];
  const punch = 1 + kick(lt, 0, 0.1, 9);
  const whip = i > 0 ? 1 - io(lt, 0, 0.13) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${whip * (i % 2 ? 260 : -260)}px) scale(${punch})`, filter: whip > 0.05 ? `blur(${whip * 14}px)` : undefined }}>
        {children(i, lt, dur)}
      </AbsoluteFill>
      <Film f={f} p={P} />
      <Cap f={f} W={W} keys={keys} />
      <Audio src={staticFile(voice)} />
      <Audio src={staticFile(song)} trimBefore={Math.round(songFrom * FPS)} volume={(fr) => 0.3 * (1 - io(fr / FPS, T - 0.4, T))} />
      {cuts.slice(1).map((c, k) => <Sfx key={k} at={c - 0.12} src="whoosh" vol={0.5} />)}
    </AbsoluteFill>
  );
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}><Defs />{children}</svg>
);

// ---------------- personajes ----------------
// soldado filisteo (tocado de plumas, escudo redondo, lanza); pies en (0,0), ~300 de alto
const Soldier: React.FC<{ x: number; y: number; s: number; t: number; run?: boolean; face?: 1 | -1; down?: number }> = ({ x, y, s, t, run, face = 1, down = 0 }) => {
  const ph = run ? Math.sin(t * 16 + x * 0.1) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s}) rotate(${down * 88} 0 0)`}>
      <ellipse cx={0} cy={2} rx={60} ry={10} fill="rgba(0,0,0,0.5)" />
      <path d={`M-14 -110 L ${-22 + ph * 22} 0 M 14 -110 L ${22 - ph * 22} 0`} stroke="#0C0709" strokeWidth={20} strokeLinecap="round" />
      <path d="M-34 -230 L 34 -230 L 40 -100 L -40 -100 Z" fill="#1E1418" />
      <path d="M34 -230 L 40 -100" stroke={P.rim} strokeWidth={4} />
      <circle cx={0} cy={-262} r={26} fill="#2A1A14" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-24 + i * 8} -280 L ${-30 + i * 10} -330`} stroke="#3A2A2A" strokeWidth={6} strokeLinecap="round" />)}
      <circle cx={-38} cy={-170} r={42} fill="#2A1C16" stroke="#5A3A20" strokeWidth={5} />
      <path d={`M40 ${-330 + ph * 6} L 52 ${-30 + ph * 6}`} stroke="#2A1A10" strokeWidth={7} />
      <path d={`M36 ${-350 + ph * 6} L 40 ${-325 + ph * 6} L 46 ${-350 + ph * 6} Z`} fill="#8A8690" />
    </g>
  );
};
// Sansón de espaldas: pelo largo en 7 trenzas, hombros anchos; pies en (0,0), ~1500 de alto
const SamsonBack: React.FC<{ t: number; arms?: number; jaw?: boolean }> = ({ t, arms = 0, jaw }) => (
  <g>
    <ellipse cx={0} cy={6} rx={300} ry={40} fill="rgba(0,0,0,0.6)" />
    <path d="M-120 -700 L -150 0 L -40 0 L 0 -520 L 40 0 L 150 0 L 120 -700 Z" fill="#160E0C" />
    <path d="M-150 -760 L 150 -760 L 140 -660 L -140 -660 Z" fill="#3A1A12" />
    <path d="M-290 -1260 Q -300 -1000 -170 -760 L 170 -760 Q 300 -1000 290 -1260 Q 0 -1330 -290 -1260 Z" fill="#5A3A28" />
    <path d="M-290 -1260 Q -300 -1000 -170 -760 L -40 -760 Q -120 -1000 -80 -1290 Z" fill="#3A2418" />
    <path d="M0 -1250 L 0 -800" stroke="#3A2418" strokeWidth={8} opacity={0.7} />
    <path d="M290 -1260 Q 300 -1000 170 -760" stroke={P.rim} strokeWidth={7} fill="none" />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`rotate(${-sd * arms * 140} ${sd * 280} -1240)`}>
        <path d={`M${sd * 270} -1270 Q ${sd * 400} -1100 ${sd * 380} -800 L ${sd * 300} -790 Q ${sd * 300} -1050 ${sd * 210} -1200 Z`} fill="#5A3A28" />
        <ellipse cx={sd * 345} cy={-770} rx={48} ry={56} fill="#4A2E20" />
        {sd > 0 ? <path d="M400 -1100 Q 395 -900 380 -800" stroke={P.rim} strokeWidth={6} fill="none" /> : null}
        {sd > 0 && jaw ? <g transform="translate(350 -700) rotate(80) scale(0.75)"><Jaw /></g> : null}
      </g>
    ))}
    <rect x={-70} y={-1400} width={140} height={150} fill="#3A2418" />
    <ellipse cx={0} cy={-1470} rx={115} ry={130} fill="#120A08" />
    {Array.from({ length: 7 }, (_, i) => {
      const x0 = -90 + i * 30, sw = Math.sin(t * 2 + i) * 8;
      return <path key={i} d={`M${x0} -1420 Q ${x0 + sw - 10} -1250 ${x0 * 1.3 + sw} -1050`} stroke="#0C0605" strokeWidth={26} strokeLinecap="round" fill="none" />;
    })}
  </g>
);
const Jaw: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-300 40 Q -280 -40 -120 -50 L 180 -60 Q 260 -70 300 -160 Q 330 -230 290 -280 L 330 -300 Q 380 -200 330 -80 Q 300 10 200 40 L -200 80 Q -290 90 -300 40 Z" fill="#D8CDB8" />
    <path d="M-300 40 Q -290 90 -200 80 L 200 40 Q 300 10 330 -80" stroke="#7A6E5C" strokeWidth={10} fill="none" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-250 + i * 48} -46 l 12 -36 l 26 0 l 8 34 Z`} fill="#EFE6D2" stroke="#7A6E5C" strokeWidth={4} />)}
    <path d="M300 -160 Q 330 -230 290 -280" stroke={P.rim} strokeWidth={8} fill="none" />
    <path d="M-160 20 Q 0 0 160 -10" stroke="#8A7A64" strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);

// ======================== SANSÓN ========================
const WS = words(ds, { Sanson: "Sansón" });
const FS = finder(WS);
export const ZKSAN_TOTAL = Math.round((WS[WS.length - 1].e + 0.45) * FPS);
const sMil = FS("mil", 0, 1.2), sUni = FS(["unica", "su"], 0, 2.2), sHue = FS("hueso", 0, 3.6), sSan = FS(["sanson"], 0, 5.0);
const sFil = FS("filisteos", 0, 7.4), sQue = FS("quemaron", 0, 9.4) - 0.6, sFue = FS("fuego", 0, 10.6), sAga = FS(["agarro", "agarr"], 0, 11.6);
const sFre = FS("fresca", 0, 13.2), sTer = FS(["termino", "cuando"], 0, 14.2), sMil2 = FS("mil", 1, 15.2), sSue = FS("suelo", 0, 16.4);
const sCu2 = FS("cuerdas", 1, 11.7), sTod = FS("todavia", 0, 16.7);
const SCUTS = [0, sMil, sUni, sSan, sFil, sCu2 - 0.1, sAga, sTod - 0.1, sTer - 0.3];

export const ZKSanson: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKSAN_TOTAL / FPS;
  return (
    <>
      <Frame f={f} cuts={SCUTS} T={T} W={WS} keys={new Set(["hombre", "mil", "arma", "hueso", "burro", "sanson", "cuerdas", "filisteos", "fuego", "quijada", "suelo"])} voice="zk11/sanson.wav" song="zk/songs/short2.mp3" songFrom={80}>
        {(i, lt, dur) => {
          if (i === 0) { // de espaldas: un hombre frente al ejército
            const z = 1.35 - lt * 0.18;
            return (
              <Svg>
                <g transform={`translate(540 1300) scale(${z}) translate(-540 -1300)`}>
                  <Valley t={t} />
                  {Array.from({ length: 260 }, (_, k) => { const row = Math.floor(k / 26), col = k % 26; const y = 1300 + row * 14, s = 0.07 + row * 0.012; return <Soldier key={k} x={-80 + col * 48 + (row % 2) * 24 + rnd(k) * 10} y={y} s={s} t={t} />; })}
                  <g transform={`translate(540 1960) scale(0.82)`}><SamsonBack t={t} /></g>
                </g>
                <Pill x={540} y={620} txt="1 vs 1.000" on={io(lt, 0.15, 0.35)} big />
              </Svg>
            );
          }
          if (i === 1) { // contraplano: el muro de soldados que se viene encima
            const [sx, sy] = shake(t, 8);
            return (
              <Svg>
                <g transform={`translate(${sx} ${sy})`}>
                  <rect width={1080} height={1920} fill="url(#gsky)" />
                  <rect y={1050} width={1080} height={870} fill="url(#gground)" />
                  {Array.from({ length: 8 }, (_, row) => Array.from({ length: 9 - Math.floor(row / 3) }, (_, col) => {
                    const adv = lt * 0.5, d = row / 8 + adv, s = 0.4 + d * d * 2.4, y = 1060 + d * d * 1100;
                    const n = 9 - Math.floor(row / 3);
                    return <Soldier key={`${row}-${col}`} x={540 + (col - (n - 1) / 2) * (110 + d * 380)} y={y} s={s} t={t} run />;
                  })).reverse()}
                </g>
                <Speed t={t} n={40} op={0.35} />
              </Svg>
            );
          }
          if (i === 2) { // la quijada: el arma
            const z = 1 + kick(t, sHue, 0.35, 8), rot = -18 + lt * 10;
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#05050A" />
                <circle cx={540} cy={1060} r={520} fill="url(#rglowg)" opacity={0.5 + kick(t, sHue, 0.5, 4)} />
                <g transform={`translate(540 1080) rotate(${rot}) scale(${z * (0.9 + io(lt, 0, dur) * 0.25)})`}><Jaw s={1.25} /></g>
                <Pill x={540} y={1480} txt="QUIJADA DE BURRO" on={io(t, sHue, sHue + 0.25)} big />
              </Svg>
            );
          }
          if (i === 3) { // muñecas atadas
            const strain = Math.sin(t * 30) * 3 * io(lt, 0.3, dur);
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#07060A" />
                <g transform={`translate(${540 + strain} 1150) rotate(-8) scale(${1.1 + lt * 0.08})`}>
                  <path d="M-560 -40 Q -200 -90 -10 -60 L -10 60 Q -200 90 -560 60 Z" fill="#5A3A28" />
                  <path d="M560 -40 Q 200 -90 10 -60 L 10 60 Q 200 90 560 60 Z" fill="#4A2E20" />
                  <path d="M560 -40 Q 200 -90 10 -60" stroke={P.rim} strokeWidth={6} fill="none" />
                  {Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={-120 + k * 30} cy={0} rx={22} ry={80} fill="#8A6A3A" stroke="#3A2A12" strokeWidth={6} />)}
                  {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${-125 + k * 30} -70 L ${-110 + k * 30} 70`} stroke="#C8A060" strokeWidth={4} opacity={0.6} />)}
                </g>
                <Pill x={540} y={1450} txt="2 CUERDAS NUEVAS" on={io(lt, 0.4, 0.6)} big />
              </Svg>
            );
          }
          if (i === 4) { // a ras de suelo: corren a matarlo
            const [sx, sy] = shake(t, 12);
            return (
              <Svg>
                <g transform={`translate(${sx} ${sy})`}>
                  <rect width={1080} height={1920} fill="url(#gsky)" />
                  <rect y={980} width={1080} height={940} fill="url(#gground)" />
                  {Array.from({ length: 14 }, (_, k) => {
                    const ph = ((lt * 0.9 + k / 14) % 1), s = 0.3 + ph * ph * 4.2, y = 1000 + ph * ph * 1400;
                    return <Soldier key={k} x={540 + (rnd(k + 3) - 0.5) * (300 + ph * 1800)} y={y} s={s} t={t} run face={rnd(k) > 0.5 ? 1 : -1} />;
                  }).sort(() => 0)}
                  {Array.from({ length: 20 }, (_, k) => <circle key={k} cx={rnd(k + 40) * 1080} cy={1500 + rnd(k + 41) * 400} r={30 + rnd(k) * 60} fill="#2A1C1C" opacity={0.4} />)}
                </g>
                <Speed t={t} n={50} op={0.45} />
                <Pill x={540} y={700} txt="FILISTEOS" on={io(lt, 0.1, 0.3)} />
              </Svg>
            );
          }
          if (i === 5) { // las cuerdas arden y se rompen
            const burn = io(t, sQue + 0.5, sFue + 0.2), snap = t >= sFue + 0.2;
            const [sx, sy] = shake(t, kick(t, sFue + 0.2, 30, 5) + 4 * burn);
            const spread = snap ? io(t, sFue + 0.2, sFue + 0.45) : 0;
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#07060A" />
                <circle cx={540} cy={1150} r={500 * (0.5 + burn)} fill="url(#rglowg)" />
                <g transform={`translate(${540 + sx} ${1150 + sy}) rotate(-8) scale(1.2)`}>
                  <g transform={`translate(${-spread * 260} ${-spread * 120}) rotate(${-spread * 20})`}><path d="M-560 -40 Q -200 -90 -10 -60 L -10 60 Q -200 90 -560 60 Z" fill="#5A3A28" /></g>
                  <g transform={`translate(${spread * 260} ${-spread * 120}) rotate(${spread * 20})`}><path d="M560 -40 Q 200 -90 10 -60 L 10 60 Q 200 90 560 60 Z" fill="#4A2E20" /></g>
                  {!snap ? Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={-120 + k * 30} cy={0} rx={22} ry={80} fill={burn > 0.5 ? "#2A1408" : "#8A6A3A"} stroke={burn > 0.2 ? "#FF6A20" : "#3A2A12"} strokeWidth={6 + burn * 6} />) : null}
                  {Array.from({ length: 40 }, (_, k) => {
                    const life = ((t * 1.6 + rnd(k)) % 1);
                    return <circle key={k} cx={-140 + rnd(k + 9) * 280 + (snap ? (rnd(k + 2) - 0.5) * 900 * spread : 0)} cy={60 - life * 420} r={(6 + rnd(k + 5) * 14) * (1 - life)} fill={k % 3 ? "#FF7A2A" : "#FFC04A"} opacity={burn * (1 - life)} />;
                  })}
                </g>
                <rect width={1080} height={1920} fill="#fff" opacity={snap && t - sFue - 0.2 < 0.07 ? 0.6 : 0} />
              </Svg>
            );
          }
          if (i === 6) { // cenital: la mano agarra la quijada en la arena
            const grab = io(lt, 0.15, 0.55), lift = io(t, sFre - 0.2, sFre + 0.4);
            return (
              <Svg>
                <g transform={`translate(540 960) rotate(${lt * 5}) scale(${1.05 + lt * 0.06}) translate(-540 -960)`}>
                  <rect x={-400} y={-400} width={1880} height={2720} fill="#2A1E18" />
                  {Array.from({ length: 220 }, (_, k) => <circle key={k} cx={-200 + rnd(k) * 1500} cy={-200 + rnd(k + 1) * 2300} r={2 + rnd(k + 2) * 6} fill={k % 2 ? "#3A2C24" : "#1E1410"} />)}
                  <g transform={`translate(540 ${1100 - lift * 260}) rotate(${-20 + lift * 25}) scale(${1 + lift * 0.3})`}>
                    <ellipse cx={20} cy={40} rx={330} ry={60} fill="rgba(0,0,0,0.5)" opacity={1 - lift} />
                    <Jaw s={0.95} />
                    <g transform={`translate(${-40} ${-760 + grab * 700})`}>
                      <path d="M-70 -900 Q -80 -400 -95 -120 Q -110 -40 -60 10 L 70 10 Q 110 -40 100 -120 Q 85 -400 80 -900 Z" fill="#5A3A28" />
                      <path d="M-70 -900 Q -80 -400 -95 -120 Q -110 -40 -60 10 L -20 10 Q -40 -300 -20 -900 Z" fill="#3A2418" />
                      <path d="M80 -900 Q 85 -400 100 -120" stroke={P.rim} strokeWidth={6} fill="none" />
                      {[0, 1, 2, 3].map((q) => <path key={q} d={`M${-70 + q * 44} 0 q -6 ${60 + grab * 20} ${18} ${70 + grab * 20} q 22 -4 20 -70 Z`} fill="#5A3A28" stroke="#3A2418" strokeWidth={4} />)}
                      <path d="M95 -110 q 60 30 50 110 q -20 20 -40 -10 Z" fill="#4A2E20" />
                    </g>
                  </g>
                </g>
                <Pill x={540} y={1560} txt="JUECES 15:15" on={io(lt, 0.3, 0.5)} />
              </Svg>
            );
          }
          if (i === 7) { // contrapicado: Sansón alza la quijada contra el cielo rojo
            const up = io(lt, 0, 0.5);
            const flash = Math.sin(t * 9) > 0.93 ? 1 : 0;
            return (
              <Svg>
                <g transform={`translate(540 1920) scale(${1.25 + lt * 0.08}) rotate(${-2 + lt * 2}) translate(-540 -1920)`}>
                  <Valley t={t} />
                  <rect width={1080} height={1920} fill={RED} opacity={0.15 + flash * 0.2} />
                  <g transform="translate(540 2080) scale(0.68)"><SamsonBack t={t} arms={up} jaw /></g>
                </g>
              </Svg>
            );
          }
          // aérea: mil en el suelo, contador
          const n = Math.round(1000 * io(t, sTer, sSue + 0.3));
          const [sx, sy] = shake(t, 4 + kick(t, sMil2, 16, 5));
          return (
            <Svg>
              <g transform={`translate(${540 + sx} ${1100 + sy}) rotate(${lt * 4}) scale(${1.5 - io(lt, 0, dur) * 0.75}) translate(-540 -1100)`}>
                <rect x={-1500} y={-1500} width={4080} height={5000} fill="#1C1214" />
                {Array.from({ length: 50 }, (_, k) => <circle key={k} cx={-800 + rnd(k + 70) * 2700} cy={-500 + rnd(k + 71) * 3200} r={20 + rnd(k) * 40} fill="#140C0E" />)}
                {Array.from({ length: 220 }, (_, k) => {
                  const ring = Math.floor(k / 22), a = (k % 22) / 22 * Math.PI * 2 + ring * 0.4, r = 170 + ring * 120 + rnd(k) * 60;
                  const show = k / 220 < n / 1000;
                  return show ? <g key={k} transform={`translate(${540 + Math.cos(a) * r} ${1100 + Math.sin(a) * r}) rotate(${a * 57 + 90})`}><rect x={-14} y={-46} width={28} height={92} rx={12} fill="#0A0608" /><circle cx={0} cy={-58} r={15} fill="#0A0608" /></g> : null;
                })}
                <circle cx={540} cy={1100} r={46} fill="#5A3A28" stroke={P.rim} strokeWidth={6} />
                <circle cx={540} cy={1100} r={30} fill="#120A08" />
                <circle cx={540} cy={1100} r={200} fill="none" stroke={RED} strokeWidth={4} opacity={0.6} />
              </g>
              <text x={540} y={1560} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={190} fill="#fff" style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.9))" }}>{n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
              <Pill x={540} y={1680} txt="JUECES 15:16" on={io(t, sSue, sSue + 0.3)} />
            </Svg>
          );
        }}
      </Frame>
      <Sfx at={0} src="crowd" vol={0.7} />
      <Sfx at={0} src="boom" vol={0.8} />
      <Sfx at={sMil} src="crowd" vol={0.9} />
      <Sfx at={sHue} src="hit" vol={0.9} />
      <Sfx at={sFil} src="crowd" vol={0.9} />
      <Sfx at={sQue + 0.5} src="fire" vol={0.9} />
      <Sfx at={sFue + 0.2} src="boom" vol={1} />
      <Sfx at={sFre} src="whoosh" vol={0.6} />
      {Array.from({ length: 10 }, (_, k) => <Sfx key={k} at={sTer + k * ((sSue + 0.3 - sTer) / 10)} src="hit" vol={0.35} />)}
      <Sfx at={sMil2} src="boom" vol={0.9} />
    </>
  );
};

// ======================== GEDEÓN ========================
const WG = words(dgd, { Gedeon: "Gedeón" });
const FG = finder(WG);
export const ZKGED_TOTAL = Math.round((WG[WG.length - 1].e + 0.45) * FPS);
const gDios = FG("dios", 0, 2.4), gDem = FG("demasiados", 0, 3.6), gRed = FG("redujo", 0, 4.6), gTre = FG(["trescientos", "300"], 0, 5.3);
const gCon = FG("contra", 0, 6.4), gCie = FG(["ciento", "135"], 0, 6.8), gMan = FG("manos", 0, 8.6), gTrom = FG("trompetas", 0, 9.0);
const gCan = FG("cantaros", 0, 9.6), gAnt = FG("antorchas", 0, 10.4), gMed = FG("medianoche", 0, 11.6), gRom = FG("rompieron", 0, 12.6);
const gEne = FG("enemigo", 0, 14.0), gMat = FG("mato", 0, 14.8);
const GCUTS = [0, gDios, gRed, gCon, gMan - 0.25, gCan - 0.1, gAnt - 0.1, gMed, gRom, gEne - 0.2];

const ArmyGrid: React.FC<{ keep: number; red?: boolean; t: number }> = ({ keep, red, t }) => (
  <g>
    <defs>
      <pattern id="army" width={18} height={18} patternUnits="userSpaceOnUse"><circle cx={9} cy={7} r={3} fill="#B8B0A4" /><rect x={6} y={10} width={6} height={7} rx={2} fill="#8A8478" /></pattern>
      <radialGradient id="keep"><stop offset="0%" stopColor="#fff" /><stop offset="85%" stopColor="#fff" /><stop offset="100%" stopColor="#000" /></radialGradient>
      <mask id="armymask"><rect x={-2000} y={-2000} width={5080} height={5920} fill="#000" /><circle cx={540} cy={1060} r={60 + keep * 2400} fill="url(#keep)" /></mask>
    </defs>
    <rect x={-2000} y={-2000} width={5080} height={5920} fill="url(#army)" mask="url(#armymask)" opacity={0.9} />
    {red ? Array.from({ length: 300 }, (_, k) => { const a = rnd(k) * Math.PI * 2, r = Math.sqrt(rnd(k + 1)) * 120; return <circle key={k} cx={540 + Math.cos(a) * r} cy={1060 + Math.sin(a) * r} r={4.5} fill={RED} opacity={0.6 + 0.4 * Math.sin(t * 6 + k)} />; }) : null}
  </g>
);
const Camp: React.FC<{ t: number; chaos?: number }> = ({ t, chaos = 0 }) => (
  <g>
    <rect x={-1000} y={-1000} width={3080} height={2300} fill="url(#gsky)" />
    <ellipse cx={540} cy={1250} rx={1400} ry={300} fill="url(#rglowg)" opacity={0.6 + chaos * 0.4} />
    <rect x={-1000} y={1180} width={3080} height={1200} fill="url(#gground)" />
    {Array.from({ length: 260 }, (_, k) => {
      const row = Math.floor(k / 26), col = k % 26, d = row / 10, y = 1190 + d * d * 700, s = 0.15 + d * d * 1.2;
      const x = -300 + col * 66 + (row % 2) * 33 + rnd(k) * 20;
      const fire = k % 4 === 0;
      return (
        <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-60 0 L 0 -70 L 60 0 Z" fill="#3A2A2E" /><path d="M0 -70 L 60 0 L 10 0 Z" fill="#1E1418" /><path d="M0 -70 L 60 0" stroke={P.rim} strokeWidth={3} opacity={0.8} />
          {fire ? <><circle cx={90} cy={-10} r={40} fill="url(#rglowg)" /><path d={`M80 0 Q 90 ${-40 - Math.sin(t * 9 + k) * 8} 100 0 Z`} fill="#FF7A2A" /></> : null}
        </g>
      );
    })}
  </g>
);
const Jar: React.FC<{ broken?: number; t: number }> = ({ broken = 0, t }) => (
  <g>
    <circle cx={0} cy={-200} r={260 * broken} fill="url(#rglowg)" />
    {broken > 0 ? <path d={`M-40 -60 Q 0 ${-330 - Math.sin(t * 12) * 20} 40 -60 Z`} fill="#FF8A2A" opacity={broken} /> : null}
    {broken > 0 ? <path d={`M-20 -60 Q 0 ${-230 - Math.sin(t * 15) * 15} 20 -60 Z`} fill="#FFD06A" opacity={broken} /> : null}
    {Array.from({ length: 8 }, (_, k) => {
      const a = (k / 8) * Math.PI * 2, dx = Math.cos(a) * 600 * broken, dy = Math.sin(a) * 400 * broken - 200 * broken + 600 * broken * broken;
      return (
        <g key={k} transform={`translate(${dx} ${dy}) rotate(${broken * (rnd(k) - 0.5) * 400})`} opacity={1 - broken * 0.3}>
          <clipPath id={`jarclip${k}`}><path d={`M0 -160 L ${Math.cos(a) * 400} ${-160 + Math.sin(a) * 400} L ${Math.cos(a + 0.8) * 400} ${-160 + Math.sin(a + 0.8) * 400} Z`} /></clipPath>
          <g clipPath={`url(#jarclip${k})`}>
            <path d="M-70 -300 L 70 -300 Q 60 -260 120 -200 Q 170 -120 130 -40 Q 100 0 0 0 Q -100 0 -130 -40 Q -170 -120 -120 -200 Q -60 -260 -70 -300 Z" fill="#8A4A2A" />
            <path d="M120 -200 Q 170 -120 130 -40" stroke={P.rim} strokeWidth={6} fill="none" />
            <path d="M-130 -140 Q 0 -110 130 -140" stroke="#5A2A14" strokeWidth={6} fill="none" />
          </g>
        </g>
      );
    })}
  </g>
);

export const ZKGedeon: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKGED_TOTAL / FPS;
  return (
    <>
      <Frame f={f} cuts={GCUTS} T={T} W={WG} keys={new Set(["gedeon", "treinta", "32", "demasiados", "trescientos", "300", "ciento", "135", "trompetas", "cantaros", "antorchas", "medianoche", "enemigo"])} voice="zk11/gedeon.wav" song="zk/songs/short3.mp3" songFrom={0}>
        {(i, lt, dur) => {
          if (i === 0) { // vista aérea: 32.000 soldados
            const n = Math.round(32000 * io(t, 0, gDios - 0.2));
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#0A0A10" />
                <g transform={`translate(540 1060) scale(${1.9 - io(lt, 0, dur) * 0.9}) rotate(${lt * 3}) translate(-540 -1060)`}><ArmyGrid keep={1} t={t} /></g>
                <rect y={1380} width={1080} height={340} fill="rgba(0,0,0,0.6)" />
                <text x={540} y={1610} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={200} fill="#fff">{n.toLocaleString("es")}</text>
              </Svg>
            );
          }
          if (i === 1) { // "son demasiados": el ejército se desvanece
            const keep = 1 - io(t, gDem, gRed + 0.2) * 0.97;
            const n = Math.round(300 + (32000 - 300) * Math.pow(keep, 2));
            const [sx, sy] = shake(t, kick(t, gDem, 18, 5));
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#0A0A10" />
                <g transform={`translate(${540 + sx} ${1060 + sy}) scale(${1.0 + lt * 0.15}) translate(-540 -1060)`}><ArmyGrid keep={keep} t={t} /></g>
                <rect width={1080} height={1920} fill={RED} opacity={kick(t, gDem, 0.25, 4)} />
                <text x={540} y={1610} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={200} fill="#fff">{n.toLocaleString("es")}</text>
                <g opacity={io(t, gDem, gDem + 0.1)} transform={`translate(540 800) scale(${1 + kick(t, gDem, 0.6, 10)}) rotate(-4)`}>
                  <text x={0} y={0} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={120} fill={RED} style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.9))" }}>DEMASIADOS</text>
                </g>
              </Svg>
            );
          }
          if (i === 2) { // quedan 300
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#0A0A10" />
                <g transform={`translate(540 1060) scale(${1.3 + io(lt, 0, dur) * 1.6}) translate(-540 -1060)`}><ArmyGrid keep={0} red t={t} /></g>
                <text x={540} y={1610} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={240} fill={RED} transform={`translate(540 1530) scale(${1 + kick(t, gTre, 0.5, 9)}) translate(-540 -1530)`}>300</text>
              </Svg>
            );
          }
          if (i === 3) { // contra 135.000: el campamento infinito + barra
            const n = Math.round(135000 * io(t, gCie, gCie + 1.1));
            const pan = io(lt, 0, dur);
            return (
              <Svg>
                <g transform={`translate(540 1150) scale(1.7) translate(${-640 + pan * 200} -1180)`}><Camp t={t} /></g>
                <rect x={80} y={1440} width={920} height={300} rx={20} fill="rgba(0,0,0,0.78)" />
                <rect x={120} y={1490} width={Math.max(3, 840 * 300 / 135000)} height={60} fill={RED} />
                <text x={140} y={1534} fontFamily={KFONT} fontWeight={700} fontSize={40} fill="#fff">300</text>
                <rect x={120} y={1600} width={840 * io(t, gCie, gCie + 1.1)} height={60} fill="#8A8478" />
                <text x={140} y={1700} fontFamily={KFONT} fontWeight={800} fontSize={80} fill="#fff">{n.toLocaleString("es")}</text>
                <Pill x={540} y={1330} txt="JUECES 8:10" on={io(lt, 0.3, 0.5)} />
              </Svg>
            );
          }
          if (i === 4 || i === 5 || i === 6) { // trompeta · cántaro · antorcha
            const z = 1.15 - lt * 0.12, rot = (i - 5) * 8 + lt * 6;
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#07060A" />
                <circle cx={540} cy={1080} r={520} fill="url(#rglowg)" opacity={0.5} />
                <g transform={`translate(540 1150) rotate(${rot}) scale(${z})`}>
                  {i === 4 ? (
                    <g><path d="M-400 150 Q -120 150 110 -30 Q 230 -130 290 -330 L 450 -280 Q 380 -40 180 80 Q -90 210 -400 170 Z" fill="#C8A878" stroke="#5A4428" strokeWidth={8} />
                      <ellipse cx={370} cy={-305} rx={82} ry={34} transform="rotate(18 370 -305)" fill="#2A1A10" stroke="#C8A878" strokeWidth={10} />
                      {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${-300 + k * 110} ${150 - k * 50} l 30 70`} stroke="#8A6E4A" strokeWidth={6} />)}
                      <path d="M330 -330 L 400 -300" stroke={P.rim} strokeWidth={10} /></g>
                  ) : i === 5 ? <g transform="translate(0 180) scale(1.4)"><Jar t={t} /></g> : (
                    <g><rect x={-30} y={-80} width={60} height={520} rx={14} fill="#3A2412" /><path d="M30 -80 L 30 440" stroke={P.rim} strokeWidth={6} />
                      <path d={`M-90 -80 Q 0 ${-480 - Math.sin(t * 13) * 30} 90 -80 Z`} fill="#FF7A2A" /><path d={`M-45 -80 Q 0 ${-330 - Math.sin(t * 17) * 20} 45 -80 Z`} fill="#FFD06A" />
                      <circle cx={0} cy={-200} r={320} fill="url(#rglowg)" /></g>
                  )}
                </g>
                <Pill x={540} y={1600} txt={i === 4 ? "TROMPETAS" : i === 5 ? "CÁNTAROS" : "ANTORCHAS"} on={io(lt, 0.05, 0.2)} big />
              </Svg>
            );
          }
          if (i === 7) { // medianoche: silencio antes del golpe, 300 escondidos en las colinas
            return (
              <Svg>
                <g transform={`translate(540 1250) scale(${1.0 + lt * 0.12}) translate(-540 -1250)`}>
                  <Camp t={t} />
                  {Array.from({ length: 60 }, (_, k) => { const left = k < 30, u = rnd(k + 900); const x = left ? -100 + u * 380 : 800 + u * 380; const y = 1180 - Math.sin(u * 3) * 60 - 20; return <circle key={k} cx={x} cy={y} r={3} fill={RED} opacity={0.5 + 0.5 * Math.sin(t * 5 + k)} />; })}
                </g>
                <text x={540} y={1650} textAnchor="middle" fontFamily={KFONT} fontWeight={800} fontSize={130} fill="#fff" opacity={io(lt, 0.1, 0.3)}>00:00</text>
              </Svg>
            );
          }
          if (i === 8) { // ¡crash! los cántaros estallan
            const br = io(t, gRom + 0.1, gRom + 0.6);
            const [sx, sy] = shake(t, kick(t, gRom + 0.1, 34, 5));
            return (
              <Svg>
                <rect width={1080} height={1920} fill="#07060A" />
                <g transform={`translate(${540 + sx} ${1250 + sy}) scale(${1.5 - br * 0.3})`}><Jar broken={br} t={t} /></g>
                {Array.from({ length: 300 }, (_, k) => { const on = br > rnd(k) ; const a = (k / 300) * Math.PI * 2; return on ? <circle key={k} cx={540 + Math.cos(a) * (420 + rnd(k + 3) * 80)} cy={1150 + Math.sin(a) * (700 + rnd(k + 4) * 80)} r={6} fill="#FFB04A" opacity={0.9} /> : null; })}
                <rect width={1080} height={1920} fill="#fff" opacity={t >= gRom + 0.1 && t < gRom + 0.17 ? 0.7 : 0} />
              </Svg>
            );
          }
          // caos: el enemigo se mata entre ellos
          const [sx, sy] = shake(t, 10 + kick(t, gMat, 20, 5));
          const fl = Math.sin(t * 22) > 0.6 ? 1 : 0;
          return (
            <Svg>
              <g transform={`translate(${540 + sx} ${1300 + sy}) scale(${1.25 + lt * 0.1}) rotate(${Math.sin(lt * 3) * 2}) translate(-540 -1300)`}>
                <Camp t={t} chaos={1} />
                {Array.from({ length: 16 }, (_, k) => {
                  const x = 80 + (k % 8) * 130 + rnd(k) * 40, y = 1350 + Math.floor(k / 8) * 230, fc = k % 2 ? 1 : -1;
                  return (
                    <g key={k}>
                      <Soldier x={x} y={y} s={0.85 + Math.floor(k / 8) * 0.4} t={t + k} run face={fc as 1 | -1} down={io(t, gMat + rnd(k) * 0.6, gMat + rnd(k) * 0.6 + 0.3)} />
                      <path d={`M${x} ${y - 200} l ${fc * 120 * Math.sin(t * 9 + k)} -80`} stroke="#B8B4BC" strokeWidth={6} />
                    </g>
                  );
                })}
              </g>
              <rect width={1080} height={1920} fill={RED} opacity={fl * 0.12} />
              <Pill x={540} y={1700} txt="JUECES 7:22" on={io(lt, 0.3, 0.5)} />
            </Svg>
          );
        }}
      </Frame>
      <Sfx at={0} src="crowd" vol={0.6} />
      <Sfx at={gDem} src="boom" vol={0.9} />
      <Sfx at={gTre} src="hit" vol={0.8} />
      <Sfx at={gCie} src="riser" vol={0.6} />
      <Sfx at={gTrom - 0.2} src="horn" vol={0.8} />
      <Sfx at={gCan} src="tick" vol={0.8} />
      <Sfx at={gAnt} src="fire" vol={0.7} />
      <Sfx at={gRom + 0.1} src="shatter" vol={1} />
      <Sfx at={gRom + 0.1} src="boom" vol={0.9} />
      <Sfx at={gRom + 0.3} src="horn" vol={0.8} />
      <Sfx at={gEne - 0.2} src="crowd" vol={1} />
      {Array.from({ length: 6 }, (_, k) => <Sfx key={k} at={gEne + k * 0.35} src="hit" vol={0.4} />)}
    </>
  );
};
