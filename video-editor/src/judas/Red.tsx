import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/judas/words.json";
import { Captions, FPS, S, Word, groupWords } from "../kit/Kit";
import { Coin3D } from "./Fx";

// ZK Red — estilo "agencia premium": rojo monocromo, humo, héroe 3D, tipografía de pesos mezclados, guías finas.
export const RED_TOTAL = 5 * FPS;
const ip = (v: number, i: number[], o: number[]) => interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const eo = Easing.out(Easing.cubic);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.filter((c) => c.timestamp[0] < 5).map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const KEYS = new Set(["judas", "30", "plata"]);

// texto que sube desde una máscara
const Rise: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = eo(ip(t, [at, at + 0.35], [0, 1]));
  return <div style={{ overflow: "hidden", ...style }}><div style={{ transform: `translateY(${(1 - k) * 110}%)`, opacity: k }}>{children}</div></div>;
};

export const ZkRed: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const coinIn = eo(ip(t, [0, 0.6], [0, 1]));
  const box = eo(ip(t, [2.45, 2.8], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#5A0307" }}>
      {/* fondo rojo con luz central y humo */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 55% at 50% 45%, #F0202A 0%, #B80A12 45%, #5A0307 100%)" }} />
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: -300 + ((random(`s${i}`) * 1400 + f * (1 + i * 0.3)) % 1600), top: 900 + random(`sy${i}`) * 700, width: 900, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,220,220,0.22), rgba(255,220,220,0) 70%)", filter: "blur(30px)" }} />
      ))}
      {/* letras gigantes tenues al fondo */}
      <div style={{ position: "absolute", left: -60 - f * 0.6, top: 380, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 1100, color: "rgba(255,255,255,0.06)", lineHeight: 1, letterSpacing: -40 }}>30</div>
      {/* guías finas de plantilla */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[90, 990].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={1920 * ip(t, [0, 0.8], [0, 1])} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />)}
        {[330, 1560].map((y) => <line key={y} x1={0} y1={y} x2={1080 * ip(t, [0.1, 0.9], [0, 1])} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />)}
        {[[90, 330], [990, 330], [90, 1560], [990, 1560]].map(([x, y], i) => <path key={i} d={`M${x - 14} ${y} L${x + 14} ${y} M${x} ${y - 14} L${x} ${y + 14}`} stroke="#fff" strokeWidth={3} opacity={ip(t, [0.6, 0.9], [0, 1])} />)}
      </svg>
      {/* logo de esquina */}
      <div style={{ position: "absolute", left: 110, top: 360, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 2, opacity: ip(t, [0.5, 0.8], [0, 1]) }}>ZK</div>
      <div style={{ position: "absolute", right: 110, top: 366, textAlign: "right", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 24, color: "#fff", lineHeight: 1.2, opacity: ip(t, [0.5, 0.8], [0, 1]) }}>Mateo<br />26:15</div>
      {/* héroe 3D */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - coinIn) * 500}px)`, filter: `blur(${(1 - coinIn) * 12}px) drop-shadow(0 40px 60px rgba(60,0,0,0.6))` }}>
        <Coin3D size={860} top={560} spin={f / 16} tilt={0.22 + Math.sin(f / 25) * 0.1} />
      </div>
      {/* tipografía de pesos mezclados */}
      <div style={{ position: "absolute", left: 110, right: 110, top: 1320 }}>
        <Rise t={t} at={0.1}><div style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 58, color: "#fff", letterSpacing: 1 }}>¿Por cuánto vendió</div></Rise>
        <Rise t={t} at={1.05}><div style={{ fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 168, color: "#fff", lineHeight: 0.95, letterSpacing: -4, textShadow: "0 10px 30px rgba(80,0,0,0.5)" }}>JUDAS</div></Rise>
        <Rise t={t} at={1.5}><div style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 58, color: "#FFD2D2", letterSpacing: 6 }}>A JESÚS?</div></Rise>
      </div>
      {box > 0 ? (
        <div style={{ position: "absolute", left: 110, top: 1650, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: "#fff", padding: "6px 26px", clipPath: `inset(0 ${(1 - box) * 100}% 0 0)`, fontFamily: "Kit Poppins Black", fontWeight: 900, fontSize: 96, color: "#C80A14", lineHeight: 1 }}>30 MONEDAS</div>
          <div style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 40, color: "#fff", opacity: ip(t, [3.2, 3.5], [0, 1]) }}>de plata</div>
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(30,0,0,0.55) 100%)" }} />
      <Captions f={f} groups={groupWords(WORDS)} keys={KEYS} />
      <Audio src={staticFile("judas/mezcla.wav")} />
    </AbsoluteFill>
  );
};
