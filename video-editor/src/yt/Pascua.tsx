import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Flame, Glow, Jar, OilLamp, W, H, ip, kf } from "./Kit";
import { Abuelo, Bowl, Bread, City, Eliab, Esclava, Exodus, Faraon, Field, HebrewRoom, Hyssop, Knife, Lamb, Madre, Mill, Moises, Nile, NightSky, Padre, Palace, Room, Staff, Street, Tu, Vecino } from "./Sets";

loadFont({ family: "YCap", url: staticFile("fonts/poppins-latin-900-normal.woff2"), weight: "900" });
loadFont({ family: "YMono", url: staticFile("fonts/jetbrains-mono-latin-700-normal.woff2"), weight: "700" });

type Cam = [number, number, number, number, number, number]; // z0 z1 cx0 cx1 cy0 cy1
type Shot = { a: number; b: number; r: (lt: number, t: number) => React.ReactNode; cam?: Cam; html?: (lt: number, t: number) => React.ReactNode; bw?: number; big?: string; red?: boolean; shake?: number };
const C = (z0: number, z1: number, cx0: number, cx1: number, cy0: number, cy1: number): Cam => [z0, z1, cx0, cx1, cy0, cy1];
const wide = C(1, 1.06, 960, 960, 540, 540);

// reloj: segundos restantes según la narración
const ANCH: [number, number][] = [[11.8, 43200], [101.4, 28800], [138.8, 18000], [175.4, 7200], [197.8, 660], [238.2, 0]];
const remaining = (t: number) => Math.max(0, kf(t, ANCH, (v) => v));
const fmt = (s: number) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60); return [h, m, x].map((v) => String(v).padStart(2, "0")).join(":"); };

