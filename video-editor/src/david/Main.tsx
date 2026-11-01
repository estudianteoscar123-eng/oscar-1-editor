import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import data from "../../public/david/words.json";
import { Captions, Dust, FPS, Figure, GodRays, Grain, S, Soldier, Vignette, Word, ease, groupWords, ip, pop } from "../kit/Kit";

// ZK · David y Goliat en primera persona. Un estímulo cada 0,7–1 s, sonido inmersivo (latido, pasos, silencio, impacto).
export const DAVID_TOTAL = S(31.4);
const RAW = (data as unknown as { chunks: { text: string; timestamp: [number, number] }[] }).chunks;
const WORDS: Word[] = RAW.map((c, i) => ({ w: i === 0 ? "Delante" : c.text.trim().replace("dios.", "Dios."), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
const GROUPS = groupWords(WORDS);
const KEYS = new Set(["gigante", "metros", "cinco", "piedras", "muchacho", "tiembla", "nadie", "espada", "armadura", "ríe", "tierra", "corazón", "corres", "piedra", "disparo", "silencio", "cae", "david", "tamaño", "dios"]);

// tiempo del video en segundos a partir del fotograma local de una escena
const useT = (t0: number) => t0 + useCurrentFrame() / FPS;

// ---------- piezas ----------
const Valley: React.FC<{ f: number; z?: number; y?: number; warm?: number; dark?: number }> = ({ f, z = 1, y = 0, warm = 0, dark = 0 }) => (
  <AbsoluteFill style={{ transform: `translateY(${y}px) scale(${z})`, transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", inset: -200, background: `linear-gradient(rgb(${40 + 60 * warm},${30 + 40 * warm},${60 - 10 * warm}), rgb(${190 + 50 * warm},${110 + 60 * warm},${70 + 30 * warm}) 55%, rgb(${240},${170 + 40 * warm},${110}) 72%)` }} />
    <div style={{ position: "absolute", left: 540 - 260, top: 900 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, #FFF2CC, #FFC46B 50%, rgba(255,196,107,0) 72%)" }} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M-200 1180 Q200 ${1020 + 6 * Math.sin(f / 40)} 540 1110 Q880 1000 1280 1150 L1280 1920 L-200 1920 Z`} fill="#6B3A3C" opacity={0.75} />
      <path d="M-200 1300 Q300 1180 700 1290 Q1000 1220 1280 1300 L1280 1920 L-200 1920 Z" fill="#3A1E26" />
      <path d="M-200 1460 Q540 1380 1280 1460 L1280 1920 L-200 1920 Z" fill="#1C0F14" />
    </svg>
    <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
  </AbsoluteFill>
);

// Goliat: gigante con casco, lanza y escudo
const Giant: React.FC<{ f: number; x: number; y: number; h: number; walk?: number; fall?: number; eyes?: number }> = ({ f, x, y, h, walk = 0, fall = 0, eyes = 1 }) => {
  const s = h / 520;
  const step = walk ? Math.sin(f / 5) * 4 * walk : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) rotate(${fall * 84}deg) translateY(${Math.abs(step)}px)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", width: 200 * s, height: 520 * s }}>
        <Figure f={f} x={100 * s} y={520 * s} h={h} rim="#FF9A4A" rimSide={1} cloth="#4A3A2A" hood={false} arm={12 + step} arm2={30} shadow={false} />
        {/* casco */}
        <svg width={200 * s} height={520 * s} viewBox="0 0 200 520" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M58 64 Q100 6 142 64 L146 82 L54 82 Z" fill="#2A2420" stroke="#FFB062" strokeWidth={2} />
          <path d="M100 6 L104 -40 L96 -40 Z" fill="#2A2420" />
          <circle cx={84} cy={78} r={5} fill="#FF4A2A" opacity={eyes} style={{ filter: "drop-shadow(0 0 8px #FF4A2A)" }} />
          <circle cx={116} cy={78} r={5} fill="#FF4A2A" opacity={eyes} style={{ filter: "drop-shadow(0 0 8px #FF4A2A)" }} />
          {/* lanza */}
          <rect x={168} y={-120} width={8} height={640} fill="#1A120E" transform="rotate(6 172 140)" />
          <path d="M172 -150 L184 -110 L160 -110 Z" fill="#C9CED6" transform="rotate(6 172 140)" />
          {/* escudo */}
          <ellipse cx={40} cy={250} rx={42} ry={70} fill="#2E241C" stroke="#FFB062" strokeWidth={3} />
        </svg>
      </div>
    </div>
  );
};

const Stone: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r * 0.8, width: r * 2, height: r * 1.6, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(circle at 35% 30%, #D9D4CC, #8D867C 55%, #4A453F)", boxShadow: "0 8px 18px rgba(0,0,0,0.5)", opacity: o }} />
);

// mano en primera persona (silueta cálida desde abajo)
const Hand: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 1 }) => (
  <svg width={520 * s} height={620 * s} viewBox="0 0 520 620" style={{ position: "absolute", left: x - 260 * s, top: y, overflow: "visible" }}>
    <g fill="#8A5A44" stroke="#2A1610" strokeWidth={3}>
      <path d="M150 620 L170 330 Q260 270 360 330 L380 620 Z" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={170 + k * 50} y={180 + (k === 0 || k === 3 ? 40 : 0) + (1 - open) * 120} width={44} height={180} rx={22} />
      ))}
      <rect x={100} y={300 + (1 - open) * 40} width={44} height={150} rx={22} transform={`rotate(${-35 + (1 - open) * 30} 122 420)`} />
    </g>
    <path d="M190 330 Q260 300 340 330" stroke="#B57A5E" strokeWidth={6} fill="none" opacity={0.6} />
  </svg>
);

