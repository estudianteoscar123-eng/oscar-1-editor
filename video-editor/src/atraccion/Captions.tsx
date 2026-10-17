import React from "react";
import { BACK, DISPLAY, INK, INOUT, SANS, W, alpha, ip, mix, wf } from "./theme";
import { GROUPS, Grp, SCENE_PAL, WIN } from "./timeline";

const clean = (t: string) => t.replace(/[.,;:]+$/g, "");

// Palabra de contexto: espera en gris y se enciende cuando se pronuncia
const Ctx: React.FC<{ i: number; f: number; s: number }> = ({ i, f, s }) => {
  const a = wf(i);
  const from = Math.max(s, a - 5);
  if (!W[i].text) return null;
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: "0.26em",
        opacity: f < from ? 0 : ip(f, [from, from + 3], [0, 0.34]) + ip(f, [a, a + 3], [0, 0.66]),
        filter: `blur(${ip(f, [from, from + 4], [6, 0])}px)`,
        translate: `0px ${ip(f, [from, from + 5], [10, 0])}px`,
      }}
    >
      {clean(W[i].text)}
    </span>
  );
};

// Palabra clave: entra con impulso, degradado del tono y un brillo que la recorre una vez
const Key: React.FC<{ i: number; f: number; tone: string; size: number; upper: boolean }> = ({ i, f, tone, size, upper }) => {
  const a = wf(i);
  if (!W[i].text) return null;
  const sweep = ip(f, [a + 4, a + 22], [-30, 130], INOUT);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: DISPLAY,
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "-0.02em",
        textTransform: upper ? "uppercase" : "none",
        padding: "0.06em 0.1em 0.1em",
        margin: "-0.06em -0.1em -0.1em",
        marginRight: "0.3em",
        backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%), linear-gradient(180deg, #FFFFFF 0%, ${mix("#ffffff", tone, 0.45)} 38%, ${tone} 100%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        opacity: ip(f, [a - 1, a + 3], [0, 1]),
        scale: ip(f, [a - 1, a + 8], [1.22, 1], BACK),
        translate: `0px ${ip(f, [a - 1, a + 8], [18, 0])}px`,
        filter: `blur(${ip(f, [a - 1, a + 6], [12, 0])}px) drop-shadow(0 0 22px ${alpha(tone, 0.5)}) drop-shadow(0 6px 16px rgba(0,0,0,0.55))`,
      }}
    >
      {clean(W[i].text)}
    </span>
  );
};

// Salida con glitch (franjas desplazadas + desenfoque) justo antes de un corte
const Glitch: React.FC<{ g: number; children: React.ReactNode }> = ({ g, children }) => {
  if (g <= 0.001) return <>{children}</>;
  return (
    <div style={{ position: "relative" }}>
      {[0, 1, 2, 3, 4].map((k) => {
        const dx = Math.sin(k * 12.9898 + g * 41) * g * 70;
        return (
          <div
            key={k}
            style={{
              position: k === 0 ? "relative" : "absolute",
              inset: k === 0 ? undefined : 0,
              clipPath: `inset(${k * 20}% 0 ${100 - (k + 1) * 20}% 0)`,
              translate: `${dx}px 0px`,
              opacity: 1 - g,
              filter: `blur(${g * 5}px)`,
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
};

const Group: React.FC<{ g: Grp; k: number; f: number }> = ({ g, k, f }) => {
  const w = WIN[k];
  if (f < w.s || f >= w.e) return null;
  const isA = w.seg.kind === "A";
  const tone = isA ? g.tone ?? INK : mix(SCENE_PAL[w.seg.scene!].l, "#ffffff", 0.12);
  const idx = Array.from({ length: g.b - g.a + 1 }, (_, n) => g.a + n);
  const ctx = idx.filter((i) => !g.key.includes(i));
  const keyLen = g.key.map((i) => W[i].text).join(" ").length;
  const ks = Math.max(78, Math.min(isA ? 128 : 140, 930 / (keyLen * 0.66)));
  const cs = isA ? 46 : 52;
  const align = g.align ?? "center";
  const exitG = w.cut ? ip(f, [w.e - 5, w.e], [0, 1]) : 0;
  const fade = w.cut ? 1 : ip(f, [w.e - 3, w.e], [1, 0], INOUT);
  const keyFirst = g.key[0] === g.a;

  const ctxLine = (
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: cs, lineHeight: 1.16, letterSpacing: -0.8, color: INK, textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>
      {ctx.map((i) => (
        <Ctx key={i} i={i} f={f} s={w.s} />
      ))}
    </div>
  );
  const keyLine = (
    <div style={{ whiteSpace: "nowrap" }}>
      {g.key.map((i) => (
        <Key key={i} i={i} f={f} tone={tone} size={ks} upper />
      ))}
    </div>
  );
  const inline = (
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: cs + 4, lineHeight: 1.25, letterSpacing: -0.8, color: INK, textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>
      {idx.map((i) => (g.key.includes(i) ? <Key key={i} i={i} f={f} tone={tone} size={Math.round((cs + 4) * 1.5)} upper={false} /> : <Ctx key={i} i={i} f={f} s={w.s} />))}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: isA ? 1392 : 330,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "center",
        textAlign: align,
        gap: 6,
        opacity: fade,
        filter: fade < 1 ? `blur(${(1 - fade) * 8}px)` : undefined,
      }}
    >
      <Glitch g={exitG}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center", gap: 4 }}>
          {g.mode === "inline" ? inline : keyFirst ? [<React.Fragment key="k">{keyLine}</React.Fragment>, <React.Fragment key="c">{ctxLine}</React.Fragment>] : [<React.Fragment key="c">{ctxLine}</React.Fragment>, <React.Fragment key="k">{keyLine}</React.Fragment>]}
        </div>
      </Glitch>
    </div>
  );
};

export const Captions: React.FC<{ f: number }> = ({ f }) => (
  <>
    {GROUPS.map((g, k) => (
      <Group key={k} g={g} k={k} f={f} />
    ))}
  </>
);
