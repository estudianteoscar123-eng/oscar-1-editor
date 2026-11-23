import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/reel1/words.json";
import { OilLamp, W, H, ip } from "./Kit";
import { City, Room, Street, Tu } from "./Sets";

// Reel 9:16 estilo "¿Y si…?": un plano nuevo cada ~1,3 s, cámara siempre viva (empuje/paneo/latigazo),
// subtítulo amarillo palabra por palabra en el centro, golpe visual en cada idea, final con giro.
const FPS = 30;
const ws = (d as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + 0.12, e: c.timestamp[1] + 0.12 }));
const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => ws.filter((x) => norm(x.w) === w)[n]?.s ?? 0;
export const REEL1_TOTAL = Math.round((ws[ws.length - 1].e + 0.9) * FPS);

type Cam = [number, number, number, number, number, number];
type Shot = { a: number; b: number; cam: Cam; r: (lt: number, t: number) => React.ReactNode; bw?: boolean; whip?: number };

const fmt = (s: number) => { const m = Math.floor(s / 60), x = Math.floor(s % 60); return `00:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; };

export const ReelYsi: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const END = REEL1_TOTAL / FPS;
  const T = [0, at("para"), at("y"), at("solo"), at("sangre"), at("y", 1), at("no"), END];
  const shots: Shot[] = [
    // 1 · número gigante + cuenta regresiva (gancho)
    { a: T[0], b: T[1], cam: [1, 1, 960, 960, 540, 540], r: () => null },
    // 1b · la luna sobre Egipto: medianoche
    { a: T[1], b: T[2], cam: [2.4, 1.7, 1480, 1300, 300, 420], r: (lt, tt) => <City t={tt} id="rc0" mode="night" /> },
    // 2 · tú, primer hijo: cara iluminada por la lámpara
    { a: T[2], b: T[3], cam: [2.6, 3.0, 1180, 1180, 560, 545], r: (lt, tt) => <g><Room t={tt} tod="night" id="rr1" lamp={[1050, 770]} /><Tu t={tt} x={1180} pose={{ look: [0.1, 0], mouth: "o", mouthOpen: 0.5, brow: 1, eyeOpen: 1.15 }} light={1} /></g> },
    // 3 · ciudad: solo brillan las puertas marcadas
    { a: T[3], b: T[4], cam: [1.9, 2.3, 700, 1150, 640, 660], whip: 1, r: (lt, tt) => <City t={tt} id="rc1" mode="night" lampsOut={1} /> },
    // 4 · la sangre cae del dintel
    { a: T[4], b: T[5], cam: [2.6, 3.1, 1585, 1585, 640, 700], r: (lt, tt) => <Street t={tt} tod="night" id="rs1" blood={1} lintel={ip(lt, [0, 0.6], [0.2, 1])} /> },
    // 5 · latigazo a TU puerta
    { a: T[5], b: T[6], cam: [2.0, 2.4, 315, 315, 700, 690], whip: -1, r: (lt, tt) => <Street t={tt} tod="night" id="rs2" blood={1} lintel={1} /> },
    // 6 · tu puerta no tiene sangre: cara de terror
    { a: T[6], b: END, cam: [2.7, 3.4, 600, 600, 560, 545], bw: true, r: (lt, tt) => <g><Street t={tt} tod="night" id="rs3" blood={1} lintel={1} /><Tu t={tt} x={600} y={950} pose={{ look: [-0.9, 0], mouth: "o", mouthOpen: 1, brow: 1, browTilt: -0.4, eyeOpen: 1.2, squash: lt < 0.25 ? -0.6 : 0, armR: [60, 20] }} holdR={<OilLamp t={tt} />} /></g> },
  ];
  const sh = shots.find((s) => t >= s.a && t < s.b) ?? shots[shots.length - 1];
  const lt = t - sh.a, dur = sh.b - sh.a;
  const p = Math.min(1, lt / dur), e = p * p * (3 - 2 * p);
  const k = 1920 / 1080;
  const z = sh.cam[0] + (sh.cam[1] - sh.cam[0]) * e;
  const hw = 1080 / 2 / (z * k), hh = 1920 / 2 / (z * k);
  const cl = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.min(b, Math.max(a, v)));
  const whipOff = sh.whip ? sh.whip * 900 * Math.pow(1 - Math.min(1, lt / 0.2), 3) : 0;
  const cx = cl(sh.cam[2] + (sh.cam[3] - sh.cam[2]) * e + whipOff / (z * k), hw, W - hw), cy = cl(sh.cam[4] + (sh.cam[5] - sh.cam[4]) * e, hh, H - hh);
  // golpe en cada corte: micro-zoom + destello + sacudida
  const hit = Math.exp(-lt * 9);
  const shk = hit * 14;
  const punch = 1 + hit * 0.06;
  const blur = sh.whip ? Math.max(0, 1 - lt / 0.18) * 14 : 0;
  const isClock = sh === shots[0];
  const remain = 660 - t * 9;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {isClock ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3A0A0E 0%, #060304 70%)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", transform: `scale(${ip(t, [0, 0.18], [1.6, 1]) * (1 + Math.sin(t * 9) * 0.01)})` }}>
            <div style={{ fontFamily: "YCap", fontSize: 56, letterSpacing: 16, color: "#FFD9A0" }}>FALTAN</div>
            <div style={{ fontFamily: "YMono", fontSize: 168, color: "#FF3B42", textShadow: "0 0 50px rgba(255,40,50,.8)" }}>{fmt(remain)}</div>
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ filter: `${sh.bw ? `grayscale(${ip(lt, [0.15, 0.5], [0, 1])}) contrast(1.15)` : ""} ${blur ? `blur(${blur}px)` : ""}` || undefined, transform: `scale(${punch})` }}>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920">
            <g transform={`translate(${540 + Math.sin(t * 61) * shk} ${960 + Math.cos(t * 53) * shk}) scale(${z * k}) translate(${-cx} ${-cy})`}>{sh.r(lt, t)}</g>
          </svg>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
          {sh.bw ? <AbsoluteFill style={{ background: "#B0101C", mixBlendMode: "multiply", opacity: ip(lt, [0, 0.12, 0.6], [0, 0.6, 0.25]) }} /> : null}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: hit * 0.25 * (t > 0.1 ? 1 : 0) }} />
      {/* subtítulo: 1–2 palabras grandes en el centro */}
      <Words t={t} />
      {/* reloj chico siempre visible tras el gancho */}
      {!isClock ? <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}><div style={{ background: "rgba(10,6,6,.75)", border: "3px solid rgba(255,59,66,.8)", borderRadius: 18, padding: "8px 26px", fontFamily: "YMono", fontSize: 58, color: "#FF4A50" }}>{fmt(remain)}</div></div> : null}
      <Audio src={staticFile("reel1/mix.wav")} />
    </AbsoluteFill>
  );
};

const Words: React.FC<{ t: number }> = ({ t }) => {
  const i = ws.findIndex((w, k) => t >= w.s - 0.04 && t < (ws[k + 1]?.s ?? w.e + 0.8) - 0.04);
  if (i < 0) return null;
  const w = ws[i];
  const lt = t - (w.s - 0.04);
  const key = ["minutos", "primer", "hijo", "sangre", "tuya", "tiene"].includes(norm(w.w));
  const sc = lt < 0.08 ? 0.5 + lt * 8 : lt < 0.16 ? 1.14 - (lt - 0.08) * 1.75 : 1;
  return (
    <div style={{ position: "absolute", top: 1500, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: "YCap", fontSize: key ? 150 : 118, color: key ? "#FFD23F" : "#FFFFFF", WebkitTextStroke: `${key ? 22 : 18}px #1A0A04`, paintOrder: "stroke fill", textShadow: "0 12px 0 rgba(0,0,0,.35)", transform: `scale(${sc}) rotate(${key ? -4 : 0}deg)`, textTransform: "uppercase" }}>{w.w.replace(/[.,¿?…]/g, "")}</span>
    </div>
  );
};