const Shake: React.FC<{ a: number; f: number; children: React.ReactNode }> = ({ a, f, children }) => (
  <AbsoluteFill style={{ transform: `translate(${(random(`x${f}`) - 0.5) * a}px, ${(random(`y${f}`) - 0.5) * a}px)` }}>{children}</AbsoluteFill>
);

const Mark: React.FC<{ t: number; txt: string; top: number }> = ({ t, txt, top }) =>
  t < 0 ? null : (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 16, background: "rgba(8,10,16,0.85)", border: "3px solid #FF3B3B", transform: `scale(${pop(t)})`, boxShadow: t < 10 ? "0 0 40px rgba(255,59,59,0.7)" : "0 10px 30px rgba(0,0,0,0.5)" }}>
        <span style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 54, color: "#FF3B3B", lineHeight: 1 }}>✕</span>
        <span style={{ fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 46, color: "#fff" }}>{txt}</span>
      </div>
    </div>
  );

const BigT: React.FC<{ t: number; text: string; y: number; size: number; color?: string }> = ({ t, text, y, size, color = "#fff" }) =>
  t < 0 ? null : (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: size, color, letterSpacing: -3, wordSpacing: size * 0.25, whiteSpace: "pre", transform: `scale(${ip(t, [0, 5], [1.5, 1])})`, opacity: ip(t, [0, 3], [0, 1]), textShadow: `0 0 40px ${color === "#fff" ? "rgba(255,255,255,0.4)" : color}, 0 8px 30px rgba(0,0,0,0.8)` }}>
      {text}
    </div>
  );

