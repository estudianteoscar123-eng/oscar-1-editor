import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import dn from "../../public/zk9/noe.json";
import dc from "../../public/zk9/cana.json";
import { FPS, KFONT, groupWords } from "../kit/Kit";
import { rnd } from "./Kit";
import { DARK, Film, Ground, HZ, Mountain, Pill, Rainbow, Sky, cl, io, type Pal } from "./RefNoe";

// Shorts ZK · estilo "Noé Dark" (aprobado). Un solo mundo por video, cámara que viaja sin cortes,
// la voz arranca en el cuadro 0, subtítulo pequeño arriba con la clave en recuadro rojo, final que vuelve al inicio.
const RED = "#D30F17";
export type R = { chunks: { text: string; timestamp: [number, number] }[] };
export type Wd = { w: string; s: number; e: number };
export const toW = (d: R, fix: Record<string, string> = {}): Wd[] =>
  d.chunks.map((c) => { const w = c.text.trim(); return { w: fix[w] ?? w, s: Math.max(0, c.timestamp[0] - 0.04), e: c.timestamp[1] }; });
export const nrm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
export const finder = (W: Wd[]) => (k: string, nth = 0, dflt = 0) => W.filter((w) => nrm(w.w).startsWith(nrm(k)))[nth]?.s ?? dflt;
const P = DARK;

export type Key = [number, number, number, number]; // t, cx, cy, z
export const camPath = (t: number, keys: Key[]): [number, number, number] => {
  let k = 0;
  while (k < keys.length - 1 && t > keys[k + 1][0]) k++;
  const a = keys[k], b = keys[Math.min(k + 1, keys.length - 1)];
  const u = b[0] === a[0] ? 1 : io(t, a[0], b[0]);
  return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
};
export const L: React.FC<{ cam: [number, number, number]; dep: number; children: React.ReactNode }> = ({ cam, dep, children }) => {
  const [cx, cy, z] = cam;
  const zz = 1 + (z - 1) * dep, x = 540 + (cx - 540) * dep, y = 960 + (cy - 960) * dep;
  return <g transform={`translate(540 960) scale(${zz}) translate(${-x} ${-y})`}>{children}</g>;
};