const say = (lt: number, a: number, b: number) => lt > a && lt < b;
const S: Shot[] = [
  // ---------------- 1: despertar ----------------
  { a: 0, b: 5.15, cam: C(1.7, 1.85, 640, 660, 780, 770), r: (lt, t) => (<g><Room t={t} tod="dawn" bed id="r1" />
    <g transform="translate(330 812) rotate(90)"><Tu t={t} x={0} y={0} s={0.9} pose={{ eyeOpen: ip(lt, [0.3, 1.0], [0.05, 1]), look: [0.2, -0.6], mouth: "flat", armR: [10, 0], armL: [10, 0] }} /></g>
    <rect x={290} y={790} width={330} height={60} rx={24} fill="#3E6EA8" /></g>) },
  { a: 5.15, b: 9.6, cam: C(1, 1.14, 960, 960, 540, 600), r: (lt, t) => <City t={t} id="c1" mode="dawn" />, html: (lt) => <div style={{ position: "absolute", left: 140, top: 120, fontFamily: "YCap", fontSize: 34, letterSpacing: 6, color: "#F3E6C8", opacity: ip(lt, [0.3, 0.9], [0, 0.9]) }}>EGIPTO</div> },
  { a: 9.6, b: 11.8, cam: C(1.35, 1.4, 640, 640, 620, 620), r: (lt, t) => <g><Room t={t} tod="dawn" bed id="r2" /><Tu t={t} x={640} pose={{ armL: [kf(lt, [[0, 10], [0.5, 70]]), 70], armR: [kf(lt, [[0, 10], [0.5, 70]]), 70], brow: 0.6, browTilt: -0.6, mouth: "flat", look: [0, 0], headTilt: kf(lt, [[0.3, 0], [0.7, 8]]) }} /></g> },
  { a: 11.8, b: 14.3, big: "on", r: () => null },
  // ---------------- 2: plagas ----------------
  { a: 14.3, b: 16.6, cam: C(1.15, 1.2, 1150, 1250, 560, 560), r: (lt, t) => <g><Room t={t} tod="day" id="r3" /><Tu t={t} x={kf(lt, [[0, 880], [1.6, 1240]])} pose={{ walk: lt < 1.6 ? lt * 1.3 : undefined, look: [0.9, -0.3] }} /></g> },
  { a: 16.6, b: 19.2, cam: C(1.05, 1.12, 860, 1060, 540, 540), r: (lt, t) => <Street t={t} tod="day" id="s1" frogs /> },
  { a: 19.2, b: 22.6, cam: C(1, 1.1, 900, 1020, 540, 560), r: (lt, t) => <Nile t={t} id="n1" /> },
  { a: 22.6, b: 26.7, cam: C(1.7, 1.75, 300, 420, 820, 820), r: (lt, t) => <g><Street t={t} tod="day" id="s2" frogs /><Vecino t={t} x={kf(lt, [[0, 80], [4, 560]], (v) => v)} y={950} s={0.8} pose={{ walk: lt * 1.1, armR: [150, 70], mouth: "worry", brow: 0.4, browTilt: -0.8, look: [-0.6, 0.6] }} /></g> },
  { a: 26.7, b: 29.7, cam: C(1.6, 1.7, 1000, 1000, 640, 640), r: (lt, t) => <g><Street t={t} tod="day" id="s3" /><Vecino t={t} x={1000} y={950} s={0.95} pose={{ armR: [155 + Math.sin(t * 22) * 10, 70 + Math.sin(t * 22) * 15], armL: [40 + Math.sin(t * 17) * 10, 80], mouth: "worry", brow: 0.3, browTilt: -0.6, look: [0.2, -0.5], headTilt: Math.sin(t * 6) * 6 }} />{Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={1000 + Math.sin(t * 8 + i) * 60} cy={560 + Math.cos(t * 7 + i * 2) * 40} r={3} fill="#222" />)}</g> },
  { a: 29.7, b: 32.5, cam: C(1.2, 1.3, 800, 760, 640, 660), r: (lt, t) => <g><Field t={t} lt={lt} id="f1" pen /><Tu t={t} x={560} y={960} s={0.95} pose={{ look: lt > 1.0 ? [0, 0] : [0.9, 0], mouth: "flat", brow: lt > 1.0 ? -0.2 : 0 }} /></g> },
  { a: 32.5, b: 34.2, cam: C(1, 1.08, 960, 960, 540, 520), r: (lt, t) => <Field t={t} lt={lt} id="f2" hail /> },
  { a: 34.2, b: 36.5, cam: C(1, 1.1, 960, 1000, 540, 540), r: (lt, t) => <Field t={t} lt={lt} id="f3" locust /> },
  { a: 36.5, b: 41.4, cam: C(1, 1.15, 960, 960, 560, 620), r: (lt, t) => <City t={t} id="c2" mode="dawn" />, html: (lt) => <AbsoluteFill style={{ background: "#020205", opacity: ip(lt, [2.4, 4.6], [0, 0.95]) }} /> },
  { a: 41.4, b: 45.7, cam: C(1.4, 1.6, 960, 960, 560, 560), r: (lt, t) => <g><NightSky t={t} /><g opacity={0.14}><Tu t={t} x={960} pose={{ armR: [kf(lt, [[0.5, 10], [2.2, 85]]), 0], look: [0.6, 0] }} /></g>
    <g transform={`translate(${960 + 6} ${900 - 350 + 6})`}><ellipse cx={-22} cy={0} rx={12} ry={15} fill="#fff" /><ellipse cx={22} cy={0} rx={12} ry={15} fill="#fff" /><circle cx={-18} cy={0} r={6} fill="#000" /><circle cx={26} cy={0} r={6} fill="#000" /></g></g> },
  { a: 45.7, b: 49.7, cam: C(1.05, 1.12, 960, 960, 540, 520), r: (lt, t) => <Street t={t} tod="night" id="s4" eyes dark={0.55} /> },
  { a: 49.7, b: 55.1, cam: C(1, 1.18, 960, 980, 560, 640), r: (lt, t) => <City t={t} id="c3" mode="dark" /> },
  { a: 55.1, b: 59.3, r: () => null, html: (lt) => <Plagues lt={lt} /> },
  // ---------------- 3: Eliab ----------------
  { a: 59.3, b: 63.4, cam: C(1, 1.08, 960, 1060, 540, 560), r: (lt, t) => <g><Street t={t} tod="day" id="s5" lamb /><Eliab t={t} x={1585} y={950} s={0.95} facing={-1} pose={{ look: [0.7, 0.2], mouth: "flat" }} /><Tu t={t} x={kf(lt, [[0, 200], [3.8, 1080]], (v) => v)} y={960} pose={{ walk: lt * 1.25, armR: [150, 40] }} holdR={<g transform="translate(0 -40)"><Jar s={0.55} /></g>} /></g> },
  { a: 63.4, b: 68.4, cam: C(1.8, 1.9, 1690, 1700, 780, 790), r: (lt, t) => <g><Street t={t} tod="day" id="s6" lamb /><Eliab t={t} x={1585} y={950} s={0.95} pose={{ armR: [60 + Math.sin(t * 3) * 6, 20], look: [0.8, 0.8], mouth: "smile" }} /></g> },
  { a: 68.4, b: 74.1, cam: C(1.35, 1.45, 1230, 1260, 640, 620), r: (lt, t) => <g><Street t={t} tod="day" id="s7" lamb /><Tu t={t} x={1040} y={950} pose={{ look: [0.9, -0.1], mouth: "flat", brow: 0.2 }} /><Eliab t={t} x={1420} y={950} facing={-1} pose={{ look: [0.9, -0.1], mouth: "flat", brow: 0.4, browTilt: -0.6, lean: lt > 3.5 ? 5 : 0 }} /></g> },
  { a: 74.1, b: 78.3, cam: C(2.2, 2.3, 1420, 1420, 560, 560), r: (lt, t) => <g><Street t={t} tod="day" id="s8" /><Eliab t={t} x={1420} y={950} facing={-1} talk={say(lt, 0.1, 1.6) || say(lt, 1.8, 3.6)} pose={{ look: [0.4, 0], brow: 0.5, browTilt: -0.8, mouth: "worry" }} /></g>,
    html: (lt) => <>{lt < 1.75 ? <Caption t={lt} x={W / 2} y={880} words={[["ESTA", 0.1], ["NOCHE", 0.35], ["NO", 0.7], ["SALGAS.", 0.9]]} /> : <Caption t={lt} x={W / 2} y={880} words={[["PASE", 1.8], ["LO", 2.0], ["QUE", 2.15], ["PASE…", 2.3], ["NO", 2.95], ["SALGAS.", 3.15]]} />}</> },
  { a: 78.3, b: 80.6, cam: C(2.1, 2.2, 1040, 1040, 560, 560), r: (lt, t) => <g><Street t={t} tod="day" id="s9" /><Tu t={t} x={1040} y={950} talk={say(lt, 0.1, 0.9)} pose={{ look: [0.6, 0], brow: 0.8, browTilt: 0.4, mouth: "o", mouthOpen: 0.3, armR: [40, 60] }} /></g> },
  { a: 80.6, b: 85.4, cam: C(1.3, 1.45, 1230, 1300, 620, 600), r: (lt, t) => <g><Street t={t} tod="dusk" id="s10" lamb /><Tu t={t} x={1040} y={950} pose={{ look: [0.9, 0], mouth: "o", mouthOpen: 0.2, brow: 0.6 }} /><Eliab t={t} x={1420} y={950} facing={-1} pose={{ look: [0.9, 0], mouth: "worry", brow: 0.5, browTilt: -0.8, armR: [kf(lt, [[0.5, 10], [1.2, 120]]), 20] }} /></g> },
  { a: 85.4, b: 87.7, cam: C(1.15, 1.3, 960, 960, 560, 560), r: (lt, t) => <g><Palace t={t} id="p1" /><Faraon t={t} x={960} y={880} s={1.15} pose={{ armL: [30, 80], armR: [30, 80], mouth: "smile", brow: -0.4, browTilt: 0.6, look: [0, 0] }} /></g> },
  { a: 87.7, b: 91.0, cam: C(1.3, 1.4, 1000, 1000, 640, 640), r: (lt, t) => <g><Mill t={t} id="m1" /><Esclava t={t} x={800} y={880} pose={{ armR: [60 + Math.sin(t * 3) * 25, 30], armL: [50 + Math.sin(t * 3) * 25, 30], look: [0.6, 0.8], mouth: "flat", brow: 0.2, browTilt: -0.5 }} /><Tu id="nino" t={t} x={1260} y={880} s={0.55} facing={-1} pose={{ look: [0.6, 0], mouth: "flat" }} /></g> },
  { a: 91.0, b: 93.3, cam: C(2.1, 2.2, 1040, 1040, 560, 560), r: (lt, t) => <g><Street t={t} tod="dusk" id="s11" /><Tu t={t} x={1040} y={950} pose={{ look: [-0.3, 0.6], mouth: "flat", brow: 0.1 }} /></g> },
  { a: 93.3, b: 98.0, cam: C(2.0, 2.0, 1040, 1040, 560, 560), r: (lt, t) => <g><Street t={t} tod="dusk" id="s12" /><Tu t={t} x={1040} y={950} pose={{ mouth: lt < 2.8 ? "grin" : "flat", squash: lt < 2.6 ? Math.abs(Math.sin(lt * 14)) * -0.3 : 0, look: lt < 2.8 ? [0, -0.2] : [0, 0], brow: lt < 2.8 ? -0.3 : 0.4, eyeOpen: lt < 2.8 ? 0.35 : 1 }} /></g> },
  { a: 98.0, b: 101.4, cam: C(2.1, 3.2, 1040, 1040, 560, 545), bw: 1.4, r: (lt, t) => <g><Street t={t} tod="dusk" id="s13" /><Tu t={t} x={1040} y={950} pose={{ mouth: "o", mouthOpen: 0.4, brow: 1, eyeOpen: 1.15, look: [0, 0] }} /></g> },
  { a: 101.4, b: 103.2, big: "on", r: () => null },
  // ---------------- 4: el padre ----------------
  { a: 103.2, b: 105.2, cam: C(1.1, 1.15, 760, 800, 560, 560), shake: 6, r: (lt, t) => <g><Room t={t} tod="day" door="left" doorOpen={ip(lt, [0, 0.25], [0, 1])} desk id="r4" /><Tu t={t} x={kf(lt, [[0, 250], [1.2, 820]])} pose={{ walk: lt * 2.2, lean: 10, brow: 0.8, mouth: "o", mouthOpen: 0.6 }} /></g> },
  { a: 105.2, b: 113.7, cam: C(1.2, 1.45, 1150, 1180, 620, 600), r: (lt, t) => <g><Room t={t} tod="day" desk id="r5" /><Padre t={t} x={1160} y={880} pose={{ armR: [62 + Math.sin(t * 9) * 3, 40], armL: [30, 50], look: [0.4, 0.9], mouth: "flat", brow: -0.2 }} /><g transform="translate(980 720)"><rect x={0} y={60} width={420} height={24} rx={6} fill="#6E4527" /><rect x={60} y={40} width={220} height={24} rx={8} fill="#E8D9A8" /></g></g> },
  { a: 113.7, b: 118.3, cam: C(1.15, 1.2, 960, 980, 580, 580), r: (lt, t) => <g><Room t={t} tod="day" desk id="r6" /><Padre t={t} x={1160} y={880} pose={{ armR: [62, 40], look: [0.4, 0.9] }} /><g transform="translate(980 720)"><rect x={0} y={60} width={420} height={24} rx={6} fill="#6E4527" /></g><Tu t={t} x={640} talk pose={{ armR: [70 + Math.sin(t * 5) * 30, 50], armL: [40 + Math.sin(t * 4) * 20, 60], look: [0.9, 0], brow: 0.6 }} />
    {lt > 1.4 ? <g transform={`translate(560 ${330 - Math.min(1, (lt - 1.4) * 4) * 20})`} opacity={ip(lt, [1.4, 1.6], [0, 1])}><circle r={52} fill="#fff" /><g transform="translate(0 30) scale(0.5)"><Lamb t={t} /></g></g> : null}
    {lt > 2.3 ? <g transform="translate(680 300)" opacity={ip(lt, [2.3, 2.5], [0, 1])}><circle r={52} fill="#1A2350" /><circle cx={6} r={24} fill="#EEF0F8" /><circle cx={-6} cy={-4} r={20} fill="#1A2350" /></g> : null}
    {lt > 3.2 ? <g transform="translate(800 330)" opacity={ip(lt, [3.2, 3.4], [0, 1])}><circle r={52} fill="#A0121A" /><text y={20} textAnchor="middle" fontFamily="YCap" fontSize={56} fill="#fff">1°</text></g> : null}</g> },
  { a: 118.3, b: 125.9, cam: C(1.9, 2.0, 1160, 1160, 560, 560), r: (lt, t) => <g><Room t={t} tod="day" desk id="r7" /><Padre t={t} x={1160} y={880} talk={say(lt, 2.0, 6.6)} pose={{ armR: [62 + Math.sin(t * 9) * 3, 40], look: [0.4, 0.9], mouth: "smile", brow: -0.4, browTilt: 0.5, headTilt: -4 }} /><g transform="translate(980 720)"><rect x={0} y={60} width={420} height={24} rx={6} fill="#6E4527" /><rect x={60} y={40} width={220} height={24} rx={8} fill="#E8D9A8" /></g></g> },
  { a: 125.9, b: 131.3, cam: C(1.5, 1.6, 900, 920, 640, 640), r: (lt, t) => <g><Room t={t} tod="day" table id="r8" /><g transform="translate(1010 742)"><Bread cut={1} /></g><Madre t={t} x={760} y={900} pose={{ armR: [70 + (lt < 3.6 ? Math.abs(Math.sin(t * 6)) * 12 : 0), 20], look: lt < 3.6 ? [0.7, 0.8] : [0.6, 0.2], mouth: "flat", brow: lt > 3.6 ? 0.3 : 0 }} holdR={<g transform="rotate(10)"><Knife /></g>} /></g> },
  { a: 131.3, b: 133.8, cam: C(2.3, 2.4, 760, 760, 560, 560), r: (lt, t) => <g><Room t={t} tod="day" table id="r9" /><Madre t={t} x={760} y={900} pose={{ look: [0.1, 0.05], mouth: "flat", brow: 0.3, browTilt: -0.5 }} /></g> },
  { a: 133.8, b: 136.9, cam: C(2.2, 2.4, 640, 640, 560, 560), r: (lt, t) => <g><Room t={t} tod="day" id="r10" /><Tu t={t} x={640} pose={{ look: [-0.6, 0], mouth: "o", mouthOpen: 0.2, brow: 0.9, eyeOpen: 1.1 }} /></g> },
  { a: 136.9, b: 138.8, cam: C(2.4, 2.6, 760, 760, 560, 560), r: (lt, t) => <g><Room t={t} tod="day" table id="r11" /><Madre t={t} x={760} y={900} pose={{ look: [0.1, 0.05], mouth: "flat", brow: 0.3, browTilt: -0.5, headTilt: kf(lt, [[0.3, 0], [0.7, 6], [1.1, 0]]) }} /></g> },
  { a: 138.8, b: 140.9, big: "on", r: () => null },
  // ---------------- 5: la sangre ----------------
  { a: 140.9, b: 142.6, cam: C(1.3, 1.35, 1300, 1320, 520, 520), r: (lt, t) => <g><Room t={t} tod="dusk" id="r12" /><Tu t={t} x={1200} pose={{ look: [0.9, -0.2], mouth: "flat", brow: 0.3 }} /></g> },
  { a: 142.6, b: 144.6, cam: C(1.2, 1.3, 1500, 1520, 620, 620), r: (lt, t) => <g><Street t={t} tod="dusk" id="s14" lamb /><Vecino t={t} x={1450} y={950} pose={{ look: [0.8, 0.6], mouth: "flat" }} /></g> },
  { a: 144.6, b: 146.4, cam: C(1.9, 2.0, 1450, 1450, 700, 700), r: (lt, t) => <g><Street t={t} tod="dusk" id="s15" /><Vecino t={t} x={1450} y={950} pose={{ armR: [55, 20], look: [0.6, 0.9], mouth: "flat", brow: 0.3, browTilt: -0.4 }} holdR={<Bowl />} /></g> },
  { a: 146.4, b: 150.6, cam: C(1.6, 1.7, 1560, 1580, 720, 720), r: (lt, t) => <g><Street t={t} tod="dusk" id="s16" blood={ip(lt, [1.6, 4.0], [0, 1])} /><Vecino t={t} x={1420} y={950} pose={{ armR: [lt < 1.3 ? 40 : 95 + Math.sin(t * 2.5) * 30, lt < 1.3 ? 60 : 10], look: [0.9, -0.1], mouth: "flat" }} holdR={<Hyssop wet={lt > 0.9} />} /><g transform="translate(1340 950)"><Bowl /></g></g> },
  { a: 150.6, b: 156.1, cam: C(1.5, 1.55, 1585, 1585, 640, 640), r: (lt, t) => <g><Street t={t} tod="dusk" id="s17" blood={1} lintel={ip(lt, [0.3, 2.2], [0, 1])} /><Vecino t={t} x={1420} y={950} pose={{ armR: [150 - Math.sin(lt * 2) * 12, 10], look: [0.8, -0.8], mouth: "flat" }} holdR={<Hyssop wet />} /></g> },
  { a: 156.1, b: 159.4, cam: C(1, 1.05, 960, 960, 540, 540), r: (lt, t) => <Street t={t} tod="dusk" id="s18" blood={1} lintel={1} eyes /> },
  { a: 159.4, b: 162.1, cam: C(1.05, 1.1, 960, 1000, 560, 560), r: (lt, t) => <g><Street t={t} tod="night" id="s19" blood={1} lintel={1} /><Tu t={t} x={kf(lt, [[0, 420], [2.7, 1180]], (v) => v)} y={960} pose={{ walk: lt * 1.0, lean: 10, look: [0.6, 0.3], brow: 0.3 }} /></g> },
  { a: 162.1, b: 169.5, cam: C(1.3, 1.5, 1420, 1460, 700, 680), r: (lt, t) => <g><Street t={t} tod="night" id="s20" blood={1} lintel={1} /><Abuelo t={t} x={1585} y={1010} s={0.95} facing={-1} pose={{ look: lt > 4.6 ? [0.8, 0] : [0.4, 0.5], mouth: "flat", armR: [40, 20] }} holdR={<Staff />} /><Tu t={t} x={kf(lt, [[0, 1100], [1.6, 1260]])} y={960} pose={{ walk: lt < 1.6 ? lt : undefined, look: [0.8, 0.1], brow: 0.4 }} /></g> },
  { a: 169.5, b: 175.4, cam: C(2.2, 2.35, 1585, 1585, 640, 640), r: (lt, t) => <g><Street t={t} tod="night" id="s21" blood={1} lintel={1} /><Abuelo t={t} x={1585} y={1010} s={0.95} facing={-1} talk={say(lt, 0.1, 1.1) || say(lt, 1.6, 3.2) || say(lt, 3.6, 5.5)} pose={{ look: [0.6, 0], armR: [40, 20], brow: 0.2 }} holdR={<Staff />} /></g>,
    html: (lt) => <>{lt < 3.4 ? <Caption t={lt} x={W / 2} y={880} words={[["MUCHACHO…", 0.1], ["DIOS", 1.2], ["NO", 1.5], ["PREGUNTÓ", 1.7], ["DE QUÉ", 2.3], ["PUEBLO", 2.6], ["ERES.", 2.95]]} size={56} /> : <Caption t={lt} x={W / 2} y={880} words={[["PREGUNTÓ", 3.5], ["DÓNDE", 4.05], ["VAS", 4.5], ["A", 4.8], ["ESTAR.", 4.95]]} size={56} />}</> },
  { a: 175.4, b: 177.2, big: "on", r: () => null },
  // ---------------- 6: elegir ----------------
  { a: 177.2, b: 179.5, cam: C(1.4, 1.45, 1580, 1580, 600, 600), shake: 4, r: (lt, t) => <g><Room t={t} tod="night" door="right" beam={ip(lt, [0.6, 1.1], [0, 1])} id="r13" lamp={[980, 770]} /><Padre t={t} x={1460} pose={{ armR: [lt < 1.1 ? 95 : 70, 10], armL: [lt < 1.1 ? 95 : 70, 10], look: [0.9, 0], mouth: "flat", brow: -0.3 }} /></g> },
  { a: 179.5, b: 189.1, cam: C(1, 1.15, 960, 960, 560, 600), r: (lt, t) => <City t={t} id="c4" mode="night" lampsOut={ip(lt, [0.8, 7.5], [0, 1])} /> },
  { a: 189.1, b: 197.8, cam: C(1.2, 1.5, 960, 960, 640, 600), r: (lt, t) => <g><Street t={t} tod="night" id="s22" blood={1} lintel={1} yourDoorBarred /><Tu t={t} x={960} y={960} pose={{ look: lt < 2.0 ? [0, 0] : lt < 5.1 ? [-0.9, 0] : [0.9, 0], mouth: "worry", brow: 0.6, browTilt: -0.7, headTilt: lt < 2 ? 0 : lt < 5.1 ? -6 : 6 }} /></g> },
  { a: 197.8, b: 199.9, big: "on", r: () => null },
  // ---------------- 7: la noche ----------------
  { a: 199.9, b: 206.2, cam: C(1.35, 1.4, 1150, 1200, 600, 600), r: (lt, t) => { const handed = lt > 3.3; return <g><Room t={t} tod="night" door="right" doorOpen={ip(lt, [3.8, 5.0], [0, 1])} id="r14" /><Madre t={t} x={980} pose={{ armR: [handed ? 20 : 70, 20], look: [0.8, 0], mouth: "flat", brow: 0.4, browTilt: -0.6 }} holdR={!handed ? <OilLamp t={t} /> : null} /><Tu t={t} x={1260} facing={-1} pose={{ armR: [handed ? 60 : 15, 20], look: [0.8, 0], brow: 0.5 }} holdR={handed ? <OilLamp t={t} /> : null} /><Glow id="lmp14" x={handed ? 1180 : 1070} y={760} r={500} o={0.8} /></g>; } },
  { a: 206.2, b: 210.1, cam: C(1.4, 1.5, 1300, 1400, 600, 600), r: (lt, t) => <g><Room t={t} tod="night" door="right" doorOpen={1} id="r15" /><Madre t={t} x={1100} pose={{ armR: [lt > 2.6 ? 85 : 30, 0], armL: [lt > 2.6 ? 80 : 20, 0], look: [0.8, 0], mouth: "worry", brow: 0.5, browTilt: -0.8, lean: lt > 2.6 ? 8 : 0 }} /><Tu t={t} x={kf(lt, [[2.6, 1300], [3.4, 1720]])} facing={-1} pose={{ armR: [60, 20], look: [0.8, 0], brow: 0.6, squash: lt > 2.6 && lt < 2.9 ? -0.6 : 0 }} holdR={<OilLamp t={t} />} /><Glow id="lmp15" x={kf(lt, [[2.6, 1220], [3.4, 1640]])} y={760} r={480} o={0.8} /></g> },
  { a: 210.1, b: 217.7, cam: C(1.05, 1.2, 860, 900, 560, 600), r: (lt, t) => <g><Street t={t} tod="night" id="s23" blood={1} lintel={1} yourDoorBarred fog={kf(lt, [[0, -500], [7.6, 900]], (v) => v)} dark={0.15} /><Tu t={t} x={700} y={960} pose={{ armR: [60, 20], look: [0.7, 0], brow: 0.5, browTilt: -0.4, mouth: "worry" }} holdR={<OilLamp t={t} />} /><Glow id="lmp16" x={780} y={720} r={420} o={0.8} /></g> },
  { a: 217.7, b: 221.6, cam: C(1.25, 1.35, 1000, 1240, 620, 620), r: (lt, t) => <g><Street t={t} tod="night" id="s24" blood={1} lintel={1} yourDoorBarred fog={900} dark={0.15} /><Tu t={t} x={kf(lt, [[0, 700], [3.4, 1360]], (v) => v)} y={960} pose={{ walk: lt * 1.1, armR: [60, 20], look: [0.8, 0], brow: 0.4 }} holdR={<OilLamp t={t} />} /><Glow id="lmp17" x={kf(lt, [[0, 780], [3.4, 1440]], (v) => v)} y={720} r={420} o={0.8} /></g>,
    html: (lt) => <><Caption t={lt} x={W / 2} y={200} words={[["10", 0.9]]} size={90} />{lt > 2.05 ? <Caption t={lt} x={W / 2 + 160} y={200} words={[["5", 2.08]]} size={90} /> : null}{lt > 2.9 ? <Caption t={lt} x={W / 2 + 280} y={200} words={[["2", 2.92]]} size={90} /> : null}</> },
  { a: 221.6, b: 227.6, cam: C(1.9, 2.0, 1500, 1500, 620, 620), shake: 0, r: (lt, t) => { const k1 = lt > 0.05 && lt < 0.5, k2 = lt > 2.5 && lt < 2.95; return <g><Street t={t} tod="night" id="s25" blood={1} lintel={1} fog={900} dark={0.15} /><Tu t={t} x={1370} y={960} pose={{ armR: [60, 20], armL: [k1 || k2 ? 95 + Math.sin(t * 40) * 10 : 30, k1 || k2 ? 10 : 40], look: [0.9, 0], brow: 0.5, browTilt: -0.5, mouth: "worry" }} holdR={<OilLamp t={t} />} /><Glow id="lmp18" x={1450} y={720} r={380} o={0.8} /></g>; },
    html: (lt) => <>{lt > 0.05 && lt < 1.0 ? <TocToc lt={lt - 0.05} /> : null}{lt > 2.5 && lt < 3.5 ? <TocToc lt={lt - 2.5} /> : null}{lt > 5.2 ? <Caption t={lt} x={W / 2} y={880} words={[["¿QUIÉN", 5.2], ["ES?", 5.5]]} /> : null}</> },
  { a: 227.6, b: 233.5, cam: C(2.2, 2.6, 1370, 1370, 560, 555), bw: 0, r: (lt, t) => <g><Street t={t} tod="night" id="s26" blood={1} lintel={1} fog={900} dark={0.2} /><Tu t={t} x={1370} y={960} talk={say(lt, 0.0, 1.7)} pose={{ armR: [60, 20], look: [0.9, 0], brow: 0.6, browTilt: -0.7, mouth: "worry" }} holdR={<OilLamp t={t} />} />{lt > 2 ? <ellipse cx={1405} cy={560} rx={6} ry={10} fill="#BFE4FF" opacity={0.9} transform={`translate(0 ${(lt - 2) * 30})`} /> : null}<Glow id="lmp19" x={1450} y={720} r={380} o={0.8} /></g> },
  { a: 233.5, b: 237.2, cam: C(1.6, 1.7, 1500, 1520, 640, 640), r: (lt, t) => { const op = ip(lt, [0.3, 1.0], [0, 1]); return <g><Street t={t} tod="night" id="s27" blood={1} lintel={1} fog={900} dark={0.15} /><rect x={1500} y={560} width={170 * op} height={340} fill="#FFC06A" opacity={0.9} /><Glow id="dor" x={1585} y={730} r={420 * op} o={op} />{lt < 2.6 ? <Tu t={t} x={kf(lt, [[2.1, 1370], [2.5, 1600]])} y={960} pose={{ armR: [60, 20], armL: [lt > 1.9 ? 90 : 30, 0], look: [0.9, 0], brow: 0.9, mouth: "o", mouthOpen: 0.5, squash: lt > 2.0 && lt < 2.3 ? -0.5 : 0 }} holdR={<OilLamp t={t} />} /> : null}{lt > 1.6 && lt < 2.4 ? <g transform={`translate(${kf(lt, [[1.6, 1520], [2.0, 1450], [2.4, 1560]])} 700)`}><path d="M60 0 L 0 0" stroke="#111" strokeWidth={16} strokeLinecap="round" /><circle r={16} fill="#111" /></g> : null}</g>; } },
  { a: 237.2, b: 239.5, big: "on", red: true, r: () => null },
  { a: 239.5, b: 250.5, cam: C(1.05, 1.2, 860, 1060, 600, 620), r: (lt, t) => <g><HebrewRoom t={t} id="h1" />
    <Vecino t={t} x={520} y={900} pose={{ armR: [20, 10], look: [Math.sin(t * 0.7) * 0.8, 0], mouth: "flat" }} holdR={<Staff />} />
    <Madre id="mh" t={t} x={690} y={900} robe="#6E5A8A" robe2="#4A3A62" pose={{ look: [Math.sin(t * 0.6 + 1) * 0.6, 0.3], mouth: "flat" }} />
    <Tu t={t} x={1300} y={900} pose={{ armR: [55, 20], look: [Math.sin(t * 0.9 + 2) * 0.8, 0], mouth: "worry", brow: 0.4, browTilt: -0.5 }} holdR={<OilLamp t={t} />} />
    <Eliab t={t} x={1480} y={900} facing={-1} pose={{ armR: [20, 10], look: [Math.sin(t * 0.8) * 0.7, 0], mouth: "flat" }} holdR={<Staff />} />
    <Abuelo t={t} x={1680} y={900} facing={-1} pose={{ armR: [20, 10], look: [0.5, 0.2], mouth: "flat" }} holdR={<Staff />} /></g> },
  { a: 250.5, b: 254.8, cam: C(1.4, 1.5, 1585, 1585, 680, 680), r: (lt, t) => <Street t={t} tod="night" id="s28" blood={1} lintel={1} fog={kf(lt, [[0, 300], [4.3, 2100]], (v) => v)} dark={0.2} /> },
  { a: 254.8, b: 259.3, cam: C(1, 1.05, 960, 960, 540, 540), r: (lt, t) => { const tilt = kf(lt, [[1.3, 0], [2.4, -38], [3.4, -38], [3.8, 0]]); return <g><rect width={W} height={H} fill="#120C08" /><Glow id="fl" x={960} y={520} r={900} o={1} /><g transform="translate(960 760) scale(4.2)"><path d="M-34 0 Q -30 -22 0 -24 Q 30 -22 40 -10 L 56 -14 Q 50 -2 34 0 Z" fill="#B5703F" /><g transform={`translate(52 -14) rotate(${tilt})`}><Flame t={t} s={0.55} /></g></g></g>; } },
  { a: 259.3, b: 263.1, cam: C(1.0, 1.08, 960, 960, 540, 540), shake: 14, red: true, r: (lt, t) => <City t={t} id="c5" mode="night" lampsOut={1} />, html: (lt) => <AbsoluteFill style={{ background: "#8E0A10", opacity: ip(lt, [0.5, 0.65, 1.6], [0, 0.55, 0.12]), mixBlendMode: "multiply" }} /> },
  { a: 263.1, b: 269.4, cam: C(1.05, 1.3, 960, 980, 560, 640), r: (lt, t) => <City t={t} id="c6" mode="night" lampsOut={1} fogX={kf(lt, [[0, 200], [6.3, 1400]], (v) => v)} /> },
  { a: 269.4, b: 275.7, cam: C(1.15, 1.3, 1100, 1120, 600, 600), r: (lt, t) => <g><Palace t={t} id="p2" /><Faraon t={t} x={900} y={880} s={1.1} pose={{ armL: [75 + Math.sin(t * 4) * 8, 30], armR: [75 + Math.sin(t * 4) * 8, 30], mouth: "worry", brow: 0.7, browTilt: -1, look: [0.8, 0], lean: 8 }} talk={say(lt, 2.8, 5.5)} /><Moises t={t} x={1380} y={880} s={1.1} facing={-1} pose={{ armR: [30, 10], look: [0.8, 0], mouth: "flat", brow: -0.2 }} holdR={<Staff />} /></g> },
  // ---------------- 8: éxodo ----------------
  { a: 275.7, b: 279.4, cam: C(1, 1.1, 960, 960, 540, 560), r: (lt, t) => <Exodus t={t} lt={lt + 10} id="e1" /> },
  { a: 279.4, b: 288.4, cam: C(1.1, 1.25, 900, 1100, 600, 620), r: (lt, t) => <Exodus t={t} lt={lt + 30} id="e2" />, html: (lt) => <Verse lt={lt} /> },
  { a: 288.4, b: 291.7, cam: C(1.6, 1.7, 960, 960, 640, 640), r: (lt, t) => <g><Exodus t={t} lt={lt + 60} id="e3" /><Tu t={t} x={960} y={1000} s={0.95} pose={{ walk: lt * 1.1, look: [0.7, 0], mouth: "flat" }} /></g> },
  { a: 291.7, b: 296.7, cam: C(1.7, 1.9, 960, 960, 620, 600), r: (lt, t) => <g><Exodus t={t} lt={lt + 70} id="e4" /><Tu t={t} x={960} y={1000} s={0.95} facing={lt > 2.2 ? -1 : 1} pose={{ walk: lt < 2.0 ? lt * 1.1 : undefined, look: [0.8, 0], mouth: lt > 2.2 ? "worry" : "flat", brow: lt > 2.2 ? 0.5 : 0, browTilt: lt > 2.2 ? -0.6 : 0 }} /></g> },
  { a: 296.7, b: 303.4, cam: C(1.2, 2.0, 400, 315, 640, 700), bw: 3.3, r: (lt, t) => <Street t={t} tod="dawn" id="s29" yourDoorBarred blood={1} lintel={1} /> },
  { a: 303.4, b: 308.4, cam: C(1.6, 1.9, 1585, 1585, 700, 680), r: (lt, t) => <g><Street t={t} tod="dawn" id="s30" blood={1} lintel={1} /><g transform="translate(1720 950)"><OilLamp t={t} /></g></g>, html: (lt) => <AbsoluteFill style={{ background: "#000", opacity: ip(lt, [4.2, 4.9], [0, 1]) }} /> },
];
export const PASCUA_END = 308.4;