// ---------- escenas ----------
// 1 · 0–2,6: el gigante, de los pies a la cabeza (tres saltos de cámara)
const E1: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(0);
  const stage = t < 0.9 ? 0 : t < 1.8 ? 1 : 2;
  const ty = [-1700, -900, 0][stage] + (f % 27) * 3;
  const z = [2.2, 1.9, 1.35][stage];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={1.15} />
      <AbsoluteFill style={{ transform: `translateY(${ty}px) scale(${z})`, transformOrigin: "50% 100%" }}>
        <Giant f={f} x={540} y={1900} h={1500} />
      </AbsoluteFill>
      {t >= 1.82 ? (
        <div style={{ position: "absolute", right: 90, top: 300, height: 1300, width: 6, background: "#FFD58A", transform: `scaleY(${ip(S(t) - S(1.82), [0, 10], [0, 1])})`, transformOrigin: "50% 100%", boxShadow: "0 0 18px #FFB54A" }}>
          <div style={{ position: "absolute", left: -110, top: -70, fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: 90, color: "#FFD58A", whiteSpace: "nowrap" }}>3 m</div>
        </div>
      ) : null}
      <AbsoluteFill style={{ background: `rgba(255,255,255,${[0.9, 1.8].reduce((o, c) => Math.max(o, t >= c ? ip(S(t) - S(c), [0, 4], [0.5, 0]) : 0), 0)})` }} />
    </AbsoluteFill>
  );
};
// 2 · 2,6–4,5: tu mano y cinco piedras
const E2: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(2.6);
  const shown = [3.6, 3.72, 3.84, 3.96, 4.08].filter((a) => t >= a).length;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={1.3} y={-120} dark={0.25} />
      <AbsoluteFill style={{ transform: `translateY(${ip(f, [0, 10], [200, 0])}px) scale(${ip(f, [0, 57], [1, 1.12])})` }}>
        <Hand x={540} y={980} s={1.6} open={1} />
        {[0, 1, 2, 3, 4].map((k) =>
          k < shown ? (
            <div key={k} style={{ transform: `scale(${pop(S(t) - S([3.6, 3.72, 3.84, 3.96, 4.08][k]))})` }}>
              <Stone x={330 + k * 105} y={1290 - (k % 2) * 40} r={44} />
            </div>
          ) : null,
        )}
      </AbsoluteFill>
      <BigT t={S(t) - S(3.6)} text={`${shown}`} y={520} size={240} color="#FFD58A" />
    </AbsoluteFill>
  );
};
// 3 · 4,5–5,95: tú, diminuto frente al gigante
const E3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={ip(f, [0, 44], [1.0, 1.08])} />
      <Giant f={f} x={700} y={1560} h={980} />
      <Figure f={f} x={330} y={1560} h={230} rim="#FFD08A" rimSide={1} cloth="#6B4A2A" hood={false} />
      <div style={{ position: "absolute", left: 330, top: 1590, transform: "translateX(-50%)", padding: "8px 18px", borderRadius: 10, background: "rgba(8,10,16,0.85)", fontFamily: "Kit Poppins", fontWeight: 600, fontSize: 34, color: "#FFD08A", opacity: ip(f, [6, 12], [0, 1]) }}>tú</div>
      <Dust f={f} n={30} />
    </AbsoluteFill>
  );
};
// 4 · 5,95–9,7: el ejército detrás tiembla y retrocede
const E4: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(5.95);
  const back = ip(S(t) - S(8.76), [0, 20], [0, 1]);
  const swing = ip(f, [0, 12], [-500, 0]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={t >= 8.1 && t < 8.7 ? 10 : 3} f={f}>
        <Valley f={f} z={1.1} warm={0.2} />
        <AbsoluteFill style={{ transform: `translateX(${swing}px) scale(${1 + 0.15 * back})` }}>
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 6 }, (_, k) => (
              <Soldier key={`${r}-${k}`} f={f + k * 7 + r * 13} x={110 + k * 175 + (r % 2) * 80} y={1320 + r * 150 + back * 40 * r} h={150 + r * 55} flip={k % 2 === 0} torch={(k + r) % 4 === 0} />
            )),
          )}
        </AbsoluteFill>
      </Shake>
      <BigT t={S(t) - S(8.76)} text="NADIE" y={760} size={190} color="#FF5A4A" />
    </AbsoluteFill>
  );
};
// 5 · 9,7–11,95: miras hacia abajo: sin espada, sin armadura
const E5: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(9.7);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={1.6} y={-500} dark={0.35} />
      <AbsoluteFill style={{ transform: `translateY(${ip(f, [0, 67], [0, -80])}px)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M240 1920 L300 1100 Q540 980 780 1100 L840 1920 Z" fill="#6B4A2A" />
          <path d="M300 1100 Q540 1180 780 1100" stroke="#3A2414" strokeWidth={14} fill="none" />
          <path d="M440 1240 L640 1240" stroke="#2A1810" strokeWidth={18} />
        </svg>
        <Hand x={250} y={1300} s={0.9} open={0.4} />
        <Hand x={830} y={1300} s={0.9} open={0.4} />
      </AbsoluteFill>
      <Mark t={S(t) - S(10.28)} txt="espada" top={500} />
      <Mark t={S(t) - S(11.28)} txt="armadura" top={640} />
    </AbsoluteFill>
  );
};
// 6 · 11,95–14,6: el gigante se ríe y echa a andar
const E6: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(11.95);
  const laugh = t >= 12.6 ? Math.abs(Math.sin(f / 2.2)) : 0;
  const walk = t >= 13.74 ? 1 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={1.3} y={-80} warm={0.3} />
      <AbsoluteFill style={{ transform: `scale(${ip(f, [0, 80], [1.0, 1.15])}) translateY(${laugh * 6}px)`, transformOrigin: "50% 40%" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M140 1920 L200 1180 Q540 1020 880 1180 L940 1920 Z" fill="#120C0A" />
          <ellipse cx={540} cy={820} rx={260} ry={320} fill="#140D0B" stroke="#FF9A4A" strokeWidth={4} />
          <path d="M270 700 Q540 380 810 700 L820 760 L260 760 Z" fill="#2A2420" stroke="#FFB062" strokeWidth={4} />
          <circle cx={450} cy={800} r={18} fill="#FF4A2A" style={{ filter: "drop-shadow(0 0 16px #FF4A2A)" }} />
          <circle cx={630} cy={800} r={18} fill="#FF4A2A" style={{ filter: "drop-shadow(0 0 16px #FF4A2A)" }} />
          <ellipse cx={540} cy={960} rx={90} ry={14 + laugh * 46} fill="#000" stroke="#FF9A4A" strokeWidth={3} />
        </svg>
      </AbsoluteFill>
      {walk ? <AbsoluteFill style={{ background: `rgba(0,0,0,${ip(S(t) - S(13.74), [0, 20], [0, 0.4])})` }} /> : null}
      {t >= 12.62 && t < 13.7 ? (
        <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center", fontFamily: "Kit Poppins Black", fontStyle: "italic", fontWeight: 900, fontSize: 120, color: "#FF9A4A", transform: `rotate(-4deg) scale(${pop(S(t) - S(12.62))})` }}>JA JA JA</div>
      ) : null}
    </AbsoluteFill>
  );
};
// 7 · 14,6–16,35: cada paso hace temblar la tierra
const STEPS = [14.66, 15.16, 15.66, 16.1];
const E7: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(14.6);
  const k = STEPS.filter((s) => t >= s).length;
  const since = k ? S(t) - S(STEPS[k - 1]) : 99;
  const shake = since < 8 ? 34 * (1 - since / 8) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={shake} f={f}>
        <Valley f={f} z={1.05 + k * 0.08} />
        <Giant f={f} x={540} y={1600 + k * 60} h={700 + k * 260} walk={1} />
        {STEPS.slice(0, k).map((s, i) => {
          const tt = S(t) - S(s);
          return <div key={i} style={{ position: "absolute", left: 540 - 300 - tt * 18, top: 1560 + k * 40, width: 600 + tt * 36, height: 120 + tt * 6, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(210,170,130,0.55), rgba(210,170,130,0) 70%)", opacity: ip(tt, [0, 30], [1, 0]) }} />;
        })}
      </Shake>
    </AbsoluteFill>
  );
};
// 8 · 16,35–18,7: tu corazón (latido que acelera)
const BEATS = [16.42, 16.98, 17.46, 17.88, 18.24, 18.56];
const E8: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(16.35);
  const since = Math.min(...BEATS.map((b) => (t >= b ? S(t) - S(b) : 99)));
  const pulse = since < 8 ? 1 - since / 8 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 + pulse * 0.05})` }}>
        <Valley f={f} z={1.25} dark={0.25} />
        <Giant f={f} x={540} y={2050} h={1900} eyes={1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 40%, rgba(160,0,0,${0.35 + 0.45 * pulse}) 100%)` }} />
      <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${1 + pulse * 0.25})`, fontSize: 150, filter: "drop-shadow(0 0 30px #FF2A2A)" }}>
        <svg width={170} height={150} viewBox="0 0 70 64">
          <path d="M35 60 C10 42 2 30 2 18 C2 8 10 2 19 2 C26 2 31 6 35 12 C39 6 44 2 51 2 C60 2 68 8 68 18 C68 30 60 42 35 60 Z" fill="#E8202A" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
