import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/pedro/words.json";
import {
  Big, Birds, Bubble, Cam, Captions, CaptionsCine, CaptionsImpacto, CaptionsResaltador, Chip, Dust, Embers, Enter, Figure, Fire, Fog, FPS, GodRays, Grain, Layer, Moon, Olive, Rain, Rooster, S, Sheep, Smoke, Soldier, Stars, Torch, Vignette, Word, ease, groupWords, ip, pop,
} from "../kit/Kit";

// "Pedro negó a Jesús tres veces… y aun así lo eligió". Todo dibujado con código y medido contra las referencias:
// voz −16 LUFS, música por debajo con compresión, 7 efectos (solo al abrir un bloque o antes de un giro),
// movimiento constante (cámara con parallax, respiración, tela, fuego, humo) y un cambio grande cada ~2,3 s.
export const PEDRO_TOTAL = S(44);

// ---------- palabras ----------
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const FIX: Record<string, string> = { "¿No": "«No", "conozco?": "conozco»", "dijo,": "dijo:", "Tú": "«Tú", "él.": "él»", "gritó.": "gritó:", No: "«No", "hombre.": "hombre»", "veces,": "veces:", "¿me": "«¿Me", "amas?": "amas?»", apacienta: "«Apacienta", "ovejas.": "ovejas»" };
const WORDS: Word[] = RAW.map((c, i) => {
  let w = c.text.trim();
  if (FIX[w] && !(w === "No" && RAW[i + 1]?.text.trim() === "eligió")) w = FIX[w];
  return { w, s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 };
});
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["pedro", "jesús", "nunca", "fogata", "sirvienta", "conozco", "señaló", "tercero", "hombre", "gallo", "miró", "lloró", "amargamente", "tres", "amas", "negación", "ovejas", "volvió"]);

// cámara: fotogramas clave (segundo, x, y, zoom) + pulso de mano suave para que nunca esté quieta
type K = [number, number, number, number];
const camAt = (keys: K[], t: number): Cam => {
  let c: K = keys[keys.length - 1];
  if (t <= keys[0][0]) c = keys[0];
  else
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, x0, y0, z0] = keys[i];
      const [t1, x1, y1, z1] = keys[i + 1];
      if (t <= t1) {
        const u = ease((t - t0) / (t1 - t0));
        c = [t, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u];
        break;
      }
    }
  return [t, c[1] + 7 * Math.sin(t * 0.9) + 3 * Math.sin(t * 2.3), c[2] + 5 * Math.sin(t * 1.3), c[3] * (1 + 0.006 * Math.sin(t * 0.7))];
};

