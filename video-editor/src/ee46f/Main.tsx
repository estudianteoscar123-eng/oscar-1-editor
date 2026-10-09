import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./Captions";
import { SCENES } from "./Scenes";
import { BACK, BASE, DISPLAY, INK, INOUT, SANS, SERIF, TONE, alpha, ip, mix, wf } from "./theme";
import { CHAPTERS, GROUPS, SCENE_PAL, SEGS, Seg, WIN, segAt } from "./timeline";

const OUTSEG = SEGS[SEGS.length - 1];

// A-roll: la franja útil de la cámara en una ventana con bordes fundidos; punch-in por grupo
const ARoll: React.FC<{ f: number }> = ({ f }) => {
  const seg = segAt(f);
  let punch = 1;
  GROUPS.forEach((g, k) => {
    if (g.punch !== undefined && WIN[k].s <= f) punch = g.punch;
  });
  const push = seg.kind === "A" ? interpolate(f, [seg.from, seg.to], [1, 1.045]) : 1;
  const t = f - seg.from;
  const enter = seg.kind === "A" && seg.from > 0;
  const blurIn = enter ? ip(t, [0, 8], [12, 0]) : 0;
  const scaleIn = enter ? ip(t, [0, 10], [1.06, 1]) : 1;
  const out = seg.kind === "A" ? ip(f, [seg.to - 5, seg.to], [0, 1], INOUT) : 0;
  const mask = "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 9%, #000 70%, rgba(0,0,0,0) 100%)";
  return (
    <div style={{ position: "absolute", left: 0, top: 250, width: 1080, height: 1200, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>
      <div
        style={{
          position: "absolute",
          left: -5,
          top: 0,
          width: 1396,
          height: 1200,
          transformOrigin: "545px 500px",
          scale: punch * push * scaleIn * (1 + out * 0.05),
          filter: blurIn + out * 7 > 0.05 ? `blur(${blurIn + out * 7}px)` : undefined,
        }}
      >
        <Video src={staticFile("ee46/aroll.mp4")} muted style={{ width: 1396, height: 1200 }} />
      </div>
    </div>
  );
};

const SceneWrap: React.FC<{ s: Seg }> = ({ s }) => {
  const f = useCurrentFrame();
  const C = SCENES[s.scene!];
  return <C f={f} dur={s.to - s.from} from={s.from} />;
};

const accentAt = (seg: Seg) => (seg.kind === "B" ? SCENE_PAL[seg.scene!].l : TONE.ice);

// Tarjeta de cristal con el título de la serie y el contador de la lista
const Pill: React.FC<{ f: number }> = ({ f }) => {
  const starts = CHAPTERS.map((w) => (w === 0 ? 0 : wf(w) - 2));
  const ch = starts.filter((s) => s <= f).length;
  const cs = starts[ch - 1];
  const roll = ip(f, [cs, cs + 10], [1, 0], BACK);
  const vis = ip(f, [0, 8], [0, 1]) * ip(f, [OUTSEG.from - 6, OUTSEG.from], [1, 0]);
  const tone = accentAt(segAt(f));
  return (
    <div style={{ position: "absolute", top: 104, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: vis, translate: `0px ${ip(f, [0, 10], [-20, 0])}px` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          height: 76,
          padding: "0 32px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: INK, letterSpacing: -0.4 }}>Sé un</span>
        <span style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 900, fontSize: 32, color: INK, letterSpacing: -0.5, marginLeft: -8 }}>HOMBRE 10/10</span>
        <span style={{ width: 1, height: 32, background: "rgba(255,255,255,0.25)" }} />
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ display: "inline-block", height: 44, overflow: "hidden" }}>
            <span style={{ display: "block", fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 900, fontSize: 36, lineHeight: "44px", color: tone, translate: `0px ${roll * 44}px` }}>
              {String(ch).padStart(2, "0")}
            </span>
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "rgba(244,242,238,0.5)" }}>/09</span>
        </span>
      </div>
    </div>
  );
};

