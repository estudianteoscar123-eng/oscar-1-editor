import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import d from "../../public/reel1/words.json";
import { Caption, Glow, OilLamp, W, H, ip } from "./Kit";
import { City, Room, Street } from "./Sets";
import { YChar, YDefs } from "./YChar";

// Reel de 10 s con el personaje réplica: 16:9 (YouTube, sin música) y 9:16 (Shorts, con música).
const FPS = 30;
const ws = (d as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0] + 0.12, e: c.timestamp[1] + 0.12 }));
const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, "");
const at = (w: string, n = 0) => ws.filter((x) => norm(x.w) === w)[n]?.s ?? 0;
export const YREEL_TOTAL = Math.round((ws[ws.length - 1].e + 0.9) * FPS);
const GROUPS = [["faltan", "11", "minutos"], ["para", "la", "medianoche"], ["y", "tú", "eres", "el"], ["primer", "hijo"], ["solo", "se", "salvan", "las"], ["casas", "con", "sangre"], ["en", "la", "puerta"], ["y", "la", "tuya"], ["no", "tiene"]];

type Cam = [number, number, number, number, number, number];
const fmt = (s: number) => `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const YReel: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const END = YREEL_TOTAL / FPS;
  const VW = vertical ? 1080 : W, VH = vertical ? 1920 : H, k = vertical ? 1920 / 1080 : 1;
  const T = [0, at("para"), at("y"), at("solo"), at("y", 1), at("no"), END];
  const pr = at("primer");
  type Shot = { a: number; b: number; cam: Cam; r: (lt: number) => React.ReactNode; whip?: number; red?: boolean };
  const shots: Shot[] = [
    { a: T[0], b: T[1], cam: [1.15, 1.25, 1080, 1100, 470, 450], r: (lt) => <g><Room t={t} tod="night" id="y1" lamp={[640, 780]} /><YChar id="tu" t={t} x={1100} y={1180} s={1.75} face={{ brow: 0.7, browTilt: -0.6, mouth: "worry", sweat: true, eyeX: -0.6 }} armR={[40, 60]} /></g> },
    { a: T[1], b: T[2], cam: [1.0, 1.18, 1300, 1420, 480, 360], r: () => <City t={t} id="y2" mode="night" /> },
    { a: T[2], b: T[3], cam: t < pr ? [1.05, 1.1, 960, 980, 520, 520] : [1.6, 1.7, 1000, 1000, 470, 460], r: (lt) => <g><Room t={t} tod="night" id="y3" lamp={[1420, 790]} />
      <YChar id="pa" t={t} x={640} y={930} s={1.25} hair="beard" hairC="#2A2220" robe="#F2EEE2" robe2="#C9C1AA" sash="#D9A93A" face={{ mouth: "flat", brow: -0.3, browTilt: 0.5, eyeX: 0.6 }} armR={[40, 120]} armL={[40, 120]} />
      <YChar id="ma" t={t} x={1340} y={930} s={1.2} hair="long" hairC="#2A1E2E" robe="#B5543A" robe2="#7E3020" sash="#E3C27A" face={{ mouth: "worry", brow: 0.5, browTilt: -0.7, eyeX: -0.6 }} />
      <YChar id="tu2" t={t} x={1000} y={1060} s={1.5} face={{ mouth: t > pr ? "o" : "worry", brow: t > pr ? 1 : 0.5, eyeS: t > pr ? 1.12 : 1, sweat: t > pr }} armR={[150, 120]} /></g> },
    { a: T[3], b: T[4], cam: [1.6, 2.5, 1480, 1585, 640, 690], r: (lt) => <g><Street t={t} tod="night" id="y4" blood={1} lintel={ip(lt, [0.6, 1.6], [0.2, 1])} hebrewLit /><Glow id="yd" x={1585} y={720} r={520} o={0.7} c="#FF7A3A" /></g> },
    { a: T[4], b: T[5], cam: [1.7, 1.8, 420, 400, 640, 640], whip: -1, r: (lt) => <g><Street t={t} tod="night" id="y5" blood={1} lintel={1} /><YChar id="tu3" t={t} x={560} y={960} s={0.95} facing={lt > 0.45 ? -1 : 1} face={{ mouth: "flat", brow: 0.6, eyeX: 0.8 }} armR={[60, 20]} holdR={<OilLamp t={t} />} /><Glow id="yl" x={600} y={700} r={300} o={0.7} /></g> },
    { a: T[5], b: END, cam: [2.3, 2.7, 960, 960, 600, 590], red: true, r: (lt) => <g><Street t={t} tod="night" id="y6" blood={1} lintel={1} /><YChar id="tu4" t={t} x={960} y={1060} s={1.1} face={{ mouth: "o", brow: 1, browTilt: -0.3, eyeS: 1.18, eyeX: 0, eyeY: 0, sweat: true }} bob={lt < 0.25 ? -Math.sin(lt / 0.25 * Math.PI) * 30 : 0} /></g> },
  ];
  const sh = shots.find((s) => t >= s.a && t < s.b) ?? shots[shots.length - 1];
  const lt = t - sh.a, p = Math.min(1, lt / (sh.b - sh.a)), e = p * p * (3 - 2 * p);
  const z = sh.cam[0] + (sh.cam[1] - sh.cam[0]) * e;
  const hw = VW / 2 / (z * k), hh = VH / 2 / (z * k);
  const cl = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.min(b, Math.max(a, v)));
  const wo = sh.whip ? sh.whip * 900 * Math.pow(1 - Math.min(1, lt / 0.2), 3) : 0;
  const cx = cl(sh.cam[2] + (sh.cam[3] - sh.cam[2]) * e + wo / (z * k), hw, W - hw), cy = cl(sh.cam[4] + (sh.cam[5] - sh.cam[4]) * e, hh, H - hh);
  const hit = Math.exp(-lt * 9), shk = (sh.red ? 18 : 8) * hit;
  const blur = sh.whip ? Math.max(0, 1 - lt / 0.18) * 14 : 0;
  // subtítulo por grupos
  let gi = -1; { let wi = 0; GROUPS.forEach((g, i) => { const w0 = ws[wi]; if (w0 && t >= w0.s - 0.05) gi = i; wi += g.length; }); }
  let start = 0; for (let i = 0; i < gi; i++) start += GROUPS[i].length;
  const gw = gi >= 0 ? ws.slice(start, start + GROUPS[gi].length).map((w) => [w.w.replace(/[.,]/g, "").toUpperCase(), w.s] as [string, number]) : [];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined, transform: `scale(${1 + hit * 0.05})` }}>
        <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`}>
          <YDefs l="#FFB86C" r="#9FD4F4" />
          <g transform={`translate(${VW / 2 + Math.sin(t * 61) * shk} ${VH / 2 + Math.cos(t * 53) * shk}) scale(${z * k}) translate(${-cx} ${-cy})`}>{sh.r(lt)}</g>
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.4) 100%)" }} />
        {sh.red ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(160,10,20,0) 40%, rgba(160,10,20,.55) 100%)", opacity: 0.7 + Math.sin(t * 12) * 0.2 }} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: hit * 0.18 * (t > 0.1 ? 1 : 0) }} />
      {gw.length ? <Caption t={t} x={VW / 2} y={vertical ? 1430 : 190} words={gw} size={vertical ? 86 : 72} /> : null}
      <div style={{ position: "absolute", top: vertical ? 140 : 96, right: vertical ? undefined : 70, left: vertical ? 0 : undefined, width: vertical ? VW : undefined, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(14,12,12,.82)", borderRadius: 14, padding: "8px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "YCap", fontSize: vertical ? 22 : 18, letterSpacing: 5, color: "#E9D9B5" }}>FALTAN</div>
          <div style={{ fontFamily: "YMono", fontSize: vertical ? 56 : 44, color: "#FFFFFF" }}>{fmt(660 - t * 6)}</div>
        </div>
      </div>
      {!vertical ? <><div style={{ position: "absolute", left: 0, top: 0, width: W, height: 70, background: "#000" }} /><div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: 70, background: "#000" }} /></> : null}
      <Audio src={staticFile(vertical ? "reel1/mix.wav" : "reel1/yt.wav")} />
    </AbsoluteFill>
  );
};