const Heart: React.FC<{ s: number }> = ({ s }) => (
  <svg width={70 * s} height={64 * s} viewBox="0 0 70 64">
    <path d="M35 60 C10 42 2 30 2 18 C2 8 10 2 19 2 C26 2 31 6 35 12 C39 6 44 2 51 2 C60 2 68 8 68 18 C68 30 60 42 35 60 Z" fill="#FF4F5E" style={{ filter: "drop-shadow(0 0 14px #FF4F5E)" }} />
  </svg>
);
const Tally: React.FC<{ f: number; show: number; marks: number[]; hearts?: number[]; hide?: number }> = ({ f, show, marks, hearts = [], hide = 99999 }) => {
  if (f < show || f > hide) return null;
  const o = ip(f - show, [0, 8], [0, 1]) * ip(f, [hide - 8, hide], [1, 0]);
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28, opacity: o, transform: `translateY(${ip(f - show, [0, 10], [-30, 0])}px)` }}>
      {[0, 1, 2].map((i) => {
        const xm = f - marks[i];
        const hm = hearts[i] !== undefined ? f - hearts[i] : -1;
        return (
          <div key={i} style={{ width: 120, height: 120, borderRadius: 26, background: "rgba(8,10,16,0.82)", border: `3px solid ${hm >= 0 ? "#FF4F5E" : xm >= 0 ? "#FF3B3B" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hm >= 0 ? "0 0 40px rgba(255,79,94,0.6)" : xm >= 0 && xm < 10 ? "0 0 50px rgba(255,59,59,0.8)" : "0 10px 30px rgba(0,0,0,0.5)", transform: `scale(${xm >= 0 && xm < 8 ? 1 + 0.12 * (1 - xm / 8) : 1})` }}>
            {hm >= 0 ? <div style={{ transform: `scale(${pop(hm)}) rotate(${(1 - Math.min(1, hm / 10)) * 180}deg)` }}><Heart s={1.15} /></div> : xm >= 0 ? <div style={{ transform: `scale(${pop(xm)})`, fontFamily: "sans-serif", fontWeight: 900, fontSize: 92, color: "#FF3B3B", lineHeight: 1, textShadow: "0 0 24px #FF3B3B" }}>✕</div> : null}
          </div>
        );
      })}
    </div>
  );
};

// skyline de Jerusalén en silueta con ventanas encendidas
const Skyline: React.FC<{ f: number; y: number; c?: string }> = ({ f, y, c = "#0D0B16" }) => (
  <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
    <path d={`M0 ${y} L120 ${y} L120 ${y - 90} L200 ${y - 90} L200 ${y - 40} L330 ${y - 40} L330 ${y - 160} Q380 ${y - 230} 430 ${y - 160} L430 ${y - 30} L620 ${y - 30} L620 ${y - 120} L700 ${y - 120} L700 ${y - 60} L900 ${y - 60} L900 ${y - 210} L940 ${y - 260} L980 ${y - 210} L980 ${y - 50} L1180 ${y - 50} L1180 ${y - 140} Q1260 ${y - 220} 1340 ${y - 140} L1340 ${y - 70} L1560 ${y - 70} L1560 ${y - 110} L1650 ${y - 110} L1650 ${y - 30} L1900 ${y - 30} L1900 ${y + 400} L0 ${y + 400} Z`} fill={c} />
    {Array.from({ length: 26 }, (_, i) => (
      <rect key={i} x={60 + random(`wx${i}`) * 1780} y={y - 20 - random(`wy${i}`) * 90} width={9} height={12} rx={2} fill="#FFB65A" opacity={0.35 + 0.35 * Math.abs(Math.sin(f / 30 + i))} />
    ))}
  </svg>
);

// ---------- 1 · 0–3,15 s: la promesa ----------
const Promesa: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[0, 950, 1250, 1.0], [1.03, 950, 1270, 1.06], [1.04, 1100, 1330, 1.5], [1.51, 1100, 1330, 1.55], [1.52, 960, 1300, 1.15], [3.15, 960, 1320, 1.25]], f / FPS);
  return (
    <AbsoluteFill style={{ background: "#050816" }}>
      <Layer cam={cam} d={0.2}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#040714, #0D1834 45%, #1A2236 70%)" }} />
        <Stars f={f} n={140} h={1100} />
        <Moon x={1250} y={760} r={78} />
      </Layer>
      <Layer cam={cam} d={0.5}>
        <Skyline f={f} y={1240} />
        {/* procesión de antorchas a lo lejos: anticipa la traición */}
        {[0, 1, 2, 3, 4].map((i) => <Torch key={i} f={f} x={300 + i * 70 + f * 1.4} y={1250 + (i % 2) * 8} s={0.35} />)}
      </Layer>
      <Layer cam={cam} d={0.8}>
        <Olive x={330} y={1560} s={1.7} />
        <Olive x={1620} y={1540} s={1.5} />
        <div style={{ position: "absolute", left: 0, width: 1900, top: 1420, height: 1000, background: "linear-gradient(#141019, #07060A 40%)" }} />
        <Fog f={f} y={1330} />
      </Layer>
      <Layer cam={cam} d={1}>
        <Figure f={f} x={820} y={1560} h={600} rim="#9EC2FF" rimSide={1} cloth="#6B1F1F" arm={ip(f, [S(1.5), S(1.95)], [0, 62])} head={ip(f, [S(1.0), S(1.4)], [0, -8])} />
        <Figure f={f} x={1100} y={1560} h={630} rim="#FFE3B0" rimSide={-1} cloth="#D8D2C4" flip glow={0.6} head={4} />
      </Layer>
      <Layer cam={cam} d={1.4}>
        <Olive x={-40} y={2000} s={2.4} c="#020306" />
        <Olive x={1950} y={2000} s={2.2} c="#020306" />
      </Layer>
      <Chip x={410} y={1600} t={f - S(0.32)} text="Pedro" />
      <Chip x={690} y={1600} t={f - S(1.04)} text="Jesús" accent="#FFE3B0" />
      <Big x={540} y={760} t={f - S(1.52)} text="«nunca»" size={160} />
      <Dust f={f} color="200,215,255" />
      <Grain f={f} />
      <Vignette s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- 2 · 3,15–24,95 s: el patio, un único mundo con 5 capas de profundidad ----------
const PATIO_T0 = 3.15;
const Patio: React.FC = () => {
  const f = useCurrentFrame();
  const t = PATIO_T0 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const cam = camAt(
    [
      // corte = dos claves casi en el mismo instante (salto de plano en la palabra clave)
      [3.15, 950, 1150, 0.82], [4.27, 950, 1190, 0.88],
      [4.28, 950, 1440, 1.45], [6.07, 940, 1400, 1.38], // "fogata": plano cerrado del fuego
      [6.08, 760, 1300, 1.1], [8.21, 760, 1290, 1.2], // entra la sirvienta
      [8.22, 700, 1330, 1.55], [9.99, 720, 1330, 1.6], // "«Tú estabas con él»"
      [10.0, 1080, 1320, 1.6], [11.89, 1080, 1310, 1.66], // "«No lo conozco»" primer plano de Pedro
      [11.9, 1250, 1270, 1.1], [13.69, 1220, 1270, 1.18], // "Otro lo señaló"
      [13.7, 1080, 1320, 1.7], [15.47, 1080, 1310, 1.75], // segunda negación
      [15.48, 950, 1300, 0.96], [17.23, 980, 1290, 1.06], // el tercero en primer plano
      [17.24, 1080, 1300, 1.85], [19.43, 1080, 1290, 1.95], // grito
      [19.44, 950, 1250, 1.05], [20.93, 950, 1240, 1.1], // tercera negación: plano abierto
      [20.94, 1360, 900, 1.9], [22.95, 1340, 920, 1.75], // el gallo
      [22.96, 630, 960, 1.9], [23.91, 640, 970, 2.0], // Jesús se gira
      [23.92, 860, 1120, 0.98], [24.95, 880, 1140, 1.06], // la mirada cruza el patio
    ],
    t,
  );
  const red = ip(ft(17.24), [0, 6, 70, 84], [0, 0.42, 0.35, 0]);
  const dawn = ip(ft(20.9), [0, 40], [0, 1]);
  const shake = ft(17.24) >= 0 && ft(17.24) < 22 ? Math.sin(f * 2.3) * 12 * (1 - ft(17.24) / 22) : 0;
  const fireGrow = ease(ip(ft(4.28), [0, 20], [0, 1]));
  const beam = ip(ft(23.92), [0, 12], [0, 1]);
  const jesusTurn = ft(22.96) >= 0;
  const pedroLean = ft(17.24) >= 0 && ft(17.24) < 80 ? -6 : ft(10.0) >= 0 && ft(10.0) < 30 ? 4 : ft(13.7) >= 0 && ft(13.7) < 30 ? 4 : 0;
  return (
    <AbsoluteFill style={{ background: "#050813" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.15} shake={shake}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgb(${5 + 26 * dawn},${8 + 16 * dawn},${19 + 46 * dawn}), #121a35 45%, #1d1626 70%)` }} />
          <Stars f={f} n={150} seed="p" h={1000} />
          <Moon x={1500} y={520} r={70} o={1 - dawn * 0.6} />
        </Layer>
        <Layer cam={cam} d={0.45} shake={shake}>
          <Skyline f={f} y={930} />
        </Layer>
        <Layer cam={cam} d={0.75} shake={shake}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 900 L1900 900 L1900 1500 L0 1500 Z" fill="#17121C" />
            <path d="M0 880 L1900 880 L1900 916 L0 916 Z" fill="#241B28" />
            {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 48} y={940 + (i % 3) * 140} width={44} height={2} fill="#221A26" />)}
            {[200, 520, 1180, 1500].map((x, i) => <path key={i} d={`M${x - 90} 1500 L${x - 90} 1170 Q${x} 1070 ${x + 90} 1170 L${x + 90} 1500 Z`} fill="#0A080E" />)}
            <path d="M380 1020 L860 1020 L860 1060 L380 1060 Z" fill="#2A2030" />
          </svg>
          {[200, 520, 1180, 1500].map((x, i) => <Torch key={i} f={f} x={x} y={1190} s={1.1} />)}
          <Rooster x={1360} y={882} s={0.9} crow={ft(21.24) >= 0 ? Math.abs(Math.sin(ft(21.24) / 4)) * ip(ft(21.24), [0, 40], [1, 0]) : 0} />
          {ft(21.24) >= 0
            ? [0, 1, 2].map((i) => {
                const k = ft(21.24) - i * 7;
                return k > 0 ? <div key={i} style={{ position: "absolute", left: 1400, top: 790, width: 40, height: 40, transform: `translate(-50%,-50%) scale(${1 + k * 0.25})`, borderRadius: "50%", border: "3px solid rgba(255,230,180,0.8)", opacity: ip(k, [0, 30], [0.9, 0]) }} /> : null;
              })
            : null}
          <Figure f={f} x={620} y={1022} h={240} rim="#FFE3B0" rimSide={1} cloth="#D8D2C4" flip={!jesusTurn} glow={0.5 + 0.6 * beam} head={jesusTurn ? 10 : 0} shadow={false} />
          {/* soldados de guardia en los arcos */}
          <Soldier f={f} x={330} y={1500} h={300} torch />
          <Soldier f={f} x={1640} y={1500} h={300} flip />
        </Layer>
        <Layer cam={cam} d={1} shake={shake}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 1500 L1900 1500 L1900 2400 L0 2400 Z" fill="#100C10" />
            {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 70 - 200} 2400 L${950 + (i - 15) * 18} 1500`} stroke="#171117" strokeWidth={3} />)}
            <ellipse cx={950} cy={1540} rx={620} ry={90} fill={`rgba(255,140,60,${0.08 + 0.14 * fireGrow})`} />
          </svg>
          {beam > 0 ? (
            <svg width={1900} height={2400} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
              <defs>
                <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFE9C0" stopOpacity={0.75 * beam} />
                  <stop offset="1" stopColor="#FFE9C0" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <path d="M600 880 L660 870 L1170 1320 L1000 1360 Z" fill="url(#beam)" />
            </svg>
          ) : null}
          <Smoke f={f} x={950} y={1380} n={12} />
          <Fire f={f} x={950} y={1540} scale={1.15} grow={fireGrow} />
          {fireGrow > 0.1 ? <Embers f={f} x={950} y={1400} w={240} n={50} /> : null}
          <Figure f={f} x={1080} y={1560} h={420} rim="#FFB25A" rimSide={-1} cloth="#6B1F1F" lean={pedroLean} arm={ft(17.24) >= 0 && ft(17.24) < 80 ? 70 : 0} head={beam > 0 ? -12 : ft(10.0) >= 0 && ft(10.0) < 40 ? 8 : 0} glow={beam * 0.6} />
          <Figure f={f} x={ip(ft(6.08), [0, 24], [480, 700])} y={1560} h={400} rim="#FFB25A" rimSide={1} cloth="#4A3A5E" o={ip(ft(6.08), [0, 10], [0, 1])} arm={ip(ft(8.2), [0, 8], [0, 85])} head={6} />
          <Figure f={f} x={ip(ft(11.9), [0, 20], [1500, 1300])} y={1570} h={430} rim="#FFB25A" rimSide={-1} cloth="#2E4A3A" flip o={ip(ft(11.9), [0, 10], [0, 1])} arm={ip(ft(12.3), [0, 8], [0, 85])} />
          <Fog f={f} y={1460} color="255,170,110" o={0.12} />
        </Layer>
        {/* el tercero, primer plano desenfocado que se acerca */}
        <Layer cam={cam} d={1.3} shake={shake}>
          <div style={{ filter: "blur(2px)" }}>
            <Figure f={f} x={ip(ft(15.48), [0, 24], [560, 720])} y={2080} h={800} rim="#FFB25A" rimSide={1} cloth="#3A2A2A" o={ip(ft(15.48), [0, 12], [0, 1])} arm={ip(ft(16.18), [0, 10], [0, 75])} />
          </div>
          <Olive x={-60} y={2300} s={2.6} c="#020306" />
          <Olive x={1980} y={2300} s={2.4} c="#020306" />
        </Layer>
      </Enter>
      <AbsoluteFill style={{ background: `rgba(200,20,20,${red})`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `rgba(255,40,40,${red * 0.4})`, mixBlendMode: "screen" }} />
      <Bubble x={540} y={1080} t={ft(8.22)} text="«Tú estabas con él»" out={S(1.7)} />
      <Bubble x={540} y={1080} t={ft(10.0)} text="«No lo conozco»" tail="right" out={S(1.8)} />
      <Bubble x={540} y={1080} t={ft(12.2)} text="«¡Es uno de ellos!»" tail="right" out={S(1.4)} />
      <Bubble x={540} y={1080} t={ft(13.7)} text="«No lo conozco»" tail="right" out={S(1.7)} />
      <Bubble x={540} y={1080} t={ft(18.5)} text="«¡No sé quién es!»" tail="right" bg="#FF3B3B" color="#fff" size={58} out={S(2.2)} />
      <Chip x={540} y={1640} t={ft(3.26)} text="esa misma noche" out={S(1.6)} />
      <Chip x={540} y={1640} t={ft(6.08)} text="una sirvienta" out={S(1.6)} />
      <Chip x={540} y={1640} t={ft(15.48)} text="el tercero" accent="#FF8A8A" out={S(1.6)} />
      <Big x={540} y={1560} t={ft(21.24)} text="¡quiquiriquí!" size={120} color="#FFE3B0" out={S(1.3)} />
      <Tally f={S(t)} show={S(9.9)} marks={[S(10.34), S(14.02), S(19.44)]} hide={S(21.0)} />
      <Dust f={f} n={30} color="255,190,140" />
      <Grain f={f} />
      <Vignette s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- 3 · 24,95–27,5 s: Pedro sale y llora bajo la lluvia ----------
const Llanto: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(ip(f, [S(0.6), S(1.4)], [0, 1]));
  const flash = ip(f, [S(0.15), S(0.2), S(0.45)], [0, 0.55, 0]);
  const cam = camAt([[0, 950, 1300, 1.0], [2.55, 950, 1360, 1.2]], f / FPS);
  return (
    <AbsoluteFill style={{ background: "#04060C" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.3}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#04060C, #0E1626 55%, #16202F)" }} />
          <Skyline f={f} y={1120} c="#0A0E18" />
        </Layer>
        <Layer cam={cam} d={0.8}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 1050 L760 1050 L760 1480 L0 1480 Z" fill="#0C1018" />
            <path d="M0 1480 L1900 1480 L1900 2400 L0 2400 Z" fill="#090B12" />
          </svg>
          <Torch f={f} x={640} y={1180} s={1} />
        </Layer>
        <Layer cam={cam} d={1}>
          {/* charcos con reflejo */}
          <div style={{ position: "absolute", left: 950, top: 1520, width: 700, height: 70, translate: "-50% 0", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(140,170,220,0.3), rgba(0,0,0,0) 70%)" }} />
          <div style={{ position: "absolute", inset: 0, transform: "scaleY(-0.35)", transformOrigin: "0 1500px", opacity: 0.25, filter: "blur(3px)" }}>
            <Figure f={f} x={ip(f, [0, S(0.8)], [700, 950])} y={1500} h={540} rim="#9EC2FF" rimSide={1} cloth="#4A1C22" kneel={k} lean={k * 10} shadow={false} />
          </div>
          <Figure f={f} x={ip(f, [0, S(0.8)], [700, 950])} y={1500} h={540} rim="#B7D0FF" rimSide={1} cloth="#4A1C22" kneel={k} lean={k * 10} head={k * 30} arm={k * 18} arm2={k * 18} />
        </Layer>
      </Enter>
      <Rain f={f} n={120} o={0.4} />
      <AbsoluteFill style={{ background: `rgba(190,210,255,${flash})`, mixBlendMode: "screen" }} />
      <Chip x={540} y={1640} t={f - S(1.1)} text="lloró amargamente" accent="#9EC2FF" />
      <Grain f={f} />
      <Vignette s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- 4 · 27,5–44 s: la orilla al amanecer ----------
const ORILLA_T0 = 27.5;
const Orilla: React.FC = () => {
  const f = useCurrentFrame();
  const t = ORILLA_T0 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const sunY = ip(ft(27.5), [0, S(14)], [1300, 1080]);
  const cam = camAt(
    [
      [27.5, 950, 1180, 0.9], [29.25, 950, 1280, 1.02],
      [29.26, 900, 1360, 1.3], [30.41, 900, 1360, 1.36], // "tres veces"
      [30.42, 1100, 1350, 1.65], [32.11, 1100, 1340, 1.7], // "«¿Me amas?»": Jesús de cerca
      [32.12, 760, 1380, 1.6], [34.53, 760, 1370, 1.68], // Pedro: cada negación
      [34.54, 1100, 1350, 1.5], [35.33, 1100, 1340, 1.55], // "Apacienta…"
      [35.34, 700, 1300, 0.98], [37.47, 720, 1300, 1.04], // la colina con ovejas
      [37.48, 1180, 1360, 1.55], [39.69, 1180, 1350, 1.62], // "el que nunca cayó"
      [39.7, 760, 1360, 1.6], [40.99, 760, 1350, 1.7], // "el que volvió"
      [41.0, 950, 1280, 1.0], [44, 950, 1260, 1.08],
    ],
    t,
  );
  const chosen = ease(ip(ft(39.7), [0, 18], [0, 1]));
  const statue = ip(ft(37.48), [0, 10], [0, 1]) * ip(ft(39.7), [0, 12], [1, 0]);
  const hill = ease(ip(ft(35.34), [0, 14], [0, 1]));
  const walk = ip(ft(27.5), [0, S(2)], [1500, 1180]);
  const end = ft(40.9) >= 0;
  return (
    <AbsoluteFill style={{ background: "#2B1E44" }}>
      <Enter f={f}>
        <Layer cam={cam} d={0.15}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#24193C, #7E3C55 38%, #E58A55 62%, #FFC37A 72%)" }} />
          <div style={{ position: "absolute", left: 950 - 260, top: sunY - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, #FFF3CF, #FFC46B 55%, rgba(255,196,107,0) 72%)" }} />
        </Layer>
        <Layer cam={cam} d={0.3}>
          <GodRays f={f} x={950} y={sunY} color="#FFD08A" o={0.2} n={11} spread={140} />
          {/* nubes lejanas */}
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 700 + f * (0.6 + i * 0.2)) % 2300) - 400, top: 780 + i * 90, width: 600, height: 70, borderRadius: 40, background: "rgba(255,190,150,0.25)", filter: "blur(10px)" }} />)}
        </Layer>
        <Layer cam={cam} d={0.55}>
          <div style={{ position: "absolute", left: 0, width: 1900, top: 1320, height: 300, background: "linear-gradient(#C46A5A, #5A3448)" }} />
          {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 950 - (70 + i * 16) / 2 + Math.sin(f / 9 + i) * 12, top: 1330 + i * 17, width: 70 + i * 16, height: 5, borderRadius: 3, background: "#FFD58A", opacity: 0.55 - i * 0.03 }} />)}
          {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 210 + f * 2) % 1900), top: 1360 + (i % 4) * 50, width: 90, height: 3, borderRadius: 2, background: "rgba(255,220,180,0.35)" }} />)}
          <svg width={260} height={120} viewBox="0 0 260 120" style={{ position: "absolute", left: 1230, top: 1270 + Math.sin(f / 15) * 5, rotate: `${Math.sin(f / 20) * 2}deg` }}>
            <path d="M10 70 L250 70 L210 110 L40 110 Z" fill="#160E16" />
            <path d="M120 10 L124 70 L118 70 Z" fill="#160E16" />
            <path d="M124 14 L180 60 L124 60 Z" fill="#2A1A24" />
          </svg>
        </Layer>
        <Layer cam={cam} d={0.8}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d={`M0 ${1560 - 160 * hill} Q520 ${1380 - 180 * hill} 1020 1580 L0 1580 Z`} fill="#24141E" />
          </svg>
          {[[260, 1500], [400, 1470], [540, 1505], [680, 1540], [330, 1560], [470, 1580]].map(([x, y], i) => <Sheep key={i} x={x + Math.sin(f / 20 + i) * 6} y={y} s={1} t={ft(35.6) - i * 4} />)}
        </Layer>
        <Layer cam={cam} d={1}>
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
            <path d="M0 1580 Q950 1530 1900 1580 L1900 2400 L0 2400 Z" fill="#1B1018" />
            <path d="M0 1560 Q950 1510 1900 1560 L1900 1600 Q950 1550 0 1600 Z" fill="#3A1F28" />
          </svg>
          <Smoke f={f} x={950} y={1520} n={8} color="200,150,140" />
          <Fire f={f} x={950} y={1640} scale={0.65} grow={1} />
          <Embers f={f} x={950} y={1560} w={120} n={20} seed="b" />
          {statue > 0 ? <Figure f={f} x={1180} y={1680} h={500} rim="#9AA0AA" rimSide={-1} hood={false} o={statue * 0.85} /> : null}
          <Figure f={f} x={760} y={1680} h={510} rim="#FFD08A" rimSide={1} cloth="#6B1F1F" kneel={0.25 * ip(ft(30.42), [0, 12], [0, 1]) * ip(ft(34.18), [0, 12], [1, 0])} head={ft(30.42) >= 0 && ft(34.18) < 0 ? 14 : 0} glow={chosen} arm={chosen * 30} />
          <Figure f={f} x={walk} y={1680} h={540} rim="#FFE3B0" rimSide={-1} cloth="#D8D2C4" flip glow={0.7} o={1 - statue} arm={ft(34.54) >= 0 ? ip(ft(34.54), [0, 10], [0, 70]) : 0} lean={walk > 1185 ? Math.sin(f / 4) * 2 : 0} />
          {chosen > 0 ? <GodRays f={f} x={760} y={1080} color="#FFE9B8" o={0.32 * chosen} n={5} spread={40} /> : null}
        </Layer>
        <Layer cam={cam} d={1.35}>
          <div style={{ filter: "blur(3px)" }}>
            <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
              {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${i * 110} 2400 Q${i * 110 + 20 + Math.sin(f / 12 + i) * 14} 2150 ${i * 110 + 40 + Math.sin(f / 10 + i) * 24} 2000`} stroke="#0C060A" strokeWidth={10} fill="none" />)}
            </svg>
          </div>
        </Layer>
      </Enter>
      <Birds f={f} x0={-100} y0={760} />
      <Chip x={540} y={700} t={ft(27.62)} text="semanas después" out={S(1.9)} />
      <Tally f={S(t)} show={S(29.26)} marks={[S(29.4), S(29.55), S(29.7)]} hearts={[S(32.32), S(32.52), S(32.96)]} hide={S(34.2)} />
      <Bubble x={600} y={1080} t={ft(30.42)} text="«¿Me amas?»" tail="right" out={S(1.6)} />
      <Bubble x={560} y={1080} t={ft(34.54)} text="«Apacienta mis ovejas»" tail="right" size={46} out={S(2.6)} />
      <Chip x={700} y={1700} t={ft(37.64)} text="el que nunca cayó" accent="#B9BFC9" out={S(2.0)} />
      <Chip x={380} y={1700} t={ft(39.7)} text="el que volvió" accent="#FFD08A" />
      {end ? (
        <>
          <AbsoluteFill style={{ background: `rgba(0,0,0,${ip(ft(40.9), [0, 20], [0, 0.55])})` }} />
          <Big x={540} y={720} t={ft(41.0)} text="¿Y tú?" size={190} />
          <Big x={540} y={930} t={ft(41.8)} text="¿vas a volver?" size={96} color="#FFD08A" />
        </>
      ) : null}
      <Dust f={f} color="255,220,170" />
      <Grain f={f} />
      <Vignette s={0.7} />
    </AbsoluteFill>
  );
};