export const Cap: React.FC<{ f: number; W: Wd[]; keys: Set<string> }> = ({ f, W, keys }) => {
  const t = f / FPS, groups = groupWords(W);
  const gi = groups.findIndex((g, i) => t >= (i === 0 ? 0 : g[0].s - 0.06) && t < (groups[i + 1]?.[0].s ?? 999) - 0.06);
  if (gi < 0) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 80, right: 80, textAlign: "center", fontFamily: KFONT, fontWeight: 600, fontSize: 60, lineHeight: 1.3, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.6)" }}>
      {groups[gi].map((w, i) => {
        const on = t >= w.s - 0.06 || (gi === 0 && i === 0), k = on && keys.has(nrm(w.w));
        return (
          <React.Fragment key={i}>
            {i ? " " : ""}
            <span style={{ opacity: on ? 1 : 0.4, padding: k ? "0 12px" : undefined, background: k ? RED : undefined, borderRadius: 6 }}>{w.w}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- persona (proporciones reales, dos tonos, borde de luz rojo) ----------
export type Look = { robe: string; robeSh: string; mantle: string; mantleSh: string; skin: string; skinSh: string; hair: string; beard?: "long" | "short" | "none" };
export const Person: React.FC<{ x: number; y: number; s: number; look: Look; face?: 1 | -1; tilt?: number; cup?: boolean; armUp?: number; t: number; op?: number }> = ({ x, y, s, look, face = 1, tilt = 0, cup, armUp = 0, t, op = 1 }) => {
  const br = Math.sin(t * 2.2 + x) * 2;
  const lk = look;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s})`} opacity={op}>
      <path d="M-90 0 L 90 0 L -260 60 L -480 60 Z" fill={P.shadow} />
      <ellipse cx={-28} cy={-2} rx={26} ry={9} fill="#120A08" /><ellipse cx={30} cy={-2} rx={26} ry={9} fill="#120A08" />
      <g transform={`translate(0 ${br}) rotate(${tilt} 0 -40)`}>
        <path d="M-72 -500 Q -100 -250 -118 -12 L 118 -12 Q 100 -250 72 -500 Z" fill={lk.robe} />
        <path d="M-72 -500 Q -100 -250 -118 -12 L -20 -12 Q -30 -250 -10 -500 Z" fill={lk.robeSh} />
        {[-60, 0, 55].map((q, i) => <path key={i} d={`M${q} -300 Q ${q + 8} -150 ${q - 4 + i * 6} -14`} stroke={lk.robeSh} strokeWidth={4} fill="none" opacity={0.7} />)}
        <path d="M72 -500 Q 100 -250 118 -12" stroke={P.rim} strokeWidth={5} fill="none" opacity={0.9} />
        <path d="M-78 -505 Q -130 -300 -96 -150 L -40 -160 Q -50 -320 20 -500 Z" fill={lk.mantle} />
        <path d="M-78 -505 Q -130 -300 -96 -150 L -70 -152 Q -88 -320 -30 -500 Z" fill={lk.mantleSh} />
        <path d="M-92 -330 Q 0 -310 92 -330 L 94 -300 Q 0 -282 -94 -300 Z" fill={lk.mantleSh} />
        {cup || armUp ? (
          <g transform={`rotate(${-armUp * 70} 50 -480)`}>
            <path d="M44 -490 Q 92 -440 96 -360 L 150 -390 L 160 -372 L 100 -326 Q 60 -340 52 -420 Z" fill={lk.robe} />
            <path d="M96 -360 L 150 -390 L 160 -372 L 100 -326 Z" fill={lk.robeSh} opacity={0.6} />
            <ellipse cx={164} cy={-386} rx={15} ry={13} fill={lk.skin} />
            {cup ? (
              <g transform="translate(170 -400)">
                <path d="M-20 -44 L 20 -44 Q 18 -14 0 -8 Q -18 -14 -20 -44 Z" fill="#6A6670" />
                <path d="M-18 -38 L 18 -38 Q 16 -18 0 -12 Q -16 -18 -18 -38 Z" fill="#5A0A12" />
                <rect x={-3} y={-8} width={6} height={18} fill="#6A6670" /><ellipse cx={0} cy={11} rx={13} ry={4} fill="#6A6670" />
                <path d="M20 -44 Q 18 -14 0 -8" stroke={P.rim} strokeWidth={3} fill="none" />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            <path d="M40 -490 Q 82 -420 78 -280 L 50 -276 Q 50 -400 30 -470 Z" fill={lk.robe} />
            <path d="M78 -280 L 50 -276" stroke={lk.robeSh} strokeWidth={6} />
            <ellipse cx={66} cy={-262} rx={14} ry={16} fill={lk.skin} />
            <path d="M82 -480 Q 92 -380 80 -284" stroke={P.rim} strokeWidth={4} fill="none" />
          </g>
        )}
        <path d="M-18 -520 L 22 -520 L 26 -490 L -22 -490 Z" fill={lk.skinSh} />
        <path d="M-36 -560 Q -40 -610 4 -616 Q 42 -614 46 -576 L 56 -560 L 46 -552 Q 46 -530 28 -520 L -24 -520 Q -40 -536 -36 -560 Z" fill={lk.skin} />
        <path d="M-36 -560 Q -40 -610 4 -616 Q -14 -590 -10 -540 L -24 -520 Q -40 -536 -36 -560 Z" fill={lk.skinSh} />
        <path d="M46 -576 L 56 -560 L 46 -552" stroke={P.rim} strokeWidth={3} fill="none" />
        <path d="M-40 -574 Q -46 -540 -28 -516 Q -20 -560 -10 -590 Q -30 -600 -40 -574 Z" fill={lk.hair} />
        {lk.beard === "long" ? <path d="M-12 -546 Q 6 -530 44 -540 Q 50 -500 30 -460 Q 10 -436 -6 -470 Q -16 -500 -12 -546 Z" fill={lk.hair} /> : null}
        {lk.beard === "short" ? <path d="M-12 -546 Q 6 -532 44 -542 Q 46 -516 26 -508 Q 0 -504 -12 -546 Z" fill={lk.hair} /> : null}
        {lk.beard !== "long" ? <path d="M-38 -580 Q -30 -622 8 -620 Q 38 -618 44 -590 Q 10 -604 -38 -580 Z" fill={lk.hair} /> : null}
        <ellipse cx={30} cy={-576} rx={4} ry={5} fill="#0A0606" />
        <path d="M18 -590 Q 30 -596 42 -590" stroke={lk.hair} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
export const NOE: Look = { robe: "#6A5C50", robeSh: "#352C26", mantle: "#4A0C10", mantleSh: "#260608", skin: "#7A5440", skinSh: "#43291E", hair: "#BDB6AE", beard: "long" };
export const CAM: Look = { robe: "#3E4450", robeSh: "#1E2128", mantle: "#2A2018", mantleSh: "#140F0B", skin: "#6E4A36", skinSh: "#3A2418", hair: "#1A1210", beard: "short" };
export const NIN: Look = { robe: "#5A5048", robeSh: "#2C2622", mantle: "#3A3028", mantleSh: "#1C1612", skin: "#7A5440", skinSh: "#43291E", hair: "#1A1210", beard: "none" };
export const JES: Look = { robe: "#B8B0A4", robeSh: "#6A645C", mantle: "#7A0A10", mantleSh: "#40060A", skin: "#7A5440", skinSh: "#43291E", hair: "#2A1A12", beard: "short" };
export const GST: Look = { robe: "#4A4250", robeSh: "#24202A", mantle: "#3A2A30", mantleSh: "#1C1418", skin: "#6E4A36", skinSh: "#3A2418", hair: "#1A1210", beard: "short" };

export const Tent: React.FC<{ glow: number; inside: number; t: number }> = ({ glow, inside, t }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 7.3);
  return (
    <g>
      <ellipse cx={0} cy={6} rx={300} ry={26} fill={P.shadow} />
      <path d="M-260 0 L 0 -300 L 260 0 Z" fill="#2A1E1A" />
      <path d="M0 -300 L 260 0 L 60 0 Z" fill="#160F0D" />
      <path d="M-70 0 L 0 -210 L 70 0 Z" fill={`rgba(255,${80 + 40 * glow},40,${0.15 + 0.75 * glow * fl})`} />
      <circle cx={0} cy={-60} r={220} fill="url(#zglow)" opacity={glow * fl} />
      {inside > 0 ? <path d="M-58 -16 Q -30 -40 20 -30 Q 50 -28 60 -14 L 60 0 L -60 0 Z" fill="#0A0505" opacity={inside} /> : null}
      <path d="M0 -300 L 260 0" stroke={P.rim} strokeWidth={4} opacity={0.8} />
      <path d="M0 -300 L 0 -340" stroke="#2A1E1A" strokeWidth={8} />
    </g>
  );
};

// ======================== SHORT 1 · NOÉ ========================
const WN = toW(dn as unknown as R, { "Noe?": "Noé?", "Noe": "Noé", "Noe,": "Noé," });
const FN = finder(WN);
export const ZKNOE_TOTAL = Math.round((WN[WN.length - 1].e + 0.35) * FPS);
export const ZKNoe: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKNOE_TOTAL / FPS;
  const tArco = FN("arco"), tDesp = FN("despues"), tVin = FN("vina"), tHizo = FN("hizo"), tEmb = FN("emborr"), tTien = FN("tienda"), tCam = FN("cam"), tSal = FN("salio"), tDesperto = FN("desperto"), tMald = FN("maldijo"), tNieto = FN("nieto"), tBib = FN("biblia");
  const cam = camPath(t, [
    [0, 480, 1290, 1.5], [tArco - 0.4, 520, 1200, 1.35], [tDesp - 0.1, 560, 1150, 1.2], [tVin + 0.2, 620, 1180, 1.0],
    [tHizo, 560, 1250, 2.1], [tEmb + 0.5, 1340, 1210, 2.3], [tCam - 0.2, 1300, 1200, 2.2], [tSal + 0.6, 1190, 1210, 2.0],
    [tDesperto + 0.3, 1360, 1200, 2.0], [tMald + 0.4, 1300, 1200, 1.9], [tBib, 900, 1180, 1.15], [T - 0.1, 480, 1290, 1.5],
  ]);
  const rb = io(t, tArco - 0.15, tArco + 0.4) * (1 - io(t, tDesp + 0.5, tDesp + 1.2)) + io(t, tBib, tBib + 0.6) * (1 - io(t, T - 0.6, T - 0.05));
  const crack = io(t, tArco + 0.3, tArco + 0.7) * (1 - io(t, tDesp + 0.5, tDesp + 1.2)) + io(t, tBib + 0.6, tBib + 1.0) * (1 - io(t, T - 0.6, T - 0.05));
  const sway = Math.sin(t * 3) * 6 * io(t, tHizo, tEmb + 0.3);
  const tentIn = io(t, tEmb + 0.3, tEmb + 0.8) * (1 - io(t, tDesperto, tDesperto + 0.4));
  const camX = 1250 - io(t, tSal, tSal + 1.2) * 150;
  const camOn = io(t, tCam - 0.2, tCam + 0.15) * (1 - io(t, tBib, tBib + 0.6));
  const noeOut = io(t, tDesperto, tDesperto + 0.4) * (1 - io(t, tBib, tBib + 0.6));
  const nin = io(t, tNieto - 0.25, tNieto + 0.1) * (1 - io(t, tBib, tBib + 0.6));
  const pulse = io(t, tMald, tMald + 0.15) * (1 - io(t, tMald + 0.3, tMald + 0.9));
  return (
    <AbsoluteFill style={{ background: P.sky[0], overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.6}><Sky p={P} t={t} /><Rainbow p={P} on={cl(rb)} crack={cl(crack)} /></L>
        <L cam={cam} dep={0.85}><Mountain p={P} /></L>
        <L cam={cam} dep={1}>
          <Ground p={P} />
          <g transform="translate(1380 1335) scale(0.85)"><Tent glow={io(t, tEmb, tEmb + 0.5)} inside={tentIn} t={t} /></g>
          <Person x={camX} y={1345} s={0.5} look={CAM} face={-1} t={t} op={camOn} />
          <Person x={1560} y={1350} s={0.5} look={NOE} face={-1} t={t} op={noeOut} armUp={pulse} />
          <Person x={camX - 95} y={1345} s={0.32} look={NIN} face={1} t={t} op={nin} />
          <Person x={400} y={1660} s={1} look={NOE} cup t={t} tilt={-1.5 + sway * 0.3} />
          <Pill x={760} y={1110} txt="GÉNESIS 9:20" p={P} on={io(t, tVin, tVin + 0.3) * (1 - io(t, tHizo - 0.1, tHizo + 0.1))} lx={700} ly={1190} />
          <Pill x={camX} y={985} txt="CAM" p={P} on={io(t, tCam, tCam + 0.3) * (1 - io(t, tDesperto - 0.2, tDesperto + 0.1))} lx={camX} ly={1020} />
          <Pill x={camX - 20} y={1090} txt="CANAÁN · NIETO" p={P} on={nin} lx={camX - 95} ly={1135} />
          <Pill x={560} y={1060} txt="GÉNESIS 9:25" p={P} on={io(t, tBib, tBib + 0.3) * (1 - io(t, T - 0.7, T - 0.3))} lx={430} ly={1080} />
        </L>
        <rect width={1080} height={1920} fill={RED} opacity={pulse * 0.12} />
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WN} keys={new Set(["noe", "arcoiris", "vino", "desnudo", "cam", "nieto"])} />
      <Audio src={staticFile("zk9/noe.wav")} />
      <Audio src={staticFile("zk/songs/short3.mp3")} volume={(fr) => 0.22 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};

export const Defs: React.FC<{ p: Pal }> = ({ p }) => (
  <defs>
    <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={p.sky[0]} /><stop offset="45%" stopColor={p.sky[1]} /><stop offset="80%" stopColor={p.sky[2]} /><stop offset="100%" stopColor={p.sky[3]} />
    </linearGradient>
    <radialGradient id="rglow"><stop offset="0%" stopColor={p.glow} /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></radialGradient>
    <radialGradient id="zglow"><stop offset="0%" stopColor="rgba(255,90,40,0.55)" /><stop offset="100%" stopColor="rgba(255,40,20,0)" /></radialGradient>
    <linearGradient id="rground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.ground[0]} /><stop offset="100%" stopColor={p.ground[1]} /></linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4A4448" /><stop offset="60%" stopColor="#2E2A2E" /><stop offset="100%" stopColor="#161416" /></linearGradient>
  </defs>
);
export const Dust: React.FC<{ cam: [number, number, number]; t: number }> = ({ cam, t }) => (
  <L cam={cam} dep={1.25}>
    {Array.from({ length: 40 }, (_, i) => (
      <circle key={i} cx={-300 + rnd(i + 900) * 2400 + Math.sin(t * 0.8 + i) * 20} cy={300 + ((rnd(i + 700) * 1700 - t * (12 + rnd(i) * 20) + 1700) % 1700)} r={1.5 + rnd(i + 30) * 3.5} fill={P.dust} opacity={0.3 + rnd(i + 5) * 0.4} />
    ))}
  </L>
);

// ======================== SHORT 2 · CANÁ ========================
const WC = toW(dc as unknown as R);
const FC = finder(WC);
export const ZKCANA_TOTAL = Math.round((WC[WC.length - 1].e + 0.35) * FPS);
const FLOOR = 1300;
const Jar: React.FC<{ x: number; y: number; s: number; fill: number; i: number }> = ({ x, y, s, fill, i }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={30} cy={4} rx={150} ry={18} fill={P.shadow} />
    <clipPath id={`jc${i}`}><path d="M-80 -330 L 80 -330 Q 120 -200 105 -40 Q 100 0 60 0 L -60 0 Q -100 0 -105 -40 Q -120 -200 -80 -330 Z" /></clipPath>
    <path d="M-80 -330 L 80 -330 Q 120 -200 105 -40 Q 100 0 60 0 L -60 0 Q -100 0 -105 -40 Q -120 -200 -80 -330 Z" fill="url(#stone)" />
    <g clipPath={`url(#jc${i})`} opacity={0.9}>
      <rect x={-130} y={-330 * fill} width={260} height={340} fill="#6A0E18" />
      <rect x={-130} y={-330 * fill} width={260} height={8} fill="#8A1420" opacity={fill > 0.02 ? 1 : 0} />
    </g>
    <path d="M-80 -330 L 80 -330 Q 120 -200 105 -40 Q 100 0 60 0 L -60 0 Q -100 0 -105 -40 Q -120 -200 -80 -330 Z" fill="url(#stone)" opacity={0.22} />
    <rect x={-92} y={-350} width={184} height={26} rx={6} fill="#3A3438" />
    <path d="M80 -330 Q 120 -200 105 -40" stroke={P.rim} strokeWidth={4} fill="none" />
    {[-240, -160].map((yy) => <path key={yy} d={`M-104 ${yy} Q 0 ${yy + 14} 106 ${yy}`} stroke="#141214" strokeWidth={3} fill="none" opacity={0.6} />)}
  </g>
);
const Bottle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 0 L -9 -34 Q -9 -42 -3 -46 L -3 -60 L 3 -60 L 3 -46 Q 9 -42 9 -34 L 9 0 Z" fill="#2E1016" />
    <path d="M6 -34 L 6 -4" stroke={P.rim} strokeWidth={2} opacity={0.8} />
  </g>
);
const Courtyard: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-800} y={-400} width={3600} height={FLOOR + 400} fill="url(#rsky)" />
    {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={-600 + rnd(i) * 3200} cy={-300 + rnd(i + 50) * 900} r={1 + rnd(i + 9) * 2} fill="#fff" opacity={0.25 + rnd(i + 3) * 0.5} />)}
    {/* muro con arcos */}
    <rect x={-800} y={640} width={3600} height={FLOOR - 640} fill="#1A1216" />
    {Array.from({ length: 9 }, (_, i) => {
      const x = -600 + i * 380;
      return (
        <g key={i}>
          <path d={`M${x} ${FLOOR} L ${x} 860 Q ${x + 120} 740 ${x + 240} 860 L ${x + 240} ${FLOOR} Z`} fill="#0C0709" />
          <path d={`M${x} 860 Q ${x + 120} 740 ${x + 240} 860`} stroke="#2E2228" strokeWidth={10} fill="none" />
          {i % 3 === 1 ? <path d={`M${x + 20} ${FLOOR} L ${x + 20} 880 Q ${x + 120} 780 ${x + 220} 880 L ${x + 220} ${FLOOR} Z`} fill="rgba(255,90,40,0.18)" /> : null}
        </g>
      );
    })}
    <rect x={-800} y={630} width={3600} height={20} fill="#2E2228" />
    {/* guirnalda de farolillos */}
    {[0, 1].map((r) => (
      <g key={r}>
        <path d={`M-700 ${600 + r * 60} Q 1000 ${760 + r * 60} 2700 ${600 + r * 60}`} stroke="#0A0608" strokeWidth={3} fill="none" />
        {Array.from({ length: 22 }, (_, i) => {
          const u = i / 21, x = -700 + u * 3400, y = 600 + r * 60 + 4 * u * (1 - u) * 160 + 14;
          const fl = 0.8 + 0.2 * Math.sin(t * 6 + i * 2 + r);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={46} fill="url(#zglow)" opacity={fl} />
              <ellipse cx={x} cy={y} rx={10} ry={13} fill={i % 2 ? "#FF6A3A" : "#FF9A4A"} opacity={fl} />
            </g>
          );
        })}
      </g>
    ))}
    {/* suelo de piedra en perspectiva */}
    <rect x={-800} y={FLOOR} width={3600} height={1200} fill="url(#rground)" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${1000 + (i - 15) * 30} ${FLOOR} L ${1000 + (i - 15) * 330} 2600`} stroke="#0A0607" strokeWidth={2} opacity={0.5} />)}
    {Array.from({ length: 12 }, (_, i) => { const y = FLOOR + Math.pow(i / 11, 2) * 1200; return <path key={i} d={`M-800 ${y} L 2800 ${y}`} stroke="#0A0607" strokeWidth={2} opacity={0.45} />; })}
  </g>
);
export const ZKCana: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, T = ZKCANA_TOTAL / FPS;
  const tCopa = FC("copa"), tSeis = FC("seis"), tCien = FC("100", 0, FC("cien")), tSeisc = FC("600", 0, FC("seiscientos")), tOch = FC("800", 0, FC("ochocientas")), tRaro = FC("raro"), tInv = FC("invitados"), tAun = FC("aun"), tMejor = FC("mejor"), tPrim = FC("primer"), tSalv = FC("salvar");
  const cam = camPath(t, [
    [0, 1000, 1600, 3.0], [tCopa + 0.3, 1000, 1590, 2.7], [tSeis - 0.15, 1000, 1580, 2.6], [tSeis + 0.4, 1755, 1520, 0.95], [tCien + 0.4, 1640, 1480, 1.35],
    [tSeisc + 0.2, 1755, 1560, 0.95], [tOch + 0.6, 1755, 1720, 0.92], [tRaro + 0.1, 1700, 1700, 0.95], [tInv, 420, 1230, 1.8], [tAun + 0.3, 600, 1230, 1.8],
    [tMejor + 0.4, 760, 1200, 1.9], [tPrim - 0.15, 740, 1210, 1.85], [tPrim + 0.3, 1300, 1380, 0.85], [tSalv, 1100, 1500, 1.4], [T - 0.1, 1000, 1600, 3.0],
  ]);
  const jarX = (i: number) => 1180 + i * 230;
  const fillAt = (i: number) => io(t, tSeis + 0.3 + i * 0.22, tSeis + 0.9 + i * 0.22);
  const nB = Math.round(800 * io(t, tOch - 0.3, tOch + 1.0) * (1 - io(t, tInv + 0.6, tInv + 1.2)));
  const cupX = io(t, tCopa, tCopa + 0.3);
  const steward = io(t, tAun, tAun + 0.4);
  const jes = io(t, tPrim, tPrim + 0.5);
  const sw = (i: number) => Math.sin(t * 2.4 + i * 1.7) * 3 * io(t, tRaro, tInv + 0.4);
  return (
    <AbsoluteFill style={{ background: "#030409", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs p={P} />
        <L cam={cam} dep={0.8}><Courtyard t={t} /></L>
        <L cam={cam} dep={1}>
          {/* mesa larga con invitados (ya habían bebido) */}
          {Array.from({ length: 7 }, (_, i) => <Person key={i} x={-60 + i * 130} y={1330} s={0.3} look={i % 3 === 0 ? CAM : GST} face={i % 2 ? -1 : 1} t={t} tilt={sw(i)} cup={i % 2 === 0} />)}
          <rect x={-160} y={1255} width={1000} height={40} fill="#2A1A14" /><rect x={-160} y={1255} width={1000} height={8} fill={P.rim} opacity={0.6} />
          <rect x={-140} y={1295} width={960} height={60} fill="#140C0A" />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-120 + i * 110} 1255 l 10 -26 l 10 26 Z`} fill="#6A6670" />)}
          <Person x={760} y={1350} s={0.34} look={GST} face={-1} t={t} cup={steward > 0} armUp={steward * 0.9} op={1} />
          <Person x={1080} y={1520} s={0.5} look={JES} face={1} t={t} op={jes} />
          {/* seis tinajas */}
          {Array.from({ length: 6 }, (_, i) => <Jar key={i} i={i} x={jarX(i)} y={1640} s={0.82} fill={fillAt(i)} />)}
          {/* 800 botellas */}
          {Array.from({ length: nB }, (_, k) => {
            const per = 30, row = Math.floor(k / per), col = k % per;
            return <Bottle key={k} x={1200 + col * 38 + (row % 2) * 19} y={1745 + row * 22} s={0.75 + row * 0.03} />;
          })}
          {/* la copa del inicio */}
          <g transform="translate(1000 1660) scale(2.2)">
            <ellipse cx={8} cy={2} rx={40} ry={6} fill={P.shadow} />
            <path d="M-20 -44 L 20 -44 Q 18 -14 0 -8 Q -18 -14 -20 -44 Z" fill="#6A6670" />
            <path d="M-18 -38 L 18 -38 Q 16 -18 0 -12 Q -16 -18 -18 -38 Z" fill="#5A0A12" />
            <rect x={-3} y={-8} width={6} height={10} fill="#6A6670" /><ellipse cx={0} cy={2} rx={13} ry={4} fill="#6A6670" />
            <path d="M20 -44 Q 18 -14 0 -8" stroke={P.rim} strokeWidth={2} fill="none" />
            <path d="M-34 -70 L 34 0 M 34 -70 L -34 0" stroke={RED} strokeWidth={6} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - cupX)} opacity={1 - io(t, tSeis, tSeis + 0.3)} />
          </g>
          <Pill x={1000} y={1450} txt="1 COPA" p={P} on={cupX * (1 - io(t, tSeis - 0.1, tSeis + 0.2))} />
          <Pill x={jarX(2)} y={1260} txt="≈100 LITROS C/U" p={P} on={io(t, tCien, tCien + 0.3) * (1 - io(t, tSeisc - 0.1, tSeisc + 0.1))} lx={jarX(2)} ly={1340} />
          <Pill x={1755} y={1250} txt={`${Math.round(600 * io(t, tSeisc, tSeisc + 0.8))} LITROS`} p={P} on={io(t, tSeisc, tSeisc + 0.2) * (1 - io(t, tOch - 0.1, tOch + 0.1))} />
          <Pill x={1755} y={1300} txt={`${nB} BOTELLAS`} p={P} on={io(t, tOch, tOch + 0.2) * (1 - io(t, tInv - 0.2, tInv + 0.1))} />
          <Pill x={760} y={1060} txt="«EL MEJOR VINO»" p={P} on={io(t, tMejor, tMejor + 0.3) * (1 - io(t, tPrim - 0.1, tPrim + 0.2))} lx={760} ly={1120} />
          <Pill x={1080} y={1150} txt="JUAN 2:11" p={P} on={io(t, tPrim + 0.3, tPrim + 0.6) * (1 - io(t, T - 0.7, T - 0.3))} lx={1080} ly={1200} />
        </L>
        <Dust cam={cam} t={t} />
      </svg>
      <Film f={f} p={P} />
      <Cap f={f} W={WC} keys={new Set(["vino", "copa", "seis", "cien", "100", "600", "800", "seiscientos", "ochocientas", "mejor", "fiesta"])} />
      <Audio src={staticFile("zk9/cana.wav")} />
      <Audio src={staticFile("zk/songs/short1.mp3")} trimBefore={45 * FPS} volume={(fr) => 0.22 * (1 - io(fr / FPS, T - 0.5, T))} />
    </AbsoluteFill>
  );
};
