import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/pedro/words.json";
import {
  Big, Bubble, Captions, Chip, Dust, Embers, Figure, Fire, Fog, FPS, GodRays, Grain, Moon, Olive, Rain, Rooster, S, Sheep, Sky, Stars, Vignette, Word, ease, groupWords, ip, pop,
} from "../kit/Kit";

// "Pedro negó a Jesús tres veces… y aun así lo eligió". Todo dibujado con código, cada palabra clave dispara un evento
export const PEDRO_TOTAL = S(44);

// ---------- voz → palabras (limpieza de signos del reconocimiento) ----------
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const FIX: Record<string, string> = { "¿No": "«No", "conozco?": "conozco»", "dijo,": "dijo:", "Tú": "«Tú", "él.": "él»", "gritó.": "gritó:", "No": "«No", "hombre.": "hombre»", "veces,": "veces:", "¿me": "«¿Me", "amas?": "amas?»", "apacienta": "«Apacienta", "ovejas.": "ovejas»" };
const WORDS: Word[] = RAW.map((c, i) => {
  let w = c.text.trim();
  // "No" solo se cambia en las citas, no en "No eligió"
  if (FIX[w] && !(w === "No" && RAW[i + 1]?.text.trim() === "eligió")) w = FIX[w];
  return { w, s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 };
});
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["pedro", "jesús", "nunca", "fogata", "sirvienta", "conozco", "señaló", "tercero", "hombre", "gallo", "miró", "lloró", "amargamente", "tres", "amas", "negación", "ovejas", "volvió"]);
const at = (t: number) => S(t);

// ---------- cámara con fotogramas clave (centro x, centro y, zoom) en un mundo de 1900 × 2400 ----------
type K = [number, number, number, number]; // segundo, x, y, zoom
const camAt = (keys: K[], t: number) => {
  if (t <= keys[0][0]) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0, z0] = keys[i];
    const [t1, x1, y1, z1] = keys[i + 1];
    if (t <= t1) {
      const u = ease((t - t0) / (t1 - t0));
      return [t, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u] as K;
    }
  }
  return keys[keys.length - 1];
};
const World: React.FC<{ cam: K; shake?: number; children: React.ReactNode }> = ({ cam, shake = 0, children }) => {
  const [, x, y, z] = cam;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1900, height: 2400, transformOrigin: "0 0", transform: `translate(${540 - x * z + shake}px, ${960 - y * z + shake * 0.6}px) scale(${z})` }}>{children}</div>
    </AbsoluteFill>
  );
};