// 9 · 18,7–20,35: corres hacia él
const E9: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 2.4) * 22;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translateY(${bob}px) rotate(${Math.sin(f / 4.8) * 2}deg) scale(${ip(f, [0, 50], [1.0, 1.45])})` }}>
        <Valley f={f} z={1.1} warm={0.4} />
        <Giant f={f} x={540} y={1500} h={ip(f, [0, 50], [700, 1100])} walk={1} />
      </AbsoluteFill>
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const r = ((f * 40 + i * 70) % 900) + 200;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r, top: 960 + Math.sin(a) * r, width: 6, height: 90, background: "rgba(255,240,210,0.45)", transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};
// 10 · 20,35–22,4: una piedra (honda girando) y el disparo
const E10: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(20.35);
  const shot = S(t) - S(21.5);
  const spin = f * 34;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Valley f={f} z={1.4} y={-200} warm={0.4} dark={0.2} />
      {shot < 0 ? (
        <AbsoluteFill style={{ transform: `scale(${ip(f, [0, 34], [1.1, 1.25])})` }}>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <g transform={`rotate(${spin} 540 1100)`}>
              <line x1={540} y1={1100} x2={540} y2={700} stroke="#C9A27A" strokeWidth={6} />
              <ellipse cx={540} cy={690} rx={36} ry={24} fill="#6B4A2A" />
            </g>
            {Array.from({ length: 10 }, (_, k) => (
              <path key={k} d={`M540 1100 L${540 + 400 * Math.cos(((spin - k * 14) * Math.PI) / 180 - Math.PI / 2)} ${1100 + 400 * Math.sin(((spin - k * 14) * Math.PI) / 180 - Math.PI / 2)}`} stroke="rgba(255,230,190,0.2)" strokeWidth={10 - k} />
            ))}
          </svg>
          <Hand x={540} y={1080} s={0.8} open={0.2} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Giant f={f} x={540} y={1700} h={1300} />
          <div style={{ position: "absolute", left: 540, top: ip(shot, [0, 20], [1700, 560]), transform: `translate(-50%,-50%) scale(${ip(shot, [0, 20], [3, 0.6])})` }}>
            <Stone x={0} y={0} r={40} />
          </div>
          <div style={{ position: "absolute", left: 528, top: ip(shot, [0, 20], [1720, 600]), width: 24, height: ip(shot, [0, 8], [0, 900]), background: "linear-gradient(rgba(255,240,200,0.8), rgba(255,240,200,0))" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
// 11 · 22,4–23,85: silencio (todo se congela)
const E11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", filter: `grayscale(${ip(f, [0, 8], [0, 1])}) brightness(${ip(f, [0, 30], [1, 0.6])})` }}>
      <AbsoluteFill style={{ transform: `scale(${1.6 + f * 0.004})`, transformOrigin: "50% 35%" }}>
        <Valley f={0} z={1.2} />
        <Giant f={0} x={540} y={1900} h={1500} eyes={0.3} />
        <div style={{ position: "absolute", left: 540, top: 600, transform: "translate(-50%,-50%) scale(0.6)" }}><Stone x={0} y={0} r={40} /></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// 12 · 23,85–26,05: el gigante cae
const E12: React.FC = () => {
  const f = useCurrentFrame();
  const fall = ease(ip(f, [0, 22], [0, 1]));
  const shake = f < 30 ? 50 * (1 - f / 30) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shake a={shake} f={f}>
        <Valley f={f} z={1.05} warm={ip(f, [20, 60], [0, 1])} />
        <Giant f={f} x={620} y={1600} h={1000} fall={fall} eyes={1 - fall} />
        {f > 20
          ? Array.from({ length: 40 }, (_, i) => {
              const a = random(`d${i}`) * Math.PI;
              const v = 6 + random(`v${i}`) * 16;
              const tt = f - 20;
              return <div key={i} style={{ position: "absolute", left: 900 + Math.cos(a) * v * tt * (random(`s${i}`) > 0.5 ? 1 : -1), top: 1560 - Math.sin(a) * v * tt + 0.4 * tt * tt, width: 30 + random(`w${i}`) * 50, height: 30 + random(`w${i}`) * 50, borderRadius: "50%", background: "rgba(200,160,120,0.5)", filter: "blur(6px)", opacity: ip(tt, [0, 50], [1, 0]) }} />;
            })
          : null}
        <Figure f={f} x={240} y={1600} h={260} rim="#FFE3B0" rimSide={1} cloth="#6B4A2A" hood={false} glow={ip(f, [30, 60], [0, 0.8])} arm={ip(f, [30, 45], [0, 150])} />
      </Shake>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${ip(f, [0, 3, 12], [1, 0.9, 0])})` }} />
    </AbsoluteFill>
  );
};
// 13 · 26,05–31,4: no importa el tamaño de tu gigante… importa el tamaño de tu Dios
const E13: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(26.05);
  const up = ease(ip(S(t) - S(28.3), [0, 40], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translateY(${up * 900}px) scale(${1 + up * 0.1})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -1100, height: 1300, background: "linear-gradient(#FFF6DA, #FFD58A 40%, rgba(255,213,138,0))" }} />
        <Valley f={f} z={1.0} warm={1} />
        <GodRays f={f} x={540} y={-200} color="#FFF0C8" o={0.2 + 0.4 * up} n={13} spread={120} />
        <Giant f={f} x={760} y={1600} h={700} fall={1} eyes={0} />
        <Figure f={f} x={330} y={1600} h={300} rim="#FFE3B0" rimSide={1} cloth="#6B4A2A" hood={false} glow={0.8} />
      </AbsoluteFill>
      <BigT t={S(t) - S(28.36)} text="TU DIOS" y={760} size={190} color="#FFD58A" />
      <Dust f={f} n={50} color="255,230,180" />
    </AbsoluteFill>
  );
};