// Destello de luz en cada corte, del color de la escena que entra
const Flash: React.FC<{ f: number }> = ({ f }) => {
  for (let k = 1; k < SEGS.length - 1; k++) {
    const s = SEGS[k];
    const T = s.from;
    if (f < T - 3 || f > T + 10) continue;
    const prev = SEGS[k - 1];
    const color = s.kind === "B" ? SCENE_PAL[s.scene!].l : prev.kind === "B" ? SCENE_PAL[prev.scene!].l : "#ffffff";
    const peak = s.kind === "B" ? (prev.kind === "B" ? 0.6 : 0.78) : 0.5;
    const o = f < T ? ip(f, [T - 3, T], [0, peak], INOUT) : ip(f, [T, T + 10], [peak, 0], INOUT);
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 65% at 50% 45%, ${mix(color, "#ffffff", 0.55)}, ${alpha(color, 0.65)} 55%, ${alpha(color, 0.3)} 100%)`,
          opacity: o,
          mixBlendMode: "screen",
        }}
      />
    );
  }
  return null;
};

// Cierre: monograma que se dibuja con trazo y luego se rellena
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const C = 2 * Math.PI * 170;
  const ring = ip(f, [2, 22], [0, 1], INOUT);
  const draw = ip(f, [6, 28], [0, 1], INOUT);
  const fill = ip(f, [22, 34], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#050506", opacity: ip(f, [0, 6], [0, 1]) }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 30% at 50% 47%, ${alpha("#CFE4EC", 0.08)}, rgba(0,0,0,0) 100%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(540 880)" style={{ filter: `drop-shadow(0 0 ${18 * fill}px rgba(207,228,236,0.35))` }}>
          <circle r={170} fill="none" stroke={INK} strokeWidth={5} strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90)" strokeLinecap="round" />
          <text
            y={78}
            textAnchor="middle"
            fontFamily={SERIF}
            fontStyle="italic"
            fontSize={240}
            fill={INK}
            fillOpacity={fill}
            stroke={INK}
            strokeWidth={2.5}
            strokeDasharray={1600}
            strokeDashoffset={1600 * (1 - draw)}
          >
            SL
          </text>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: 10,
          color: INK,
          opacity: ip(f, [18, 28], [0, 1]),
          filter: `blur(${ip(f, [18, 28], [8, 0])}px)`,
        }}
      >
        SÍGUEME PARA MÁS
      </div>
      <div style={{ position: "absolute", top: 1166, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: "rgba(244,242,238,0.5)", opacity: ip(f, [24, 34], [0, 1]) }}>
        @sinlimiteslife
      </div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; v: number }> = ({ at, src, v }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={v} />
  </Sequence>
);

export const EE46F: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = SEGS.slice(1).map((s) => s.from);
  const keys = GROUPS.map((g) => wf(g.key[0]));
  const stamps = [wf(91), wf(95), wf(99), wf(100) + 4];
  const sweep = wf(116);
  return (
    <AbsoluteFill style={{ background: BASE, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 45% at 50% 32%, #17181C, rgba(7,8,11,0) 75%)" }} />
      <ARoll f={f} />
      {SEGS.map((s, k) =>
        s.kind === "B" ? (
          <Sequence key={k} from={s.from} durationInFrames={s.to - s.from}>
            <SceneWrap s={s} />
          </Sequence>
        ) : null,
      )}
      <Captions f={f} />
      <Pill f={f} />
      <div style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: "rgba(244,242,238,0.38)", opacity: ip(f, [OUTSEG.from - 6, OUTSEG.from], [1, 0]) }}>
        @sinlimiteslife
      </div>
      <Flash f={f} />
      <Sequence from={OUTSEG.from}>
        <Outro />
      </Sequence>

      <Audio src={staticFile("ee46/voz.wav")} />
      {cuts.map((c, k) => (
        <Sfx key={`w${k}`} at={c - 8} src="whoosh" v={0.2} />
      ))}
      {keys.map((c, k) => (
        <Sfx key={`p${k}`} at={c - 1} src="pop" v={0.09} />
      ))}
      {stamps.map((c, k) => (
        <Sfx key={`s${k}`} at={c} src="impact" v={0.16} />
      ))}
      {Array.from({ length: 9 }, (_, k) => (
        <Sfx key={`t${k}`} at={sweep + k * 3} src="tick" v={0.07} />
      ))}
      <Sfx at={OUTSEG.from} src="shimmer" v={0.22} />
    </AbsoluteFill>
  );
};