// ---------- marcador de negaciones: 3 casillas, ✗ que luego se vuelven ❤ ----------
const Heart: React.FC<{ s: number }> = ({ s }) => (
  <svg width={70 * s} height={64 * s} viewBox="0 0 70 64">
    <path d="M35 60 C10 42 2 30 2 18 C2 8 10 2 19 2 C26 2 31 6 35 12 C39 6 44 2 51 2 C60 2 68 8 68 18 C68 30 60 42 35 60 Z" fill="#FF4F5E" style={{ filter: "drop-shadow(0 0 14px #FF4F5E)" }} />
  </svg>
);
const Tally: React.FC<{ f: number; show: number; marks: number[]; hearts?: number[]; hide?: number }> = ({ f, show, marks, hearts = [], hide = 99999 }) => {
  if (f < show || f > hide) return null;
  const o = ip(f - show, [0, 8], [0, 1]) * ip(f, [hide - 8, hide], [1, 0]);
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28, opacity: o }}>
      {[0, 1, 2].map((i) => {
        const xm = f - marks[i];
        const hm = hearts[i] !== undefined ? f - hearts[i] : -1;
        return (
          <div key={i} style={{ width: 120, height: 120, borderRadius: 26, background: "rgba(8,10,16,0.8)", border: `3px solid ${hm >= 0 ? "#FF4F5E" : xm >= 0 ? "#FF3B3B" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hm >= 0 ? "0 0 40px rgba(255,79,94,0.6)" : "0 10px 30px rgba(0,0,0,0.5)" }}>
            {hm >= 0 ? (
              <div style={{ transform: `scale(${pop(hm)})` }}><Heart s={1.15} /></div>
            ) : xm >= 0 ? (
              <div style={{ transform: `scale(${pop(xm) * 1.0})`, fontFamily: "sans-serif", fontWeight: 900, fontSize: 92, color: "#FF3B3B", lineHeight: 1, textShadow: "0 0 24px #FF3B3B" }}>✕</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// ---------- escena 1 · 0–3,15 s: la promesa ----------
const Promesa: React.FC = () => {
  const f = useCurrentFrame();
  const z = ip(f, [0, S(3.15)], [1.0, 1.12]);
  return (
    <AbsoluteFill>
      <Sky top="#050816" mid="#0E1A36" bottom="#1A2236" />
      <Stars f={f} />
      <Moon x={760} y={620} r={70} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 60%" }}>
        <Olive x={130} y={1500} s={1.5} />
        <Olive x={980} y={1480} s={1.3} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, height: 600, background: "linear-gradient(#141019, #07060A)" }} />
        <Fog f={f} y={1300} />
        <Figure x={410} y={1500} h={560} rim="#9EC2FF" rimSide={1} cloth="#6B1F1F" arm={ip(f, [at(1.5), at(1.9)], [0, 62])} armSide={1} />
        <Figure x={690} y={1500} h={590} rim="#FFE3B0" rimSide={-1} cloth="#D8D2C4" flip glow={0.6} />
      </AbsoluteFill>
      <Chip x={410} y={1540} t={f - at(0.32)} text="Pedro" />
      <Chip x={690} y={1540} t={f - at(1.04)} text="Jesús" accent="#FFE3B0" />
      <Big x={540} y={760} t={f - at(1.52)} text="«nunca»" size={150} />
      <Dust f={f} color="200,215,255" />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- escenas 2 a 4 · 3,15–24,95 s: el patio (un solo mundo, la cámara viaja) ----------
const PATIO_T0 = 3.15;
const Patio: React.FC = () => {
  const f = useCurrentFrame();
  const t = PATIO_T0 + f / FPS; // segundo del video
  const ft = (s: number) => S(t) - S(s); // fotogramas desde el segundo s del video
  const cam = camAt(
    [
      [3.15, 950, 1250, 0.92],
      [4.3, 950, 1330, 1.05],
      [6.0, 760, 1280, 1.12],
      [9.9, 1060, 1260, 1.25],
      [11.8, 1250, 1270, 1.1],
      [13.6, 1060, 1260, 1.28],
      [15.4, 950, 1230, 0.98],
      [17.2, 1060, 1240, 1.34],
      [20.8, 1350, 1010, 1.15],
      [22.4, 620, 1020, 1.18],
      [23.9, 860, 1120, 1.0],
      [24.95, 860, 1120, 1.06],
    ],
    t,
  );
  const red = ip(ft(17.24), [0, 6, 70, 80], [0, 0.42, 0.35, 0]);
  const dawn = ip(ft(20.9), [0, 40], [0, 1]);
  const shake = ft(17.24) >= 0 && ft(17.24) < 20 ? Math.sin(f * 2.3) * 10 * (1 - ft(17.24) / 20) : 0;
  const fireGrow = ease(ip(ft(4.28), [0, 20], [0, 1]));
  const beam = ip(ft(23.92), [0, 12], [0, 1]);
  const jesusTurn = ft(22.96) >= 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${dawn ? "#141a3e" : "#050813"}, #10162E 60%, #1B1622)` }} />
      <World cam={cam} shake={shake}>
        {/* cielo del mundo */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgb(${5 + 20 * dawn},${8 + 14 * dawn},${19 + 40 * dawn}), #121a35 45%, #1d1626 70%)` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1900, height: 1100 }}><Stars f={f} n={120} seed="p" h={900} /></div>
        <Moon x={1500} y={420} r={70} o={1 - dawn * 0.5} />
        {/* muro del patio con arcos y antorchas */}
        <svg width={1900} height={2400} style={{ position: "absolute", inset: 0 }}>
          <path d="M0 880 L1900 880 L1900 1500 L0 1500 Z" fill="#17121C" />
          <path d="M0 860 L1900 860 L1900 900 L0 900 Z" fill="#221A26" />
          {[200, 520, 1180, 1500].map((x, i) => <path key={i} d={`M${x - 90} 1500 L${x - 90} 1160 Q${x} 1060 ${x + 90} 1160 L${x + 90} 1500 Z`} fill="#0A080E" />)}
          {/* terraza alta donde está Jesús */}
          <path d="M380 1020 L860 1020 L860 1060 L380 1060 Z" fill="#2A2030" />
          <path d="M0 1500 L1900 1500 L1900 2400 L0 2400 Z" fill="#100C10" />
          <ellipse cx={950} cy={1520} rx={520} ry={70} fill="rgba(255,140,60,0.18)" />
        </svg>
        {[200, 520, 1180, 1500].map((x, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 140, top: 1040, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,70,0.35), rgba(255,160,70,0) 65%)", opacity: 0.8 + 0.2 * Math.sin(f / 4 + i) }} />
            <div style={{ position: "absolute", left: x - 7, top: 1150, width: 14, height: 40, borderRadius: 7, background: "#FFC160", boxShadow: "0 0 24px #FF9A3A" }} />
          </React.Fragment>
        ))}
        {/* gallo sobre el muro */}
        <Rooster x={1360} y={862} s={0.9} crow={ft(21.24) >= 0 ? Math.abs(Math.sin(ft(21.24) / 4)) * ip(ft(21.24), [0, 40], [1, 0]) : 0} />
        {ft(21.24) >= 0 ? [0, 1, 2].map((i) => {
          const k = ft(21.24) - i * 7;
          return k > 0 ? <div key={i} style={{ position: "absolute", left: 1400, top: 760, width: 40, height: 40, transform: `translate(-50%,-50%) scale(${1 + k * 0.25})`, borderRadius: "50%", border: "3px solid rgba(255,230,180,0.8)", opacity: ip(k, [0, 30], [0.9, 0]) }} /> : null;
        }) : null}
        {/* Jesús en la terraza: se gira al cantar el gallo */}
        <Figure x={620} y={1022} h={240} rim="#FFE3B0" rimSide={1} cloth="#D8D2C4" flip={!jesusTurn} glow={0.5 + 0.5 * beam} />
        {/* mirada: haz de luz de Jesús a Pedro */}
        {beam > 0 ? (
          <svg width={1900} height={2400} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
            <defs>
              <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFE9C0" stopOpacity={0.7 * beam} />
                <stop offset="1" stopColor="#FFE9C0" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <path d="M630 830 L660 830 L1150 1300 L1010 1330 Z" fill="url(#beam)" />
          </svg>
        ) : null}
        {/* fuego y brasas */}
        <Fire f={f} x={950} y={1540} scale={1.1} grow={fireGrow} />
        {fireGrow > 0.1 ? <Embers f={f} x={950} y={1400} w={240} n={46} /> : null}
        {/* personajes alrededor del fuego */}
        <Figure x={1080} y={1560} h={420} rim="#FFB25A" rimSide={-1} cloth="#6B1F1F" lean={ft(17.24) >= 0 && ft(17.24) < 80 ? -6 : ft(10.0) >= 0 && ft(10.0) < 30 ? 4 : 0} arm={ft(17.24) >= 0 && ft(17.24) < 80 ? 70 : 0} armSide={1} />
        <Figure x={ip(ft(6.08), [0, 24], [480, 700])} y={1560} h={400} rim="#FFB25A" rimSide={1} cloth="#4A3A5E" o={ip(ft(6.08), [0, 10], [0, 1])} arm={ip(ft(8.2), [0, 8], [0, 85])} armSide={1} />
        <Figure x={ip(ft(11.9), [0, 20], [1500, 1300])} y={1570} h={430} rim="#FFB25A" rimSide={-1} cloth="#2E4A3A" flip o={ip(ft(11.9), [0, 10], [0, 1])} arm={ip(ft(12.3), [0, 8], [0, 85])} armSide={1} />
        {/* el tercero, en primer plano */}
        <Figure x={720} y={2050} h={780} rim="#FFB25A" rimSide={1} cloth="#3A2A2A" o={ip(ft(15.48), [0, 12], [0, 1])} arm={ip(ft(16.18), [0, 10], [0, 75])} armSide={1} />
        <Fog f={f} y={1450} color="255,170,110" o={0.12} />
      </World>
      {/* diálogos en pantalla */}
      {/* diálogos */}
      <Bubble x={540} y={1080} t={ft(8.22)} text="«Tú estabas con él»" out={S(1.7)} />
      <Bubble x={540} y={1080} t={ft(10.0)} text="«No lo conozco»" tail="right" out={S(1.8)} />
      <Bubble x={540} y={1080} t={ft(12.2)} text="«¡Es uno de ellos!»" tail="right" out={S(1.4)} />
      <Bubble x={540} y={1080} t={ft(13.7)} text="«No lo conozco»" tail="right" out={S(1.7)} />
      <Bubble x={540} y={1080} t={ft(18.5)} text="«¡No sé quién es!»" tail="right" bg="#FF3B3B" color="#fff" size={56} out={S(2.2)} />
      <AbsoluteFill style={{ background: `rgba(200,20,20,${red})`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `rgba(255,40,40,${red * 0.4})`, mixBlendMode: "screen" }} />
      <Chip x={540} y={1610} t={ft(3.26)} text="esa misma noche" out={S(1.6)} />
      <Chip x={540} y={1610} t={ft(6.08)} text="una sirvienta" out={S(1.6)} />
      <Chip x={540} y={1610} t={ft(15.48)} text="el tercero" accent="#FF8A8A" out={S(1.6)} />
      <Big x={540} y={1560} t={ft(21.24)} text="¡quiquiriquí!" size={120} color="#FFE3B0" out={S(1.3)} />
      <Tally f={S(t)} show={S(9.9)} marks={[S(10.34), S(14.02), S(19.44)]} hide={S(21.0)} />
      <Grain f={f} />
      <Vignette s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- escena 5 · 24,95–27,5 s: Pedro llora fuera, bajo la lluvia ----------
const Llanto: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(ip(f, [S(0.6), S(1.4)], [0, 1]));
  return (
    <AbsoluteFill>
      <Sky top="#04060C" mid="#0B1220" bottom="#121826" />
      <AbsoluteFill style={{ transform: `scale(${ip(f, [0, S(2.55)], [1.0, 1.15])})`, transformOrigin: "50% 65%" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M0 1050 L380 1050 L380 1450 L0 1450 Z" fill="#0C0F18" />
          <path d="M0 1450 L1080 1450 L1080 1920 L0 1920 Z" fill="#080A10" />
        </svg>
        <Figure x={ip(f, [0, S(0.8)], [300, 560])} y={1460} h={520} rim="#7FA2D8" rimSide={1} cloth="#4A1C22" kneel={k} lean={k * 10} />
        <div style={{ position: "absolute", left: 560, top: 1460, width: 500, height: 60, translate: "-50% -50%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(140,170,220,0.25), rgba(0,0,0,0) 70%)" }} />
      </AbsoluteFill>
      <Rain f={f} />
      <Chip x={540} y={1600} t={f - S(1.1)} text="lloró amargamente" accent="#9EC2FF" />
      <Grain f={f} />
      <Vignette s={0.9} />
    </AbsoluteFill>
  );
};

// ---------- escenas 6 y 7 · 27,5–44 s: la orilla al amanecer ----------
const ORILLA_T0 = 27.5;
const Orilla: React.FC = () => {
  const f = useCurrentFrame();
  const t = ORILLA_T0 + f / FPS;
  const ft = (s: number) => S(t) - S(s);
  const sunY = ip(ft(27.5), [0, S(14)], [1280, 1050]);
  const cam = ip(ft(27.5), [0, S(16.5)], [1.0, 1.14]);
  const chosen = ease(ip(ft(39.7), [0, 18], [0, 1]));
  const statue = ip(ft(37.48), [0, 10], [0, 1]) * ip(ft(39.7), [0, 12], [1, 0]);
  const end = ft(40.9) >= 0;
  return (
    <AbsoluteFill>
      <Sky top="#2B1E44" mid="#9A4757" bottom="#F2A15C" />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "50% 60%" }}>
        <div style={{ position: "absolute", left: 540 - 220, top: sunY - 220, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #FFF3CF, #FFC46B 55%, rgba(255,196,107,0) 72%)" }} />
        <GodRays f={f} x={540} y={sunY} color="#FFD08A" o={0.22} n={9} spread={120} />
        {/* mar con reflejos */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 260, background: "linear-gradient(#C46A5A, #5A3448)" }} />
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 540 - (60 + i * 14) / 2 + Math.sin(f / 9 + i) * 10, top: 1310 + i * 17, width: 60 + i * 14, height: 5, borderRadius: 3, background: "#FFD58A", opacity: 0.55 - i * 0.03 }} />)}
        {/* barca */}
        <svg width={260} height={120} viewBox="0 0 260 120" style={{ position: "absolute", left: 790, top: 1250 + Math.sin(f / 15) * 4 }}>
          <path d="M10 70 L250 70 L210 110 L40 110 Z" fill="#160E16" />
          <path d="M120 10 L124 70 L118 70 Z" fill="#160E16" />
        </svg>
        {/* playa */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M0 1540 Q540 1500 1080 1540 L1080 1920 L0 1920 Z" fill="#1B1018" />
          <path d="M0 1520 Q540 1480 1080 1520 L1080 1560 Q540 1520 0 1560 Z" fill="#3A1F28" />
        </svg>
        {/* colina con ovejas */}
        {ft(35.34) >= 0 ? (
          <>
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              <path d={`M0 ${1540 - 120 * ease(ip(ft(35.34), [0, 14], [0, 1]))} Q300 ${1380 - 140 * ease(ip(ft(35.34), [0, 14], [0, 1]))} 640 1540 Z`} fill="#24141E" />
            </svg>
            {[[120, 1460], [230, 1430], [330, 1470], [440, 1500], [180, 1520]].map(([x, y], i) => <Sheep key={i} x={x} y={y} s={0.9} t={ft(35.6) - i * 4} />)}
          </>
        ) : null}
        <Fire f={f} x={560} y={1600} scale={0.6} grow={1} />
        <Embers f={f} x={560} y={1530} w={110} n={18} seed="b" />
        {/* el que "nunca cayó": estatua gris que se desvanece */}
        {statue > 0 ? <Figure x={760} y={1640} h={470} rim="#9AA0AA" rimSide={-1} hood={false} o={statue * 0.8} /> : null}
        <Figure x={370} y={1640} h={480} rim="#FFD08A" rimSide={1} cloth="#6B1F1F" arm={ip(ft(28.44), [0, 10], [0, 0])} kneel={ft(35.34) < 0 ? 0.25 * ip(ft(30.42), [0, 12], [0, 1]) * ip(ft(34.18), [0, 12], [1, 0]) : 0} glow={chosen} />
        <Figure x={760} y={1640} h={510} rim="#FFE3B0" rimSide={-1} cloth="#D8D2C4" flip glow={0.7} o={1 - statue} />
        {chosen > 0 ? <GodRays f={f} x={370} y={1100} color="#FFE9B8" o={0.3 * chosen} n={5} spread={40} /> : null}
      </AbsoluteFill>
      <Chip x={540} y={700} t={ft(27.62)} text="semanas después" out={S(1.9)} />
      <Tally f={S(t)} show={S(29.26)} marks={[S(29.4), S(29.55), S(29.7)]} hearts={[S(32.32), S(32.52), S(32.96)]} hide={S(34.2)} />
      <Bubble x={600} y={1080} t={ft(30.42)} text="«¿Me amas?»" tail="right" out={S(1.6)} />
      <Bubble x={560} y={1080} t={ft(34.54)} text="«Apacienta mis ovejas»" tail="right" size={46} out={S(2.6)} />
      <Chip x={760} y={1680} t={ft(37.64)} text="el que nunca cayó" accent="#B9BFC9" out={S(2.0)} />
      <Chip x={370} y={1680} t={ft(39.7)} text="el que volvió" accent="#FFD08A" />
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

const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t))} durationInFrames={45}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);
const SFX: [number, string, number][] = [
  [0.3, "pop", 0.15], [1.0, "pop", 0.15], [1.5, "impact", 0.2],
  [3.05, "whoosh", 0.2], [4.28, "crack", 0.25], [6.08, "whoosh", 0.12], [8.22, "pop", 0.18],
  [10.0, "pop", 0.18], [10.34, "impact", 0.28], [11.9, "whoosh", 0.12], [12.2, "pop", 0.18], [13.7, "pop", 0.18], [14.02, "impact", 0.3],
  [15.48, "whoosh", 0.15], [17.24, "impact", 0.35], [18.5, "pop", 0.2], [19.44, "impact", 0.4],
  [20.8, "whoosh", 0.18], [21.24, "shimmer", 0.25], [22.96, "whoosh", 0.15], [23.92, "shimmer", 0.3],
  [24.9, "drop", 0.25], [27.45, "whoosh", 0.2], [29.4, "tick", 0.2], [29.55, "tick", 0.2], [29.7, "tick", 0.2],
  [30.42, "pop", 0.18], [32.32, "pop", 0.22], [32.52, "pop", 0.22], [32.96, "pop", 0.22], [35.34, "pop", 0.18],
  [37.48, "whoosh", 0.15], [39.7, "shimmer", 0.35], [41.0, "impact", 0.3],
];

export const Pedro: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [3.15, 24.95, 27.5];
  const flash = cuts.reduce((o, c) => (f >= S(c) ? Math.max(o, ip(f - S(c), [0, 7], [0.3, 0])) : o), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={S(3.15)}><Promesa /></Sequence>
      <Sequence from={S(3.15)} durationInFrames={S(24.95) - S(3.15)}><Patio /></Sequence>
      <Sequence from={S(24.95)} durationInFrames={S(27.5) - S(24.95)}><Llanto /></Sequence>
      <Sequence from={S(27.5)} durationInFrames={PEDRO_TOTAL - S(27.5)}><Orilla /></Sequence>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})`, pointerEvents: "none" }} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("pedro/voz.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