const CUTS: [number, React.FC][] = [[0, E1], [2.6, E2], [4.5, E3], [5.95, E4], [9.7, E5], [11.95, E6], [14.6, E7], [16.35, E8], [18.7, E9], [20.35, E10], [22.4, E11], [23.85, E12], [26.05, E13]];
const SFX: [number, string, number][] = [
  ...STEPS.map((s) => [s, "david/paso", 0.55] as [number, string, number]),
  ...BEATS.map((s) => [s, "david/latido", 0.6] as [number, string, number]),
  [21.4, "sfx/whoosh", 0.3], [23.85, "david/caida", 0.75], [23.85, "sfx/impact", 0.4], [28.25, "sfx/shimmer", 0.3], [0.0, "sfx/whoosh", 0.15],
];
const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t))} durationInFrames={75}>
    <Audio src={staticFile(`${name}.wav`)} volume={v} />
  </Sequence>
);

export const David: React.FC = () => {
  const f = useCurrentFrame();
  const cutFlash = CUTS.slice(1).reduce((o, [c]) => (f >= S(c) ? Math.max(o, ip(f - S(c), [0, 4], [0.28, 0])) : o), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.1) saturate(1.15)" }}>
        {CUTS.map(([c, C], i) => {
          const end = CUTS[i + 1]?.[0] ?? 31.4;
          return (
            <Sequence key={i} from={S(c)} durationInFrames={S(end) - S(c)}>
              <AbsoluteFill style={{ transform: `scale(${ip(f - S(c), [0, 6], [1.08, 1])})` }}>
                <C />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${cutFlash})`, pointerEvents: "none" }} />
      <Grain f={f} />
      <Vignette s={0.75} />
      <Captions f={f} groups={GROUPS} keys={KEYS} />
      <Audio src={staticFile("david/mezcla.wav")} />
      {SFX.map(([t, n, v], i) => <Sfx key={i} t={t} name={n} v={v} />)}
    </AbsoluteFill>
  );
};