// efectos medidos: solo al abrir un bloque o antes de un giro, nunca encima de una palabra
const SFX: [number, string, number][] = [
  [0.0, "whoosh", 0.16], // gancho
  [3.1, "whoosh", 0.18], // "Esa misma noche…"
  [11.85, "whoosh", 0.14], // "Otro lo señaló"
  [20.75, "impact", 0.28], // antes de "Entonces cantó el gallo"
  [24.95, "drop", 0.2], // sale a la lluvia
  [27.4, "shimmer", 0.22], // "Semanas después…"
  [37.3, "whoosh", 0.16], // antes del giro final
];
const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t))} durationInFrames={45}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

export const Pedro: React.FC<{ cap?: "actual" | "impacto" | "cine" | "resaltador" }> = ({ cap = "actual" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "brightness(1.18) contrast(1.12) saturate(1.12)" }}>
      <Sequence from={0} durationInFrames={S(3.15)}><Promesa /></Sequence>
      <Sequence from={S(3.15)} durationInFrames={S(24.95) - S(3.15)}><Patio /></Sequence>
      <Sequence from={S(24.95)} durationInFrames={S(27.5) - S(24.95)}><Llanto /></Sequence>
      <Sequence from={S(27.5)} durationInFrames={PEDRO_TOTAL - S(27.5)}><Orilla /></Sequence>
      </AbsoluteFill>
      {cap === "actual" ? <Captions f={f} groups={GROUPS} keys={KEYS} /> : null}
      {cap === "impacto" ? <CaptionsImpacto f={f} words={WORDS} keys={KEYS} /> : null}
      {cap === "cine" ? <CaptionsCine f={f} groups={GROUPS} keys={KEYS} /> : null}
      {cap === "resaltador" ? <CaptionsResaltador f={f} groups={GROUPS} keys={KEYS} /> : null}
      <Audio src={staticFile("pedro/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