const Plagues: React.FC<{ lt: number }> = ({ lt }) => {
  const names = ["SANGRE", "RANAS", "PIOJOS", "MOSCAS", "GANADO", "ÚLCERAS", "GRANIZO", "LANGOSTAS", "TINIEBLAS"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2A1A14 0%, #0A0606 80%)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 260px)", gap: 26 }}>
        {names.map((n, i) => { const p = ip(lt, [0.1 + i * 0.09, 0.3 + i * 0.09], [0, 1]); return (
          <div key={i} style={{ height: 170, borderRadius: 22, background: "#F3E6C8", opacity: p, transform: `scale(${0.7 + 0.3 * p})`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 30px rgba(0,0,0,.4)", position: "relative" }}>
            <div style={{ fontFamily: "YCap", fontSize: 64, color: "#2A1A10" }}>{i + 1}</div>
            <div style={{ fontFamily: "YCap", fontSize: 26, color: "#6A4A2A", letterSpacing: 2 }}>{n}</div>
            <div style={{ position: "absolute", left: 20, right: 20, top: 82, height: 8, background: "#A0121A", borderRadius: 4, transform: `scaleX(${ip(lt, [0.6 + i * 0.09, 0.75 + i * 0.09], [0, 1])})`, transformOrigin: "left" }} />
          </div>); })}
        <div style={{ height: 170, borderRadius: 22, border: `6px solid rgba(220,30,40,${0.5 + 0.5 * Math.abs(Math.sin(lt * 4))})`, display: "flex", justifyContent: "center", alignItems: "center", opacity: ip(lt, [1.5, 1.8], [0, 1]), boxShadow: `0 0 ${40 + 30 * Math.abs(Math.sin(lt * 4))}px rgba(220,30,40,.6)` }}>
          <div style={{ fontFamily: "YCap", fontSize: 110, color: "#E2333A" }}>10</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const TocToc: React.FC<{ lt: number }> = ({ lt }) => <div style={{ position: "absolute", left: 1180, top: 300, fontFamily: "YCap", fontSize: 90, color: "#FFF", WebkitTextStroke: "14px #2A160A", paintOrder: "stroke fill", transform: `rotate(-8deg) scale(${ip(lt, [0, 0.1], [0.3, 1])})`, opacity: ip(lt, [0.7, 0.95], [1, 0]) }}>TOC TOC</div>;
const Verse: React.FC<{ lt: number }> = ({ lt }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center", opacity: ip(lt, [3.9, 4.4], [0, 1]) }}>
    <div style={{ background: "rgba(20,12,8,.72)", borderRadius: 18, padding: "22px 40px", maxWidth: 1300, textAlign: "center" }}>
      <div style={{ fontFamily: "YCap", fontSize: 40, color: "#FFF1D6", lineHeight: 1.25 }}>«También subió con ellos grande multitud de toda clase de gentes»</div>
      <div style={{ fontFamily: "YCap", fontSize: 28, color: "#FFD23F", marginTop: 10, letterSpacing: 3 }}>ÉXODO 12:38</div>
    </div>
  </div>
);
const BigClock: React.FC<{ t: number; lt: number; red?: boolean }> = ({ t, lt, red }) => {
  const sc = ip(lt, [0, 0.25], [1.3, 1]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1A0E0C 0%, #050304 75%)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${sc})` }}>
        <div style={{ fontFamily: "YCap", fontSize: 44, letterSpacing: 14, color: red ? "#E2333A" : "#D9C9A5" }}>{red ? "MEDIANOCHE" : "FALTAN"}</div>
        <div style={{ fontFamily: "YMono", fontSize: 220, color: red ? "#FF3B42" : "#FFF4DE", textShadow: `0 0 40px ${red ? "rgba(255,40,50,.7)" : "rgba(255,200,120,.5)"}` }}>{fmt(remaining(t))}</div>
      </div>
    </AbsoluteFill>
  );
};
const MiniClock: React.FC<{ t: number; v: boolean }> = ({ t, v }) => {
  const r = remaining(t);
  return (
    <div style={{ position: "absolute", right: v ? 40 : 70, top: v ? 120 : 100, background: "rgba(10,8,6,.72)", borderRadius: 14, padding: "10px 20px", border: `2px solid ${r < 700 ? "rgba(226,51,58,.8)" : "rgba(255,230,190,.25)"}` }}>
      <div style={{ fontFamily: "YCap", fontSize: 18, letterSpacing: 5, color: "#D9C9A5", textAlign: "center" }}>FALTAN</div>
      <div style={{ fontFamily: "YMono", fontSize: 44, color: r < 700 ? "#FF4A50" : "#FFF4DE" }}>{fmt(r)}</div>
    </div>
  );
};

export const Pascua: React.FC<{ vertical?: boolean; from?: number }> = ({ vertical, from = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = from + f / fps;
  const sh = S.find((s) => t >= s.a && t < s.b) ?? S[S.length - 1];
  const lt = t - sh.a;
  const VW = vertical ? 1080 : W, VH = vertical ? 1920 : H;
  const k = vertical ? 1920 / 1080 : 1;
  const cam = sh.cam ?? wide;
  const p = ip(lt, [0, sh.b - sh.a], [0, 1], (x) => x);
  const e = p * p * (3 - 2 * p);
  const z = cam[0] + (cam[1] - cam[0]) * e;
  const hw = VW / 2 / (z * k), hh = VH / 2 / (z * k);
  const cl = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.min(b, Math.max(a, v)));
  const cx = cl(cam[2] + (cam[3] - cam[2]) * e, hw, W - hw), cy = cl(cam[4] + (cam[5] - cam[4]) * e, hh, H - hh);
  const shk = sh.shake ? sh.shake * Math.max(0, 1 - lt / 1.2) : 0;
  const sx = shk * Math.sin(t * 61), sy = shk * Math.cos(t * 53);
  const bw = sh.bw !== undefined ? ip(lt, [sh.bw, sh.bw + 0.6], [0, 1]) : 0;
  const showMini = t > 14.3 && t < 259.3 && !sh.big;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {sh.big ? <BigClock t={t} lt={lt} red={sh.red} /> : (
        <AbsoluteFill style={{ filter: bw > 0 ? `grayscale(${bw}) contrast(${1 + bw * 0.15})` : undefined }}>
          <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`}>
            <g transform={`translate(${VW / 2 + sx} ${VH / 2 + sy}) scale(${z * k}) translate(${-cx} ${-cy})`}>{sh.r(lt, t)}</g>
          </svg>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)" }} />
        </AbsoluteFill>
      )}
      {sh.html ? <AbsoluteFill style={vertical ? { transform: `scale(${1080 / 1920})`, transformOrigin: "50% 50%", width: W, height: H, left: (1080 - W) / 2, top: (1920 - H) / 2 } : undefined}>{sh.html(lt, t)}</AbsoluteFill> : null}
      {showMini ? <MiniClock t={t} v={!!vertical} /> : null}
      {!vertical ? <><div style={{ position: "absolute", left: 0, top: 0, width: W, height: 70, background: "#000" }} /><div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: 70, background: "#000" }} /></> : null}
      {!vertical || from === 0 ? null : null}
      <Audio src={staticFile("yt1/mix.wav")} trimBefore={Math.round(from * fps)} />
    </AbsoluteFill>
  );
};
