import React from "react";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

// SL · prueba de subtítulos (5 s, sin audio). A = "Editorial" (escalera, fuente según emoción). B = "Cine" (una sola familia serif, centrado, acento rojo).
const F = (family: string, file: string, weight = "400", style = "normal") => loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });
F("SL Sans", "instrument-sans-latin-600-normal.woff2", "600");
F("SL Serif", "dm-serif-display-latin-400-normal.woff2");
F("SL Ital", "playfair-display-latin-400-italic.woff2", "400", "italic");
F("SL Script", "great-vibes-latin-400-normal.woff2");
F("SL Brush", "kaushan-script-latin-400-normal.woff2");
F("SL Gloock", "gloock-latin-400-normal.woff2");
F("SL Corm", "cormorant-garamond-latin-500-italic.woff2", "500", "italic");

export const SUBS_TOTAL = 150;
const RED = "#E0332B";
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fade = (f: number, f0: number, n = 4) => cl((f - f0) / n);

// fondo neutro: cuarto cálido desenfocado con una silueta (para ver dónde cae el texto respecto a la cara)
const Room: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#0A0807" }}>
    <Img src={staticFile("sltest/bg.jpg")} style={{ position: "absolute", width: 1180, left: -50, top: 260, transform: `scale(${1 + f * 0.0004})`, filter: "brightness(0.78) contrast(1.05)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A0807 0%, rgba(10,8,7,0) 16%, rgba(10,8,7,0) 80%, #0A0807 100%)" }} />
  </AbsoluteFill>
);
const RoomOld: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 30%, #4A3424 0%, #1E1510 45%, #0A0807 100%)" }}>
    {[[160, 520, 120, "#FFB46A"], [880, 430, 90, "#FFC88A"], [760, 760, 60, "#FF9A5A"], [250, 900, 70, "#FFD9A0"]].map(([x, y, r, c], i) => (
      <div key={i} style={{ position: "absolute", left: (x as number) - (r as number), top: (y as number) - (r as number), width: (r as number) * 2, height: (r as number) * 2, borderRadius: "50%", background: c as string, opacity: 0.22 + 0.04 * Math.sin(f / 20 + i), filter: "blur(30px)" }} />
    ))}
    <svg width={1080} height={1920} style={{ position: "absolute", filter: "blur(6px)" }}>
      <ellipse cx={540} cy={760} rx={170} ry={210} fill="#5A3E30" />
      <path d="M180 1920 Q 200 1180 540 1120 Q 880 1180 900 1920 Z" fill="#14100E" />
      <rect x={505} y={1060} width={70} height={420} rx={30} fill="#0A0808" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
);

type Phrase = { lead: string; key: string; tail: string; font: string; color: string; size: number; at: number };
const PH: Phrase[] = [
  { lead: "Dejar de", key: "sobrepensar", tail: "es más fácil de lo que crees.", font: "SL Serif", color: RED, size: 160, at: 0 },
  { lead: "Vuélvete tan", key: "exitoso", tail: "que no tengas que explicarlo.", font: "SL Script", color: "#FFFFFF", size: 190, at: 52 },
  { lead: "¿Sabes cuál es el", key: "error", tail: "que te está frenando?", font: "SL Brush", color: RED, size: 210, at: 104 },
];
const shadow = "0 6px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)";

// A · Editorial: escalera (entrada arriba-izq, clave enorme al centro, cierre abajo-der), se arma en 3 tiempos
export const SubsA: React.FC = () => {
  const f = useCurrentFrame();
  const i = PH.findIndex((p, k) => f >= p.at && f < (PH[k + 1]?.at ?? 999));
  const p = PH[i], lf = f - p.at;
  const a1 = fade(lf, 0), a2 = fade(lf, 6), a3 = fade(lf, 14);
  return (
    <AbsoluteFill>
      <Room f={f} />
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", textShadow: shadow }}>
          <div style={{ alignSelf: "flex-start", fontFamily: "SL Sans", fontWeight: 600, fontSize: 54, color: "#fff", opacity: a1, transform: `translateY(${(1 - a1) * 8}px)`, marginLeft: 10, marginBottom: -p.size * 0.18 }}>{p.lead}</div>
          <div style={{ fontFamily: p.font, fontSize: p.size, lineHeight: 1, color: p.color, opacity: a2, transform: `translateY(${(1 - a2) * 10}px)`, letterSpacing: p.font === "SL Serif" ? -2 : 0, padding: "0 10px" }}>{p.key}</div>
          <div style={{ alignSelf: "flex-end", fontFamily: i === 1 ? "SL Ital" : "SL Sans", fontStyle: i === 1 ? "italic" : "normal", fontWeight: i === 1 ? 400 : 600, fontSize: i === 1 ? 56 : 50, color: "#fff", opacity: a3, transform: `translateY(${(1 - a3) * 8}px)`, marginTop: -p.size * 0.12, marginRight: 10 }}>{p.tail}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// B · Cine: una sola familia serif, centrado y simétrico; clave en serif grande blanca con trazo rojo que se dibuja debajo
export const SubsB: React.FC = () => {
  const f = useCurrentFrame();
  const i = PH.findIndex((p, k) => f >= p.at && f < (PH[k + 1]?.at ?? 999));
  const p = PH[i], lf = f - p.at;
  const a1 = fade(lf, 0, 5), a2 = fade(lf, 5, 6), a3 = fade(lf, 13, 5), line = cl((lf - 9) / 12);
  const keyColor = i === 1 ? "#F3E6D0" : "#FFFFFF";
  return (
    <AbsoluteFill>
      <Room f={f} />
      <div style={{ position: "absolute", top: 770, left: 60, right: 60, textAlign: "center", textShadow: shadow }}>
        <div style={{ fontFamily: "SL Sans", fontWeight: 600, fontSize: 34, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.85)", opacity: a1 }}>{p.lead}</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: "SL Gloock", fontSize: 150, lineHeight: 1.05, color: keyColor, opacity: a2, transform: `scale(${0.97 + 0.03 * a2})` }}>
          {p.key}
          <div style={{ position: "absolute", left: "8%", bottom: -4, height: 7, borderRadius: 4, width: `${84 * line}%`, background: RED, boxShadow: "0 0 18px rgba(224,51,43,0.6)" }} />
        </div>
        <div style={{ fontFamily: "SL Corm", fontStyle: "italic", fontWeight: 500, fontSize: 62, color: "#fff", opacity: a3, marginTop: 14 }}>{p.tail}</div>
      </div>
    </AbsoluteFill>
  );
};
